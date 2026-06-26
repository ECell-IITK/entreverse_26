
'use client'

import { motion } from 'motion/react'
import { Lightbulb, Users, Rocket, Building2 } from 'lucide-react'

const STAGES = [
  {
    icon: Lightbulb,
    step: '01',
    title: 'Spark',
    desc: 'A raw idea takes shape inside the Innovation Core.',
  },
  {
    icon: Users,
    step: '02',
    title: 'Collaborate',
    desc: 'Founders, mentors, and investors connect into networks.',
  },
  {
    icon: Rocket,
    step: '03',
    title: 'Launch',
    desc: 'Prototypes break orbit and become real ventures.',
  },
  {
    icon: Building2,
    step: '04',
    title: 'Impact',
    desc: 'Ideas mature into companies that change the world.',
  },
]

const fade = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
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
        <motion.span
          variants={fade}
          custom={0}
          className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-muted-foreground"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          The Journey
        </motion.span>
        <motion.h2
          variants={fade}
          custom={1}
          className="mt-5 text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl"
        >
          Where Innovation Meets Entrepreneurship
        </motion.h2>
        <motion.p
          variants={fade}
          custom={2}
          className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground"
        >
          As ideas leave the core, they expand outward — connecting people,
          capital, and technology until they become something the world can use.
        </motion.p>
      </motion.div>

      <div className="relative mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* connecting line */}
        <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent lg:block" />
        {STAGES.map((s, i) => (
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
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/25">
                <s.icon className="h-5 w-5" />
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {s.step}
              </span>
            </div>
            <h3 className="mt-5 font-heading text-xl font-bold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {s.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Stats band */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
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
            <div className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              {num}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{label}</div>
          </div>
        ))}
      </motion.div>

      {/* Final CTA */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="relative mt-20 overflow-hidden rounded-[2rem] border border-white/10 px-6 py-16 text-center"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.18),transparent_60%)]" />
        <h3 className="text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Your idea belongs in orbit.
        </h3>
        <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
          Secure your spot at EntreVerse 2026 and be part of India&apos;s most
          ambitious entrepreneurship festival.
        </p>
        <a
          href="#register"
          className="animate-pulse-ring mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_rgba(245,158,11,0.8)] transition-transform hover:scale-[1.03]"
        >
          Register Now
        </a>
      </motion.div>
    </section>
  )
}
