# Notion CMS 링크 허브 — 작업 계획 (PLAN.md)

> ROADMAP.md 기반으로 수립된 구현 계획. Task 순서는 반드시 아래 의존성 그래프를 따른다.

---

## 의존성 그래프

```
Task-001 ✅ (사전 완료)
    ↓
Task-002 (환경 설정)
    ↓
Task-003 (notion.ts)
    ↓
Task-004 (LinkCard) ← Task-005 (CopyButton)
    ↓
Task-006 (LinkHubClient)
    ↓
Task-007 (page.tsx)
    ↓
Task-008 (loading.tsx)
    ↓
Task-009 (최종 검증)
```

---

## Phase 1: 환경 설정

### Task-002: Notion SDK 설치 및 환경 설정 ⬜

**목표**: @notionhq/client 설치 + 이미지 도메인 + 환경변수 설정

**수정 파일**:
| 파일 | 작업 |
|------|------|
| `package.json` | @notionhq/client 의존성 추가 |
| `next.config.ts` | Notion 이미지 도메인 추가 |
| `.env.example` | NOTION_API_KEY, NOTION_DATABASE_ID 키 추가 |
| `.env.local` | 실제 값 입력 (사용자 직접) |

**구현 단계**:
- [ ] `npm install @notionhq/client` 실행
- [ ] `next.config.ts` `images.remotePatterns`에 아래 도메인 추가:
  - `files.notion.so`
  - `*.s3.us-west-2.amazonaws.com` (Notion 첨부 이미지)
- [ ] `.env.example`에 다음 항목 추가:
  ```
  NOTION_API_KEY=     # Notion Integration 토큰 (secret_xxxx)
  NOTION_DATABASE_ID= # Links 데이터베이스 ID
  ```
- [ ] `.env.local`에 실제 값이 입력되어 있는지 확인

**수락 기준**:
- `npm list @notionhq/client`로 설치 확인
- `next.config.ts`에 `files.notion.so` 도메인 존재
- `.env.example`에 두 키 포함

---

## Phase 2: 코어 구현

### Task-003: Notion API 레이어 구현 (F001) ⬜

**목표**: `lib/notion.ts` 신규 생성. Notion DB → LinkItem[] 변환 레이어.

**생성 파일**: `lib/notion.ts`

**구현 단계**:
- [ ] `createNotionClient()` 구현
  - `process.env.NOTION_API_KEY` 없으면 `Error('NOTION_API_KEY is not set')` throw
  - `new Client({ auth: process.env.NOTION_API_KEY })` 반환
- [ ] `normalizeIcon(icon)` 구현
  - `icon`이 `http`로 시작하면 URL 반환
  - 단일 이모지 문자면 그대로 반환
  - 그 외 또는 falsy면 `'🔗'` 반환
- [ ] `fetchWithRetry(fn, maxRetries=3)` 구현
  - `fn()` 실행 후 Notion 429 에러 시 지수 백오프: 1000ms → 2000ms → 4000ms
  - 최대 3회 재시도 후 에러 throw
- [ ] `fetchAllLinks()` 구현
  - `createNotionClient()` 호출
  - `notion.databases.query()` 호출:
    - `database_id`: `process.env.NOTION_DATABASE_ID`
    - `filter`: `{ property: 'Active', checkbox: { equals: true } }`
    - `sorts`: `[{ property: 'Order', direction: 'ascending' }]`
  - 응답을 `LinkItem[]`으로 정규화하여 반환

**Notion API 응답 속성 매핑**:
| Notion 속성 | 타입 | LinkItem 필드 |
|------------|------|--------------|
| Name | title | `title` |
| URL | url | `url` |
| Icon | rich_text 또는 files | `icon` (normalizeIcon 처리) |
| Category | select | `category` |
| Active | checkbox | `active` |
| Order | number | `order` |

**수락 기준**:
- `fetchAllLinks()` 호출 시 `active=true`인 `LinkItem[]` 반환
- `active=false` 항목 미포함
- API 키 미설정 시 명확한 에러 throw

**Playwright 테스트 체크리스트**:
- [ ] `fetchAllLinks()` 호출 후 링크 카드가 페이지에 렌더링되는지 확인
- [ ] `active=false` 링크가 화면에 표시되지 않는지 확인
- [ ] API 키 미설정 시 에러 경계가 올바르게 동작하는지 확인

---

### Task-004: LinkCard 서버 컴포넌트 구현 (F002) ⬜

**목표**: `components/LinkCard.tsx` 신규 생성. 서버 컴포넌트. LinkItem 카드 UI.

