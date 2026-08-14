import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Team } from '@/models/Team';
import { Competition } from '@/models/Competition';
import { Event } from '@/models/Event';

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { team_id } = await params;
    const numericTeamId = parseInt(team_id, 10);

    if (isNaN(numericTeamId)) {
      return NextResponse.json(
        { success: false, error: 'invalid team_id', code: 400 },
        { status: 400 }
      );
    }

    const team = await Team.findOne({ id: numericTeamId }).lean();
    if (!team) {
      return NextResponse.json(
        { success: false, error: 'registration not found', code: 404 },
        { status: 404 }
      );
    }

    const comp = await Competition.findOne({ id: team.competition_id }).lean();
    const event = comp ? await Event.findOne({ id: comp.event_id }).lean() : null;

    return NextResponse.json({
      team_id: team.id,
      team_name: team.team_name,
      competition: comp ? comp.name : 'Unknown',
      competition_slug: comp ? comp.slug : '',
      event: event ? event.name : 'EntreVerse 2026',
      total_members: team.total_members,
      comments: team.comments || '',
      submitted_at: team.submitted_at,
      members: team.members.map((m) => ({
        name: m.name,
        roll_no: m.roll_no,
        email: m.email,
        phone: m.phone,
        is_leader: m.is_leader,
      })),
    });
  } catch (error) {
    console.error('GET /api/registrations/[team_id] error:', error);
    return NextResponse.json(
      { success: false, error: 'failed to fetch registration', code: 500 },
      { status: 500 }
    );
  }
}
