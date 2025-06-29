import { NextRequest, NextResponse } from 'next/server';

/**
 * GitHub OAuth 인증 시작 엔드포인트
 * GET /api/auth/github
 */
export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    
    if (!clientId) {
      return NextResponse.json(
        { error: 'GitHub Client ID가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // GitHub OAuth 인증 URL 생성
    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.set('client_id', clientId);
    githubAuthUrl.searchParams.set('scope', 'user:email read:user');
    githubAuthUrl.searchParams.set('redirect_uri', `${process.env.NEXTAUTH_URL}/api/auth/github/callback`);

    // GitHub 로그인 페이지로 리다이렉트
    return NextResponse.redirect(githubAuthUrl.toString());
  } catch (error) {
    console.error('GitHub OAuth 인증 오류:', error);
    return NextResponse.json(
      { error: '인증 과정에서 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}