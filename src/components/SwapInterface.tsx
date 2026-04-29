<<<<<<< HEAD
/**
 * Swap Interface Component.
 * Provides a decentralized exchange (DEX) style interface for swapping 
 * Stellar assets. Includes slippage control, price impact estimation, 
 * and transaction status monitoring.
 */

"use client";

=======
>>>>>>> upstream/main
import React, { useState, useEffect } from "react";
import { ArrowUpDown, Settings, BarChart3, LineChart, TrendingUp } from "lucide-react";
import TokenDropdown from "./TokenDropdown";
import SettingsModal from "./SettingsModal";
import { useSettings } from "../lib/context/SettingsContext";
import { dismissToast, showError, showLoading, showSuccess } from "../lib/toast";
import { useSigningActions } from "../stores/signatureStore";
import Icon from "./ui/Icon";

/**
 * Main component for the token swap functionality.
 */
export default function SwapInterface() {
  // --- Token Selection State ---
  /** The asset code of the token being sold */
  const [fromToken, setFromToken] = useState("XLM");
  /** The asset code of the token being bought */
  const [toToken, setToToken] = useState("USDC");
  
  // --- UI Visibility State ---
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
<<<<<<< HEAD
  const [isHighSlippageWarningOpen, setIsHighSlippageWarningOpen] = useState(false);
  const [isTradeReviewOpen, setIsTradeReviewOpen] = useState(false);
  const [isTransactionSignatureOpen, setIsTransactionSignatureOpen] = useState(false);
  /** Visibility for the post-trade growth/share modal */
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // --- Trade Value State ---
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  /** Estimated price impact as a percentage */
  const [priceImpact, setPriceImpact] = useState(0);
  /** Mock balance for the selected source token */
  const [fromBalance] = useState("1240.50");

  // --- Submission & Timing State ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStartTime, setSubmissionStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");

  // --- Context Hooks ---
  const { slippageTolerance, transactionDeadline } = useSlippage();

  /**
   * Countdown timer effect for transaction expiry.
   * Runs when a transaction is pending submission.
   */
  useEffect(() => {
    let interval: any;
    if (isSubmitting && submissionStartTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - submissionStartTime) / 1000);
        const totalSeconds = transactionDeadline * 60;
        const remaining = totalSeconds - elapsed;

        if (remaining <= 0) {
          clearInterval(interval);
          setIsSubmitting(false);
          setIsTransactionSignatureOpen(false);
          setIsTradeReviewOpen(false);
          setSubmissionStartTime(null);
          toast.error("Transaction Expired", { duration: 5000 });
        } else {
          const minutes = Math.floor(remaining / 60);
          const seconds = remaining % 60;
          setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSubmitting, submissionStartTime, transactionDeadline]);

  /**
   * Persists token selections across page reloads.
   */
  useEffect(() => {
    const savedFromToken = localStorage.getItem('tradeflow-fromToken');
    const savedToToken = localStorage.getItem('tradeflow-toToken');

    if (savedFromToken) setFromToken(savedFromToken);
    if (savedToToken) setToToken(savedToToken);
  }, []);

  useEffect(() => {
    localStorage.setItem('tradeflow-fromToken', fromToken);
  }, [fromToken]);

  useEffect(() => {
    localStorage.setItem('tradeflow-toToken', toToken);
  }, [toToken]);

  /**
   * Estimates the price impact based on the input amount.
   * This is a simplified mock for development purposes.
   * 
   * @param {string} amount - The numeric amount string.
   * @returns {number} The calculated percentage impact.
   */
  const calculatePriceImpact = (amount: string) => {
    if (!amount || parseFloat(amount) <= 0) return 0;
    const baseImpact = Math.min(parseFloat(amount) * 0.01, 15);
    const tokenMultiplier = fromToken === "XLM" ? 1.2 : 1.0;
    return baseImpact * tokenMultiplier;
  };
=======
  const [isProMode, setIsProMode] = useState(false);

  const { deadline } = useSettings();
>>>>>>> upstream/main

  /**
   * Swaps the 'from' and 'to' tokens and their amounts.
   */
  const handleSwap = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  /**
   * Updates the source amount and recalculates the destination amount and price impact.
   * 
   * @param {string} value - The new input amount.
   */
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    const impact = calculatePriceImpact(value);
    setPriceImpact(impact);

    if (value && parseFloat(value) > 0) {
      // Mock exchange rate logic
      const mockRate = fromToken === "XLM" ? 0.15 : 6.67;
      setToAmount((parseFloat(value) * mockRate * (1 - impact / 100)).toFixed(6));
    } else {
      setToAmount("");
    }
  };

  /**
   * Initiates the swap flow, validating inputs and checking for high slippage.
   */
  const handleSwapClick = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      showError("Please enter an amount to swap");
      return;
    }

