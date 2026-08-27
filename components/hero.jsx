'use client'

import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { EntreVerseLogo } from './entreverse-logo'

export function Hero() {
  return (
    <section
      id="top"
      className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 pt-20 pb-16 sm:px-8 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-28 text-center"
    >
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center w-full">
        
        {/* 1. Kicker */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center justify-center"
        >
          <p className="font-heading text-xs sm:text-sm font-bold tracking-[0.25em] sm:tracking-[0.3em] text-[#00f0ff] uppercase">
            E-Cell IIT Kanpur Presents
          </p>
        </motion.div>

        {/* 2. 3D Sci-Fi Wordmark with Signature Custom R (down-blade) & V (up-peak) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="w-full flex justify-center mt-6 sm:mt-9"
        >
          <EntreVerseLogo className="w-full max-w-[340px] xs:max-w-[420px] sm:max-w-[620px] md:max-w-[760px]" />
        </motion.div>

        {/* 3. Festival Theme */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.14 }}
          className="mt-7 sm:mt-10"
        >
          <h2 className="font-heading text-sm xs:text-base sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-[0.16em] sm:tracking-[0.25em] md:tracking-[0.3em] uppercase text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.35)]">
            CONTINUUM OF INNOVATION
          </h2>
        </motion.div>

        {/* 4. Reference Date Display */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.22 }}
          className="mt-6 sm:mt-9"
        >
          <p className="font-sans text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider text-[#00f0ff] drop-shadow-[0_0_20px_rgba(0,240,255,0.6)]">
            29<sup className="text-xs sm:text-sm font-normal">TH</sup> - 30<sup className="text-xs sm:text-sm font-normal">TH</sup> AUGUST, 2026
          </p>
        </motion.div>

        {/* 5. Subtitle & Narrative */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.28 }}
          className="mt-7 sm:mt-10 max-w-xl px-2"
        >
          <p className="text-pretty text-xs sm:text-sm md:text-base text-slate-300 mx-auto leading-relaxed font-normal">
            IIT Kanpur&apos;s flagship entrepreneurship arena. 2 days of high-velocity prototyping, live investor bidding rounds, and direct SIIC incubation.
          </p>
        </motion.div>

        {/* 6. Primary Action CTA (Positioned lower) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.36 }}
          className="mt-12 sm:mt-16 flex justify-center w-full"
          id="register"
        >
          <a
            href="/register"
            className="animate-pulse-ring group inline-flex items-center justify-center gap-2.5 rounded-2xl btn-continuum w-full sm:w-auto max-w-xs sm:max-w-none px-9 py-4 sm:px-11 sm:py-4.5 text-sm sm:text-base font-bold text-white shadow-2xl transition-all hover:scale-105"
          >
            Register Your Team
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
