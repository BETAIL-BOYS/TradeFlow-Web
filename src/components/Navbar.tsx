/**
 * Main Navigation Bar Component.
 * Provides access to primary application routes, wallet connectivity status, 
 * network selection, and utility features like the fiat on-ramp.
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, Copy, Check, CreditCard } from "lucide-react";
import { showError, showSuccess } from "../lib/toast";

// Core UI components and modals
import NetworkSelector from "./NetworkSelector";
import FiatOnRampModal from "./FiatOnRampModal";
import NetworkFeeIndicator from "./ui/NetworkFeeIndicator";
import WalletDropdown from "./WalletDropdown";
import Icon from "./ui/Icon";

/**
 * Props for the Navbar component.
 */
interface NavbarProps {
  /** The public Stellar address of the connected user (optional) */
  address?: string;
  /** Callback to trigger the wallet connection modal */
  onConnect?: () => void;
}

/**
 * The top navigation component used across all pages.
 */
export default function Navbar({ address, onConnect }: NavbarProps) {
  const pathname = usePathname();
  // --- UI State ---
  /** Tracks whether the wallet address was recently copied to clipboard */
  const [copied, setCopied] = useState(false);
  /** Controls visibility of the fiat purchase modal */
  const [isFiatModalOpen, setIsFiatModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  /**
   * Copies the connected wallet address to the system clipboard.
   */
  const copyToClipboard = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

        showSuccess("Address copied to clipboard!");
      } catch (err) {
        console.error('Failed to copy address:', err);
        showError("Failed to copy address");
      }
    }
  };

  /** Primary navigation link configuration */
  const navLinks = [
    { name: "Dashboard", href: "/" },
    { name: "Swap", href: "/swap" },
    { name: "Pools", href: "/pools" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "FAQ", href: "/faq" },
  ];

  return (
    <header className="flex justify-between items-center mb-8 p-6 md:p-8 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40 border-b border-slate-800">
      {/* Brand & Desktop Nav */}
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20">
            <span className="text-white font-black text-xl">T</span>
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-white">
            TRADEFLOW <span className="text-blue-400 font-medium">RWA</span>
          </h1>
        </Link>

        <nav className="hidden lg:flex gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${isActive
                    ? "text-cyan-400"
                    : "text-slate-400 hover:text-white"
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Action Area */}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="hidden sm:flex items-center gap-3">
          <NetworkSelector />
          <NetworkFeeIndicator />
        </div>

        {/* Buy Crypto Utility */}
        <button
          onClick={() => setIsFiatModalOpen(true)}
          className="hidden md:flex items-center gap-2 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white px-5 py-2.5 rounded-2xl transition-all font-bold text-sm border border-emerald-500/20"
          aria-label="Open fiat on-ramp"
        >
          <Icon icon={CreditCard} />
          Buy Crypto
        </button>

        {/* Wallet Connection / Account Display */}
        {address ? (
          <div className="relative">
          <div className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full transition">
            <Icon icon={Wallet} />
            <span className="text-sm">
              {`${address.slice(0, 6)}...${address.slice(-4)}`}
            </span>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full transition"
            >
              <Wallet size={18} />
              <span className="text-sm">
                {`${address.slice(0, 6)}...${address.slice(-4)}`}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard();
                }}
                className="ml-2 p-1 hover:bg-blue-500 rounded-full transition-colors"
                title="Copy address"
              >
                {copied ? (
                  <Check size={16} className="text-green-300" />
                ) : (
                  <Copy size={16} className="text-white" />
                )}
              </button>
              {copied ? (
                <Icon icon={Check} dense className="text-green-300" />
              ) : (
                <Icon icon={Copy} dense className="text-white" />
              )}
            </button>
            
            {/* Wallet Dropdown */}
            <WalletDropdown
              address={address}
              isOpen={isDropdownOpen}
              onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
            />
          </div>
        ) : (
          <button
            onClick={onConnect}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-2xl transition-all font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Icon icon={Wallet} />
            Connect Wallet
          </button>
        )}

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Modals & Overlays */}
      <FiatOnRampModal
        isOpen={isFiatModalOpen}
        onClose={() => setIsFiatModalOpen(false)}
      />
    </header>
  );
}
// Inconsequential change for repo health

// Maintenance: minor update
