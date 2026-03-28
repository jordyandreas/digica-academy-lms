"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Course, Lesson } from "@/lib/types";
import { excerptFromLessonContent, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useCourse } from "@/features/courses/hooks/useCourse";
import { useCourseAccess } from "@/features/courses/hooks/useCourseAccess";
import { PlayCircle } from "lucide-react";

const FALLBACK_COVER = "/images/placeholder/placeholder.webp";

type LessonStatus = "not_started" | "in_progress" | "completed";

interface CourseLessonCardsProps {
  course: Course;
}

export function CourseLessonCards({ course }: CourseLessonCardsProps) {
  const reduceMotion = useReducedMotion();
  const { isPurchased, isLessonVisited } = useCourseAccess();
  const { isLessonCompleted } = useCourse(course.slug);
  const purchased = isPurchased(course.slug);

  const rows = course.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      lesson,
      moduleTitle: module.title,
    }))
  );

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.07,
        delayChildren: reduceMotion ? 0 : 0.06,
      },
    },
  } as const;

  const itemVariants = {
    hidden: reduceMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 280,
        damping: 26,
        mass: 0.65,
      },
    },
  } as const;

  return (
    <section className="mt-12">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 260, damping: 24 }
        }
      >
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
          Lessons
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Work through each lesson in order or jump to a topic you need.
        </p>
      </motion.div>

      <motion.ul
        className="mt-8 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {rows.map(({ lesson, moduleTitle }, index) => (
          <motion.li
            key={lesson.id}
            variants={itemVariants}
            className="h-full min-h-0"
          >
            <LessonCard
              courseSlug={course.slug}
              lesson={lesson}
              moduleTitle={moduleTitle}
              purchased={purchased}
              index={index}
              status={lessonStatus(
                lesson,
                purchased,
                isLessonCompleted,
                isLessonVisited
              )}
              reduceMotion={!!reduceMotion}
            />
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

function lessonStatus(
  lesson: Lesson,
  purchased: boolean,
  isLessonCompleted: (id: string) => boolean,
  isLessonVisited: (id: string) => boolean
): LessonStatus {
  if (isLessonCompleted(lesson.id)) return "completed";
  if (purchased && isLessonVisited(lesson.id)) return "in_progress";
  return "not_started";
}

interface LessonCardProps {
  courseSlug: string;
  lesson: Lesson;
  moduleTitle: string;
  purchased: boolean;
  status: LessonStatus;
  index: number;
  reduceMotion: boolean;
}

function LessonCard({
  courseSlug,
  lesson,
  moduleTitle,
  purchased,
  status,
  index,
  reduceMotion,
}: LessonCardProps) {
  const href = `/courses/${courseSlug}/lesson/${lesson.slug}`;
  const excerpt = excerptFromLessonContent(lesson.content, 130);
  const cover = lesson.coverImage ?? FALLBACK_COVER;

  const statusLabel =
    status === "completed"
      ? "Completed"
      : status === "in_progress"
        ? "In progress"
        : "Not started";

  const statusVariant =
    status === "completed"
      ? ("beginner" as const)
      : status === "in_progress"
        ? ("intermediate" as const)
        : ("outline" as const);

  const actionLabel =
    status === "completed"
      ? "Review"
      : status === "in_progress"
        ? "Continue"
        : "Start lesson";

  return (
    <motion.div
      className="h-full min-h-0 w-full"
      whileHover={
        reduceMotion ? undefined : { y: -6, transition: { duration: 0.2 } }
      }
      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
    >
      <Link
        href={href}
        className={cn(
          "group flex h-full w-full flex-col rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        )}
        aria-label={
          purchased ? `${actionLabel}: ${lesson.title}` : lesson.title
        }
      >
        <Card
          className={cn(
            "flex h-full min-h-0 flex-col overflow-hidden pt-0",
            "border-zinc-200/80 transition-shadow duration-200",
            "group-hover:border-primary/35 group-hover:shadow-lg"
          )}
        >
          <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-zinc-100">
            <Image
              src={cover}
              alt=""
              fill
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={index < 3}
            />
            <div
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-zinc-900/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden
            />
            <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-primary-foreground/95 px-2.5 py-0.5 text-[11px] font-medium text-primary opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 translate-y-1">
              Lesson {index + 1}
            </span>
          </div>
          <CardHeader className="shrink-0 space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 transition-colors group-hover:text-primary/80">
              {moduleTitle}
            </p>
            <div className="flex min-h-17 flex-col gap-2 sm:min-h-15">
              <div className="flex flex-wrap items-start gap-x-2 gap-y-1.5">
                <h3 className="min-w-0 flex-1 text-base font-semibold leading-snug text-zinc-900 group-hover:text-primary">
                  {lesson.title}
                </h3>
                <Badge
                  variant={statusVariant}
                  className="shrink-0 font-normal capitalize"
                >
                  {statusLabel}
                </Badge>
              </div>
              <p className="text-sm text-zinc-500">{lesson.duration} min</p>
            </div>
          </CardHeader>
          <CardContent className="min-h-0 flex-1">
            <p className="text-sm leading-relaxed text-zinc-600">{excerpt}</p>
          </CardContent>
          {purchased ? (
            <CardFooter className="mt-auto shrink-0">
              <span
                className={cn(
                  buttonVariants({
                    variant: "default",
                    size: "default",
                  }),
                  "pointer-events-none transition-transform duration-200 group-hover:gap-2.5"
                )}
              >
                <PlayCircle className="h-4 w-4" aria-hidden />
                {actionLabel}
              </span>
            </CardFooter>
          ) : null}
        </Card>
      </Link>
    </motion.div>
  );
}
