import { NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Event } from '@/models/Event';
import { getNextSequence } from '@/models/Counter';

export async function POST(request) {
  const auth = requireAdminAuth(request);
  if (auth.error) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    await connectDB();

    const body = await request.json();
    const { name, slug, description = '', is_active = true } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'name and slug are required', code: 400 },
        { status: 400 }
      );
    }

    const existingSlug = await Event.findOne({ slug: slug.trim() });
    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: 'an event with that slug already exists', code: 409 },
        { status: 409 }
      );
    }

    const eventId = await getNextSequence('events');

    const newEvent = await Event.create({
      id: eventId,
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      is_active: Boolean(is_active),
    });

    return NextResponse.json(
      {
        success: true,
        event: {
          id: newEvent.id,
          name: newEvent.name,
          slug: newEvent.slug,
          description: newEvent.description,
          is_active: newEvent.is_active,
          created_at: newEvent.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/admin/events error:', error);
    return NextResponse.json(
      { success: false, error: 'failed to create event', code: 500 },
      { status: 500 }
    );
  }
}
