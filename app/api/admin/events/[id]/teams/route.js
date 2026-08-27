import { NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Event } from '@/models/Event';
import { Competition } from '@/models/Competition';
import { Team } from '@/models/Team';

export async function GET(request, { params }) {
  const auth = requireAdminAuth(request);
  if (auth.error) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    await connectDB();

    const { id } = await params;
    const eventId = parseInt(id, 10);

    if (isNaN(eventId)) {
      return NextResponse.json(
        { success: false, error: 'invalid event id', code: 400 },
        { status: 400 }
      );
    }

    const event = await Event.findOne({ id: eventId }).lean();
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'event not found', code: 404 },
        { status: 404 }
      );
    }

    const comps = await Competition.find({ event_id: eventId }).lean();
    const compIds = comps.map((c) => c.id);
    const compMap = new Map(comps.map((c) => [c.id, c.name]));

    const teams = await Team.find({ competition_id: { $in: compIds } }).sort({ competition_id: 1, submitted_at: 1 }).lean();

    const mapped = teams.map((t) => ({
      team_id: t.id,
      team_name: t.team_name,
      competition_id: t.competition_id,
      competition: compMap.get(t.competition_id) || 'Unknown',
      total_members: t.total_members,
      submitted_at: t.submitted_at,
    }));

    return NextResponse.json({ teams: mapped, total: mapped.length });
  } catch (error) {
    console.error('GET /api/admin/events/[id]/teams error:', error);
    return NextResponse.json(
      { success: false, error: 'failed to fetch teams', code: 500 },
      { status: 500 }
    );
  }
}
