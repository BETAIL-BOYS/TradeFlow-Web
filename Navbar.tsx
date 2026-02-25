"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet } from "lucide-react";

interface NavbarProps {
  address?: string;
  onConnect?: () => void;
}

export default function Navbar({ address, onConnect }: NavbarProps) {
  const pathname = usePathname();

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

      <button
        onClick={onConnect}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full transition"
      >
        <Wallet size={18} />
        {address
          ? `${address.slice(0, 6)}...${address.slice(-4)}`
          : "Connect Wallet"}
      </button>
    </div>
  );
}