"use client"

// dynamic import 데모용 카운터 컴포넌트 — 클라이언트 전용
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function DynamicCounter() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" size="sm" onClick={() => setCount((c) => c - 1)}>
        −
      </Button>
      <span className="w-12 text-center text-2xl font-bold tabular-nums">{count}</span>
      <Button variant="outline" size="sm" onClick={() => setCount((c) => c + 1)}>
        +
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setCount(0)}>
        초기화
      </Button>
    </div>
  )
}
