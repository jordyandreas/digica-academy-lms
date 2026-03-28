"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/features/testimonials/data/testimonials";

/** Matches former landing container `delayChildren` + `staggerChildren` */
const STAGGER_BASE = 0.04;
const STAGGER_STEP = 0.08;

export type TestimonialCardProps = {
  testimonial: Pick<
    Testimonial,
    "id" | "name" | "role" | "company" | "highlight" | "quote"
  >;
  className?: string;
  /** Stagger index when multiple cards animate in sequence (default 0) */
  index?: number;
};

export function TestimonialCard({
  testimonial,
  className,
  index = 0,
}: TestimonialCardProps) {
  const reduceMotion = useReducedMotion();

  const cardVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 16 },
      show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: reduceMotion
          ? { duration: 0 }
          : {
              delay: STAGGER_BASE + i * STAGGER_STEP,
              type: "spring" as const,
              stiffness: 260,
              damping: 24,
              mass: 0.65,
            },
      }),
    }),
    [reduceMotion]
  );

  return (
    <motion.figure
      className={cn(
        "group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 p-5 shadow-sm ring-1 ring-transparent md:p-6",
        /* Do not use transition-all here: Framer drives transform on hover; CSS transition on transform causes lag. */
        "transition-shadow duration-300 ease-out hover:shadow-xl hover:ring-primary/30",
        className
      )}
      custom={index}
      variants={cardVariants}
      initial={reduceMotion ? "show" : "hidden"}
      whileInView={reduceMotion ? undefined : "show"}
      viewport={reduceMotion ? undefined : { once: true, margin: "-80px" }}
      whileHover={
        reduceMotion
          ? undefined
          : { y: -6, scale: 1.01, transition: { type: "spring", stiffness: 320, damping: 28 } }
      }
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {testimonial.company}
          </p>
          <p className="mt-1 text-[11px] font-medium text-secondary">{testimonial.highlight}</p>
        </div>
        <div className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary px-2 py-1 text-[10px] font-medium text-primary-foreground shadow-sm">
          <span className="text-[11px]">★ 4.9</span>
          <span className="text-primary-foreground/70">/5.0</span>
        </div>
      </div>

      <blockquote className="mt-4 text-xs leading-relaxed text-zinc-700 md:text-[0.8rem]">
        “{testimonial.quote}”
      </blockquote>

      <figcaption className="mt-5 flex items-center justify-between gap-2 text-xs text-zinc-500">
        <div className="min-w-0">
          <p className="font-medium text-zinc-800">{testimonial.name}</p>
          <p className="text-[11px]">{testimonial.role}</p>
        </div>
        <Button
          asChild
          variant="outline"
          className="h-auto shrink-0 gap-1 rounded-full border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[10px] font-medium text-zinc-700 group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:text-primary"
        >
          <Link
            href={`/testimonials/${testimonial.id}`}
            className="inline-flex items-center gap-1"
          >
            <span>View story</span>
            <span className="transition-transform group-hover:translate-x-0.5">↗</span>
          </Link>
        </Button>
      </figcaption>
    </motion.figure>
  );
}
