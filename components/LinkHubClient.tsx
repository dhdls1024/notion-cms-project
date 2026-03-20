"use client"

// LinkHubClient: 카테고리 탭 필터 클라이언트 컴포넌트
// shadcn Tabs로 카테고리 필터링 + 반응형 그리드 링크 카드 목록
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import LinkCard from "@/components/LinkCard"
import AddLinkDialog from "@/components/AddLinkDialog"
import type { LinkItem } from "@/types"

interface LinkHubClientProps {
  links: LinkItem[]
}

// 전체 탭 값 상수
const ALL_CATEGORY = "전체"

export default function LinkHubClient({ links }: LinkHubClientProps) {
  const [activeTab, setActiveTab] = useState(ALL_CATEGORY)
  const router = useRouter()
  // useTransition으로 새로고침 중 로딩 상태 추적
  const [isPending, startTransition] = useTransition()

  // 서버 컴포넌트 재렌더링 — Notion DB 최신 데이터 즉시 반영
  function handleRefresh() {
    startTransition(() => {
      router.refresh()
      toast.success("새로고침 완료")
    })
  }

  // Set으로 카테고리 중복 제거 후 정렬
  const categories = [
    ALL_CATEGORY,
    ...Array.from(new Set(links.map((link) => link.category))).sort(),
  ]

  // 선택된 탭에 따라 링크 필터링
  const filteredLinks =
    activeTab === ALL_CATEGORY
      ? links
      : links.filter((link) => link.category === activeTab)

  return (
    <div className="w-full">
      {/* 링크 추가 + 새로고침 버튼 — 우측 정렬 */}
      <div className="flex justify-end gap-2 mb-4">
        {/* 새로고침: router.refresh()로 서버 컴포넌트 재실행 → Notion 최신 데이터 반영 */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isPending}
          aria-label="링크 목록 새로고침"
        >
          <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
        </Button>
        <AddLinkDialog />
      </div>

      {/* 카테고리 탭 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto w-full justify-start gap-1 mb-6">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* 탭 콘텐츠: 필터링된 링크 카드 그리드 */}
        <TabsContent value={activeTab}>
          {filteredLinks.length === 0 ? (
            // 빈 상태 안내 메시지
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-sm">해당 카테고리에 링크가 없습니다.</p>
            </div>
          ) : (
            // 반응형 그리드: 모바일 1열 / 태블릿·데스크탑 2열
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredLinks.map((link) => (
                <LinkCard key={link.id} link={link} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
