'use client'

import { useEffect, useState } from 'react'
import { Menu, X, Orbit } from 'lucide-react'

const LINKS = [
  'About',
  'Competitions',
  'Workshops',
  'Discussions',
  'Timeline',
]

export function SiteNav() {
  const [scrollY, setScrollY] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Progress (0 → 1)
  const progress = Math.min(scrollY / 400, 1)
  // Glass opacity
  const backgroundOpacity = 0.015 + progress * 0.085
  // Border opacity
  const borderOpacity = 0.04 + progress * 0.11
  // Blur amount
  const blur = 12 + progress * 36
  // Shadow opacity
  const shadowOpacity = progress * 7
  // Shrink navbar
  const paddingY = 18 - progress * 10
  const paddingX = 32 - progress * 12

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-6 pt-6">
        <nav
          style={{
            background: `rgba(255,255,255,${backgroundOpacity})`,
            borderColor: `rgba(255,255,255,${borderOpacity})`,
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            boxShadow: `
              0 10px 40px rgba(0,0,0,${shadowOpacity}),
              inset 0 1px rgba(255,255,255,0.05)
            `,
            paddingTop: `${paddingY}px`,
            paddingBottom: `${paddingY}px`,
            paddingLeft: `${paddingX}px`,
            paddingRight: `${paddingX}px`,
          }}
          className="
            flex
            w-full
            max-w-7xl
            items-center
            justify-between
            rounded-3xl
            border
            transition-all
            duration-150
          "
        >
          {/* Logo */}
          <a href="#top" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center">
              <img src= "/logo_ecell.png" alt="EntreVerse Logo" />
            </div>

            <div className="leading-none">
              <h2 className="font-heading text-lg font-bold">
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
                  className="
                    rounded-xl
                    px-8
                    py-4
                    text-m
                    text-muted-foreground
                    transition-all
                    duration-300
                    hover:bg-white/5
                    hover:text-white
                  "
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
              className="hidden text-sm text-muted-foreground transition hover:text-white lg:block"
            >
              Dashboard
            </a>

            <a
              href="/register"
              className="
                hidden
                rounded-full
                bg-gradient-to-r
                from-amber-400
                to-orange-500
                px-6
                py-3
                text-sm
                font-semibold
                text-black
                shadow-lg
                shadow-orange-500/20
                transition-all
                duration-300
                hover:scale-105
                hover:shadow-orange-500/40
                lg:block
              "
            >
              Register Now
            </a>

            {/* Mobile Menu */}
            <button
              onClick={() => setOpen(!open)}
              className="
                rounded-xl
                border
                border-white/10
                bg-white/5
                p-2
                backdrop-blur-xl
                lg:hidden
              "
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
        <div
          className="
            fixed
            left-6
            right-6
            top-24
            z-40
            rounded-3xl
            border
            border-white/10
            bg-black/40
            p-5
            backdrop-blur-3xl
            lg:hidden
          "
        >
          <ul className="space-y-2">
            {LINKS.map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  className="
                    block
                    rounded-xl
                    px-4
                    py-3
                    text-muted-foreground
                    transition
                    hover:bg-white/5
                    hover:text-white
                  "
                >
                  {link}
                </a>
              </li>
            ))}

            <li className="pt-3">
              <a
                href="/register"
                onClick={() => setOpen(false)}
                className="
                  block
                  rounded-full
                  bg-gradient-to-r
                  from-amber-400
                  to-orange-500
                  py-3
                  text-center
                  font-semibold
                  text-black
                "
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