import { supabase } from '@/shared/libs/supabase';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * 저장소 관리 엔드포인트
 * GET /api/repositories - 사용자의 저장소 목록 조회 (필터링, 검색 지원)
 */
export async function GET(request: NextRequest) {
	try {
		const cookieStore = await cookies();
		const userId = cookieStore.get('user_id')?.value;

		if (!userId) {
			return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const search = searchParams.get('search') || '';
		const tag = searchParams.get('tag') || '';
		const page = Number.parseInt(searchParams.get('page') || '1');
		const limit = Number.parseInt(searchParams.get('limit') || '20');
		const offset = (page - 1) * limit;

		// 사용자의 starred repositories 조회 (tags 포함)
		let query = supabase
			.from('user_starred_repos')
			.select(`
        *,
        repository:repositories(*),
        repository_tags!inner(
          tag:tags(
            id,
            name,
            color
          )
        )
      `)
			.eq('user_id', userId);

		// 검색 필터 적용
		if (search) {
			query = query.or(
				`repository.name.ilike.%${search}%,repository.description.ilike.%${search}%,repository.full_name.ilike.%${search}%`
			);
		}

		// 태그 필터 적용
		if (tag) {
			query = query.eq('repository_tags.tag.name', tag);
		}

		// 정렬 및 페이지네이션
		query = query.order('starred_at', { ascending: false }).range(offset, offset + limit - 1);

		const { data: starredRepos, error } = await query;

		if (error) {
			console.error('저장소 조회 오류:', error);
			return NextResponse.json(
				{ error: '저장소를 조회하는 중 오류가 발생했습니다.' },
				{ status: 500 }
			);
		}

		// 총 개수 조회 (페이지네이션용)
		const { count: totalCount } = await supabase
			.from('user_starred_repos')
			.select('*', { count: 'exact', head: true })
			.eq('user_id', userId);

		// 응답 데이터 구조 변환
		const repositories =
			starredRepos?.map((item) => ({
				...item.repository,
				starred_at: item.starred_at,
				tags: item.repository_tags?.map((rt: any) => rt.tag) || [],
			})) || [];

		return NextResponse.json({
			repositories,
			pagination: {
				page,
				limit,
				total: totalCount || 0,
				totalPages: Math.ceil((totalCount || 0) / limit),
			},
		});
	} catch (error) {
		console.error('저장소 조회 오류:', error);
		return NextResponse.json(
			{ error: '저장소를 조회하는 중 오류가 발생했습니다.' },
			{ status: 500 }
		);
	}
}
