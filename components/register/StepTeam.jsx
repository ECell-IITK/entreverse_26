'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Users } from 'lucide-react'
import { Field, Input, Textarea } from '@/components/register/ui'

export default function StepTeam({ form, setForm, competition, onNext, onBack }) {
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.teamName.trim() || form.teamName.trim().length < 3) {
      e.teamName = 'Team name must be at least 3 characters'
    }
    if (form.teamName.trim().length > 150) {
      e.teamName = 'Team name must be under 150 characters'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validate()) onNext()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-2xl font-extrabold sm:text-3xl text-white">Name your team</h2>
        <p className="mt-1 text-sm text-slate-300">
          Registering for <span className="font-bold text-[#00f0ff]">{competition.name}</span>
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-[#00f0ff]/25 bg-[#00f0ff]/10 px-4 py-3">
        <Users className="h-4 w-4 shrink-0 text-[#00f0ff]" />
        <p className="text-xs sm:text-sm font-semibold text-white">
          {competition.min_team_size === competition.max_team_size
            ? `Exactly ${competition.min_team_size} member${competition.min_team_size > 1 ? 's' : ''} required`
            : `${competition.min_team_size} to ${competition.max_team_size} members allowed`}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <Field label="Team Name" required error={errors.teamName}>
          <Input
            placeholder="e.g. Quantum Ventures"
            value={form.teamName}
            onChange={(e) => {
              setForm((f) => ({ ...f, teamName: e.target.value }))
              setErrors({})
            }}
            error={errors.teamName}
            maxLength={150}
          />
        </Field>

        <Field label="Additional Comments">
          <Textarea
            placeholder="Anything you'd like to share with the organizers? (optional)"
            value={form.comments}
            onChange={(e) => setForm((f) => ({ ...f, comments: e.target.value }))}
          />
        </Field>
      </div>

      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-violet-500/30 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!form.teamName.trim()}
          className="inline-flex items-center gap-2 rounded-xl btn-continuum px-7 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:pointer-events-none"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
