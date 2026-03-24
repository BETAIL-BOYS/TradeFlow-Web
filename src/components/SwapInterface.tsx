"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpDown, Settings } from "lucide-react";
import TokenDropdown from "./TokenDropdown";
import SettingsModal from "./SettingsModal";
import HighSlippageWarning from "./HighSlippageWarning";
import { useSlippage } from "../contexts/SlippageContext";
import Card from "./Card";
import Button from "./ui/Button";
import Tooltip from "./ui/Tooltip";

export default function SwapInterface() {
  const [fromToken, setFromToken] = useState("XLM");
  const [toToken, setToToken] = useState("USDC");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHighSlippageWarningOpen, setIsHighSlippageWarningOpen] = useState(false);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [priceImpact, setPriceImpact] = useState(0);
  const { slippageTolerance } = useSlippage();

  // Load saved token selections on mount
  useEffect(() => {
    const savedFromToken = localStorage.getItem('tradeflow-fromToken');
    const savedToToken = localStorage.getItem('tradeflow-toToken');
    
    if (savedFromToken) {
      setFromToken(savedFromToken);
    }
    if (savedToToken) {
      setToToken(savedToToken);
    }
  }, []);

  // Save token selections to localStorage when they change
  useEffect(() => {
    localStorage.setItem('tradeflow-fromToken', fromToken);
  }, [fromToken]);

  useEffect(() => {
    localStorage.setItem('tradeflow-toToken', toToken);
  }, [toToken]);

  // Calculate price impact (mock calculation for demo)
  const calculatePriceImpact = (amount: string) => {
    if (!amount || parseFloat(amount) <= 0) return 0;
    
    // Mock calculation: larger amounts have higher price impact
    const baseImpact = Math.min(parseFloat(amount) * 0.01, 15);
    const tokenMultiplier = fromToken === "XLM" ? 1.2 : 1.0;
    return baseImpact * tokenMultiplier;
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
    
    // Calculate mock to amount
    if (value && parseFloat(value) > 0) {
      const mockRate = fromToken === "XLM" ? 0.15 : 6.67;
      setToAmount((parseFloat(value) * mockRate * (1 - impact / 100)).toFixed(6));
    } else {
      setToAmount("");
    }
  };

  const handleSwapClick = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return;
    
    if (priceImpact > 5) {
      setIsHighSlippageWarningOpen(true);
    } else {
      // Proceed with normal swap
      console.log("Proceeding with normal swap");
    }
  };

  const handleHighSlippageConfirm = () => {
    console.log("Proceeding with high slippage swap");
  };

  return (
    <>
      <Card className="max-w-md mx-auto">
        {/* Header with settings */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Swap Tokens</h2>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* From Token */}
        <div className="mb-4">
          <label className="block text-sm text-slate-400 mb-2">From</label>
          <div className="flex gap-3">
            <TokenDropdown onTokenChange={setFromToken} />
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => handleFromAmountChange(e.target.value)}
              placeholder="0.00"
              className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center my-4">
          <button
            onClick={handleSwap}
            className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full transition-colors group"
          >
            <ArrowUpDown
              size={20}
              className="text-white transition-transform duration-200 hover:rotate-180"
            />
          </button>
        </div>

        {/* To Token */}
        <div className="mb-6">
          <label className="block text-sm text-slate-400 mb-2">To</label>
          <div className="flex gap-3">
            <TokenDropdown onTokenChange={setToToken} />
            <input
              type="number"
              value={toAmount}
              readOnly
              placeholder="0.00"
              className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Swap CTA */}
        <button onClick={handleSwapClick} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 py-3 mb-6">
          Swap Tokens
        </button>

        {/* Transaction Details */}
        <div className="space-y-3 pt-4 border-t border-slate-700/50">
          <div className="flex justify-between text-sm">
            <Tooltip content="The estimated change in price due to the size of your trade.">
              <span className="text-slate-400 underline decoration-dotted decoration-slate-600 cursor-help">
                Price Impact
              </span>
            </Tooltip>
            <span className={`${priceImpact > 5 ? "text-red-500 font-bold" : "text-slate-200"}`}>
              {priceImpact.toFixed(2)}%
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <Tooltip content="The difference between the expected price of a trade and the executed price.">
              <span className="text-slate-400 underline decoration-dotted decoration-slate-600 cursor-help">
                Slippage Tolerance
              </span>
            </Tooltip>
            <span className="text-slate-200">{slippageTolerance}%</span>
          </div>

          <div className="flex justify-between text-sm">
            <Tooltip content="A fee paid to liquidity providers who facilitate this trade.">
              <span className="text-slate-400 underline decoration-dotted decoration-slate-600 cursor-help">
                Liquidity Provider Fee
              </span>
            </Tooltip>
            <span className="text-slate-200">0.3%</span>
          </div>

          <div className="flex justify-between text-sm">
            <Tooltip content="The most efficient path through multiple liquidity pools to execute your trade.">
              <span className="text-slate-400 underline decoration-dotted decoration-slate-600 cursor-help">
                Route
              </span>
            </Tooltip>
            <span className="text-slate-200">{fromToken} → {toToken}</span>
          </div>
        </div>
      </Card>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* High Slippage Warning Modal */}
      <HighSlippageWarning
        isOpen={isHighSlippageWarningOpen}
        onClose={() => setIsHighSlippageWarningOpen(false)}
        onConfirm={handleHighSlippageConfirm}
        priceImpact={priceImpact}
      />
    </>
  );
}