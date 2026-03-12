"use client"

// usehooks-ts 커스텀 훅 데모 페이지 — 클라이언트 컴포넌트
import { useState, useEffect } from "react"
import {
  useLocalStorage,
  useDebounceValue,
  useMediaQuery,
  useToggle,
  useCountdown,
} from "usehooks-ts"
import { PageHeader } from "@/components/common/page-header"
import { Container } from "@/components/layout/container"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

// 훅 데모용 상수 (매직넘버 금지)
const DEBOUNCE_DELAY_MS = 500
const COUNTDOWN_SECONDS = 10
const LOCALSTORAGE_KEY = "demo-username"

export default function HooksPage() {
  return (
    <main>
      <PageHeader
        title="usehooks-ts 예제"
        description="자주 사용되는 커스텀 훅들의 인터랙티브 데모입니다."
        tags={["훅", "유틸리티"]}
      />

      <section className="py-12">
        <Container>
          <div className="mx-auto max-w-2xl space-y-12">
            <UseLocalStorageDemo />
            <Separator />
            <UseDebounceDemo />
            <Separator />
            <UseMediaQueryDemo />
            <Separator />
            <UseToggleDemo />
            <Separator />
            <UseCountdownDemo />
          </div>
        </Container>
      </section>
    </main>
  )
}

// useLocalStorage — 새로고침 후에도 값이 유지됨
// isMounted: 서버와 클라이언트의 localStorage 초기값 불일치로 인한 hydration 오류 방지
function UseLocalStorageDemo() {
  const [storedName, setStoredName] = useLocalStorage(LOCALSTORAGE_KEY, "")
  const [input, setInput] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // localStorage 초기값과 서버 렌더 불일치로 인한 hydration 오류 방지
    setIsMounted(true)
  }, [])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">useLocalStorage</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          값을 저장하고 페이지를 새로고침해도 유지됩니다.
        </p>
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="저장할 이름 입력"
          className="max-w-64"
        />
        <Button onClick={() => { setStoredName(input); setInput("") }}>저장</Button>
        <Button variant="outline" onClick={() => setStoredName("")}>초기화</Button>
      </div>
      {/* 마운트 전에는 서버와 동일한 초기값 표시 — hydration mismatch 방지 */}
      <p className="text-sm">
        저장된 값:{" "}
        <code className="rounded bg-muted px-2 py-1 text-xs">
          {isMounted ? (storedName || "(없음)") : "(없음)"}
        </code>
      </p>
    </div>
  )
}

// useDebounceValue — 입력 후 일정 시간 뒤에 값이 업데이트됨 (v3: 튜플 반환)
function UseDebounceDemo() {
  const [text, setText] = useState("")
  const [debouncedText] = useDebounceValue(text, DEBOUNCE_DELAY_MS)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">useDebounce</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          입력 후 {DEBOUNCE_DELAY_MS}ms가 지나야 디바운스 값이 업데이트됩니다.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="debounce-input">입력</Label>
        <Input
          id="debounce-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="빠르게 입력해보세요"
          className="max-w-64"
        />
      </div>
      <div className="space-y-1 text-sm">
        <p>
          실시간 값:{" "}
          <code className="rounded bg-muted px-2 py-1 text-xs">{text || "(없음)"}</code>
        </p>
        <p>
          디바운스 값:{" "}
          <code className="rounded bg-muted px-2 py-1 text-xs">{debouncedText || "(없음)"}</code>
        </p>
      </div>
    </div>
  )
}

// useMediaQuery — 미디어 쿼리 매칭 여부를 반환
// isMounted: 서버는 window가 없어 항상 false → 클라이언트 실제값과 불일치 → hydration 오류 방지
function UseMediaQueryDemo() {
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const isTablet = useMediaQuery("(min-width: 768px)")
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // window 없는 SSR과 클라이언트 미디어쿼리 결과 불일치 hydration 오류 방지
    setIsMounted(true)
  }, [])

  // 마운트 전에는 서버와 동일하게 모두 false 처리
  const desktop = isMounted && isDesktop
  const tablet = isMounted && isTablet
  const darkMode = isMounted && isDarkMode

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">useMediaQuery</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          현재 뷰포트와 미디어 쿼리 매칭 상태입니다.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant={desktop ? "default" : "outline"}>
          데스크탑 (≥1024px): {desktop ? "✓" : "✗"}
        </Badge>
        <Badge variant={tablet ? "default" : "outline"}>
          태블릿 (≥768px): {tablet ? "✓" : "✗"}
        </Badge>
        <Badge variant={darkMode ? "default" : "outline"}>
          다크모드 선호: {darkMode ? "✓" : "✗"}
        </Badge>
      </div>
    </div>
  )
}

// useToggle — boolean 값을 토글하는 훅
function UseToggleDemo() {
  const [isOn, toggle] = useToggle(false)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">useToggle</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          boolean 값을 간단하게 토글합니다.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => toggle()}>
          토글
        </Button>
        <span className="text-sm">
          상태:{" "}
          <Badge variant={isOn ? "default" : "secondary"}>
            {isOn ? "ON" : "OFF"}
          </Badge>
        </span>
      </div>
    </div>
  )
}

// useCountdown — 카운트다운 타이머 훅
function UseCountdownDemo() {
  const [countStart, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: COUNTDOWN_SECONDS,
      intervalMs: 1000,
    })

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">useCountdown</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {COUNTDOWN_SECONDS}초 카운트다운 타이머입니다.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-3xl font-bold tabular-nums">{countStart}</span>
        <div className="flex gap-2">
          <Button size="sm" onClick={startCountdown}>시작</Button>
          <Button size="sm" variant="outline" onClick={stopCountdown}>정지</Button>
          <Button size="sm" variant="outline" onClick={resetCountdown}>초기화</Button>
        </div>
      </div>
    </div>
  )
}
