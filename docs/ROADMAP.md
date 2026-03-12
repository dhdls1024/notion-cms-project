# Notion CMS 링크 허브 개발 로드맵

Notion 데이터베이스를 CMS로 활용하여 코드 배포 없이 링크 페이지를 실시간 관리하는 개인 디지털 명함 사이트

## 개요

Notion CMS 링크 허브는 개인 사용자를 위한 디지털 명함 사이트로, Notion을 백오피스 CMS로 활용하여 다음 기능을 제공합니다:

- **Notion 데이터 동기화 (F001)**: 서버 컴포넌트 ISR로 Notion DB 링크를 1시간 캐시하여 실시간 반영
- **반응형 링크 카드 (F002)**: 모바일 1열 / 태블릿 2열 / 데스크탑 3열 그리드 레이아웃
- **다크모드 전환 (F003)**: next-themes 기반 라이트/다크/시스템 순환 전환
- **URL 복사 (F004)**: 클립보드 복사 + sonner 토스트 알림
- **카테고리 필터링 (F005)**: shadcn Tabs 기반 클라이언트 사이드 탭 필터

## 개발 워크플로우

1. **작업 계획**

   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**

   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-env-setup.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**
   - 완료된 작업 파일을 예시로 참조하되, 새 작업은 빈 체크박스와 변경 사항 요약 없이 초기 상태로 작성

3. **작업 구현**

   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - **API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
   - 테스트 통과 확인 후 다음 단계로 진행
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**

   - 로드맵에서 완료된 작업을 ✅로 표시
   - 상태 아이콘: ✅ 완료 / 🚧 진행중 / ⬜ 미시작

---

## 개발 단계

### Phase 1: 환경 설정 및 프로젝트 기반 구축

> 목표: 개발에 필요한 패키지 설치, 환경 변수 구성, 타입 시스템 완성

- **Task-001: 사전 완료 항목 확인** ✅ — 완료
  - ✅ `shadcn/ui` tabs, badge, skeleton 컴포넌트 설치
  - ✅ `app/layout.tsx` — Toaster (sonner), ThemeProvider (next-themes) 설정
  - ✅ `types/index.ts` — LinkItem 인터페이스 정의 (`id`, `title`, `url`, `icon`, `category`, `active`, `order`)

- **Task-002: Notion SDK 설치 및 환경 설정** ⬜ — 미시작
  - `@notionhq/client` 패키지 설치 (`npm install @notionhq/client`)
  - `.env.local` — `NOTION_API_KEY`, `NOTION_DATABASE_ID` 실제 값 입력
  - `next.config.ts` — Notion 이미지 도메인 추가 (`files.notion.so`, `*.amazonaws.com`)
  - `.env.example` 업데이트 (Notion 환경변수 2개 항목 포함)

  **수정 파일**: `package.json`, `.env.local`, `next.config.ts`, `.env.example`

---

### Phase 2: 코어 구현 (Notion API 레이어 + 서버/클라이언트 컴포넌트)

> 목표: Notion API 통신 레이어 구축 및 핵심 UI 컴포넌트 구현 (F001, F002, F004 구현)

- **Task-003: Notion API 레이어 구현 (F001)** ⬜ — 미시작
  - `lib/notion.ts` 신규 생성
  - `createNotionClient()` — 환경변수 유효성 검사 후 `Client` 초기화
  - `fetchAllLinks()` — `active = true` 필터 + `order` 오름차순 정렬 → `LinkItem[]` 반환
  - `normalizeIcon()` — emoji / file / external URL 판별, 폴백 값 `🔗`
  - `fetchWithRetry()` — Rate Limit 지수 백오프 (1s/2s/4s, 최대 3회 재시도)

  **생성 파일**: `lib/notion.ts`

  **테스트 체크리스트** (Playwright MCP):
  - `fetchAllLinks()` 호출 후 링크 카드가 페이지에 렌더링되는지 확인
  - `active = false` 링크가 화면에 표시되지 않는지 확인
  - API 키 미설정 시 에러 경계가 올바르게 동작하는지 확인

- **Task-004: LinkCard 서버 컴포넌트 구현 (F002)** ⬜ — 미시작
  - `components/LinkCard.tsx` 신규 생성 (서버 컴포넌트)
  - `icon` 값이 URL이면 `<Image>` (next/image), 이모지면 `<span>` 렌더링
  - `components/ui/card.tsx` 기반으로 카드 레이아웃 구성
  - `lib/utils.ts`의 `cn()` 활용한 조건부 클래스 병합
  - 링크 카드 클릭 시 새 탭으로 URL 이동 (`target="_blank"`, `rel="noopener noreferrer"`)

  **생성 파일**: `components/LinkCard.tsx`

- **Task-005: CopyButton 클라이언트 컴포넌트 구현 (F004)** ⬜ — 미시작
  - `components/CopyButton.tsx` 신규 생성 (`"use client"` 지시어)
  - `navigator.clipboard.writeText()` 로 URL 클립보드 복사
  - sonner `toast.success()` 로 복사 완료 토스트 알림 표시
  - `aria-label="URL 복사"` 접근성 속성 추가
  - 복사 성공/실패 상태 아이콘 전환 피드백

  **생성 파일**: `components/CopyButton.tsx`

  **테스트 체크리스트** (Playwright MCP):
  - 복사 버튼 클릭 후 sonner toast가 화면에 나타나는지 확인
  - 클립보드에 올바른 URL이 복사되는지 확인

---

### Phase 3: UI 완성 (카테고리 필터 + 홈페이지 연동)

> 목표: 카테고리 탭 필터 UI 완성 및 app/page.tsx에 Notion 데이터 실제 연동 (F003, F005 구현)

