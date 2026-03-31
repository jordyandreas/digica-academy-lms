"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PenTool,
  LayoutTemplate,
  Rocket,
  Star,
  ChevronsRight,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Course } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { useCourse } from "@/features/courses/hooks/useCourse";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AuthModal } from "@/components/auth/AuthModal";

const iconProps = {
  className: "h-6 w-6",
  "aria-hidden": true as const,
};

/** Slug → icon via static JSX so no component type is chosen during render. */
function CourseCardIcon({ slug }: { slug: string }) {
  switch (slug) {
    case "data-analyst-python":
      return <PenTool {...iconProps} />;
    case "data-analyst-sql-bigquery":
      return <LayoutTemplate {...iconProps} />;
    case "data-science-end-to-end":
      return <Rocket {...iconProps} />;
    default:
      return <Rocket {...iconProps} />;
  }
}

interface CourseCardProps {
  course: Course;
  /** Purchased / My courses: no price, “Continue learning” instead of enroll. */
  variant?: "default" | "enrolled";
}

export function CourseCard({ course, variant = "default" }: CourseCardProps) {
  const reduceMotion = useReducedMotion();
  const { progressPercent } = useCourse(course.slug);
  const { isLoggedIn, login } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const isEnrolled = variant === "enrolled";
  const sessionsLabel =
    typeof course.sessions === "number"
      ? `${course.sessions} Sessions`
      : course.level;

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
      <Card className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200/80 bg-white/90 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-lg">
        <div className="flex items-stretch gap-3 px-5 pt-5">
          <div className="flex w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-linear-to-br from-white/55 to-primary/12 text-primary shadow-[0_2px_12px_rgba(108,43,141,0.07)] ring-1 ring-inset ring-white/60 backdrop-blur-md backdrop-saturate-150">
            <CourseCardIcon slug={course.slug} />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <h3 className="line-clamp-3 text-[0.95rem] font-bold leading-snug tracking-tight text-zinc-900">
              {course.title}
            </h3>
            <span className="inline-flex w-fit rounded-full bg-primary/8 px-2.5 py-1 text-[11px] font-medium capitalize text-primary">
              {sessionsLabel}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
          <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500">
            {course.description}
          </p>

          {typeof course.rating === "number" ? (
            <div className="mt-3 flex min-w-0 items-center gap-1.5">
              <Star
                className="h-4 w-4 shrink-0 fill-amber-400 text-amber-400"
                aria-hidden
              />
              <span className="text-sm font-bold tabular-nums text-zinc-900">
                {course.rating.toFixed(1)}
              </span>
              {(typeof course.studentCount === "number" ||
                typeof course.reviewCount === "number") && (
                <span className="truncate text-xs text-zinc-500">
                  (
                  {typeof course.studentCount === "number"
                    ? course.studentCount.toLocaleString()
                    : course.reviewCount}
                  )
                </span>
              )}
            </div>
          ) : null}

          {isEnrolled || progressPercent > 0 ? (
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-[11px] text-zinc-500">
                <span>Progress</span>
                <span className="tabular-nums">{progressPercent}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          ) : null}

          <div className="my-4 h-px w-full bg-zinc-100" aria-hidden />

          <div
            className={
              isEnrolled
                ? "mt-auto flex justify-end pt-0.5"
                : "mt-auto flex items-end justify-between gap-3 pt-0.5"
            }
          >
            {!isEnrolled ? (
              <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-lg font-bold tabular-nums text-zinc-900">
                  {course.priceLabel ?? "—"}
                </span>
                {course.priceCompareLabel ? (
                  <span className="text-xs font-medium tabular-nums text-zinc-400 line-through decoration-zinc-300">
                    {course.priceCompareLabel}
                  </span>
                ) : null}
              </div>
            ) : null}
            <Link
              href={`/courses/${course.slug}`}
              aria-label={
                isEnrolled
                  ? `Continue learning ${course.title}`
                  : `Enroll in ${course.title}`
              }
              className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-primary px-3 py-2 text-[11px] font-semibold text-primary-foreground shadow-sm ring-1 ring-primary/25 transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              onClick={(e) => {
                if (isEnrolled) return;
                if (isLoggedIn) return;
                e.preventDefault();
                setAuthModalOpen(true);
              }}
            >
              <ChevronsRight className="h-3.5 w-3.5 opacity-90" aria-hidden />
              {isEnrolled ? "Continue learning" : "Enroll now"}
            </Link>
          </div>
        </div>
      </Card>

      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        onLogin={(e) => login(e ?? undefined)}
      />
    </motion.div>
  );
}
