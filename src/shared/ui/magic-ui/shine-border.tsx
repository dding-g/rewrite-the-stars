"use client";

import { cn } from "@/shared/utils/cn";

interface ShineBorderProps {
  children: React.ReactNode;
  className?: string;
  size?: number;
  duration?: number;
  borderRadius?: number;
  color?: string | string[];
}

export function ShineBorder({
  children,
  className,
  size = 10,
  duration = 14,
  borderRadius = 8,
  color = "#ffffff",
}: ShineBorderProps) {
  const colorArray = Array.isArray(color) ? color : [color];
  
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-gray-900 p-[1px]",
        className
      )}
      style={{
        borderRadius: `${borderRadius}px`,
      }}
    >
      <div
        className="absolute inset-0 animate-spin"
        style={{
          background: `conic-gradient(from 0deg, ${colorArray.join(", ")}, ${colorArray[0]})`,
          animation: `spin ${duration}s linear infinite`,
        }}
      />
      <div
        className="relative z-10 h-full w-full overflow-hidden bg-gray-900"
        style={{
          borderRadius: `${borderRadius - 1}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
}