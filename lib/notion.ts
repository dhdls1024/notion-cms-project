// Notion API 레이어 — @notionhq/client SDK를 사용한 데이터 페칭
import { Client } from "@notionhq/client"
import type { LinkItem } from "@/types"

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
 * 아이콘 값 정규화
 * URL이면 그대로 반환, 이모지/텍스트면 그대로 반환, 빈 값이면 폴백 '🔗'
 */
function normalizeIcon(icon: string | null | undefined): string {
  if (!icon || icon.trim() === "") return "🔗"
  return icon.trim()
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

  // dataSources.query로 CheckBox=true 필터 + Order 오름차순 정렬
  const response = await fetchWithRetry(() =>
    notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        property: "CheckBox",
        checkbox: {
          equals: true, // active=true 항목만 가져옴
        },
      },
      sorts: [
        {
          property: "Order",
          direction: "ascending", // Order 오름차순 정렬
        },
      ],
    })
  )

  // Notion API 응답을 LinkItem 타입으로 변환
  return response.results
    .map((page) => {
      // Notion API 응답 타입 가드 — properties 필드가 있는 페이지만 처리
      if (
        !page ||
        typeof page !== "object" ||
        !("properties" in page) ||
        !page.properties ||
        typeof page.properties !== "object"
      )
        return null

      const props = page.properties as Record<string, Record<string, unknown>>

      // Title 속성 파싱 (type: "title")
      const titleProp = props["Name"] as { type: string; title: Array<{ plain_text: string }> } | undefined
      const title =
        titleProp?.type === "title"
          ? (titleProp.title[0]?.plain_text ?? "")
          : ""

      // URL 속성 파싱 (type: "url")
      const urlProp = props["URL"] as { type: string; url: string | null } | undefined
      const url = urlProp?.type === "url" ? (urlProp.url ?? "") : ""

      // Icon 속성 파싱 (type: "rich_text")
      const iconProp = props["Icon"] as { type: string; rich_text: Array<{ plain_text: string }> } | undefined
      const iconRaw =
        iconProp?.type === "rich_text"
          ? (iconProp.rich_text[0]?.plain_text ?? "")
          : ""
      const icon = normalizeIcon(iconRaw)

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

      // Order 속성 파싱 (type: "number")
      const orderProp = props["Order"] as { type: string; number: number | null } | undefined
      const order =
        orderProp?.type === "number" ? (orderProp.number ?? 0) : 0

      // CheckBox 속성 파싱 (type: "checkbox")
      const activeProp = props["CheckBox"] as { type: string; checkbox: boolean } | undefined
      const active =
        activeProp?.type === "checkbox" ? activeProp.checkbox : false

      // URL이 없는 항목은 제외
      if (!url) return null

      const pageId = typeof page.id === "string" ? page.id : ""

      return {
        id: pageId,
        title,
        url,
        icon,
        category,
        active,
        order,
      } satisfies LinkItem
    })
    .filter((item): item is LinkItem => item !== null)
}
