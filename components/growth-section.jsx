'use client'

import { motion } from 'motion/react'
import { Lightbulb, Users, Rocket, Building2 } from 'lucide-react'

const STAGES = [
  {
    icon: Lightbulb,
    title: 'Spark',
    desc: 'A raw idea takes shape inside the Innovation Core.',
    tone: 'deep',
  },
  {
    icon: Users,
    title: 'Collaborate',
    desc: 'Founders, mentors, and investors connect into networks.',
    tone: 'mid',
  },
  {
    icon: Rocket,
    title: 'Launch',
    desc: 'Prototypes break orbit and become real ventures.',
    tone: 'electric',
  },
  {
    icon: Building2,
    title: 'Impact',
    desc: 'Ideas mature into companies that change the world.',
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
  hidden: { opacity: 0, y: 28 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.12 },
  }),
}

export function GrowthSection() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-4 py-28">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="mx-auto max-w-2xl text-center"
      >
        <motion.h2
          variants={fade}
          custom={1}
          className="mt-5 text-balance font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl"
        >
          Where Innovation Meets Entrepreneurship
        </motion.h2>

        <motion.p
          variants={fade}
          custom={2}
          className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-[#d8e4ff]"
        >
          As ideas leave the core, they expand outward — connecting people,
          capital, and technology until they become something the world can use.
        </motion.p>

        <motion.p
          variants={fade}
          custom={3}
          className="mx-auto mt-6 max-w-xl text-pretty text-sm leading-relaxed text-[#9fb3e8]"
        >
          This year's theme is the{' '}
          <span className="font-semibold text-[#5ec8ff]">Continuum of Innovation</span>
          {' '}— the idea that breakthroughs never start from zero. Every startup,
          every invention, every pivot flows from the work that came before and
          feeds into what comes next. At EntreVerse 2026 we celebrate that unbroken
          current: entrepreneurs, ideas, and disciplines converging into a single
          forward stream.
        </motion.p>
      </motion.div>

      <div className="relative mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
              viewport={{ once: true, margin: '-60px' }}
              className="glass relative rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${t.iconBg} ${t.iconText} ${t.iconRing}`}
                >
                  <s.icon className="h-5 w-5" />
                </span>
              </div>
              <h3 className="mt-5 font-heading text-xl font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#d8e4ff]">
                {s.desc}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Stats band */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6 }}
        className="glass mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl md:grid-cols-4"
      >
        {[
          ['3', 'Days'],
          ['50+', 'Events'],
          ['₹15L+', 'Prize Pool'],
          ['1500+', 'Participants'],
        ].map(([num, label]) => (
          <div key={label} className="bg-white/[0.02] px-6 py-8 text-center">
            <div className="font-heading text-3xl font-bold text-white sm:text-4xl">
              {num}
            </div>
            <div className="mt-1 text-sm text-[#9fb3e8]">{label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
