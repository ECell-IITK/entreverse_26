import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';
import { Competition } from '@/models/Competition';
import { Team } from '@/models/Team';
import { getNextSequence } from '@/models/Counter';
import {
  checkRateLimit,
  getClientIp,
  sanitizeText,
  isValidEmail,
  isValidPhone,
  escapeRegex,
} from '@/lib/security';

export async function POST(request) {
  try {
    const ip = getClientIp(request);

    // 1. Rate Limiting: Max 12 team registration requests per 3 minutes per IP
    const rateLimit = checkRateLimit(ip, 'team-register', 12, 3 * 60 * 1000);
    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
      return NextResponse.json(
        {
          success: false,
          error: `Too many registration attempts from your network. Please wait ${retryAfter} seconds.`,
          code: 429,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
          },
        }
      );
    }

    await connectDB();
    await ensureSeeded();

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request payload', code: 400 },
        { status: 400 }
      );
    }

    const {
      competition_id,
      team_name,
      comments = '',
      members = [],
    } = body || {};

    // 2. Strict type & existence validation
    const numCompId = parseInt(competition_id, 10);
    if (isNaN(numCompId) || !team_name || typeof team_name !== 'string' || !Array.isArray(members)) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid registration parameters', code: 400 },
        { status: 400 }
      );
    }

    // 3. Sanitize and length check team name
    const cleanTeamName = sanitizeText(team_name, 60);
    if (cleanTeamName.length < 3 || cleanTeamName.length > 60) {
      return NextResponse.json(
        { success: false, error: 'Team name must be between 3 and 60 characters', code: 400 },
        { status: 400 }
      );
    }

    const cleanComments = sanitizeText(comments, 400);

    // 4. Fetch competition safely
    const comp = await Competition.findOne({ id: numCompId }).lean();
    if (!comp) {
      return NextResponse.json(
        { success: false, error: 'Selected competition not found', code: 404 },
        { status: 404 }
      );
    }

    // 5. Check if registration is open
    if (!comp.registration_open) {
      return NextResponse.json(
        { success: false, error: 'Registration is currently closed for this competition', code: 410 },
        { status: 410 }
      );
    }

    // 6. Team size limits check
    const count = members.length;
    if (count < comp.min_team_size || count > comp.max_team_size) {
      return NextResponse.json(
        {
          success: false,
          error: `Team size must be between ${comp.min_team_size} and ${comp.max_team_size} members`,
          code: 400,
        },
        { status: 400 }
      );
    }

    // 7. Exactly one leader check
    const leaders = members.filter((m) => m && m.is_leader);
    if (leaders.length !== 1) {
      return NextResponse.json(
        { success: false, error: 'Exactly one team member must be designated as team leader', code: 400 },
        { status: 400 }
      );
    }

    // 8. Strict validation of all team members
    const cleanMembers = [];
    const internalRollCheck = new Set();
    const internalEmailCheck = new Set();

    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m || typeof m !== 'object') {
        return NextResponse.json(
          { success: false, error: `Invalid details for member #${i + 1}`, code: 400 },
          { status: 400 }
        );
      }

      const name = sanitizeText(m.name, 60);
      const roll_no = sanitizeText(m.roll_no, 30);
      const email = sanitizeText(m.email, 100).toLowerCase();
      const phone = sanitizeText(m.phone, 20);

      if (!name || name.length < 2) {
        return NextResponse.json(
          { success: false, error: `Member #${i + 1} has an invalid or missing name`, code: 400 },
          { status: 400 }
        );
      }

      if (!roll_no || roll_no.length < 2) {
        return NextResponse.json(
          { success: false, error: `Member #${i + 1} has an invalid or missing roll number`, code: 400 },
          { status: 400 }
        );
      }

      if (!isValidEmail(email)) {
        return NextResponse.json(
          { success: false, error: `Member #${i + 1} has an invalid email address format`, code: 400 },
          { status: 400 }
        );
      }

      if (!isValidPhone(phone)) {
        return NextResponse.json(
          { success: false, error: `Member #${i + 1} has an invalid phone number`, code: 400 },
          { status: 400 }
        );
      }

      // Check intra-team duplicate roll numbers or emails
      if (internalRollCheck.has(roll_no.toLowerCase())) {
        return NextResponse.json(
          { success: false, error: `Duplicate roll number "${roll_no}" inside the same team`, code: 400 },
          { status: 400 }
        );
      }
      if (internalEmailCheck.has(email)) {
        return NextResponse.json(
          { success: false, error: `Duplicate email "${email}" inside the same team`, code: 400 },
          { status: 400 }
        );
      }

      internalRollCheck.add(roll_no.toLowerCase());
      internalEmailCheck.add(email);

      cleanMembers.push({
        member_order: i + 1,
        name,
        roll_no,
        email,
        phone,
        is_leader: Boolean(m.is_leader),
      });
    }

    // 9. Safe database uniqueness checks against injection & ReDoS
    const escapedTeamName = escapeRegex(cleanTeamName);
    const existingTeam = await Team.findOne({
      competition_id: numCompId,
      team_name: { $regex: new RegExp(`^${escapedTeamName}$`, 'i') },
    }).lean();

    if (existingTeam) {
      return NextResponse.json(
        { success: false, error: 'Team name is already registered for this competition', code: 409 },
        { status: 409 }
      );
    }

    const rollNos = cleanMembers.map((m) => m.roll_no);
    const emails = cleanMembers.map((m) => m.email);

    const dupRoll = await Team.findOne({
      competition_id: numCompId,
      'members.roll_no': { $in: rollNos },
    }).lean();

    if (dupRoll) {
      return NextResponse.json(
        {
          success: false,
          error: 'One or more roll numbers in your team are already registered for this competition',
          code: 409,
        },
        { status: 409 }
      );
    }

    const dupEmail = await Team.findOne({
      competition_id: numCompId,
      'members.email': { $in: emails },
    }).lean();

    if (dupEmail) {
      return NextResponse.json(
        {
          success: false,
          error: 'One or more email addresses in your team are already registered for this competition',
          code: 409,
        },
        { status: 409 }
      );
    }

    // 10. Generate sequential team_id & create Team atomically
    const teamId = await getNextSequence('teams');

    await Team.create({
      id: teamId,
      competition_id: numCompId,
      team_name: cleanTeamName,
      total_members: cleanMembers.length,
      comments: cleanComments,
      submitted_at: new Date(),
      members: cleanMembers,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Team registered successfully',
        team_id: teamId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/register error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration processing failed. Please try again.', code: 500 },
      { status: 500 }
    );
  }
}
