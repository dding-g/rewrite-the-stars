"use client";

import { cn } from "@/shared/utils/cn";

interface MarqueeProps {
  children: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  pauseOnHover?: boolean;
  className?: string;
  reverse?: boolean;
}

export function Marquee({
  children,
  vertical = false,
  repeat = 4,
  pauseOnHover = false,
  className,
  reverse = false,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
              "animate-marquee flex-row": !vertical,
              "animate-marquee-vertical flex-col": vertical,
              "group-hover:[animation-play-state:paused]": pauseOnHover,
              "[animation-direction:reverse]": reverse,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  );
}