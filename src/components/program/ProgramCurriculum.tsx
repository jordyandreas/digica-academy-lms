"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Card } from "@/components/ui/card";
import type { ProgramCurriculum } from "@/features/skills/data/programCurricula";
import { cn } from "@/lib/utils";

const programCardClassName =
  "flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm transition-all duration-200 hover:border-primary/25 hover:shadow-lg md:p-5";

export function HoverLift({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="h-full"
      whileHover={reduceMotion ? undefined : { y: -6, scale: 1.01 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 320, damping: 28 }
      }
    >
      {children}
    </motion.div>
  );
}

type ProgramCurriculumProps = {
  curriculum: ProgramCurriculum;
  /** landing = 2-col phase cards with hover; compact = stacked, no hover */
  variant?: "landing" | "compact";
};

export function ProgramCurriculum({
  curriculum,
  variant = "compact",
}: ProgramCurriculumProps) {
  if (curriculum.phases?.length) {
    return (
      <div
        className={cn(
          "grid gap-3",
          variant === "landing" ? "gap-4 sm:grid-cols-2" : "grid-cols-1"
        )}
      >
        {curriculum.phases.map((phase, phaseIndex) => {
          const card = (
            <Card
              className={cn(
                programCardClassName,
                variant === "compact" && "hover:border-zinc-200/80 hover:shadow-sm"
              )}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
                    {phase.sessionRange}
                  </p>
                  <h4 className="text-sm font-semibold text-zinc-900">
                    {phase.title}
                  </h4>
                </div>
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/5 text-[11px] font-medium text-primary">
                  {phaseIndex + 1}
                </span>
              </div>
              <ol className="space-y-2 border-t border-zinc-100 pt-3">
                {phase.modules.map((module, moduleIndex) => (
                  <li
                    key={module}
                    className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-baseline gap-x-1 text-xs leading-snug text-zinc-600"
                  >
                    <span className="font-semibold tabular-nums text-primary/70">
                      {phase.startSession + moduleIndex}.
                    </span>
                    <span>{module}</span>
                  </li>
                ))}
              </ol>
            </Card>
          );

          return variant === "landing" ? (
            <HoverLift key={phase.title}>{card}</HoverLift>
          ) : (
            <div key={phase.title}>{card}</div>
          );
        })}
      </div>
    );
  }

  return (
    <ol className="flex flex-col gap-2">
      {curriculum.modules.map((module, index) => (
        <li
          key={`${curriculum.id}-${module}`}
          className="flex items-center gap-3 rounded-xl border border-zinc-200/80 bg-white px-3 py-2.5"
        >
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/5 text-[11px] font-semibold tabular-nums text-primary">
            {index + 1}
          </span>
          <span className="text-xs leading-snug text-zinc-700 md:text-[0.8rem]">
            {module}
          </span>
        </li>
      ))}
    </ol>
  );
}
