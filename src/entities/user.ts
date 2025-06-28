/**
 * 사용자 엔티티 타입 정의
 */
export type User = {
  id: string;
  github_id: number;
  username: string;
  avatar_url: string | null;
  access_token?: string; // 암호화된 토큰
  created_at: string;
  updated_at: string;
};

/**
 * 사용자 생성 요청 타입
 */
export type CreateUserRequest = {
  github_id: number;
  username: string;
  avatar_url?: string | null;
  access_token: string;
};

/**
 * 사용자 업데이트 요청 타입
 */
export type UpdateUserRequest = {
  username?: string;
  avatar_url?: string | null;
  access_token?: string;
};

/**
 * 인증된 사용자 정보 타입
 */
export type AuthUser = {
  id: string;
  username: string;
  avatar_url: string | null;
  github_id: number;
};