import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';
import { Event } from '@/models/Event';

export async function GET(request) {
  try {
    await connectDB();
    await ensureSeeded();

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    const filter = activeOnly ? { is_active: true } : {};
    const events = await Event.find(filter).sort({ id: 1 }).lean();

    const mapped = events.map((e) => ({
      id: e.id,
      name: e.name,
      slug: e.slug,
      description: e.description || '',
      is_active: e.is_active,
      created_at: e.created_at,
    }));

    return NextResponse.json({ events: mapped, total: mapped.length });
  } catch (error) {
    console.error('GET /api/events error:', error);
    return NextResponse.json(
      { success: false, error: 'failed to fetch events', code: 500 },
      { status: 500 }
    );
  }
}
