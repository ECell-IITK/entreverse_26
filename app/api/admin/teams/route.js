import { NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Team } from '@/models/Team';
import { Competition } from '@/models/Competition';

export async function GET(request) {
  const auth = requireAdminAuth(request);
  if (auth.error) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    await connectDB();

    const teams = await Team.find().sort({ submitted_at: -1 }).lean();
    const comps = await Competition.find().lean();
    const compMap = new Map(comps.map((c) => [c.id, c.name]));

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
    console.error('GET /api/admin/teams error:', error);
    return NextResponse.json(
      { success: false, error: 'failed to fetch teams', code: 500 },
      { status: 500 }
    );
  }
}
