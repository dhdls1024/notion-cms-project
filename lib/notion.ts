// Notion API 레이어 — @notionhq/client SDK를 사용한 데이터 페칭
import { Client } from "@notionhq/client"
import type { LinkItem, CreateLinkInput, UpdateLinkInput } from "@/types"

// Rate Limit 재시도 설정 상수
const MAX_RETRY_COUNT = 3
const BASE_RETRY_DELAY_MS = 1000

/**
 * Notion Client 초기화
 * 환경변수 유효성 검사 후 Client 인스턴스 반환
 */
function createNotionClient(): Client {
  const apiKey = process.env.NOTION_API_KEY
  if (!apiKey) {
    throw new Error("NOTION_API_KEY 환경변수가 설정되지 않았습니다.")
  }
  // @notionhq/client의 Client 클래스로 Notion API 인증
  return new Client({ auth: apiKey })
}

/**
 * 지수 백오프로 Rate Limit 재시도
 * 1s → 2s → 4s 간격으로 최대 3회 재시도
 */
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retryCount = 0
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    // Rate Limit(429) 또는 일시적 오류 시 재시도
    const isRateLimited =
      error instanceof Error && error.message.includes("rate_limited")
    if (retryCount < MAX_RETRY_COUNT && isRateLimited) {
      // 지수 백오프: 1s, 2s, 4s
      const delayMs = BASE_RETRY_DELAY_MS * Math.pow(2, retryCount)
      await new Promise((resolve) => setTimeout(resolve, delayMs))
      return fetchWithRetry(fn, retryCount + 1)
    }
    throw error
  }
}

/**
 * Notion 페이지 객체를 LinkItem으로 변환하는 헬퍼 (내부 전용)
 * pages.create / pages.update / dataSources.query 응답에서 공통으로 재사용
 * URL이 없거나 파싱 불가한 페이지는 null 반환
 */
function normalizePageToLinkItem(page: Record<string, unknown>): LinkItem | null {
  // properties 필드가 있는 페이지만 처리
  if (
    !page ||
    !("properties" in page) ||
    !page.properties ||
    typeof page.properties !== "object"
  )
    return null

  const props = page.properties as Record<string, Record<string, unknown>>

  // Name 속성 파싱 (type: "title")
  const titleProp = props["Name"] as { type: string; title: Array<{ plain_text: string }> } | undefined
  const title =
    titleProp?.type === "title" ? (titleProp.title[0]?.plain_text ?? "") : ""

  // URL 속성 파싱 (type: "url")
  const urlProp = props["URL"] as { type: string; url: string | null } | undefined
  const url = urlProp?.type === "url" ? (urlProp.url ?? "") : ""

  // URL이 없는 항목은 null 반환
  if (!url) return null

  // Category 속성 파싱 — select 또는 rich_text 타입 모두 처리
  const categoryProp = props["Category"] as
    | { type: "select"; select: { name: string } | null }
    | { type: "rich_text"; rich_text: Array<{ plain_text: string }> }
    | undefined
  const category =
    categoryProp?.type === "select"
      ? (categoryProp.select?.name ?? "기타")
      : categoryProp?.type === "rich_text"
        ? (categoryProp.rich_text[0]?.plain_text ?? "기타")
        : "기타"

  // CheckBox 속성 파싱 (type: "checkbox")
  const activeProp = props["CheckBox"] as { type: string; checkbox: boolean } | undefined
  const active = activeProp?.type === "checkbox" ? activeProp.checkbox : false

  // Memo 속성 파싱 (type: "rich_text") — 메모/설명 텍스트
  const memoProp = props["Memo"] as { type: string; rich_text: Array<{ plain_text: string }> } | undefined
  const memo = memoProp?.type === "rich_text" ? (memoProp.rich_text[0]?.plain_text ?? "") : ""

  // Order 속성 파싱 (type: "number") — 드래그 정렬 순서, 미설정 시 0 폴백
  const orderProp = props["Order"] as { type: string; number: number | null } | undefined
  const order = orderProp?.type === "number" && orderProp.number != null ? orderProp.number : 0

  const pageId = typeof page.id === "string" ? page.id : ""

  return { id: pageId, title, url, category, active, memo, order } satisfies LinkItem
}

/**
 * Notion DB에서 활성화된 링크 목록 가져오기
 * CheckBox=true 필터 + Order 오름차순 정렬 → LinkItem[] 반환
 */
