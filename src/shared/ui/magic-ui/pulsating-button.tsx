"use client";

import { cn } from "@/shared/utils/cn";

interface PulsatingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  pulseColor?: string;
  duration?: string;
}

export function PulsatingButton({
  children,
  className,
  pulseColor = "#3b82f6",
  duration = "1.5s",
  ...props
}: PulsatingButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      style={{
        backgroundColor: pulseColor,
      }}
      {...props}
    >
      <div className="relative z-10">{children}</div>
      <div
        className="absolute inset-0 rounded-lg animate-pulse"
        style={{
          backgroundColor: pulseColor,
          animation: `pulse ${duration} cubic-bezier(0.4, 0, 0.6, 1) infinite`,
        }}
      />
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          backgroundColor: pulseColor,
          boxShadow: `0 0 0 0 ${pulseColor}`,
          animation: `ping ${duration} cubic-bezier(0, 0, 0.2, 1) infinite`,
        }}
      />
    </button>
  );
}