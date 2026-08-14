'use client'

import { motion } from 'motion/react'
import {
  ArrowRight,
  Sparkles,
  CalendarDays,
  MapPin,
} from 'lucide-react'
import { InnovationCore } from './innovation-core'

const META = [
  { icon: CalendarDays, label: '29–30 August 2026' },
  { icon: MapPin, label: 'IIT Kanpur' },
]

export function Hero() {
  return (
    <section
      id="top"
      className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 pb-16 pt-24 sm:pb-20 sm:pt-32 lg:pt-28"
    >
      <div className="grid items-center gap-8 lg:gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        {/* ── Left: content ─────────────────────────────────────────── */}
        <div className="relative z-10 text-center lg:text-left">
          
          <h1 className="font-heading text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="block text-balance text-white"
            >
              ENTREVERSE
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="block bg-gradient-to-r from-[#1e3fff] via-[#5ec8ff] to-[#4fd8ff] bg-clip-text text-transparent"
            >
              2026
            </motion.span>
          </h1>

          {/* Theme Highlight Line */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="mt-6 inline-block rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-left backdrop-blur-md"
          >
            <p className="font-heading text-base sm:text-xl font-bold text-[#5ec8ff] tracking-wide">
              Continuum of Innovation
            </p>
            <p className="text-xs sm:text-sm text-[#9fb3e8] mt-1 font-medium">
              Where every idea continues the one before — and sparks the one after.
            </p>
          </motion.div>

          {/* Spacious Dates Badges */}
          <motion.ul
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.3 }}
            className="mt-8 sm:mt-10 flex flex-wrap justify-center lg:justify-start gap-3"
          >
            {META.map((m) => (
              <li
                key={m.label}
                className="glass inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-sm"
              >
                <m.icon className="h-4 w-4 text-[#5ec8ff]" />
                {m.label}
              </li>
            ))}
          </motion.ul>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.38 }}
            className="mt-8 sm:mt-10 flex flex-col xs:flex-row items-center justify-center lg:justify-start gap-3.5"
            id="register"
          >
            <a
              href="/register"
              className="w-full xs:w-auto justify-center animate-pulse-ring group inline-flex items-center gap-2 rounded-xl btn-continuum px-7 py-3.5 text-sm font-semibold text-white transition-transform"
            >
              Register Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>

            <a
              href="#about"
              className="w-full xs:w-auto justify-center inline-flex items-center gap-2 rounded-xl border border-[#3d6bff]/50 bg-[#1e3fff]/8 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:border-[#5ec8ff]/70 hover:bg-[#5ec8ff]/10"
            >
              <Sparkles className="h-4 w-4 text-[#5ec8ff]" />
              Explore Theme & Events
            </a>
          </motion.div>
        </div>

        {/* ── Right: pure orbital visual ────────────────── */}
        <div className="relative mt-4 sm:mt-6 lg:mt-0 flex flex-col items-center justify-center">
          <div className="animate-float-soft w-full flex justify-center">
            <InnovationCore />
          </div>
        </div>
      </div>
    </section>
  )
}
