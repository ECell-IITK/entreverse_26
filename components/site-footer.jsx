'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowUp, Send, Heart, MapPin, Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/entrepreneurship-cell-iit-kanpur/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/ecelliitk/',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:h-5 sm:w-5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: 'https://twitter.com/ecelliitk',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/channel/UCvxavCg0UhXq6oKkrBHc9zQ',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#07080f" />
      </svg>
    ),
  },
]

const NAV_COLS = [
  {
    heading: 'Festival',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Competitions', href: '#competitions' },
      { label: 'Keynotes', href: '#discussions' },
      { label: 'Register', href: '/register' },
    ],
  },
  {
    heading: 'E-Cell IITK',
    links: [
      { label: 'Official Website', href: 'https://www.ecelliitk.org/', external: true },
      { label: 'SIIC Incubation', href: 'https://siiciitk.com/', external: true },
      { label: 'Instagram', href: 'https://www.instagram.com/ecelliitk/', external: true },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/company/entrepreneurship-cell-iit-kanpur/', external: true },
    ],
  },
]

const fade = {
  hidden: { opacity: 0, y: 15 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.05 },
  }),
}

export function SiteFooter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setStatus('error')
      return
    }
    setStatus('sent')
    setEmail('')
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="relative mt-12 overflow-hidden border-t border-violet-500/20">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/iitk_map.png"
          alt=""
          aria-hidden="true"
          fill
          className="object-cover object-center opacity-25"
          sizes="100vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-[#030014]/85" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#030014] to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_100%,rgba(124,58,237,0.20),transparent)]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '100px 0px' }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.4fr]"
        >
          {/* Col 1 — Brand */}
          <motion.div variants={fade} custom={0} className="flex flex-col gap-3 sm:gap-4">
            <Link href="/" className="group flex items-center gap-3 self-start transition-opacity hover:opacity-95">
              <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center shrink-0">
                <img
                  src="/logo_ecell.png"
                  alt="Entrepreneurship Cell IIT Kanpur Logo"
                  className="h-full w-full object-contain drop-shadow-[0_0_10px_rgba(124,58,237,0.7)] transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center leading-none">
                <p className="font-heading text-base sm:text-lg font-bold text-white transition-colors group-hover:text-[#00f0ff]">
                  Entrepreneurship Cell
                </p>
                <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] text-[#00f0ff] mt-0.5">
                  IIT Kanpur
                </p>
              </div>
            </Link>

            <div className="flex flex-col gap-1.5 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#00f0ff] shrink-0" />
                Outreach Building, IIT Kanpur, UP 208016
              </span>
              <span className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                ecell@iitk.ac.in
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="glass flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl text-slate-400 transition-all duration-200 hover:scale-110 hover:border-[#00f0ff]/50 hover:text-[#00f0ff]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Col 2 & 3 — Nav columns */}
          {NAV_COLS.map((col, ci) => (
            <motion.div key={col.heading} variants={fade} custom={ci + 1}>
              <h4 className="mb-3 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-[#00f0ff]">
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="text-xs sm:text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Col 4 — Newsletter */}
          <motion.div variants={fade} custom={3}>
            <h4 className="mb-2 font-heading text-sm sm:text-base font-semibold text-white">
              Stay in the Loop
            </h4>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5" noValidate>
              <div className="glass flex overflow-hidden rounded-xl border border-violet-500/30 focus-within:border-[#00f0ff]/70 transition-all duration-200">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setStatus('idle') }}
                  placeholder="your@email.com"
                  required
                  className="flex-1 bg-transparent px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex items-center justify-center px-3.5 text-[#00f0ff] transition-colors hover:text-white"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>

              {status === 'sent' && (
                <p className="text-xs text-[#00f0ff]">
                  Subscribed! 🚀
                </p>
              )}
              {status === 'error' && (
                <p className="text-xs text-red-400">
                  Please enter a valid email address.
                </p>
              )}
            </form>
          </motion.div>
        </motion.div>
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-3 px-4 py-4 text-center sm:text-left">
        <p className="text-xs text-slate-400">
          Organized by{' '}
          <a
            href="https://www.ecelliitk.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-200 transition-colors hover:text-white"
          >
            Entrepreneurship Cell, IIT Kanpur
          </a>
        </p>

        <p className="text-xs text-slate-400">
          EntreVerse 2026 · IIT Kanpur
        </p>

        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="glass flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl text-slate-400 transition-all duration-200 hover:scale-110 hover:border-[#00f0ff]/40 hover:text-white"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </footer>
  )
}
