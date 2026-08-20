"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { Testimonial } from "@/features/testimonials/data/testimonials";
import { CompanyLockup } from "@/components/testimonials/CompanyLockup";

const spring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 24,
  mass: 0.65,
};

type TestimonialStoryProps = {
  testimonial: Testimonial;
};

export function TestimonialStory({ testimonial }: TestimonialStoryProps) {
  const reduceMotion = useReducedMotion();
  const hidden = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 };
  const shown = { opacity: 1, y: 0 };

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <motion.header
        className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm"
        initial={hidden}
        animate={shown}
        transition={reduceMotion ? { duration: 0 } : spring}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-primary/5 sm:aspect-[2/1]">
          <Image
            src={testimonial.photo}
            alt={testimonial.name}
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>

        <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-tertiary/10 px-6 py-8 md:px-8 md:py-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground shadow-sm">
              Alumni Success Story #{testimonial.storyNumber}
            </span>
            <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium text-primary">
              {testimonial.batchLabel}
            </span>
          </div>

          <h1 className="font-display mt-5 text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
            {testimonial.name}
          </h1>
          <p className="mt-2 inline-flex flex-wrap items-center gap-x-1.5 text-sm font-medium text-primary">
            <span>Sukses menjadi {testimonial.role} di</span>
            <CompanyLockup
              company={testimonial.company}
              logo={testimonial.companyLogo}
              className="text-primary"
            />
          </p>
        </div>

        <div className="border-t border-zinc-100 bg-zinc-50/80 px-6 py-6 md:px-8">
          <blockquote className="text-[15px] leading-relaxed text-zinc-800 md:text-base">
            “{testimonial.quote}”
          </blockquote>
        </div>
      </motion.header>

      {testimonial.qa.length > 0 ? (
        <div className="mt-10 space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">
            The story
          </p>
          {testimonial.qa.map((item, i) => (
            <motion.section
              key={item.question}
              className="space-y-3"
              initial={hidden}
              whileInView={reduceMotion ? undefined : shown}
              viewport={reduceMotion ? undefined : { once: true, margin: "-60px" }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { ...spring, delay: i * 0.06 }
              }
            >
              <p className="rounded-2xl bg-primary/10 px-4 py-3 text-sm font-semibold leading-snug text-primary md:px-5">
                {item.question}
              </p>
              <p className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-4 text-sm leading-relaxed text-zinc-700 shadow-sm md:px-5 md:text-[15px]">
                {item.answer}
              </p>
            </motion.section>
          ))}
        </div>
      ) : null}

      {testimonial.storyParagraphs && testimonial.storyParagraphs.length > 0 ? (
        <motion.div
          className="mt-10 space-y-4"
          initial={hidden}
          whileInView={reduceMotion ? undefined : shown}
          viewport={reduceMotion ? undefined : { once: true, margin: "-60px" }}
          transition={reduceMotion ? { duration: 0 } : spring}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">
            The story
          </p>
          {testimonial.storyParagraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-4 text-sm leading-relaxed text-zinc-700 shadow-sm md:px-5 md:text-[15px]"
            >
              {paragraph}
            </p>
          ))}
        </motion.div>
      ) : null}

      {testimonial.tips ? (
        <motion.section
          className="mt-10 space-y-3"
          initial={hidden}
          whileInView={reduceMotion ? undefined : shown}
          viewport={reduceMotion ? undefined : { once: true, margin: "-60px" }}
          transition={reduceMotion ? { duration: 0 } : spring}
        >
          <p className="rounded-2xl bg-primary/10 px-4 py-3 text-sm font-semibold leading-snug text-primary md:px-5">
            {testimonial.tipsQuestion ??
              "Ada tips & saran buat teman-teman yang lagi mau mulai belajar data science atau data analytics?"}
          </p>
          <p className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-4 text-sm leading-relaxed text-zinc-700 shadow-sm md:px-5 md:text-[15px]">
            {testimonial.tips}
          </p>
        </motion.section>
      ) : null}

      <footer className="mt-12 flex flex-col gap-4 border-t border-zinc-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-600">
          Digica Academy alumni — story shared with permission.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/testimonials">More stories</Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link href="/#programs">Explore programs</Link>
          </Button>
        </div>
      </footer>
    </article>
  );
}
