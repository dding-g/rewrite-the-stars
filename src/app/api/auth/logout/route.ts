import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * 로그아웃 엔드포인트
 * POST /api/auth/logout
 */
export async function POST(request: NextRequest) {
  try {
    // 쿠키 삭제
    const cookieStore = await cookies();
    cookieStore.delete('user_id');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('로그아웃 오류:', error);
    return NextResponse.json(
      { error: '로그아웃 과정에서 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}