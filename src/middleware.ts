import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './i18n';
import { checkAuthRedirect } from '@/shared/libs/auth';
import { NextRequest, NextResponse } from 'next/server';

// next-intl 미들웨어 생성
const intlMiddleware = createMiddleware({
	// 지원하는 언어 목록
	locales,

	// 기본 언어 설정
	defaultLocale,
});

export default async function middleware(request: NextRequest) {
	// 인증이 필요한 경로들에 대한 체크
	const authRedirectResponse = await checkAuthRedirect(request);

	if (authRedirectResponse) {
		return authRedirectResponse;
	}

	// 다국어 처리
	return intlMiddleware(request);
}

export const config = {
	// 매처 설정: API 경로와 정적 파일을 제외한 모든 경로 처리
	matcher: ['/((?!api|_next|.*\\..*).*)'],
};
