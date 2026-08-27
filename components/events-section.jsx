'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { Mic, Sparkles } from 'lucide-react'

const EVENTS = [
  {
    id: 'discussions',
    Icon: Mic,
    tone: 'violet',
    type: 'Masterclass & AMA',
    title: 'Startup 101: Project to Funded Venture',
    description:
      'Navigating patents, government seed grants, and scaling out of campus.',
    speakers: [
      {
        name: 'Charles Avinash',
        role: 'Domain Head, SIIC IIT Kanpur',
        image: '/charlesir_iitk.png',
      },
    ],
  },
  {
    id: 'workshops',
    Icon: Sparkles,
    tone: 'cyan',
    type: 'Founder Fireside Chat',
    title: 'The 0-to-1 Founder Journey',
    description:
      'Raw, unfiltered lessons on early product-market fit and scaling across India.',
    speakers: [
      {
        name: 'Akashjyoti Das',
        role: 'Founder, FoodioTech',
        image: '/Akashjyoti.jpeg',
      },
    ],
  },
]

const TONE = {
  violet: {
    accent: 'text-violet-300',
    accentBg: 'bg-violet-600/20',
    accentRing: 'ring-violet-500/40',
    glow: 'from-violet-900/30 via-violet-800/10',
    glowStrong: 'shadow-violet-900/50',
    line: 'from-violet-600/80 via-violet-400/40 to-transparent',
    lineCenter: 'from-transparent via-violet-400/60 to-transparent',
  },
  cyan: {
    accent: 'text-[#00f0ff]',
    accentBg: 'bg-[#00f0ff]/15',
    accentRing: 'ring-[#00f0ff]/40',
    glow: 'from-[#00f0ff]/20 via-[#1d4ed8]/10',
    glowStrong: 'shadow-[#00f0ff]/30',
    line: 'from-[#00f0ff]/80 via-[#1d4ed8]/40 to-transparent',
    lineCenter: 'from-transparent via-[#00f0ff]/60 to-transparent',
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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
}

function SpeakerCard({ speaker, tone, type }) {
  const t = TONE[tone]

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '150px 0px' }}
      className="group relative mx-auto w-full max-w-sm"
    >
      <div
        className={`absolute -inset-px rounded-3xl bg-gradient-to-b ${t.line} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />

      <div
        className={`glass relative flex flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:${t.glowStrong}`}
      >
        <div className={`absolute left-0 right-0 top-0 h-px bg-gradient-to-r ${t.line}`} />

        <div
          className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b ${t.glow} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
        />

        <div className="relative overflow-hidden">
          <div className="relative h-72 sm:h-80 w-full">
            <Image
              src={speaker.image}
              alt={speaker.name}
              fill
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 384px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-[#030014]/40 to-transparent" />
          </div>
        </div>

        <div className="flex flex-col items-center px-6 pb-6 pt-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#00f0ff] mb-1">
            {type}
          </p>
          <h4 className="font-heading text-xl sm:text-2xl font-bold leading-tight tracking-tight text-white">
            {speaker.name}
          </h4>
          <p className={`mt-1 text-xs sm:text-sm leading-relaxed ${t.accent} font-medium`}>
            {speaker.role}
          </p>

          <div className={`mt-4 h-px w-16 bg-gradient-to-r ${t.lineCenter}`} />
        </div>
      </div>
    </motion.div>
  )
}

function EventBlock({ event, blockIndex }) {
  const t = TONE[event.tone]
  const Icon = event.Icon

  return (
    <motion.div
      variants={fade}
      custom={blockIndex}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '150px 0px' }}
      id={event.id}
      className="scroll-mt-24"
    >
      <div className="mb-6 flex flex-col items-center text-center max-w-xl mx-auto">
        <div className="mb-2 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ring-1 ${t.accentRing} ${t.accentBg}`}
          >
            <Icon className={`h-5 w-5 ${t.accent}`} />
          </div>

          <h3 className="font-heading text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            {event.title}
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {event.description}
        </p>
      </div>

      <div className="mx-auto flex justify-center">
        {event.speakers.map((speaker) => (
          <SpeakerCard
            key={speaker.name}
            speaker={speaker}
            tone={event.tone}
            type={event.type}
          />
        ))}
      </div>
    </motion.div>
  )
}

export function EventsSection() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-28 lg:px-12">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '150px 0px' }}
        className="mx-auto mb-14 max-w-2xl text-center"
      >
        <motion.h2
          variants={fade}
          custom={0}
          className="text-balance font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white"
        >
          Keynotes &amp;{' '}
          <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-[#00f0ff] bg-clip-text text-transparent">
            AMAs
          </span>
        </motion.h2>
      </motion.div>

      <div className="flex flex-col gap-16 sm:gap-20">
        {EVENTS.map((event, i) => (
          <div key={event.id}>
            <EventBlock event={event} blockIndex={i} />
            {i < EVENTS.length - 1 && (
              <div className="mx-auto mt-16 sm:mt-20 h-px max-w-lg bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
