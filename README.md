# Minimalist Link-in-Bio (Notion CMS Hub)

Notion API를 활용한 미니멀리스트 링크 관리 플랫폼. Notion을 CMS로 사용하여 링크를 관리하고, 실시간으로 동기화되는 반응형 웹사이트입니다.

## ✨ 주요 기능

- **Notion 동기화**: Notion 데이터베이스와 실시간 데이터 동기화
- **반응형 레이아웃**: 모든 디바이스에서 최적화된 UI
- **다크모드**: CSS 변수 기반 테마 전환
- **링크 복사**: 한 번의 클릭으로 링크 복사
- **카테고리 필터링**: 링크를 카테고리별로 분류 및 필터링

## 🛠 기술 스택

- **Next.js 16** - App Router 기반 서버 렌더링
- **React 19** - 최신 리액트 동시성 기능
- **TypeScript 5** - 타입 안전성
- **Tailwind CSS 4** - 유틸리티 기반 스타일링
- **shadcn/ui** - 접근성 높은 UI 컴포넌트
- **@notionhq/client** - Notion API SDK
- **next-themes** - 다크모드 관리
- **sonner** - 토스트 알림
- **react-hook-form + zod** - 폼 검증

## 🚀 시작하기

### 사전 요구사항

- Node.js 18+ 설치
- Notion 계정 및 Integration API 키
- Notion 데이터베이스 (다음 속성 필요):
  - `Title` (제목)
  - `URL` (링크)
  - `Icon` (이모지 또는 아이콘)
  - `Category` (Select: 카테고리)
  - `Active` (Checkbox: 활성 여부)
  - `Order` (Number: 정렬 순서)

### 환경 설정

1. `.env.local` 파일 생성:

```env
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_database_id
```

2. 의존성 설치:

```bash
npm install
```

3. 개발 서버 실행:

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속합니다.

## 프로젝트 구조

```
app/                    # Next.js App Router
  layout.tsx            # 루트 레이아웃 (ThemeProvider, QueryProvider, Header, Toaster)
  page.tsx              # 홈페이지 (링크 허브 — F001~F005 구현 예정)
  examples/             # 기능 예제 페이지

components/
  ui/                   # shadcn/ui 컴포넌트 (직접 수정 금지)
  layout/               # Header, Container, MobileNav
  common/               # ThemeToggle, BackButton, PageHeader 등 공통 컴포넌트

lib/
  constants.ts          # SITE_CONFIG, ROUTES, TECH_STACK 상수
  utils.ts              # cn() 유틸리티 (clsx + tailwind-merge)

types/
  index.ts              # TypeScript 타입 (NavItem, LinkItem, Theme 등)

providers/
  query-provider.tsx    # TanStack Query 클라이언트 Provider

docs/
  PRD.md                # 제품 요구사항 명세
  issues.md             # ISR, Icon 처리, Rate Limit 해결 가이드
```

## 주의사항

### Notion API Rate Limit

Notion API 공식 문서에는 rate limit이 명시되어 있지 않습니다.

- 개인/소규모 사용 (하루 수천 번 접속): 정상 동작
- ISR 3600초 설정 기준: 문제 없음
- 대규모 배포 (많은 동시 방문자): 제한 발생 가능 — 캐싱 전략(Redis, CDN) 고려 필요

자세한 해결 방법은 [docs/issues.md](./docs/issues.md)를 참조하세요.

## 📖 문서

- [PRD.md](./docs/PRD.md) - 전체 제품 요구사항 명세
- [issues.md](./docs/issues.md) - 구현 시 필요한 가이드 및 코드 예제
- [CLAUDE.md](./CLAUDE.md) - Claude Code를 위한 개발 가이드

## 🔧 개발 명령어

```bash
npm run dev      # 개발 서버 시작
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 시작
npm run lint     # ESLint 실행
```

## 📝 주요 설정

### Tailwind CSS 4

PostCSS 플러그인 방식을 사용합니다. `globals.css`에서:

```css
@import "tailwindcss"
```

### 다크모드

`app/layout.tsx`에서 `ThemeProvider`로 관리되며, CSS 변수 기반(`class` attribute)으로 동작합니다.

### ISR 설정

홈페이지는 3600초(1시간) 간격으로 자동 재검증됩니다:

```typescript
export const revalidate = 3600
```

## 🤝 기여 가이드

1. 기능 브랜치 생성: `git checkout -b feature/기능명`
2. 변경사항 커밋: `git commit -m "feat: 기능 설명"`
3. 브랜치 푸시: `git push origin feature/기능명`
4. Pull Request 작성

## 📄 라이선스

MIT License

## 🙋 지원

문제가 발생하면 [issues.md](./docs/issues.md)를 참고하거나 GitHub Issues를 생성하세요.
