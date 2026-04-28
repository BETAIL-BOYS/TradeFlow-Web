import { NextResponse } from 'next/server';

interface PnLData {
  date: string;
  value: number;
}

export async function GET() {
  // Generate dummy PnL data for the last 30 days
  const data: PnLData[] = [];
  const today = new Date();
  let currentValue = 10000; // Starting value
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Random walk with slight upward trend
    const change = (Math.random() - 0.45) * 200;
    currentValue += change;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.round(currentValue * 100) / 100
    });
  }

  return NextResponse.json(data);
}

// Maintenance: minor update
