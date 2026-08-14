'use client'

import { motion } from 'motion/react'
import { ArrowRight, TrendingUp, Briefcase, Zap } from 'lucide-react'

const COMPETITIONS = [
  {
    id: 'flip-the-future',
    number: '01',
    icon: TrendingUp,
    tone: 'violet',
    tag: 'Y25s · Investment & Bidding',
    title: 'Flip the Future',
    description:
      'Strategic decision-making and smart investments. Evaluate promising firms, outbid competitors, and build winning portfolios.',
    highlights: ['Portfolio Building', 'Competitive Bidding', 'Grand Finale'],
    registerHref: '/register?competition=flip-the-future',
  },
  {
    id: 'strategy-showdown',
    number: '02',
    icon: Briefcase,
    tone: 'magenta',
    tag: 'PGs · Business Strategy',
    title: 'The Strategy Showdown',
    description:
      'Step into the shoes of business innovators. Tackle real-world industry challenges and craft high-impact enterprise solutions.',
    highlights: ['Case Studies', 'Domain Innovation', 'Strategic Pitch'],
    registerHref: '/register?competition=strategy-showdown',
  },
  {
    id: 'startup-sprint',
    number: '03',
    icon: Zap,
    tone: 'blue',
    tag: 'All Teams · 24h Hackathon',
    title: 'Start-up Sprint',
    description:
      '"One Day One Idea Infinite Potential" — An intense 24-hour sprint transforming ideas into functional MVPs and prototypes.',
    highlights: ['Idea to MVP', '24h Build Sprint', 'Dawn Demo Day'],
    registerHref: '/register?competition=startup-sprint',
  },
]

const TONE_STYLES = {
  violet: {
    iconBg: 'bg-[#1e3fff]/20',
    iconText: 'text-[#5ec8ff]',
    iconRing: 'ring-[#1e3fff]/35',
    tagBg: 'bg-[#1e3fff]/12',
    tagText: 'text-[#5ec8ff]',
    tagBorder: 'border-[#1e3fff]/30',
    numText: 'text-[#1e3fff]/30',
    glowBg: 'from-[#1e3fff]/25',
    chipBg: 'bg-[#1e3fff]/12',
    chipText: 'text-[#5ec8ff]',
    chipBorder: 'border-[#1e3fff]/25',
    btnBg:
      'bg-gradient-to-r from-[#1e3fff] to-[#3d6bff] text-white shadow-[0_0_24px_-4px_rgba(30,63,255,0.75)] hover:shadow-[0_0_36px_-2px_rgba(61,107,255,0.9)]',
    accentLine: 'from-[#1e3fff]/70 via-[#3d6bff]/40 to-transparent',
  },
  magenta: {
    iconBg: 'bg-[#3d6bff]/20',
    iconText: 'text-[#5ec8ff]',
    iconRing: 'ring-[#3d6bff]/35',
    tagBg: 'bg-[#3d6bff]/12',
    tagText: 'text-[#5ec8ff]',
    tagBorder: 'border-[#3d6bff]/30',
    numText: 'text-[#3d6bff]/30',
    glowBg: 'from-[#5ec8ff]/20',
    chipBg: 'bg-[#3d6bff]/12',
    chipText: 'text-[#5ec8ff]',
    chipBorder: 'border-[#3d6bff]/25',
    btnBg:
      'bg-gradient-to-r from-[#3d6bff] to-[#5ec8ff] text-white shadow-[0_0_24px_-4px_rgba(94,200,255,0.65)] hover:shadow-[0_0_36px_-2px_rgba(94,200,255,0.9)]',
    accentLine: 'from-[#3d6bff]/70 via-[#5ec8ff]/40 to-transparent',
  },
  blue: {
    iconBg: 'bg-[#3b6bff]/20',
    iconText: 'text-[#4fd8ff]',
    iconRing: 'ring-[#3b6bff]/35',
    tagBg: 'bg-[#3b6bff]/12',
    tagText: 'text-[#4fd8ff]',
    tagBorder: 'border-[#3b6bff]/30',
    numText: 'text-[#3b6bff]/30',
    glowBg: 'from-[#3b6bff]/25',
    chipBg: 'bg-[#3b6bff]/12',
    chipText: 'text-[#4fd8ff]',
    chipBorder: 'border-[#3b6bff]/25',
    btnBg:
      'bg-gradient-to-r from-[#3b6bff] to-[#4fd8ff] text-white shadow-[0_0_24px_-4px_rgba(59,107,255,0.75)] hover:shadow-[0_0_36px_-2px_rgba(79,216,255,0.9)]',
    accentLine: 'from-[#3b6bff]/70 via-[#4fd8ff]/40 to-transparent',
  },
}

const fade = {
  hidden: { opacity: 0, y: 15 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.05, ease: 'easeOut' },
  }),
}

export function CompetitionsSection() {
  return (
    <section id="competitions" className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '150px 0px' }}
        className="mx-auto max-w-2xl text-center"
      >
        <motion.h2
          variants={fade}
          custom={1}
          className="text-balance font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl"
        >
          Compete.{' '}
          <span className="bg-gradient-to-r from-[#3d6bff] via-[#5ec8ff] to-[#4fd8ff] bg-clip-text text-transparent">
            Innovate.
          </span>{' '}
          Win.
        </motion.h2>

        <motion.p
          variants={fade}
          custom={2}
          className="mx-auto mt-2.5 max-w-xl text-pretty text-xs sm:text-sm leading-relaxed text-[#d8e4ff]"
        >
          Three flagship tracks designed to test vision, execution, and strategy.
        </motion.p>
      </motion.div>

      <div className="mt-10 flex flex-col gap-4 sm:gap-5">
        {COMPETITIONS.map((comp, i) => {
          const t = TONE_STYLES[comp.tone]
          const Icon = comp.icon
          return (
            <motion.div
              key={comp.id}
              variants={fade}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '150px 0px' }}
              className="glass group relative overflow-hidden rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl sm:p-7"
            >
              <div
                className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${t.glowBg} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />

              <div
                className={`absolute left-0 right-0 top-0 h-px bg-gradient-to-r ${t.accentLine}`}
              />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${t.iconBg} ${t.iconText} ring-1 ${t.iconRing}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium ${t.tagBg} ${t.tagText} ${t.tagBorder}`}
                      >
                        {comp.tag}
                      </span>
                    </div>

                    <h3 className="mt-1.5 font-heading text-xl font-bold tracking-tight sm:text-2xl">
                      {comp.title}
                    </h3>

                    <p className="mt-1 max-w-xl text-xs sm:text-sm leading-relaxed text-[#d8e4ff]">
                      {comp.description}
                    </p>

                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {comp.highlights.map((h) => (
                        <li
                          key={h}
                          className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-medium ${t.chipBg} ${t.chipText} ${t.chipBorder}`}
                        >
                          <span className={`h-1 w-1 rounded-full ${t.iconText} opacity-70`} />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="shrink-0 pt-2 sm:pt-0">
                  <a
                    href={comp.registerHref}
                    className={`group/btn w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs sm:text-sm font-semibold transition-all duration-200 hover:scale-[1.02] ${t.btnBg}`}
                  >
                    Register
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
