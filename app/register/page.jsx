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
    name: 'Flip the Future',
    slug: 'flip-the-future',
    description:
      'Strategic decision-making and smart investments are the keys to this challenge. Teams (preferably Y25s) will bid for the most promising opportunities from a set of firms, using provided summaries to evaluate options and outsmart competitors.',
    max_team_size: 4,
    min_team_size: 2,
    registration_open: true,
  },
  {
    id: 2,
    event_id: 1,
    name: 'The Strategy Showdown',
    slug: 'strategy-showdown',
    description:
      'An opportunity to dive into the world of entrepreneurship, this challenge invites participants (preferably PGs) to step into the shoes of business innovators. Teams will explore real-world problems in different domains of business.',
    max_team_size: 4,
    min_team_size: 2,
    registration_open: true,
  },
  {
    id: 3,
    event_id: 1,
    name: 'Start-up Sprint',
    slug: 'startup-sprint',
    description:
      '"One Day One Idea Infinite Potential" — An intense full day challenge where teams transform ideas into MVPs and prototypes before sunrise.',
    max_team_size: 5,
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
    competitionId: 1, // Default selected
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
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-accent/[0.04] blur-[100px]" />
      </div>

      {/* Header with Navigation */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>

            <Link href="/" className="group flex items-center gap-2.5 transition-opacity hover:opacity-90">
              <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center shrink-0">
                <img
                  src="/logo_ecell.png"
                  alt="Entrepreneurship Cell IIT Kanpur Logo"
                  className="h-full w-full object-contain drop-shadow-[0_0_8px_rgba(94,200,255,0.4)]"
                />
              </div>
              <div className="hidden sm:flex flex-col justify-center leading-none">
                <p className="font-heading text-sm sm:text-base font-bold text-white group-hover:text-primary transition-colors">
                  Entrepreneurship Cell
                </p>
                <p className="text-[9px] sm:text-[10px] font-semibold tracking-[0.14em] text-[#5ec8ff] mt-0.5">
                  IIT Kanpur
                </p>
              </div>
            </Link>
          </div>

          {step < 4 && <StepBar current={step} />}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
        {step < 4 && (
          <div className="mb-8 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              <Sparkles className="h-4 w-4" /> EntreVerse 2026 Registration
            </span>
          </div>
        )}

        <div
          className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.03] p-6 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-10"
          style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 32px 64px -12px rgba(0,0,0,0.6)' }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

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
          <p className="mt-8 text-center text-xs text-muted-foreground/60">
            Having trouble? Reach out at{' '}
            <a href="mailto:ecell@iitk.ac.in" className="text-primary/70 underline hover:text-primary">
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
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <RegisterPageInner />
    </Suspense>
  )
}
