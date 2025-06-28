/**
 * Supabase 데이터베이스 스키마 타입 정의
 * 실제 데이터베이스 스키마와 동기화되어야 함
 */
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          github_id: number;
          username: string;
          avatar_url: string | null;
          access_token: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          github_id: number;
          username: string;
          avatar_url?: string | null;
          access_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          github_id?: number;
          username?: string;
          avatar_url?: string | null;
          access_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      repositories: {
        Row: {
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
        Insert: {
          id?: string;
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
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          github_repo_id?: number;
          owner?: string;
          name?: string;
          full_name?: string;
          description?: string | null;
          html_url?: string;
          private?: boolean;
          stargazers_count?: number;
          updated_at_github?: string | null;
          topics?: string[];
          owner_avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_starred_repos: {
        Row: {
          id: string;
          user_id: string;
          repository_id: string;
          starred_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          repository_id: string;
          starred_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          repository_id?: string;
          starred_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          color: string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          color?: string;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          color?: string;
          created_by?: string;
          created_at?: string;
        };
      };
      repository_tags: {
        Row: {
          id: string;
          user_id: string;
          repository_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          repository_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          repository_id?: string;
          tag_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};