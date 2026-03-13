// 홈 페이지: Notion CMS 링크 허브 — 서버 컴포넌트
// ISR 1시간 캐시로 Notion 데이터 페칭 후 LinkHubClient에 전달
import { fetchAllLinks } from "@/lib/notion"
import LinkHubClient from "@/components/LinkHubClient"
import type { LinkItem } from "@/types"

// ISR: 1시간마다 Notion 데이터 재검증 (코드 배포 없이 실시간 반영)
export const revalidate = 3600

export default async function Home() {
  // Notion API에서 활성화된 링크 가져오기 — 실패 시 빈 배열 폴백
  let links: LinkItem[] = []
  try {
    links = await fetchAllLinks()
  } catch (error) {
    console.error("Notion 링크 데이터 로딩 실패:", error)
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* 프로필 헤더 영역 */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">💾</div>
          <h1 className="text-2xl font-bold mb-2">링크 허브</h1>
          <p className="text-muted-foreground text-sm">
            Notion으로 관리하는 나의 디지털 명함
          </p>
        </div>

        {/* 카테고리 탭 필터 + 링크 카드 목록 — 클라이언트 컴포넌트 */}
        <LinkHubClient links={links} />
      </div>
    </main>
  )
}
