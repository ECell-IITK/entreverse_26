import { SpaceBackground } from '@/components/background/space-background'
import { SiteNav } from '@/components/nav/Navbar'
import { GrowthSection } from '@/components/growth-section'
import { Hero } from '@/components/hero'
import { CompetitionsSection } from '@/components/competitions-section'
import { EventsSection } from '@/components/events-section'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <SpaceBackground />
      <SiteNav />
      <Hero />
      <GrowthSection />
      <CompetitionsSection />
      <EventsSection />
      <SiteFooter />
    </main>
  )
}
