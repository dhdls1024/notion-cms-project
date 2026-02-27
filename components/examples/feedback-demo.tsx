"use client"

// Alert / Sonner 토스트 / Progress / Skeleton 피드백 컴포넌트 데모
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { AlertCircle, CheckCircle, Info } from "lucide-react"

// 프로그레스 바 초기값 및 증가량 상수
const PROGRESS_INITIAL = 0
const PROGRESS_MAX = 100
const PROGRESS_STEP = 10
const PROGRESS_INTERVAL_MS = 200

export function FeedbackDemo() {
  const [progress, setProgress] = useState(PROGRESS_INITIAL)
  const [isLoading, setIsLoading] = useState(false)

  // 프로그레스 바 시뮬레이션 — 일정 간격으로 값을 증가시킴
  function startProgress() {
    setProgress(PROGRESS_INITIAL)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= PROGRESS_MAX) {
          clearInterval(interval)
          return PROGRESS_MAX
        }
        return prev + PROGRESS_STEP
      })
    }, PROGRESS_INTERVAL_MS)
  }

  // Skeleton 로딩 상태 토글
  function toggleLoading() {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Alert 변형들 */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Alert 컴포넌트</h3>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>기본 알림</AlertTitle>
          <AlertDescription>
            일반적인 정보를 전달하는 기본 Alert입니다.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>오류 발생</AlertTitle>
          <AlertDescription>
            작업 중 오류가 발생했습니다. 다시 시도해주세요.
          </AlertDescription>
        </Alert>
      </div>

      {/* Sonner 토스트 버튼들 */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Sonner 토스트</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("저장되었습니다!", { description: "변경사항이 성공적으로 저장되었습니다." })}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            성공 토스트
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.error("오류 발생", { description: "작업을 완료할 수 없습니다." })}
          >
            <AlertCircle className="mr-2 h-4 w-4" />
            오류 토스트
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info("알림", { description: "새로운 업데이트가 있습니다." })}
          >
            <Info className="mr-2 h-4 w-4" />
            정보 토스트
          </Button>
        </div>
      </div>

      {/* Progress 바 */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Progress 바</h3>
        <Progress value={progress} className="h-2" />
        <Button variant="outline" size="sm" onClick={startProgress}>
          진행 시작
        </Button>
      </div>

      {/* Skeleton 로딩 */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Skeleton 로딩</h3>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <p>실제 콘텐츠가 표시됩니다.</p>
            <p className="text-muted-foreground">로딩 버튼을 눌러 Skeleton을 확인하세요.</p>
          </div>
        )}
        <Button variant="outline" size="sm" onClick={toggleLoading}>
          로딩 시뮬레이션
        </Button>
      </div>
    </div>
  )
}
