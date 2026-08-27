'use client'

import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { User, AlertCircle, Plus, Loader2, ArrowLeft, Sparkles } from 'lucide-react'
import MemberCard from '@/components/register/MemberCard'

export default function StepMembers({
  form,
  setForm,
  competition,
  onSubmit,
  onBack,
  submitting,
  submitError,
}) {
  const [errors, setErrors] = useState([])

  const addMember = () => {
    if (form.members.length >= competition.max_team_size) return
    setForm((f) => ({
      ...f,
      members: [...f.members, { name: '', roll_no: '', email: '', phone: '', is_leader: false }],
    }))
  }

  const removeMember = (i) => {
    setForm((f) => {
      const updated = f.members.filter((_, idx) => idx !== i)
      if (!updated.some((m) => m.is_leader) && updated.length > 0) {
        updated[0].is_leader = true
      }
      return { ...f, members: updated }
    })
    setErrors((e) => e.filter((_, idx) => idx !== i))
  }

  const updateMember = (i, field, value) => {
    setForm((f) => {
      const members = [...f.members]
      members[i] = { ...members[i], [field]: value }
      return { ...f, members }
    })
    setErrors((e) => {
      const copy = [...e]
      if (copy[i]) delete copy[i][field]
      return copy
    })
  }

  const setLeader = (i) => {
    setForm((f) => ({
      ...f,
      members: f.members.map((m, idx) => ({ ...m, is_leader: idx === i })),
    }))
  }

  const validate = () => {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRe = /^[+\d\s\-()]{10,20}$/
    const errs = form.members.map((m) => {
      const e = {}
      if (!m.name.trim() || m.name.trim().length < 2) e.name = 'Name must be at least 2 characters'
      if (!m.roll_no.trim()) e.roll_no = 'Roll number is required'
      if (!m.email.trim() || !emailRe.test(m.email)) e.email = 'Valid email is required'
      if (!m.phone.trim() || !phoneRe.test(m.phone)) e.phone = 'Valid phone number is required'
      return e
    })

    const rolls = form.members.map((m) => m.roll_no.trim().toLowerCase())
    rolls.forEach((r, i) => {
      if (r && rolls.indexOf(r) !== i) {
        errs[i].roll_no = 'Duplicate roll number in team'
      }
    })

    const emails = form.members.map((m) => m.email.trim().toLowerCase())
    emails.forEach((e, i) => {
      if (e && emails.indexOf(e) !== i) {
        errs[i].email = 'Duplicate email in team'
      }
    })

    setErrors(errs)
    return errs.every((e) => Object.keys(e).length === 0)
  }

  const handleSubmit = () => {
    if (validate()) onSubmit()
  }

  const leaderCount = form.members.filter((m) => m.is_leader).length
  const canAdd = form.members.length < competition.max_team_size
  const atMin = form.members.length <= competition.min_team_size

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-2xl font-extrabold sm:text-3xl text-white">Add team members</h2>
        <p className="mt-1.5 text-sm text-slate-300">
          Team: <span className="font-bold text-[#00f0ff]">{form.teamName}</span>
          {' · '}
          {competition.min_team_size === competition.max_team_size
            ? `Exactly ${competition.min_team_size} member${competition.min_team_size > 1 ? 's' : ''}`
            : `${competition.min_team_size}–${competition.max_team_size} members`}
        </p>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-violet-500/25 bg-violet-950/30 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-white">
          <User className="h-4 w-4 text-[#00f0ff]" />
          <span className="font-bold">{form.members.length}</span>
          <span className="text-slate-300">
            / {competition.max_team_size} members
          </span>
          {leaderCount === 0 && (
            <span className="ml-2 flex items-center gap-1 text-xs text-amber-400">
              <AlertCircle className="h-3 w-3" /> No leader set
            </span>
          )}
        </div>
        {canAdd && (
          <button
            type="button"
            onClick={addMember}
            className="flex items-center gap-1.5 rounded-lg border border-[#00f0ff]/40 bg-[#00f0ff]/10 px-3 py-1.5 text-xs font-semibold text-[#00f0ff] transition-all hover:bg-[#00f0ff]/20"
          >
            <Plus className="h-3.5 w-3.5" /> Add Member
          </button>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {form.members.map((m, i) => (
          <MemberCard
            key={i}
            member={m}
            index={i}
            total={form.members.length}
            isOnly={form.members.length <= 1}
            onChange={(field, val) => updateMember(i, field, val)}
            onRemove={() => removeMember(i)}
            onSetLeader={() => setLeader(i)}
            errors={errors[i] ?? {}}
          />
        ))}
      </AnimatePresence>

      {/* removed redundant helper notice */}

      {submitError && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{submitError}</p>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-300 transition-all hover:border-violet-500/30 hover:text-white disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || form.members.length < competition.min_team_size || leaderCount !== 1}
          className="inline-flex items-center gap-2 rounded-xl btn-continuum px-7 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:pointer-events-none"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
            </>
          ) : (
            <>
              Confirm Registration <Sparkles className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
