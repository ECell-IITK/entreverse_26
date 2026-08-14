'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { Mic, BookOpen } from 'lucide-react'

const EVENTS = [
  {
    id: 'discussions',
    Icon: Mic,
    tone: 'cyan',
    type: 'AMA Session',
    title: 'Startup 101',
    speakers: [
      {
        name: 'Charles Avinash',
        role: 'Manager and Domain Head, SIIC IIT Kanpur',
        image: '/charlesir_iitk.png',
      },
    ],
  },
  {
    id: 'workshops',
    Icon: BookOpen,
    tone: 'orange',
    type: 'Special Session',
    title: 'Campus Hangout',
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
  cyan: {
    accent: 'text-[#4fd8ff]',
    accentBg: 'bg-[#3b6bff]/15',
    accentRing: 'ring-[#3b6bff]/35',
    accentBorder: 'border-[#3b6bff]/30',
    glow: 'from-[#3b6bff]/18 via-[#3b6bff]/6',
    glowStrong: 'shadow-[#3b6bff]/25',
    dot: 'bg-[#4fd8ff]',
    line: 'from-[#3b6bff]/75 via-[#3b6bff]/35 to-transparent',
    lineCenter: 'from-transparent via-[#4fd8ff]/50 to-transparent',
    badge: 'bg-[#3b6bff]/12 text-[#4fd8ff] border-[#3b6bff]/30',
    imageGlow: 'shadow-[#3b6bff]/35',
    imageRing: 'ring-[#3b6bff]/45',
  },
  orange: {
    accent: 'text-[#5ec8ff]',
    accentBg: 'bg-[#1e3fff]/18',
    accentRing: 'ring-[#1e3fff]/35',
    accentBorder: 'border-[#1e3fff]/30',
    glow: 'from-[#1e3fff]/18 via-[#3d6bff]/6',
    glowStrong: 'shadow-[#1e3fff]/25',
    dot: 'bg-[#5ec8ff]',
    line: 'from-[#1e3fff]/75 via-[#3d6bff]/35 to-transparent',
    lineCenter: 'from-transparent via-[#5ec8ff]/50 to-transparent',
    badge: 'bg-[#1e3fff]/12 text-[#5ec8ff] border-[#1e3fff]/30',
    imageGlow: 'shadow-[#1e3fff]/35',
    imageRing: 'ring-[#1e3fff]/45',
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
            <div className="absolute inset-0 bg-gradient-to-t from-[#05040f] via-[#05040f]/40 to-transparent" />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold backdrop-blur-md ${t.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
              {type}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center px-6 pb-7 pt-5 text-center">
          <h4 className="font-heading text-xl sm:text-2xl font-bold leading-tight tracking-tight text-white">
            {speaker.name}
          </h4>
          <p className={`mt-1.5 text-xs sm:text-sm leading-relaxed ${t.accent} font-medium`}>
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
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="mb-3 flex items-center gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ${t.accentRing} ${t.accentBg}`}
          >
            <Icon className={`h-5 w-5 ${t.accent}`} />
          </div>

          <h3 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {event.title}
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-[#9fb3e8]">
          {event.type}
        </p>
      </div>

      <div className={`mx-auto grid max-w-3xl gap-8 ${
        event.speakers.length === 1
          ? 'place-items-center'
          : 'place-items-center sm:grid-cols-2'
      }`}>
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
    <section className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '150px 0px' }}
        className="mx-auto mb-12 max-w-2xl text-center"
      >
        <motion.div
          variants={fade}
          custom={0}
          className="glass mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs text-muted-foreground"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#3d6bff]" />
          Sessions &amp; Workshops
        </motion.div>

        <motion.h2
          variants={fade}
          custom={1}
          className="text-balance font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white"
        >
          Learn from the{' '}
          <span className="bg-gradient-to-r from-[#3d6bff] via-[#5ec8ff] to-[#4fd8ff] bg-clip-text text-transparent">
            Best.
          </span>
        </motion.h2>

        <motion.p
          variants={fade}
          custom={2}
          className="mx-auto mt-3 max-w-xl text-pretty text-xs sm:text-sm leading-relaxed text-[#d8e4ff]"
        >
          Candid conversations, hands-on sessions, and real-world insights from
          founders, domain heads, and industry builders.
        </motion.p>
      </motion.div>

      <div className="flex flex-col gap-16">
        {EVENTS.map((event, i) => (
          <div key={event.id}>
            <EventBlock event={event} blockIndex={i} />
            {i < EVENTS.length - 1 && (
              <div className="mx-auto mt-16 h-px max-w-lg bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
