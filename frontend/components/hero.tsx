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

const TAGLINE = 'Where Ideas Become Impact'

const META = [
  { icon: CalendarDays, label: '15–17 August 2026' },
  { icon: MapPin, label: 'IIT Kanpur' },
  { icon: IndianRupee, label: '₹XXX Prize Pool' },
  { icon: Users, label: 'YYY Participants' },
]

const CARDS = [
  { icon: Lightbulb, title: 'Startup Sprint', tone: 'amber', pos: 'left-0 top-6', delay: 0.2 },
  { icon: Trophy, title: '₹15L Prize Pool', tone: 'sky', pos: 'right-0 top-24', delay: 0.4 },
  { icon: Rocket, title: '1500+ Participants', tone: 'sky', pos: 'left-2 bottom-20', delay: 0.6 },
  { icon: Mic, title: 'Founder Talks', tone: 'amber', pos: 'right-2 bottom-8', delay: 0.8 },
]

export function Hero() {
  return (
    <section
      id="top"
      className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 pb-20 pt-32 lg:pt-28"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left: content */}
        <div className="relative z-10">
          {/* <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-muted-foreground"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
            IIT Kanpur&apos;s Flagship Entrepreneurship Festival
          </motion.div> */}

          <h1 className="mt-6 font-heading text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="block text-balance"
            >
              ENTREVERSE
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="block bg-gradient-to-r from-primary via-amber to-accent bg-clip-text text-transparent"
            >
              2026
            </motion.span>
          </h1>

          {/* Letter-by-letter tagline */}
          <p className="mt-5 flex flex-wrap font-heading text-lg font-medium text-foreground/90 sm:text-xl">
            {TAGLINE.split('').map((char, i) => (
              <motion.span
                key={`${char}-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.045, duration: 0.3 }}
                className={char === ' ' ? 'w-2' : ''}
              >
                {char}
              </motion.span>
            ))}
          </p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground"
          >
            Join India&apos;s brightest innovators, founders, investors, and future
            entrepreneurs for three unforgettable days of competitions, workshops,
            networking, and startup experiences.
          </motion.p>

          {/* Meta row */}
          <motion.ul
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="mt-7 flex flex-wrap gap-2.5"
          >
            {META.map((m) => (
              <li
                key={m.label}
                className="glass inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground/90"
              >
                <m.icon className="h-4 w-4 text-accent" />
                {m.label}
              </li>
            ))}
          </motion.ul>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="mt-9 flex flex-wrap items-center gap-3"
            id="register"
          >
            <a
              href="#register"
              className="animate-pulse-ring group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_rgba(245,158,11,0.8)] transition-transform hover:scale-[1.03]"
            >
              Register Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#about"
              className="inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/5 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur-md transition-colors hover:border-accent/70 hover:bg-accent/10"
            >
              <Sparkles className="h-4 w-4 text-accent" />
              Explore Events
            </a>
          </motion.div>
        </div>

        {/* Right: orbital visual + floating cards */}
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
                  c.tone === 'amber'
                    ? 'bg-primary/15 text-primary'
                    : 'bg-accent/15 text-accent'
                }`}
              >
                <c.icon className="h-5 w-5" />
              </span>
              <span className="whitespace-nowrap text-sm font-medium">
                {c.title}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
