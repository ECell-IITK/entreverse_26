import { motion } from 'motion/react'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import type { Competition } from '@/lib/api'

interface StepSuccessProps {
  teamId: number
  teamName: string
  competition: Competition
}

export default function StepSuccess({ teamId, teamName, competition }: StepSuccessProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="flex flex-col items-center gap-6 py-8 text-center"
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl scale-150" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary/40 bg-primary/10">
          <CheckCircle2 className="h-12 w-12 text-primary" />
        </div>
      </div>

      <div>
        <h2 className="font-heading text-3xl font-bold">You're in! 🚀</h2>
        <p className="mt-2 text-muted-foreground">
          Team <span className="font-semibold text-foreground">{teamName}</span> is registered for{' '}
          <span className="font-semibold text-primary">{competition.name}</span>.
        </p>
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-primary/20 bg-primary/5 px-6 py-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Team ID</p>
        <p className="font-mono text-3xl font-black tracking-wider text-primary">#{teamId}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Save this ID — you can use it to look up your registration at any time.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <a href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-muted-foreground transition-all hover:border-white/20 hover:text-foreground">
          Back to Home
        </a>
        <a href="/register"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_-6px_rgba(249,115,22,0.6)] transition-all hover:scale-[1.03]">
          Register Another Team <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </motion.div>
  )
}
