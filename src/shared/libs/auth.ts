import { cookies } from 'next/headers';
import { supabaseAdmin } from './supabase';
import { NextRequest, NextResponse } from 'next/server';

export interface User {
	id: string;
	username: string;
	avatar_url: string;
	github_id: string;
	access_token?: string;
	created_at: string;
	updated_at: string;
}

/**
 * 서버 사이드에서 사용자 인증 상태를 확인하는 유틸리티
 */
export async function getCurrentUser(): Promise<User | null> {
	try {
		const cookieStore = await cookies();
		const userIdCookie = cookieStore.get('user_id');
		const userId = userIdCookie?.value;

		console.log('getCurrentUser - cookie object:', userIdCookie);
		console.log('getCurrentUser - userId from cookie:', userId);
		console.log('getCurrentUser - all cookies:', [...cookieStore.getAll()]);

		if (!userId) {
			console.log('getCurrentUser - No userId in cookie');
			return null;
		}
		
		const { data: user, error } = await supabaseAdmin
			.from('users')
			.select('id, username, avatar_url, github_id, created_at, updated_at')
			.eq('id', userId)
			.single();

		console.log('getCurrentUser - supabase query result:', { user, error });
		
		if (error || !user) {
			console.log('getCurrentUser - No user found or error:', error);
			return null;
		}

		console.log('getCurrentUser - User found:', user.username);
		return user;
	} catch (error) {
		console.error('getCurrentUser - 사용자 인증 확인 오류:', error);
		return null;
	}
}

/**
 * 사용자 인증 상태를 확인하고 토큰까지 가져오는 함수 (관리자 권한 필요)
 */
export async function getCurrentUserWithToken(): Promise<User | null> {
	try {
		const cookieStore = await cookies();
		const userId = cookieStore.get('user_id')?.value;

		if (!userId) {
			return null;
		}

		const { data: user, error } = await supabaseAdmin
			.from('users')
			.select('*')
			.eq('id', userId)
			.single();

		if (error || !user) {
			return null;
		}

		return user;
	} catch (error) {

		console.error('사용자 인증 확인 오류:', error);
		return null;
	}
}

/**
 * 인증이 필요한 API 라우트에서 사용할 인증 체크 함수
 */
export async function requireAuth(): Promise<User> {
	console.log('requireAuth - Starting authentication check');
	const user = await getCurrentUser();
	
	console.log('requireAuth - getCurrentUser result:', user ? `user found: ${user.username}` : 'no user');
	
	if (!user) {
		console.log('requireAuth - No user found, throwing AuthError');
		throw new AuthError('Authentication required', 401);
	}
	
	console.log('requireAuth - Authentication successful');
	return user;
}

/**
 * 토큰이 필요한 API 라우트에서 사용할 인증 체크 함수
 */
export async function requireAuthWithToken(): Promise<User> {
	const user = await getCurrentUserWithToken();
	
	if (!user) {
		throw new AuthError('Authentication required', 401);
	}
	
	if (!user.access_token) {
		throw new AuthError('GitHub access token required', 401);
	}
	
	return user;
}

/**
 * API 라우트에서 인증을 검증하는 미들웨어 함수
 */
export function withAuth<T extends any[]>(
	handler: (user: User, ...args: T) => Promise<NextResponse>
) {
	return async (...args: T): Promise<NextResponse> => {
		try {
			console.log('withAuth - Starting authentication check');
			const user = await requireAuth();
			console.log('withAuth - Authentication successful for user:', user.username);
			return await handler(user, ...args);
		} catch (error) {
			console.error('withAuth - Authentication failed:', error);
			if (error instanceof AuthError) {
				return NextResponse.json(
					{ error: error.message },
					{ status: error.statusCode }
				);
			}
			console.error('withAuth - Unexpected error:', error);
			return NextResponse.json(
				{ error: 'Internal server error' },
				{ status: 500 }
			);
		}
	};
}

/**
 * 선택적 인증을 지원하는 미들웨어 함수 (로그인하지 않아도 접근 가능)
 */
