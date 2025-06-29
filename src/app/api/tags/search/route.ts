import { supabase } from '@/shared/libs/supabase';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * 태그 검색 및 자동완성 엔드포인트
 * GET /api/tags/search?q=검색어
 */
export async function GET(request: NextRequest) {
	try {
		const cookieStore = await cookies();
		const userId = cookieStore.get('user_id')?.value;

		if (!userId) {
			return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const query = searchParams.get('q') || '';
		const limit = Math.min(Number.parseInt(searchParams.get('limit') || '10'), 50);

		// 사용자의 태그 검색 (대소문자 구분 없이)
		const { data: tags, error } = await supabase
			.from('tags')
			.select('*')
			.eq('created_by', userId)
			.ilike('name', `%${query}%`)
			.order('name')
			.limit(limit);

		if (error) {
			console.error('태그 검색 오류:', error);
			return NextResponse.json({ error: '태그를 검색하는 중 오류가 발생했습니다.' }, { status: 500 });
		}

		return NextResponse.json({ tags: tags || [] });
	} catch (error) {
		console.error('태그 검색 오류:', error);
		return NextResponse.json(
			{ error: '태그를 검색하는 중 오류가 발생했습니다.' },
			{ status: 500 }
		);
	}
}