**생성 파일**: `components/LinkCard.tsx`

**구현 단계**:
- [ ] 서버 컴포넌트로 생성 (`'use client'` 없음)
- [ ] Props: `{ link: LinkItem }`
- [ ] `icon` 판별 로직:
  - `link.icon.startsWith('http')` → `<Image>` (next/image, width=32, height=32)
  - 그 외 → `<span>{link.icon}</span>`
- [ ] 카드 전체를 `<a href={link.url} target="_blank" rel="noopener noreferrer">` 로 감싸기
- [ ] `components/ui/card.tsx`의 Card 컴포넌트 기반 레이아웃
- [ ] `cn()`으로 hover 스타일 조건부 적용
- [ ] `<CopyButton url={link.url} />` 포함

**수락 기준**:
- `LinkItem` 데이터로 카드 렌더링
- icon이 URL이면 `<Image>`, 이모지면 `<span>`
- 카드 클릭 시 새 탭으로 외부 URL 열림
- CopyButton 포함

---

### Task-005: CopyButton 클라이언트 컴포넌트 구현 (F004) ⬜

**목표**: `components/CopyButton.tsx` 신규 생성. 클립보드 복사 + sonner toast.

**생성 파일**: `components/CopyButton.tsx`

**구현 단계**:
- [ ] 파일 첫 줄: `"use client"`
- [ ] Props: `{ url: string }`
- [ ] `useState<boolean>(false)`로 `copied` 상태 관리
- [ ] `handleCopy` 함수:
  - `navigator.clipboard.writeText(url)` 실행
  - 성공: `setCopied(true)` + `toast.success('링크가 복사되었습니다')`
  - 2초 후 `setCopied(false)` (setTimeout)
  - 실패: `toast.error('복사에 실패했습니다')`
- [ ] 아이콘 전환: `copied=false` → lucide `Copy`, `copied=true` → lucide `Check`
- [ ] `aria-label="URL 복사"` 속성 추가
- [ ] shadcn `Button` (variant='ghost', size='icon') 사용

**수락 기준**:
- 복사 버튼 클릭 시 sonner toast 표시
- 클립보드에 올바른 URL 복사
- 2초 후 아이콘 원복
- `aria-label` 속성 존재

**Playwright 테스트 체크리스트**:
- [ ] 복사 버튼 클릭 후 sonner toast가 화면에 나타나는지 확인
- [ ] 클립보드에 올바른 URL이 복사되는지 확인

---

## Phase 3: UI 완성

### Task-006: LinkHubClient 카테고리 필터 컴포넌트 구현 (F005) ⬜

**목표**: `components/LinkHubClient.tsx` 신규 생성. 카테고리 탭 필터 + 반응형 그리드.

**생성 파일**: `components/LinkHubClient.tsx`

**구현 단계**:
- [ ] 파일 첫 줄: `"use client"`
- [ ] Props: `{ links: LinkItem[] }`
- [ ] 카테고리 목록 생성: `['전체', ...new Set(links.map(l => l.category))]`
- [ ] `useState<string>('전체')`로 `activeCategory` 관리
- [ ] 필터링:
  ```
  activeCategory === '전체'
    ? links
    : links.filter(l => l.category === activeCategory)
  ```
- [ ] shadcn `Tabs` / `TabsList` / `TabsTrigger` 로 탭 UI 구성
- [ ] 그리드: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- [ ] 빈 상태: `filteredLinks.length === 0` 이면 "표시할 링크가 없습니다" 안내
- [ ] `<LinkCard key={link.id} link={link} />` 렌더링

**수락 기준**:
- 카테고리 탭 클릭 시 해당 카테고리 링크만 표시
- '전체' 탭 클릭 시 전체 링크 표시
- 빈 카테고리 선택 시 안내 메시지 표시
- 반응형 그리드 동작

**Playwright 테스트 체크리스트**:
- [ ] 카테고리 탭 클릭 시 해당 카테고리 링크만 표시되는지 확인
- [ ] '전체' 탭 클릭 시 모든 링크가 표시되는지 확인
- [ ] 빈 카테고리 선택 시 안내 메시지가 표시되는지 확인

---

### Task-007: app/page.tsx Notion 데이터 연동 (F001 + F003) ⬜

**목표**: 홈페이지를 Notion CMS 링크 허브로 전환. ISR + 프로필 헤더 + LinkHubClient.

**수정 파일**: `app/page.tsx`

**구현 단계**:
- [ ] 파일 상단에 `export const revalidate = 3600` 추가 (ISR 1시간 캐시)
- [ ] `async` 서버 컴포넌트로 변환
- [ ] `fetchAllLinks()` 호출 + try-catch 빈 배열 폴백:
  ```
  const links = await fetchAllLinks().catch(() => [])
  ```
