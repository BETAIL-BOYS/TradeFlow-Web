import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Upload temporarily disabled' },
    { status: 503 }
  );
}
