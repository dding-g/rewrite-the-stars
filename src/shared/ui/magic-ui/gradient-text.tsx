"use client";

import { cn } from "@/shared/utils/cn";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}

export function GradientText({ 
  children, 
  className,
  gradient = "from-blue-600 via-purple-600 to-indigo-600"
}: GradientTextProps) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r bg-clip-text text-transparent animate-pulse",
        gradient,
        className
      )}
    >
      {children}
    </span>
  );
}