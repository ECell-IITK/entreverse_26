
'use client'

import { useEffect, useState } from 'react'
import { Menu, X, Orbit } from 'lucide-react'

const LINKS = [
  'About',
  'Competitions',
  'Workshops',
  'Speakers',
  'Timeline',
  'Sponsors',
  'FAQ',
]

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)

    onScroll()

    window.addEventListener('scroll', onScroll, {
      passive: true,
    })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-6 pt-6">
        <nav
          className={`flex w-full max-w-7xl items-center justify-between rounded-3xl border transition-all duration-300
          
          ${
            scrolled
              ? 'border-white/15 bg-white/[0.08] shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl'
              : 'border-white/10 bg-white/[0.04] backdrop-blur-xl'
          }

          px-8 py-4`}
        >
          {/* Logo */}
          <a href="#top" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
              <Orbit className="h-5 w-5 text-primary" />
            </div>

            <div className="leading-none">
              <h2 className="font-heading text-lg font-bold tracking-tight">
                EntreVerse
              </h2>

              <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                E-Cell IIT Kanpur
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden items-center gap-2 lg:flex">
            {LINKS.map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  className="rounded-xl px-4 py-2 text-sm text-muted-foreground transition-all duration-300 hover:bg-white/5 hover:text-white"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <a
              href="#dashboard"
              className="hidden text-sm font-medium text-muted-foreground transition hover:text-white lg:block"
            >
              Dashboard
            </a>

            <a
              href="#register"
              className="hidden rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105 hover:shadow-orange-500/50 lg:block"
            >
              Register Now
            </a>

            {/* Mobile Menu */}
            <button
              onClick={() => setOpen(!open)}
              className="rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur lg:hidden"
            >
              {open ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {open && (
        <div className="fixed left-6 right-6 top-24 z-40 rounded-3xl border border-white/10 bg-black/60 p-5 backdrop-blur-2xl lg:hidden">
          <ul className="space-y-2">
            {LINKS.map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-muted-foreground transition hover:bg-white/5 hover:text-white"
                >
                  {link}
                </a>
              </li>
            ))}

            <li className="pt-3">
              <a
                href="#register"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-gradient-to-r from-amber-400 to-orange-500 py-3 text-center font-semibold text-black"
              >
                Register Now
              </a>
            </li>
          </ul>
        </div>
      )}
    </>
  )
}