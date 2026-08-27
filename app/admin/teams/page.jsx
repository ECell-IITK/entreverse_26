'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users, Search, Filter, ChevronDown, ChevronUp,
  Loader2, Crown, Mail, Phone, Hash, X, RefreshCw
} from 'lucide-react'
import {
  getAllTeams, getTeamsByCompetition, getTeamDetail, getCompetitions
} from '@/lib/admin-api'

function MemberRow({ member, idx }) {
  return (
    <div className={`flex items-start gap-3 rounded-xl p-3 ${member.is_leader ? 'bg-primary/10 border border-primary/20' : 'bg-white/[0.03]'}`}>
      <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${member.is_leader ? 'bg-primary/20 text-primary' : 'bg-white/10 text-muted-foreground'}`}>
        {member.is_leader ? <Crown className="h-3.5 w-3.5" /> : idx + 1}
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{member.name}</span>
          {member.is_leader && (
            <span className="text-[10px] font-semibold uppercase tracking-wide text-primary bg-primary/15 rounded-full px-2 py-0.5">Leader</span>
          )}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Hash className="h-3 w-3" />{member.roll_no}</span>
          <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{member.email}</span>
          <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{member.phone}</span>
        </div>
      </div>
    </div>
  )
}

function TeamRow({ team, expanded, onToggle }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)

  useEffect(() => {
    if (expanded && !detail && !loading) {
      setLoading(true)
      getTeamDetail(team.team_id)
        .then(setDetail)
        .catch((e) => setErr(e.message))
        .finally(() => setLoading(false))
    }
  }, [expanded, detail, loading, team.team_id])

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-4 py-3.5 text-left hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary text-xs font-bold">
          {team.total_members}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{team.team_name}</p>
          <p className="text-xs text-muted-foreground truncate">{team.competition}</p>
        </div>
        <div className="flex-shrink-0 text-right mr-2 hidden sm:block">
          <p className="text-xs text-muted-foreground">
            {new Date(team.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <p className="text-[10px] text-muted-foreground/60 mt-0.5">
            {new Date(team.submitted_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-white/[0.07] px-4 pb-4 pt-3 space-y-3">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading members…
            </div>
          )}
          {err && <p className="text-sm text-destructive">{err}</p>}
          {detail && (
            <>
              {detail.comments && (
                <div className="rounded-xl bg-white/[0.03] px-3 py-2">
                  <p className="text-xs text-muted-foreground mb-1">Comments</p>
                  <p className="text-sm text-foreground">{detail.comments}</p>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Members ({detail.members.length})
                </p>
                {detail.members.map((m, i) => (
                  <MemberRow key={m.roll_no} member={m} idx={i} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default function TeamsPage() {
  const router = useRouter()
  const [teams, setTeams] = useState([])
  const [competitions, setCompetitions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [filterCompId, setFilterCompId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [t, c] = await Promise.all([getAllTeams(), getCompetitions()])
      setTeams(t || [])
      setCompetitions(c || [])
    } catch (err) {
      if (err && err.status === 401) router.push('/admin/login')
      else setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { loadData() }, [loadData])

  useEffect(() => {
    if (filterCompId === null) {
      getAllTeams().then(setTeams).catch(() => {})
    } else {
      getTeamsByCompetition(filterCompId).then(setTeams).catch(() => {})
    }
  }, [filterCompId])

  const filtered = teams.filter((t) =>
    t.team_name.toLowerCase().includes(search.toLowerCase()) ||
    t.competition.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Teams</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {teams.length} registered team{teams.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-muted-foreground hover:bg-white/[0.08] hover:text-foreground transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search teams or competitions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
          <select
            value={filterCompId ?? ''}
            onChange={(e) => setFilterCompId(e.target.value ? Number(e.target.value) : null)}
            className="appearance-none rounded-xl border border-white/10 bg-white/[0.04] pl-9 pr-8 py-2.5 text-sm text-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer min-w-[180px]"
          >
            <option value="">All competitions</option>
            {competitions.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {(search || filterCompId) && (
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {teams.length} teams
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.02] py-16 text-center">
          <Users className="h-10 w-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">No teams found</p>
          {(search || filterCompId) && (
            <button
              onClick={() => { setSearch(''); setFilterCompId(null) }}
              className="mt-3 text-xs text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((team) => (
            <TeamRow
              key={team.team_id}
              team={team}
              expanded={expandedId === team.team_id}
              onToggle={() => setExpandedId(expandedId === team.team_id ? null : team.team_id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
