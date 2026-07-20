import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "accent";
  size?: "sm" | "md" | "lg";
  href?: string;
  isExternal?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", href, isExternal, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]";

    const variants = {
      primary:
        "bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-900/10 hover:shadow-lg hover:shadow-brand-600/20 border border-transparent",
      secondary:
        "bg-navy-900 hover:bg-navy-800 text-white shadow-md border border-brand-800/40",
      outline:
        "bg-transparent hover:bg-brand-50 text-brand-900 hover:text-brand-700 border-2 border-brand-600/30 hover:border-brand-600",
      accent:
        "bg-aqua-500 hover:bg-aqua-600 text-slate-950 shadow-md shadow-aqua-500/20 border border-transparent font-bold"
    };

    const sizes = {
      sm: "text-sm px-3.5 py-2 min-h-[40px]",
      md: "text-base px-5 py-2.5 min-h-[44px]",
      lg: "text-lg px-7 py-3.5 min-h-[50px]"
    };

    const combinedClasses = cn(baseStyles, variants[variant], sizes[size], className);

    if (href) {
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={combinedClasses}
          >
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className={combinedClasses}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={combinedClasses} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
