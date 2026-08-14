'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Calendar, Plus, Pencil, CheckCircle2, XCircle,
  Loader2, X, Save, RefreshCw, AlertCircle
} from 'lucide-react'
import {
  getEvents, adminCreateEvent, adminUpdateEvent
} from '@/lib/admin-api'

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function EventModal({ initial, onClose, onSaved }) {
  const isEdit = !!initial
  const [name, setName] = useState(initial?.name || '')
  const [slug, setSlug] = useState(initial?.slug || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [isActive, setIsActive] = useState(initial?.is_active ?? true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [slugEdited, setSlugEdited] = useState(isEdit)

  useEffect(() => {
    if (!slugEdited && !isEdit) setSlug(slugify(name))
  }, [name, slugEdited, isEdit])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      let saved
      if (isEdit && initial) {
        const req = { name, description, is_active: isActive }
        saved = await adminUpdateEvent(initial.id, req)
      } else {
        const req = { name, slug, description, is_active: isActive }
        saved = await adminCreateEvent(req)
      }
      onSaved(saved)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className="w-full max-w-lg rounded-2xl border border-white/[0.1] bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-4">
          <h2 className="font-heading text-base font-semibold text-foreground">
            {isEdit ? 'Edit Event' : 'Create Event'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              placeholder="EntreVerse 2027"
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
                placeholder="entreverse-2027"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-foreground font-mono placeholder:text-muted-foreground/40 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <p className="text-[11px] text-muted-foreground/60">Used in URLs. Auto-generated from name; edit if needed.</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe this event…"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Active</p>
              <p className="text-xs text-muted-foreground">Show this event on the public site</p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive((v) => !v)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${isActive ? 'bg-primary' : 'bg-white/10'}`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${isActive ? 'translate-x-5' : 'translate-x-0'}`}
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
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EventCard({ event, onEdit }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1.5">
          <h3 className="font-heading text-base font-semibold text-foreground truncate">{event.name}</h3>
          {event.is_active ? (
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2 py-0.5 flex-shrink-0">
              <CheckCircle2 className="h-3 w-3" /> Active
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground bg-white/[0.05] border border-white/10 rounded-full px-2 py-0.5 flex-shrink-0">
              <XCircle className="h-3 w-3" /> Inactive
            </span>
          )}
        </div>
        <p className="text-xs font-mono text-muted-foreground/60 mb-2">/{event.slug}</p>
        {event.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
        )}
        <p className="text-xs text-muted-foreground/50 mt-2">
          Created {new Date(event.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>
      <button
        onClick={() => onEdit(event)}
        className="flex-shrink-0 flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-muted-foreground hover:bg-white/[0.08] hover:text-foreground transition-all"
      >
        <Pencil className="h-3.5 w-3.5" /> Edit
      </button>
    </div>
  )
}

export default function EventsPage() {
  const router = useRouter()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modal, setModal] = useState(null)

  const loadEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getEvents()
      setEvents(data || [])
    } catch (err) {
      if (err && err.status === 401) router.push('/admin/login')
      else setError(err instanceof Error ? err.message : 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { loadEvents() }, [loadEvents])

  function handleSaved(saved) {
    setEvents((prev) => {
      const idx = prev.findIndex((e) => e.id === saved.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = saved
        return next
      }
      return [saved, ...prev]
    })
    setModal(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Events</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {events.length} event{events.length !== 1 ? 's' : ''}
              {' · '}
              {events.filter((e) => e.is_active).length} active
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadEvents}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-muted-foreground hover:bg-white/[0.08] hover:text-foreground transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setModal('create')}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all"
            >
              <Plus className="h-4 w-4" /> New Event
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
        )}

        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.02] py-16 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground mb-4">No events yet</p>
            <button
              onClick={() => setModal('create')}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all"
            >
              <Plus className="h-4 w-4" /> Create your first event
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={(e) => setModal(e)}
              />
            ))}
          </div>
        )}
      </div>

      {modal !== null && (
        <EventModal
          initial={modal === 'create' ? undefined : modal}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}
