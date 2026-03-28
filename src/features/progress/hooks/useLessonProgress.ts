"use client";

import { useCallback, useMemo, useState } from "react";

const STORAGE_KEY = "completedLessons";

function getCompletedLessonsFromStorage(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export function useLessonProgress() {
  const [completed, setCompleted] = useState<Set<string>>(
    () => getCompletedLessonsFromStorage()
  );

  const getCompletedLessons = useCallback((): string[] => {
    return Array.from(getCompletedLessonsFromStorage());
  }, []);

  const markLessonCompleted = useCallback((lessonId: string) => {
    const set = getCompletedLessonsFromStorage();
    set.add(lessonId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
    setCompleted(new Set(set));
  }, []);

  const isLessonCompleted = useCallback(
    (lessonId: string): boolean => completed.has(lessonId),
    [completed]
  );

  const completedLessonIds = useMemo(
    () => Array.from(completed),
    [completed]
  );

  return {
    getCompletedLessons,
    markLessonCompleted,
    isLessonCompleted,
    completedLessonIds,
  };
}
