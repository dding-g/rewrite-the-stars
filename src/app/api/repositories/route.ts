import { supabase } from '@/shared/libs/supabase';
import { withAuth, type User } from '@/shared/libs/auth';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * 저장소 관리 엔드포인트
 * GET /api/repositories - 사용자의 저장소 목록 조회 (필터링, 검색 지원)
 */
async function getRepositories(user: User, request: NextRequest) {
	try {

		const { searchParams } = new URL(request.url);
		const search = searchParams.get('search') || '';
		const tag = searchParams.get('tag') || '';
		const page = Number.parseInt(searchParams.get('page') || '1');
		const limit = Math.min(Number.parseInt(searchParams.get('limit') || '20'), 100); // 최대 100개로 제한
		const offset = (page - 1) * limit;
		console.log(user);
		// 기본 쿼리 구성
		let baseQuery = supabase
			.from('user_starred_repos')
			.select(`
				*,
				repository:repositories!inner(*)
			`, { count: 'exact' })
			.eq('user_id', user.id);

		// 검색 필터 적용
		if (search) {
			baseQuery = baseQuery.or(
				`repository.name.ilike.%${search}%,repository.description.ilike.%${search}%,repository.full_name.ilike.%${search}%`
			);
		}

		// 태그 필터 적용 - 별도 처리 필요
		let tagFilteredRepositoryIds: string[] = [];
		if (tag) {
			// 태그로 필터링된 저장소 ID 조회
			const { data: taggedRepos } = await supabase
				.from('repository_tags')
				.select(`
					repository_id,
					tag:tags!inner(name)
				`)
				.eq('user_id', user.id)
				.eq('tag.name', tag);

			if (taggedRepos && taggedRepos.length > 0) {
				tagFilteredRepositoryIds = taggedRepos
					.filter((item: any) => item.tag?.name === tag)
					.map((item: any) => item.repository_id);
				
				if (tagFilteredRepositoryIds.length > 0) {
					baseQuery = baseQuery.in('repository_id', tagFilteredRepositoryIds);
				} else {
					// 태그가 일치하는 저장소가 없으면 빈 결과 반환
					return NextResponse.json({
						repositories: [],
						pagination: {
							page,
							limit,
							total: 0,
							totalPages: 0,
							hasNextPage: false,
							hasPreviousPage: false,
						},
					});
				}
			} else {
				// 태그가 일치하는 저장소가 없으면 빈 결과 반환
				return NextResponse.json({
					repositories: [],
					pagination: {
						page,
						limit,
						total: 0,
						totalPages: 0,
						hasNextPage: false,
						hasPreviousPage: false,
					},
				});
			}
		}

		// 정렬 및 페이지네이션 적용
		const { data: starredRepos, error, count } = await baseQuery
			.order('starred_at', { ascending: false })
			.range(offset, offset + limit - 1);

		if (error) {
			console.error('저장소 조회 오류:', error);
			return NextResponse.json(
				{ error: '저장소를 조회하는 중 오류가 발생했습니다.' },
				{ status: 500 }
			);
		}

		// 저장소 ID 목록 추출
		const repositoryIds = starredRepos?.map((item: any) => item.repository_id) || [];

		// 저장소별 태그 조회 (별도 쿼리)
		let repositoryTagsMap: { [key: string]: any[] } = {};
		if (repositoryIds.length > 0) {
			const { data: repoTags } = await supabase
				.from('repository_tags')
				.select(`
					repository_id,
					tag:tags(
						id,
						name,
						color
					)
				`)
				.in('repository_id', repositoryIds)
				.eq('user_id', user.id);

			// 저장소 ID별로 태그 그룹화
			if (repoTags) {
				repositoryTagsMap = repoTags.reduce((acc: any, item: any) => {
					if (!acc[item.repository_id]) {
						acc[item.repository_id] = [];
					}
					acc[item.repository_id].push(item.tag);
					return acc;
				}, {});
			}
		}

		// 응답 데이터 구조 변환
		const repositories =
			starredRepos?.map((item: any) => ({
				id: item.repository.id,
				github_repo_id: item.repository.github_repo_id,
				owner: item.repository.owner,
				name: item.repository.name,
				full_name: item.repository.full_name,
				description: item.repository.description,
				html_url: item.repository.html_url,
				private: item.repository.private,
				stargazers_count: item.repository.stargazers_count,
				updated_at_github: item.repository.updated_at_github,
				topics: item.repository.topics,
				owner_avatar_url: item.repository.owner_avatar_url,
				starred_at: item.starred_at,
				tags: repositoryTagsMap[item.repository.id] || [],
			})) || [];

		return NextResponse.json({
			repositories,
			pagination: {
				page,
				limit,
				total: count || 0,
				totalPages: Math.ceil((count || 0) / limit),
				hasNextPage: (count || 0) > offset + limit,
				hasPreviousPage: page > 1,
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

export const GET = withAuth(getRepositories);
