/**
 * Shared Tooltip Component.
 * Displays a non-interactive popover containing descriptive text when 
 * the user hovers over or focuses on the child element.
 */

import React, { useState } from "react";

/**
 * Props for the Tooltip component.
 */
interface TooltipProps {
  /** The text content to display inside the tooltip bubble */
  content: string;
  /** The element that triggers the tooltip (usually an icon or button) */
  children: React.ReactNode;
  /** Optional position override (defaults to top) */
  position?: "top" | "bottom" | "left" | "right";
}

/**
 * A lightweight, accessible tooltip component.
 */
export default function Tooltip({ children, content, position = "top" }: TooltipProps) {
  // --- Component State ---
  const [isVisible, setIsVisible] = useState(false);

  // --- Style Logic ---
  
  /** Position-specific Tailwind classes */
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2.5",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2.5",
    left: "right-full top-1/2 -translate-y-1/2 mr-2.5",
    right: "left-full top-1/2 -translate-y-1/2 ml-2.5"
  };

  /** Arrow orientation classes */
  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-slate-800",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-slate-800",
    left: "left-full top-1/2 -translate-y-1/2 border-l-slate-800",
    right: "right-full top-1/2 -translate-y-1/2 border-r-slate-800"
  };

  return (
    <div
      className="relative inline-block group"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {/* The trigger element */}
      {children}
      
      {/* The Tooltip Bubble */}
      <div
        className={`absolute ${positionClasses[position]} w-max max-w-[200px] transition-all duration-200 pointer-events-none z-[60] ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        role="tooltip"
        aria-hidden={!isVisible}
      >
        <div className="bg-slate-800 border border-slate-700 text-slate-100 text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-xl shadow-2xl shadow-black/40 whitespace-normal leading-tight text-center relative">
          {content}
          
          {/* Decorative Arrow */}
          <div className={`absolute border-[5px] border-transparent ${arrowClasses[position]}`} />
        </div>
      </div>
    </div>
  );
}

