/**
 * Star Icon Component.
 * A reusable interactive toggle for marking assets as favorites or 
 * adding them to a watchlist.
 */

import React from 'react';
import { Star } from 'lucide-react';

/**
 * Props for the StarIcon component.
 */
interface StarIconProps {
  /** Current state of the star (filled vs outline) */
  isStarred: boolean;
  /** Callback triggered when the icon is clicked */
  onClick: (e: React.MouseEvent) => void;
  /** Size of the icon in pixels (default: 16) */
  size?: number;
  /** Additional CSS classes for custom styling */
  className?: string;
}

/**
 * A stylized star toggle button with smooth transitions and accessibility.
 */
export default function StarIcon({ 
  isStarred, 
  onClick, 
  size = 16, 
  className = '' 
}: StarIconProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevent triggering parent click handlers
        onClick(e);
      }}
      className={`p-2 rounded-xl transition-all duration-300 hover:bg-yellow-400/10 group active:scale-[0.85] ${className}`}
      aria-label={isStarred ? 'Remove from watchlist' : 'Add to watchlist'}
      aria-pressed={isStarred}
      title={isStarred ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <Star
        size={size}
        className={`transition-all duration-300 transform ${
          isStarred
            ? 'fill-yellow-400 text-yellow-400 scale-110 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]'
            : 'text-slate-500 group-hover:text-yellow-400/70 group-hover:scale-105'
        }`}
        aria-hidden="true"
      />
    </button>
  );
}

