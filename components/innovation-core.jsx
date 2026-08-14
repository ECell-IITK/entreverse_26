'use client'

import {
  Rocket,
  Cpu,
  TrendingUp,
  Leaf,
  Bot,
  Dna,
} from 'lucide-react'

const ITEMS = [
  { icon: Rocket, label: 'Startups', ring: 0, angle: 30 },
  { icon: Cpu, label: 'AI', ring: 0, angle: 210 },
  { icon: TrendingUp, label: 'Finance', ring: 1, angle: 120, reverse: true },
  { icon: Leaf, label: 'Sustainability', ring: 1, angle: 300, reverse: true },
  { icon: Bot, label: 'Robotics', ring: 2, angle: 80 },
  { icon: Dna, label: 'Biotech', ring: 2, angle: 250 },
]

const RING_SIZES = [160, 260, 360] // px diameters (scaled to fit all phones)
const RING_DURATIONS = [26, 38, 52] // seconds

// Theme tokens — deep-to-electric blue
const BLUE_CORE = '#1e3fff'
const BLUE_BRIGHT = '#3d6bff'
const CYAN_HOT = '#5ec8ff'
const CYAN_BRIGHT = '#4fd8ff'
const WHITE_HOT = '#baf5ff'

export function InnovationCore() {
  return (
    <div
      className="relative mx-auto flex aspect-square w-full max-w-[340px] sm:max-w-[420px] items-center justify-center will-change-transform scale-[0.85] xs:scale-95 sm:scale-100 origin-center"
      aria-hidden="true"
    >
      {/* Ambient glow wash behind everything */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${BLUE_BRIGHT}44 0%, ${CYAN_HOT}18 45%, transparent 70%)`,
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        {/* Glowing central core with high-tech emblem */}
        <div className="absolute z-10 flex items-center justify-center">
          <div
            className="absolute h-14 w-14 sm:h-16 sm:w-16 rounded-full blur-xl"
            style={{
              background: `radial-gradient(circle, ${WHITE_HOT} 0%, ${CYAN_BRIGHT} 40%, ${BLUE_CORE} 100%)`,
              animation: 'pulse-glow 3s ease-in-out infinite',
            }}
          />
          <div
            className="relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/30 bg-[#050816] shadow-lg"
            style={{
              boxShadow: `0 0 20px 4px ${CYAN_BRIGHT}aa, 0 0 40px 10px ${BLUE_CORE}66`,
            }}
          >
            <img
              src="/logo_ecell.png"
              alt="E-Cell Emblem"
              className="h-7 w-7 sm:h-8 sm:w-8 object-contain drop-shadow-[0_0_8px_rgba(94,200,255,0.9)]"
            />
          </div>
        </div>

        {/* Orbit rings + icons */}
        {RING_SIZES.map((size, ringIdx) => {
          const reverse = ringIdx === 1
          return (
            <div
              key={size}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: size,
                height: size,
                border: `1px solid ${CYAN_BRIGHT}44`,
                boxShadow: `0 0 14px 1px ${BLUE_BRIGHT}22, inset 0 0 14px 1px ${BLUE_CORE}18`,
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
                    className="absolute left-1/2 top-1/2 pointer-events-auto"
                    style={{
                      transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                    }}
                  >
                    <div
                      className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl backdrop-blur-md transition-transform duration-200 hover:scale-110"
                      style={{
                        animation: `${
                          reverse ? 'spin-slow' : 'spin-reverse'
                        } ${RING_DURATIONS[ringIdx]}s linear infinite`,
                        background: `linear-gradient(135deg, ${BLUE_CORE}77, ${BLUE_BRIGHT}44)`,
                        border: `1px solid ${CYAN_BRIGHT}66`,
                        boxShadow: `0 0 12px 2px ${CYAN_BRIGHT}44, 0 0 20px 3px ${BLUE_CORE}33`,
                      }}
                    >
                      <Icon
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        style={{
                          color: WHITE_HOT,
                          filter: `drop-shadow(0 0 4px ${CYAN_BRIGHT})`,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      <style jsx>{`
        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }
      `}</style>
    </div>
  )
}
