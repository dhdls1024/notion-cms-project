// PATCH /api/links/reorder — 여러 링크의 order를 한 번에 갱신
// 드래그 앤 드롭 완료 후 변경된 항목들의 순서를 Notion DB에 일괄 반영
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { updateLink } from "@/lib/notion"

// 요청 바디 스키마 — [{ id, order }, ...] 배열
const reorderSchema = z.array(
  z.object({
    id: z.string(),
    order: z.number(),
  })
)

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const items = reorderSchema.parse(body)

    // Promise.all로 병렬 업데이트 — 변경 항목이 2~4개 수준이므로 Rate Limit 안전
    await Promise.all(items.map(({ id, order }) => updateLink(id, { order })))

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "잘못된 요청 형식입니다" }, { status: 400 })
    }
    console.error("링크 순서 업데이트 실패:", error)
    return NextResponse.json({ error: "순서 저장에 실패했습니다" }, { status: 500 })
  }
}
