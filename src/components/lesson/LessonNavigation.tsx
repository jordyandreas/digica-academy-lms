"use client";

import Link from "next/link";
import type { Course, Lesson, Module } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight } from "lucide-react";

interface LessonNavigationProps {
  course: Course;
  currentLesson: Lesson;
  currentModule: Module;
  onMarkCompleted: () => void;
  isCompleted: boolean;
}

export function LessonNavigation({
  course,
  currentLesson,
  currentModule,
  onMarkCompleted,
  isCompleted,
}: LessonNavigationProps) {
  const flatLessons: { lesson: Lesson; module: Module }[] = [];
  course.modules.forEach((mod) => {
    mod.lessons.forEach((lesson) => flatLessons.push({ lesson, module: mod }));
  });

  const currentIndex = flatLessons.findIndex(({ lesson }) => lesson.id === currentLesson.id);
  const next = currentIndex >= 0 && currentIndex < flatLessons.length - 1
    ? flatLessons[currentIndex + 1]
    : null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <Button
        variant={isCompleted ? "secondary" : "default"}
        onClick={onMarkCompleted}
        disabled={isCompleted}
        className="gap-2 rounded-lg px-5 sm:px-6"
      >
        {isCompleted ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Completed
          </>
        ) : (
          "Mark as completed"
        )}
      </Button>
      {next ? (
        <Button
          asChild
          variant="default"
          className="gap-2 rounded-lg px-5 sm:px-6"
        >
          <Link href={`/courses/${course.slug}/lesson/${next.lesson.slug}`}>
            <span className="hidden sm:inline">Next:</span>{" "}
            <span className="truncate max-w-44 align-middle sm:max-w-xs">
              {next.lesson.title}
            </span>
            <ChevronRight className="ml-1 h-4 w-4 shrink-0" />
          </Link>
        </Button>
      ) : (
        <Button
          asChild
          variant="outline"
          className="rounded-lg px-5 sm:px-6"
        >
          <Link href={`/courses/${course.slug}`}>Back to course</Link>
        </Button>
      )}
    </div>
  );
}
