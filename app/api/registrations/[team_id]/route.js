import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Team } from '@/models/Team';
import { Competition } from '@/models/Competition';
import { Event } from '@/models/Event';
import { checkRateLimit, getClientIp } from '@/lib/security';
import { verifyToken } from '@/lib/auth';

function maskEmail(email) {
  if (!email || !email.includes('@')) return '***@***.***';
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `${local[0]}*@${domain}`;
  return `${local[0]}***${local.slice(-1)}@${domain}`;
}

function maskPhone(phone) {
  if (!phone || phone.length < 4) return '******';
  return `******${phone.slice(-4)}`;
}

export async function GET(request, { params }) {
  try {
    const ip = getClientIp(request);

    // Rate Limiting: Max 30 lookups per minute per IP to block scraper harvesting
    const rateLimit = checkRateLimit(ip, 'team-receipt', 30, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many lookup requests. Please wait a moment.', code: 429 },
        { status: 429 }
      );
    }

    await connectDB();

    const { team_id } = await params;
    const numericTeamId = parseInt(team_id, 10);

    if (isNaN(numericTeamId) || numericTeamId <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid team_id format', code: 400 },
        { status: 400 }
      );
    }

    const team = await Team.findOne({ id: numericTeamId }).lean();
    if (!team) {
      return NextResponse.json(
        { success: false, error: 'Registration receipt not found', code: 404 },
        { status: 404 }
      );
    }

    // Check if requester is authenticated admin for full unmasked PII
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/, '');
    const isAdmin = Boolean(token && verifyToken(token));

    const comp = await Competition.findOne({ id: team.competition_id }).lean();
    const event = comp ? await Event.findOne({ id: comp.event_id }).lean() : null;

    return NextResponse.json({
      success: true,
      team_id: team.id,
      team_name: team.team_name,
      competition: comp ? comp.name : 'Unknown Competition',
      competition_slug: comp ? comp.slug : '',
      event: event ? event.name : 'EntreVerse 2026',
      total_members: team.total_members,
      comments: team.comments || '',
      submitted_at: team.submitted_at || team.created_at,
      members: (team.members || []).map((m) => ({
        name: m.name,
        roll_no: isAdmin ? m.roll_no : `${m.roll_no.slice(0, 3)}****`,
        email: isAdmin ? m.email : maskEmail(m.email),
        phone: isAdmin ? m.phone : maskPhone(m.phone),
        is_leader: m.is_leader,
      })),
    });
  } catch (error) {
    console.error('GET /api/registrations/[team_id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve registration receipt', code: 500 },
      { status: 500 }
    );
  }
}
