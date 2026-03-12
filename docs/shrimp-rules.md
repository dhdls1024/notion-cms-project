# Notion CMS 링크 허브 프로젝트 규칙

## 프로젝트 개요

- **목적**: Notion 데이터베이스를 CMS로 활용한 개인 링크 모음(디지털 명함) 사이트
- **핵심 가치**: 코드 배포 없이 Notion 수정만으로 실시간 업데이트
- **범위**: 단일 홈 페이지 (MVP), 별도 인증 불필요 (공개 페이지)
- **배포**: Vercel + `.env.local` 환경변수 관리

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) + React 19 + TypeScript 5 |
| 스타일링 | Tailwind CSS 4 (PostCSS 플러그인 방식, `@import "tailwindcss"`) |
| UI 컴포넌트 | shadcn/ui (`components/ui/`에 복사 설치) + Lucide React |
| 테마 | next-themes (`ThemeProvider`, `attribute="class"`) |
| 알림 | sonner (`<Toaster richColors />`) |
| Notion 연동 | `@notionhq/client` (공식 Node.js SDK) |
| 유틸리티 | clsx + tailwind-merge (`cn()` 함수, `lib/utils.ts`) |
| 데이터 페칭 | Next.js 서버 컴포넌트 fetch + ISR |

---

## MVP 핵심 기능 (F001~F005)

| ID | 기능 | 구현 방식 |
|----|------|----------|
| F001 | Notion 데이터 동기화 | 서버 컴포넌트 fetch, `revalidate = 3600` (ISR) |
| F002 | 반응형 링크 카드 | 모바일 1열 / 태블릿 2열 / 데스크탑 3열 그리드 |
| F003 | 다크모드 전환 | next-themes, 라이트/다크/시스템 순환 |
| F004 | URL 복사 | `navigator.clipboard.writeText` + sonner `toast.success` |
| F005 | 카테고리 필터링 | 클라이언트 사이드 탭 필터 |

**MVP 이후 기능 (구현 금지)**: 관리자 대시보드, 클릭 통계, 커스텀 도메인 UI, 소셜 공유 버튼, 애니메이션 커스터마이징

---

## Critical Issues 해결 방향

### Issue #1: ISR 설정 (필수)

```typescript
// app/page.tsx 최상단에 반드시 추가
export const revalidate = 3600 // 1시간마다 Notion 데이터 갱신
```

- Notion 수정 후 최대 1시간 이내 반영
- 더 빠른 반영이 필요하면 On-Demand ISR (`/api/revalidate` 엔드포인트) 고려

### Issue #2: Icon 처리 방식

```typescript
// lib/notion.ts - normalizeIcon() 함수 필수 구현
// Text(이모지)와 Files & Media(이미지 URL) 모두 처리
// 폴백: '🔗'
```

- Notion DB의 Icon 속성은 **Text 타입(이모지)** 권장
- 컴포넌트에서 `icon.startsWith('http')` 로 이모지/이미지 자동 판별

### Issue #3: Rate Limit 대응

```typescript
// lib/notion.ts - 지수 백오프 재시도 로직 포함
// APIErrorCode.RateLimited 감지 시 최대 3회 재시도
// 1초, 2초, 4초 순 대기
```

---

## 파일 구조 및 역할

```
app/
  page.tsx                    # 서버 컴포넌트, Notion API fetch, ISR 설정
  layout.tsx                  # ThemeProvider, Header, Toaster
  examples/                   # 스타터킷 예제 (삭제 금지)

components/
  ui/                         # shadcn/ui 자동생성 (직접 수정 금지)
  layout/                     # Header (서버), ThemeToggle (클라이언트)
  LinkCard.tsx                # 링크 카드 UI (이모지/이미지 판별 포함)
  LinkHubClient.tsx           # 카테고리 탭 + 필터 (클라이언트 컴포넌트)

lib/
  notion.ts                   # Notion 클라이언트, fetchAllLinks(), normalizeIcon()
  utils.ts                    # cn() 유틸리티
  constants.ts                # ROUTES, SITE_CONFIG 등 상수

types/
  index.ts                    # LinkItem 및 모든 타입 정의
```

### 핵심 타입 (types/index.ts)

```typescript
type LinkItem = {
  id: string        // Notion 페이지 ID
  title: string     // Name 속성
  url: string       // URL 속성
  icon: string      // 이모지 또는 이미지 URL
  category: string  // Category 속성
  active: boolean   // Active 속성
  order: number     // Order 속성
}
```

### 환경 변수 (.env.local)

```
NOTION_API_KEY=secret_xxxx
NOTION_DATABASE_ID=xxxx
```

---

## 구현 순서 (AI 의사결정 기준)

