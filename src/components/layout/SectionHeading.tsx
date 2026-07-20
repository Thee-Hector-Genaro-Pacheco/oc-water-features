import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  dark?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  subtitle,
  centered = true,
  dark = false,
  className
}) => {
  return (
    <div className={cn("max-w-3xl mb-12 sm:mb-16", centered && "mx-auto text-center", className)}>
      {badge && (
        <span
          className={cn(
            "inline-block text-xs sm:text-sm font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-3 border",
            dark
              ? "bg-brand-900/60 text-aqua-300 border-aqua-500/30"
              : "bg-brand-50 text-brand-700 border-brand-200"
          )}
        >
          {badge}
        </span>
      )}
      <h2
        className={cn(
          "text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight",
          dark ? "text-white" : "text-slate-900"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base sm:text-lg leading-relaxed",
            dark ? "text-slate-300" : "text-slate-600"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
