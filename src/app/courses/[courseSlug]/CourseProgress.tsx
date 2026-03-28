"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCourse } from "@/features/courses/hooks/useCourse";

interface CourseProgressProps {
  courseSlug: string;
  /** Use on primary gradient heroes (light text / glass on color). */
  variant?: "default" | "onPrimary";
}

export function CourseProgress({
  courseSlug,
  variant = "default",
}: CourseProgressProps) {
  const { progressPercent, completedCount, totalLessons } = useCourse(courseSlug);
  const reduceMotion = useReducedMotion();

  if (totalLessons === 0) return null;

  const transition = reduceMotion
    ? ({ duration: 0 } as const)
    : ({
        type: "spring",
        stiffness: 160,
        damping: 18,
        mass: 0.7,
      } as const);

  const shell =
    variant === "onPrimary"
      ? "rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 p-4 backdrop-blur"
      : "glass-panel rounded-xl border border-zinc-200/80 p-4";

  return (
    <div className={shell}>
      <div className="flex justify-between text-sm">
        <span
          className={
            variant === "onPrimary"
              ? "font-medium text-primary-foreground"
              : "font-medium text-zinc-700"
          }
        >
          Your progress
        </span>
        <span
          className={
            variant === "onPrimary"
              ? "text-primary-foreground/75"
              : "text-zinc-500"
          }
        >
          {completedCount} / {totalLessons} lessons
        </span>
      </div>
      <div
        className={
          variant === "onPrimary"
            ? "mt-2 h-2 w-full overflow-hidden rounded-full bg-primary-foreground/20"
            : "mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-200"
        }
      >
        <motion.div
          className={
            variant === "onPrimary"
              ? "h-full rounded-full bg-primary-foreground"
              : "h-full rounded-full bg-foreground"
          }
          initial={reduceMotion ? false : { width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={transition}
        />
      </div>
    </div>
  );
}
