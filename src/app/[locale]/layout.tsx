import { locales } from '@/i18n';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type React from 'react';

type Props = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

/**
 * 다국어 지원 레이아웃 컴포넌트
 * 각 언어별 메시지를 로드하고 NextIntl 컨텍스트를 제공
 */
export default async function LocaleLayout({ children, params }: Props) {
	const { locale } = await params;

	return (
		<NextIntlClientProvider>{children}</NextIntlClientProvider>
	);
}

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}
