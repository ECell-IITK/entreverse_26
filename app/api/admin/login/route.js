import { NextResponse } from 'next/server';
import { validateAdmin, issueToken } from '@/lib/auth';
import { checkRateLimit, getClientIp, sanitizeText } from '@/lib/security';

export async function POST(request) {
  try {
    const ip = getClientIp(request);

    // 1. Rate Limiting: Max 6 login attempts per minute per IP to block brute-force attacks
    const rateLimit = checkRateLimit(ip, 'admin-login', 6, 60 * 1000);
    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
      return NextResponse.json(
        {
          success: false,
          error: `Too many login attempts. Please wait ${retryAfter} seconds before retrying.`,
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

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload', code: 400 },
        { status: 400 }
      );
    }

    const { username, password } = body || {};

    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Username and password required', code: 400 },
        { status: 400 }
      );
    }

    const cleanUsername = sanitizeText(username, 60);

    // Length sanity checks
    if (cleanUsername.length < 2 || password.length < 4 || password.length > 128) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password', code: 401 },
        { status: 401 }
      );
    }

    const isValid = await validateAdmin(cleanUsername, password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password', code: 401 },
        { status: 401 }
      );
    }

    const token = issueToken(cleanUsername);
    const ttlHours = parseInt(process.env.JWT_TTL_HOURS || '8', 10);

    return NextResponse.json({
      success: true,
      token,
      username: cleanUsername,
      expires_in: ttlHours * 3600,
    });
  } catch (error) {
    console.error('POST /api/admin/login error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication service error', code: 500 },
      { status: 500 }
    );
  }
}
