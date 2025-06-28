import { useTranslations } from 'next-intl';

/**
 * 사용자 대시보드 페이지 컴포넌트
 * 개인 저장소 컬렉션을 표시하고 관리하는 인터페이스를 제공
 */
export default function DashboardPage() {
  const t = useTranslations('dashboard');

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='container mx-auto px-4 py-8'>
        {/* 헤더 섹션 */}
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            {t('title')}
          </h1>
          
          <button className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200'>
            {t('syncRepositories')}
          </button>
        </div>

        {/* 검색 및 필터 섹션 */}
        <div className='mb-8 space-y-4'>
          <div className='flex flex-col sm:flex-row gap-4'>
            <input
              type='text'
              placeholder={t('searchPlaceholder')}
              className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
            
            <select className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
              <option value=''>{t('filterByTag')}</option>
              {/* 태그 옵션들은 동적으로 렌더링 예정 */}
            </select>
          </div>
        </div>

        {/* 저장소 그리드 */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* 임시 플레이스홀더 카드 */}
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Repository Name
              </h3>
              <span className='text-sm text-gray-500 dark:text-gray-400'>
                ⭐ 123
              </span>
            </div>
            
            <p className='text-gray-600 dark:text-gray-300 text-sm mb-4'>
              Repository description goes here...
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
                {t('lastUpdated')}: 2024-01-01
              </span>
              
              <button className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm font-medium'>
                방문
              </button>
            </div>
          </div>

          {/* 저장소가 없을 때의 메시지 */}
          <div className='col-span-full text-center py-12'>
            <p className='text-gray-500 dark:text-gray-400 text-lg'>
              {t('noRepositories')}
            </p>
            <p className='text-gray-400 dark:text-gray-500 text-sm mt-2'>
              GitHub에서 저장소를 동기화하여 시작하세요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}