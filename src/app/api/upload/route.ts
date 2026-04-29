/**
 * Document Upload API Route.
 * Handles the secure uploading of invoice documents to IPFS/Pinata.
 * Currently disabled for maintenance or pending further security implementation.
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * POST handler for the upload endpoint.
 * Currently returns a 503 Service Unavailable error as the feature is locked.
 * 
 * @param {NextRequest} request - The incoming upload request.
 */
export async function POST(request: NextRequest) {
  // 1. Log the attempt for security auditing
  const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
  console.log(`[UploadAPI] Blocked upload attempt from ${clientIp}`);

  // 2. Return a consistent error response
  return NextResponse.json(
    { 
      error: 'Upload service temporarily disabled',
      reason: 'Undergoing maintenance',
      retryAfter: 3600 
    },
    { status: 503 }
  );
}

// Maintenance: minor update
