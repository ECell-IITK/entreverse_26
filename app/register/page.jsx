'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { Loader2, Sparkles, ArrowLeft } from 'lucide-react'
import { getCompetitionsByEvent, registerTeam } from '@/lib/api'
import StepBar from '@/components/register/StepBar'
import StepCompetition from '@/components/register/StepCompetition'
import StepTeam from '@/components/register/StepTeam'
import StepMembers from '@/components/register/StepMembers'
import StepSuccess from '@/components/register/StepSuccess'

const EVENT_SLUG = 'entreverse-2026'

const DEFAULT_COMPETITIONS = [
  {
    id: 1,
    event_id: 1,
    name: 'Venture And Verdict',
    slug: 'venture-and-verdict',
    description:
      'Step into early-stage venture capital. Analyze startup balance sheets, bid in live auction rounds, and pitch to senior VC partners.',
    max_team_size: 4,
    min_team_size: 1,
    registration_open: true,
  },
  {
    id: 2,
    event_id: 1,
    name: 'Startup Builder',
    slug: 'startup-builder',
    description:
      'Tackle live business crises. Unravel supply chain and market bottlenecks, then present turnaround roadmaps to corporate leaders.',
    max_team_size: 4,
    min_team_size: 1,
    registration_open: true,
  },
  {
    id: 3,
    event_id: 1,
    name: 'Start-up-Sprint',
    slug: 'start-up-sprint',
    description:
      '24 hours on the clock. Whiteboard sketch to working MVP before dawn. Demo live to angels for instant SIIC incubation backing.',
    max_team_size: 4,
    min_team_size: 1,
    registration_open: true,
  },
]

const EMPTY_MEMBER = () => ({
  name: '', roll_no: '', email: '', phone: '', is_leader: false,
})

function RegisterPageInner() {
  const searchParams = useSearchParams()

  const [competitions, setCompetitions] = useState(DEFAULT_COMPETITIONS)
  const [loadingComps, setLoadingComps] = useState(false)
  const [fetchError, setFetchError] = useState(null)

  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [successTeamId, setSuccessTeamId] = useState(null)

  const [form, setForm] = useState({
    competitionId: 1,
    teamName: '',
    comments: '',
    members: [{ ...EMPTY_MEMBER(), is_leader: true }],
  })

  // Load live competitions in background
  useEffect(() => {
    const slug = searchParams.get('competition')
    if (slug) {
      const match = DEFAULT_COMPETITIONS.find((c) => c.slug === slug)
      if (match) setForm((f) => ({ ...f, competitionId: match.id }))
    }

    getCompetitionsByEvent(EVENT_SLUG, true)
      .then((data) => {
        if (data && data.length > 0) {
          setCompetitions(data)
          if (slug) {
            const match = data.find((c) => c.slug === slug)
            if (match) setForm((f) => ({ ...f, competitionId: match.id }))
          }
        }
      })
      .catch((err) => console.warn('Background competition sync note:', err.message))
  }, [searchParams])

  const selectedComp = competitions.find((c) => c.id === form.competitionId) || DEFAULT_COMPETITIONS[0]

  useEffect(() => {
    if (!selectedComp) return
    setForm((f) => {
      const capped = f.members.slice(0, selectedComp.max_team_size)
      if (!capped.some((m) => m.is_leader) && capped.length > 0) capped[0].is_leader = true
      return { ...f, members: capped }
    })
  }, [selectedComp?.id, selectedComp?.max_team_size])

  const handleSubmit = useCallback(async () => {
    if (!form.competitionId || !selectedComp) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await registerTeam({
        competition_id: form.competitionId,
        team_name: form.teamName.trim(),
        comments: form.comments.trim() || undefined,
        members: form.members,
      })
      if (res.success && res.team_id) {
        setSuccessTeamId(res.team_id)
        setStep(4)
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }, [form, selectedComp])

  const slideVariants = {
    enter: (dir) => ({ opacity: 0, x: dir * 30 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir * -30 }),
  }
  const [dir, setDir] = useState(1)
  const goNext = () => { setDir(1); setStep((s) => s + 1) }
  const goBack = () => { setDir(-1); setStep((s) => s - 1) }

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Header with Navigation */}
      <header className="sticky top-0 z-40 border-b border-violet-500/20 bg-[#030014]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-violet-500/20 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>

            <Link href="/" className="group flex items-center gap-2.5 transition-opacity hover:opacity-90">
              <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center shrink-0">
                <img
                  src="/logo_ecell.png"
                  alt="Entrepreneurship Cell IIT Kanpur Logo"
                  className="h-full w-full object-contain drop-shadow-[0_0_8px_rgba(124,58,237,0.7)]"
                />
              </div>
              <div className="hidden sm:flex flex-col justify-center leading-none">
                <p className="font-heading text-sm sm:text-base font-bold text-white group-hover:text-[#00f0ff] transition-colors">
                  Entrepreneurship Cell
                </p>
                <p className="text-[9px] sm:text-[10px] font-semibold tracking-[0.14em] text-[#00f0ff] mt-0.5">
                  IIT Kanpur
                </p>
              </div>
            </Link>
          </div>

          {step < 4 && <StepBar current={step} />}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">

        <div
          className="glass relative overflow-hidden rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl border border-violet-500/30"
          style={{ boxShadow: '0 0 50px rgba(124, 58, 237, 0.20), 0 30px 60px -10px rgba(0,0,0,0.85)' }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent" />

          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {step === 1 && (
                <StepCompetition
                  competitions={competitions}
                  loading={loadingComps}
                  fetchError={fetchError}
                  form={form}
                  setForm={setForm}
                  onNext={goNext}
                />
              )}
              {step === 2 && selectedComp && (
                <StepTeam
                  form={form}
                  setForm={setForm}
                  competition={selectedComp}
                  onNext={goNext}
                  onBack={goBack}
                />
              )}
              {step === 3 && selectedComp && (
                <StepMembers
                  form={form}
                  setForm={setForm}
                  competition={selectedComp}
                  onSubmit={handleSubmit}
                  onBack={goBack}
                  submitting={submitting}
                  submitError={submitError}
                />
              )}
              {step === 4 && selectedComp && successTeamId !== null && (
                <StepSuccess
                  teamId={successTeamId}
                  teamName={form.teamName}
                  competition={selectedComp}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {step < 4 && (
          <p className="mt-8 text-center text-xs text-slate-400">
            Need help with team registration? Reach out to us at{' '}
            <a href="mailto:ecell@iitk.ac.in" className="text-[#00f0ff] underline hover:text-white">
              ecell@iitk.ac.in
            </a>
          </p>
        )}
      </main>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-transparent">
          <Loader2 className="h-8 w-8 animate-spin text-[#00f0ff]" />
        </div>
      }
    >
      <RegisterPageInner />
    </Suspense>
  )
}
