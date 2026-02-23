import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface TokenDropdownProps {
  onTokenChange?: (token: string) => void;
}

export default function TokenDropdown({ onTokenChange }: TokenDropdownProps) {
  const [selectedToken, setSelectedToken] = useState("XLM");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hardcoded array of tokens as required
  const tokens = ["XLM", "USDC", "yXLM"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTokenSelect = (token: string) => {
    setSelectedToken(token);
    setIsOpen(false);
    if (onTokenChange) {
      onTokenChange(token);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Token Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 transition-colors min-w-[120px] justify-between"
      >
        <span className="font-medium text-white">{selectedToken}</span>
        <ChevronDown 
          size={16} 
          className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-50 overflow-hidden">
          {tokens.map((token) => (
            <button
              key={token}
              onClick={() => handleTokenSelect(token)}
              className={`w-full text-left px-4 py-2 transition-colors flex items-center justify-between ${
                token === selectedToken 
                  ? "bg-blue-600/20 text-blue-400" 
                  : "hover:bg-slate-700 text-white"
              }`}
            >
              <span className="font-medium">{token}</span>
              {token === selectedToken && (
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
