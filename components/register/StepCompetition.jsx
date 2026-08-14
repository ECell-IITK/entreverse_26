'use client'

import { ArrowRight, Loader2, AlertCircle, Users, Trophy } from 'lucide-react'

export default function StepCompetition({
  competitions,
  loading,
  fetchError,
  form,
  setForm,
  onNext,
}) {
  const handleSelect = (compId) => {
    setForm((f) => ({ ...f, competitionId: compId }))
  }

  const handleNext = () => {
    if (form.competitionId) {
      onNext()
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-heading text-2xl font-bold sm:text-3xl">Choose your competition</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Select a competition to begin your team registration.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : fetchError ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-12 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-muted-foreground">{fetchError}</p>
          <button onClick={() => window.location.reload()} className="text-xs text-primary underline">
            Retry
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {competitions.map((c) => {
            const active = form.competitionId === c.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelect(c.id)}
                className={`
                  group relative w-full overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300
                  ${active
                    ? 'border-primary/50 bg-primary/10 shadow-[0_0_24px_-8px_rgba(249,115,22,0.5)]'
                    : 'border-white/[0.07] bg-white/[0.03] hover:border-primary/25 hover:bg-white/[0.06]'
                  }
                  ${!c.registration_open ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                disabled={!c.registration_open}
              >
                {active && <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />}

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 transition-all duration-200 flex items-center justify-center
                      ${active ? 'border-primary bg-primary' : 'border-white/20'}`}>
                      {active && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className={`font-heading font-semibold transition-colors ${active ? 'text-primary' : 'text-foreground'}`}>
                        {c.name}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {c.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground">
                          <Users className="h-3 w-3" />
                          {c.min_team_size === c.max_team_size
                            ? `${c.min_team_size} members`
                            : `${c.min_team_size}–${c.max_team_size} members`}
                        </span>
                        {c.registration_open ? (
                          <span className="inline-flex items-center gap-1 rounded-lg border border-accent/20 bg-accent/10 px-2 py-0.5 text-[10px] text-accent">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />Open
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground">Closed</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Trophy className={`h-5 w-5 shrink-0 transition-colors ${active ? 'text-primary' : 'text-muted-foreground/40'}`} />
                </div>
              </button>
            )
          })}
        </div>
      )}

      <button
        type="button"
        onClick={handleNext}
        disabled={!form.competitionId}
        className="self-end inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_-6px_rgba(249,115,22,0.7)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_28px_-4px_rgba(249,115,22,0.9)] disabled:opacity-40 disabled:pointer-events-none"
      >
        Continue <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}
