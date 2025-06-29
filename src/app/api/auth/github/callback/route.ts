import { supabaseAdmin } from '@/shared/libs/supabase';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * GitHub OAuth 콜백 엔드포인트
 * GET /api/auth/github/callback
 */
export async function GET(request: NextRequest) {
	try {
		console.log('GitHub callback - Environment check:', {
			NEXTAUTH_URL: process.env.NEXTAUTH_URL,
			NODE_ENV: process.env.NODE_ENV,
			GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ? 'set' : 'not set',
			GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ? 'set' : 'not set'
		});

		const { searchParams } = new URL(request.url);
		const code = searchParams.get('code');
		const error = searchParams.get('error');

		if (error) {
			return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=access_denied`);
		}

		if (!code) {
			return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=missing_code`);
		}

		// GitHub에서 액세스 토큰 요청
		const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				client_id: process.env.GITHUB_CLIENT_ID,
				client_secret: process.env.GITHUB_CLIENT_SECRET,
				code,
			}),
		});

		const tokenData = await tokenResponse.json();

		if (tokenData.error) {
			return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=token_exchange_failed`);
		}

		const accessToken = tokenData.access_token;

		// GitHub API로 사용자 정보 가져오기
		const userResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/vnd.github+json',
			},
		});

		const userData = await userResponse.json();

		if (!userResponse.ok) {
			return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=user_fetch_failed`);
		}

		// Supabase에 사용자 정보 저장/업데이트 (service role 사용)
		const { data: user, error: upsertError } = await supabaseAdmin
			.from('users')
			.upsert({
				github_id: userData.id,
				username: userData.login,
				avatar_url: userData.avatar_url,
				access_token: accessToken, // encrypted token storage
				updated_at: new Date().toISOString(),
			}, {
				onConflict: 'github_id',
				ignoreDuplicates: false
			})
			.select()
			.single();

		if (upsertError) {
			console.error('사용자 정보 저장 오류:', upsertError);
			return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=user_save_failed`);
		}

		// HTTP-only 쿠키에 사용자 ID 저장
		const cookieStore = await cookies();
		console.log('GitHub callback - Setting cookie for user:', user.id, user.username);
		cookieStore.set('user_id', user.id, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 30, // 30일
			path: '/', // 명시적으로 path 설정
		});

		console.log('GitHub callback - Cookie set, redirecting to dashboard');
		// 대시보드로 리다이렉트
		return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard`);
	} catch (error) {
		console.error('GitHub OAuth 콜백 오류:', error);
		return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=callback_error`);
	}
}