export function withOptionalAuth<T extends any[]>(
	handler: (user: User | null, ...args: T) => Promise<NextResponse>
) {
	return async (...args: T): Promise<NextResponse> => {
		try {
			const user = await getCurrentUser();
			return await handler(user, ...args);
		} catch (error) {
			console.error('Optional authentication middleware error:', error);
			return NextResponse.json(
				{ error: 'Internal server error' },
				{ status: 500 }
			);
		}
	};
}

/**
 * 소유자 권한을 확인하는 미들웨어 함수
 * @param getUserIdFromParams - URL 파라미터에서 대상 사용자 ID를 추출하는 함수
 */
export function withOwnerAuth<T extends any[]>(
	getUserIdFromParams: (...args: T) => Promise<string>,
	handler: (user: User, isOwner: boolean, ...args: T) => Promise<NextResponse>
) {
	return async (...args: T): Promise<NextResponse> => {
		try {
			const user = await requireAuth();
			const targetUserId = await getUserIdFromParams(...args);
			const isOwner = user.id === targetUserId;
			
			return await handler(user, isOwner, ...args);
		} catch (error) {
			if (error instanceof AuthError) {
				return NextResponse.json(
					{ error: error.message },
					{ status: error.statusCode }
				);
			}
			console.error('Owner authentication middleware error:', error);
			return NextResponse.json(
				{ error: 'Internal server error' },
				{ status: 500 }
			);
		}
	};
}

/**
 * 토큰이 필요한 API 라우트에서 인증을 검증하는 미들웨어 함수
 */
export function withAuthToken<T extends any[]>(
	handler: (user: User, ...args: T) => Promise<NextResponse>
) {
	return async (...args: T): Promise<NextResponse> => {
		try {
			const user = await requireAuthWithToken();
			return await handler(user, ...args);
		} catch (error) {
			if (error instanceof AuthError) {
				return NextResponse.json(
					{ error: error.message },
					{ status: error.statusCode }
				);
			}
			console.error('Authentication middleware error:', error);
			return NextResponse.json(
				{ error: 'Internal server error' },
				{ status: 500 }
			);
		}
	};
}

/**
 * 로그인 여부를 확인하고 리다이렉트하는 미들웨어
 */
export async function checkAuthRedirect(request: NextRequest): Promise<NextResponse | null> {
	const user = await getCurrentUser();
	const { pathname } = request.nextUrl;

	// 로그인이 필요한 경로들 (본인 대시보드만)
	const protectedPaths = ['/dashboard'];
	
	// 로그인된 사용자가 접근하면 안 되는 경로들
	const authPaths = ['/login'];

	// `/dashboard/[username]` 패턴은 공개 viewer 대시보드이므로 보호하지 않음
	const isDashboardWithUsername = /^\/[^\/]+\/dashboard\/[^\/]+$/.test(pathname);
	const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path)) && !isDashboardWithUsername;
	const isAuthPath = authPaths.some(path => pathname.startsWith(path));

	if (isProtectedPath && !user) {
		// 보호된 경로인데 로그인하지 않은 경우 로그인 페이지로 리다이렉트
		const url = request.nextUrl.clone();
		url.pathname = '/login';
		url.searchParams.set('callbackUrl', pathname);
		return NextResponse.redirect(url);
	}

	if (isAuthPath && user) {
		// 로그인 페이지인데 이미 로그인한 경우 대시보드로 리다이렉트
		const url = request.nextUrl.clone();
		url.pathname = '/dashboard';
		return NextResponse.redirect(url);
	}

	return null;
}

/**
 * 사용자 정의 인증 에러 클래스
 */
export class AuthError extends Error {
	constructor(
		message: string,
		public statusCode: number = 401
	) {
		super(message);
		this.name = 'AuthError';
	}
}

/**
 * 쿠키에서 사용자 ID를 가져오는 유틸리티 함수
 */
export async function getUserIdFromCookies(): Promise<string | null> {
	try {
		const cookieStore = await cookies();
		return cookieStore.get('user_id')?.value || null;
	} catch (error) {
		console.error('쿠키에서 사용자 ID 가져오기 오류:', error);
		return null;
	}
}

/**
 * 로그아웃 처리 함수
 */
export async function logout(): Promise<void> {
	try {
		const cookieStore = await cookies();
		cookieStore.delete('user_id');
		cookieStore.delete('session_id');
	} catch (error) {
		console.error('로그아웃 처리 오류:', error);
	}
}