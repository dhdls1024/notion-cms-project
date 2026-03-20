// POST /api/revalidate — ISR 캐시 무효화 Route Handler
import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/revalidate
 * Authorization 헤더의 Bearer 토큰을 검증하고 홈 페이지 ISR 캐시를 즉시 무효화한다.
 * REVALIDATE_SECRET 환경변수로 무단 호출을 방지한다.
 */
export async function POST(request: NextRequest) {
  // Authorization 헤더에서 Bearer 토큰 추출
  const authHeader = request.headers.get("authorization")
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null

  // REVALIDATE_SECRET과 비교 — 불일치 시 401 반환
  const secret = process.env.REVALIDATE_SECRET
  if (!secret || token !== secret) {
    return NextResponse.json({ error: "인증되지 않은 요청입니다" }, { status: 401 })
  }

  // Next.js revalidatePath로 홈 페이지 ISR 캐시 즉시 무효화
  revalidatePath("/")

  return NextResponse.json({ revalidated: true })
}
