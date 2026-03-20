"use client"

// LinkCard: 링크 카드 클라이언트 컴포넌트
// 일반 URL → 새 탭으로 직접 이동 / 동적 URL(xxxxxx 포함) → 숫자 입력 모달 오픈
import { useState } from "react"
import { ExternalLink, Hash } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn, hasDynamicPlaceholder } from "@/lib/utils"
import CopyButton from "@/components/CopyButton"
import LinkCardActions from "@/components/LinkCardActions"
import DynamicUrlDialog from "@/components/DynamicUrlDialog"
import type { LinkItem } from "@/types"

interface LinkCardProps {
  link: LinkItem
}

export default function LinkCard({ link }: LinkCardProps) {
  const { title, url, category, memo } = link
  const isDynamic = hasDynamicPlaceholder(url)
  const [dialogOpen, setDialogOpen] = useState(false)

  // 카드 내부 레이아웃 — 두 경로에서 공통으로 사용
  const cardInner = (
    <Card
      className={cn(
        "py-4 transition-all duration-200",
        "hover:shadow-md hover:border-primary/30 group-focus-visible:border-primary/30"
      )}
    >
      <CardContent className="flex items-center gap-3 px-4">
        {/* 제목 + 카테고리(우측 배지) + 메모 영역 */}
        <div className="flex-1 min-w-0">
          {/* 제목 행: 이름 + 카테고리 배지 */}
          <div className="flex items-center gap-2 min-w-0">
            <p className="font-medium text-sm truncate">{title}</p>
            {category && (
              <span className="shrink-0 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {category}
              </span>
            )}
          </div>
          {/* 메모가 있을 때만 표시 */}
          {memo && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">{memo}</p>
          )}
        </div>

        {/* 동적 URL이면 Hash 아이콘, 일반 URL이면 ExternalLink 아이콘 */}
        {isDynamic ? (
          // Hash 아이콘 — 숫자 입력이 필요함을 시각적으로 표시
          <Hash className="h-4 w-4 shrink-0 text-muted-foreground opacity-60" />
        ) : (
          <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        )}

        {/* URL 복사 버튼 — 클라이언트 컴포넌트 */}
        <CopyButton url={url} />

        {/* 수정/삭제 액션 버튼 — 클라이언트 컴포넌트 */}
        <LinkCardActions link={link} />
      </CardContent>
    </Card>
  )

  // 동적 URL: div 클릭 → Dialog 오픈
  if (isDynamic) {
    return (
      <>
        <div
          role="link"
          tabIndex={0}
          className="group block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
          aria-label={`${title} — 숫자를 입력해 이동`}
          onClick={() => setDialogOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && setDialogOpen(true)}
        >
          {cardInner}
        </div>
        {/* 숫자 입력 모달 */}
        <DynamicUrlDialog
          url={url}
          title={title}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </>
    )
  }

  // 일반 URL: 기존과 동일하게 새 탭으로 직접 이동
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
      aria-label={`${title} 링크 열기`}
    >
      {cardInner}
    </a>
  )
}
