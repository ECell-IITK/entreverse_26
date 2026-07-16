/**
 * EntreVerse Admin API client
 * All types mirror the Go model package exactly.
 * Every call sends Bearer token from sessionStorage.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

// ── Storage key ────────────────────────────────────────────────────────────

export const ADMIN_TOKEN_KEY = 'admin_token'
export const ADMIN_USER_KEY  = 'admin_username'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem(ADMIN_TOKEN_KEY)
}

export function saveSession(token: string, username: string): void {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token)
  sessionStorage.setItem(ADMIN_USER_KEY, username)
}

export function clearSession(): void {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY)
  sessionStorage.removeItem(ADMIN_USER_KEY)
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface AdminLoginRequest {
  username: string
  password: string
}

export interface AdminLoginResponse {
  success: boolean
  token: string
  username: string
  expires_in: number
}

export interface Event {
  id: number
  name: string
  slug: string
  description: string
  is_active: boolean
  created_at: string
}

export interface Competition {
  id: number
  event_id: number
  name: string
  slug: string
  description: string
  max_team_size: number
  min_team_size: number
  registration_open: boolean
  created_at: string
}

export interface Member {
  name: string
  roll_no: string
  email: string
  phone: string
  is_leader: boolean
}

export interface TeamSummary {
  team_id: number
  team_name: string
  competition_id: number
  competition: string
  total_members: number
  submitted_at: string
}

export interface RegistrationDetail {
  team_id: number
  team_name: string
  competition: string
  competition_slug: string
  event: string
  total_members: number
  comments?: string
  submitted_at: string
  members: Member[]
}

// Create/update payloads

export interface CreateEventRequest {
  name: string
  slug: string
  description: string
  is_active: boolean
}

export interface UpdateEventRequest {
  name: string
  description: string
  is_active: boolean
}

export interface CreateCompetitionRequest {
  event_id: number
  name: string
  slug: string
  description: string
  max_team_size: number
  min_team_size: number
  registration_open: boolean
  registration_code: string
}

export interface UpdateCompetitionRequest {
  name: string
  description: string
  max_team_size: number
  min_team_size: number
  registration_open: boolean
  registration_code?: string
}

export interface ErrorResponse {
  success: false
  error: string
  code?: number
}

// ── HTTP helpers ───────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  opts: RequestInit = {},
  requireAuth = true,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string>),
  }

  if (requireAuth) {
    const token = getToken()
    if (!token) throw new Error('Not authenticated')
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE}${path}`, { ...opts, headers })
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const msg = (data as ErrorResponse).error ?? `HTTP ${res.status}`
    // Bubble up 401 so consumers can redirect to login
    const err = Object.assign(new Error(msg), { status: res.status })
    throw err
  }
  return data as T
}

const get  = <T>(path: string) => request<T>(path, { method: 'GET' })
const post = <T>(path: string, body: unknown) =>
  request<T>(path, { method: 'POST', body: JSON.stringify(body) })
const patch = <T>(path: string, body: unknown) =>
  request<T>(path, { method: 'PATCH', body: JSON.stringify(body) })

// ── Auth ───────────────────────────────────────────────────────────────────

export async function adminLogin(req: AdminLoginRequest): Promise<AdminLoginResponse> {
  return request<AdminLoginResponse>(
    '/api/admin/login',
    { method: 'POST', body: JSON.stringify(req) },
    false,
  )
}

// ── Events ─────────────────────────────────────────────────────────────────

export async function getEvents(activeOnly = false): Promise<Event[]> {
  const qs = activeOnly ? '?active=true' : ''
  const data = await get<{ events: Event[]; total: number }>(`/api/events${qs}`)
  return data.events
}

export async function adminCreateEvent(req: CreateEventRequest): Promise<Event> {
  const data = await post<{ success: boolean; event: Event }>('/api/admin/events', req)
  return data.event
}

export async function adminUpdateEvent(id: number, req: UpdateEventRequest): Promise<Event> {
  const data = await patch<{ success: boolean; event: Event }>(`/api/admin/events/${id}`, req)
  return data.event
}

// ── Competitions ───────────────────────────────────────────────────────────

export async function getCompetitions(openOnly = false): Promise<Competition[]> {
  const qs = openOnly ? '?open=true' : ''
  const data = await get<{ competitions: Competition[]; total: number }>(`/api/competitions${qs}`)
  return data.competitions
}

export async function adminCreateCompetition(req: CreateCompetitionRequest): Promise<Competition> {
  const data = await post<{ success: boolean; competition: Competition }>(
    '/api/admin/competitions',
    req,
  )
  return data.competition
}

export async function adminUpdateCompetition(
  id: number,
  req: UpdateCompetitionRequest,
): Promise<Competition> {
  const data = await patch<{ success: boolean; competition: Competition }>(
    `/api/admin/competitions/${id}`,
    req,
  )
  return data.competition
}

// ── Teams / Registrations ──────────────────────────────────────────────────

export async function getAllTeams(): Promise<TeamSummary[]> {
  const data = await get<{ teams: TeamSummary[]; total: number }>('/api/admin/teams')
  return data.teams
}

export async function getTeamsByCompetition(competitionId: number): Promise<TeamSummary[]> {
  const data = await get<{ teams: TeamSummary[]; total: number }>(
    `/api/admin/competitions/${competitionId}/teams`,
  )
  return data.teams
}

export async function getTeamsByEvent(eventId: number): Promise<TeamSummary[]> {
  const data = await get<{ teams: TeamSummary[]; total: number }>(
    `/api/admin/events/${eventId}/teams`,
  )
  return data.teams
}

export async function getTeamDetail(teamId: number): Promise<RegistrationDetail> {
  return get<RegistrationDetail>(`/api/admin/teams/${teamId}`)
}
