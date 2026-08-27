import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';
import { Event } from '@/models/Event';

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

    return NextResponse.json({
      id: event.id,
      name: event.name,
      slug: event.slug,
      description: event.description || '',
      is_active: event.is_active,
      created_at: event.created_at,
    });
  } catch (error) {
    console.error('GET /api/events/[slug] error:', error);
    return NextResponse.json(
      { success: false, error: 'failed to fetch event', code: 500 },
      { status: 500 }
    );
  }
}
