'use client'

import { motion } from 'motion/react'

const fade = {
  hidden: { opacity: 0, y: 15 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.05, ease: 'easeOut' },
  }),
}

export function GrowthSection() {
  return (
    <section id="about" className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-32 lg:px-12">
      
      {/* ── Vertical Accent Connector Line ──────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        whileInView={{ opacity: 1, scaleY: 1 }}
        viewport={{ once: true, margin: '150px 0px' }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-px h-16 sm:h-24 bg-gradient-to-b from-transparent via-violet-500 to-[#00f0ff] mb-8 sm:mb-12 origin-top"
      />

      {/* ── Section Header ──────────────────────── */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '150px 0px' }}
        className="mx-auto max-w-4xl text-center"
      >
        <motion.h2
          variants={fade}
          custom={0}
          className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-[0.25em] text-[#00f0ff] uppercase"
        >
          ABOUT
        </motion.h2>

        <motion.p
          variants={fade}
          custom={1}
          className="mt-8 sm:mt-12 text-base sm:text-xl lg:text-2xl text-slate-200 leading-relaxed sm:leading-[1.85] font-normal text-balance"
        >
          Entrepreneurship Cell IIT Kanpur envisages{' '}
          <span className="font-semibold text-white">EntreVerse</span> as an exhilarating and thought provoking event. With a lineup of{' '}
          <a href="#competitions" className="font-semibold text-[#00f0ff] hover:underline underline-offset-4 transition-colors">
            competitions
          </a>
          ,{' '}
          <a href="#discussions" className="font-semibold text-[#00f0ff] hover:underline underline-offset-4 transition-colors">
            insightful workshops and enriching panel discussions
          </a>
          , this event will provide the audience a wholesome exposure to the vast world of business. This universe would give a golden opportunity to inquisitive minds to interact with and get inspired by our worthy speakers and also to prove their mettle in competitions.
        </motion.p>
      </motion.div>
    </section>
  )
}

