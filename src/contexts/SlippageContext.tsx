/**
 * Slippage and Transaction Context.
 * Manages global trade constraints including slippage tolerance and 
 * transaction expiration deadlines.
 */

"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

/**
 * Shape of the Slippage context state and actions.
 */
interface SlippageContextType {
  /** Maximum price change allowed between submission and execution (percentage) */
  slippageTolerance: number;
  /** Updates the slippage tolerance value */
  setSlippageTolerance: (value: number) => void;
  /** True if the protocol should automatically determine optimal slippage */
  isSlippageAuto: boolean;
  /** Toggles the automatic slippage logic */
  setIsSlippageAuto: (value: boolean) => void;
  /** Time in minutes before a pending transaction is considered expired */
  transactionDeadline: number;
  /** Updates the transaction expiration deadline */
  setTransactionDeadline: (value: number) => void;
}

/** Internal context object for slippage settings */
const SlippageContext = createContext<SlippageContextType | undefined>(undefined);

/**
 * Provider component that wraps the application to provide slippage settings.
 */
export function SlippageProvider({ children }: { children: ReactNode }) {
  // --- State Initialization ---
  /** Defaults to 0.5% - a safe standard for most high-liquidity assets */
  const [slippageTolerance, setSlippageTolerance] = useState(0.5);
  /** Defaults to true to simplify the UX for new users */
  const [isSlippageAuto, setIsSlippageAuto] = useState(true);
  /** Defaults to 20 minutes - standard for Stellar network congestion */
  const [transactionDeadline, setTransactionDeadline] = useState(20);

  /**
   * Effect: Persist settings to localStorage to maintain preferences across sessions.
   */
  useEffect(() => {
    const savedSlippage = localStorage.getItem('tradeflow_slippage');
    const savedDeadline = localStorage.getItem('tradeflow_deadline');
    
    if (savedSlippage) setSlippageTolerance(parseFloat(savedSlippage));
    if (savedDeadline) setTransactionDeadline(parseInt(savedDeadline));
  }, []);

  /**
   * Effect: Save to localStorage whenever values change.
   */
  useEffect(() => {
    localStorage.setItem('tradeflow_slippage', slippageTolerance.toString());
    localStorage.setItem('tradeflow_deadline', transactionDeadline.toString());
  }, [slippageTolerance, transactionDeadline]);

  return (
    <SlippageContext.Provider value={{
      slippageTolerance,
      setSlippageTolerance,
      isSlippageAuto,
      setIsSlippageAuto,
      transactionDeadline,
      setTransactionDeadline
    }}>
      {children}
    </SlippageContext.Provider>
  );
}

/**
 * Custom hook for accessing the slippage context.
 * 
 * @returns {SlippageContextType} The current context value.
 * @throws {Error} If used outside of a SlippageProvider.
 */
export function useSlippage() {
  const context = useContext(SlippageContext);
  if (context === undefined) {
    console.error('[useSlippage] Attempted to access context outside of SlippageProvider.');
    throw new Error('useSlippage must be used within a SlippageProvider');
  }
  return context;
}

<<<<<<< HEAD
=======
// Inconsequential change for repo health

// Maintenance: minor update
>>>>>>> upstream/main
