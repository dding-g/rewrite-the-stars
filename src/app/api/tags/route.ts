import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/shared/libs/supabase';

/**
 * 태그 관리 엔드포인트
 * GET /api/tags - 사용자의 태그 목록 조회
 * POST /api/tags - 새 태그 생성
 */

// 사용자의 태그 목록 조회
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const supabase = createClient();

    const { data: tags, error } = await supabase
      .from('tags')
      .select('*')
      .eq('user_id', userId)
      .order('name');

    if (error) {
      console.error('태그 조회 오류:', error);
      return NextResponse.json(
        { error: '태그를 조회하는 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ tags });
  } catch (error) {
    console.error('태그 조회 오류:', error);
    return NextResponse.json(
      { error: '태그를 조회하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 새 태그 생성
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, color, description } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: '태그 이름은 필수입니다.' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // 중복 태그 이름 확인
    const { data: existingTag } = await supabase
      .from('tags')
      .select('id')
      .eq('user_id', userId)
      .eq('name', name.trim())
      .single();

    if (existingTag) {
      return NextResponse.json(
        { error: '이미 존재하는 태그 이름입니다.' },
        { status: 409 }
      );
    }

    // 새 태그 생성
    const { data: tag, error } = await supabase
      .from('tags')
      .insert({
        user_id: parseInt(userId),
        name: name.trim(),
        color: color || '#3B82F6',
        description: description?.trim() || null,
      })
      .select()
      .single();

    if (error) {
      console.error('태그 생성 오류:', error);
      return NextResponse.json(
        { error: '태그를 생성하는 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ tag }, { status: 201 });
  } catch (error) {
    console.error('태그 생성 오류:', error);
    return NextResponse.json(
      { error: '태그를 생성하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}