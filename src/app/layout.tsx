import type { Metadata } from 'next';
import './globals.css';
import type React from 'react';

export const metadata: Metadata = {
	title: 'Rewrite Stars',
	description: 'Transform your GitHub starred repositories into a beautiful, organized dashboard',
};

export default async function RootLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	return (
		<html lang={locale}>
			<body>{children}</body>
		</html>
	);
}
