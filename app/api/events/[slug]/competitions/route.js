import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';
import { Event } from '@/models/Event';
import { Competition } from '@/models/Competition';

export async function GET(request, { params }) {
  try {
    await connectDB();
    await ensureSeeded();

    const { slug } = await params;
    const event = await Event.findOne({ slug }).lean();

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'event not found', code: 404 },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const openOnly = searchParams.get('open') === 'true';

    const filter = { event_id: event.id };
    if (openOnly) {
      filter.registration_open = true;
    }

    const competitions = await Competition.find(filter).sort({ id: 1 }).lean();

    const mapped = competitions.map((c) => ({
      id: c.id,
      event_id: c.event_id,
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      max_team_size: c.max_team_size,
      min_team_size: c.min_team_size,
      registration_open: c.registration_open,
      created_at: c.created_at,
    }));

    return NextResponse.json({ competitions: mapped, total: mapped.length });
  } catch (error) {
    console.error('GET /api/events/[slug]/competitions error:', error);
    return NextResponse.json(
      { success: false, error: 'failed to fetch competitions', code: 500 },
      { status: 500 }
    );
  }
}
