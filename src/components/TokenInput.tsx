/**
 * Token Input Component.
 * A specialized numerical input for asset amounts. Features validation for 
 * decimal numbers and a "MAX" utility for quick balance allocation.
 */

import React from 'react';

/**
 * Props for the TokenInput component.
 */
interface TokenInputProps {
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
    </div>
  );
};

export default TokenInput;
