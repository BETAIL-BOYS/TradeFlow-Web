/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { POST, DELETE } from '../route';

function makeRequest(body: unknown, method = 'POST'): NextRequest {
  return new NextRequest('http://localhost/api/auth', {
    method,
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('POST /api/auth', () => {
  test('returns 200 and sets HttpOnly cookie for a valid token', async () => {
    const req = makeRequest({ token: 'eyJhbGciOiJIUzI1NiJ9.test' });
    const res = await POST(req);

    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.ok).toBe(true);

    const setCookie = res.headers.get('set-cookie');
    expect(setCookie).not.toBeNull();
    expect(setCookie).toContain('tradeflow_auth_token=');
    expect(setCookie?.toLowerCase()).toContain('httponly');
    expect(setCookie?.toLowerCase()).toContain('samesite=strict');
    expect(setCookie?.toLowerCase()).toContain('path=/');
  });

  test('returns 400 when token is missing', async () => {
    const req = makeRequest({});
    const res = await POST(req);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.message).toBe('Missing token');
  });

  test('returns 400 when token is an empty string', async () => {
    const req = makeRequest({ token: '   ' });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.message).toBe('Missing token');
  });

  test('returns 400 for invalid JSON body', async () => {
    const req = new NextRequest('http://localhost/api/auth', {
      method: 'POST',
      body: 'not-json',
      headers: { 'Content-Type': 'text/plain' },
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.message).toBe('Invalid JSON body');
  });
});

describe('DELETE /api/auth', () => {
  test('returns 200 and expires the auth cookie', async () => {
    const req = new NextRequest('http://localhost/api/auth', { method: 'DELETE' });
    const res = await DELETE(req);

    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.ok).toBe(true);

    const setCookie = res.headers.get('set-cookie');
    expect(setCookie).not.toBeNull();
    expect(setCookie).toContain('tradeflow_auth_token=');
    // maxAge=0 causes the browser to immediately expire/delete the cookie
    expect(setCookie?.toLowerCase()).toContain('max-age=0');
  });
});
