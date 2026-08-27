import { motion } from 'motion/react'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { formatTeamCode } from '@/lib/utils'

export default function StepSuccess({ teamId, teamName, competition }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="flex flex-col items-center gap-6 py-8 text-center"
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-violet-600/30 blur-2xl scale-150" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#00f0ff]/50 bg-violet-950/50 shadow-[0_0_35px_rgba(0,240,255,0.4)]">
          <CheckCircle2 className="h-12 w-12 text-[#00f0ff]" />
        </div>
      </div>

      <div>
        <h2 className="font-heading text-3xl font-extrabold text-white">You&apos;re Registered! 🚀</h2>
        <p className="mt-2 text-slate-300">
          Team <span className="font-semibold text-white">{teamName}</span> is officially registered for{' '}
          <span className="font-bold text-[#00f0ff]">{competition.name}</span>.
        </p>
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-violet-500/30 bg-violet-950/30 px-6 py-5 shadow-lg">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">Official Registration Code</p>
        <p className="font-mono text-3xl sm:text-4xl font-extrabold tracking-wider bg-gradient-to-r from-violet-400 via-indigo-300 to-[#00f0ff] bg-clip-text text-transparent">{formatTeamCode(teamId)}</p>
        <p className="mt-2 text-xs text-slate-400">
          Save your Registration Code for festival check-in and pitch schedules.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-violet-500/30 hover:text-white"
        >
          Back to Home
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center justify-center gap-2 rounded-xl btn-continuum px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-105"
        >
          Register Another Team <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  )
}
