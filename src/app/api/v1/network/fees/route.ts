import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '@/lib/rateLimit';

const MOCK_BASELINE_FEE = 100;
const MOCK_CURRENT_FEE = 350;

async function handler(request: NextRequest): Promise<NextResponse> {
  const shouldSimulateCongestion = request.nextUrl.searchParams.get('congested') === 'true';
  const estimatedTotal = shouldSimulateCongestion ? MOCK_CURRENT_FEE : MOCK_BASELINE_FEE;

  return NextResponse.json({
    estimatedTotal,
    minFee: 100,
    maxFee: 500,
    p50: 120,
    p95: shouldSimulateCongestion ? 400 : 180,
  });
}

export async function GET(request: NextRequest) {
  return withRateLimit(request, handler);
}

// Maintenance: minor update
