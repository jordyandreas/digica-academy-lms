"use client";

import { useCallback, useState } from "react";

const STORAGE_KEY = "digica_course_access";

type Stored = {
  purchased: string[];
  visitedLessons: string[];
};

function read(): Stored {
  if (typeof window === "undefined") {
    return { purchased: [], visitedLessons: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { purchased: [], visitedLessons: [] };
    const p = JSON.parse(raw) as Partial<Stored>;
    return {
      purchased: Array.isArray(p.purchased) ? p.purchased : [],
      visitedLessons: Array.isArray(p.visitedLessons) ? p.visitedLessons : [],
    };
  } catch {
    return { purchased: [], visitedLessons: [] };
  }
}

function write(data: Stored) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useCourseAccess() {
  const [state, setState] = useState<Stored>(() => read());

  const isPurchased = useCallback(
    (courseSlug: string) => state.purchased.includes(courseSlug),
    [state.purchased]
  );

  const purchaseCourse = useCallback((courseSlug: string) => {
    const data = read();
    if (data.purchased.includes(courseSlug)) return;
    data.purchased.push(courseSlug);
    write(data);
    setState({ ...data });
  }, []);

  const markLessonVisited = useCallback((lessonId: string) => {
    const data = read();
    if (data.visitedLessons.includes(lessonId)) return;
    data.visitedLessons.push(lessonId);
    write(data);
    setState({ ...data });
  }, []);

  const isLessonVisited = useCallback(
    (lessonId: string) => state.visitedLessons.includes(lessonId),
    [state.visitedLessons]
  );

  return {
    isPurchased,
    purchaseCourse,
    markLessonVisited,
    isLessonVisited,
    purchasedCourseSlugs: state.purchased,
    visitedLessonIds: state.visitedLessons,
  };
}
