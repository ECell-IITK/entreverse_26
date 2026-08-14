import { NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Event } from '@/models/Event';

export async function PATCH(request, { params }) {
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

    const event = await Event.findOne({ id: eventId });
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'event not found', code: 404 },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description, is_active } = body;

    if (name !== undefined) event.name = name.trim();
    if (description !== undefined) event.description = description.trim();
    if (is_active !== undefined) event.is_active = Boolean(is_active);

    await event.save();

    return NextResponse.json({
      success: true,
      event: {
        id: event.id,
        name: event.name,
        slug: event.slug,
        description: event.description,
        is_active: event.is_active,
        created_at: event.created_at,
      },
    });
  } catch (error) {
    console.error('PATCH /api/admin/events/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'failed to update event', code: 500 },
      { status: 500 }
    );
  }
}
