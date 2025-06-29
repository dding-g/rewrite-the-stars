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
    console.log('Logout - Before delete, user_id cookie:', cookieStore.get('user_id'));
    
    cookieStore.set('user_id', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // 즉시 만료
      path: '/',
    });
    
    console.log('Logout - After delete, user_id cookie:', cookieStore.get('user_id'));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('로그아웃 오류:', error);
    return NextResponse.json(
      { error: '로그아웃 과정에서 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}