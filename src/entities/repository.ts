/**
 * 저장소 엔티티 타입 정의
 */
export type Repository = {
  id: string;
  github_repo_id: number;
  owner: string;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  private: boolean;
  stargazers_count: number;
  updated_at_github: string | null;
  topics: string[];
  owner_avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * 저장소 생성 요청 타입
 */
export type CreateRepositoryRequest = {
  github_repo_id: number;
  owner: string;
  name: string;
  full_name: string;
  description?: string | null;
  html_url: string;
  private?: boolean;
  stargazers_count?: number;
  updated_at_github?: string | null;
  topics?: string[];
  owner_avatar_url?: string | null;
};

/**
 * 저장소 업데이트 요청 타입
 */
export type UpdateRepositoryRequest = {
  description?: string | null;
  stargazers_count?: number;
  updated_at_github?: string | null;
  topics?: string[];
  private?: boolean;
};

/**
 * 사용자 즐겨찾기 저장소 관계 타입
 */
export type UserStarredRepo = {
  id: string;
  user_id: string;
  repository_id: string;
  starred_at: string;
};

/**
 * 태그가 포함된 저장소 타입
 */
export type RepositoryWithTags = Repository & {
  tags: Array<{
    id: string;
    name: string;
    color: string;
  }>;
};

/**
 * GitHub API에서 받아오는 저장소 데이터 타입
 */
export type GitHubRepository = {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  description: string | null;
  private: boolean;
  stargazers_count: number;
  updated_at: string;
  topics: string[];
};