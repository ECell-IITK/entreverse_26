import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { requireAdminAuth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Competition } from '@/models/Competition';
import { getNextSequence } from '@/models/Counter';

export async function POST(request) {
  const auth = requireAdminAuth(request);
  if (auth.error) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

  try {
    await connectDB();

    const body = await request.json();
    const {
      event_id,
      name,
      slug,
      description = '',
      max_team_size,
      min_team_size,
      registration_open = true,
      registration_code,
    } = body;

    if (!event_id || !name || !slug || !max_team_size || !min_team_size || !registration_code) {
      return NextResponse.json(
        { success: false, error: 'missing required competition fields', code: 400 },
        { status: 400 }
      );
    }

    if (min_team_size > max_team_size) {
      return NextResponse.json(
        { success: false, error: 'min_team_size cannot be greater than max_team_size', code: 400 },
        { status: 400 }
      );
    }

    const existingSlug = await Competition.findOne({ slug: slug.trim() });
    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: 'a competition with that slug already exists', code: 409 },
        { status: 409 }
      );
    }

    const codeHash = await bcrypt.hash(registration_code, 10);
    const compId = await getNextSequence('competitions');

    const newComp = await Competition.create({
      id: compId,
      event_id,
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      max_team_size,
      min_team_size,
      registration_open: Boolean(registration_open),
      registration_code: codeHash,
    });

    return NextResponse.json(
      {
        success: true,
        competition: {
          id: newComp.id,
          event_id: newComp.event_id,
          name: newComp.name,
          slug: newComp.slug,
          description: newComp.description,
          max_team_size: newComp.max_team_size,
          min_team_size: newComp.min_team_size,
          registration_open: newComp.registration_open,
          created_at: newComp.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/admin/competitions error:', error);
    return NextResponse.json(
      { success: false, error: 'failed to create competition', code: 500 },
      { status: 500 }
    );
  }
}
