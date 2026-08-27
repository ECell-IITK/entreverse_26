'use client'

import { motion } from 'motion/react'
import { ArrowRight, TrendingUp, Briefcase, Zap, Users } from 'lucide-react'

const COMPETITIONS = [
  {
    id: 'venture-and-verdict',
    number: '01',
    icon: TrendingUp,
    tone: 'violet',
    tag: 'UGs & Y26s · VC Bidding',
    teamSize: '2–4 members',
    title: 'Venture And Verdict',
    description:
      'Step into early-stage venture capital. Analyze startup balance sheets, bid in live auction rounds, and pitch to senior VC partners.',
    registerHref: '/register?competition=venture-and-verdict',
  },
  {
    id: 'startup-builder',
    number: '02',
    icon: Briefcase,
    tone: 'indigo',
    tag: 'PGs & MBAs · Consulting',
    teamSize: '2–4 members',
    title: 'Startup Builder',
    description:
      'Tackle live business crises. Unravel supply chain and market bottlenecks, then present turnaround roadmaps to corporate leaders.',
    registerHref: '/register?competition=startup-builder',
  },
  {
    id: 'start-up-sprint',
    number: '03',
    icon: Zap,
    tone: 'cyan',
    tag: 'Open to All',
    teamSize: '1–5 members',
    title: 'Start-up-Sprint',
    description:
      '24 hours on the clock. Whiteboard sketch to working MVP before dawn. Demo live to angels for instant SIIC incubation backing.',
    registerHref: '/register?competition=start-up-sprint',
  },
]

const TONE_STYLES = {
  violet: {
    iconBg: 'bg-violet-600/20',
    iconText: 'text-violet-300',
    iconRing: 'ring-violet-500/40',
    glowBg: 'from-violet-900/30',
    btnBg:
      'bg-gradient-to-r from-violet-700 to-violet-500 text-white shadow-[0_0_24px_-4px_rgba(124,58,237,0.75)] hover:shadow-[0_0_36px_-2px_rgba(124,58,237,0.95)]',
    accentLine: 'from-violet-600/80 via-violet-400/50 to-transparent',
  },
  indigo: {
    iconBg: 'bg-indigo-600/20',
    iconText: 'text-indigo-300',
    iconRing: 'ring-indigo-500/40',
    glowBg: 'from-indigo-900/25',
    btnBg:
      'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-[0_0_24px_-4px_rgba(99,102,241,0.70)] hover:shadow-[0_0_36px_-2px_rgba(99,102,241,0.95)]',
    accentLine: 'from-indigo-600/80 via-cyan-400/50 to-transparent',
  },
  cyan: {
    iconBg: 'bg-[#00f0ff]/15',
    iconText: 'text-[#00f0ff]',
    iconRing: 'ring-[#00f0ff]/40',
    glowBg: 'from-[#00f0ff]/20',
    btnBg:
      'bg-gradient-to-r from-[#1d4ed8] to-[#00f0ff] text-white shadow-[0_0_24px_-4px_rgba(0,240,255,0.75)] hover:shadow-[0_0_36px_-2px_rgba(0,240,255,0.95)]',
    accentLine: 'from-[#1d4ed8]/80 via-[#00f0ff]/50 to-transparent',
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
    <section id="competitions" className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-28 lg:px-12">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '150px 0px' }}
        className="mx-auto max-w-2xl text-center"
      >
        <motion.h2
          variants={fade}
          custom={0}
          className="text-balance font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
        >
          Compete in 3{' '}
          <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-[#00f0ff] bg-clip-text text-transparent">
            Flagship Arenas
          </span>
        </motion.h2>
      </motion.div>

      <div className="mt-10 sm:mt-16 flex flex-col gap-4 sm:gap-6">
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
              className="glass group relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-9 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl border border-violet-500/25"
            >
              <div
                className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${t.glowBg} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />

              <div
                className={`absolute left-0 right-0 top-0 h-px bg-gradient-to-r ${t.accentLine}`}
              />

              <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  {/* Title & Icon Header */}
                  <div className="flex items-center gap-3.5 sm:gap-5">
                    <div
                      className={`flex h-11 w-11 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl ${t.iconBg} ${t.iconText} ring-1 ${t.iconRing}`}
                    >
                      <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
                    </div>

                    <div>
                      <h3 className="font-heading text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
                        {comp.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium text-violet-300">
                        {comp.tag}
                      </p>
                    </div>
                  </div>

                  {/* Metadata Chips & Description */}
                  <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-0.5 sm:py-1 text-slate-300 font-medium border border-white/10 text-xs">
                      <Users className="h-3.5 w-3.5 text-[#00f0ff]" />
                      {comp.teamSize}
                    </span>
                  </div>

                  <p className="mt-2.5 sm:mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300 font-normal">
                    {comp.description}
                  </p>
                </div>

                {/* CTA Button */}
                <div className="shrink-0 pt-1 sm:pt-0">
                  <a
                    href={comp.registerHref}
                    className="group/btn w-full lg:w-auto inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl btn-continuum px-6 py-3 sm:px-7 sm:py-3.5 text-xs sm:text-sm font-bold text-white transition-all duration-200 hover:scale-105"
                  >
                    Register Team
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
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
