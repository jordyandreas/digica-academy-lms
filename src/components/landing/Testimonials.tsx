"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TESTIMONIALS } from "@/features/testimonials/data/testimonials";
import { TestimonialCardGrid } from "@/components/testimonials/TestimonialCard";

export default function Testimonials() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="testimonials"
      className="relative scroll-mt-24 border-y border-zinc-200/80 bg-white/85 px-6 py-16 md:py-20"
    >
      <div className="pointer-events-none absolute inset-x-0 top-16 -z-10 flex justify-center">
        <div className="h-64 w-[36rem] rounded-full bg-gradient-to-r from-primary/15 via-secondary/15 to-tertiary/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl space-y-10">
        <motion.div
          className="mx-auto max-w-3xl space-y-4 text-center"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={reduceMotion ? undefined : { once: true, margin: "-80px" }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 260, damping: 22, mass: 0.7 }
          }
        >
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Alumni stories
          </span>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-zinc-900 md:text-[1.9rem] md:leading-tight">
            From bootcamp to{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">
              data careers
            </span>
          </h2>
          <p className="text-sm text-zinc-600 md:text-[0.95rem]">
            Two Digica Data Science Bootcamp alumni who landed analyst and scientist roles
            at Jago and DANA.
          </p>
        </motion.div>

        <TestimonialCardGrid testimonials={TESTIMONIALS} />
      </div>
    </section>
  );
}
