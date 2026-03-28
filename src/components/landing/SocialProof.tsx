"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function SocialProof() {
  return (
    <section
      id="about"
      className="border-b border-zinc-200/80 bg-linear-to-b from-zinc-50 via-white to-zinc-50/80 px-6 py-16 md:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/15">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/80" />
            <span>About Us</span>
          </div>
          <p className="text-balance text-xl font-bold leading-snug tracking-tight text-zinc-900 sm:text-2xl md:text-[1.65rem] md:leading-snug">
            We are passionate about empowering learners{" "}
            <span className="font-bold text-primary">worldwide</span> with
            high-quality, accessible, and engaging education in data and
            technology—helping you ship real projects and grow with confidence.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-zinc-200">
          <ProofStat
            value="10+"
            label="Industry-focused programs and bootcamp tracks"
          />
          <ProofStat
            value="500+"
            label="Learners trained through Digica Academy programs"
          />
          <ProofStat
            value="20+"
            label="Hands-on projects and real-world case studies"
          />
        </div>
      </div>
    </section>
  );
}

type ProofStatProps = {
  value: string;
  label: string;
};

function ProofStat({ value, label }: ProofStatProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="flex flex-col items-center rounded-2xl border border-transparent px-4 py-5 text-center transition-[border-color,box-shadow] duration-300 sm:px-6 md:px-8 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10"
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -6,
              scale: 1.02,
            }
      }
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      <p className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl md:text-[2.35rem]">
        {value}
      </p>
      <p className="mt-2 max-w-56 text-xs leading-relaxed text-zinc-600 sm:text-sm">
        {label}
      </p>
    </motion.div>
  );
}
