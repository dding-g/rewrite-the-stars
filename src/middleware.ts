import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './i18n';

export default createMiddleware({
	// 지원하는 언어 목록
	locales,

	// 기본 언어 설정
	defaultLocale,
});

export const config = {
	// 매처 설정: 국제화 경로만 처리
	matcher: ['/((?!api|_next|.*\\..*).*)'],
};
