# 계획: starter-cleaner 서브에이전트로 프로젝트 초기화

## Context

현재 프로젝트는 Next.js 스타터킷 보일러플레이트 상태입니다.
docs/PRD.md에 정의된 Notion CMS 링크 허브 MVP 개발을 위해,
불필요한 데모/예제 코드를 제거하고 깨끗한 개발 기반을 마련합니다.

---

## 실행 방법

`starter-cleaner` 서브에이전트를 사용하여 아래 계획을 실행합니다.

---

## 제거 대상 (Boilerplate)

### 파일/폴더 삭제
- `app/examples/` 전체 하위 파일 (shrimp-rules.md에 `app/examples/` 삭제 금지 명시 → 보존)
- `components/examples/` 전체 (7개 데모 컴포넌트)
- `components/sections/components-grid.tsx` (예제 카드 그리드)
- `components/sections/showcase-section.tsx` (미사용 파일)

### 코드 정리
- `app/page.tsx`: HeroSection + TechStackSection 제거 → LinkHubClient 준비 구조로 교체
- `lib/constants.ts`: COMPONENT_CARDS, IMAGE_URLS 제거 (예제용 상수), SITE_CONFIG/ROUTES는 유지
- `types/index.ts`: ComponentCardItem, ComponentCardTag 타입 제거 (TechStackItem, NavItem은 유지)
- `components/layout/header.tsx`: NAV_ITEMS에서 examples 관련 링크 제거
- `app/layout.tsx`: Footer 제거 여부 검토 (PRD에 없음)

---

## 보존 대상 (Production)

- `app/layout.tsx` — ThemeProvider, QueryProvider, Header, Toaster (수정 최소화)
- `components/layout/` — Header, Container (MobileNav 포함)
- `components/common/` — ThemeToggle, BackButton, PageHeader
- `components/ui/` — 모든 shadcn/ui 컴포넌트 (직접 수정 금지)
- `providers/query-provider.tsx` — TanStack Query
- `lib/utils.ts` — cn() 유틸리티
- `lib/constants.ts` (일부) — ROUTES, SITE_CONFIG, NAV_ITEMS 유지
- `types/index.ts` (일부) — NavItem, TechStackItem, Theme 유지
- `next.config.ts`, `tsconfig.json`, `package.json`
- `docs/PRD.md`, `docs/issues.md`
- `.env.local`, `.env.example`
- `app/examples/` — shrimp-rules.md 금지 사항에 의해 삭제 불가

---

## 문서 업데이트

### README.md
PRD.md 기반으로 완전히 재작성:
- 프로젝트명: Notion CMS 링크 허브
- 목적: Notion DB를 CMS로 활용한 개인 디지털 명함 사이트
- 주요 기능: F001~F005 (데이터 동기화, 링크 카드, 다크모드, URL 복사, 카테고리 필터)
- 기술 스택: package.json 분석 기반
- 환경변수 설정 안내
- Rate Limit 주의사항 (docs/issues.md 기반)

### CLAUDE.md
상단에 프로젝트 간단 설명 추가 (2줄):
```
**Notion CMS 링크 허브**는 Notion 데이터베이스를 CMS로 활용하여 코드 배포 없이 링크 페이지를 실시간 관리하는 개인 디지털 명함 사이트입니다.
📋 상세 프로젝트 요구사항은 @/docs/PRD.md 참조
```

---

## 핵심 파일 경로

| 파일 | 작업 |
|------|------|
| `app/page.tsx` | HeroSection, TechStackSection 제거 → 빈 서버 컴포넌트 구조 |
| `lib/constants.ts` | COMPONENT_CARDS, IMAGE_URLS 제거 |
| `types/index.ts` | ComponentCardItem, ComponentCardTag 제거 |
| `components/layout/header.tsx` | 예제 관련 NAV_ITEMS 제거 |
| `components/examples/` | 전체 삭제 |
| `components/sections/components-grid.tsx` | 삭제 |
| `components/sections/showcase-section.tsx` | 삭제 |
| `README.md` | PRD 기반 완전 재작성 |
| `CLAUDE.md` | 상단에 프로젝트 설명 추가 |

---

## 검증 방법

1. `npm run lint` — ESLint 오류 0개
2. `npm run build` — TypeScript 컴파일 성공, 빌드 완료
3. `npm run dev` — http://localhost:3000 정상 구동
4. 깨진 import 없음 확인
5. README.md, CLAUDE.md PRD 기반 업데이트 확인
