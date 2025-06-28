import { useTranslations } from 'next-intl';
import Link from 'next/link';

/**
 * 홈페이지 컴포넌트
 * 프로젝트 소개 및 로그인 CTA를 제공
 */
export default function HomePage() {
	const t = useTranslations('auth');

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
			<div className="container mx-auto px-4 py-16">
				<div className="text-center">
					{/* 헤더 섹션 */}
					<h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">Rewrite Stars</h1>

					<p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
						{t('description')}
					</p>

					{/* CTA 버튼 */}
					<div className="space-y-4">
						<Link
							href="/login"
							className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
						>
							{t('loginWithGitHub')}
							asdf
						</Link>
					</div>

					{/* 기능 소개 섹션 */}
					<div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
								🏷️ 태그 관리
							</h3>
							<p className="text-gray-600 dark:text-gray-300">
								저장소에 커스텀 태그를 추가하여 효율적으로 분류하세요
							</p>
						</div>

						<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
								🔍 검색 & 필터
							</h3>
							<p className="text-gray-600 dark:text-gray-300">
								태그와 키워드로 원하는 저장소를 빠르게 찾아보세요
							</p>
						</div>

						<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
								🔗 대시보드 공유
							</h3>
							<p className="text-gray-600 dark:text-gray-300">
								정리된 저장소 컬렉션을 다른 사람들과 공유하세요
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
