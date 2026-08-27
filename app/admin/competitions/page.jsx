'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Trophy, CheckCircle2, XCircle,
  Loader2, RefreshCw, Users, ArrowRight
} from 'lucide-react'
import {
  getCompetitions, getEvents
} from '@/lib/admin-api'


function CompCard({ comp, eventName }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 transition-all hover:bg-white/[0.04]">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
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
              <Users className="h-3 w-3 text-primary" />
              {comp.min_team_size === comp.max_team_size
                ? `${comp.min_team_size} members`
                : `${comp.min_team_size}–${comp.max_team_size} members`}
            </span>
            <span className="opacity-70">{eventName}</span>
          </div>

          {comp.description && (
            <p className="text-sm text-muted-foreground leading-relaxed mt-1">{comp.description}</p>
          )}

          <p className="text-xs text-muted-foreground/50 mt-2.5">
            Competition ID #{comp.id}
          </p>
        </div>

        <div className="flex-shrink-0 pt-1 sm:pt-0">
          <Link
            href="/admin/teams"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-muted-foreground hover:bg-white/[0.08] hover:text-foreground transition-all"
          >
            View Teams <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
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
        <button
          onClick={loadData}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-muted-foreground hover:bg-white/[0.08] hover:text-foreground transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
      )}

      {competitions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.02] py-16 text-center">
          <Trophy className="h-10 w-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">No competitions found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {competitions.map((comp) => (
            <CompCard
              key={comp.id}
              comp={comp}
              eventName={getEventName(comp.event_id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
