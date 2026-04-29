/**
 * Shared Footer Component.
 * Contains copyright information, primary resource links, and social media integrations.
 * Automatically sticks to the bottom of the viewport via flexbox in the layout.
 */

import React from "react";
import { ExternalLink, Twitter, Github, Mail } from "lucide-react";
import Link from "next/link";

/**
 * A consistent footer for all TradeFlow pages.
 */
export default function Footer() {
  // --- Configuration ---
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12 px-8 mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 lg:gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 max-w-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">T</span>
              </div>
              <span className="text-lg font-black tracking-tight text-white uppercase">TradeFlow</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              The premier dashboard for managing Real World Asset (RWA) backed invoices on the Stellar network.
            </p>
          </div>

          {/* Navigation & Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 w-full lg:w-auto">
            
            {/* Resources Column */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resources</h4>
              <nav className="flex flex-col gap-3">
                <a
                  href="https://docs.tradeflow.example"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-blue-400 transition-colors text-sm font-medium inline-flex items-center gap-1"
                >
                  Documentation
                  <ExternalLink size={12} className="opacity-50" />
                </a>
                <Link href="/faq" className="text-slate-500 hover:text-blue-400 transition-colors text-sm font-medium">
                  Help Center
                </Link>
              </nav>
            </div>

            {/* Legal Column */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Legal</h4>
              <nav className="flex flex-col gap-3">
                <Link href="/legal/terms" className="text-slate-500 hover:text-blue-400 transition-colors text-sm font-medium">
                  Terms of Service
                </Link>
                <Link href="/legal/privacy" className="text-slate-500 hover:text-blue-400 transition-colors text-sm font-medium">
                  Privacy Policy
                </Link>
              </nav>
            </div>

            {/* Social Column */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Connect</h4>
              <div className="flex gap-4">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  aria-label="View source on GitHub"
                >
                  <Github size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div className="text-slate-600 text-[10px] font-bold uppercase tracking-tighter">
            © {currentYear} TradeFlow Protocol. Built on Stellar.
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            Network Status: Operational
          </div>
        </div>
      </div>
    </footer>
  );
}

