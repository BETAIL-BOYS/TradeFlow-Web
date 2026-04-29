/**
 * Token Dropdown Component.
 * Allows users to select an asset for trading. Includes search functionality, 
 * recent token history, and watchlist integration.
 */

"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search, X, Copy, History, Star } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import { useRecentTokens } from "../hooks/useRecentTokens";
import { useWatchlist } from "../hooks/useWatchlist";
import StarIcon from "./StarIcon";
import { showError, showSuccess } from "../lib/toast";
import toast from "react-hot-toast";
import Icon from "./ui/Icon";

/**
 * Props for the TokenDropdown component.
 */
interface TokenDropdownProps {
  /** Callback triggered when the selected asset changes */
  onTokenChange?: (token: string) => void;
}

/**
 * A specialized searchable dropdown for Stellar assets.
 */
export default function TokenDropdown({ onTokenChange }: TokenDropdownProps) {
  // --- Component State ---
  const [selectedToken, setSelectedToken] = useState("XLM");
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  
  // --- Refs ---
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // --- Custom Hooks ---
  const { recentTokens, addRecentToken } = useRecentTokens();
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const debouncedSearch = useDebounce(searchInput, 300);

  /** List of available assets (standardized symbols) */
  const tokens = ["XLM", "USDC", "yXLM"];

  /** 
   * Mock contract addresses for demonstration.
   */
  const mockAddresses: Record<string, string> = {
    "XLM": "native",
    "USDC": "CBQ6O7Y4O7Z5J2... (Stellar Contract)",
    "yXLM": "CBP3T2... (Yield Stellar Asset)",
  };

  /**
   * Filtered token list based on the user's search query.
   */
  const filteredTokens = useMemo(() => {
    return tokens.filter((token) =>
      token.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch]);

  // --- Handlers ---

  /**
   * Effect: Handles clicks outside the component to close the dropdown.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchInput(""); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Effect: Automatically focus the search input when the dropdown opens.
   */
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  /**
   * Updates the selected asset and persists to history.
   * 
   * @param {string} token - The asset symbol.
   */
  const handleTokenSelect = (token: string) => {
    setSelectedToken(token);
    addRecentToken(token);
    setIsOpen(false);
    if (onTokenChange) {
      onTokenChange(token);
    }
  };

  /**
   * Copies the token's contract address to the clipboard.
   */
  const handleCopyAddress = (e: React.MouseEvent, token: string) => {
    e.stopPropagation(); // Prevent dropdown from closing
    const address = mockAddresses[token] || "Address not found";

    navigator.clipboard.writeText(address)
<<<<<<< HEAD
      .then(() => toast.success("Contract address copied!"))
      .catch(() => toast.error("Failed to copy address"));
=======
      .then(() => {
        showSuccess("Token Address Copied!");
      })
      .catch(() => {
        showError("Failed to copy address");
      });
>>>>>>> upstream/main
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl px-4 py-2.5 transition-all min-w-[130px] justify-between shadow-sm active:scale-[0.98]"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
<<<<<<< HEAD
        <span className="font-bold text-white tracking-tight">{selectedToken}</span>
        <ChevronDown
          size={16}
          className={`text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
=======
        <span className="font-medium text-white">{selectedToken}</span>
        <Icon icon={ChevronDown} dense className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
>>>>>>> upstream/main
      </button>

      {/* Dropdown Content */}
      {isOpen && (
<<<<<<< HEAD
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden min-w-[240px] animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Search Header */}
          <div className="border-b border-slate-700 p-3 bg-slate-900/50">
            <div className="relative group">
              <Search
                size={14}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none group-focus-within:text-blue-400 transition-colors"
              />
=======
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-50 overflow-hidden">
          {/* Search Input */}
          <div className="border-b border-slate-700 p-3 sticky top-0 bg-slate-800">
            <div className="relative">
              <Icon icon={Search} dense className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
>>>>>>> upstream/main
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search assets..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 pl-10 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  aria-label="Clear search"
                >
<<<<<<< HEAD
                  <X size={14} />
=======
                  <Icon icon={X} dense />
>>>>>>> upstream/main
                </button>
              )}
            </div>
          </div>

<<<<<<< HEAD
          {/* List Content */}
          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {filteredTokens.length > 0 ? (
              <div className="p-1.5 space-y-0.5">
                {/* 1. Recent Assets Section */}
                {searchInput === "" && recentTokens.length > 0 && (
                  <>
                    <div className="px-3 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <History size={12} /> Recent History
                    </div>
                    {recentTokens.map((token) => (
                      <button
                        key={`recent-${token}`}
                        onClick={() => handleTokenSelect(token)}
                        className="w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between hover:bg-slate-700/50 text-white group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-sm">{token}</span>
                          <div
                            onClick={(e) => handleCopyAddress(e, token)}
                            className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-blue-400 transition-all p-1"
                            title="Copy Contract"
                          >
                            <Copy size={12} />
                          </div>
                        </div>
                        <StarIcon
                          isStarred={isInWatchlist(token)}
                          onClick={(e: any) => {
                            e.stopPropagation();
                            toggleWatchlist(token);
                          }}
                          size={12}
=======
          {/* Token List */}
          {filteredTokens.length > 0 ? (
            <div className="max-h-48 overflow-y-auto">
              {/* Recent Tokens Section */}
              {searchInput === "" && recentTokens.length > 0 && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-800/95 sticky top-0 z-10 backdrop-blur-sm">
                    Recent
                  </div>
                  {recentTokens.map((token) => (
                    <button
                      key={`recent-${token}`}
                      onClick={() => handleTokenSelect(token)}
                      className="w-full text-left px-4 py-2 transition-colors flex items-center justify-between hover:bg-slate-700 text-white group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{token}</span>
                        {/* ISSUE #86: Copy Icon for Recent Tokens */}
                        <div
                          onClick={(e) => handleCopyAddress(e, token)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-blue-400 transition-all p-1"
                          title="Copy Contract Address"
                        >
                        <Icon icon={Copy} dense />
                        </div>
                        <StarIcon
                          isStarred={isInWatchlist(token)}
                          onClick={() => toggleWatchlist(token)}
>>>>>>> upstream/main
                        />
                      </button>
                    ))}
                    <div className="h-px bg-slate-700/50 my-1 mx-2" />
                  </>
                )}

                {/* 2. All Assets Section */}
                <div className="px-3 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                   All Protocol Assets
                </div>
                {filteredTokens.map((token) => (
                  <button
                    key={token}
                    onClick={() => handleTokenSelect(token)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group ${
                      token === selectedToken
                        ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                        : "hover:bg-slate-700/50 text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm">{token}</span>
                      <div
                        onClick={(e) => handleCopyAddress(e, token)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-blue-400 transition-all p-1"
                        title="Copy Contract"
                      >
                        <Copy size={12} />
                      </div>
<<<<<<< HEAD
                    </div>
                    <div className="flex items-center gap-3">
                      <StarIcon
                        isStarred={isInWatchlist(token)}
                        onClick={(e: any) => {
                          e.stopPropagation();
                          toggleWatchlist(token);
                        }}
                        size={12}
                      />
                      {token === selectedToken && (
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                      )}
                    </div>
                  </button>
                ))}
=======
                      {token === selectedToken && (
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      )}
                    </button>
                  ))}
                  <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-800/95 sticky top-0 z-10 backdrop-blur-sm border-t border-slate-700/50">
                    All Tokens
                  </div>
                </>
              )}
              {filteredTokens.map((token) => (
                <button
                  key={token}
                  onClick={() => handleTokenSelect(token)}
                  className={`w-full text-left px-4 py-2 transition-colors flex items-center justify-between group ${token === selectedToken
                      ? "bg-blue-600/20 text-blue-400"
                      : "hover:bg-slate-700 text-white"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{token}</span>
                    {/* ISSUE #86: Copy Icon for All Tokens */}
                    <div
                      onClick={(e) => handleCopyAddress(e, token)}
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-blue-400 transition-all p-1"
                      title="Copy Contract Address"
                    >
                      <Icon icon={Copy} dense />
                    </div>
                    <StarIcon
                      isStarred={isInWatchlist(token)}
                      onClick={() => toggleWatchlist(token)}
                    />
                  </div>
                  {token === selectedToken && (
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            /**
             * ISSUE #91: Enhanced "Token Not Found" Empty State.
             * Includes visual cues and instructional secondary text.
             */
            <div className="px-6 py-10 text-center flex flex-col items-center justify-center">
              <div className="bg-slate-700/50 p-3 rounded-full mb-4">
                <Icon icon={Search} className="text-slate-500" />
>>>>>>> upstream/main
              </div>
            ) : (
              <div className="px-6 py-10 text-center flex flex-col items-center justify-center">
                <div className="bg-slate-700/30 p-3 rounded-2xl mb-4">
                  <Search size={24} className="text-slate-600" />
                </div>
                <p className="text-white font-bold text-xs uppercase tracking-tight mb-1">Asset Not Found</p>
                <p className="text-[10px] text-slate-500 leading-relaxed max-w-[160px] font-medium">
                  Try searching for a different name or symbol.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
<<<<<<< HEAD
=======
// Inconsequential change for repo health

// Maintenance: minor update
>>>>>>> upstream/main