export async function fetchAllLinks(): Promise<LinkItem[]> {
  const databaseId = process.env.NOTION_DATABASE_ID
  if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID 환경변수가 설정되지 않았습니다.")
  }

  const notion = createNotionClient()

  // @notionhq/client v5: databases.query 제거됨 → dataSources.query 사용
  // databases.retrieve로 DB의 data_source_id를 먼저 조회
  const database = await fetchWithRetry(() =>
    notion.databases.retrieve({ database_id: databaseId })
  )

  // DatabaseObjectResponse에서 data_sources 배열의 첫 번째 ID 추출
  const dataSourceId =
    "data_sources" in database && database.data_sources.length > 0
      ? database.data_sources[0].id
      : databaseId // 폴백: data_sources가 없으면 databaseId 그대로 사용

  // dataSources.query로 CheckBox=true 필터 — Order 정렬은 JS에서 처리 (DB 속성 미존재 시 에러 방지)
  const response = await fetchWithRetry(() =>
    notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        property: "CheckBox",
        checkbox: {
          equals: true, // active=true 항목만 가져옴
        },
      },
    })
  )

  // Notion API 응답을 normalizePageToLinkItem 헬퍼로 LinkItem 타입으로 변환 후 order 오름차순 정렬
  return response.results
    .map((page) => normalizePageToLinkItem(page as Record<string, unknown>))
    .filter((item): item is LinkItem => item !== null)
    .sort((a, b) => a.order - b.order) // Order 오름차순 정렬
}

/**
 * Notion DB에 새 링크 페이지 생성
 * active(CheckBox)는 기본값 true로 설정
 */
export async function createLink(input: CreateLinkInput): Promise<LinkItem> {
  const databaseId = process.env.NOTION_DATABASE_ID
  if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID 환경변수가 설정되지 않았습니다.")
  }

  const notion = createNotionClient()

  // notion.pages.create로 Notion DB에 새 페이지 추가
  // Category, Order는 Notion DB에서 rich_text 타입으로 설정되어 있음
  const page = await fetchWithRetry(() =>
    notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: { title: [{ text: { content: input.title } }] },
        URL: { url: input.url },
        Category: { rich_text: [{ text: { content: input.category } }] },
        CheckBox: { checkbox: true }, // 생성 시 기본값 active=true
        Memo: { rich_text: [{ text: { content: input.memo ?? "" } }] },
      },
    })
  )

  const item = normalizePageToLinkItem(page as Record<string, unknown>)
  if (!item) {
    throw new Error("생성된 페이지를 LinkItem으로 변환할 수 없습니다.")
  }
  return item
}

/**
 * Notion 페이지 속성 부분 업데이트
 * undefined 필드는 생략하여 선택적 업데이트 수행
 */
export async function updateLink(id: string, input: UpdateLinkInput): Promise<LinkItem> {
  const notion = createNotionClient()

  // 입력 값이 있는 필드만 properties 객체에 포함 (부분 업데이트)
  const properties: Record<string, unknown> = {}

  if (input.title !== undefined) {
    properties["Name"] = { title: [{ text: { content: input.title } }] }
  }
  if (input.url !== undefined) {
    properties["URL"] = { url: input.url }
  }
  if (input.category !== undefined) {
    // Category는 Notion DB에서 rich_text 타입
    properties["Category"] = { rich_text: [{ text: { content: input.category } }] }
  }
  if (input.active !== undefined) {
    properties["CheckBox"] = { checkbox: input.active }
  }
  if (input.memo !== undefined) {
    properties["Memo"] = { rich_text: [{ text: { content: input.memo } }] }
  }
  if (input.order !== undefined) {
    // Order는 Number 타입 — 드래그 정렬 순서 업데이트
    properties["Order"] = { number: input.order }
  }

  // notion.pages.update로 지정된 페이지 ID의 속성 업데이트
  const page = await fetchWithRetry(() =>
    notion.pages.update({
      page_id: id,
      properties: properties as Parameters<typeof notion.pages.update>[0]["properties"],
    })
  )

  const item = normalizePageToLinkItem(page as Record<string, unknown>)
  if (!item) {
    throw new Error("업데이트된 페이지를 LinkItem으로 변환할 수 없습니다.")
  }
  return item
}

/**
 * Notion 페이지를 아카이브(소프트 삭제)
 * Notion API는 실제 삭제 대신 archived: true로 숨김 처리
 */
export async function deleteLink(id: string): Promise<void> {
  const notion = createNotionClient()

  // notion.pages.update로 archived: true 설정 — Notion의 소프트 삭제 방식
  await fetchWithRetry(() =>
    notion.pages.update({
      page_id: id,
      archived: true,
    })
  )
}
