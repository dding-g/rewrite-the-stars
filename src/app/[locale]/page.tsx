'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { GradientText } from '@/shared/ui/magic-ui/gradient-text';
import { ShimmerButton } from '@/shared/ui/magic-ui/shimmer-button';
import { Particles } from '@/shared/ui/magic-ui/particles';
import { MagicCard } from '@/shared/ui/magic-ui/magic-card';
import { Marquee } from '@/shared/ui/magic-ui/marquee';
import { motion } from 'framer-motion';

/**
 * 홈페이지 컴포넌트
 * 프로젝트 소개 및 로그인 CTA를 제공
 */
export default function HomePage() {
	const t = useTranslations('home');
	const authT = useTranslations('auth');

	const techStack = [
		{ name: 'Next.js', color: 'text-gray-900 dark:text-white' },
		{ name: 'React', color: 'text-blue-500' },
		{ name: 'TypeScript', color: 'text-blue-600' },
		{ name: 'Supabase', color: 'text-green-500' },
		{ name: 'Tailwind CSS', color: 'text-cyan-500' },
		{ name: 'GitHub API', color: 'text-gray-700 dark:text-gray-300' },
	];

	return (
		<div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
			<Particles className="absolute inset-0" quantity={50} />
			
			<div className="relative z-10 container mx-auto px-4 py-16">
				<div className="text-center">
					{/* 헤더 섹션 */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<h1 className="text-6xl md:text-8xl font-bold mb-6">
							<GradientText 
								gradient="from-blue-400 via-purple-500 to-pink-500"
								className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
							>
								{t('title')}
							</GradientText>
						</h1>
					</motion.div>

					<motion.p 
						className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
					>
						{authT('description')}
					</motion.p>

					{/* CTA 버튼 */}
					<motion.div 
						className="mb-16"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
					>
						<Link href="/login">
							<ShimmerButton className="text-white text-lg px-12 py-4">
								<svg
									className="w-5 h-5 mr-2"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
										clipRule="evenodd"
									/>
								</svg>
								{authT('loginWithGitHub')}
							</ShimmerButton>
						</Link>
					</motion.div>

					{/* 기술 스택 마키 */}
					<motion.div 
						className="mb-16"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.8, delay: 0.6 }}
					>
						<p className="text-gray-400 mb-4 text-sm uppercase tracking-wider">Built with</p>
						<Marquee pauseOnHover className="[--duration:30s]">
							{techStack.map((tech, index) => (
								<div
									key={index}
									className={`mx-8 text-lg font-semibold ${tech.color} whitespace-nowrap`}
								>
									{tech.name}
								</div>
							))}
						</Marquee>
					</motion.div>

					{/* 기능 소개 섹션 */}
					<motion.div 
						className="grid grid-cols-1 md:grid-cols-3 gap-8"
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.8 }}
					>
						<MagicCard className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
							<div className="text-4xl mb-4">🏷️</div>
							<h3 className="text-xl font-semibold text-white mb-3">
								{t('features.tagManagement.title')}
							</h3>
							<p className="text-gray-300 leading-relaxed">
								{t('features.tagManagement.description')}
							</p>
						</MagicCard>

						<MagicCard className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
							<div className="text-4xl mb-4">🔍</div>
							<h3 className="text-xl font-semibold text-white mb-3">
								{t('features.searchFilter.title')}
							</h3>
							<p className="text-gray-300 leading-relaxed">
								{t('features.searchFilter.description')}
							</p>
						</MagicCard>

						<MagicCard className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
							<div className="text-4xl mb-4">🔗</div>
							<h3 className="text-xl font-semibold text-white mb-3">
								{t('features.dashboardSharing.title')}
							</h3>
							<p className="text-gray-300 leading-relaxed">
								{t('features.dashboardSharing.description')}
							</p>
						</MagicCard>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
