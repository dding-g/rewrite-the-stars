'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { NumberTicker } from '@/shared/ui/magic-ui/number-ticker';
import { PulsatingButton } from '@/shared/ui/magic-ui/pulsating-button';
import { BentoGrid, BentoGridItem } from '@/shared/ui/magic-ui/bento-grid';
import { MagicCard } from '@/shared/ui/magic-ui/magic-card';
import { GradientText } from '@/shared/ui/magic-ui/gradient-text';
import { motion } from 'framer-motion';
import { publicApi, repositoryApi, type Repository, type Tag, type PaginationInfo } from '@/shared/libs/api';

/**
 * 공개 대시보드 페이지 컴포넌트
 * 다른 사용자의 정리된 저장소 컬렉션을 볼 수 있음
 */
export default function PublicDashboardPage() {
	const t = useTranslations('dashboard');
	const params = useParams();
	const username = params.username as string;
	
	// 상태 관리
	const [user, setUser] = useState<{ username: string; avatar_url: string } | null>(null);
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
	const [error, setError] = useState<string | null>(null);
	const [isOwner, setIsOwner] = useState(false);
	const [isSyncing, setIsSyncing] = useState(false);

	// 공개 대시보드 데이터 로드
	const loadPublicDashboard = useCallback(async (page = 1, search = searchTerm, tag = selectedTag) => {
		try {
			setIsLoading(true);
			setError(null);
			const response = await publicApi.getPublicDashboard(username, {
				page,
				limit: 20,
				search: search || undefined,
				tag: tag || undefined,
			});
			setUser(response.user);
			setRepositories(response.repositories);
			setTags(response.tags);
			setPagination(response.pagination);
			setIsOwner(response.isOwner);
		} catch (error: any) {
			console.error('공개 대시보드 로드 실패:', error);
			setError(error.message || '대시보드를 불러오는데 실패했습니다.');
		} finally {
			setIsLoading(false);
		}
	}, [username, searchTerm, selectedTag]);

	// 초기 데이터 로드
	useEffect(() => {
		loadPublicDashboard();
	}, [loadPublicDashboard]);

	// 검색 및 필터 변경 시 데이터 다시 로드
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			loadPublicDashboard(1, searchTerm, selectedTag);
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [searchTerm, selectedTag, loadPublicDashboard]);

	// GitHub 동기화 핸들러 (소유자만 사용 가능)
	const handleSync = async () => {
		if (!isOwner) return;
		
		try {
			setIsSyncing(true);
			await repositoryApi.syncRepositories();
			await loadPublicDashboard(1, '', ''); // 동기화 후 첫 페이지로 리셋
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
		loadPublicDashboard(page);
	};

	// 날짜 포맷팅 함수
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('ko-KR');
	};

	// 에러 상태 렌더링
	if (error) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<MagicCard className="bg-gray-50 border-gray-200 backdrop-blur-sm text-center p-16">
					<div className="space-y-4">
						<div className="text-6xl">😵</div>
						<h2 className="text-2xl font-bold text-gray-900">사용자를 찾을 수 없습니다</h2>
						<p className="text-gray-600">요청하신 사용자의 대시보드가 존재하지 않습니다.</p>
					</div>
				</MagicCard>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto px-4 py-8">
				{/* 헤더 섹션 */}
				<motion.div 
					className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<div className="flex items-center gap-4">
						{user?.avatar_url && (
							<img
								src={user.avatar_url}
								alt={`${user.username}'s avatar`}
								className="w-16 h-16 rounded-full border-2 border-gray-300"
							/>
						)}
						<div>
							<h1 className="text-4xl font-bold mb-2">
								<GradientText 
									gradient="from-blue-600 via-purple-600 to-pink-600"
									className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
								>
									{user?.username}'s Dashboard
								</GradientText>
							</h1>
							<div className="flex items-center gap-2 text-gray-600">
								<span className="text-lg">⭐</span>
								<NumberTicker value={pagination.total} className="text-xl font-semibold" />
								<span>starred repositories</span>
								{isOwner && (
									<span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full border border-green-200">
										Owner
									</span>
								)}
							</div>
						</div>
					</div>

					{/* 소유자만 볼 수 있는 동기화 버튼 */}
					{isOwner && (
						<PulsatingButton 
							onClick={handleSync}
							className="bg-blue-600 hover:bg-blue-700 text-white"
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
					)}
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
								className="w-full px-4 py-3 pl-10 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
							/>
							<svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</div>

						<select 
							value={selectedTag}
							onChange={(e) => setSelectedTag(e.target.value)}
							className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[160px]"
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
							<div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
						</div>
					) : repositories.length > 0 ? (
						<>
							<BentoGrid className="max-w-none">
								{repositories.map((repo, index) => (
								<BentoGridItem
									key={repo.id}
									className={`bg-gray-50 border-gray-200 hover:shadow-lg transition-shadow ${
										index === 0 ? 'md:col-span-2' : ''
									}`}
									onClick={() => window.open(repo.html_url, '_blank')}
									title={
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<span className="text-gray-900 font-semibold">{repo.name}</span>
												{repo.private && (
													<svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
														<path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
													</svg>
												)}
											</div>
											<div className="flex items-center gap-1 text-yellow-600">
												<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
													<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
												</svg>
												<NumberTicker value={repo.stargazers_count} className="text-sm" />
											</div>
										</div>
									}
									description={
										<div className="space-y-3">
											<p className="text-gray-600 text-sm leading-relaxed">{repo.description || 'No description available'}</p>
											<div className="flex flex-wrap gap-2">
												{repo.tags.map((tag) => (
													<span
														key={tag.id}
														className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200"
													>
														{tag.name}
													</span>
												))}
												{repo.topics.map((topic) => (
													<span
														key={topic}
														className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full border border-purple-200"
													>
														{topic}
													</span>
												))}
											</div>
											<div className="flex justify-between items-center pt-2">
												<span className="text-xs text-gray-500">
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
													<span className="text-xs text-gray-500">{repo.owner}</span>
												</div>
											</div>
										</div>
									}
									header={
										<div className="w-full h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
											<svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
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
									className="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-900 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
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
														: 'bg-gray-100 border border-gray-300 text-gray-900 hover:bg-gray-200'
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
									className="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-900 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
								>
									Next
								</button>
							</div>
						)}
					</>
					) : (
						<MagicCard className="bg-gray-50 border-gray-200 hover:shadow-lg transition-shadow text-center py-16">
							<div className="space-y-4">
								<div className="text-6xl">📦</div>
								<h3 className="text-xl font-semibold text-gray-900">No repositories found</h3>
								<p className="text-gray-500 max-w-md mx-auto">
									This user hasn't shared any starred repositories yet, or they don't match your current filters.
								</p>
							</div>
						</MagicCard>
					)}
				</motion.div>
			</div>
		</div>
	);
}