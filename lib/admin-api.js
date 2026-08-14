/**
 * EntreVerse Admin API client
 * Every call sends Bearer token from sessionStorage.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL || '';

export const ADMIN_TOKEN_KEY = 'admin_token';
export const ADMIN_USER_KEY = 'admin_username';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function saveSession(token, username) {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  sessionStorage.setItem(ADMIN_USER_KEY, username);
}

export function clearSession() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_USER_KEY);
}

async function request(path, opts = {}, requireAuth = true) {
  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
  };

  if (requireAuth) {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data.error || `HTTP ${res.status}`;
    const err = Object.assign(new Error(msg), { status: res.status });
    throw err;
  }
  return data;
}

const get = (path) => request(path, { method: 'GET' });
const post = (path, body) =>
  request(path, { method: 'POST', body: JSON.stringify(body) });
const patch = (path, body) =>
  request(path, { method: 'PATCH', body: JSON.stringify(body) });

// ── Auth ───────────────────────────────────────────────────────────────────

export async function adminLogin(req) {
  return request('/api/admin/login', { method: 'POST', body: JSON.stringify(req) }, false);
}

// ── Events ─────────────────────────────────────────────────────────────────

export async function getEvents(activeOnly = false) {
  const qs = activeOnly ? '?active=true' : '';
  const data = await get(`/api/events${qs}`);
  return data.events;
}

export async function adminCreateEvent(req) {
  const data = await post('/api/admin/events', req);
  return data.event;
}

export async function adminUpdateEvent(id, req) {
  const data = await patch(`/api/admin/events/${id}`, req);
  return data.event;
}

// ── Competitions ───────────────────────────────────────────────────────────

export async function getCompetitions(openOnly = false) {
  const qs = openOnly ? '?open=true' : '';
  const data = await get(`/api/competitions${qs}`);
  return data.competitions;
}

export async function adminCreateCompetition(req) {
  const data = await post('/api/admin/competitions', req);
  return data.competition;
}

export async function adminUpdateCompetition(id, req) {
  const data = await patch(`/api/admin/competitions/${id}`, req);
  return data.competition;
}

// ── Teams / Registrations ──────────────────────────────────────────────────

export async function getAllTeams() {
  const data = await get('/api/admin/teams');
  return data.teams;
}

export async function getTeamsByCompetition(competitionId) {
  const data = await get(`/api/admin/competitions/${competitionId}/teams`);
  return data.teams;
}

export async function getTeamsByEvent(eventId) {
  const data = await get(`/api/admin/events/${eventId}/teams`);
  return data.teams;
}

export async function getTeamDetail(teamId) {
  return get(`/api/admin/teams/${teamId}`);
}
