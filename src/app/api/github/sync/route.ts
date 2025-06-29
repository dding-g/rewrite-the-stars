import { supabaseAdmin } from '@/shared/libs/supabase';
import { Octokit } from '@octokit/rest';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * GitHub 저장소 동기화 엔드포인트
 * POST /api/github/sync
 */
export async function POST() {
	try {
		const cookieStore = await cookies();
		const userId = cookieStore.get('user_id')?.value;

		if (!userId) {
			return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
		}

		// 사용자 정보 및 GitHub 토큰 가져오기
		const { data: user, error: userError } = await supabaseAdmin
			.from('users')
			.select('access_token, username')
			.eq('id', userId)
			.single();

		if (userError || !user?.access_token) {
			return NextResponse.json({ error: '사용자 정보를 찾을 수 없습니다.' }, { status: 404 });
		}

		// GitHub API 클라이언트 초기화
		const octokit = new Octokit({
			auth: user.access_token,
		});

		// GitHub에서 starred repositories 가져오기
		const starredRepos = [];
		let page = 1;
		let hasNextPage = true;

		while (hasNextPage) {
			const { data: repos } = await octokit.rest.activity.listReposStarredByAuthenticatedUser({
				per_page: 100,
				page,
			});

			starredRepos.push(...repos);
			hasNextPage = repos.length === 100;
			page++;
		}

		// 저장소 정보를 데이터베이스 스키마에 맞게 변환
		const repositories = starredRepos.map((repo) => ({
			github_repo_id: repo.id,
			owner: repo.owner?.login || '',
			name: repo.name,
			full_name: repo.full_name,
			description: repo.description,
			html_url: repo.html_url,
			private: repo.private,
			stargazers_count: repo.stargazers_count,
			updated_at_github: repo.updated_at,
			topics: repo.topics || [],
			owner_avatar_url: repo.owner?.avatar_url,
		}));

		// 기존 starred repositories 관계 삭제
		const { error: deleteStarredError } = await supabaseAdmin
			.from('user_starred_repos')
			.delete()
			.eq('user_id', userId);

		if (deleteStarredError) {
			console.error('기존 starred repos 삭제 오류:', deleteStarredError);
		}

		// 저장소 정보를 repositories 테이블에 upsert
		const { data: upsertedRepos, error: upsertError } = await supabaseAdmin
			.from('repositories')
			.upsert(repositories, {
				onConflict: 'github_repo_id',
				ignoreDuplicates: false,
			})
			.select('id, github_repo_id');

		if (upsertError) {
			console.error('저장소 upsert 오류:', upsertError);
			return NextResponse.json({ error: '저장소 동기화 중 오류가 발생했습니다.' }, { status: 500 });
		}

		// user_starred_repos 테이블에 관계 생성
		const starredRelations =
			upsertedRepos?.map((repo) => ({
				user_id: userId,
				repository_id: repo.id,
				starred_at: new Date().toISOString(),
			})) || [];

		const { error: insertStarredError } = await supabaseAdmin
			.from('user_starred_repos')
			.insert(starredRelations);

		if (insertStarredError) {
			console.error('starred repos 관계 생성 오류:', insertStarredError);
			return NextResponse.json({ error: '저장소 동기화 중 오류가 발생했습니다.' }, { status: 500 });
		}

		// 사용자의 마지막 동기화 시간 업데이트
		await supabaseAdmin
			.from('users')
			.update({ updated_at: new Date().toISOString() })
			.eq('id', userId);

		return NextResponse.json({
			success: true,
			count: repositories.length,
			message: `${repositories.length}개의 저장소가 동기화되었습니다.`,
		});
	} catch (error) {
		console.error('GitHub 동기화 오류:', error);
		return NextResponse.json({ error: '저장소 동기화 중 오류가 발생했습니다.' }, { status: 500 });
	}
}
