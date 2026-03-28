"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /**
   * Delay before the element animates in (useful for manual staggering).
   * Expressed in milliseconds.
   */
  delayMs?: number;
  once?: boolean;
};

export function Reveal({ children, className, delayMs = 0, once = true }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={reduceMotion ? undefined : { once, margin: "-80px" }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              type: "spring",
              stiffness: 260,
              damping: 22,
              mass: 0.7,
            }
      }
      style={reduceMotion ? undefined : { transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </motion.div>
  );
}

