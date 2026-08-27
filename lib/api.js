/**
 * EntreVerse API client
 */

const BASE = process.env.NEXT_PUBLIC_API_URL || '';

async function get(path) {
  const res = await fetch(`${BASE}${path}`, { cache: 'no-store' });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return data;
}

/** Fetch all competitions for a given event slug, optionally only open ones. */
export async function getCompetitionsByEvent(eventSlug, openOnly = true) {
  const qs = openOnly ? '?open=true' : '';
  const data = await get(`/api/events/${eventSlug}/competitions${qs}`);
  return data.competitions;
}

/** Fetch all competitions (optionally open-only). */
export async function getCompetitions(openOnly = true) {
  const qs = openOnly ? '?open=true' : '';
  const data = await get(`/api/competitions${qs}`);
  return data.competitions;
}

/** Submit a registration. Throws with the backend error message on failure. */
export async function registerTeam(req) {
  return post('/api/register', req);
}
