/**
 * Network Fee Indicator Component.
 * Fetches and displays the current Stellar network base fee (in stroops) 
 * with visual cues for congestion levels.
 */

"use client";

import React, { useState, useEffect } from 'react';
import { Fuel } from 'lucide-react';
import Icon from './Icon';

/**
 * Data structure for the network fee API response.
 */
interface FeeData {
  /** The base fee in stroops (1 XLM = 10,000,000 stroops) */
  baseFee: number;
  /** ISO timestamp of when the fee was last calculated */
  lastUpdated: string;
}

/**
 * A component that monitors and displays real-time Stellar network fees.
 * It polls the internal API every 15 seconds to stay up-to-date.
 */
export default function NetworkFeeIndicator() {
  const [feeData, setFeeData] = useState<FeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches the latest network fee data from the internal API.
   */
  const fetchNetworkFee = async () => {
    try {
      setError(null);
      // Fetch from the Next.js API route
      const res = await fetch('/api/v1/network/fees');

      if (!res.ok) {
        throw new Error('Failed to fetch network fees');
      }

      const data = await res.json();
      setFeeData(data);
    } catch (err) {
      console.error('Error fetching network fee:', err);
      setError('Failed to load fee');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch on mount
    fetchNetworkFee();

    // Setup periodic polling (15 seconds is standard for network changes)
    const interval = setInterval(fetchNetworkFee, 15000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  /**
   * Returns a Tailwind color class based on the fee level.
   * 
   * @param {number} baseFee - The fee in stroops.
   * @returns {string} The CSS class for the text color.
   */
  const getFeeColor = (baseFee: number) => {
    if (baseFee < 150) return 'text-emerald-400';      // Cheap/Low congestion
    if (baseFee < 300) return 'text-yellow-400';       // Moderate congestion
    return 'text-red-500';                             // High congestion
  };

  /**
   * Returns a human-readable label for the congestion level.
   * 
   * @param {number} baseFee - The fee in stroops.
   * @returns {string} The status label.
   */
  const getFeeLabel = (baseFee: number) => {
    if (baseFee < 150) return 'Optimized';
    if (baseFee < 300) return 'Moderate';
    return 'Congested';
  };

  // 1. Loading State UI
  if (loading && !feeData) {
    return (
<<<<<<< HEAD
      <div 
        className="flex items-center gap-1.5 text-xs text-slate-400"
        aria-label="Loading network fee"
      >
        <Fuel size={16} />
=======
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Icon icon={Fuel} dense />
>>>>>>> upstream/main
        <span>Loading fee...</span>
      </div>
    );
  }

  // 2. Error/Fallback State UI
  if (error || !feeData) {
    return (
<<<<<<< HEAD
      <div 
        className="flex items-center gap-1.5 text-xs text-red-400/80"
        role="alert"
      >
        <Fuel size={16} />
=======
      <div className="flex items-center gap-1.5 text-xs text-red-400">
        <Icon icon={Fuel} dense />
>>>>>>> upstream/main
        <span>Fee unavailable</span>
      </div>
    );
  }

  // 3. Main Data Display
  return (
<<<<<<< HEAD
    <div 
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/40 border border-slate-700 hover:border-slate-600 transition-all group cursor-default"
      title={`Current network fee: ${feeData.baseFee} stroops`}
    >
      <Fuel 
        size={16} 
        className={`transition-colors duration-300 ${getFeeColor(feeData.baseFee)}`} 
        aria-hidden="true"
=======
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors group">
      <Icon 
        icon={Fuel}
        dense
        className={`transition-colors ${getFeeColor(feeData.baseFee)}`} 
>>>>>>> upstream/main
      />
      <div className="flex items-baseline gap-1">
        <span 
          className={`font-mono text-sm font-semibold transition-colors duration-300 ${getFeeColor(feeData.baseFee)}`}
        >
          {feeData.baseFee}
        </span>
        <span className="text-[10px] text-slate-500 font-medium">stroops</span>
      </div>
      
      <div className="text-[10px] text-slate-500 hidden group-hover:inline-block ml-1 border-l border-slate-700 pl-2 transition-all">
        {getFeeLabel(feeData.baseFee)}
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======
// Inconsequential change for repo health

// Maintenance: minor update
>>>>>>> upstream/main
