"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/shared/utils/cn";

interface AnimatedSubscribeButtonProps {
  initialText: React.ReactNode;
  changeText: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function AnimatedSubscribeButton({
  initialText,
  changeText,
  className,
  onClick,
  disabled = false,
}: AnimatedSubscribeButtonProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setIsSubscribed(!isSubscribed);
    onClick?.();
  };

  return (
    <AnimatePresence mode="wait">
      {isSubscribed ? (
        <motion.button
          className={cn(
            "relative flex w-[200px] items-center justify-center overflow-hidden rounded-md bg-white p-[10px] outline outline-1 outline-black",
            className
          )}
          onClick={handleClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          disabled={disabled}
        >
          <motion.span
            key="action"
            className="relative block h-full w-full font-semibold"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            style={{ color: "#000" }}
          >
            {changeText}
          </motion.span>
        </motion.button>
      ) : (
        <motion.button
          className={cn(
            "relative flex w-[200px] cursor-pointer items-center justify-center rounded-md border-none p-[10px]",
            className
          )}
          style={{ backgroundColor: "#000", color: "#fff" }}
          onClick={handleClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          disabled={disabled}
        >
          <motion.span
            key="reaction"
            className="relative block font-semibold"
            initial={{ x: 0 }}
            exit={{ x: 50, transition: { duration: 0.1 } }}
          >
            {initialText}
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}