import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/shared/libs/auth';

/**
 * 현재 사용자 정보 조회 엔드포인트
 * GET /api/auth/me
 */
export async function GET(request: NextRequest) {
	try {
		const user = await getCurrentUser();
		
		if (!user) {
			return NextResponse.json({ user: null }, { status: 200 });
		}

		// 민감한 정보 제외하고 응답
		const safeUser = {
			id: user.id,
			username: user.username,
			avatar_url: user.avatar_url,
			github_id: user.github_id,
			created_at: user.created_at,
			updated_at: user.updated_at,
		};

		return NextResponse.json({ user: safeUser });
	} catch (error) {
		console.error('사용자 정보 조회 오류:', error);
		return NextResponse.json(
			{ error: '사용자 정보를 조회하는 중 오류가 발생했습니다.' },
			{ status: 500 }
		);
	}
}