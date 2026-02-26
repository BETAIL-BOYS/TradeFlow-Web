"use client";

import React, { useState } from "react";
import { ArrowUpDown, Settings } from "lucide-react";
import TokenDropdown from "./TokenDropdown";
import Card from "./Card";
import SettingsModal from "./SettingsModal";
import { useSlippage } from "../contexts/SlippageContext";

export default function SwapInterface() {
  const [fromToken, setFromToken] = useState("XLM");
  const [toToken, setToToken] = useState("USDC");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { slippageTolerance } = useSlippage();

  const handleSwap = () => {
    // Swap the tokens
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  return (
    <>
      <Card className="max-w-md mx-auto">
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
            placeholder="0.00"
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Swap Button with Animated Arrow */}
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
            placeholder="0.00"
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Swap Button */}
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors mb-6">
        Swap Tokens
      </button>

      {/* Transaction Details */}
      <div className="space-y-3 pt-4 border-t border-slate-700/50">
        <div className="flex justify-between text-sm">
          <span 
            className="text-slate-400 underline decoration-dotted decoration-slate-600 cursor-help"
            title="The difference between the expected price of a trade and the executed price."
          >
            Slippage Tolerance
          </span>
          <span className="text-slate-200">{slippageTolerance}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span 
            className="text-slate-400 underline decoration-dotted decoration-slate-600 cursor-help"
            title="A fee paid to liquidity providers who facilitate this trade."
          >
            Liquidity Provider Fee
          </span>
          <span className="text-slate-200">0.3%</span>
        </div>
      </div>
    </Card>
    
    <SettingsModal 
      isOpen={isSettingsOpen} 
      onClose={() => setIsSettingsOpen(false)} 
    />
  </>
  );
}
