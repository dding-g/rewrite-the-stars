import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/shared/libs/supabase';

/**
 * 저장소 태그 관리 엔드포인트
 * POST /api/repositories/[id]/tags - 저장소에 태그 추가
 * DELETE /api/repositories/[id]/tags - 저장소에서 태그 제거
 */

// 저장소에 태그 추가
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: repositoryId } = await params;
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tagId } = body;

    if (!tagId) {
      return NextResponse.json(
        { error: '태그 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // 저장소 소유권 확인
    const { data: repository, error: repoError } = await supabase
      .from('repositories')
      .select('id')
      .eq('id', repositoryId)
      .eq('user_id', userId)
      .single();

    if (repoError || !repository) {
      return NextResponse.json(
        { error: '저장소를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 태그 소유권 확인
    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .select('id')
      .eq('id', tagId)
      .eq('user_id', userId)
      .single();

    if (tagError || !tag) {
      return NextResponse.json(
        { error: '태그를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 이미 연결된 태그인지 확인
    const { data: existingRelation } = await supabase
      .from('repository_tags')
      .select('id')
      .eq('repository_id', repositoryId)
      .eq('tag_id', tagId)
      .single();

    if (existingRelation) {
      return NextResponse.json(
        { error: '이미 추가된 태그입니다.' },
        { status: 409 }
      );
    }

    // 저장소-태그 관계 생성
    const { data: relation, error } = await supabase
      .from('repository_tags')
      .insert({
        repository_id: parseInt(repositoryId),
        tag_id: tagId,
      })
      .select()
      .single();

    if (error) {
      console.error('태그 추가 오류:', error);
      return NextResponse.json(
        { error: '태그를 추가하는 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ relation }, { status: 201 });
  } catch (error) {
    console.error('태그 추가 오류:', error);
    return NextResponse.json(
      { error: '태그를 추가하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 저장소에서 태그 제거
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: repositoryId } = await params;
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get('tagId');

    if (!tagId) {
      return NextResponse.json(
        { error: '태그 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // 저장소 소유권 확인
    const { data: repository, error: repoError } = await supabase
      .from('repositories')
      .select('id')
      .eq('id', repositoryId)
      .eq('user_id', userId)
      .single();

    if (repoError || !repository) {
      return NextResponse.json(
        { error: '저장소를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 저장소-태그 관계 삭제
    const { error } = await supabase
      .from('repository_tags')
      .delete()
      .eq('repository_id', repositoryId)
      .eq('tag_id', tagId);

    if (error) {
      console.error('태그 제거 오류:', error);
      return NextResponse.json(
        { error: '태그를 제거하는 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('태그 제거 오류:', error);
    return NextResponse.json(
      { error: '태그를 제거하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}