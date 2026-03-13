# Development Guidelines — Notion CMS 링크 허브

## 프로젝트 개요

- Notion DB를 CMS로 사용하는 단일 페이지 링크 허브 (디지털 명함)
- Next.js 16 App Router + React 19 + TypeScript 5
- Tailwind CSS 4 (PostCSS, `@import "tailwindcss"` 방식 — `tailwind.config.js` 없음)
- shadcn/ui + next-themes + sonner + @notionhq/client + TanStack Query

---

## 디렉토리 및 파일 역할

| 경로 | 역할 | 수정 가능 |
|------|------|-----------|
| `app/page.tsx` | 홈 페이지 — Notion 데이터 연동 진입점 | ✅ |
| `app/layout.tsx` | 루트 레이아웃 (ThemeProvider, QueryProvider, Header, Toaster) | ✅ (신중히) |
| `app/loading.tsx` | Next.js 자동 로딩 UI (Skeleton) | ✅ |
| `app/examples/**` | 스타터킷 예제 파일 — **절대 수정/삭제 금지** | ❌ |
| `components/ui/**` | shadcn/ui 자동 생성 컴포넌트 — **직접 수정 금지** | ❌ |
| `components/layout/` | Header, Footer, Container, MobileNav | ✅ |
| `components/sections/` | HeroSection 등 페이지 섹션 컴포넌트 | ✅ |
| `components/common/` | ThemeToggle, BackButton, PageHeader 등 공통 컴포넌트 | ✅ |
| `components/` (루트) | LinkCard, CopyButton, LinkHubClient 등 기능 컴포넌트 | ✅ |
| `lib/notion.ts` | Notion API 레이어 — 유일한 Notion 통신 진입점 | ✅ |
| `lib/constants.ts` | 모든 정적 상수 (NAV_ITEMS, SITE_CONFIG, ROUTES 등) | ✅ |
| `lib/utils.ts` | `cn()` 유틸리티만 포함 — 다른 함수 추가 금지 | ❌ (추가 금지) |
| `types/index.ts` | 공유 TypeScript 타입 (LinkItem, NavItem 등) | ✅ |
| `providers/query-provider.tsx` | TanStack Query 클라이언트 Provider | ✅ |
| `next.config.ts` | 이미지 도메인 등 Next.js 설정 | ✅ |
| `.env.local` | 환경 변수 실제 값 (git 미포함) | ✅ |
| `.env.example` | 환경 변수 예시 (git 포함) | ✅ |

---

## 절대 금지 사항

- `components/ui/` 파일 직접 편집 — shadcn CLI로만 추가/업데이트
- `app/examples/` 하위 파일 수정 또는 삭제
- `lib/utils.ts`에 `cn()` 외 함수 추가
- Notion API 직접 호출 (`lib/notion.ts` 우회 금지)
- 하드코딩된 경로 문자열 사용 (`ROUTES` 상수 사용)
- 매직 넘버 직접 사용 (상수로 정의 후 참조)
- `npm run build` 실패 상태로 작업 완료 처리

---

## 다중 파일 동시 수정 규칙

### 외부 이미지 도메인 추가 시
- `next.config.ts` → `images.remotePatterns`에 hostname 등록 **필수**

### 새 Notion DB 속성 추가 시
1. `types/index.ts` → `LinkItem` 인터페이스에 필드 추가
2. `lib/notion.ts` → `fetchAllLinks()` 응답 파싱 로직 업데이트
3. 아이콘/미디어 속성이면 `normalizeIcon()` 로직도 업데이트

### 새 상수 추가 시
- `lib/constants.ts`에 상수 정의
- 해당 상수의 타입이 새로운 인터페이스라면 `types/index.ts`에도 추가

### 새 환경변수 추가 시
- `.env.local`에 실제 값 입력
- `.env.example`에 키 이름과 설명 주석 추가 (실제 값 제외)

---

## 컴포넌트 작성 규칙

### 서버 vs 클라이언트 컴포넌트 판단

- **기본값**: 서버 컴포넌트 (파일 상단 지시어 없음)
- **클라이언트 컴포넌트 필요 조건**: `useState`, `useEffect`, 이벤트 핸들러, 브라우저 API, TanStack Query 훅 사용 시
- `"use client"` 지시어는 파일 맨 첫 줄에 작성

