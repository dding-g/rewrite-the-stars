import { cookies } from 'next/headers';
import { supabase } from '@/shared/libs/supabase';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 디버깅용 인증 상태 확인 엔드포인트
 * GET /api/debug/auth
 */
export async function GET(request: NextRequest) {
	try {
		const cookieStore = await cookies();
		const userId = cookieStore.get('user_id')?.value;
		
		console.log('Debug auth - userId from cookie:', userId);
		
		if (!userId) {
			return NextResponse.json({
				status: 'no_cookie',
				message: 'No user_id cookie found',
				userId: null,
				user: null
			});
		}

		// 사용자 정보 조회
		const { data: user, error } = await supabase
			.from('users')
			.select('id, username, avatar_url, github_id, created_at, updated_at')
			.eq('id', userId)
			.single();

		console.log('Debug auth - supabase query result:', { user, error });

		if (error) {
			return NextResponse.json({
				status: 'query_error',
				message: 'Error querying user',
				userId,
				user: null,
				error: error.message
			});
		}

		if (!user) {
			return NextResponse.json({
				status: 'user_not_found',
				message: 'User not found in database',
				userId,
				user: null
			});
		}

		return NextResponse.json({
			status: 'authenticated',
			message: 'User found',
			userId,
			user: {
				id: user.id,
				username: user.username,
				avatar_url: user.avatar_url,
				github_id: user.github_id
			}
		});

	} catch (error) {
		console.error('Debug auth error:', error);
		return NextResponse.json({
			status: 'error',
			message: 'Unexpected error',
			error: error instanceof Error ? error.message : 'Unknown error'
		}, { status: 500 });
	}
}