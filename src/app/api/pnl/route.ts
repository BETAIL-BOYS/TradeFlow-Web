/**
 * Profit and Loss (PnL) API Route.
 * Generates synthetic historical performance data for the dashboard charts.
 * This is used for demonstrating portfolio tracking features.
 */

import { NextResponse } from 'next/server';

/**
 * Historical data point for the PnL chart.
 */
interface PnLData {
  /** Localized date string (e.g., "Jan 12") */
  date: string;
  /** The portfolio value at that specific point in time */
  value: number;
}

/**
 * GET handler for the PnL endpoint.
 * Returns a 30-day series of simulated portfolio values.
 */
export async function GET() {
  // Generate mock PnL data for the last 30 days
  const data: PnLData[] = [];
  const today = new Date();
  
  // Starting seed value for the simulation
  let currentValue = 10000; 
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Simulate a random walk with a slight positive bias (0.45 instead of 0.50)
    // and a volatility factor of 200
    const change = (Math.random() - 0.45) * 200;
    currentValue += change;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.round(currentValue * 100) / 100
    });
  }

  // Return the series as a JSON response
  return NextResponse.json(data);
}

// Maintenance: minor update
