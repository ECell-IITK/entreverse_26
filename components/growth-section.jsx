'use client'

import { motion } from 'motion/react'
import { Lightbulb, Users, Rocket, Building2, ArrowRight } from 'lucide-react'

const STAGES = [
  {
    step: '01',
    icon: Lightbulb,
    title: 'Spark',
    desc: 'A raw idea ignites in the Innovation Core.',
    tone: 'deep',
  },
  {
    step: '02',
    icon: Users,
    title: 'Collaborate',
    desc: 'Founders, mentors, and capital connect into networks.',
    tone: 'mid',
  },
  {
    step: '03',
    icon: Rocket,
    title: 'Launch',
    desc: 'Prototypes break orbit and become real products.',
    tone: 'electric',
  },
  {
    step: '04',
    icon: Building2,
    title: 'Impact',
    desc: 'Ventures scale to create lasting industry transformation.',
    tone: 'cyan',
  },
]

const TONE = {
  deep: {
    iconBg: 'bg-[#1e3fff]/20',
    iconText: 'text-[#5ec8ff]',
    iconRing: 'ring-[#1e3fff]/35',
  },
  mid: {
    iconBg: 'bg-[#3d6bff]/20',
    iconText: 'text-[#5ec8ff]',
    iconRing: 'ring-[#3d6bff]/35',
  },
  electric: {
    iconBg: 'bg-[#5ec8ff]/15',
    iconText: 'text-[#5ec8ff]',
    iconRing: 'ring-[#5ec8ff]/30',
  },
  cyan: {
    iconBg: 'bg-[#4fd8ff]/15',
    iconText: 'text-[#4fd8ff]',
    iconRing: 'ring-[#4fd8ff]/30',
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

export function GrowthSection() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
      
      {/* ── Standalone Theme Focus Header ──────────────────────── */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '150px 0px' }}
        className="mx-auto max-w-2xl text-center"
      >
        <motion.div
          variants={fade}
          custom={0}
          className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-[#5ec8ff] border border-[#3d6bff]/30 mb-4"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#5ec8ff]" />
          Continuum of Innovation
        </motion.div>

        <motion.h2
          variants={fade}
          custom={1}
          className="text-balance font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl"
        >
          The Unbroken Current of Innovation
        </motion.h2>

        <motion.p
          variants={fade}
          custom={2}
          className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-relaxed text-[#d8e4ff]"
        >
          Breakthroughs never start from zero. Every spark builds upon the one before, flowing seamlessly into scalable real-world ventures.
        </motion.p>
      </motion.div>

      {/* ── 4 Crisp Continuum Stages ────────────────────────── */}
      <div className="relative mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-[#1e3fff]/50 via-[#5ec8ff]/45 to-[#4fd8ff]/50 lg:block" />

        {STAGES.map((s, i) => {
          const t = TONE[s.tone]
          return (
            <motion.div
              key={s.title}
              variants={fade}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '150px 0px' }}
              className="glass relative rounded-2xl p-5 sm:p-6 transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ${t.iconBg} ${t.iconText} ${t.iconRing}`}
                >
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="font-heading text-xs font-bold text-white/30">
                  {s.step}
                </span>
              </div>
              <h3 className="mt-4 font-heading text-lg sm:text-xl font-bold text-white">{s.title}</h3>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#d8e4ff]">
                {s.desc}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* ── Quick Stats Band ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '150px 0px' }}
        transition={{ duration: 0.35 }}
        className="glass mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-2xl"
      >
        {[
          ['2', 'Days of Innovation'],
          ['3', 'Flagship Challenges'],
          ['SIIC', 'Incubation Support'],
        ].map(([num, label]) => (
          <div key={label} className="bg-white/[0.02] px-4 py-6 text-center">
            <div className="font-heading text-2xl font-bold text-white sm:text-3xl">
              {num}
            </div>
            <div className="mt-1 text-xs text-[#9fb3e8]">{label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
