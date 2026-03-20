// zod 유효성 검사 스키마 — 서버(Route Handler)와 클라이언트(폼) 양쪽에서 재사용
import { z } from "zod"

/**
 * 링크 생성 스키마
 * 필수: title, url, category / 선택: icon(기본값 🔗), order(기본값 0)
 */
export const createLinkSchema = z.object({
  title: z.string().min(1, "제목을 입력하세요"),
  url: z.string().url("올바른 URL 형식이 아닙니다"),
  category: z.string().default(""),
  memo: z.string().default(""),
})

/**
 * 링크 수정 스키마
 * createLinkSchema에 active 필드 추가 후 모든 필드를 optional로 변환 (부분 업데이트)
 */
export const updateLinkSchema = createLinkSchema
  .extend({
    active: z.boolean().optional(),
    order: z.number().optional(), // 드래그 정렬 순서
  })
  .partial()

// output 타입 (default 적용 후) — API 호출 시 사용
export type CreateLinkSchema = z.infer<typeof createLinkSchema>
export type UpdateLinkSchema = z.infer<typeof updateLinkSchema>

// input 타입 (폼 입력값, default 적용 전) — react-hook-form useForm 제네릭에 사용
export type CreateLinkFormInput = z.input<typeof createLinkSchema>
export type UpdateLinkFormInput = z.input<typeof updateLinkSchema>
