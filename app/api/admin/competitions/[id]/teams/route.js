import { NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Team } from '@/models/Team';
import { Competition } from '@/models/Competition';

export async function GET(request, { params }) {
  const auth = requireAdminAuth(request);
  if (auth.error) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    await connectDB();

    const { id } = await params;
    const compId = parseInt(id, 10);

    if (isNaN(compId)) {
      return NextResponse.json(
        { success: false, error: 'invalid competition id', code: 400 },
        { status: 400 }
      );
    }

    const comp = await Competition.findOne({ id: compId }).lean();
    if (!comp) {
      return NextResponse.json(
        { success: false, error: 'competition not found', code: 404 },
        { status: 404 }
      );
    }

    const teams = await Team.find({ competition_id: compId }).sort({ submitted_at: 1 }).lean();

    const mapped = teams.map((t) => ({
      team_id: t.id,
      team_name: t.team_name,
      competition_id: comp.id,
      competition: comp.name,
      total_members: t.total_members,
      submitted_at: t.submitted_at,
    }));

    return NextResponse.json({ teams: mapped, total: mapped.length });
  } catch (error) {
    console.error('GET /api/admin/competitions/[id]/teams error:', error);
    return NextResponse.json(
      { success: false, error: 'failed to fetch teams', code: 500 },
      { status: 500 }
    );
  }
}
