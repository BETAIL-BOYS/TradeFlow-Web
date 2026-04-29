<<<<<<< HEAD
/**
 * Wallet Modal Component.
 * Displays a selection of supported Stellar wallet providers (Freighter, xBull, Albedo).
 * Provides information about each wallet and handles the selection callback.
 */

import React from "react";
import { FREIGHTER_ID, XBULL_ID, ALBEDO_ID, WalletType } from "../lib/stellar";
import { X, Info, Shield, Smartphone, Globe } from "lucide-react";
=======
"use client";

import React from "react";
import { FREIGHTER_ID, XBULL_ID, ALBEDO_ID, WalletType } from "../lib/stellar";
import { getWalletDisplayName, getWalletDescription, getWalletIcon, getWalletBgColor } from "../lib/walletConnector";
import { CloseIcon } from "./icons";
>>>>>>> upstream/main

/**
 * Props for the WalletModal component.
 */
interface WalletModalProps {
  /** Visibility toggle for the modal */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Callback triggered when a wallet provider is selected */
  onConnect?: (walletType: WalletType) => void;
}

/**
 * Internal representation of a wallet provider option.
 */
interface WalletOption {
  /** The internal ID used by the stellar-wallets-kit */
  id: WalletType;
  /** Human-readable name of the wallet */
  name: string;
  /** Short description of the wallet's features */
  description: string;
  /** Lucide icon component to represent the wallet type */
  icon: React.ReactNode;
  /** Tailwind background color class for the icon container */
  bgColor: string;
}

/**
 * Supported wallet providers configuration.
 */
const walletOptions: WalletOption[] = [
  {
    id: FREIGHTER_ID,
<<<<<<< HEAD
    name: "Freighter",
    description: "Secure browser extension wallet by Stellar Development Foundation.",
    icon: <Shield size={20} />,
    bgColor: "bg-blue-500"
  },
  {
    id: XBULL_ID,
    name: "xBull",
    description: "Mobile-first and multi-platform Stellar wallet with advanced features.",
    icon: <Smartphone size={20} />,
    bgColor: "bg-orange-500"
  },
  {
    id: ALBEDO_ID,
    name: "Albedo",
    description: "Convenient web-based wallet for seamless Stellar network access.",
    icon: <Globe size={20} />,
    bgColor: "bg-purple-500"
=======
    name: getWalletDisplayName(FREIGHTER_ID),
    description: getWalletDescription(FREIGHTER_ID),
    icon: getWalletIcon(FREIGHTER_ID),
    bgColor: getWalletBgColor(FREIGHTER_ID)
  },
  {
    id: XBULL_ID,
    name: getWalletDisplayName(XBULL_ID),
    description: getWalletDescription(XBULL_ID),
    icon: getWalletIcon(XBULL_ID),
    bgColor: getWalletBgColor(XBULL_ID)
  },
  {
    id: ALBEDO_ID,
    name: getWalletDisplayName(ALBEDO_ID),
    description: getWalletDescription(ALBEDO_ID),
    icon: getWalletIcon(ALBEDO_ID),
    bgColor: getWalletBgColor(ALBEDO_ID)
>>>>>>> upstream/main
  }
];

/**
 * A modal overlay for selecting a wallet provider.
 */
export default function WalletModal({ isOpen, onClose, onConnect }: WalletModalProps) {
  // 1. Conditional Rendering for Visibility
  if (!isOpen) return null;

  /**
   * Selection handler: closes the modal and triggers the connection flow.
   * @param {WalletType} walletType - The ID of the chosen wallet.
   */
  const handleWalletSelect = (walletType: WalletType) => {
    if (onConnect) onConnect(walletType);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-slate-800 rounded-3xl border border-slate-700 p-1 max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        {/* Header Section */}
        <div className="flex justify-between items-center p-6 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
              <Shield size={20} />
            </div>
            <h2 id="modal-title" className="text-xl font-bold text-white tracking-tight">Connect Wallet</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
            aria-label="Close modal"
          >
<<<<<<< HEAD
            <X size={20} />
=======
            <CloseIcon />
>>>>>>> upstream/main
          </button>
        </div>

        {/* Options List */}
        <div className="p-6 space-y-3">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">Select Provider</p>
          {walletOptions.map((wallet) => (
            <button
              key={wallet.id}
              className="w-full bg-slate-900/40 hover:bg-slate-700/60 border border-slate-700/50 hover:border-blue-500/30 rounded-2xl p-4 flex items-center gap-4 transition-all group active:scale-[0.98]"
              onClick={() => handleWalletSelect(wallet.id)}
            >
              <div className={`w-12 h-12 ${wallet.bgColor} rounded-xl flex items-center justify-center text-white shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
                {wallet.icon}
              </div>
              <div className="text-left">
                <div className="font-bold text-white tracking-tight">{wallet.name}</div>
                <div className="text-xs text-slate-400 leading-relaxed mt-0.5">{wallet.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer/Disclosure */}
        <div className="px-6 py-5 bg-slate-900/50 flex gap-3 items-start border-t border-slate-700/50">
          <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            By connecting a wallet, you agree to our <span className="text-blue-400 hover:underline cursor-pointer">Terms of Service</span> and acknowledge you have read our <span className="text-blue-400 hover:underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

<<<<<<< HEAD
=======
// Inconsequential change for repo health

// Maintenance: minor update
>>>>>>> upstream/main
