/**
 * Trade Review Modal Component.
 * Provides a final breakdown of trade parameters (amounts, impact, fees, routing) 
 * before the user signs the transaction in their wallet.
 */

"use client";

import React, { useState } from "react";
import { X, ArrowDown, Info, ShieldCheck, Zap } from "lucide-react";
import Card from "./Card";
import Button from "./ui/Button";
<<<<<<< HEAD
import WhaleConfetti from "./ui/WhaleConfetti";
=======
import WhaleConfetti from "./ui/WhaleConfetti";   // ← New import for confetti
import Icon from "./ui/Icon";
>>>>>>> upstream/main

/**
 * Props for the TradeReviewModal component.
 */
interface TradeReviewModalProps {
  /** Visibility toggle for the modal */
  isOpen: boolean;
  /** Callback to close/cancel the review */
  onClose: () => void;
  /** Callback triggered when the user confirms the trade */
  onConfirm: () => void;
  /** The numeric amount of the source asset */
  fromAmount: string;
  /** Symbol of the source asset (e.g., "XLM") */
  fromToken: string;
  /** The estimated amount of the destination asset */
  toAmount: string;
  /** Symbol of the destination asset (e.g., "USDC") */
  toToken: string;
  /** Calculated price impact as a percentage */
  priceImpact: number;
  /** Maximum slippage tolerance allowed for this trade */
  slippageTolerance: number;
  /** Estimated protocol fee for the swap */
  fee: string;
  /** Human-readable routing path (e.g., "XLM -> USDC") */
  route: string;
}

/**
 * A modal overlay for verifying trade details and initiating signing.
 */
export default function TradeReviewModal({
  isOpen,
  onClose,
  onConfirm,
  fromAmount,
  fromToken,
  toAmount,
  toToken,
  priceImpact,
  slippageTolerance,
  fee,
  route,
}: TradeReviewModalProps) {
  // --- Component State ---
  /** Controls the celebratory confetti for high-value trades */
  const [showConfetti, setShowConfetti] = useState(false);

  /**
   * Calculates the approximate USD value of the trade for analytics and UX.
   * 
   * @returns {number} The estimated USD value.
   */
  const calculateUSDValue = (): number => {
    const amount = parseFloat(fromAmount) || 0;
    
    // Mock conversion rates (TODO: Connect to a real-time price oracle)
    const mockRates: Record<string, number> = {
      'XLM': 0.12,
      'USDC': 1.00,
      'PYUSD': 1.00,
      'BTC': 62000,
      'ETH': 2500,
    };

    const rate = mockRates[fromToken] || 1.0;
    return amount * rate;
  };

  /**
   * Handles the confirmation action, checking for "whale" thresholds.
   */
  const handleConfirm = async () => {
    const usdValue = calculateUSDValue();

    // Trigger celebratory confetti for trades exceeding $10,000 USD
    if (usdValue > 10000) {
      setShowConfetti(true);
      console.log(`[TradeReview] Whale swap detected: $${usdValue.toLocaleString()}`);
    }

    // Initiate the transaction signing flow
    await onConfirm();
  };

  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };

  // 1. Conditional Rendering for Visibility
  if (!isOpen) return null;

  return (
    <>
      {/* Confetti celebration logic */}
      <WhaleConfetti 
        isActive={showConfetti} 
        onComplete={handleConfettiComplete} 
      />

      {/* Backdrop & Modal Container */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-title"
      >
        <Card className="w-full max-w-md border-slate-700/50 shadow-2xl overflow-hidden animate-in zoom-in duration-200">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
                <ShieldCheck size={20} />
              </div>
              <h2 id="review-title" className="text-xl font-black text-white tracking-tight uppercase">Review Trade</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
              aria-label="Close review"
            >
              <Icon icon={X} />
            </button>
          </div>

          <div className="space-y-6 mb-10">
            {/* Swap Visualization */}
            <div className="bg-slate-900/40 rounded-3xl p-6 border border-slate-800">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">You Pay</p>
                  <p className="text-2xl font-mono font-black text-white uppercase tracking-tighter">
                    {fromAmount} <span className="text-slate-400 font-bold">{fromToken}</span>
                  </p>
                </div>
              </div>

<<<<<<< HEAD
              <div className="flex justify-center my-4 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <div className="relative bg-slate-800 p-2 rounded-xl border border-slate-700 shadow-lg">
                  <ArrowDown size={14} className="text-blue-400" />
=======
              <div className="flex justify-center my-2">
                <div className="bg-slate-700 p-1.5 rounded-full border border-slate-600">
                  <Icon icon={ArrowDown} dense className="text-slate-300" />
>>>>>>> upstream/main
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">You Receive</p>
                  <p className="text-2xl font-mono font-black text-blue-400 uppercase tracking-tighter">
                    {toAmount} <span className="text-blue-500/50 font-bold">{toToken}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Parameter Breakdown */}
            <div className="space-y-4 px-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-slate-500">Price Impact</span>
                <span className={`${priceImpact > 5 ? "text-rose-400" : "text-slate-300"}`}>
                  {priceImpact.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-slate-500">Max Slippage</span>
                <span className="text-slate-300">{slippageTolerance}%</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-slate-500">Protocol Fee (0.3%)</span>
                <span className="text-slate-300 font-mono">{fee}</span>
              </div>
<<<<<<< HEAD
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-slate-500 flex items-center gap-1.5">
                  Network Cost <Info size={12} className="text-slate-600" />
=======
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Network Cost</span>
                <span className="text-slate-200 text-xs flex items-center gap-1">
                  ~0.00001 XLM <Icon icon={Info} dense className="text-slate-500" />
>>>>>>> upstream/main
                </span>
                <span className="text-slate-300 font-mono">~0.00001 XLM</span>
              </div>
              <div className="pt-4 mt-2 border-t border-slate-800 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Routing</span>
                <div className="flex items-center gap-1.5 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                  <Zap size={10} className="text-blue-400" />
                  <span className="text-blue-400 text-[10px] font-black font-mono">{route}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button 
              onClick={handleConfirm} 
              className="w-full py-4.5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-blue-500/20 active:scale-[0.98] transition-all"
            >
              Confirm & Sign in Wallet
            </Button>
            <button
              onClick={onClose}
              className="w-full py-2 text-[10px] font-black text-slate-500 hover:text-slate-300 uppercase tracking-[0.3em] transition-colors"
            >
              Cancel Trade
            </button>
          </div>
        </Card>
      </div>
    </>
  );
}
<<<<<<< HEAD
=======
// Inconsequential change for repo health

// Maintenance: minor update
>>>>>>> upstream/main
