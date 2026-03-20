// PATCH /api/links/[id] — 링크 수정, DELETE /api/links/[id] — 링크 삭제 Route Handler
import { NextRequest, NextResponse } from "next/server"
import { updateLink, deleteLink } from "@/lib/notion"
import { updateLinkSchema } from "@/lib/validations"

/**
 * PATCH /api/links/[id]
 * 요청 바디를 파싱하고 updateLinkSchema로 유효성 검사 후 지정된 링크를 부분 업데이트한다.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 15에서 params는 Promise — await로 꺼내야 함
    const { id } = await params

    // 요청 바디를 JSON으로 파싱
    const body = await request.json()

    // zod safeParse로 부분 업데이트 유효성 검사
    const parsed = updateLinkSchema.safeParse(body)
    if (!parsed.success) {
      // 유효성 검사 실패: 400 Bad Request + 에러 상세 반환
      return NextResponse.json(
        {
          error: "입력값이 올바르지 않습니다",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    // Notion DB의 해당 페이지 속성 부분 업데이트
    const link = await updateLink(id, parsed.data)

    // 수정 성공: 200 OK + 업데이트된 링크 데이터 반환
    return NextResponse.json({ data: link })
  } catch (error) {
    // 예기치 못한 서버 오류 처리
    console.error("[PATCH /api/links/[id]] 오류:", error)
    return NextResponse.json(
      { error: "링크 수정 중 서버 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/links/[id]
 * 지정된 Notion 페이지를 아카이브(소프트 삭제)한다.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 15에서 params는 Promise — await로 꺼내야 함
    const { id } = await params

    // Notion 페이지를 archived: true로 소프트 삭제
    await deleteLink(id)

    // 삭제 성공: 200 OK + success 플래그 반환
    return NextResponse.json({ success: true })
  } catch (error) {
    // 예기치 못한 서버 오류 처리
    console.error("[DELETE /api/links/[id]] 오류:", error)
    return NextResponse.json(
      { error: "링크 삭제 중 서버 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
