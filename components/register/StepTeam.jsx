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
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-heading text-2xl font-bold sm:text-3xl">Name your team</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Registering for <span className="font-semibold text-primary">{competition.name}</span>.
          Give your team a memorable name.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-accent/15 bg-accent/5 px-5 py-4">
        <Users className="h-5 w-5 shrink-0 text-accent" />
        <div>
          <p className="text-sm font-medium text-foreground">
            {competition.min_team_size === competition.max_team_size
              ? `Exactly ${competition.min_team_size} member${competition.min_team_size > 1 ? 's' : ''} required`
              : `${competition.min_team_size} to ${competition.max_team_size} members allowed`}
          </p>
          <p className="text-xs text-muted-foreground">
            You&apos;ll add individual members in the next step.
          </p>
        </div>
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
            placeholder="Anything you'd like to share with us? (optional)"
            value={form.comments}
            onChange={(e) => setForm((f) => ({ ...f, comments: e.target.value }))}
          />
        </Field>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-muted-foreground transition-all hover:border-white/20 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!form.teamName.trim()}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_-6px_rgba(249,115,22,0.7)] transition-all duration-200 hover:scale-[1.03] disabled:opacity-40 disabled:pointer-events-none"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
