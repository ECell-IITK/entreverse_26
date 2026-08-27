'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowRight } from 'lucide-react'

const LINKS = [
  { name: 'About', href: '#about' },
  { name: 'Competitions', href: '#competitions' },
  { name: 'Keynotes', href: '#discussions' },
]

export function SiteNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'border-b border-violet-500/20 bg-[#030014]/80 backdrop-blur-xl shadow-lg shadow-black/50 py-3 sm:py-3.5'
            : 'border-b border-transparent bg-transparent py-4 sm:py-5'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-3 transition-opacity hover:opacity-95"
          >
            <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center shrink-0">
              <img
                src="/logo_ecell.png"
                alt="Entrepreneurship Cell IIT Kanpur Logo"
                className="h-full w-full object-contain drop-shadow-[0_0_12px_rgba(124,58,237,0.7)] transition-transform group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center leading-none">
              <span className="font-heading text-sm sm:text-base font-bold tracking-tight text-white transition-colors group-hover:text-[#00f0ff]">
                Entrepreneurship Cell
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] text-[#00f0ff] mt-0.5">
                IIT Kanpur
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-violet-950/40 hover:text-white hover:shadow-sm"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/register"
              className="hidden rounded-xl btn-continuum px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 sm:inline-flex items-center gap-1.5"
            >
              Register Team
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle Navigation Menu"
              className={`rounded-xl p-2 text-white transition-colors md:hidden ${
                isScrolled
                  ? 'border border-violet-500/30 bg-violet-950/40'
                  : 'bg-transparent hover:bg-white/10'
              }`}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-x-3 top-20 z-40 rounded-3xl border border-violet-500/30 bg-[#05011a]/95 p-5 shadow-2xl backdrop-blur-3xl md:hidden">
          <ul className="space-y-1">
            {LINKS.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-violet-950/40 hover:text-white"
                >
                  {link.name}
                </a>
              </li>
            ))}

            <li className="pt-2">
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="block w-full rounded-xl btn-continuum py-3 text-center text-sm font-bold text-white shadow-lg transition-all"
              >
                Register Team
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  )
}
