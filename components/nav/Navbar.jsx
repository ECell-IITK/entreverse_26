'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const LINKS = [
  'About',
  'Competitions',
  'Workshops',
  'Discussions',
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
            ? 'border-b border-white/[0.08] bg-[#060a16]/85 backdrop-blur-xl shadow-lg shadow-black/20 py-3 sm:py-3.5'
            : 'border-b border-transparent bg-transparent py-4 sm:py-5'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <a
            href="#top"
            className="group flex items-center gap-3 transition-opacity hover:opacity-95"
          >
            <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center shrink-0">
              <img
                src="/logo_ecell.png"
                alt="Entrepreneurship Cell IIT Kanpur Logo"
                className="h-full w-full object-contain drop-shadow-[0_0_12px_rgba(94,200,255,0.45)] transition-transform group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center leading-none">
              <span className="font-heading text-sm sm:text-base font-bold tracking-tight text-white transition-colors group-hover:text-[#5ec8ff]">
                Entrepreneurship Cell
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] text-[#5ec8ff] mt-0.5">
                IIT Kanpur
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-[#d8e4ff] transition-all duration-200 hover:bg-white/5 hover:text-white"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/admin/login"
              className="hidden text-xs sm:text-sm font-medium text-[#9fb3e8] transition hover:text-white sm:block"
            >
              Admin Portal
            </Link>

            <Link
              href="/register"
              className="hidden rounded-xl bg-gradient-to-r from-[#1e3fff] to-[#3b6bff] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-[#1e3fff]/30 transition-all duration-200 hover:scale-105 hover:from-[#3d6bff] hover:to-[#5ec8ff] sm:block"
            >
              Register Now
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle Navigation Menu"
              className={`rounded-xl p-2 text-white transition-colors md:hidden ${
                isScrolled
                  ? 'border border-white/10 bg-white/5'
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
        <div className="fixed inset-x-3 top-20 z-40 rounded-3xl border border-white/10 bg-[#080d1a]/95 p-5 shadow-2xl backdrop-blur-3xl md:hidden">
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

            <li className="pt-2">
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="block w-full rounded-xl bg-gradient-to-r from-[#1e3fff] to-[#3b6bff] py-3 text-center text-sm font-semibold text-white shadow-lg shadow-[#1e3fff]/30 transition-all"
              >
                Register for Competitions
              </Link>
            </li>

            <li className="pt-1">
              <Link
                href="/admin/login"
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-2.5 text-center text-xs font-medium text-[#9fb3e8] hover:text-white transition"
              >
                Admin Portal Login →
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  )
}
