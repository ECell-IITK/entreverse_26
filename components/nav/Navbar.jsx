'use client'

import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

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
    const handleScroll = () => setScrollY(window.scrollY)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const progress = Math.min(scrollY / 400, 1)
  const backgroundOpacity = 0.02 + progress * 0.10
  const borderOpacity = 0.06 + progress * 0.14
  const blur = 14 + progress * 34
  const shadowOpacity = progress * 6
  const paddingY = 18 - progress * 10
  const paddingX = 32 - progress * 12

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-6 pt-6">
        <nav
          style={{
            background: `rgba(13,22,53,${backgroundOpacity})`,
            borderColor: `rgba(61,107,255,${borderOpacity})`,
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            boxShadow: `0 10px 40px rgba(0,0,0,${shadowOpacity}), inset 0 1px rgba(94,200,255,0.06)`,
            paddingTop: `${paddingY}px`,
            paddingBottom: `${paddingY}px`,
            paddingLeft: `${paddingX}px`,
            paddingRight: `${paddingX}px`,
          }}
          className="flex w-full max-w-7xl items-center justify-between rounded-3xl border transition-all duration-150"
        >
          {/* Logo */}
          <a href="#top" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center">
              <img src="/logo_ecell.png" alt="EntreVerse Logo" />
            </div>
            <div className="leading-none">
              <h2 className="font-heading text-lg font-bold text-white">
                EntreVerse
              </h2>
              <p className="text-xs uppercase tracking-[0.26em] text-[#9fb3e8]">
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
                  className="rounded-xl px-6 py-3 text-sm font-medium text-[#d8e4ff] transition-all duration-300 hover:bg-white/5 hover:text-white"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <a
              href="/admin/login"
              className="hidden text-sm text-[#9fb3e8] transition hover:text-white lg:block"
            >
              Dashboard
            </a>

            <a
              href="/register"
              className="hidden rounded-full bg-gradient-to-r from-[#1e3fff] to-[#3b6bff] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1e3fff]/30 transition-all duration-300 hover:scale-105 hover:from-[#3d6bff] hover:to-[#5ec8ff] hover:shadow-[#5ec8ff]/45 lg:block"
            >
              Register Now
            </a>

            <button
              onClick={() => setOpen(!open)}
              className="rounded-xl border border-[#3d6bff]/25 bg-[#1e3fff]/10 p-2 backdrop-blur-xl lg:hidden"
            >
              {open ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {open && (
        <div className="fixed left-6 right-6 top-24 z-40 rounded-3xl border border-[#3d6bff]/20 bg-[#0d1635]/90 p-5 backdrop-blur-3xl lg:hidden">
          <ul className="space-y-1">
            {LINKS.map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-[#d8e4ff] transition hover:bg-white/5 hover:text-white"
                >
                  {link}
                </a>
              </li>
            ))}

            <li className="pt-3">
              <a
                href="/register"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-gradient-to-r from-[#1e3fff] to-[#3b6bff] py-3 text-center text-sm font-semibold text-white shadow-lg shadow-[#1e3fff]/30 transition-all hover:from-[#3d6bff] hover:to-[#5ec8ff]"
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
