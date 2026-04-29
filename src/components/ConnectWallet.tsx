/**
 * Connect Wallet Component.
 * A standalone button/dropdown component for managing Stellar wallet sessions.
 * Displays the connected address and provides a disconnect option.
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { connectWallet, WalletType, FREIGHTER_ID, shortenAddress } from "../lib/stellar";
import Button from "./ui/Button";
import { useTokenStore } from "../stores/tokenStore";
<<<<<<< HEAD
import { LogOut, ChevronDown, User, ShieldCheck } from "lucide-react";
=======
import { useWalletConnection } from "../hooks/useWalletConnection";
import { getCachedWalletConnection } from "../lib/walletCache";
import { LogOut, ChevronDown } from "lucide-react";
import WalletModal from "./WalletModal";
import AuthenticatedSkeleton from "./AuthenticatedSkeleton";
import Icon from "./ui/Icon";
>>>>>>> upstream/main

/** Key for purging recent token history on logout */
const RECENT_TOKENS_KEY = "tradeflow_recent_tokens";

/**
 * A component that handles the wallet connection flow and account display.
 */
export default function ConnectWallet() {
<<<<<<< HEAD
      // --- Component State ---
      const [pubKey, setPubKey] = useState<string | null>(null);
=======
>>>>>>> upstream/main
      const [isDropdownOpen, setIsDropdownOpen] = useState(false);
      const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
      const { setConnected } = useTokenStore();
      const { connectWallet, disconnectWallet, isInitialized, isRevalidating } = useWalletConnection();
      const dropdownRef = useRef<HTMLDivElement>(null);

<<<<<<< HEAD
      /**
       * Effect: Closes the account dropdown when clicking outside.
       */
=======
      // Get cached state synchronously to prevent UI flicker
      const cached = getCachedWalletConnection();
      const [pubKey, setPubKey] = useState<string | null>(() => {
        // Initialize with cached public key if available
        return cached.isCached && cached.isConnected ? cached.walletAddress : null;
      });

      // Update local state when wallet connection changes
      useEffect(() => {
        if (isInitialized) {
          const currentCached = getCachedWalletConnection();
          if (currentCached.isCached && currentCached.isConnected) {
            setPubKey(currentCached.walletAddress);
            setConnected(true, currentCached.walletAddress || undefined);
          } else {
            setPubKey(null);
            setConnected(false, undefined);
          }
        }
      }, [isInitialized, setConnected]);

      // Close dropdown when clicking outside
>>>>>>> upstream/main
      useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                  if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                        setIsDropdownOpen(false);
                  }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);

<<<<<<< HEAD
      /**
       * Initiates the wallet connection process.
       * 
       * @param {WalletType} walletType - The ID of the wallet provider.
       */
      const handleConnect = async (walletType: WalletType = FREIGHTER_ID) => {
            try {
                  const userInfo = await connectWallet(walletType);
                  if (userInfo.publicKey) {
                        setPubKey(userInfo.publicKey);
                        setConnected(true, userInfo.publicKey);
                        console.log(`[ConnectWallet] Session started for: ${userInfo.publicKey}`);
                  }
=======
      const handleConnect = async (walletType: WalletType) => {
            try {
                  await connectWallet(walletType);
                  // The hook will update the cache and state automatically
>>>>>>> upstream/main
            } catch (e: any) {
                  console.error("[ConnectWallet] Connection failed:", e);
                  // TODO: Use a toast instead of native alert
                  alert(e.message || "Failed to connect to wallet!");
            }
      };

<<<<<<< HEAD
      /**
       * Terminates the session and clears related data.
       */
=======
      const handleConnectClick = () => {
            setIsWalletModalOpen(true);
      };

>>>>>>> upstream/main
      const handleDisconnect = () => {
            setPubKey(null);
            setConnected(false, undefined);
            // Clear local history for privacy/security
            localStorage.removeItem(RECENT_TOKENS_KEY);
            setIsDropdownOpen(false);
            console.log("[ConnectWallet] Session terminated.");
      };

<<<<<<< HEAD
      // 1. Authenticated UI (Dropdown)
=======
      // Show skeleton if we have cached state but haven't finished initialization
      if (cached.isCached && cached.isConnected && !isInitialized) {
            return (
                  <div className="relative" ref={dropdownRef}>
                        <button
                              onClick={() => setIsDropdownOpen((prev) => !prev)}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium transition-colors"
                        >
                              <AuthenticatedSkeleton 
                                    walletAddress={cached.walletAddress || undefined}
                                    walletType={cached.walletType || undefined}
                                    isRevalidating={isRevalidating}
                              />
                        </button>
                  </div>
            );
      }

>>>>>>> upstream/main
      if (pubKey) {
            return (
                  <div className="relative" ref={dropdownRef}>
                        <button
                              onClick={() => setIsDropdownOpen((prev) => !prev)}
                              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-sm font-bold transition-all shadow-sm active:scale-[0.98]"
                              aria-haspopup="menu"
                              aria-expanded={isDropdownOpen}
                        >
<<<<<<< HEAD
                              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] shrink-0" />
                              <span className="font-mono tracking-tight">{shortenAddress(pubKey, 4)}</span>
                              <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
=======
                              <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                              {`${pubKey.slice(0, 4)}...${pubKey.slice(-4)}`}
                              <Icon icon={ChevronDown} dense className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
>>>>>>> upstream/main
                        </button>

                        {isDropdownOpen && (
                              <div 
                                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                                    role="menu"
                              >
                                    <div className="px-4 py-4 border-b border-slate-700 bg-slate-900/50">
                                          <div className="flex items-center gap-2 mb-1.5">
                                                <ShieldCheck size={14} className="text-blue-400" />
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Verified Account</p>
                                          </div>
                                          <p className="text-xs text-slate-200 font-mono break-all leading-relaxed">{pubKey}</p>
                                    </div>
                                    <div className="p-1.5">
                                          <button
                                                onClick={handleDisconnect}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all group"
                                                role="menuitem"
                                          >
                                                <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                                Disconnect Wallet
                                          </button>
                                    </div>
<<<<<<< HEAD
=======
                                    <button
                                          onClick={handleDisconnect}
                                          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                                    >
                                          <Icon icon={LogOut} dense />
                                          Disconnect Wallet
                                    </button>
>>>>>>> upstream/main
                              </div>
                        )}
                  </div>
            );
      }

      // 2. Unauthenticated UI (CTA Button)
      return (
            <div>
                  <Button
<<<<<<< HEAD
                        onClick={() => handleConnect(FREIGHTER_ID)}
                        className="bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-500/20 flex items-center gap-2 px-7 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all active:scale-95"
=======
                        onClick={handleConnectClick}
                        className="bg-purple-600 hover:bg-purple-700 shadow-lg flex items-center gap-2 px-6 py-3"
>>>>>>> upstream/main
                  >
                        <User size={16} />
                        Connect Wallet
                  </Button>
                  <WalletModal
                        isOpen={isWalletModalOpen}
                        onClose={() => setIsWalletModalOpen(false)}
                        onConnect={handleConnect}
                  />
            </div>
      );
}

<<<<<<< HEAD
=======
// Inconsequential change for repo health

// Maintenance: minor update
>>>>>>> upstream/main
