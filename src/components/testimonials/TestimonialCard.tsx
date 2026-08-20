"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/features/testimonials/data/testimonials";
import { CompanyLockup } from "@/components/testimonials/CompanyLockup";

const gridVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
} as const;

const cardItemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 24,
      mass: 0.65,
    },
  },
} as const;

export type TestimonialCardProps = {
  testimonial: Testimonial;
  className?: string;
};

export function TestimonialCardGrid({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.ul
      className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2"
      variants={gridVariants}
      initial={reduceMotion ? "show" : "hidden"}
      whileInView={reduceMotion ? undefined : "show"}
      viewport={reduceMotion ? undefined : { once: true, margin: "-80px" }}
    >
      {testimonials.map((testimonial) => (
        <motion.li
          key={testimonial.id}
          className="h-full"
          variants={cardItemVariants}
        >
          <TestimonialCard testimonial={testimonial} className="h-full" />
        </motion.li>
      ))}
    </motion.ul>
  );
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn("h-full", className)}
      whileHover={
        reduceMotion
          ? undefined
          : { y: -6, transition: { type: "spring", stiffness: 320, damping: 28 } }
      }
    >
      <Link
        href={`/testimonials/${testimonial.id}`}
        className="group block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label={`Read ${testimonial.name}'s success story`}
      >
        <article
          className={cn(
            "flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm",
            "ring-1 ring-transparent transition-[box-shadow,border-color] duration-300",
            "group-hover:border-primary/25 group-hover:shadow-xl group-hover:ring-primary/20"
          )}
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-primary/5">
            <Image
              src={testimonial.photo}
              alt={testimonial.name}
              fill
              className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <span className="absolute left-3 top-3 rounded-full border border-white/50 bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-primary shadow-[0_4px_16px_rgba(0,0,0,0.1)] backdrop-blur-md">
              Alumni Success Story #{testimonial.storyNumber}
            </span>
          </div>

          <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
            <h3 className="font-display text-lg font-semibold tracking-tight text-zinc-900">
              {testimonial.name}
            </h3>
            <p className="mt-1.5 inline-flex w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
              {testimonial.batchLabel}
            </p>
            <p className="mt-3 text-sm font-medium text-zinc-800">
              {testimonial.role} at{" "}
              <CompanyLockup
                company={testimonial.company}
                logo={testimonial.companyLogo}
              />
            </p>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-600">
              {testimonial.quote}
            </p>

            <div className="mt-auto flex items-center justify-end pt-5">
              <span className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold text-primary">
                Read story
                <ChevronRight
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
