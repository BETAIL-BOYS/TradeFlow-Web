<<<<<<< HEAD
/**
 * News Banner Component.
 * A dismissible top-level banner for announcing major protocol updates or news.
 * Persists visibility only within the current session.
 */
=======
"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import Icon from './ui/Icon';
>>>>>>> upstream/main

import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

/**
 * A stylized notification banner for global announcements.
 */
export default function NewsBanner() {
  // --- Component State ---
  const [isVisible, setIsVisible] = useState(true);

  // 1. Conditional Rendering for Visibility
  if (!isVisible) return null;

  return (
    <div 
      className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2.5 px-4 relative shadow-md z-50 animate-in slide-in-from-top duration-500"
      role="status"
      aria-label="Important Announcement"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <div className="flex items-center gap-3">
          {/* Decorative Icon */}
          <div className="bg-white/20 p-1 rounded-lg">
            <Sparkles size={14} className="text-blue-100" />
          </div>
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.2em]">
            TradeFlow Mainnet Beta is now live! 
          </span>
          <span className="hidden sm:inline-block bg-white text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
            NEW
          </span>
        </div>
      </div>
      
      {/* Dismiss Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-90"
        aria-label="Dismiss banner"
      >
<<<<<<< HEAD
        <X size={14} />
=======
        <Icon icon={X} dense />
>>>>>>> upstream/main
      </button>
    </div>
  );
}

<<<<<<< HEAD
=======
// Inconsequential change for repo health

// Maintenance: minor update
>>>>>>> upstream/main