Notion CMS 기능 구현 시 반드시 이 순서를 따른다:

1. **types/index.ts** — `LinkItem` 타입 추가
2. **lib/notion.ts** — Notion 클라이언트 초기화, `fetchAllLinks()`, `normalizeIcon()` 구현
3. **components/LinkCard.tsx** — 링크 카드 UI 컴포넌트 구현
4. **components/LinkHubClient.tsx** — 카테고리 필터 클라이언트 컴포넌트 구현
5. **app/page.tsx** — Notion 데이터 연동 및 ISR 설정

---

## 파일 동시 수정 규칙

| 수정 파일 | 함께 확인/수정해야 할 파일 |
|-----------|--------------------------|
| `types/index.ts` — 새 타입 추가 | `lib/constants.ts` — 관련 상수 타입 일치 확인 |
| `lib/notion.ts` — 반환 타입 변경 | `types/index.ts` — `LinkItem` 타입 일치 확인 |
| `app/page.tsx` — 수정 시 | `revalidate = 3600` 설정 유지 여부 확인 |
| `lib/constants.ts` — 새 상수 추가 | 해당 상수를 import하는 컴포넌트 확인 |
| `components/ui/` — 새 컴포넌트 필요 시 | `npx shadcn@latest add <name>` 실행 (직접 작성 금지) |

---

## 코드 스타일 규칙

- **들여쓰기**: 스페이스 2칸
- **세미콜론**: 사용하지 않음
- **함수 길이**: 30줄 이하 유지, 초과 시 분리
- **매직넘버 금지**: 상수(`lib/constants.ts`)로 정의
- **타입 선언**: `types/index.ts`에 집중 관리
- **상수 관리**: `lib/constants.ts`에 정적 데이터 정의
- **Path alias**: `@/*` → 프로젝트 루트

---

## 컴포넌트 작성 규칙

- **기본**: 서버 컴포넌트
- **클라이언트 전환**: 인터랙션(상태, 이벤트)이 필요할 때만 `"use client"` 추가
- **cn() 사용**: 조건부 클래스 병합 시 항상 `lib/utils.ts`의 `cn()` 사용
- **shadcn/ui**: `components/ui/` 직접 수정 금지, 추가는 `npx shadcn@latest add` 사용
- **Tailwind CSS**: `@import "tailwindcss"` 방식 사용 (v3 `@tailwind` 지시어 사용 금지)

---

## 환경 변수 체크 규칙

- `lib/notion.ts` 작성 시 `NOTION_API_KEY`, `NOTION_DATABASE_ID` 존재 여부 확인
- 환경 변수 미설정 시 명확한 에러 메시지와 함께 throw
- `.env.local`에 추가, `.env.example` 파일로 키 목록 문서화

---

## AI 의사결정 기준

### 새 컴포넌트 추가 시
1. shadcn/ui에 해당 컴포넌트가 있으면 → `npx shadcn@latest add` 사용
2. 없으면 → `components/` 하위에 직접 작성 (서버 컴포넌트 우선)
3. 인터랙션 필요 시 → `"use client"` 추가

### 데이터 페칭 방식 선택
- Notion 데이터 → 서버 컴포넌트 + ISR (`revalidate = 3600`)
- 실시간 사용자 인터랙션 → 클라이언트 상태 (useState, useReducer)
- **TanStack Query는 Notion 데이터 페칭에 사용하지 않음** (서버 컴포넌트 fetch 우선)

### 스타일 적용 우선순위
1. Tailwind CSS 유틸리티 클래스
2. `cn()` 함수로 조건부 병합
3. CSS 변수 (다크모드 지원 시)
4. 인라인 스타일 (금지)

---

## 금지 사항

1. `components/ui/` 직접 수정
2. 하드코딩된 URL / 라우트 (`ROUTES` 상수 사용)
3. MVP 범위 외 기능 선구현 (관리자 대시보드, 통계 등)
4. `rm -rf /`, `git reset --hard`, `git push --force` 등 위험 명령어
5. `app/examples/` 하위 파일 삭제 (스타터킷 예제 보존)
6. 인라인 스타일 사용
7. `any` 타입 사용 (명확한 타입 정의 필수)
8. Tailwind v3 방식(`@tailwind base` 등) 사용

---

## 개발 명령어

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 실행
npx shadcn@latest add <name>  # shadcn/ui 컴포넌트 추가
```

---

## 외부 이미지 도메인

`next.config.ts`의 `images.remotePatterns`에 등록 필요:
- `picsum.photos` (예제용)
- Notion 이미지 URL 사용 시 해당 도메인 추가 (`files.notion.so`, `prod-files-secure.s3.us-west-2.amazonaws.com`)
