"use client";

import { useMemo } from "react";
import { getCourseBySlug } from "@/features/courses/data/courses";
import type { Course } from "@/lib/types";
import { useLessonProgress } from "@/features/progress/hooks/useLessonProgress";

export function useCourse(courseSlug: string | null) {
  const course = useMemo(
    () => (courseSlug ? getCourseBySlug(courseSlug) : undefined),
    [courseSlug]
  );

  const { isLessonCompleted, getCompletedLessons } = useLessonProgress();

  const totalLessons = useMemo(() => {
    if (!course) return 0;
    return course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  }, [course]);

  const completedCount = useMemo(() => {
    if (!course) return 0;
    const completed = getCompletedLessons();
    return course.modules.reduce((acc, m) => {
      return acc + m.lessons.filter((l) => completed.includes(l.id)).length;
    }, 0);
  }, [course, getCompletedLessons]);

  const progressPercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return {
    course,
    totalLessons,
    completedCount,
    progressPercent,
    isLessonCompleted,
  };
}
