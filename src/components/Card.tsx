/**
 * Shared Card Component.
 * Provides a consistent container for UI sections with standard 
 * TradeFlow styling (borders, padding, and background).
 */

import React from "react";

/**
 * Props for the Card component.
 */
interface CardProps {
  /** The content to be wrapped by the card */
  children: React.ReactNode;
  /** Additional CSS classes for custom styling overrides */
  className?: string;
  /** Optional click handler for interactive cards */
  onClick?: () => void;
  /** Optional hover effect toggle */
  hoverable?: boolean;
}

/**
 * A versatile layout component for grouping related content.
 */
export default function Card({ 
  children, 
  className = "", 
  onClick,
  hoverable = false 
}: CardProps) {
  // --- Styling ---
  const baseStyles = "bg-slate-800 border border-slate-700 rounded-3xl p-6 transition-all duration-300 shadow-xl shadow-black/5";
  const hoverStyles = hoverable ? "hover:border-slate-600 hover:bg-slate-800/80 hover:translate-y-[-2px]" : "";
  const interactiveStyles = onClick ? "cursor-pointer active:scale-[0.99]" : "";

  return (
    <div 
      className={`${baseStyles} ${hoverStyles} ${interactiveStyles} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {children}
    </div>
  );
}
// Inconsequential change for repo health

// Maintenance: minor update