- [ ] 기존 `HeroSection`, `TechStackSection` import 및 사용 제거
  - **주의**: 컴포넌트 파일 자체는 삭제하지 말 것
- [ ] 프로필 헤더 영역 구성 (`SITE_CONFIG.name`, `SITE_CONFIG.description` 표시)
- [ ] `<LinkHubClient links={links} />` 배치
- [ ] **절대 금지**: `app/examples/` 하위 파일 수정/삭제 금지

**수락 기준**:
- `localhost:3000` 접속 시 Notion 링크 카드 렌더링
- `revalidate = 3600` 설정 확인
- 다크모드 전환 정상 동작
- HeroSection/TechStackSection 미표시

**Playwright 테스트 체크리스트**:
- [ ] localhost:3000 접속 후 Notion 링크 카드가 렌더링되는지 확인
- [ ] 다크모드 전환 시 색상 이상 없는지 확인
- [ ] ISR 캐시 헤더(`Cache-Control: s-maxage=3600`) 응답 확인

---

## Phase 4: 마무리

### Task-008: 로딩 UI 구현 ⬜

**목표**: `app/loading.tsx` 신규 생성. Skeleton 그리드 로딩 UI.

**생성 파일**: `app/loading.tsx`

**구현 단계**:
- [ ] 서버 컴포넌트로 생성 (`'use client'` 없음)
- [ ] `components/ui/skeleton.tsx` import
- [ ] Skeleton 카드 6개, 반응형 그리드 (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`)
- [ ] 각 Skeleton 카드 구조 (LinkCard와 동일한 비율):
  - 아이콘: `<Skeleton className="h-8 w-8 rounded-full" />`
  - 제목: `<Skeleton className="h-4 w-3/4" />`
  - 설명: `<Skeleton className="h-4 w-1/2" />`

**수락 기준**:
- 페이지 로딩 중 Skeleton UI 표시
- 반응형 그리드 동작
- 다크/라이트 모드 Skeleton 색상 정상

---

### Task-009: 접근성 보완 및 최종 검증 ⬜

**목표**: lint/build 오류 0 + Playwright E2E 전체 플로우 검증.

**구현 단계**:
- [ ] `npm run lint` 실행 → 오류 있으면 수정
- [ ] `npm run build` 실행 → 빌드 성공 확인
- [ ] `.env.example` 최종 확인 (NOTION_API_KEY, NOTION_DATABASE_ID 포함)
- [ ] Vercel 배포 시 환경변수 설정 가이드 확인

**수락 기준**:
- `npm run lint` 오류 0
- `npm run build` 성공

**Playwright 테스트 체크리스트**:
- [ ] localhost:3000에서 Notion 링크 카드 렌더링 확인
- [ ] 카테고리 탭 클릭 → 필터링 동작 확인
- [ ] URL 복사 버튼 클릭 → sonner toast 표시 확인
- [ ] 다크모드 전환 → 색상 이상 없음 확인
- [ ] 모바일 뷰포트 (375px) 1열 그리드 확인
- [ ] 태블릿 뷰포트 (768px) 2열 그리드 확인
- [ ] 데스크탑 뷰포트 (1280px) 3열 그리드 확인
- [ ] `npm run build` 빌드 성공 확인

---

## PRD 기능 요구사항 매핑

| PRD ID | 기능명 | 구현 Task | 상태 |
|--------|--------|-----------|------|
| F001 | Notion 데이터 동기화 (ISR) | Task-003, Task-007 | ⬜ |
| F002 | 반응형 링크 카드 그리드 | Task-004, Task-006 | ⬜ |
| F003 | 다크모드 전환 | Task-001 ✅, Task-007 검증 | 🚧 |
| F004 | URL 복사 + 토스트 알림 | Task-005 | ⬜ |
| F005 | 카테고리 탭 필터링 | Task-006 | ⬜ |

---

## 핵심 제약 사항

| 항목 | 규칙 |
|------|------|
| `components/ui/` | 직접 수정 금지 — shadcn CLI로만 관리 |
| `app/examples/` | 수정/삭제 절대 금지 |
| `lib/utils.ts` | `cn()` 외 함수 추가 금지 |
| `lib/notion.ts` | Notion API 유일한 진입점 — 우회 금지 |
| 서버/클라이언트 | 기본 서버 컴포넌트, 인터랙션 필요 시만 `"use client"` |
| 외부 이미지 | `next.config.ts` 도메인 등록 필수 |
