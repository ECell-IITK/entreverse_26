import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';
import { Competition } from '@/models/Competition';

export async function GET(request, { params }) {
  try {
    await connectDB();
    await ensureSeeded();

    const { slug } = await params;
    const competition = await Competition.findOne({ slug }).lean();

    if (!competition) {
      return NextResponse.json(
        { success: false, error: 'competition not found', code: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: competition.id,
      event_id: competition.event_id,
      name: competition.name,
      slug: competition.slug,
      description: competition.description || '',
      max_team_size: competition.max_team_size,
      min_team_size: competition.min_team_size,
      registration_open: competition.registration_open,
      created_at: competition.created_at,
    });
  } catch (error) {
    console.error('GET /api/competitions/slug/[slug] error:', error);
    return NextResponse.json(
      { success: false, error: 'failed to fetch competition', code: 500 },
      { status: 500 }
    );
  }
}
