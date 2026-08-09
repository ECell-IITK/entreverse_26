'use client'

import { motion } from 'motion/react'
import {
  ArrowRight,
  Sparkles,
  Lightbulb,
  Trophy,
  Rocket,
  Mic,
  CalendarDays,
  MapPin,
  IndianRupee,
  Users,
} from 'lucide-react'
import { InnovationCore } from './innovation-core'

// ── Theme ────────────────────────────────────────────────────────────────────
const TAGLINE = 'Continuum of Innovation'
const THEME_SUBTITLE =
  'Where every idea continues the one before — and sparks the one after.'

const META = [
  { icon: CalendarDays, label: '15–17 August 2026' },
  { icon: MapPin,        label: 'IIT Kanpur' },
  { icon: IndianRupee,   label: '₹15L+ Prize Pool' },
  { icon: Users,         label: '1500+ Participants' },
]

// tone: 'blue-deep' → left deep-blue accent, 'blue-cyan' → right cyan accent
const CARDS = [
  { icon: Lightbulb, title: 'Startup Sprint',     tone: 'blue-deep', pos: 'left-0 top-6',     delay: 0.2 },
  { icon: Trophy,    title: '₹15L Prize Pool',    tone: 'blue-cyan', pos: 'right-0 top-24',   delay: 0.4 },
  { icon: Rocket,    title: '1500+ Participants', tone: 'blue-cyan', pos: 'left-2 bottom-20', delay: 0.6 },
  { icon: Mic,       title: 'Founder Talks',      tone: 'blue-deep', pos: 'right-2 bottom-8', delay: 0.8 },
]

export function Hero() {
  return (
    <section
      id="top"
      className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 pb-20 pt-32 lg:pt-28"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        {/* ── Left: content ─────────────────────────────────────────── */}
        <div className="relative z-10">
          <h1 className="mt-6 font-heading text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            {/* Pure white — max contrast */}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="block text-balance text-white"
            >
              ENTREVERSE
            </motion.span>

            {/* "2026" — deep-blue → electric-cyan gradient */}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="block bg-gradient-to-r from-[#1e3fff] via-[#5ec8ff] to-[#4fd8ff] bg-clip-text text-transparent"
            >
              2026
            </motion.span>
          </h1>

          {/* Theme tagline — bright blue-white */}
          <p className="mt-5 flex flex-wrap font-heading text-xl font-medium text-[#d8e4ff] md:text-2xl lg:text-3xl">
            {TAGLINE.split('').map((char, i) => (
              <motion.span
                key={`${char}-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.042, duration: 0.3 }}
                className={char === ' ' ? 'w-2' : ''}
              >
                {char}
              </motion.span>
            ))}
          </p>

          {/* Theme sub-line — visible but secondary, no gray */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 1.35 }}
            className="mt-2 text-m font-medium tracking-wide text-[#9fb3e8]"
          >
            {THEME_SUBTITLE}
          </motion.p>

          {/* Body copy — bright text-secondary */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="mt-5 max-w-xl text-pretty leading-relaxed text-[#d8e4ff]"
          >
            Join India&apos;s brightest innovators, founders, investors, and future
            entrepreneurs for three unforgettable days of competitions, workshops,
            networking, and startup experiences.
          </motion.p>

          {/* Meta pills */}
          <motion.ul
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.65 }}
            className="mt-7 flex flex-wrap gap-2.5"
          >
            {META.map((m) => (
              <li
                key={m.label}
                className="glass inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white"
              >
                <m.icon className="h-4 w-4 text-[#5ec8ff]" />
                {m.label}
              </li>
            ))}
          </motion.ul>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.85 }}
            className="mt-9 flex flex-wrap items-center gap-3"
            id="register"
          >
            {/* Primary CTA — deep-blue → cyan gradient, strong neon glow */}
            <a
              href="/register"
              className="animate-pulse-ring group inline-flex items-center gap-2 rounded-xl btn-continuum px-6 py-3.5 text-sm font-semibold text-white transition-transform"
            >
              Register Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>

            {/* Secondary CTA — deep-blue border, cyan hover */}
            <a
              href="#about"
              className="inline-flex items-center gap-2 rounded-xl border border-[#3d6bff]/50 bg-[#1e3fff]/8 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:border-[#5ec8ff]/70 hover:bg-[#5ec8ff]/10"
            >
              <Sparkles className="h-4 w-4 text-[#5ec8ff]" />
              Explore Events
            </a>
          </motion.div>
        </div>

        {/* ── Right: orbital visual + floating cards ────────────────── */}
        <div className="relative mt-6 lg:mt-0">
          <div className="animate-float-soft">
            <InnovationCore />
          </div>

          {CARDS.map((c) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: c.delay }}
              className={`glass absolute ${c.pos} flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-xl shadow-black/30`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  c.tone === 'blue-deep'
                    ? 'bg-[#1e3fff]/20 text-[#5ec8ff]'   /* deep-blue bg, cyan icon */
                    : 'bg-[#3b6bff]/20 text-[#4fd8ff]'   /* mid-blue bg, bright icon */
                }`}
              >
                <c.icon className="h-5 w-5" />
              </span>
              <span className="whitespace-nowrap text-sm font-medium text-white">
                {c.title}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
