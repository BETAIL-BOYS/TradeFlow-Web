"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpDown, Settings, BarChart3, TrendingUp } from "lucide-react";
import TokenDropdown from "./TokenDropdown";
import SettingsModal from "./SettingsModal";
import { useSettings } from "../lib/context/SettingsContext";
import { dismissToast, showError, showLoading, showSuccess } from "../lib/toast";
import Icon from "./ui/Icon";

export default function SwapInterface() {
  const [fromToken, setFromToken] = useState("XLM");
  const [toToken, setToToken] = useState("USDC");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [priceImpact, setPriceImpact] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProMode, setIsProMode] = useState(false);
  const [isHighSlippageWarningOpen, setIsHighSlippageWarningOpen] = useState(false);
  const [isTradeReviewOpen, setIsTradeReviewOpen] = useState(false);
  const [isTransactionSignatureOpen, setIsTransactionSignatureOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStartTime, setSubmissionStartTime] = useState<number | null>(null);

  const { deadline, slippage: slippageTolerance } = useSettings();

  const calculatePriceImpact = (value: string): number => {
    if (!value || parseFloat(value) <= 0) return 0;
    // Mock price impact calculation
    const amount = parseFloat(value);
    return Math.min(amount * 0.01, 15); // 1% impact per unit, max 15%
  };

  const handleSwap = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    const impact = calculatePriceImpact(value);
    setPriceImpact(impact);

    if (value && parseFloat(value) > 0) {
      const mockRate = fromToken === "XLM" ? 0.15 : 6.67;
      setToAmount((parseFloat(value) * mockRate * (1 - impact / 100)).toFixed(6));
    } else {
      setToAmount("");
    }
  };

  const handleSwapClick = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      showError("Please enter an amount to swap");
      return;
    }

    if (priceImpact > 5) {
      setIsHighSlippageWarningOpen(true);
      return;
    }

    setIsTradeReviewOpen(true);
  };

  const handleTradeConfirm = async () => {
    setIsTradeReviewOpen(false);
    setIsSubmitting(true);
    setSubmissionStartTime(Date.now());

    try {
      // Generate mock transaction XDR
      const mockTransactionXDR = "AAAAAK/eFzA7Jf5Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3XAAAABQAAAAAAAAAAA==";
      console.log("Mock XDR generated:", mockTransactionXDR);

      setIsTransactionSignatureOpen(true);
    } catch {
      showError("Failed to submit trade");
      setIsSubmitting(false);
      setSubmissionStartTime(null);
    }
  };

  const handleHighSlippageConfirm = async () => {
    const loadingToast = showLoading("Processing high slippage swap...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1800));
      showSuccess("High slippage swap initiated successfully", { id: loadingToast });
      setIsTransactionSignatureOpen(true);
      setIsSubmitting(true);
      setSubmissionStartTime(Date.now());
    } catch {
      showError("Swap failed", { id: loadingToast });
    } finally {
      setIsHighSlippageWarningOpen(false);
    }
  };

  const handleTransactionSuccess = (_signedXDR: string) => {
    showSuccess("Transaction signed successfully!", {
      icon: "✅",
    });

    setIsTransactionSignatureOpen(false);
    setIsSubmitting(false);
    setSubmissionStartTime(null);
    setIsSuccessModalOpen(true);

    setTimeout(() => {
      setFromAmount("");
      setToAmount("");
      setPriceImpact(0);
    }, 1500);
  };

  const isAnyModalOpen = isSettingsOpen || isHighSlippageWarningOpen || isTradeReviewOpen || isSuccessModalOpen;
  const isSwapValid = fromAmount !== "" && parseFloat(fromAmount) > 0 && !isSubmitting;

  // Determine button state based on slippage tolerance
  const isSlippageExceeded = priceImpact > slippageTolerance;
  const buttonState = {
    disabled: !isSwapValid || isSlippageExceeded,
    text: isSlippageExceeded ? "Slippage Tolerance Exceeded" : "Swap",
    className: isSlippageExceeded
      ? "bg-slate-700 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  };

  // Dynamic Price Impact color logic
  const getPriceImpactColor = () => {
    if (priceImpact < 1) {
      return "text-emerald-400";
    } else if (priceImpact >= 1 && priceImpact < 3) {
      return "text-yellow-400";
    } else {
      return "text-red-500 font-bold";
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isAnyModalOpen) return;
      if (event.key === 'Enter' && isSwapValid) {
        event.preventDefault();
        void handleSwapClick();
      }
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        handleSwap();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnyModalOpen, isSwapValid]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Pro Mode Toggle */}
      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-4 rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isProMode ? "bg-blue-500/20 text-blue-400" : "bg-slate-700 text-slate-400"}`}>
              <Icon icon={BarChart3} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Pro Mode</h3>
              <p className="text-xs text-slate-400">Advanced charts & market data</p>
            </div>
          </div>
          <button
            onClick={() => setIsProMode(!isProMode)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${isProMode ? "bg-blue-600" : "bg-slate-600"}`}
          >
            <div
              className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${isProMode ? "translate-x-6" : "translate-x-0"}`}
            />
          </button>
        </div>
      </div>

      {/* Advanced Chart Area */}
      {isProMode && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-4 text-center">
            <div className="p-4 bg-blue-500/10 rounded-full text-blue-400 animate-pulse">
              <Icon icon={TrendingUp} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Advanced Chart Area</h3>
              <p className="text-slate-400 max-w-md">
                Real-time TradingView charts and liquidity depth analysis for professional traders.
              </p>
            </div>
            {/* Decorative Grid */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50" />
          </div>
        </div>
      )}

      {/* Main Swap Card */}
      <div className="bg-slate-800 rounded-3xl border border-slate-700 p-1 shadow-2xl relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Swap Tokens</h2>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-all transform hover:rotate-90"
            >
              <Icon icon={Settings} />
            </button>
          </div>

          {/* From Token */}
          <div className="mb-2 bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">From</label>
            <div className="flex gap-4 items-center">
              <TokenDropdown onTokenChange={setFromToken} />
              <input
                type="number"
                placeholder="0.00"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                className="flex-1 bg-transparent text-2xl font-bold text-white placeholder-slate-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="relative h-4 flex justify-center items-center z-10">
            <button
              onClick={handleSwap}
              className="bg-blue-600 hover:bg-blue-500 p-3 rounded-2xl transition-all shadow-xl shadow-blue-900/40 border-4 border-slate-800 transform hover:scale-110 active:scale-95"
            >
              <ArrowUpDown className="text-white" />
            </button>
          </div>

          {/* To Token */}
          <div className="mb-6 bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">To</label>
            <div className="flex gap-4 items-center">
              <TokenDropdown onTokenChange={setToToken} />
              <input
                type="number"
                placeholder="0.00"
                value={toAmount}
                readOnly
                className="flex-1 bg-transparent text-2xl font-bold text-white placeholder-slate-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Price Impact */}
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-sm text-slate-400">Price Impact</span>
            <span className={`text-sm font-medium ${getPriceImpactColor()}`}>
              {priceImpact.toFixed(2)}%
            </span>
          </div>

          {/* Transaction Info */}
          <div className="flex justify-between items-center mb-6 px-2">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Optimal Routing
            </div>
            <div className="text-sm font-medium text-slate-300 bg-slate-700/50 px-3 py-1.5 rounded-lg border border-slate-600/50">
              Deadline: <span className="text-blue-400">{deadline}m</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            className={`w-full ${buttonState.className} text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/20 text-lg`}
            disabled={buttonState.disabled}
            onClick={handleSwapClick}
          >
            {buttonState.text}
          </button>
        </div>
      </div>

      {/* Modals */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {isHighSlippageWarningOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-white mb-4">High Slippage Warning</h2>
            <p className="text-slate-400 mb-4">
              The price impact of {priceImpact.toFixed(2)}% exceeds your slippage tolerance of {slippageTolerance}%.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsHighSlippageWarningOpen(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleHighSlippageConfirm}
                className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
              >
                Swap Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {isTransactionSignatureOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-white mb-4">Transaction Signature</h2>
            <p className="text-slate-400 mb-4">Please sign the transaction in your wallet to proceed.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsTransactionSignatureOpen(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleTransactionSuccess("mock-xdr")}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Simulate Sign
              </button>
            </div>
          </div>
        </div>
      )}

      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-white mb-2">Swap Successful!</h2>
            <p className="text-slate-400 mb-4">Your trade has been executed successfully.</p>
            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isTradeReviewOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-white mb-4">Review Trade</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-400">From</span>
                <span className="text-white font-medium">{fromAmount} {fromToken}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">To</span>
                <span className="text-white font-medium">{toAmount} {toToken}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Price Impact</span>
                <span className={`font-medium ${getPriceImpactColor()}`}>{priceImpact.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fee</span>
                <span className="text-white font-medium">0.3%</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsTradeReviewOpen(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTradeConfirm}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
