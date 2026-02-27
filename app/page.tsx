// 랜딩 페이지: 서버 컴포넌트로 SEO 최적화
import { HeroSection } from "@/components/sections/hero-section"
import { TechStackSection } from "@/components/sections/tech-stack-section"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero: 메인 타이틀과 CTA 버튼 */}
      <HeroSection />
      {/* TechStack: 기술 스택 카드 그리드 */}
      <TechStackSection />
    </main>
  )
}
