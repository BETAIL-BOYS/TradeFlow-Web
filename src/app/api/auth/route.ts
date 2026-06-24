import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'tradeflow_auth_token';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  // 24-hour session lifetime
  maxAge: 60 * 60 * 24,
};

/**
 * POST /api/auth
 * Accepts a JWT in the request body and sets it as a secure HttpOnly cookie.
 * The cookie is inaccessible to JavaScript, eliminating XSS token theft.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  let token: string | undefined;

  try {
    const body = await request.json();
    token = typeof body?.token === 'string' ? body.token.trim() : undefined;
  } catch {
    return NextResponse.json({ error: { message: 'Invalid JSON body' } }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ error: { message: 'Missing token' } }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true }, { status: 200 });
  response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
  return response;
}

/**
 * DELETE /api/auth
 * Clears the auth cookie, effectively logging the user out.
 */
export async function DELETE(_request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.json({ ok: true }, { status: 200 });
  response.cookies.set(COOKIE_NAME, '', { ...COOKIE_OPTIONS, maxAge: 0 });
  return response;
}
