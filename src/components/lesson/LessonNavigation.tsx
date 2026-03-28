"use client";

import Link from "next/link";
import type { Course, Lesson, Module } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

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
        className="gap-2"
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
        <Button asChild variant="default" className="gap-2">
          <Link href={`/courses/${course.slug}/lesson/${next.lesson.slug}`}>
            Next: {next.lesson.title}
          </Link>
        </Button>
      ) : (
        <Button asChild variant="outline">
          <Link href={`/courses/${course.slug}`}>Back to course</Link>
        </Button>
      )}
    </div>
  );
}
