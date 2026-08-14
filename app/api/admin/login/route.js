import { NextResponse } from 'next/server';
import { validateAdmin, issueToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'username and password required', code: 400 },
        { status: 400 }
      );
    }

    const isValid = await validateAdmin(username, password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'invalid username or password', code: 401 },
        { status: 401 }
      );
    }

    const token = issueToken(username);
    const ttlHours = parseInt(process.env.JWT_TTL_HOURS || '8', 10);

    return NextResponse.json({
      success: true,
      token,
      username,
      expires_in: ttlHours * 3600,
    });
  } catch (error) {
    console.error('POST /api/admin/login error:', error);
    return NextResponse.json(
      { success: false, error: 'could not process login', code: 500 },
      { status: 500 }
    );
  }
}
