'use client'

import { motion } from 'motion/react'
import { ArrowRight, TrendingUp, Briefcase, Zap } from 'lucide-react'

const COMPETITIONS = [
  {
    id: 'flip-the-future',
    number: '01',
    icon: TrendingUp,
    tone: 'violet',
    tag: 'Y25s · Investment',
    title: 'Flip the Future',
    description:
      'Strategic decision-making and smart investments are the keys to this challenge. Teams (preferably Y25s) will bid for the most promising opportunities from a set of firms, using provided summaries to evaluate options and outsmart competitors. Shortlisted teams will advance to the finale to present their portfolios and compete for exciting prizes.',
    highlights: ['Portfolio Building', 'Competitive Bidding', 'Finale Presentations'],
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
      'An opportunity to dive into the world of entrepreneurship, this challenge invites participants (preferably PGs) to step into the shoes of business innovators. Teams will explore real-world problems in different domains of business, unleash their creativity, and craft impactful solutions to transform problems into opportunities.',
    highlights: ['Real-World Problems', 'Cross-Domain Business', 'Creative Solutions'],
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
      '"One Day One Idea Infinite Potential" — An intense full day challenge where teams transform ideas into MVPs and prototypes before sunrise. From brainstorming to building, every hour tests creativity, speed, and strategy. The most promising solutions will pitch at dawn for a chance to win big.',
    highlights: ['Idea to MVP', 'Full-Day Sprint', 'Pitch at Dawn'],
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
      'bg-gradient-to-r from-[#1e3fff] to-[#3d6bff] text-white shadow-[0_0_28px_-4px_rgba(30,63,255,0.75)] hover:shadow-[0_0_40px_-2px_rgba(61,107,255,0.9)]',
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
      'bg-gradient-to-r from-[#3d6bff] to-[#5ec8ff] text-white shadow-[0_0_28px_-4px_rgba(94,200,255,0.65)] hover:shadow-[0_0_40px_-2px_rgba(94,200,255,0.9)]',
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
      'bg-gradient-to-r from-[#3b6bff] to-[#4fd8ff] text-white shadow-[0_0_28px_-4px_rgba(59,107,255,0.75)] hover:shadow-[0_0_40px_-2px_rgba(79,216,255,0.9)]',
    accentLine: 'from-[#3b6bff]/70 via-[#4fd8ff]/40 to-transparent',
  },
}

const fade = {
  hidden: { opacity: 0, y: 32 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.14 },
  }),
}

export function CompetitionsSection() {
  return (
    <section id="competitions" className="relative mx-auto max-w-6xl px-4 py-28">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="mx-auto max-w-2xl text-center"
      >
        <motion.h2
          variants={fade}
          custom={1}
          className="text-balance font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl"
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
          className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-[#d8e4ff]"
        >
          Three high-stakes competitions designed to push boundaries, spark
          ideas, and reward the sharpest minds. Pick your arena.
        </motion.p>
      </motion.div>

      <div className="mt-16 flex flex-col gap-6">
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
              viewport={{ once: true, margin: '-60px' }}
              className="glass group relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 sm:p-8 lg:p-10"
            >
              <div
                className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${t.glowBg} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
              />

              <div
                className={`absolute left-0 right-0 top-0 h-px bg-gradient-to-r ${t.accentLine}`}
              />

              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
                <div className="flex shrink-0 items-start gap-4 lg:flex-col lg:items-center">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${t.iconBg} ${t.iconText} ring-1 ${t.iconRing}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span
                    className={`font-heading text-5xl font-black leading-none ${t.numText} lg:text-6xl`}
                  >
                    {comp.number}
                  </span>
                </div>

                <div className="flex-1">
                  <span
                    className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium ${t.tagBg} ${t.tagText} ${t.tagBorder}`}
                  >
                    {comp.tag}
                  </span>

                  <h3 className="mt-3 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                    {comp.title}
                  </h3>

                  <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-[#d8e4ff]">
                    {comp.description}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {comp.highlights.map((h) => (
                      <li
                        key={h}
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium ${t.chipBg} ${t.chipText} ${t.chipBorder}`}
                      >
                        <span className={`h-1 w-1 rounded-full ${t.iconText} opacity-70`} />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex shrink-0 items-center lg:items-end lg:self-end">
                  <a
                    href={comp.registerHref}
                    className={`group/btn inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.04] ${t.btnBg}`}
                  >
                    Register Now
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </a>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="glass mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl px-8 py-6 sm:flex-row"
      >
        <div>
          <p className="font-heading text-lg font-semibold text-white">
            Not sure which competition to join?
          </p>
          <p className="mt-0.5 text-sm text-[#9fb3e8]">
            Register for all three — the more you compete, the more you grow.
          </p>
        </div>
        <a
          href="/register"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-[#1e3fff] to-[#3b6bff] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1e3fff]/30 transition-all hover:scale-[1.04] hover:from-[#3d6bff] hover:to-[#5ec8ff] hover:shadow-[#5ec8ff]/50"
        >
          Register Now
          <ArrowRight className="h-4 w-4" />
        </a>
      </motion.div>
    </section>
  )
}
