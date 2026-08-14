'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Loader2, Sparkles } from 'lucide-react'
import { getCompetitionsByEvent, registerTeam } from '@/lib/api'
import StepBar from '@/components/register/StepBar'
import StepCompetition from '@/components/register/StepCompetition'
import StepTeam from '@/components/register/StepTeam'
import StepMembers from '@/components/register/StepMembers'
import StepSuccess from '@/components/register/StepSuccess'

const EVENT_SLUG = 'entreverse-2026'

const EMPTY_MEMBER = () => ({
  name: '', roll_no: '', email: '', phone: '', is_leader: false,
})

function RegisterPageInner() {
  const searchParams = useSearchParams()

  const [competitions, setCompetitions] = useState([])
  const [loadingComps, setLoadingComps] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [successTeamId, setSuccessTeamId] = useState(null)

  const [form, setForm] = useState({
    competitionId: null,
    teamName: '',
    comments: '',
    members: [{ ...EMPTY_MEMBER(), is_leader: true }],
  })

  // Load competitions from API
  useEffect(() => {
    setLoadingComps(true)
    getCompetitionsByEvent(EVENT_SLUG, true)
      .then((data) => {
        setCompetitions(data || [])
        const slug = searchParams.get('competition')
        if (slug) {
          const match = (data || []).find((c) => c.slug === slug)
          if (match) setForm((f) => ({ ...f, competitionId: match.id }))
        }
      })
      .catch((err) => setFetchError(err.message || 'Failed to load competitions'))
      .finally(() => setLoadingComps(false))
  }, [searchParams])

  const selectedComp = competitions.find((c) => c.id === form.competitionId) || null

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
    enter: (dir) => ({ opacity: 0, x: dir * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir * -40 }),
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

      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <a href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <div className="flex h-9 w-9 items-center justify-center">
              <img src="/logo_ecell.png" alt="EntreVerse Logo" className="h-10 w-10" />
            </div>
            <div className="leading-none">
              <p className="font-heading text-sm font-bold">EntreVerse</p>
              <p className="text-[9px] uppercase tracking-[0.24em] text-muted-foreground">E-Cell IIT Kanpur</p>
            </div>
          </a>
          {step < 4 && <StepBar current={step} />}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
        {step < 4 && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-semibold uppercase tracking-widest text-primary">
              <Sparkles className="h-6 w-6" /> EntreVerse 2026 Registration
            </span>
          </motion.div>
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
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
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
