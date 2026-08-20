"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ProgramCard } from "@/components/program/ProgramCard";
import { Button } from "@/components/ui/button";
import type { PublicProgramsResult } from "@/features/programs/types";

const HOME_PROGRAMS_LIMIT = 3;

type ProgramsSectionProps = {
  result: PublicProgramsResult;
  sectionId?: string;
  heading?: string;
  description?: string;
  headingAs?: "h1" | "h2";
  showTagline?: boolean;
  /** Cap cards on the homepage. Catalog pages omit this. */
  limit?: number;
  seeAllHref?: string;
};

export default function ProgramsSection({
  result,
  sectionId = "programs",
  heading = "Upcoming programs",
  description = "Mini Bootcamp SQL, Mini Bootcamp Data Analytics, and Data Science Bootcamp.",
  headingAs = "h2",
  showTagline = true,
  limit,
  seeAllHref,
}: ProgramsSectionProps) {
  const reduceMotion = useReducedMotion();
  const { programs, error } = result;
  const visiblePrograms =
    typeof limit === "number" ? programs.slice(0, limit) : programs;
  const showSeeAll =
    Boolean(seeAllHref) &&
    !error &&
    programs.length > (limit ?? HOME_PROGRAMS_LIMIT);

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.04,
      },
    },
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 24,
        mass: 0.65,
      },
    },
  } as const;

  return (
    <section id={sectionId} className="scroll-mt-24 px-6 py-16 md:py-20">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            {headingAs === "h1" ? (
              <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-900">
                {heading}
              </h1>
            ) : (
              <h2 className="font-display text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">
                {heading}
              </h2>
            )}
            <p className="max-w-xl text-sm text-zinc-600 md:text-[0.95rem]">
              {description}
            </p>
          </div>
          {showTagline ? (
            <p className="text-xs text-zinc-500">Live cohorts</p>
          ) : null}
        </div>

        {error ? (
          <div
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm leading-relaxed text-red-800"
            role="alert"
          >
            <p className="font-semibold text-red-900">
              Could not load programs
            </p>
            <p className="mt-1 break-words font-mono text-xs text-red-700">
              {error}
            </p>
            <p className="mt-3 text-xs text-red-700/90">
              Ensure{" "}
              <code className="rounded bg-red-100 px-1">
                SUPABASE_SERVICE_ROLE_KEY
              </code>{" "}
              is set in{" "}
              <code className="rounded bg-red-100 px-1">.env.local</code>{" "}
              (server-only), or add a public SELECT RLS policy on{" "}
              <code className="rounded bg-red-100 px-1">programs</code> for{" "}
              <code className="rounded bg-red-100 px-1">anon</code> and{" "}
              <code className="rounded bg-red-100 px-1">authenticated</code>{" "}
              with{" "}
              <code className="rounded bg-red-100 px-1">
                status = &apos;active&apos;
              </code>
              .
            </p>
          </div>
        ) : programs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-10 text-center">
            <p className="text-sm font-medium text-zinc-800">
              No upcoming programs right now
            </p>
            <p className="mt-1 text-sm text-zinc-600">
              Check back soon for the next workshop or bootcamp cohort.
            </p>
          </div>
        ) : (
          <motion.div
            className="grid gap-6 md:grid-cols-3"
            variants={containerVariants}
            initial={reduceMotion ? "show" : "hidden"}
            whileInView={reduceMotion ? undefined : "show"}
            viewport={
              reduceMotion ? undefined : { once: true, margin: "-80px" }
            }
          >
            {visiblePrograms.map((program) => (
              <motion.div
                key={program.id}
                className="h-full"
                variants={cardVariants}
              >
                <ProgramCard program={program} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {showSeeAll && seeAllHref ? (
          <div className="flex justify-center pt-2">
            <Button asChild size="lg" variant="outline" className="rounded-full px-8">
              <Link href={seeAllHref}>See all programs</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
