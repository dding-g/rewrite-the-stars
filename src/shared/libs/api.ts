import ky from 'ky';

// API 기본 설정
const api = ky.create({
	prefixUrl: '/api',
	timeout: 30000,
	retry: {
		limit: 2,
		methods: ['get'],
	},
});

// 타입 정의
export interface Repository {
	id: string;
	github_repo_id: number;
	owner: string;
	name: string;
	full_name: string;
	description: string;
	html_url: string;
	private: boolean;
	stargazers_count: number;
	updated_at_github: string;
	topics: string[];
	owner_avatar_url: string;
	starred_at: string;
	tags: Tag[];
}

export interface Tag {
	id: string;
	name: string;
	color: string;
	created_by: string;
	created_at: string;
}

export interface PaginationInfo {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

export interface RepositoriesResponse {
	repositories: Repository[];
	pagination: PaginationInfo;
}

export interface TagsResponse {
	tags: Tag[];
}

export interface PublicDashboardResponse {
	user: {
		username: string;
		avatar_url: string;
	};
	repositories: Repository[];
	tags: Tag[];
	pagination: PaginationInfo;
	isOwner: boolean;
}

// API 함수들
export const authApi = {
	// 현재 사용자 정보 조회
	async getCurrentUser(): Promise<{ user: User | null }> {
		return api.get('auth/me').json();
	},
};

export interface User {
	id: string;
	username: string;
	avatar_url: string;
	github_id: string;
	created_at: string;
	updated_at: string;
}

export const repositoryApi = {
	// 저장소 목록 조회
	async getRepositories(params: {
		page?: number;
		limit?: number;
		search?: string;
		tag?: string;
	} = {}): Promise<RepositoriesResponse> {
		const searchParams = new URLSearchParams();
		if (params.page) searchParams.set('page', params.page.toString());
		if (params.limit) searchParams.set('limit', params.limit.toString());
		if (params.search) searchParams.set('search', params.search);
		if (params.tag) searchParams.set('tag', params.tag);

		return api.get(`repositories?${searchParams.toString()}`).json();
	},

	// GitHub 저장소 동기화
	async syncRepositories(): Promise<{ success: boolean; count: number; message: string }> {
		return api.post('github/sync').json();
	},

	// 저장소에 태그 추가
	async addTagToRepository(repositoryId: string, tagId: string): Promise<any> {
		return api.post(`repositories/${repositoryId}/tags`, { json: { tagId } }).json();
	},

	// 저장소에서 태그 제거
	async removeTagFromRepository(repositoryId: string, tagId: string): Promise<any> {
		return api.delete(`repositories/${repositoryId}/tags?tagId=${tagId}`).json();
	},
};

export const tagApi = {
	// 태그 목록 조회
	async getTags(): Promise<TagsResponse> {
		return api.get('tags').json();
	},

	// 태그 검색
	async searchTags(query: string, limit = 10): Promise<TagsResponse> {
		return api.get(`tags/search?q=${encodeURIComponent(query)}&limit=${limit}`).json();
	},

	// 새 태그 생성
	async createTag(tag: { name: string; color?: string; description?: string }): Promise<{ tag: Tag }> {
		return api.post('tags', { json: tag }).json();
	},

	// 태그 수정
	async updateTag(id: string, tag: { name?: string; color?: string; description?: string }): Promise<{ tag: Tag }> {
		return api.put(`tags/${id}`, { json: tag }).json();
	},

	// 태그 삭제
	async deleteTag(id: string): Promise<{ success: boolean }> {
		return api.delete(`tags/${id}`).json();
	},
};

export const publicApi = {
	// 공개 대시보드 조회
	async getPublicDashboard(
		username: string,
		params: {
			page?: number;
			limit?: number;
			search?: string;
			tag?: string;
		} = {}
	): Promise<PublicDashboardResponse> {
		const searchParams = new URLSearchParams();
		if (params.page) searchParams.set('page', params.page.toString());
		if (params.limit) searchParams.set('limit', params.limit.toString());
		if (params.search) searchParams.set('search', params.search);
		if (params.tag) searchParams.set('tag', params.tag);

		return api.get(`public/dashboard/${username}?${searchParams.toString()}`).json();
	},
};

// 에러 처리 유틸리티
export class ApiError extends Error {
	constructor(
		message: string,
		public status: number,
		public response?: any
	) {
		super(message);
		this.name = 'ApiError';
	}
}

// ky 에러 핸들러
api.extend({
	hooks: {
		afterResponse: [
			async (request, options, response) => {
				if (!response.ok) {
					const error = await response.text();
					throw new ApiError(error || 'API 요청 실패', response.status, response);
				}
			},
		],
	},
});