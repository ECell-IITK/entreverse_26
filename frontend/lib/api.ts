/**
 * EntreVerse API client
 * All types mirror the Go model package exactly.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

// ── Types ──────────────────────────────────────────────────────────────────

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

export interface RegisterRequest {
  competition_id: number
  registration_code: string
  team_name: string
  comments?: string
  members: Member[]
}

export interface RegisterResponse {
  success: boolean
  message: string
  team_id?: number
}

export interface ErrorResponse {
  success: false
  error: string
  code?: number
}

// ── Helpers ────────────────────────────────────────────────────────────────

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: 'no-store' })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as ErrorResponse).error ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error((data as ErrorResponse).error ?? `HTTP ${res.status}`)
  }
  return data as T
}

// ── Public API ─────────────────────────────────────────────────────────────

/** Fetch all competitions for a given event slug, optionally only open ones. */
export async function getCompetitionsByEvent(
  eventSlug: string,
  openOnly = true,
): Promise<Competition[]> {
  const qs = openOnly ? '?open=true' : ''
  const data = await get<{ competitions: Competition[]; total: number }>(
    `/api/events/${eventSlug}/competitions${qs}`,
  )
  return data.competitions
}

/** Fetch all competitions (optionally open-only). */
export async function getCompetitions(openOnly = true): Promise<Competition[]> {
  const qs = openOnly ? '?open=true' : ''
  const data = await get<{ competitions: Competition[]; total: number }>(
    `/api/competitions${qs}`,
  )
  return data.competitions
}

/** Submit a registration. Throws with the backend error message on failure. */
export async function registerTeam(req: RegisterRequest): Promise<RegisterResponse> {
  return post<RegisterResponse>('/api/register', req)
}
