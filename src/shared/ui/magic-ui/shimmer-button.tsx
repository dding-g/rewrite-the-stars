"use client";

import { cn } from "@/shared/utils/cn";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  shimmerColor?: string;
}

export function ShimmerButton({ 
  children, 
  className, 
  shimmerColor = "#ffffff",
  ...props 
}: ShimmerButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "relative inline-flex items-center justify-center rounded-lg border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-8 py-3 font-medium text-slate-400 transition-colors animate-shimmer hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50",
        className
      )}
      style={{
        background: `linear-gradient(110deg, #000103, 45%, ${shimmerColor}20, 55%, #000103)`,
        backgroundSize: "200% 100%",
        animation: "shimmer 2s infinite"
      }}
    >
      {children}
    </button>
  );
}