"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "completedLessons";
const PROGRESS_CHANGE = "digica-lesson-progress-change";

function readIdsFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getSnapshotString(): string {
  const ids = readIdsFromStorage();
  return JSON.stringify([...new Set(ids)].sort());
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const go = () => onStoreChange();
  window.addEventListener(PROGRESS_CHANGE, go);
  window.addEventListener("storage", go);
  return () => {
    window.removeEventListener(PROGRESS_CHANGE, go);
    window.removeEventListener("storage", go);
  };
}

function getServerSnapshot() {
  return "[]";
}

function getClientSnapshot() {
  return getSnapshotString();
}

export function useLessonProgress() {
  const snap = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  const completed = useMemo(() => {
    try {
      const ids = JSON.parse(snap) as string[];
      return new Set<string>(Array.isArray(ids) ? ids : []);
    } catch {
      return new Set<string>();
    }
  }, [snap]);

  const getCompletedLessons = useCallback((): string[] => {
    return readIdsFromStorage();
  }, []);

  const markLessonCompleted = useCallback((lessonId: string) => {
    if (typeof window === "undefined") return;
    const set = new Set(readIdsFromStorage());
    set.add(lessonId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
    window.dispatchEvent(new Event(PROGRESS_CHANGE));
  }, []);

  const isLessonCompleted = useCallback(
    (lessonId: string): boolean => completed.has(lessonId),
    [completed]
  );

  const completedLessonIds = useMemo(
    () => Array.from(completed).sort(),
    [completed]
  );

  return {
    getCompletedLessons,
    markLessonCompleted,
    isLessonCompleted,
    completedLessonIds,
  };
}
