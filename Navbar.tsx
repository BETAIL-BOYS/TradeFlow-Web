"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, Copy, Check } from "lucide-react";

interface NavbarProps {
  address?: string;
  onConnect?: () => void;
}

export default function Navbar({ address, onConnect }: NavbarProps) {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  const navLinks = [
    { name: "Dashboard", href: "/" },
    { name: "Swap", href: "/swap" },
    { name: "Pools", href: "/pools" },
    { name: "FAQ", href: "/faq" },
  ];

  return (
    <div className="flex justify-between items-center mb-12 p-8">
      <div className="flex items-center gap-12">
        <h1 className="text-3xl font-bold tracking-tight">
          TradeFlow <span className="text-blue-400">RWA</span>
        </h1>
        
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive 
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

      {address ? (
        <div className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full transition">
          <Wallet size={18} />
          <span className="text-sm">
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </span>
          <button
            onClick={copyToClipboard}
            className="ml-2 p-1 hover:bg-blue-500 rounded-full transition-colors"
            title="Copy address"
          >
            {copied ? (
              <Check size={16} className="text-green-300" />
            ) : (
              <Copy size={16} className="text-white" />
            )}
          </button>
        </div>
      ) : (
        <button
          onClick={onConnect}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full transition"
        >
          <Wallet size={18} />
          Connect Wallet
        </button>
      )}
    </div>
  );
}