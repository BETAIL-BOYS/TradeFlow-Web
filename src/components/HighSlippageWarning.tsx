"use client";

import React, { useState } from "react";
import Button from "./ui/Button";

interface HighSlippageWarningProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  priceImpact: number;
}

export default function HighSlippageWarning({ 
  isOpen, 
  onClose, 
  onConfirm, 
  priceImpact 
}: HighSlippageWarningProps) {
  const [confirmText, setConfirmText] = useState("");
  const isConfirmEnabled = confirmText === "CONFIRM";

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (isConfirmEnabled) {
      onConfirm();
      onClose();
      setConfirmText("");
    }
  };

  const handleClose = () => {
    onClose();
    setConfirmText("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">High Price Impact Warning</h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Warning Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Warning Message */}
        <div className="text-center mb-6">
          <p className="text-red-500 font-bold text-lg mb-2">
            High Price Impact. You will lose a significant portion of your funds.
          </p>
          <p className="text-slate-300">
            This trade has a price impact of <span className="font-bold text-red-500">{priceImpact.toFixed(2)}%</span>
          </p>
          <p className="text-slate-400 text-sm mt-2">
            This means you'll receive significantly less than expected due to low liquidity.
          </p>
        </div>

        {/* Confirmation Input */}
        <div className="mb-6">
          <label className="block text-sm text-slate-400 mb-2">
            Type "CONFIRM" to proceed with this risky trade:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="CONFIRM"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isConfirmEnabled}
            className={`flex-1 ${
              isConfirmEnabled
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }`}
          >
            Swap Anyway
          </Button>
        </div>

        {/* Additional Warning */}
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-xs text-red-400 text-center">
            ⚠️ This action cannot be undone. You are trading at a significant disadvantage.
          </p>
        </div>
      </div>
    </div>
  );
}
