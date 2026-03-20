"use client"

// LinkHubClient: 카테고리 탭 필터 + 드래그 앤 드롭 정렬 클라이언트 컴포넌트
import { useState, useTransition, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import LinkCard from "@/components/LinkCard"
import AddLinkDialog from "@/components/AddLinkDialog"
import { useReorderLinks } from "@/hooks/useLinks"
import type { LinkItem } from "@/types"

interface LinkHubClientProps {
  links: LinkItem[]
}

// 전체 탭 값 상수
const ALL_CATEGORY = "전체"

export default function LinkHubClient({ links }: LinkHubClientProps) {
  const [activeTab, setActiveTab] = useState(ALL_CATEGORY)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // 낙관적 업데이트용 로컬 링크 state — 드래그 시 즉시 UI 반영
  const [localLinks, setLocalLinks] = useState(links)
  // 롤백용 스냅샷 ref
  const previousLinksRef = useRef(localLinks)

  // props(서버 새로고침 후 데이터) 변경 시 로컬 state 동기화
  useEffect(() => {
    setLocalLinks(links)
  }, [links])

  // useReorderLinks: PATCH /api/links/reorder로 order 일괄 업데이트
  const reorderMutation = useReorderLinks()

  // 서버 컴포넌트 재렌더링 — Notion DB 최신 데이터 즉시 반영
  function handleRefresh() {
    startTransition(() => {
      router.refresh()
      toast.success("새로고침 완료")
    })
  }

  // dnd-kit sensors 설정
  // PointerSensor: 5px 이상 이동해야 드래그 시작 — 클릭과 드래그 구분
  // TouchSensor: 250ms 홀드 or 5px 이동 — 모바일 스크롤과 드래그 구분
  // KeyboardSensor: 방향키로 순서 변경 (접근성)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // 드래그 완료 핸들러 — 낙관적 업데이트 후 백그라운드에서 Notion DB 동기화
  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return

    setLocalLinks((prev) => {
      // 현재 탭의 필터링된 링크 기준으로 재정렬
      const filtered = getFilteredLinks(prev)
      const oldIndex = filtered.findIndex((l) => l.id === active.id)
      const newIndex = filtered.findIndex((l) => l.id === over.id)

      if (oldIndex === -1 || newIndex === -1) return prev

      const reorderedFiltered = arrayMove(filtered, oldIndex, newIndex)

      // 재정렬된 항목에 새 order 값 할당 (10 간격)
      const filteredWithNewOrder = reorderedFiltered.map((l, i) => ({
        ...l,
        order: (i + 1) * 10,
      }))

      // prev 전체에서 변경된 항목 교체
      const next = prev.map(
        (l) => filteredWithNewOrder.find((f) => f.id === l.id) ?? l
      )

      // 변경된 항목만 추출해 API 호출 (불필요한 Notion 업데이트 방지)
      const changed = filteredWithNewOrder.filter((l) => {
        const orig = prev.find((o) => o.id === l.id)
        return orig?.order !== l.order
      })

      if (changed.length > 0) {
        previousLinksRef.current = prev // 롤백용 스냅샷 저장
        reorderMutation.mutate(
          changed.map((l) => ({ id: l.id, order: l.order })),
          {
            onError: () => {
              // API 실패 시 드래그 전 상태로 롤백
              setLocalLinks(previousLinksRef.current)
              toast.error("순서 저장에 실패했습니다")
            },
          }
        )
      }

      return next
    })
  }

  // 현재 탭 기준 필터링된 링크 반환 헬퍼
  function getFilteredLinks(allLinks: LinkItem[]) {
    return activeTab === ALL_CATEGORY
      ? allLinks
      : allLinks.filter((link) => link.category === activeTab)
  }

  // Set으로 카테고리 중복 제거 후 정렬 — 빈 카테고리는 탭에서 제외
  const categories = [
    ALL_CATEGORY,
    ...Array.from(new Set(localLinks.map((link) => link.category)))
      .filter((c) => c !== "")
      .sort(),
  ]

  const filteredLinks = getFilteredLinks(localLinks)

  return (
    <div className="w-full">
      {/* 링크 추가 + 새로고침 버튼 — 우측 정렬 */}
      <div className="flex justify-end gap-2 mb-4">
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

        {/* 탭 콘텐츠: 드래그 앤 드롭 정렬 + 링크 카드 그리드 */}
        <TabsContent value={activeTab}>
          {filteredLinks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-sm">해당 카테고리에 링크가 없습니다.</p>
            </div>
          ) : (
            // DndContext: 드래그 앤 드롭 컨텍스트
            // SortableContext: 정렬 가능한 항목 목록 제공
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredLinks.map((l) => l.id)}
                strategy={verticalListSortingStrategy}
              >
                {/* 반응형 그리드: 모바일 1열 / 태블릿·데스크탑 2열 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredLinks.map((link) => (
                    <LinkCard key={link.id} link={link} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
