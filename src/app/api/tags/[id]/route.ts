import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/shared/libs/supabase';

/**
 * 특정 태그 관리 엔드포인트
 * PUT /api/tags/[id] - 태그 수정
 * DELETE /api/tags/[id] - 태그 삭제
 */

// 태그 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // 태그 소유권 확인
    const { data: existingTag, error: fetchError } = await supabase
      .from('tags')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingTag) {
      return NextResponse.json(
        { error: '태그를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 중복 태그 이름 확인 (자신 제외)
    const { data: duplicateTag } = await supabase
      .from('tags')
      .select('id')
      .eq('user_id', userId)
      .eq('name', name.trim())
      .neq('id', id)
      .single();

    if (duplicateTag) {
      return NextResponse.json(
        { error: '이미 존재하는 태그 이름입니다.' },
        { status: 409 }
      );
    }

    // 태그 수정
    const { data: tag, error } = await supabase
      .from('tags')
      .update({
        name: name.trim(),
        color: color || '#3B82F6',
        description: description?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('태그 수정 오류:', error);
      return NextResponse.json(
        { error: '태그를 수정하는 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ tag });
  } catch (error) {
    console.error('태그 수정 오류:', error);
    return NextResponse.json(
      { error: '태그를 수정하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 태그 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const supabase = createClient();

    // 태그 소유권 확인
    const { data: existingTag, error: fetchError } = await supabase
      .from('tags')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingTag) {
      return NextResponse.json(
        { error: '태그를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 태그 삭제 (관련된 repository_tags도 CASCADE로 삭제됨)
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('태그 삭제 오류:', error);
      return NextResponse.json(
        { error: '태그를 삭제하는 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('태그 삭제 오류:', error);
    return NextResponse.json(
      { error: '태그를 삭제하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}