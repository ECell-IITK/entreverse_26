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

const ITEMS = [
  { icon: Rocket, label: 'Startups', ring: 0, angle: 30 },
  { icon: Cpu, label: 'AI', ring: 0, angle: 210 },
  { icon: TrendingUp, label: 'Finance', ring: 1, angle: 120, reverse: true },
  { icon: Leaf, label: 'Sustainability', ring: 1, angle: 300, reverse: true },
  { icon: Bot, label: 'Robotics', ring: 2, angle: 80 },
  { icon: Dna, label: 'Biotech', ring: 2, angle: 250 },
]

const RING_SIZES = [180, 290, 400] // px diameters
const RING_DURATIONS = [26, 38, 52] // seconds

// Theme tokens — deep-to-electric blue, no purple
const BLUE_CORE = '#1e3fff'
const BLUE_BRIGHT = '#3d6bff'
const CYAN_HOT = '#5ec8ff'
const CYAN_BRIGHT = '#4fd8ff'
const WHITE_HOT = '#baf5ff'

export function InnovationCore() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // orbit expands and fades as the user scrolls past the hero
  const scale = useTransform(scrollYProgress, [0, 1], [1, 3])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const coreScale = useTransform(scrollYProgress, [0, 1], [1, 3])

  return (
    <div
      ref={ref}
      className="relative mx-auto flex aspect-square w-full max-w-[460px] items-center justify-center"
      aria-hidden="true"
    >
      {/* Ambient glow wash behind everything */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${BLUE_BRIGHT}55 0%, ${CYAN_HOT}22 45%, transparent 70%)`,
        }}
      />

      <motion.div
        style={{ scale, opacity }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {/* Glowing central core */}
        <motion.div
          style={{ scale: coreScale }}
          className="absolute z-10 flex items-center justify-center"
        >
          <div
            className="absolute h-16 w-16 rounded-full blur-xl"
            style={{
              background: `radial-gradient(circle, ${WHITE_HOT} 0%, ${CYAN_BRIGHT} 40%, ${BLUE_CORE} 100%)`,
              animation: 'pulse-glow 3s ease-in-out infinite',
            }}
          />
          <div
            className="relative flex h-11 w-11 items-center justify-center rounded-full"
            style={{
              background: `radial-gradient(circle, ${WHITE_HOT} 0%, ${CYAN_BRIGHT} 55%, ${BLUE_CORE} 100%)`,
              boxShadow: `0 0 24px 6px ${CYAN_BRIGHT}aa, 0 0 60px 14px ${BLUE_CORE}66`,
            }}
          >
            <Sparkles className="h-5 w-5 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
          </div>
        </motion.div>

        {/* Orbit rings + icons */}
        {RING_SIZES.map((size, ringIdx) => {
          const reverse = ringIdx === 1
          return (
            <div
              key={size}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                border: `1px solid ${CYAN_BRIGHT}55`,
                boxShadow: `0 0 20px 2px ${BLUE_BRIGHT}33, inset 0 0 20px 2px ${BLUE_CORE}22`,
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
                      className="flex h-12 w-12 items-center justify-center rounded-2xl backdrop-blur-md transition-transform duration-300 hover:scale-110"
                      style={{
                        animation: `${
                          reverse ? 'spin-slow' : 'spin-reverse'
                        } ${RING_DURATIONS[ringIdx]}s linear infinite`,
                        background: `linear-gradient(135deg, ${BLUE_CORE}66, ${BLUE_BRIGHT}33)`,
                        border: `1px solid ${CYAN_BRIGHT}66`,
                        boxShadow: `0 0 16px 2px ${CYAN_BRIGHT}55, 0 0 32px 6px ${BLUE_CORE}44`,
                      }}
                    >
                      <Icon
                        className="h-5 w-5"
                        style={{
                          color: WHITE_HOT,
                          filter: `drop-shadow(0 0 6px ${CYAN_BRIGHT})`,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </motion.div>

      <style jsx>{`
        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.25);
          }
        }
      `}</style>
    </div>
  )
}
