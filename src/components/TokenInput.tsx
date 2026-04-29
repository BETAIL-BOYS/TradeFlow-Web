<<<<<<< HEAD
/**
 * Token Input Component.
 * A specialized numerical input for asset amounts. Features validation for 
 * decimal numbers and a "MAX" utility for quick balance allocation.
 */
=======
"use client";
>>>>>>> upstream/main

import React from 'react';
import { ChevronDown } from 'lucide-react';
import Icon from './ui/Icon';

/**
 * Props for the TokenInput component.
 */
interface TokenInputProps {
<<<<<<< HEAD
  /** The current numeric value as a string */
  value: string;
  /** Callback triggered when the input value changes */
  onChange: (value: string) => void;
  /** The user's available balance for this asset */
  balance: string;
  /** Optional placeholder text (default: "0.00") */
  placeholder?: string;
  /** Optional ID for form labeling */
  id?: string;
}

/**
 * A robust numerical input with built-in validation and balance utilities.
 */
const TokenInput: React.FC<TokenInputProps> = ({ 
  value, 
  onChange, 
  balance, 
  placeholder = "0.00",
  id
}) => {
  return (
    <div className="relative flex items-center w-full group">
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={value}
        /**
         * Validates that the input is a valid decimal number.
         * Allows empty strings for clearing the input.
         */
        onChange={(e) => {
          const val = e.target.value.replace(',', '.'); // Normalize decimal separators
          if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
            onChange(val);
          }
        }}
        placeholder={placeholder}
        className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-4 py-4 pr-16 text-lg font-mono font-bold text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all group-hover:border-slate-600"
        aria-label="Token Amount"
      />
      
      {/* MAX Utility Button */}
      <button
        type="button"
        onClick={() => {
          onChange(balance);
          console.log(`[TokenInput] Balance maximized: ${balance}`);
        }}
        className="absolute right-3 px-2.5 py-1.5 text-[10px] font-black text-blue-400 hover:text-white hover:bg-blue-600 bg-blue-500/10 rounded-xl transition-all active:scale-90"
        title={`Set to maximum balance: ${balance}`}
      >
        MAX
      </button>
=======
  label: string;
  value: string;
  tokenSymbol: string;
  onSelectClick: () => void;
}

export const TokenInput: React.FC<TokenInputProps> = ({ label, value, tokenSymbol, onSelectClick }) => {
  return (
    <div className="rounded-2xl bg-gray-50 p-4 border border-transparent focus-within:border-blue-500/30 transition-all">
      <label className="text-xs font-medium text-gray-500 mb-2 block uppercase tracking-wider">{label}</label>
      <div className="flex items-center justify-between gap-4">
        <input
          type="number"
          value={value}
          placeholder="0.00"
          className="w-full bg-transparent text-3xl font-semibold outline-none text-gray-900"
        />
        {/* Token Selection Button - min-h-[44px] for mobile tap targets (#103) */}
        <button
          onClick={onSelectClick}
          className="flex min-h-[44px] items-center gap-2 rounded-xl bg-white px-4 py-1 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors active:scale-95"
        >
          <span className="font-bold text-gray-900">{tokenSymbol}</span>
          <Icon icon={ChevronDown} className="text-gray-400" />
        </button>
      </div>
>>>>>>> upstream/main
    </div>
  );
};
// Inconsequential change for repo health

<<<<<<< HEAD
export default TokenInput;
=======
// Maintenance: minor update
>>>>>>> upstream/main
