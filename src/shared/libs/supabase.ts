import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/types/database';

// Supabase 클라이언트 인스턴스를 생성하는 함수
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase 환경 변수가 설정되지 않았습니다.');
}

/**
 * 클라이언트용 Supabase 인스턴스
 * 브라우저에서 사용되며 Row Level Security(RLS)를 따름
 */
export const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * 새로운 Supabase 클라이언트 인스턴스를 생성하는 함수
 */
export const createClient = () => createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * 서버용 Supabase 인스턴스
 * 서버 사이드에서 관리자 권한으로 사용
 */
export const supabaseAdmin = createSupabaseClient<Database>(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * 데이터베이스 테이블 타입 정의
 */
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];