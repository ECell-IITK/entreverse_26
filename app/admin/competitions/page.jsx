'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Trophy, Plus, Pencil, CheckCircle2, XCircle,
  Loader2, X, Save, RefreshCw, AlertCircle, Users
} from 'lucide-react'
import {
  getCompetitions, getEvents, adminCreateCompetition, adminUpdateCompetition
} from '@/lib/admin-api'

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function CompetitionModal({ initial, events, onClose, onSaved }) {
  const isEdit = !!initial
  const [eventId, setEventId] = useState(initial?.event_id || (events[0]?.id || 0))
  const [name, setName] = useState(initial?.name || '')
  const [slug, setSlug] = useState(initial?.slug || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [maxTeam, setMaxTeam] = useState(initial?.max_team_size || 4)
  const [minTeam, setMinTeam] = useState(initial?.min_team_size || 1)
  const [regOpen, setRegOpen] = useState(initial?.registration_open ?? true)
  const [regCode, setRegCode] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [slugEdited, setSlugEdited] = useState(isEdit)

  useEffect(() => {
    if (!slugEdited && !isEdit) setSlug(slugify(name))
  }, [name, slugEdited, isEdit])

  async function handleSubmit(e) {
    e.preventDefault()
    if (minTeam > maxTeam) {
      setError('Min team size cannot be greater than max team size')
      return
    }
    setSaving(true)
    setError(null)
    try {
      let saved
      if (isEdit && initial) {
        const req = {
          name,
          description,
          max_team_size: maxTeam,
          min_team_size: minTeam,
          registration_open: regOpen,
          ...(regCode ? { registration_code: regCode } : {}),
        }
        saved = await adminUpdateCompetition(initial.id, req)
      } else {
        if (!regCode) {
          setError('Registration code is required')
          setSaving(false)
          return
        }
        const req = {
          event_id: eventId,
          name,
          slug,
          description,
          max_team_size: maxTeam,
          min_team_size: minTeam,
          registration_open: regOpen,
          registration_code: regCode,
        }
        saved = await adminCreateCompetition(req)
      }
      onSaved(saved)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div
        className="w-full max-w-lg rounded-2xl border border-white/[0.1] bg-background shadow-2xl my-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-4">
          <h2 className="font-heading text-base font-semibold text-foreground">
            {isEdit ? 'Edit Competition' : 'Create Competition'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isEdit && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Event <span className="text-destructive">*</span>
              </label>
              <select
                value={eventId}
                onChange={(e) => setEventId(Number(e.target.value))}
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>{ev.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Name <span className="text-destructive">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={3}
              maxLength={150}
              placeholder="Flip the Future"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {!isEdit && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Slug <span className="text-destructive">*</span>
              </label>
              <input
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugEdited(true) }}
                required
                minLength={3}
                maxLength={150}
                placeholder="flip-the-future"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-foreground font-mono placeholder:text-muted-foreground/40 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <p className="text-[11px] text-muted-foreground/60">Auto-generated from name; edit if needed.</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Describe this competition…"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Min Team Size <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                value={minTeam}
                onChange={(e) => setMinTeam(Number(e.target.value))}
                required
                min={1}
                max={10}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Max Team Size <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                value={maxTeam}
                onChange={(e) => setMaxTeam(Number(e.target.value))}
                required
                min={1}
                max={10}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Registration Code {!isEdit && <span className="text-destructive">*</span>}
            </label>
            <input
              type="text"
              value={regCode}
              onChange={(e) => setRegCode(e.target.value)}
              required={!isEdit}
              minLength={isEdit ? 0 : 6}
              placeholder={isEdit ? 'Leave blank to keep current code' : 'e.g. FTF-2026-SECRET'}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-foreground font-mono placeholder:text-muted-foreground/40 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {isEdit && (
              <p className="text-[11px] text-muted-foreground/60">Leave blank to keep the existing code unchanged.</p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Registration Open</p>
              <p className="text-xs text-muted-foreground">Allow teams to register for this competition</p>
            </div>
            <button
              type="button"
              onClick={() => setRegOpen((v) => !v)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${regOpen ? 'bg-primary' : 'bg-white/10'}`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${regOpen ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-muted-foreground hover:bg-white/[0.08] hover:text-foreground transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Competition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function CompCard({ comp, eventName, onEdit }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h3 className="font-heading text-base font-semibold text-foreground">{comp.name}</h3>
            {comp.registration_open ? (
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2 py-0.5 flex-shrink-0">
                <CheckCircle2 className="h-3 w-3" /> Open
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground bg-white/[0.05] border border-white/10 rounded-full px-2 py-0.5 flex-shrink-0">
                <XCircle className="h-3 w-3" /> Closed
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
            <span className="font-mono opacity-60">/{comp.slug}</span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {comp.min_team_size}–{comp.max_team_size} members
            </span>
            <span className="opacity-70">{eventName}</span>
          </div>

          {comp.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{comp.description}</p>
          )}

          <p className="text-xs text-muted-foreground/50 mt-2">
            Created {new Date(comp.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>

        <button
          onClick={() => onEdit(comp)}
          className="flex-shrink-0 flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-muted-foreground hover:bg-white/[0.08] hover:text-foreground transition-all"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
      </div>
    </div>
  )
}

export default function CompetitionsPage() {
  const router = useRouter()
  const [competitions, setCompetitions] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modal, setModal] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [c, e] = await Promise.all([getCompetitions(), getEvents()])
      setCompetitions(c || [])
      setEvents(e || [])
    } catch (err) {
      if (err && err.status === 401) router.push('/admin/login')
      else setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { loadData() }, [loadData])

  function handleSaved(saved) {
    setCompetitions((prev) => {
      const idx = prev.findIndex((c) => c.id === saved.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = saved
        return next
      }
      return [saved, ...prev]
    })
    setModal(null)
  }

  function getEventName(eventId) {
    return events.find((e) => e.id === eventId)?.name || `Event #${eventId}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const openCount = competitions.filter((c) => c.registration_open).length

  return (
    <>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Competitions</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {competitions.length} competition{competitions.length !== 1 ? 's' : ''}
              {' · '}
              {openCount} open for registration
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-muted-foreground hover:bg-white/[0.08] hover:text-foreground transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setModal('create')}
              disabled={events.length === 0}
              title={events.length === 0 ? 'Create an event first' : undefined}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Plus className="h-4 w-4" /> New Competition
            </button>
          </div>
        </div>

        {events.length === 0 && !loading && (
          <div className="flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            No events exist yet. Create an event first before adding competitions.
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
        )}

        {competitions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.02] py-16 text-center">
            <Trophy className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground mb-4">No competitions yet</p>
            {events.length > 0 && (
              <button
                onClick={() => setModal('create')}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all"
              >
                <Plus className="h-4 w-4" /> Create your first competition
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {competitions.map((comp) => (
              <CompCard
                key={comp.id}
                comp={comp}
                eventName={getEventName(comp.event_id)}
                onEdit={(c) => setModal(c)}
              />
            ))}
          </div>
        )}
      </div>

      {modal !== null && (
        <CompetitionModal
          initial={modal === 'create' ? undefined : modal}
          events={events}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}
