'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import {
  Rocket,
  Cpu,
  TrendingUp,
  Leaf,
  Bot,
  Dna,
  Sparkles,
} from 'lucide-react'

type OrbitItem = {
  icon: React.ElementType
  label: string
  ring: number // 0,1,2
  angle: number // degrees
  reverse?: boolean
}

const ITEMS: OrbitItem[] = [
  { icon: Rocket, label: 'Startups', ring: 0, angle: 30 },
  { icon: Cpu, label: 'AI', ring: 0, angle: 210 },
  { icon: TrendingUp, label: 'Finance', ring: 1, angle: 120, reverse: true },
  { icon: Leaf, label: 'Sustainability', ring: 1, angle: 300, reverse: true },
  { icon: Bot, label: 'Robotics', ring: 2, angle: 80 },
  { icon: Dna, label: 'Biotech', ring: 2, angle: 250 },
]

const RING_SIZES = [180, 290, 400] // px diameters
const RING_DURATIONS = [26, 38, 52] // seconds

export function InnovationCore() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // orbit expands and fades as the user scrolls past the hero
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.85])
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])
  const coreScale = useTransform(scrollYProgress, [0, 1], [1, 1.3])

  return (
    <div
      ref={ref}
      className="relative mx-auto flex aspect-square w-full max-w-[460px] items-center justify-center"
      aria-hidden="true"
    >
      <motion.div
        style={{ scale, opacity }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {/* Orbit rings + icons */}
        {RING_SIZES.map((size, ringIdx) => {
          const reverse = ringIdx === 1
          return (
            <div
              key={size}
              className="absolute rounded-full border border-white/10"
              style={{
                width: size,
                height: size,
                animation: `${
                  reverse ? 'spin-reverse' : 'spin-slow'
                } ${RING_DURATIONS[ringIdx]}s linear infinite`,
              }}
            >
              {ITEMS.filter((it) => it.ring === ringIdx).map((it) => {
                const Icon = it.icon
                const rad = (it.angle * Math.PI) / 180
                const radius = size / 2
                const x = Math.cos(rad) * radius
                const y = Math.sin(rad) * radius
                return (
                  <div
                    key={it.label}
                    className="absolute left-1/2 top-1/2"
                    style={{
                      transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                    }}
                  >
                    <div
                      className="glass flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ring-white/10"
                      style={{
                        animation: `${
                          reverse ? 'spin-slow' : 'spin-reverse'
                        } ${RING_DURATIONS[ringIdx]}s linear infinite`,
                      }}
                    >
                      <Icon
                        className={
                          ringIdx === 1 ? 'h-5 w-5 text-primary' : 'h-5 w-5 text-accent'
                        }
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </motion.div>

    </div>
  )
}
