'use client'

import {
  Rocket,
  Cpu,
  TrendingUp,
  Leaf,
  Bot,
  Layers,
} from 'lucide-react'

const ITEMS = [
  { icon: Rocket, label: 'Early-Stage Startups', ring: 0, angle: 30 },
  { icon: Cpu, label: 'AI & DeepTech', ring: 0, angle: 210 },
  { icon: TrendingUp, label: 'Venture Capital & FinTech', ring: 1, angle: 120, reverse: true },
  { icon: Leaf, label: 'CleanTech & ESG', ring: 1, angle: 300, reverse: true },
  { icon: Bot, label: 'Robotics & Hardware', ring: 2, angle: 80 },
  { icon: Layers, label: 'SaaS & Enterprise', ring: 2, angle: 250 },
]

const RING_SIZES = [160, 260, 360] // px diameters
const RING_DURATIONS = [26, 38, 52] // seconds

// Pure Electro-Violet & Laser Cyan Theme Tokens (Zero Pink)
const VIOLET_CORE = '#5b21b6'
const VIOLET_BRIGHT = '#7c3aed'
const INDIGO_HOT = '#6366f1'
const CYAN_BRIGHT = '#00f0ff'
const WHITE_HOT = '#ffffff'

export function InnovationCore() {
  return (
    <div
      className="relative mx-auto flex aspect-square w-full max-w-[340px] sm:max-w-[420px] items-center justify-center will-change-transform scale-[0.85] xs:scale-95 sm:scale-100 origin-center"
      aria-hidden="true"
    >
      {/* Ambient Dual-Glow Wash (Electro-Violet on left, Laser Cyan on right) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full blur-3xl opacity-80"
        style={{
          background: `radial-gradient(circle at 35% 45%, ${VIOLET_BRIGHT}55 0%, ${CYAN_BRIGHT}25 50%, transparent 75%)`,
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        {/* Glowing Central E-Cell Emblem */}
        <div className="absolute z-10 flex items-center justify-center">
          <div
            className="absolute h-16 w-16 sm:h-20 sm:w-20 rounded-full blur-xl"
            style={{
              background: `radial-gradient(circle, ${INDIGO_HOT} 0%, ${VIOLET_CORE} 50%, ${CYAN_BRIGHT} 100%)`,
              animation: 'pulse-glow 3s ease-in-out infinite',
            }}
          />
          <div
            className="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-violet-400/40 bg-[#050117] shadow-xl"
            style={{
              boxShadow: `0 0 24px 6px ${VIOLET_BRIGHT}aa, 0 0 45px 12px ${CYAN_BRIGHT}55`,
            }}
          >
            <img
              src="/logo_ecell.png"
              alt="E-Cell Emblem"
              className="h-8 w-8 sm:h-9 sm:w-9 object-contain drop-shadow-[0_0_10px_rgba(0,240,255,0.9)]"
            />
          </div>
        </div>

        {/* Orbit rings + domain icons */}
        {RING_SIZES.map((size, ringIdx) => {
          const reverse = ringIdx === 1
          const borderColor = ringIdx === 0 ? `${VIOLET_BRIGHT}66` : ringIdx === 1 ? `${INDIGO_HOT}55` : `${CYAN_BRIGHT}55`
          const glowColor = ringIdx % 2 === 0 ? VIOLET_BRIGHT : CYAN_BRIGHT

          return (
            <div
              key={size}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: size,
                height: size,
                border: `1px solid ${borderColor}`,
                boxShadow: `0 0 16px 1px ${glowColor}25, inset 0 0 14px 1px ${VIOLET_CORE}20`,
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
                      title={it.label}
                      className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl backdrop-blur-md transition-transform duration-200 hover:scale-110 cursor-pointer"
                      style={{
                        animation: `${
                          reverse ? 'spin-slow' : 'spin-reverse'
                        } ${RING_DURATIONS[ringIdx]}s linear infinite`,
                        background: `linear-gradient(135deg, ${VIOLET_CORE}99, ${CYAN_BRIGHT}44)`,
                        border: `1px solid rgba(255, 255, 255, 0.4)`,
                        boxShadow: `0 0 14px 2px ${VIOLET_BRIGHT}66, 0 0 22px 3px ${CYAN_BRIGHT}44`,
                      }}
                    >
                      <Icon
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        style={{
                          color: WHITE_HOT,
                          filter: `drop-shadow(0 0 5px ${CYAN_BRIGHT})`,
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
            opacity: 0.75;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  )
}
