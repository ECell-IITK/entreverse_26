'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Users, Trophy, Calendar, ArrowRight, 
  Clock, CheckCircle2, XCircle, Loader2,
  TrendingUp, Activity
} from 'lucide-react'
import {
  getAllTeams, getEvents, getCompetitions
} from '@/lib/admin-api'

function StatCard({
  label, value, icon: Icon, color, href,
}) {
  return (
    <Link href={href} className="group block">
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 transition-all hover:bg-white/[0.06] hover:border-white/[0.12] hover:shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
            <p className="text-3xl font-bold text-foreground font-heading">{value}</p>
          </div>
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
          Manage <ArrowRight className="h-3 w-3" />
        </div>
      </div>
    </Link>
  )
}

export default function AdminDashboardPage() {
  const router = useRouter()

  const [teams, setTeams] = useState([])
  const [events, setEvents] = useState([])
  const [competitions, setCompetitions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getAllTeams(), getEvents(), getCompetitions()])
      .then(([t, e, c]) => {
        setTeams(t || [])
        setEvents(e || [])
        setCompetitions(c || [])
      })
      .catch((err) => {
        if (err && err.status === 401) {
          router.push('/admin/login')
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load data')
        }
      })
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
        {error}
      </div>
    )
  }

  const openComps = competitions.filter((c) => c.registration_open).length
  const activeEvents = events.filter((e) => e.is_active).length

  // Recent 8 registrations sorted by submitted_at
  const recent = [...teams]
    .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
    .slice(0, 8)

  // Teams per competition breakdown
  const compBreakdown = competitions.map((c) => ({
    name: c.name,
    count: teams.filter((t) => t.competition_id === c.id).length,
    open: c.registration_open,
  })).sort((a, b) => b.count - a.count)

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of EntreVerse 2026 registrations and management
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Teams"
          value={teams.length}
          icon={Users}
          color="bg-blue-500/20 text-blue-400"
          href="/admin/teams"
        />
        <StatCard
          label="Total Members"
          value={teams.reduce((s, t) => s + (t.total_members || 0), 0)}
          icon={TrendingUp}
          color="bg-violet-500/20 text-violet-400"
          href="/admin/teams"
        />
        <StatCard
          label="Competitions"
          value={`${openComps} / ${competitions.length} open`}
          icon={Trophy}
          color="bg-amber-500/20 text-amber-400"
          href="/admin/competitions"
        />
        <StatCard
          label="Events"
          value={`${activeEvents} / ${events.length} active`}
          icon={Calendar}
          color="bg-emerald-500/20 text-emerald-400"
          href="/admin/events"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-primary" />
            <h2 className="font-heading text-sm font-semibold text-foreground">Registrations by Competition</h2>
          </div>
          {compBreakdown.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {compBreakdown.map(({ name, count, open }) => {
                const max = Math.max(...compBreakdown.map((c) => c.count), 1)
                const pct = Math.round((count / max) * 100)
                return (
                  <div key={name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground truncate max-w-[180px]">{name}</span>
                      <div className="flex items-center gap-2">
                        {open ? (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" /> open
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <XCircle className="h-3 w-3" /> closed
                          </span>
                        )}
                        <span className="text-xs font-semibold text-foreground w-6 text-right">{count}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/60 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <h2 className="font-heading text-sm font-semibold text-foreground">Recent Registrations</h2>
            </div>
            <Link href="/admin/teams" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No registrations yet.</p>
          ) : (
            <div className="space-y-2">
              {recent.map((team) => (
                <div
                  key={team.team_id}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{team.team_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{team.competition}</p>
                  </div>
                  <div className="ml-3 flex-shrink-0 text-right">
                    <p className="text-xs text-muted-foreground">
                      {team.total_members} {team.total_members === 1 ? 'member' : 'members'}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                      {new Date(team.submitted_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
        <h2 className="font-heading text-sm font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/events"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-muted-foreground hover:bg-white/[0.08] hover:text-foreground transition-all"
          >
            <Calendar className="h-4 w-4" /> Create Event
          </Link>
          <Link
            href="/admin/competitions"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-muted-foreground hover:bg-white/[0.08] hover:text-foreground transition-all"
          >
            <Trophy className="h-4 w-4" /> Create Competition
          </Link>
          <Link
            href="/admin/teams"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-muted-foreground hover:bg-white/[0.08] hover:text-foreground transition-all"
          >
            <Users className="h-4 w-4" /> View All Teams
          </Link>
        </div>
      </div>
    </div>
  )
}
