import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';
import { Competition } from '@/models/Competition';
import { Team } from '@/models/Team';
import { getNextSequence } from '@/models/Counter';

export async function POST(request) {
  try {
    await connectDB();
    await ensureSeeded();

    const body = await request.json();
    const {
      competition_id,
      team_name,
      comments = '',
      members = [],
    } = body;

    // 1. Basic validation
    if (!competition_id || !team_name || !members || !Array.isArray(members)) {
      return NextResponse.json(
        { success: false, error: 'missing required registration fields', code: 400 },
        { status: 400 }
      );
    }

    const trimmedTeamName = team_name.trim();
    if (trimmedTeamName.length < 3 || trimmedTeamName.length > 150) {
      return NextResponse.json(
        { success: false, error: 'team name must be between 3 and 150 characters', code: 400 },
        { status: 400 }
      );
    }

    // 2. Fetch competition
    const comp = await Competition.findOne({ id: competition_id }).lean();
    if (!comp) {
      return NextResponse.json(
        { success: false, error: 'competition not found', code: 404 },
        { status: 404 }
      );
    }

    // 3. Check if registration is open
    if (!comp.registration_open) {
      return NextResponse.json(
        { success: false, error: 'registration is closed for this competition', code: 410 },
        { status: 410 }
      );
    }

    // 4. Team size validation
    const count = members.length;
    if (count < comp.min_team_size || count > comp.max_team_size) {
      return NextResponse.json(
        {
          success: false,
          error: `team size must be between ${comp.min_team_size} and ${comp.max_team_size} members`,
          code: 400,
        },
        { status: 400 }
      );
    }

    // 5. Exactly one leader check
    const leaders = members.filter((m) => m.is_leader);
    if (leaders.length !== 1) {
      return NextResponse.json(
        { success: false, error: 'exactly one member must be marked as leader', code: 400 },
        { status: 400 }
      );
    }

    // 6. Validate each member format
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.name || !m.roll_no || !m.email || !m.phone) {
        return NextResponse.json(
          { success: false, error: `member #${i + 1} has incomplete details`, code: 400 },
          { status: 400 }
        );
      }
    }

    // 7. Check duplicate team name in this competition
    const existingTeam = await Team.findOne({
      competition_id,
      team_name: { $regex: new RegExp(`^${trimmedTeamName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
    }).lean();

    if (existingTeam) {
      return NextResponse.json(
        { success: false, error: 'team name already registered for this competition', code: 409 },
        { status: 409 }
      );
    }

    // 8. Check duplicate roll numbers & emails in this competition
    const rollNos = members.map((m) => m.roll_no.trim());
    const emails = members.map((m) => m.email.trim().toLowerCase());

    const dupRoll = await Team.findOne({
      competition_id,
      'members.roll_no': { $in: rollNos },
    }).lean();

    if (dupRoll) {
      return NextResponse.json(
        {
          success: false,
          error: 'a roll number in your team is already registered for this competition',
          code: 409,
        },
        { status: 409 }
      );
    }

    const dupEmail = await Team.findOne({
      competition_id,
      'members.email': { $in: emails },
    }).lean();

    if (dupEmail) {
      return NextResponse.json(
        {
          success: false,
          error: 'an email address in your team is already registered for this competition',
          code: 409,
        },
        { status: 409 }
      );
    }

    // 9. Generate sequential team_id & create Team
    const teamId = await getNextSequence('teams');

    const formattedMembers = members.map((m, idx) => ({
      member_order: idx + 1,
      name: m.name.trim(),
      roll_no: m.roll_no.trim(),
      email: m.email.trim().toLowerCase(),
      phone: m.phone.trim(),
      is_leader: Boolean(m.is_leader),
    }));

    await Team.create({
      id: teamId,
      competition_id,
      team_name: trimmedTeamName,
      total_members: formattedMembers.length,
      comments: comments ? comments.trim() : '',
      submitted_at: new Date(),
      members: formattedMembers,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'team registered successfully',
        team_id: teamId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/register error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'registration failed: internal error', code: 500 },
      { status: 500 }
    );
  }
}
