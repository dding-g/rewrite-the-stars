'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';
import { NumberTicker } from '@/shared/ui/magic-ui/number-ticker';
import { PulsatingButton } from '@/shared/ui/magic-ui/pulsating-button';
import { BentoGrid, BentoGridItem } from '@/shared/ui/magic-ui/bento-grid';
import { MagicCard } from '@/shared/ui/magic-ui/magic-card';
import { GradientText } from '@/shared/ui/magic-ui/gradient-text';
import { motion } from 'framer-motion';
import { authApi, repositoryApi, tagApi, type Repository, type Tag, type PaginationInfo, type User } from '@/shared/libs/api';

/**
 * 본인용 대시보드 페이지 컴포넌트
 * 개인 저장소 컬렉션을 표시하고 관리하는 인터페이스를 제공
 * 저장소 동기화, 태그 관리 등의 소유자 전용 기능 포함
 */
export default function DashboardPage() {
	const t = useTranslations('dashboard');
	
	// 상태 관리
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [repositories, setRepositories] = useState<Repository[]>([]);
	const [tags, setTags] = useState<Tag[]>([]);
	const [pagination, setPagination] = useState<PaginationInfo>({
		page: 1,
		limit: 20,
		total: 0,
		totalPages: 0,
		hasNextPage: false,
		hasPreviousPage: false,
	});
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedTag, setSelectedTag] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [isSyncing, setIsSyncing] = useState(false);

	// 저장소 데이터 로드
	const loadRepositories = useCallback(async (page = 1, search = searchTerm, tag = selectedTag) => {
		try {
			setIsLoading(true);
			const response = await repositoryApi.getRepositories({
				page,
				limit: 20,
				search: search || undefined,
				tag: tag || undefined,
			});
			setRepositories(response.repositories);
			setPagination(response.pagination);
		} catch (error) {
			console.error('저장소 로드 실패:', error);
		} finally {
			setIsLoading(false);
		}
	}, [searchTerm, selectedTag]);

	// 태그 데이터 로드
	const loadTags = useCallback(async () => {
		try {
			const response = await tagApi.getTags();
			setTags(response.tags);
		} catch (error) {
			console.error('태그 로드 실패:', error);
		}
	}, []);

	// 현재 사용자 정보 로드
	const loadCurrentUser = useCallback(async () => {
		try {
			const response = await authApi.getCurrentUser();
			setCurrentUser(response.user);
		} catch (error) {
			console.error('사용자 정보 로드 실패:', error);
		}
	}, []);

	// 초기 데이터 로드
	useEffect(() => {
		loadCurrentUser();
		loadRepositories();
		loadTags();
	}, [loadCurrentUser, loadRepositories, loadTags]);

	// 검색 및 필터 변경 시 데이터 다시 로드
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			loadRepositories(1, searchTerm, selectedTag);
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [searchTerm, selectedTag, loadRepositories]);

	// GitHub 동기화 핸들러
	const handleSync = async () => {
		try {
			setIsSyncing(true);
			await repositoryApi.syncRepositories();
			await loadRepositories(1, '', ''); // 동기화 후 첫 페이지로 리셋
			await loadTags();
			setSearchTerm('');
			setSelectedTag('');
		} catch (error) {
			console.error('동기화 실패:', error);
		} finally {
			setIsSyncing(false);
		}
	};

	// 페이지 변경 핸들러
	const handlePageChange = (page: number) => {
		loadRepositories(page);
	};

	// 날짜 포맷팅 함수
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('ko-KR');
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
					<div className="flex items-center gap-4">
						{currentUser?.avatar_url && (
							<img
								src={currentUser.avatar_url}
								alt={`${currentUser.username}'s avatar`}
								className="w-16 h-16 rounded-full border-2 border-slate-700"
							/>
						)}
						<div>
							<h1 className="text-4xl font-bold mb-2">
								<GradientText 
									gradient="from-blue-400 via-purple-500 to-pink-500"
									className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
								>
									{currentUser?.username ? `${currentUser.username}'s Dashboard` : 'My Dashboard'}
								</GradientText>
							</h1>
							<div className="flex items-center gap-2 text-gray-300">
								<span className="text-lg">⭐</span>
								<NumberTicker value={pagination.total} className="text-xl font-semibold" />
								<span>starred repositories</span>
								<span className="ml-2 px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">
									Owner
								</span>
							</div>
						</div>
					</div>

					<PulsatingButton 
						onClick={handleSync}
						className="bg-blue-600 hover:bg-blue-700"
						pulseColor="#3b82f6"
						disabled={isSyncing}
					>
						{isSyncing ? (
							<div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
						) : (
							<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
							</svg>
						)}
						{isSyncing ? 'Syncing...' : t('syncRepositories')}
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
							{tags.map((tag) => (
								<option key={tag.id} value={tag.name}>
									{tag.name}
								</option>
							))}
						</select>
					</div>
				</motion.div>

				{/* 저장소 그리드 */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
				>
					{isLoading ? (
						<div className="flex justify-center items-center py-16">
							<div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
						</div>
					) : repositories.length > 0 ? (
						<>
							<BentoGrid className="max-w-none">
								{repositories.map((repo, index) => (
								<BentoGridItem
									key={repo.id}
									className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm ${
										index === 0 ? 'md:col-span-2' : ''
									}`}
									onClick={() => window.open(repo.html_url, '_blank')}
									title={
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<span className="text-white font-semibold">{repo.name}</span>
												{repo.private && (
													<svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
														<path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
													</svg>
												)}
											</div>
											<div className="flex items-center gap-1 text-yellow-400">
												<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
													<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
												</svg>
												<NumberTicker value={repo.stargazers_count} className="text-sm" />
											</div>
										</div>
									}
									description={
										<div className="space-y-3">
											<p className="text-gray-300 text-sm leading-relaxed">{repo.description || 'No description available'}</p>
											<div className="flex flex-wrap gap-2">
												{repo.tags.map((tag) => (
													<span
														key={tag.id}
														className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30"
													>
														{tag.name}
													</span>
												))}
												{repo.topics.map((topic) => (
													<span
														key={topic}
														className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
													>
														{topic}
													</span>
												))}
											</div>
											<div className="flex justify-between items-center pt-2">
												<span className="text-xs text-gray-400">
													{t('lastUpdated')}: {formatDate(repo.updated_at_github)}
												</span>
												<div className="flex items-center gap-2">
													{repo.owner_avatar_url && (
														<img
															src={repo.owner_avatar_url}
															alt={`${repo.owner}'s avatar`}
															className="w-6 h-6 rounded-full"
														/>
													)}
													<span className="text-xs text-gray-400">{repo.owner}</span>
												</div>
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
						
						{/* 페이지네이션 */}
						{pagination.totalPages > 1 && (
							<div className="flex justify-center items-center gap-4 mt-8">
								<button
									onClick={() => handlePageChange(pagination.page - 1)}
									disabled={!pagination.hasPreviousPage}
									className="px-4 py-2 bg-slate-800/50 border border-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700/50 transition-colors"
								>
									Previous
								</button>
								
								<div className="flex items-center gap-2">
									{Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
										const pageNum = Math.max(1, pagination.page - 2) + i;
										if (pageNum > pagination.totalPages) return null;
										
										return (
											<button
												key={pageNum}
												onClick={() => handlePageChange(pageNum)}
												className={`px-3 py-2 rounded-lg transition-colors ${
													pageNum === pagination.page
														? 'bg-blue-600 text-white'
														: 'bg-slate-800/50 border border-slate-700 text-white hover:bg-slate-700/50'
												}`}
											>
												{pageNum}
											</button>
										);
									})}
								</div>
								
								<button
									onClick={() => handlePageChange(pagination.page + 1)}
									disabled={!pagination.hasNextPage}
									className="px-4 py-2 bg-slate-800/50 border border-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700/50 transition-colors"
								>
									Next
								</button>
							</div>
						)}
					</>
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
