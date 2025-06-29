import { Octokit } from '@octokit/rest';
import type { GitHubRepository } from '@/entities';

/**
 * GitHub API 클라이언트 클래스
 * GitHub 저장소 데이터를 가져오고 관리하는 기능을 제공
 */
export class GitHubClient {
  private octokit: Octokit;

  constructor(accessToken: string) {
    this.octokit = new Octokit({
      auth: accessToken,
    });
  }

  /**
   * 현재 인증된 사용자의 정보를 가져옴
   */
  async getCurrentUser() {
    try {
      const { data } = await this.octokit.rest.users.getAuthenticated();
      return {
        id: data.id,
        login: data.login,
        avatar_url: data.avatar_url,
        name: data.name,
        email: data.email,
      };
    } catch (error) {
      throw new Error(`GitHub 사용자 정보를 가져올 수 없습니다: ${error}`);
    }
  }

  /**
   * 사용자가 즐겨찾기한 저장소 목록을 가져옴
   * @param page - 페이지 번호 (기본값: 1)
   * @param perPage - 페이지당 항목 수 (기본값: 100)
   */
  async getStarredRepositories(
    page: number = 1,
    perPage: number = 100
  ): Promise<GitHubRepository[]> {
    try {
      const { data } = await this.octokit.rest.activity.listReposStarredByAuthenticatedUser({
        page,
        per_page: perPage,
        sort: 'updated',
        direction: 'desc',
      });

      return data.map((repo) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        owner: {
          login: repo.owner.login,
          avatar_url: repo.owner.avatar_url,
        },
        html_url: repo.html_url,
        description: repo.description || '',
        private: repo.private,
        stargazers_count: repo.stargazers_count,
        updated_at: repo.updated_at || new Date().toISOString(),
        topics: repo.topics || [],
      }));
    } catch (error) {
      throw new Error(`즐겨찾기 저장소를 가져올 수 없습니다: ${error}`);
    }
  }

  /**
   * 모든 즐겨찾기 저장소를 페이지네이션으로 가져옴
   */
  async getAllStarredRepositories(): Promise<GitHubRepository[]> {
    const allRepos: GitHubRepository[] = [];
    let page = 1;
    const perPage = 100;

    try {
      while (true) {
        const repos = await this.getStarredRepositories(page, perPage);
        
        if (repos.length === 0) {
          break;
        }

        allRepos.push(...repos);
        
        // API 레이트 리미팅을 고려한 지연
        if (repos.length === perPage) {
          page++;
          await new Promise((resolve) => setTimeout(resolve, 100));
        } else {
          break;
        }
      }

      return allRepos;
    } catch (error) {
      throw new Error(`모든 즐겨찾기 저장소를 가져올 수 없습니다: ${error}`);
    }
  }

  /**
   * API 레이트 리미트 정보를 확인
   */
  async getRateLimit() {
    try {
      const { data } = await this.octokit.rest.rateLimit.get();
      return data.rate;
    } catch (error) {
      throw new Error(`레이트 리미트 정보를 가져올 수 없습니다: ${error}`);
    }
  }
}

/**
 * GitHub 클라이언트 인스턴스를 생성하는 팩토리 함수
 */
export function createGitHubClient(accessToken: string): GitHubClient {
  return new GitHubClient(accessToken);
}