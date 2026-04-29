/**
 * Settings Modal Component.
 * Provides a centralized interface for configuring trade parameters 
 * like slippage tolerance, transaction deadlines, and Expert Mode.
 */

"use client";

<<<<<<< HEAD
import React, { useState } from 'react';
import { X, Settings, ShieldAlert, Zap, Clock } from 'lucide-react';
import Card from './Card';
import { useSlippage } from '../contexts/SlippageContext';
import { useExpertMode } from '../contexts/ExpertModeContext';
import ExpertModeModal from './ExpertModeModal';
=======
import React from "react";
import { X, Info } from "lucide-react";
import { useSettings } from "../lib/context/SettingsContext";
import Icon from "./ui/Icon";
>>>>>>> upstream/main

/**
 * Props for the SettingsModal component.
 */
interface SettingsModalProps {
  /** Visibility toggle for the modal */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
}

/**
 * A modal overlay for managing user preferences and trade constraints.
 */
export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
<<<<<<< HEAD
  // --- Context & Store Hooks ---
  const { 
    slippageTolerance, 
    setSlippageTolerance, 
    isSlippageAuto, 
    setIsSlippageAuto, 
    transactionDeadline, 
    setTransactionDeadline 
  } = useSlippage();
  
  const { isExpertMode, setExpertMode, hasAcceptedRisk, acceptRisk } = useExpertMode();
  
  // --- Component State ---
  /** Controls visibility of the high-risk confirmation modal */
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);

  /** Standard slippage preset options (as percentages) */
  const presetOptions = [0.1, 0.5, 1.0, 3.0, 5.0];

  // --- Handlers ---

  /**
   * Updates the slippage tolerance to a preset value.
   * Only applicable when "Auto" mode is disabled.
   * 
   * @param {number} value - The preset percentage.
   */
  const handlePresetClick = (value: number) => {
    if (!isSlippageAuto) {
      setSlippageTolerance(value);
      console.log(`[Settings] Slippage preset applied: ${value}%`);
    }
  };

  /**
   * Handles manual entry of custom slippage values.
   * Constraints: 0% to 50%.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSlippageAuto) {
      const value = parseFloat(e.target.value);
      if (!isNaN(value) && value >= 0 && value <= 50) {
        setSlippageTolerance(value);
      }
    }
  };

  /**
   * Toggles between automatic and manual slippage management.
   */
  const handleAutoToggle = () => {
    const newAutoState = !isSlippageAuto;
    setIsSlippageAuto(newAutoState);

    // Reset to a safe protocol default (0.5%) when re-enabling Auto
    if (newAutoState) {
      setSlippageTolerance(0.5);
    }
  };

  /**
   * Toggles Expert Mode with security checks.
   */
  const handleExpertModeToggle = () => {
    if (isExpertMode) {
      // Disabling expert mode is always allowed
      setExpertMode(false);
    } else {
      // Enabling expert mode requires explicit risk acknowledgment
      if (hasAcceptedRisk) {
        setExpertMode(true);
      } else {
        setIsExpertModalOpen(true);
      }
    }
  };

  /**
   * Callback for the Expert Mode confirmation modal.
   */
  const handleExpertModeConfirm = () => {
    acceptRisk();
    setExpertMode(true);
    setIsExpertModalOpen(false);
  };
=======
  const { slippage, setSlippage, deadline, setDeadline } = useSettings();
