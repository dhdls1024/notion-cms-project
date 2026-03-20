"use client"

// DragHandle: 드래그 앤 드롭 핸들 버튼
// useSortable의 listeners/attributes를 이 버튼에만 연결해 링크 클릭과 드래그를 명확히 구분
import { GripVertical } from "lucide-react"
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities"
import type { DraggableAttributes } from "@dnd-kit/core"

interface DragHandleProps {
  listeners: SyntheticListenerMap | undefined
  attributes: DraggableAttributes
}

export default function DragHandle({ listeners, attributes }: DragHandleProps) {
  return (
    <button
      {...listeners}
      {...attributes}
      // 핸들 클릭 시 <a> 태그 링크 이동 차단
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      aria-label="드래그하여 순서 변경"
      className="cursor-grab active:cursor-grabbing h-8 w-5 shrink-0 flex items-center justify-center text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity touch-none"
    >
      {/* GripVertical: lucide-react의 점 6개 드래그 핸들 아이콘 */}
      <GripVertical className="h-4 w-4" />
    </button>
  )
}
