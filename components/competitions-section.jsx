'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import { ArrowRight, TrendingUp, Briefcase, Zap, Users, Lightbulb, Clock, Calendar, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'

const COMPETITIONS = [
  {
    id: 'venture-and-verdict',
    number: '01',
    icon: TrendingUp,
    tone: 'violet',
    tag: 'Exclusively Y26',
    teamSize: '1–4 members',
    title: 'Venture And Verdict',
    description:
      ' Strategic decision-making and smart investments are the keys to this challenge. Teams (preferably Y26s) will bid for the most promising opportunities from a set of firms, using provided summaries to evaluate their options, make calculated decisions, and outsmart their competitors. Shortlisted teams will advance to the finale to present their portfolios and compete for exciting prizes.',
    registerHref: '/register?competition=venture-and-verdict',
  },
  {
    id: 'startup-builder',
    number: '02',
    icon: Briefcase,
    tone: 'indigo',
    tag: 'PGs & PhDs',
    teamSize: '1–4 members',
    title: 'Startup Builder',
    description:
      'An opportunity to dive into the world of entrepreneurship, this challenge invites participants (preferably PGs) to step into the shoes of aspiring business innovators. Teams will tackle real-world problems, think creatively, and develop impactful solutions, transforming ideas into ventures with the potential to make a difference.',
    registerHref: '/register?competition=startup-builder',
  },
  {
    id: 'start-up-sprint',
    number: '03',
    icon: Zap,
    tone: 'cyan',
    tag: 'Open to All',
    teamSize: '1–4 members',
    title: 'Start-up-Sprint',
    description:
      '24 hours on the clock. Draw a domain on the spot, identify a pressing problem, and take your solution from whiteboard sketch to a working MVP before dawn. Demo live to investors and mentors for instant SIIC incubation backing.',
    registerHref: '/register?competition=start-up-sprint',
  },
  {
    id: 'idea-matters-most',
    number: '04',
    icon: Lightbulb,
    tone: 'blue',
    tag: 'Open to All · Ideation',
    teamSize: null,
    sessionTime: '4 Oct · 1:00 PM – 1:30 PM',
    title: 'Idea Matters Most',
    description:
      'Ideas Matter Most: Beyond the Obvious is a premium thought-leadership platform bringing together founders, investors, industry leaders, innovators, academics, and changemakers. The event aims to challenge conventional thinking through meaningful conversations around entrepreneurship, technology, innovation, and the future of enterprise. It will explore founder journeys, unconventional ideas, emerging opportunities, and the decisions that shape impactful ventures. The IIT Kanpur edition will provide students with access to diverse perspectives and real-world insights from accomplished leaders. Through engaging conversations, interactive sessions, and networking opportunities, the event will foster curiosity, innovation, and entrepreneurial thinking.',
    registerHref: null,
    ctaText: null,
  },
]

const IDEA_MATTERS_SPEAKERS = [
  {
    name: 'Dr. Mamtha Satish',
    role: 'CEO and Founder, The Innerworld Counselling for Mental Wellbeing Pvt. Ltd.',
    image: '/speakers/dr_mamtha_satish.png',
  },
  {
    name: 'Shivangi Narula',
    role: 'Founder & CEO, Skilldify',
    image: '/speakers/shivangi_narula.png',
  },
  {
    name: 'Anupriya Nagar',
    role: 'Film Producer, Hanuman Ansh | Economist | Storyteller',
    image: '/speakers/anupriya_nagar.png',
  },
  {
    name: 'Sandeep Chatterjee',
    role: 'Global Supply Chain & Sustainability Strategist, Transformation & Innovation Leader',
    image: '/speakers/sandeep_chatterjee.png',
  },
  {
    name: 'Dinesh Rajpurohit',
    role: 'Entrepreneur | Manufacturing Leader | Chairman & Managing Director – Eleanor Industries Pvt. Ltd.',
    image: '/speakers/dinesh_rajpurohit.png',
  },
  {
    name: 'Anurag Saini',
    role: 'Wealth Partner – W by Groww, Guinness World Record Holder, Ultra Marathon Runner',
    image: '/speakers/anurag_saini.png',
  },
]

