/**
 * Shared Button component for the TradeFlow UI.
 * Provides consistent styling, variants, and built-in accessibility.
 */

import React from "react";

/**
 * Props for the Button component.
 * Extends standard HTML button attributes for full compatibility.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The content to be displayed inside the button */
  children: React.ReactNode;
  /** Visual style variant of the button */
  variant?: "primary" | "secondary" | "outline" | "ghost";
  /** Additional CSS classes for custom styling */
  className?: string;
  /** Optional loading state to disable button and show feedback */
  isLoading?: boolean;
}

/**
 * A versatile button component that supports different visual styles and states.
 */
export default function Button({
  children,
  variant = "primary",
  className = "",
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  // Core styling for all button types
  const baseStyles = "px-4 py-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-tradeflow-dark disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  // Style definitions for each variant
  const variantStyles = {
    primary: "bg-tradeflow-accent hover:bg-tradeflow-accent/90 text-white focus:ring-tradeflow-accent",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white focus:ring-slate-500",
    outline: "border-2 border-tradeflow-muted hover:border-tradeflow-accent hover:text-tradeflow-accent text-white",
    ghost: "hover:bg-white/5 text-tradeflow-muted hover:text-white"
  };

  // Merge all styles into a single string
  const combinedClassName = `${baseStyles} ${variantStyles[variant as keyof typeof variantStyles]} ${className}`;

  return (
    <button
      className={combinedClassName}
      disabled={disabled || isLoading}
      // ARIA attributes for accessibility
      aria-busy={isLoading}
      aria-live="polite"
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  );
}

