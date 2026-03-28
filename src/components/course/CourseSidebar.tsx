"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { Course, Module } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useLessonProgress } from "@/features/progress/hooks/useLessonProgress";
import { CheckCircle2, Circle, ChevronDown, BookOpen } from "lucide-react";

interface CourseSidebarProps {
  course: Course;
}

export function CourseSidebar({ course }: CourseSidebarProps) {
  const pathname = usePathname();
  const { isLessonCompleted } = useLessonProgress();

  return (
    <aside className="glass-panel w-64 shrink-0 border-r border-zinc-200/80">
      <div className="sticky top-0 flex h-full flex-col overflow-y-auto py-6">
        <div className="px-4 pb-4">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-primary"
          >
            <BookOpen className="h-4 w-4" />
            All courses
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-2">
          <p className="px-2 py-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
            {course.title}
          </p>
          {course.modules.map((module) => (
            <ModuleSection
              key={module.id}
              module={module}
              courseSlug={course.slug}
              pathname={pathname}
              isLessonCompleted={isLessonCompleted}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
}

interface ModuleSectionProps {
  module: Module;
  courseSlug: string;
  pathname: string;
  isLessonCompleted: (lessonId: string) => boolean;
}

function ModuleSection({
  module,
  courseSlug,
  pathname,
  isLessonCompleted,
}: ModuleSectionProps) {
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion
    ? ({ duration: 0 } as const)
    : ({
        type: "spring",
        stiffness: 420,
        damping: 34,
        mass: 0.8,
      } as const);

  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-zinc-700">
        <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400" />
        {module.title}
      </div>
      <ul className="space-y-0.5">
        {module.lessons.map((lesson) => {
          const href = `/courses/${courseSlug}/lesson/${lesson.slug}`;
          const isActive = pathname === href;

          return (
            <li key={lesson.id}>
              <Link
                href={href}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "font-medium text-primary"
                    : "text-zinc-600 hover:bg-zinc-200/80 hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeLessonBg"
                    className="absolute inset-0 rounded-md bg-primary/10"
                    transition={transition}
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {isLessonCompleted(lesson.id) ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-zinc-400" />
                  )}
                  <span className="truncate">{lesson.title}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
