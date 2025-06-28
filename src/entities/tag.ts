/**
 * 태그 엔티티 타입 정의
 */
export type Tag = {
  id: string;
  name: string;
  color: string; // 헥스 컬러 코드
  created_by: string; // 사용자 ID
  created_at: string;
};

/**
 * 태그 생성 요청 타입
 */
export type CreateTagRequest = {
  name: string;
  color?: string;
  created_by: string;
};

/**
 * 태그 업데이트 요청 타입
 */
export type UpdateTagRequest = {
  name?: string;
  color?: string;
};

/**
 * 저장소 태그 관계 타입
 */
export type RepositoryTag = {
  id: string;
  user_id: string;
  repository_id: string;
  tag_id: string;
  created_at: string;
};

/**
 * 태그 할당 요청 타입
 */
export type AssignTagRequest = {
  user_id: string;
  repository_id: string;
  tag_id: string;
};

/**
 * 태그 할당 해제 요청 타입
 */
export type UnassignTagRequest = {
  user_id: string;
  repository_id: string;
  tag_id: string;
};

/**
 * 사용량이 포함된 태그 타입
 */
export type TagWithCount = Tag & {
  usage_count: number;
};

/**
 * 기본 태그 색상 상수
 */
export const DEFAULT_TAG_COLORS = [
  '#3b82f6', // 파란색
  '#10b981', // 초록색
  '#f59e0b', // 주황색
  '#ef4444', // 빨간색
  '#8b5cf6', // 보라색
  '#06b6d4', // 청록색
  '#f97316', // 오렌지
  '#84cc16', // 라임
] as const;

export type TagColor = (typeof DEFAULT_TAG_COLORS)[number];