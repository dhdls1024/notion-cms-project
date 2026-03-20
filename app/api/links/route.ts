// POST /api/links — 새 링크 생성 Route Handler
import { NextRequest, NextResponse } from "next/server"
import { createLink } from "@/lib/notion"
import { createLinkSchema } from "@/lib/validations"

/**
 * POST /api/links
 * 요청 바디를 파싱하고 createLinkSchema로 유효성 검사 후 Notion DB에 링크를 생성한다.
 */
export async function POST(request: NextRequest) {
  try {
    // 요청 바디를 JSON으로 파싱
    const body = await request.json()

    // zod safeParse로 유효성 검사 — 실패해도 예외를 던지지 않고 success: false 반환
    const parsed = createLinkSchema.safeParse(body)
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

    // Notion DB에 새 링크 페이지 생성
    const link = await createLink(parsed.data)

    // 생성 성공: 201 Created + 생성된 링크 데이터 반환
    return NextResponse.json({ data: link }, { status: 201 })
  } catch (error) {
    // 예기치 못한 서버 오류 처리
    console.error("[POST /api/links] 오류:", error)
    return NextResponse.json(
      { error: "링크 생성 중 서버 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