### 클라이언트 컴포넌트 예시

```tsx
"use client" // ← 파일 맨 첫 줄 (주석보다 먼저)

import { useState } from "react"
```

### 서버 컴포넌트 예시

```tsx
// "use client" 없이 바로 시작
import { cn } from "@/lib/utils"
```

### cn() 사용 규칙

- 조건부 클래스 병합 시 반드시 `cn()` 사용
- 직접 문자열 연결(`+ " " +`) 금지

```tsx
// ✅ 올바른 방법
className={cn("base-class", isActive && "active-class", className)}

// ❌ 잘못된 방법
className={"base-class" + (isActive ? " active-class" : "")}
```

---

## Notion API 레이어 규칙 (lib/notion.ts)

- `createNotionClient()`: 환경변수 유효성 검사 후 Client 초기화
- `fetchAllLinks()`: `active = true` 필터 + `order` 오름차순 정렬 → `LinkItem[]` 반환
- `normalizeIcon()`: 이모지 / file / external URL 판별, 폴백 `"🔗"`
- `fetchWithRetry()`: Rate Limit 지수 백오프 (1s/2s/4s, 최대 3회)
- Notion API는 **반드시 서버 컴포넌트 또는 서버 액션**에서만 호출 (클라이언트 측 직접 호출 금지)

---

## app/page.tsx ISR 설정

```tsx
// Notion 데이터 1시간 캐시 (ISR)
export const revalidate = 3600
```

- `fetchAllLinks()` 호출 시 반드시 `try-catch`로 빈 배열 폴백 처리

```tsx
const links = await fetchAllLinks().catch(() => [])
```

---

## 토스트 알림 (sonner)

- `toast.success()` / `toast.error()` 사용
- `app/layout.tsx`에 `<Toaster richColors />` 이미 등록됨 — 중복 추가 금지
- 클라이언트 컴포넌트에서만 호출 가능

---

## 다크모드 (next-themes)

- `app/layout.tsx`의 `ThemeProvider`가 이미 설정됨 — 재설정 금지
- `attribute="class"` 방식 → `.dark` 클래스로 CSS 변수 전환
- Tailwind의 `dark:` 접두사로 다크모드 스타일 적용
- 테마 접근: `useTheme()` 훅 (클라이언트 컴포넌트에서만)

---

## 코드 스타일

- 들여쓰기: 스페이스 2칸
- 세미콜론: 사용하지 않음
- 함수: 30줄 이하 유지, 초과 시 분리
- 변수명/함수명: 영어 (camelCase), 컴포넌트: PascalCase
- 주석: 함수/라이브러리 사용 시 역할 설명 주석 필수

---

## shadcn/ui 컴포넌트 추가

```bash
npx shadcn@latest add <component-name>
```

- 새 컴포넌트는 `components/ui/`에 자동 생성됨
- 설치 후 해당 파일 직접 편집 금지

---

## 환경 변수

| 키 | 용도 |
|----|------|
| `NOTION_API_KEY` | Notion Integration 토큰 (`secret_xxxx`) |
| `NOTION_DATABASE_ID` | Links 데이터베이스 ID |

- 환경변수 미설정 시 `lib/notion.ts`의 `createNotionClient()`가 에러를 throw해야 함
- 클라이언트에서 환경변수 접근 금지 (`NEXT_PUBLIC_` 접두사 없는 변수는 서버 전용)

---

## AI 의사결정 기준

### 새 컴포넌트 위치 결정

```
인터랙션/훅 필요?
  YES → "use client" 추가
  NO  → 서버 컴포넌트

배치 위치:
  shadcn 기반 UI 원자 컴포넌트 → components/ui/ (CLI만)
  헤더/푸터/레이아웃 → components/layout/
  페이지 섹션 → components/sections/
  공통 유틸 컴포넌트 → components/common/
  기능 컴포넌트 (LinkCard, CopyButton 등) → components/
```

### 타입 vs 상수 판단

- 타입/인터페이스: `types/index.ts`
- 정적 데이터/설정값: `lib/constants.ts`
- 두 파일 동시 수정 필요 여부를 항상 확인

### 외부 이미지 사용 판단

- URL이 `picsum.photos` 이외 도메인이면 `next.config.ts` 수정 필수
- Notion 이미지: `files.notion.so`, `*.amazonaws.com` 도메인 등록 필요
