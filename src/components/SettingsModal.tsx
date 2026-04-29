/**
 * Settings Modal Component.
 * Provides a centralized interface for configuring trade parameters 
 * like slippage tolerance, transaction deadlines, and Expert Mode.
 */

"use client";

import React, { useState } from 'react';
import { X, Settings, ShieldAlert, Zap, Clock } from 'lucide-react';
import Card from './Card';
import { useSlippage } from '../contexts/SlippageContext';
import { useExpertMode } from '../contexts/ExpertModeContext';
import ExpertModeModal from './ExpertModeModal';

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

  // 1. Conditional Rendering for Visibility
  if (!isOpen) return null;

  return (
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
                </div>
                <button
                  type="button"
                  onClick={handleAutoToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${isSlippageAuto ? "bg-blue-600" : "bg-slate-700"
                    }`}
                  role="switch"
                  aria-checked={isSlippageAuto}
                >
                  <span
                    className={`${isSlippageAuto ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </button>
              </div>

              {/* Preset Options - Disabled when Auto is on */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                {presetOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handlePresetClick(option)}
                    disabled={isSlippageAuto}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${slippageTolerance === option && !isSlippageAuto
                        ? 'bg-blue-600 text-white'
                        : isSlippageAuto
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                  >
                    {option}%
                  </button>
                ))}
              </div>

              {/* Custom Input - Disabled when Auto is on */}
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={slippageTolerance}
                  onChange={handleCustomChange}
                  min="0"
                  max="50"
                  step="0.1"
                  disabled={isSlippageAuto}
                  className={`flex-1 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none transition-colors ${isSlippageAuto
                      ? 'bg-slate-800 border border-slate-600 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-700 border border-slate-600 focus:border-blue-500'
                    }`}
                  placeholder={isSlippageAuto ? "Auto (0.5%)" : "Custom"}
                />
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

      <ExpertModeModal
        isOpen={isExpertModalOpen}
        onClose={() => setIsExpertModalOpen(false)}
        onConfirm={handleExpertModeConfirm}
      />
    </>
  );
}