<<<<<<< HEAD
    const loadingToast = toast.loading("Processing swap calculation...");
=======
    const loadingToast = showLoading("Processing swap...");
>>>>>>> upstream/main

    try {
      // Threshold check for high slippage warning
      if (priceImpact > 5) {
        setIsHighSlippageWarningOpen(true);
        dismissToast(loadingToast);
        return;
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

<<<<<<< HEAD
      toast.success(`Trade calculated: ${fromAmount} ${fromToken} → ${toAmount} ${toToken}`, {
=======
      showSuccess(`Swapped ${fromAmount} ${fromToken} → ${toAmount} ${toToken}`, {
>>>>>>> upstream/main
        id: loadingToast,
      });

      setIsTradeReviewOpen(true);
    } catch (error) {
<<<<<<< HEAD
      toast.error("Failed to calculate trade parameters", {
=======
      showError("Failed to process swap", {
>>>>>>> upstream/main
        id: loadingToast,
      });
    }
  };

  /**
   * Confirms the trade and prepares the transaction for signing.
   */
  const handleTradeConfirm = async () => {
    setIsTradeReviewOpen(false);
    setIsSubmitting(true);
    setSubmissionStartTime(Date.now());

    try {
      // Simulate transaction building time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock transaction XDR for demonstration
      const mockTransactionXDR = "AAAAAK/eFzA7Jf5Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3XAAAABQAAAAAAAAAAA==";
      console.log("[SwapInterface] Mock XDR generated:", mockTransactionXDR);

      setIsTransactionSignatureOpen(true);
    } catch (error) {
<<<<<<< HEAD
      toast.error("Failed to prepare transaction");
=======
      showError("Failed to submit trade");
>>>>>>> upstream/main
      setIsSubmitting(false);
      setSubmissionStartTime(null);
    }
  };

  /**
   * Handles confirmation from the high slippage warning modal.
   */
  const handleHighSlippageConfirm = async () => {
    const loadingToast = showLoading("Processing high slippage swap...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1800));
      showSuccess("High slippage swap initiated successfully", { id: loadingToast });
      setIsTransactionSignatureOpen(true);
      setIsSubmitting(true);
      setSubmissionStartTime(Date.now());
    } catch (error) {
      showError("Swap failed", { id: loadingToast });
    } finally {
      setIsHighSlippageWarningOpen(false);
    }
  };

  /**
   * Callback for when the user successfully signs the transaction.
   * 
   * @param {string} signedXDR - The base64 signed transaction XDR.
   */
  const handleTransactionSuccess = (signedXDR: string) => {
    console.log("[SwapInterface] Transaction signed:", signedXDR);

<<<<<<< HEAD
    toast.success("Trade executed successfully!", {
      icon: "🚀",
=======
    showSuccess("Transaction signed successfully!", {
      icon: "✅",
>>>>>>> upstream/main
    });

    setIsTransactionSignatureOpen(false);
    setIsSubmitting(false);
    setSubmissionStartTime(null);

    // Show the post-trade share/growth modal
    setIsSuccessModalOpen(true);

    // Reset form after a short delay
    setTimeout(() => {
      setFromAmount("");
      setToAmount("");
      setPriceImpact(0);
    }, 1500);
  };


  const isAnyModalOpen = isSettingsOpen || isHighSlippageWarningOpen || isTradeReviewOpen || isSuccessModalOpen;
  const isSwapValid = fromAmount && parseFloat(fromAmount) > 0 && !isSubmitting;

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
      return "text-emerald-400"; // Green for low impact (< 1%)
    } else if (priceImpact >= 1 && priceImpact < 3) {
      return "text-yellow-400"; // Yellow for medium impact (1% - 3%)
    } else {
      return "text-red-500 font-bold"; // Red for high impact (>= 3%)
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isAnyModalOpen) return;
      if (event.key === 'Enter' && isSwapValid) {
        event.preventDefault();
        handleSwapClick();
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
      <div className="flex justify-between items-center bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-4 rounded-2xl">
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
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${isProMode ? "bg-blue-600" : "bg-slate-600"
            }`}
        >
          <div
            className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${isProMode ? "translate-x-6" : "translate-x-0"
              }`}
          />
        </button>

        {/* Advanced Chart Area (Issue #83) */}
        {isProMode && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center gap-4 text-center">
              <div className="p-4 bg-blue-500/10 rounded-full text-blue-400 animate-pulse">
                <TrendingUp size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Advanced Chart Area</h3>
                <p className="text-slate-400 max-w-md">
                  Real-time TradingView charts and liquidity depth analysis for professional traders.
                </p>
              </div>
      {/* Advanced Chart Area (Issue #83) */}
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
                <Settings size={20} />
              </button>
          {/* Decorative Grid */}
          <div className="absolute bottom-0 left-0 w-full h-24 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50" />
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
                className="flex-1 bg-transparent text-2xl font-bold text-white placeholder-slate-600 focus:outline-none"
              />
            </div>

            {/* From Token */}
            <div className="mb-2 bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">From</label>
              <div className="flex gap-4 items-center">
                <TokenDropdown onTokenChange={setFromToken} />
                <input
                  type="number"
                  placeholder="0.00"
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

            {/* Swap Button */}
            <div className="relative h-4 flex justify-center items-center z-10">
              <button
                onClick={handleSwap}
                className="bg-blue-600 hover:bg-blue-500 p-3 rounded-2xl transition-all shadow-xl shadow-blue-900/40 border-4 border-slate-800 transform hover:scale-110 active:scale-95"
              >
                <ArrowUpDown size={20} className="text-white" />
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
                  className="flex-1 bg-transparent text-2xl font-bold text-white placeholder-slate-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Transaction Info (Issue #74) */}
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
            <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/20 text-lg">
              Swap Assets
            </button>
          </div>
        </Card>

        {/* Modals */}
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

        <HighSlippageWarning
          isOpen={isHighSlippageWarningOpen}
          onClose={() => setIsHighSlippageWarningOpen(false)}
          onConfirm={handleHighSlippageConfirm}
          priceImpact={priceImpact}
        />

        <TransactionSignatureModal
          isOpen={isTransactionSignatureOpen}
          onClose={() => setIsTransactionSignatureOpen(false)}
          onSuccess={handleTransactionSuccess}
          transactionXDR="AAAAAK/eFzA7Jf5Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3XAAAABQAAAAAAAAAAA=="
          networkFee="0.00001"
          contractAddress="CC7H5QY7F3JQZJQZJQZJQZJQZJQZJQZJQZJQZJQZJQZJQZJQZJQZJQ"
        />

        <TradeReviewModal
          isOpen={isTradeReviewOpen}
          onClose={() => setIsTradeReviewOpen(false)}
          onConfirm={handleTradeConfirm}
          fromAmount={fromAmount}
          fromToken={fromToken}
          toAmount={toAmount}
          toToken={toToken}
          priceImpact={priceImpact}
          slippageTolerance={slippageTolerance}
          fee="0.3%"
          route={`${fromToken} → ${toToken}`}
        />

        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </div>
      );
          {/* Action Button */}
          <button 
            className={`w-full ${buttonState.className} text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/20 text-lg`}
            disabled={buttonState.disabled}
          >
            {buttonState.text}
          </button>
        </div>
      </div>

      {/* Modals */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      <HighSlippageWarning
        isOpen={isHighSlippageWarningOpen}
        onClose={() => setIsHighSlippageWarningOpen(false)}
        onConfirm={handleHighSlippageConfirm}
        priceImpact={priceImpact}
      />

      <TransactionSignatureModal
        isOpen={isTransactionSignatureOpen}
        onClose={() => setIsTransactionSignatureOpen(false)}
        onSuccess={handleTransactionSuccess}
        transactionXDR="AAAAAK/eFzA7Jf5Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3Xf3XAAAABQAAAAAAAAAAA=="
        networkFee="0.00001"
        contractAddress="CC7H5QY7F3JQZJQZJQZJQZJQZJQZJQZJQZJQZJQZJQZJQZJQZJQZJQ"
      />

      <TradeReviewModal
        isOpen={isTradeReviewOpen}
        onClose={() => setIsTradeReviewOpen(false)}
        onConfirm={handleTradeConfirm}
        fromAmount={fromAmount}
        fromToken={fromToken}
        toAmount={toAmount}
        toToken={toToken}
        priceImpact={priceImpact}
        slippageTolerance={slippageTolerance}
        fee="0.3%"
        route={`${fromToken} → ${toToken}`}
      />

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
// Inconsequential change for repo health

// Maintenance: minor update
