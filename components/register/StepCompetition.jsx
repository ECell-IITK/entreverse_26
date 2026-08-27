'use client'

import Link from 'next/link'
import { ArrowRight, ArrowLeft, Loader2, AlertCircle, Users, Trophy } from 'lucide-react'

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
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-2xl font-extrabold sm:text-3xl text-white">Choose your competition</h2>
      </div>

      {loading && (!competitions || competitions.length === 0) ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#00f0ff]" />
        </div>
      ) : fetchError && (!competitions || competitions.length === 0) ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-12 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-slate-300">{fetchError}</p>
          <button onClick={() => window.location.reload()} className="text-xs text-[#00f0ff] underline">
            Retry
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
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
                    ? 'border-[#00f0ff]/80 bg-[#120738]/80 shadow-[0_0_30px_rgba(0,240,255,0.25),inset_0_0_20px_rgba(124,58,237,0.25)]'
                    : 'border-white/[0.08] bg-white/[0.03] hover:border-violet-500/40 hover:bg-white/[0.06]'
                  }
                  ${!c.registration_open ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                disabled={!c.registration_open}
              >
                {active && <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent" />}

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 transition-all duration-200 flex items-center justify-center
                      ${active ? 'border-[#00f0ff] bg-[#00f0ff]' : 'border-white/20'}`}>
                      {active && <div className="h-2 w-2 rounded-full bg-[#030014]" />}
                    </div>
                    <div>
                      <p className={`font-heading text-base font-bold transition-colors ${active ? 'text-white' : 'text-slate-200'}`}>
                        {c.name}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-300 line-clamp-2">
                        {c.description}
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-slate-300">
                          <Users className="h-3 w-3" />
                          {c.min_team_size === c.max_team_size
                            ? `${c.min_team_size} members`
                            : `${c.min_team_size}–${c.max_team_size} members`}
                        </span>
                        {c.registration_open ? (
                          <span className="inline-flex items-center gap-1 rounded-lg border border-[#00f0ff]/30 bg-[#00f0ff]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#00f0ff]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#00f0ff] animate-pulse" />Open
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-400">Closed</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Trophy className={`h-5 w-5 shrink-0 transition-colors ${active ? 'text-[#00f0ff]' : 'text-slate-600'}`} />
                </div>
              </button>
            )
          })}
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-slate-300 hover:bg-white/[0.08] hover:text-white transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <button
          type="button"
          onClick={handleNext}
          disabled={!form.competitionId}
          className="inline-flex items-center gap-2 rounded-xl btn-continuum px-7 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:pointer-events-none"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
