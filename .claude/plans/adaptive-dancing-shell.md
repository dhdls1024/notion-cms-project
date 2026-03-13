# 계획: docs/ROADMAP.md 생성

## Context

PRD.md, goofy-chasing-dove.md(개발 계획), shrimp-rules.md를 기반으로 development-planner 서브에이전트를 사용하여
`docs/ROADMAP.md` 파일을 생성한다.

**현재 프로젝트 상태 (2026-03-12 기준)**:
- `types/index.ts` — LinkItem 타입 이미 정의됨 ✅
- `@notionhq/client` 미설치 ❌
- `lib/notion.ts` 미존재 ❌
- `components/LinkCard.tsx`, `CopyButton.tsx`, `LinkHubClient.tsx` 미존재 ❌
- `app/page.tsx` — 골격만 존재, TODO 주석만 있음 ❌
- `next.config.ts` — Notion 이미지 도메인 미설정 ❌
- shadcn/ui tabs, badge, skeleton 이미 설치 ✅
- app/layout.tsx — Toaster, ThemeProvider 이미 설정 ✅

## 실행 방법

1. `development-planner` 서브에이전트를 사용한다.
2. PRD.md + goofy-chasing-dove.md + 현재 프로젝트 상태를 에이전트에 전달한다.
3. 에이전트가 `docs/ROADMAP.md`를 생성한다.

## 에이전트에 전달할 컨텍스트

- **PRD 핵심 기능**: F001~F005 (Notion 동기화, 링크 카드, 다크모드, 복사, 카테고리 필터)
- **기술 스택**: Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, shadcn/ui, next-themes, sonner, @notionhq/client
- **goofy-chasing-dove.md 일별 계획**: Day1(환경설정) → Day2(타입+notion.ts) → Day3(컴포넌트) → Day4(필터) → Day5(페이지 연동) → Day6(로딩 UI) → Day7(검증)
- **이미 완료된 항목**: LinkItem 타입, shadcn tabs/badge/skeleton, ThemeProvider, Toaster

## 생성 대상 파일

- `docs/ROADMAP.md`

## 검증

- ROADMAP.md가 `docs/` 디렉토리에 생성되었는지 확인
- Phase 구조 (Phase 1~4), Task 번호 형식, 상태 표시 규칙이 올바른지 확인
- PRD의 F001~F005 기능이 모두 Task로 분해되었는지 확인
