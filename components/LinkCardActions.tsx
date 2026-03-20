"use client"

// 링크 카드 액션 영역 — 수정/삭제 버튼을 묶고 카드 <a> 태그 이벤트 버블링 차단
import type { LinkItem } from "@/types"
import EditLinkDialog from "@/components/EditLinkDialog"
import DeleteLinkButton from "@/components/DeleteLinkButton"

interface LinkCardActionsProps {
  link: LinkItem
}

export default function LinkCardActions({ link }: LinkCardActionsProps) {
  return (
    <div
      className="flex items-center gap-1"
      onClick={(e) => {
        // 카드 전체가 <a> 태그로 감싸져 있으므로
        // 수정/삭제 버튼 클릭 시 외부 URL로 이동하는 것을 차단
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <EditLinkDialog link={link} />
      <DeleteLinkButton id={link.id} title={link.title} />
    </div>
  )
}
