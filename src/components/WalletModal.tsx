"use client";

import React from "react";
import { FREIGHTER_ID, XBULL_ID, ALBEDO_ID, WalletType } from "../lib/stellar";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect?: (walletType: WalletType) => void;
}

interface WalletOption {
  id: WalletType;
  name: string;
  description: string;
  icon: string;
  bgColor: string;
}

const walletOptions: WalletOption[] = [
  {
    id: FREIGHTER_ID,
    name: "Freighter",
    description: "Popular browser extension wallet",
    icon: "M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z",
    bgColor: "bg-blue-500"
  },
  {
    id: XBULL_ID,
    name: "xBull",
    description: "Mobile-first Stellar wallet",
    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
    bgColor: "bg-orange-500"
  },
  {
    id: ALBEDO_ID,
    name: "Albedo",
    description: "Web-based Stellar wallet",
    icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    bgColor: "bg-purple-500"
  }
];

export default function WalletModal({ isOpen, onClose, onConnect }: WalletModalProps) {
  if (!isOpen) return null;

  const handleWalletSelect = (walletType: WalletType) => {
    if (onConnect) onConnect(walletType);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Connect Wallet</h2>
          <button
            onClick={onClose}
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

        <div className="space-y-3">
          {walletOptions.map((wallet) => (
            <button
              key={wallet.id}
              className="w-full bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg p-4 flex items-center gap-3 transition-colors"
              onClick={() => handleWalletSelect(wallet.id)}
            >
              <div className={`w-10 h-10 ${wallet.bgColor} rounded-lg flex items-center justify-center`}>
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d={wallet.icon}/>
                </svg>
              </div>
              <div className="text-left">
                <div className="font-medium text-white">{wallet.name}</div>
                <div className="text-sm text-slate-400">{wallet.description}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
          <p className="text-sm text-slate-400">
            By connecting a wallet, you agree to the Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
