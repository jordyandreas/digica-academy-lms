"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EXPERIENCE_POINTS } from "@/features/experience/data/experiencePoints";
import {
  DEFAULT_CURRICULUM_ID,
  PROGRAM_CURRICULA,
  type ProgramCurriculumId,
} from "@/features/skills/data/programCurricula";
import { ProgramCurriculum, HoverLift } from "@/components/program/ProgramCurriculum";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const methodGridVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
} as const;

const methodCardVariants = {
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

export default function SkillsSection() {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] =
    useState<ProgramCurriculumId>(DEFAULT_CURRICULUM_ID);
  const active =
    PROGRAM_CURRICULA.find((track) => track.id === activeId) ??
    PROGRAM_CURRICULA[0]!;

  return (
    <section
      id="curriculum"
      className="relative scroll-mt-24 border-y border-primary/10 bg-gradient-to-b from-white/90 via-primary/5 to-secondary/5 px-6 py-16 md:py-20"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-2xl" />

      <div className="mx-auto max-w-6xl space-y-10 md:space-y-12">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Curriculum
          </div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">
            What you will learn
          </h2>
          <p className="max-w-xl text-sm text-zinc-600 md:text-[0.95rem]">
            Switch tracks to see the live sessions for Data Science Bootcamp,
            Mini Bootcamp SQL, or Mini Bootcamp Data Analytics.
          </p>
        </div>

        <div className="space-y-5">
          <div
            role="tablist"
            aria-label="Program curriculum"
            className="flex flex-wrap gap-2"
          >
            {PROGRAM_CURRICULA.map((track) => {
              const isActive = track.id === activeId;
              return (
                <Button
                  key={track.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  size="sm"
                  variant={isActive ? "default" : "outline"}
                  className={cn(
                    "rounded-full",
                    !isActive && "border-zinc-200 text-zinc-700"
                  )}
                  onClick={() => setActiveId(track.id)}
                >
                  {track.tabLabel}
                </Button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-end justify-between gap-2">
            <h3 className="font-display text-base font-semibold tracking-tight text-zinc-900 md:text-lg">
              {active.title}
            </h3>
            <p className="text-xs text-zinc-500">{active.sessionLabel}</p>
          </div>

          <motion.div
            key={active.id}
            variants={methodGridVariants}
            initial={reduceMotion ? "show" : "hidden"}
            animate="show"
          >
            <ProgramCurriculum
              curriculum={active}
              variant={active.phases ? "landing" : "compact"}
            />
          </motion.div>
        </div>

        <div className="space-y-4">
          <h3 className="font-display text-base font-semibold tracking-tight text-zinc-900 md:text-lg">
            How you learn it
          </h3>
          <motion.div
            className="grid gap-4 md:grid-cols-3 md:gap-6"
            variants={methodGridVariants}
            initial={reduceMotion ? "show" : "hidden"}
            whileInView={reduceMotion ? undefined : "show"}
            viewport={reduceMotion ? undefined : { once: true, margin: "-80px" }}
          >
            {EXPERIENCE_POINTS.map((point, index) => (
              <motion.div
                key={point.id}
                className="h-full"
                variants={methodCardVariants}
              >
                <HoverLift>
                  <Card className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm transition-all duration-200 hover:border-primary/25 hover:shadow-lg md:p-5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-zinc-900">
                      {point.title}
                    </h4>
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/5 text-[11px] font-medium text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-600">
                    {point.description}
                  </p>
                </Card>
                </HoverLift>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
