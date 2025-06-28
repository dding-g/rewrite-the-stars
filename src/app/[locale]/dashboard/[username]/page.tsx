import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    username: string;
    locale: string;
  };
};

/**
 * 공개 대시보드 페이지 컴포넌트
 * 특정 사용자의 저장소 컬렉션을 공개적으로 표시
 */
export default function PublicDashboardPage({ params }: Props) {
  const t = useTranslations('dashboard');
  const { username } = params;

  // 사용자 존재 여부 확인 (추후 데이터베이스 조회로 구현)
  // if (!user) {
  //   notFound();
  // }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='container mx-auto px-4 py-8'>
        {/* 헤더 섹션 */}
        <div className='text-center mb-8'>
          <div className='flex justify-center items-center gap-4 mb-4'>
            <img
              src='https://github.com/github.png'
              alt={`${username}의 아바타`}
              className='w-16 h-16 rounded-full'
            />
            <div>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                {username}의 저장소 컬렉션
              </h1>
              <p className='text-gray-600 dark:text-gray-400'>
                정리된 GitHub 즐겨찾기 저장소들
              </p>
            </div>
          </div>
        </div>

        {/* 검색 섹션 */}
        <div className='mb-8'>
          <div className='max-w-md mx-auto'>
            <input
              type='text'
              placeholder={t('searchPlaceholder')}
              className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>
        </div>

        {/* 태그 필터 섹션 */}
        <div className='mb-8'>
          <div className='flex flex-wrap justify-center gap-2'>
            <button className='px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors'>
              모든 저장소
            </button>
            <button className='px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'>
              Frontend
            </button>
            <button className='px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'>
              Backend
            </button>
            <button className='px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'>
              Tools
            </button>
          </div>
        </div>

        {/* 저장소 그리드 */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* 임시 플레이스홀더 카드들 */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow'
            >
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                  example-repo-{index + 1}
                </h3>
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  ⭐ {Math.floor(Math.random() * 1000)}
                </span>
              </div>
              
              <p className='text-gray-600 dark:text-gray-300 text-sm mb-4'>
                이것은 저장소 설명 예시입니다. 실제 데이터는 GitHub API에서 가져옵니다.
              </p>
              
              <div className='flex flex-wrap gap-2 mb-4'>
                <span className='px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full'>
                  React
                </span>
                <span className='px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full'>
                  TypeScript
                </span>
              </div>
              
              <div className='flex justify-between items-center'>
                <span className='text-xs text-gray-500 dark:text-gray-400'>
                  업데이트: 2024-01-01
                </span>
                
                <a
                  href='#'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm font-medium'
                >
                  GitHub에서 보기
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* 푸터 */}
        <div className='text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700'>
          <p className='text-gray-500 dark:text-gray-400 text-sm'>
            Powered by{' '}
            <a
              href='/'
              className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200'
            >
              Rewrite Stars
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}