const IDEA_MATTERS_THEMES = [
  'Challenging conventional thinking',
  'Questioning assumptions',
  'Exploring unconventional ideas',
  'Discovering new perspectives',
  'Thinking differently about opportunities and innovation',
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
  blue: {
    iconBg: 'bg-blue-600/20',
    iconText: 'text-blue-300',
    iconRing: 'ring-blue-500/40',
    glowBg: 'from-blue-900/25',
    btnBg:
      'bg-gradient-to-r from-blue-600 via-indigo-600 to-[#00f0ff] text-white shadow-[0_0_24px_-4px_rgba(59,130,246,0.70)] hover:shadow-[0_0_36px_-2px_rgba(59,130,246,0.95)]',
    accentLine: 'from-blue-600/80 via-[#00f0ff]/50 to-transparent',
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
          Compete in 4{' '}
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
                  {comp.teamSize && (
                    <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-0.5 sm:py-1 text-slate-300 font-medium border border-white/10 text-xs">
                        <Users className="h-3.5 w-3.5 text-[#00f0ff]" />
                        {comp.teamSize}
                      </span>
                    </div>
                  )}

                  <p className="mt-2.5 sm:mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300 font-normal">
                    {comp.description}
                  </p>
                </div>

                {/* CTA Button / Session Schedule */}
                {(comp.registerHref || comp.sessionTime || comp.ctaText) && (
                  <div className="shrink-0 pt-1 sm:pt-0">
                    {comp.registerHref ? (
                      <a
                        href={comp.registerHref}
                        className="group/btn w-full lg:w-auto inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl btn-continuum px-6 py-3 sm:px-7 sm:py-3.5 text-xs sm:text-sm font-bold text-white transition-all duration-200 hover:scale-105"
                      >
                        Register Team
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                      </a>
                    ) : comp.sessionTime ? (
                      <div
                        className="w-full lg:w-auto inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl border border-cyan-500/30 bg-cyan-950/40 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-cyan-300 backdrop-blur-md select-none shadow-[0_0_15px_-3px_rgba(0,240,255,0.25)]"
                      >
                        <Clock className="h-4 w-4 text-[#00f0ff]" />
                        <span>{comp.sessionTime}</span>
                      </div>
                    ) : comp.ctaText ? (
                      <div
                        className="w-full lg:w-auto inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl border border-violet-500/30 bg-violet-950/40 px-6 py-3 sm:px-7 sm:py-3.5 text-xs sm:text-sm font-semibold text-slate-300 backdrop-blur-md cursor-default select-none shadow-[0_0_15px_-3px_rgba(124,58,237,0.3)]"
                      >
                        <span className="h-2 w-2 rounded-full bg-[#00f0ff] animate-pulse" />
                        <span>{comp.ctaText}</span>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* What You'll Explore / The Session is About */}
              {comp.id === 'idea-matters-most' && (
                <div className="mt-8 pt-7 border-t border-white/10 w-full">
                  <div className="rounded-2xl border border-blue-500/25 bg-blue-950/20 p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-3">


                      <span className="text-xs text-slate-400 font-normal">· The Session is About</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {IDEA_MATTERS_THEMES.map((theme, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#00f0ff] shrink-0" />
                          <span>{theme}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Separate Visual Section: Meet the Speakers — Horizontal Carousel */}
      <div id="speakers" className="mt-16 sm:mt-24 pt-12 sm:pt-16 border-t border-violet-500/20 scroll-mt-24">
        <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-14">

          <h3 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Meet the <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-[#00f0ff] bg-clip-text text-transparent">Speakers</span>
          </h3>
          <p className="mt-3 text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Learn from diverse perspectives, experiences, and ideas from leaders and innovators across industries.
          </p>
        </div>

        {/* Interactive Speaker Carousel with Zero Face Cropping */}
        <SpeakerCarousel speakers={IDEA_MATTERS_SPEAKERS} />
      </div>
    </section>
  )
}

function SpeakerCarousel({ speakers }) {
  const count = speakers.length
  // Triple the array for seamless infinite looping: [set1, set2, set3]
  // Middle set starts at index = count
  const startIndex = count

  const [currentIndex, setCurrentIndex] = useState(startIndex)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [cardStep, setCardStep] = useState(320)
  const [isPaused, setIsPaused] = useState(false)

  const trackRef = useRef(null)
  const firstCardRef = useRef(null)

  // Measure card width + gap dynamically with ResizeObserver
  useEffect(() => {
    const updateCardStep = () => {
      if (firstCardRef.current && trackRef.current) {
        const cardWidth = firstCardRef.current.offsetWidth
        const style = window.getComputedStyle(trackRef.current)
        const gap = parseFloat(style.columnGap || style.gap) || 20
        if (cardWidth > 0) {
          setCardStep(cardWidth + gap)
        }
      }
    }

    updateCardStep()
    const timer = setTimeout(updateCardStep, 100)
    window.addEventListener('resize', updateCardStep)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateCardStep)
    }
  }, [])

  // Auto-rotate every 2.8s; pauses on user hover or when browser tab is hidden
  useEffect(() => {
    if (isPaused) return

    const timer = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) {
        return // Prevent drifting while tab is inactive
      }
      handleNext()
    }, 2800)

    return () => clearInterval(timer)
  }, [isPaused, count])

  // Reset index to visible middle set if user returns from background tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setCurrentIndex((prev) => {
          const norm = ((prev % count) + count) % count
          return count + norm
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [count])

  // Seamless boundary wrap when reaching duplicated ends
  const handleTransitionEnd = (e) => {
    // Only respond to the transform transition of the track itself, ignore child transitions (hover effects)
    if (e.target !== e.currentTarget || e.propertyName !== 'transform') return

    if (currentIndex >= count * 2) {
      // Reached 3rd set, smoothly snap back to 2nd set without animation
      setIsTransitioning(false)
      setCurrentIndex((prev) => prev - count)
    } else if (currentIndex < count) {
      // Reached 1st set, smoothly snap forward to 2nd set without animation
      setIsTransitioning(false)
      setCurrentIndex((prev) => prev + count)
    }
  }

  // Force reflow and re-enable CSS transition on next frame after seamless snap
  useEffect(() => {
    if (!isTransitioning) {
      if (trackRef.current) {
        void trackRef.current.offsetHeight // commit style change without transition
      }
      const anim = requestAnimationFrame(() => {
        setIsTransitioning(true)
      })
      return () => cancelAnimationFrame(anim)
    }
  }, [isTransitioning])

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      if (prev <= 0) return count - 1
      return prev - 1
    })
  }

  const handleNext = () => {
    setCurrentIndex((prev) => {
      if (prev >= count * 2 + 1) return count + 1
      return prev + 1
    })
  }

  const handleDotClick = (targetIndex) => {
    const currentNorm = ((currentIndex % count) + count) % count
    const diff = targetIndex - currentNorm
    setCurrentIndex((prev) => prev + diff)
  }

  const activeSpeakerIndex = ((currentIndex % count) + count) % count

  // Flattened array of 18 items with unique keys
  const allCards = [
    ...speakers.map((s, i) => ({ ...s, origIndex: i, key: `set1-${i}` })),
    ...speakers.map((s, i) => ({ ...s, origIndex: i, key: `set2-${i}` })),
    ...speakers.map((s, i) => ({ ...s, origIndex: i, key: `set3-${i}` })),
  ]

  return (
    <div
      className="relative mx-auto w-full max-w-7xl px-2 sm:px-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Header Controls: Navigation Arrows + Indicator Dots */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-medium text-slate-400">
            {activeSpeakerIndex + 1} / {count}
          </span>
        </div>

        {/* Subtle Navigation Arrows & Dots */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            type="button"
            aria-label="Previous speaker"
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-violet-500/30 bg-[#0c0924]/80 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-cyan-400 hover:text-[#00f0ff] hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Indicator dots */}
          <div className="flex items-center gap-1.5 px-1.5">
            {speakers.map((s, idx) => (
              <button
                key={s.name}
                onClick={() => handleDotClick(idx)}
                type="button"
                aria-label={`Jump to speaker ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${idx === activeSpeakerIndex
                    ? 'w-6 h-2 bg-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.9)]'
                    : 'w-2 h-2 bg-white/25 hover:bg-white/50'
                  }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            type="button"
            aria-label="Next speaker"
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-violet-500/30 bg-[#0c0924]/80 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-cyan-400 hover:text-[#00f0ff] hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] active:scale-95 cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* HORIZONTAL CAROUSEL TRACK */}
      <div className="w-full overflow-hidden py-3">
        <div
          ref={trackRef}
          className="flex flex-row items-stretch gap-4 sm:gap-5"
          style={{
            transform: `translateX(-${currentIndex * cardStep}px)`,
            transition: isTransitioning
              ? 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1)'
              : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {allCards.map((speaker, index) => {
            return (
              <div
                key={speaker.key}
                ref={(el) => {
                  if (index === 0) firstCardRef.current = el
                }}
                className="w-[84vw] xs:w-[320px] sm:w-[280px] md:w-[290px] lg:w-[300px] flex-shrink-0 group relative flex flex-col justify-between rounded-3xl border border-violet-500/25 bg-[#090724]/85 p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(0,240,255,0.22)] hover:-translate-y-1.5 cursor-default select-none overflow-hidden"
              >
                {/* Laser top accent line */}
                <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

                {/* Speaker Portrait with ZERO FACE CROPPING */}
                <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 via-[#0a0725] to-[#040114] flex items-center justify-center p-2.5">
                  <Image
                    src={speaker.image}
                    alt={speaker.name}
                    fill
                    priority
                    unoptimized
                    className="object-contain object-bottom drop-shadow-[0_14px_28px_rgba(0,0,0,0.9)] transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 85vw, 300px"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#040114]/90 to-transparent" />
                </div>

                {/* Speaker Information: Full Name and Complete Designation */}
                <div className="mt-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-[#00f0ff] transition-colors leading-snug">
                      {speaker.name}
                    </h4>

                    <p className="mt-1.5 text-xs sm:text-sm text-cyan-200/85 leading-relaxed font-normal">
                      {speaker.role}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00f0ff]" />
                      Idea Matters Most
                    </span>
                    <span>4 Oct</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-[11px] text-slate-400 font-mono">
          Auto-sliding · Hover to pause · Use arrows to navigate
        </p>
      </div>
    </div>
  )
}
