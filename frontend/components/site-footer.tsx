'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Orbit, ArrowUp, Send, Heart } from 'lucide-react'
import Image from 'next/image'

const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    href: 'https://facebook.com/ecelliitk',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/entrepreneurship-cell-iit-kanpur/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/ecelliitk/',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
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
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/channel/UCvxavCg0UhXq6oKkrBHc9zQ',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#07080f" />
      </svg>
    ),
  },
]

const NAV_COLS = [
  {
    heading: 'EntreVerse',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Competitions', href: '#competitions' },
      { label: 'Workshops', href: '#workshops' },
      { label: 'Discussions', href: '#discussions' },
      { label: 'Timeline', href: '#timeline' },
    ],
  },
  {
    heading: 'E-Cell IITK',
    links: [
      { label: 'Website', href: 'https://www.ecelliitk.org/', external: true },
      { label: 'Instagram', href: 'https://www.instagram.com/ecelliitk/', external: true },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/company/entrepreneurship-cell-iit-kanpur/', external: true },
      { label: 'YouTube', href: 'https://www.youtube.com/channel/UCvxavCg0UhXq6oKkrBHc9zQ', external: true },
    ],
  },
]

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1 },
  }),
}

export function SiteFooter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setStatus('error')
      return
    }
    // TODO: wire to real subscription endpoint
    setStatus('sent')
    setEmail('')
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="relative mt-8 overflow-hidden border-t border-white/[0.07]">

      {/* ── Full-bleed map background ── */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/iitk_map.png"
          alt=""
          aria-hidden="true"
          fill
          className="object-cover object-center opacity-55"
          sizes="100vw"
          priority={false}
        />
        {/* Dark overlay so content stays readable */}
        <div className="absolute inset-0 bg-[#07080f]/55" />
        {/* Top fade — blends with the page above */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#07080f] to-transparent" />
        {/* Ambient orange glow centre-bottom (matches original) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_100%,rgba(249,115,22,0.09),transparent)]" />
      </div>

      {/* ── Main footer body ── */}
      <div className="mx-auto max-w-6xl px-4 py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1.6fr]"
        >

          {/* Col 1 — Brand */}
          <motion.div variants={fade} custom={0} className="flex flex-col gap-5">
            {/* Logo mark */}
            <a href="#top" className="flex items-center gap-3 self-start">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
                <Orbit className="h-5 w-5 text-primary" />
              </div>
              <div className="leading-none">
                <p className="font-heading text-base font-bold">EntreVerse</p>
                <p className="text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
                  E-Cell IIT Kanpur
                </p>
              </div>
            </a>

            {/* Tagline */}
            <p className="text-sm leading-relaxed text-muted-foreground">
              Where ideas leave the ground and startups take orbit.
            </p>

            {/* Ideate · Innovate · Incubate */}
            <ul className="flex flex-col gap-1.5">
              {['Ideate', 'Innovate', 'Incubate'].map((word) => (
                <li key={word} className="flex items-center gap-2.5 text-sm font-medium text-foreground/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {word}
                </li>
              ))}
            </ul>

            {/* Social icons */}
            <div className="flex flex-wrap gap-2 pt-1">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="glass flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-200 hover:scale-110 hover:border-primary/30 hover:text-primary"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Col 2 & 3 — Nav columns */}
          {NAV_COLS.map((col, ci) => (
            <motion.div key={col.heading} variants={fade} custom={ci + 1}>
              <h4 className="mb-4 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={'external' in link && link.external ? '_blank' : undefined}
                      rel={'external' in link && link.external ? 'noopener noreferrer' : undefined}
                      className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
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
            <h4 className="mb-1 font-heading text-base font-semibold">
              Get Notified.
            </h4>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
              Be the first to know about the activities of E-Cell.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
              <div className="glass flex overflow-hidden rounded-xl border border-white/[0.08] focus-within:border-primary/40 focus-within:shadow-[0_0_0_3px_rgba(249,115,22,0.08)] transition-all duration-200">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setStatus('idle') }}
                  placeholder="your@email.com"
                  required
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex items-center justify-center px-4 text-accent transition-colors hover:text-primary"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>

              {status === 'sent' && (
                <p className="text-xs text-accent">
                  You&apos;re on the list — we&apos;ll be in touch! 🚀
                </p>
              )}
              {status === 'error' && (
                <p className="text-xs text-destructive">
                  Please enter a valid email address.
                </p>
              )}
            </form>

            {/* E-Cell website link */}
            <a
              href="https://www.ecelliitk.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <Orbit className="h-3.5 w-3.5 text-primary" />
              ecelliitk.org
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Divider ── */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* ── Bottom bar ── */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5">
        <p className="text-xs text-muted-foreground">
          Made with{' '}
          <Heart className="inline-block h-3 w-3 fill-primary text-primary align-[-2px]" />{' '}
          by{' '}
          <a
            href="https://www.ecelliitk.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/70 transition-colors hover:text-foreground"
          >
            E-Cell, IIT Kanpur
          </a>
        </p>

        <p className="hidden text-xs text-muted-foreground sm:block">
          EntreVerse 2026 · Where Ideas Become Impact
        </p>

        {/* Back to top */}
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="glass flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-200 hover:scale-110 hover:border-primary/30 hover:text-primary"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </footer>
  )
}
