import { SpaceBackground } from '@/components/background/space-background'
import { SiteNav } from '@/components/nav/Navbar'
import { GrowthSection } from '@/components/growth-section'
import { Hero } from '@/components/hero'

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <SpaceBackground />
      <SiteNav />
      <Hero />
      <GrowthSection />
      <footer className="relative border-t border-white/10 py-10 text-center text-sm text-muted-foreground">
        <p>EntreVerse 2026 · Entrepreneurship Cell, IIT Kanpur</p>
        <p className="mt-1 text-xs">Where Ideas Become Impact</p>
      </footer>
    </main>
  )
}
