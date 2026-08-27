import { motion } from 'motion/react'
import { CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'

const WHATSAPP_LINKS = {
  'startup-builder': 'https://chat.whatsapp.com/BvGkjFdoNifGfFH6GOcWNg?s=cl&p=a&mlu=4',
  'venture-and-verdict': 'https://chat.whatsapp.com/F5v3olL4KPI35lfuU2DSJY?s=cl&p=a&mlu=4',
  'flip-the-future': 'https://chat.whatsapp.com/F5v3olL4KPI35lfuU2DSJY?s=cl&p=a&mlu=4',
  'start-up-sprint': 'https://chat.whatsapp.com/IZdOwPZ8SX42438DHH0Sci?s=cl&p=a&mlu=4',
  'startup-sprint': 'https://chat.whatsapp.com/IZdOwPZ8SX42438DHH0Sci?s=cl&p=a&mlu=4',
}

function getWhatsAppUrl(comp) {
  if (!comp) return null
  if (comp.slug && WHATSAPP_LINKS[comp.slug]) return WHATSAPP_LINKS[comp.slug]
  const name = (comp.name || '').toLowerCase()
  if (name.includes('builder')) return WHATSAPP_LINKS['startup-builder']
  if (name.includes('verdict') || name.includes('venture') || name.includes('flip')) return WHATSAPP_LINKS['venture-and-verdict']
  if (name.includes('sprint')) return WHATSAPP_LINKS['start-up-sprint']
  return null
}

export default function StepSuccess({ teamId, teamName, competition }) {
  const whatsappUrl = getWhatsAppUrl(competition)

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

      {/* WhatsApp Group Join Card */}
      {whatsappUrl && (
        <div className="w-full max-w-sm rounded-2xl border border-emerald-500/40 bg-emerald-950/25 p-5 text-center shadow-[0_0_30px_rgba(16,185,129,0.15)]">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Important Next Step</p>
          </div>
          <h3 className="font-heading text-base font-bold text-white mb-1.5">
            Join Competition WhatsApp Group
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Stay updated with event schedules, problem statement releases, and direct coordinator announcements.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/40 transition-all hover:scale-105 hover:from-emerald-500 hover:to-teal-400"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.2.301-.778.98-.954 1.18-.175.201-.351.226-.652.075-.301-.15-1.272-.469-2.424-1.496-.895-.799-1.5-1.786-1.676-2.087-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.3-.502.101-.201.05-.377-.025-.527-.075-.15-.678-1.636-.929-2.24-.244-.588-.493-.508-.678-.517-.175-.01-.377-.01-.578-.01s-.527.075-.803.377c-.276.301-1.054 1.03-1.054 2.512 0 1.482 1.079 2.912 1.23 3.113.15.201 2.124 3.243 5.145 4.549.719.31 1.28.496 1.718.636.722.23 1.378.198 1.898.12.58-.088 1.78-.728 2.03-1.431.251-.703.251-1.306.176-1.431-.075-.126-.276-.201-.577-.352zm-5.467 7.618h-.008a9.98 9.98 0 0 1-5.09-1.397l-.365-.217-3.784.992 1.01-3.689-.237-.378a9.98 9.98 0 1 1 18.474-5.32c0 5.514-4.486 10-10 10zm0-18C6.486 4 2 8.486 2 14c0 1.956.565 3.78 1.543 5.328L2 26l6.837-1.493A9.957 9.957 0 0 0 12 26c5.514 0 10-4.486 10-10s-4.486-10-10-10z" />
            </svg>
            Join WhatsApp Group
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      )}

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
