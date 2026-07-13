import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory IP cache for rate limiting
const ipCache = new Map<string, number[]>();

type LimiterType = 'standard' | 'submission';

/**
 * A lightweight, dependency-free in-memory sliding window rate limiter.
 * This replaces Upstash Redis dependencies so the application remains functional
 * out-of-the-box in local and containerized environments.
 */
export async function withRateLimit(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>,
  type: LimiterType = 'standard'
): Promise<NextResponse> {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1';

  const now = Date.now();
  const limit = type === 'submission' ? 5 : 20;
  const windowMs = 60 * 1000; // 1 minute window

  let timestamps = ipCache.get(ip) || [];

  // Filter out timestamps outside the current sliding window
  timestamps = timestamps.filter((t) => now - t < windowMs);

  if (timestamps.length >= limit) {
    const oldest = timestamps[0];
    const reset = oldest + windowMs;
    const retryAfter = Math.ceil((reset - now) / 1000);

    return NextResponse.json(
      { error: 'Too Many Requests', message: 'Rate limit exceeded. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(reset),
        },
      }
    );
  }

  // Record request timestamp
  timestamps.push(now);
  ipCache.set(ip, timestamps);

  const response = await handler(req);

  // Set rate limiting headers on response
  response.headers.set('X-RateLimit-Limit', String(limit));
  response.headers.set('X-RateLimit-Remaining', String(limit - timestamps.length));
  response.headers.set('X-RateLimit-Reset', String(now + windowMs));

  return response;
}