>>>>>>> upstream/main

  // 1. Conditional Rendering for Visibility
  if (!isOpen) return null;

  return (
<<<<<<< HEAD
    <>
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <Card className="w-full max-w-md mx-4 shadow-2xl border-slate-700/50 overflow-hidden animate-in zoom-in duration-200">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
                <Settings size={20} />
              </div>
              <h2 id="settings-title" className="text-xl font-black text-white tracking-tight uppercase">Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
              aria-label="Close settings"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-8">
            {/* --- Expert Mode Configuration --- */}
            <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert size={16} className="text-orange-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Expert Mode</h3>
              </div>
              <p className="text-xs text-slate-500 mb-5 leading-relaxed font-medium">
                Allows high-slippage trades and customizes complex transaction parameters. Use with extreme caution.
              </p>

              <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-tight">Active Status</span>
                <button
                  type="button"
                  onClick={handleExpertModeToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${isExpertMode ? "bg-orange-500" : "bg-slate-700"
                    }`}
                  role="switch"
                  aria-checked={isExpertMode}
                >
                  <span
                    className={`${isExpertMode ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </button>
              </div>
            </div>

            {/* Slippage Tolerance */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Slippage Tolerance</h3>
              <p className="text-sm text-slate-400 mb-4">
                Your transaction will revert if the price changes unfavorably by more than this percentage
              </p>

              {/* Auto Toggle */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-sm font-medium text-white">Auto Slippage</span>
                  <p className="text-xs text-slate-400">Use algorithmically safe default (0.5%)</p>
=======
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
          >
            <Icon icon={X} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Slippage Tolerance */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                Slippage Tolerance
                <div className="group relative">
                  <Icon icon={Info} dense className="text-slate-500 cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-xs text-slate-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-700 shadow-xl">
                    Your transaction will revert if the price changes unfavorably by more than this percentage.
                  </div>
>>>>>>> upstream/main
                </div>
              </label>
              <span className="text-sm font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded-md">
                {slippage}%
              </span>
            </div>
            <div className="flex gap-2">
              {[0.1, 0.5, 1.0].map((val) => (
                <button
                  key={val}
                  onClick={() => setSlippage(val)}
                  className={`flex-1 py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                    slippage === val
                      ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                  }`}
                >
                  {val}%
                </button>
              ))}
              <div className="relative flex-1">
                <input
                  type="number"
                  value={slippage}
                  onChange={(e) => setSlippage(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 pr-8"
                  placeholder="Custom"
                />
<<<<<<< HEAD
                <span className="text-slate-400">%</span>
              </div>

              {/* Auto Indicator */}
              {isSlippageAuto && (
                <div className="mt-2 p-2 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <p className="text-xs text-blue-400">
                    🤖 Auto slippage is enabled at 0.5% - Turn off "Auto" to set custom values
                  </p>
                </div>
              )}

              {/* Warnings - Only show when not in Auto mode */}
              {!isSlippageAuto && (
                <>
                  {slippageTolerance < 0.1 && (
                    <p className="text-xs text-yellow-500 mt-2">
                      Your transaction may fail
                    </p>
                  )}
                  {slippageTolerance > 5 && (
                    <p className="text-xs text-red-500 mt-2">
                      High slippage tolerance may result in a bad trade
                    </p>
                  )}
                </>
              )}
              {/* Transaction Deadline */}
              <div className="pt-4 border-t border-slate-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-blue-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Transaction Deadline</h3>
                </div>
                <p className="text-xs text-slate-500 mb-5 leading-relaxed font-medium">
                  Your transaction will revert if it is pending for more than this period.
                </p>
                <div className="flex items-center gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
                  <input
                    type="number"
                    value={transactionDeadline}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val > 0) setTransactionDeadline(val);
                    }}
                    min="1"
                    className="w-20 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono font-bold focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="20"
                  />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Minutes</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
=======
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">%</span>
              </div>
            </div>
          </div>
>>>>>>> upstream/main

          {/* Transaction Deadline */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                Transaction Deadline
                <div className="group relative">
                  <Icon icon={Info} dense className="text-slate-500 cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-xs text-slate-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-700 shadow-xl">
                    Your transaction will revert if it remains pending for longer than this time.
                  </div>
                </div>
              </label>
              <span className="text-sm font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded-md">
                {deadline}m
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={deadline}
                onChange={(e) => setDeadline(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all pr-12"
                placeholder="20"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">minutes</span>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              * Default is 20 minutes. Lower values increase security but may fail during high congestion.
            </p>
          </div>
        </div>

        <div className="p-6 bg-slate-900/50 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-blue-900/20"
          >
            Save Settings
          </button>
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
