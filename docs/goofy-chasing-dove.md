# 계획: Notion CMS 링크 허브 MVP — 1주일 개발 계획

## Context

Next.js 16 스타터킷 기반으로 Notion을 CMS로 활용하는 링크 허브(디지털 명함) 사이트를 1주일 안에 완성한다.

**현재 확인된 상태 (2026-03-11 기준)**
- `@notionhq/client` 미설치
- `lib/notion.ts` 미존재
- `types/index.ts` — LinkItem 타입 미정의
- `components/LinkCard.tsx`, `CopyButton.tsx`, `LinkHubClient.tsx` 미존재
- `app/loading.tsx` 미존재
- `next.config.ts` — Notion 이미지 도메인 미설정
- `.env.local` — NOTION_API_KEY, NOTION_DATABASE_ID 플레이스홀더 존재 (실제 값 입력 필요)
- shadcn/ui `tabs`, `badge`, `skeleton` 이미 설치 완료 ✓
- `app/layout.tsx` — Toaster, ThemeProvider 이미 설정 완료 ✓

**핵심 원칙**: 서버 컴포넌트 우선, 클라이언트 최소화, MVP 외 기능 구현 금지.

---

## 일별 태스크 계획

### Day 1 — 환경 설정 및 패키지 설치
- `npm install @notionhq/client`
- `.env.local` → NOTION_API_KEY, NOTION_DATABASE_ID 실제 값 입력
- `next.config.ts` → Notion 이미지 도메인 추가 (`files.notion.so`, `*.amazonaws.com`)

**수정 파일**: `package.json`, `.env.local`, `next.config.ts`

---

### Day 2 — 타입 정의 + Notion API 레이어

**Task A: `types/index.ts` — LinkItem 타입 추가**
```typescript
interface LinkItem {
  id: string       // Notion 페이지 ID
  title: string    // 링크 이름
  url: string      // 이동할 URL
  icon: string     // 이모지 또는 이미지 URL
  category: string // 카테고리 (탭 필터용)
  active: boolean  // 표시 여부
  order: number    // 정렬 순서
}
```

**Task B: `lib/notion.ts` 신규 생성**
- `createNotionClient()` — 환경변수 체크 후 Client 초기화
- `fetchAllLinks()` — active=true 필터, order asc 정렬 → `LinkItem[]`
- `normalizeIcon()` — emoji / file / external URL 판별, 폴백 🔗
- `fetchWithRetry()` — Rate Limit 지수 백오프 (1s/2s/4s, 최대 3회)

**수정/생성 파일**: `types/index.ts`, `lib/notion.ts`

---

### Day 3 — LinkCard + CopyButton 컴포넌트

**서버/클라이언트 분리 패턴**:
- `components/LinkCard.tsx` — 서버 컴포넌트
  - `icon`이 URL이면 `<Image>`, 이모지면 `<span>` 렌더링
  - `components/ui/card.tsx` 재사용
- `components/CopyButton.tsx` — `"use client"`
  - `navigator.clipboard.writeText()` 로 URL 복사
  - sonner `toast.success()` 알림

**재사용**: `components/ui/card.tsx`, `lib/utils.ts`의 `cn()`

**생성 파일**: `components/LinkCard.tsx`, `components/CopyButton.tsx`

---

### Day 4 — LinkHubClient 카테고리 필터

- `components/LinkHubClient.tsx` — `"use client"`
- shadcn `Tabs`로 카테고리 탭 UI
- "전체" 탭 포함, `Set`으로 카테고리 중복 제거
- 반응형 그리드: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- 빈 상태 안내 메시지 처리

**재사용**: `components/ui/tabs.tsx`

**생성 파일**: `components/LinkHubClient.tsx`

---

### Day 5 — app/page.tsx Notion 데이터 연동

- `export const revalidate = 3600` (ISR — 1시간 캐시)
- `fetchAllLinks()` 호출 + try-catch 빈 배열 폴백
- 기존 `HeroSection`, `TechStackSection` 제거하고 `LinkHubClient` 배치
- **`app/examples/` 하위 파일 절대 삭제 금지**

**수정 파일**: `app/page.tsx`

---

### Day 6 — 로딩 UI 및 접근성 보완

- `app/loading.tsx` 생성 — Skeleton 그리드 로딩 UI (`components/ui/skeleton.tsx` 재사용)
- `CopyButton` — `aria-label="URL 복사"` 접근성 속성 추가
- 다크/라이트 모드 CSS 변수 기반 자동 적용 확인

**생성/수정 파일**: `app/loading.tsx`, `components/CopyButton.tsx`

---

### Day 7 — 최종 검증 및 배포 준비

- `npm run lint` → 오류 0
- `npm run build` → 빌드 성공
- `.env.example` 최종 확인 (Notion 환경변수 2개 포함 여부)
- Vercel 환경변수 설정 확인

---

## 의존성 그래프

```
Day1 → Day2(타입+notion.ts) → Day3 → Day4 → Day5 → Day6 → Day7
```

- Day3는 Day2(타입 + notion.ts) 완료 후 진행
- Day5는 Day4 + Day2(notion.ts) 모두 의존

---

## 핵심 파일 목록

| 파일 | 작업 | 역할 |
|------|------|------|
| `package.json` | 수정 | @notionhq/client 추가 |
| `.env.local` | 수정 | 실제 Notion API 키 입력 |
| `next.config.ts` | 수정 | Notion 이미지 도메인 추가 |
| `types/index.ts` | 수정 | LinkItem 타입 추가 |
| `lib/notion.ts` | 신규 | Notion API 레이어 |
| `components/LinkCard.tsx` | 신규 | 링크 카드 서버 컴포넌트 |
| `components/CopyButton.tsx` | 신규 | URL 복사 클라이언트 컴포넌트 |
| `components/LinkHubClient.tsx` | 신규 | 카테고리 필터 클라이언트 컴포넌트 |
| `app/page.tsx` | 수정 | Notion 연동 홈페이지 |
| `app/loading.tsx` | 신규 | Skeleton 로딩 UI |

---

## 재사용할 기존 코드

| 파일 | 재사용 목적 |
|------|------------|
| `lib/utils.ts` — `cn()` | 조건부 클래스 병합 |
| `components/ui/card.tsx` | LinkCard 기반 UI |
| `components/ui/tabs.tsx` | 카테고리 탭 필터 |
| `components/ui/skeleton.tsx` | 로딩 상태 |
| `app/layout.tsx` | Toaster 이미 설정 (sonner 바로 사용) |

---

## 검증 방법

1. `npm run dev` → localhost:3000에서 Notion 링크 카드 렌더링 확인
2. 카테고리 탭 클릭 → 필터링 동작 확인
3. URL 복사 버튼 클릭 → sonner toast 표시 확인
4. 다크모드 전환 → 색상 이상 없음 확인
5. `npm run build` → 빌드 성공 확인
6. `npm run lint` → 오류 0 확인
