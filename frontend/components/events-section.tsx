'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { Mic, BookOpen } from 'lucide-react'


type Speaker = {
  name: string
  role: string
  /** Path inside /public, e.g. "/images/charlesir_iitk.png" */
  image: string
}

type EventBlock = {
  id: string
  /** Small icon shown next to the section heading — sourced from /public */
  sectionIcon: string
  /** Fallback lucide icon while the image loads / if missing */
  FallbackIcon: React.ElementType
  tone: 'cyan' | 'orange'
  type: string   // e.g. "AMA Session"
  title: string  // e.g. "Startup 101"
  speakers: Speaker[]
}

const EVENTS: EventBlock[] = [
  {
    id: 'discussions',
    sectionIcon: '/images/panel-discussion.png',
    FallbackIcon: Mic,
    tone: 'cyan',
    type: 'AMA Session',
    title: 'Startup 101',
    speakers: [
      {
        name: 'Charles Avinash',
        role: 'Manager and Domain Head, SIIC IIT Kanpur',
        image: '/images/charlesir_iitk.png',
      },
    ],
  },
  {
    id: 'workshops',
    sectionIcon: '/images/workshops.png',
    FallbackIcon: BookOpen,
    tone: 'orange',
    type: 'Special Session',
    title: 'Campus Hangout',
    speakers: [
      {
        name: 'Akashjyoti Das',
        role: 'Founder, FoodioTech',
        image: '/images/Akashjyoti.jpeg',
      },
    ],
  },
]

const TONE = {
  cyan: {
    accent: 'text-accent',
    accentBg: 'bg-accent/10',
    accentRing: 'ring-accent/20',
    accentBorder: 'border-accent/25',
    glow: 'from-accent/10',
    dot: 'bg-accent',
    line: 'from-accent/50 via-accent/20 to-transparent',
    fallbackIcon: 'text-accent bg-accent/10',
  },
  orange: {
    accent: 'text-primary',
    accentBg: 'bg-primary/10',
    accentRing: 'ring-primary/20',
    accentBorder: 'border-primary/25',
    glow: 'from-primary/10',
    dot: 'bg-primary',
    line: 'from-primary/50 via-primary/20 to-transparent',
    fallbackIcon: 'text-primary bg-primary/10',
  },
}

const fade = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.13 },
  }),
}


function SpeakerCard({
  speaker,
  tone,
  index,
}: {
  speaker: Speaker
  tone: keyof typeof TONE
  index: number
}) {
  const t = TONE[tone]

  return (
    <motion.div
      variants={fade}
      custom={index}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      className={`glass group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40`}
    >
      {/* Ambient glow on hover */}
      <div
        className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${t.glow} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
      />
      {/* Top accent line */}
      <div className={`absolute left-0 right-0 top-0 h-px bg-gradient-to-r ${t.line}`} />

      <div className="flex items-center gap-5">
        {/* Avatar */}
        <div
          className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl ring-1 ${t.accentRing}`}
        >
          <Image
            src={speaker.image}
            alt={speaker.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        {/* Info */}
        <div className="min-w-0">
          <h4 className="font-heading text-lg font-bold leading-snug">
            {speaker.name}
          </h4>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {speaker.role}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Event Block ─────────────────────────────────────────────────────────────

function EventBlock({ event, blockIndex }: { event: EventBlock; blockIndex: number }) {
  const t = TONE[event.tone]
  const FallbackIcon = event.FallbackIcon

  return (
    <motion.div
      variants={fade}
      custom={blockIndex}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      id={event.id}
      className="scroll-mt-24"
    >
      {/* ── Block header ── */}
      <div className="mb-10 flex flex-col items-center text-center">
        {/* Icon + Title row */}
        <div className="mb-3 flex items-center gap-3">
          {/* Section icon from public — falls back to lucide icon if missing */}
          <div
            className={`relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl ring-1 ${t.accentRing} ${t.accentBg}`}
          >
            <Image
              src={event.sectionIcon}
              alt={event.title}
              fill
              className="object-contain p-2"
              sizes="48px"
              onError={(e) => {
                // hide broken image, show fallback via CSS
                ;(e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
            {/* Lucide fallback sits behind — visible when image hides itself */}
            <FallbackIcon className={`absolute h-5 w-5 ${t.accent}`} />
          </div>

          <h3 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {event.title}
          </h3>
        </div>

        {/* Session type */}
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium ${t.accentBg} ${t.accent} ${t.accentBorder}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
          {event.type}
        </span>
      </div>

      {/* ── Speaker cards grid ── */}
      {/* Grid: auto-fit up to 3 columns, cards center nicely when count < 3 */}
      <div className="mx-auto grid max-w-4xl justify-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {event.speakers.map((speaker, i) => (
          <SpeakerCard
            key={speaker.name}
            speaker={speaker}
            tone={event.tone}
            index={i}
          />
        ))}
      </div>
    </motion.div>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export function EventsSection() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-28">
      {/* Shared section header */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="mx-auto mb-20 max-w-2xl text-center"
      >
        {/* Label pill */}
        <motion.div
          variants={fade}
          custom={0}
          className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-muted-foreground"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Sessions &amp; Workshops
        </motion.div>

        <motion.h2
          variants={fade}
          custom={1}
          className="text-balance font-heading text-4xl font-bold tracking-tight sm:text-5xl"
        >
          Learn from the{' '}
          <span className="bg-gradient-to-r from-accent via-primary to-amber-400 bg-clip-text text-transparent">
            Best.
          </span>
        </motion.h2>

        <motion.p
          variants={fade}
          custom={2}
          className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground"
        >
          Candid conversations, hands-on sessions, and real-world insights from
          founders, domain heads, and industry builders.
        </motion.p>
      </motion.div>

      {/* Divider line between the two blocks */}
      <div className="flex flex-col gap-20">
        {EVENTS.map((event, i) => (
          <div key={event.id}>
            <EventBlock event={event} blockIndex={i} />
            {/* Separator between blocks (skip after last) */}
            {i < EVENTS.length - 1 && (
              <div className="mx-auto mt-20 h-px max-w-lg bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
