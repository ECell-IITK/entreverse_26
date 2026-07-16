'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { Mic, BookOpen } from 'lucide-react'


type Speaker = {
  name: string
  role: string
  image: string
}

type EventBlock = {
  id: string
  sectionIcon: string
  FallbackIcon: React.ElementType
  tone: 'cyan' | 'orange'
  type: string
  title: string
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
        image: '/charlesir_iitk.png',
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
        image: '/Akashjyoti.jpeg',
      },
    ],
  },
]

const TONE = {
  cyan: {
    accent: 'text-accent',
    accentBg: 'bg-accent/10',
    accentRing: 'ring-accent/30',
    accentBorder: 'border-accent/25',
    glow: 'from-accent/15 via-accent/5',
    glowStrong: 'shadow-accent/20',
    dot: 'bg-accent',
    line: 'from-accent/70 via-accent/30 to-transparent',
    lineCenter: 'from-transparent via-accent/40 to-transparent',
    badge: 'bg-accent/10 text-accent border-accent/25',
    imageGlow: 'shadow-accent/30',
    imageRing: 'ring-accent/40',
    fallbackIcon: 'text-accent bg-accent/10',
  },
  orange: {
    accent: 'text-primary',
    accentBg: 'bg-primary/10',
    accentRing: 'ring-primary/30',
    accentBorder: 'border-primary/25',
    glow: 'from-primary/15 via-primary/5',
    glowStrong: 'shadow-primary/20',
    dot: 'bg-primary',
    line: 'from-primary/70 via-primary/30 to-transparent',
    lineCenter: 'from-transparent via-primary/40 to-transparent',
    badge: 'bg-primary/10 text-primary border-primary/25',
    imageGlow: 'shadow-primary/30',
    imageRing: 'ring-primary/40',
    fallbackIcon: 'text-primary bg-primary/10',
  },
}

const fade = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.14 },
  }),
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}


function SpeakerCard({
  speaker,
  tone,
  index,
  type,
}: {
  speaker: Speaker
  tone: keyof typeof TONE
  index: number
  type: string
}) {
  const t = TONE[tone]

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      className="group relative mx-auto w-full max-w-sm"
    >
      {/* Outer glow ring */}
      <div
        className={`absolute -inset-px rounded-3xl bg-gradient-to-b ${t.line} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
      />

      {/* Card */}
      <div
        className={`glass relative flex flex-col overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:${t.glowStrong}`}
      >
        {/* Top accent line */}
        <div className={`absolute left-0 right-0 top-0 h-px bg-gradient-to-r ${t.line}`} />

        {/* Ambient hover glow */}
        <div
          className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b ${t.glow} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
        />

        {/* ── Photo area ── */}
        <div className="relative overflow-hidden">
          {/* Large portrait image */}
          <div className={`relative h-80 w-full`}>
            <Image
              src={speaker.image}
              alt={speaker.name}
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 384px"
              priority
            />
            {/* Gradient overlay fading into card body */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07080f] via-[#07080f]/40 to-transparent" />
          </div>

          {/* Session badge — floats over bottom of image */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold backdrop-blur-md ${t.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
              {type}
            </span>
          </div>
        </div>

        {/* ── Info area ── */}
        <div className="flex flex-col items-center px-8 pb-8 pt-5 text-center">
          <h4 className="font-heading text-2xl font-bold leading-tight tracking-tight">
            {speaker.name}
          </h4>
          <p className={`mt-2 text-sm leading-relaxed ${t.accent} font-medium`}>
            {speaker.role}
          </p>

          {/* Decorative divider */}
          <div className={`mt-5 h-px w-16 bg-gradient-to-r ${t.lineCenter}`} />
        </div>
      </div>
    </motion.div>
  )
}


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
      <div className="mb-12 flex flex-col items-center text-center">
        {/* Icon + Title */}
        <div className="mb-4 flex items-center gap-3">
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
                ;(e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
            <FallbackIcon className={`absolute h-5 w-5 ${t.accent}`} />
          </div>

          <h3 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {event.title}
          </h3>
        </div>

        {/* Subtitle line */}
        <p className="text-sm text-muted-foreground">
          {event.type}
        </p>
      </div>

      {/* Speaker cards — centered, max 2 cols, big cards */}
      <div className="mx-auto grid max-w-3xl place-items-center gap-8 sm:grid-cols-2">
        {event.speakers.map((speaker, i) => (
          <SpeakerCard
            key={speaker.name}
            speaker={speaker}
            tone={event.tone}
            index={i}
            type={event.type}
          />
        ))}
      </div>
    </motion.div>
  )
}


export function EventsSection() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-28">
      {/* Section header */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="mx-auto mb-20 max-w-2xl text-center"
      >
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

      {/* Event blocks */}
      <div className="flex flex-col gap-24">
        {EVENTS.map((event, i) => (
          <div key={event.id}>
            <EventBlock event={event} blockIndex={i} />
            {i < EVENTS.length - 1 && (
              <div className="mx-auto mt-24 h-px max-w-lg bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
