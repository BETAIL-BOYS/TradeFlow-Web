<<<<<<< HEAD
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

=======
import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { Loader2 } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-slate-700 text-white hover:bg-slate-600",
        destructive: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
        outline: "border border-slate-600 bg-transparent hover:bg-slate-800 text-white",
        ghost: "hover:bg-slate-800 text-white hover:text-white",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-10 py-2 px-4",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;

// Inconsequential change for repo health

// Maintenance: minor update
>>>>>>> upstream/main
