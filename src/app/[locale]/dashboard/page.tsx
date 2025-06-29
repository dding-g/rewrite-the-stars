'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { NumberTicker } from '@/shared/ui/magic-ui/number-ticker';
import { PulsatingButton } from '@/shared/ui/magic-ui/pulsating-button';
import { BentoGrid, BentoGridItem } from '@/shared/ui/magic-ui/bento-grid';
import { MagicCard } from '@/shared/ui/magic-ui/magic-card';
import { GradientText } from '@/shared/ui/magic-ui/gradient-text';
import { motion } from 'framer-motion';

/**
 * 사용자 대시보드 페이지 컴포넌트
 * 개인 저장소 컬렉션을 표시하고 관리하는 인터페이스를 제공
 */
export default function DashboardPage() {
	const t = useTranslations('dashboard');
	const [repositoryCount] = useState(47); // 예시 데이터
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedTag, setSelectedTag] = useState('');

	const mockRepositories = [
		{
			id: 1,
			name: 'next.js',
			description: 'The React Framework for Production',
			stars: 125000,
			language: 'TypeScript',
			tags: ['React', 'Framework'],
			lastUpdated: '2024-01-15',
		},
		{
			id: 2,
			name: 'tailwindcss',
			description: 'A utility-first CSS framework for rapid UI development.',
			stars: 82000,
			language: 'CSS',
			tags: ['CSS', 'Framework'],
			lastUpdated: '2024-01-10',
		},
		{
			id: 3,
			name: 'framer-motion',
			description: 'Open source, production-ready motion library for React',
			stars: 23000,
			language: 'TypeScript',
			tags: ['React', 'Animation'],
			lastUpdated: '2024-01-08',
		},
	];

	const handleSync = () => {
		// 동기화 로직 구현 예정
		console.log('Syncing repositories...');
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
			<div className="container mx-auto px-4 py-8">
				{/* 헤더 섹션 */}
				<motion.div 
					className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<div>
						<h1 className="text-4xl font-bold mb-2">
							<GradientText 
								gradient="from-blue-400 via-purple-500 to-pink-500"
								className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
							>
								{t('title')}
							</GradientText>
						</h1>
						<div className="flex items-center gap-2 text-gray-300">
							<span className="text-lg">⭐</span>
							<NumberTicker value={repositoryCount} className="text-xl font-semibold" />
							<span>starred repositories</span>
						</div>
					</div>

					<PulsatingButton 
						onClick={handleSync}
						className="bg-blue-600 hover:bg-blue-700"
						pulseColor="#3b82f6"
					>
						<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
						{t('syncRepositories')}
					</PulsatingButton>
				</motion.div>

				{/* 검색 및 필터 섹션 */}
				<motion.div 
					className="mb-8"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1 relative">
							<input
								type="text"
								placeholder={t('searchPlaceholder')}
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
							/>
							<svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</div>

						<select 
							value={selectedTag}
							onChange={(e) => setSelectedTag(e.target.value)}
							className="px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm min-w-[160px]"
						>
							<option value="">{t('filterByTag')}</option>
							<option value="React">React</option>
							<option value="Framework">Framework</option>
							<option value="CSS">CSS</option>
							<option value="Animation">Animation</option>
						</select>
					</div>
				</motion.div>

				{/* 저장소 그리드 */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
				>
					{mockRepositories.length > 0 ? (
						<BentoGrid className="max-w-none">
							{mockRepositories.map((repo, index) => (
								<BentoGridItem
									key={repo.id}
									className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm ${
										index === 0 ? 'md:col-span-2' : ''
									}`}
									title={
										<div className="flex items-center justify-between">
											<span className="text-white font-semibold">{repo.name}</span>
											<div className="flex items-center gap-1 text-yellow-400">
												<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
													<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
												</svg>
												<NumberTicker value={repo.stars} className="text-sm" />
											</div>
										</div>
									}
									description={
										<div className="space-y-3">
											<p className="text-gray-300 text-sm leading-relaxed">{repo.description}</p>
											<div className="flex flex-wrap gap-2">
												{repo.tags.map((tag) => (
													<span
														key={tag}
														className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30"
													>
														{tag}
													</span>
												))}
												<span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">
													{repo.language}
												</span>
											</div>
											<div className="flex justify-between items-center pt-2">
												<span className="text-xs text-gray-400">
													{t('lastUpdated')}: {repo.lastUpdated}
												</span>
												<button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
													{t('visitRepository')}
												</button>
											</div>
										</div>
									}
									header={
										<div className="w-full h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
											<svg className="w-8 h-8 text-white/50" fill="currentColor" viewBox="0 0 20 20">
												<path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
											</svg>
										</div>
									}
								/>
							))}
						</BentoGrid>
					) : (
						<MagicCard className="bg-slate-800/50 border-slate-700 backdrop-blur-sm text-center py-16">
							<div className="space-y-4">
								<div className="text-6xl">📦</div>
								<h3 className="text-xl font-semibold text-white">{t('noRepositories')}</h3>
								<p className="text-gray-400 max-w-md mx-auto">
									Sync your starred repositories from GitHub to get started with organizing your collection.
								</p>
								<PulsatingButton 
									onClick={handleSync}
									className="bg-blue-600 hover:bg-blue-700 mt-4"
									pulseColor="#3b82f6"
								>
									<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
									</svg>
									{t('syncRepositories')}
								</PulsatingButton>
							</div>
						</MagicCard>
					)}
				</motion.div>
			</div>
		</div>
	);
}
