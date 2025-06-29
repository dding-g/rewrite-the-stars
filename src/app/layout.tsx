import type { Metadata } from 'next';
import './globals.css';
import type React from 'react';

export const metadata: Metadata = {
	title: 'Rewrite Stars',
	description: 'Transform your GitHub starred repositories into a beautiful, organized dashboard',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
