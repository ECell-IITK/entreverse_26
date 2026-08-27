import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { requireAdminAuth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Competition } from '@/models/Competition';

export async function PATCH(request, { params }) {
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

    const comp = await Competition.findOne({ id: compId });
    if (!comp) {
      return NextResponse.json(
        { success: false, error: 'competition not found', code: 404 },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      max_team_size,
      min_team_size,
      registration_open,
      registration_code,
    } = body;

    if (min_team_size !== undefined && max_team_size !== undefined && min_team_size > max_team_size) {
      return NextResponse.json(
        { success: false, error: 'min_team_size cannot be greater than max_team_size', code: 400 },
        { status: 400 }
      );
    }

    if (name !== undefined) comp.name = name.trim();
    if (description !== undefined) comp.description = description.trim();
    if (max_team_size !== undefined) comp.max_team_size = max_team_size;
    if (min_team_size !== undefined) comp.min_team_size = min_team_size;
    if (registration_open !== undefined) comp.registration_open = Boolean(registration_open);
    if (registration_code) {
      comp.registration_code = await bcrypt.hash(registration_code, 10);
    }

    await comp.save();

    return NextResponse.json({
      success: true,
      competition: {
        id: comp.id,
        event_id: comp.event_id,
        name: comp.name,
        slug: comp.slug,
        description: comp.description,
        max_team_size: comp.max_team_size,
        min_team_size: comp.min_team_size,
        registration_open: comp.registration_open,
        created_at: comp.created_at,
      },
    });
  } catch (error) {
    console.error('PATCH /api/admin/competitions/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'failed to update competition', code: 500 },
      { status: 500 }
    );
  }
}
