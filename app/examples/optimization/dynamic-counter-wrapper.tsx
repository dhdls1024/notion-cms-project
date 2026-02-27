"use client"

// dynamic import with ssr:false는 클라이언트 컴포넌트에서만 사용 가능
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

// DynamicCounter를 클라이언트 전용으로 지연 로드 (SSR 제외)
const DynamicCounter = dynamic(
  () => import("./dynamic-counter").then((mod) => ({ default: mod.DynamicCounter })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-12 w-48" />,
  }
)

export function DynamicCounterWrapper() {
  return <DynamicCounter />
}