- **Task-006: LinkHubClient 카테고리 필터 컴포넌트 구현 (F005)** ⬜ — 미시작
  - `components/LinkHubClient.tsx` 신규 생성 (`"use client"` 지시어)
  - shadcn `Tabs` 컴포넌트로 카테고리 탭 UI 구현
  - "전체" 탭 포함, `Set`으로 카테고리 중복 제거
  - 반응형 그리드: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
  - 빈 상태(필터 결과 없음) 안내 메시지 처리

  **생성 파일**: `components/LinkHubClient.tsx`

  **테스트 체크리스트** (Playwright MCP):
  - 카테고리 탭 클릭 시 해당 카테고리 링크만 표시되는지 확인
  - "전체" 탭 클릭 시 모든 링크가 표시되는지 확인
  - 빈 카테고리 선택 시 안내 메시지가 표시되는지 확인

- **Task-007: app/page.tsx Notion 데이터 연동 (F001 + F003)** ⬜ — 미시작
  - `export const revalidate = 3600` ISR 설정 (1시간 캐시)
  - `fetchAllLinks()` 호출 + `try-catch` 빈 배열 폴백 처리
  - 기존 `HeroSection`, `TechStackSection` 제거하고 `LinkHubClient` 배치
  - 프로필 헤더 영역 (이름, 설명) 구성
  - **주의**: `app/examples/` 하위 파일 절대 수정/삭제 금지

  **수정 파일**: `app/page.tsx`

  **테스트 체크리스트** (Playwright MCP):
  - localhost:3000 접속 후 Notion 링크 카드가 렌더링되는지 확인
  - 다크모드 전환 시 색상 이상 없는지 확인 (F003)
  - ISR 캐시 헤더(`Cache-Control: s-maxage=3600`) 응답 확인

---

### Phase 4: 로딩 UI, 접근성 보완 및 최종 검증

> 목표: 사용자 경험 향상을 위한 로딩 UI 구현, 접근성 보완, 빌드 검증 및 배포 준비

- **Task-008: 로딩 UI 구현** ⬜ — 미시작
  - `app/loading.tsx` 신규 생성 (Next.js 자동 로딩 UI)
  - `components/ui/skeleton.tsx` 재사용한 Skeleton 그리드 로딩 UI
  - 링크 카드 형태와 동일한 Skeleton 레이아웃 (1열/2열/3열 반응형 동일 적용)
  - 다크/라이트 모드 Skeleton 색상 자동 적용 확인

  **생성 파일**: `app/loading.tsx`

- **Task-009: 접근성 보완 및 최종 검증** ⬜ — 미시작
  - `npm run lint` → 오류 0 확인
  - `npm run build` → 빌드 성공 확인
  - `.env.example` 최종 확인 (NOTION_API_KEY, NOTION_DATABASE_ID 포함 여부)
  - Vercel 환경변수 설정 확인 (배포 환경)
  - 전체 사용자 플로우 검증 (링크 렌더링 → 카테고리 탭 → URL 복사 → 다크모드)

  **테스트 체크리스트** (Playwright MCP):
  - localhost:3000에서 Notion 링크 카드 렌더링 확인
  - 카테고리 탭 클릭 → 필터링 동작 확인
  - URL 복사 버튼 클릭 → sonner toast 표시 확인
  - 다크모드 전환 → 색상 이상 없음 확인
  - 모바일 뷰포트 (375px) 1열 그리드 확인
  - 태블릿 뷰포트 (768px) 2열 그리드 확인
  - 데스크탑 뷰포트 (1280px) 3열 그리드 확인
  - `npm run build` 빌드 성공 확인

---

## 핵심 파일 목록

| 파일 | 상태 | 역할 |
|------|------|------|
| `package.json` | ⬜ 수정 | @notionhq/client 추가 |
| `.env.local` | ⬜ 수정 | 실제 Notion API 키 입력 |
| `next.config.ts` | ⬜ 수정 | Notion 이미지 도메인 추가 |
| `types/index.ts` | ✅ 완료 | LinkItem 타입 정의 |
| `lib/notion.ts` | ⬜ 신규 | Notion API 레이어 |
| `components/LinkCard.tsx` | ⬜ 신규 | 링크 카드 서버 컴포넌트 |
| `components/CopyButton.tsx` | ⬜ 신규 | URL 복사 클라이언트 컴포넌트 |
| `components/LinkHubClient.tsx` | ⬜ 신규 | 카테고리 필터 클라이언트 컴포넌트 |
| `app/page.tsx` | ⬜ 수정 | Notion 연동 홈페이지 |
| `app/loading.tsx` | ⬜ 신규 | Skeleton 로딩 UI |

## 의존성 그래프

```
Task-001(사전완료) ✅
    ↓
Task-002(환경설정) → Task-003(notion.ts) → Task-004(LinkCard)
                                         → Task-005(CopyButton)
                                              ↓
                              Task-006(LinkHubClient) → Task-007(page.tsx)
                                                             ↓
                                              Task-008(loading.tsx) → Task-009(검증)
```

## PRD 기능 요구사항 매핑

| PRD ID | 기능명 | 구현 Task | 상태 |
|--------|--------|-----------|------|
| F001 | Notion 데이터 동기화 (ISR) | Task-003, Task-007 | ⬜ |
| F002 | 반응형 링크 카드 그리드 | Task-004, Task-006 | ⬜ |
| F003 | 다크모드 전환 | Task-001 (ThemeProvider ✅), Task-007 검증 | 🚧 |
| F004 | URL 복사 + 토스트 알림 | Task-005 | ⬜ |
| F005 | 카테고리 탭 필터링 | Task-006 | ⬜ |
