import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 디버깅용 쿠키 테스트 엔드포인트
 * GET /api/debug/cookie - 쿠키 읽기
 * POST /api/debug/cookie - 테스트 쿠키 설정
 */

export async function GET(request: NextRequest) {
	try {
		const cookieStore = await cookies();
		const allCookies = [...cookieStore.getAll()];
		const userId = cookieStore.get('user_id')?.value;
		
		return NextResponse.json({
			userId,
			allCookies,
			cookieCount: allCookies.length
		});
	} catch (error) {
		return NextResponse.json({
			error: error instanceof Error ? error.message : 'Unknown error'
		}, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const cookieStore = await cookies();
		const testValue = 'test-user-id-' + Date.now();
		
		cookieStore.set('user_id', testValue, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60, // 1시간
			path: '/',
		});
		
		return NextResponse.json({
			message: 'Test cookie set',
			testValue
		});
	} catch (error) {
		return NextResponse.json({
			error: error instanceof Error ? error.message : 'Unknown error'
		}, { status: 500 });
	}
}