"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useCallback } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import type { Course } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CourseProgress } from "@/app/courses/[courseSlug]/CourseProgress";
import { useCourse } from "@/features/courses/hooks/useCourse";
import { useCourseAccess } from "@/features/courses/hooks/useCourseAccess";
import { Check, PlayCircle, ShoppingBag, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseOverviewBannerProps {
  course: Course;
}

function splitInstructorCredentials(credentials: string) {
  const idx = credentials.indexOf("|");
  if (idx === -1) {
    return { headline: credentials.trim(), detail: null as string | null };
  }
  return {
    headline: credentials.slice(0, idx).trim(),
    detail: credentials.slice(idx + 1).trim(),
  };
}

export function CourseOverviewBanner({ course }: CourseOverviewBannerProps) {
  const reduceMotion = useReducedMotion();
  const { isPurchased, purchaseCourse, isLessonVisited } = useCourseAccess();
  const { totalLessons, completedCount, isLessonCompleted } = useCourse(
    course.slug
  );
  const [enrolledFlash, setEnrolledFlash] = useState(false);

  const purchased = isPurchased(course.slug);

  const lessonIds = useMemo(
    () => course.modules.flatMap((m) => m.lessons.map((l) => l.id)),
    [course.modules]
  );

  const started = useMemo(() => {
    if (!purchased || lessonIds.length === 0) return false;
    return lessonIds.some(
      (id) => isLessonVisited(id) || isLessonCompleted(id)
    );
  }, [
    purchased,
    lessonIds,
    isLessonVisited,
    isLessonCompleted,
  ]);

  const firstLesson = course.modules[0]?.lessons[0];
  const outcomes = course.outcomes?.length
    ? course.outcomes
    : [
        "Apply what you learn with practical, job-relevant exercises.",
        "Build confidence with a clear path from basics to real projects.",
      ];

  const instructorCredParts = useMemo(() => {
    if (!course.instructor) return null;
    return splitInstructorCredentials(course.instructor.credentials);
  }, [course.instructor]);

  const handlePurchase = useCallback(() => {
    purchaseCourse(course.slug);
    setEnrolledFlash(true);
    window.setTimeout(() => setEnrolledFlash(false), 3800);
  }, [course.slug, purchaseCourse]);

  const contentSpring = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 220, damping: 26, mass: 0.8 };

  const listVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.08,
        delayChildren: reduceMotion ? 0 : 0.15,
      },
    },
  } as const;

  const rowVariants = {
    hidden: reduceMotion
      ? { opacity: 1, x: 0 }
      : { opacity: 0, x: -12 },
    show: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 320, damping: 28 },
    },
  } as const;

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-zinc-800/40",
        "bg-linear-to-br from-primary to-secondary",
        "px-4 py-8 text-primary-foreground sm:px-6 md:py-12"
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full border border-primary-foreground/20" />
        <div className="absolute right-[-32px] top-6 h-40 w-40 rounded-full border border-primary-foreground/10" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:gap-10">
        <div className="space-y-5 md:flex-1 md:space-y-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={contentSpring}
          >
            <Badge
              variant={course.level}
              className="border-primary-foreground/30 bg-primary-foreground/15 capitalize text-primary-foreground shadow-none"
            >
              {course.level}
            </Badge>
          </motion.div>

          <motion.div
            className="space-y-3"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...contentSpring, delay: reduceMotion ? 0 : 0.05 }}
          >
            <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
              {course.title}
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-primary-foreground/80">
              {course.description}
            </p>
          </motion.div>

          <motion.p
            className="text-sm font-medium text-primary-foreground/90"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduceMotion ? 0 : 0.12 }}
          >
            {totalLessons} lesson{totalLessons === 1 ? "" : "s"}
            {purchased && started && (
              <span className="ml-2 font-normal text-primary-foreground/70">
                · {completedCount} completed
              </span>
            )}
          </motion.p>

          <AnimatePresence mode="wait">
            {purchased && started && totalLessons > 0 && (
              <motion.div
                key="progress"
                className="max-w-xl"
                initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.25 }}
              >
                <CourseProgress courseSlug={course.slug} variant="onPrimary" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="border-t border-primary-foreground/20 pt-5 md:pt-6">
            <motion.h2
              className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/70"
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={reduceMotion ? undefined : { opacity: 1 }}
              viewport={{ once: true }}
            >
              What you&apos;ll achieve
            </motion.h2>
            <motion.ul
              className="mt-3 space-y-2"
              variants={listVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-20px" }}
            >
              {outcomes.map((line) => (
                <motion.li
                  key={line}
                  variants={rowVariants}
                  className="group/row flex gap-2.5 text-xs text-primary-foreground/90 sm:text-sm"
                  whileHover={
                    reduceMotion
                      ? undefined
                      : { x: 4, transition: { type: "spring", stiffness: 400, damping: 28 } }
                  }
                >
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15 text-primary-foreground transition-colors group-hover/row:bg-primary-foreground/25 sm:h-5 sm:w-5">
                    <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" aria-hidden />
                  </span>
                  <span>{line}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            className="flex flex-col gap-2.5"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduceMotion ? 0 : 0.2, ...contentSpring }}
          >
            <div className="flex flex-wrap items-center gap-2.5">
              {purchased && firstLesson ? (
                <Button
                  asChild
                  size="default"
                  className="gap-2 bg-primary-foreground px-5 text-primary hover:bg-primary-foreground/90"
                >
                  <Link href={`/courses/${course.slug}/lesson/${firstLesson.slug}`}>
                    <PlayCircle className="h-4 w-4" />
                    Start course
                  </Link>
                </Button>
              ) : (
                <>
                  <motion.div
                    whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                  >
                    <Button
                      type="button"
                      size="default"
                      className="gap-2 bg-primary-foreground px-5 text-primary hover:bg-primary-foreground/90 cursor-pointer"
                      onClick={handlePurchase}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Buy course
                    </Button>
                  </motion.div>
                  <div className="flex min-w-0 flex-wrap gap-x-2.5 gap-y-1 items-center">
                    <span className="text-4xl font-bold tabular-nums tracking-tight text-primary-foreground sm:text-5xl">
                      {course.priceLabel ?? "—"}
                    </span>
                    {course.priceCompareLabel ? (
                      <span className="text-xl font-semibold tabular-nums text-primary-foreground/45 line-through decoration-primary-foreground/35 sm:text-2xl">
                        {course.priceCompareLabel}
                      </span>
                    ) : null}
                  </div>
                </>
              )}
              <p className="text-xs text-primary-foreground/65">
                {purchased
                  && "Jump into the first lesson or pick one below."}
              </p>
            </div>

            <AnimatePresence>
              {enrolledFlash && (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/15 px-4 py-2 text-xs font-medium text-primary-foreground backdrop-blur"
                >
                  <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  You&apos;re in — scroll down to start your lessons.
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="md:flex-1">
          <div className="mt-2 flex justify-center md:mt-0 md:justify-end">
            <motion.div
              className="relative w-full max-w-70 sm:max-w-76 md:max-w-82"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: reduceMotion ? 0 : 0.1,
                type: "spring",
                stiffness: 200,
                damping: 22,
              }}
              whileHover={
                reduceMotion ? undefined : { scale: 1.02, y: -2 }
              }
            >
              <div className="relative aspect-3/4 w-full">
                <motion.div
                  className="relative h-full w-full"
                  animate={
                    reduceMotion ? undefined : { y: [0, -4, 0] }
                  }
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Image
                    src="/images/character/character_2.png"
                    alt={
                      course.instructor
                        ? `${course.instructor.name}, course instructor`
                        : "Digica Academy learner"
                    }
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 280px, (max-width: 768px) 304px, 328px"
                    priority
                  />
                </motion.div>

                {course.instructor && instructorCredParts ? (
                  <motion.div
                    className={cn(
                      "absolute inset-x-3 bottom-3 rounded-2xl px-3.5 py-3 sm:inset-x-3.5 sm:px-4 sm:py-3.5",
                      "border border-white/30 bg-white/18 shadow-[0_8px_40px_rgba(0,0,0,0.2)]",
                      "backdrop-blur-xl backdrop-saturate-150",
                      "ring-1 ring-inset ring-white/25"
                    )}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: reduceMotion ? 0 : 0.18,
                      type: "spring",
                      stiffness: 280,
                      damping: 28,
                    }}
                  >
                    <div className="space-y-1 text-left">
                      <p className="text-[0.95rem] font-bold leading-snug tracking-tight text-white drop-shadow-sm sm:text-base">
                        <span>{course.instructor.name}</span>
                        <span className="font-semibold text-white/95">
                          {" "}
                          — {instructorCredParts.headline}
                        </span>
                      </p>
                      {instructorCredParts.detail ? (
                        <p className="text-[0.8rem] font-medium leading-relaxed text-white/88 sm:text-[0.85rem]">
                          {instructorCredParts.detail}
                        </p>
                      ) : null}
                    </div>
                  </motion.div>
                ) : null}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
