"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/features/auth/hooks/useAuth";

const STORAGE_KEY = "digica_course_access";

type StoredVisits = {
  visitedLessons: string[];
};

function readVisits(): StoredVisits {
  if (typeof window === "undefined") {
    return { visitedLessons: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { visitedLessons: [] };
    const parsed = JSON.parse(raw) as Partial<StoredVisits> & {
      purchased?: string[];
    };
    return {
      visitedLessons: Array.isArray(parsed.visitedLessons)
        ? parsed.visitedLessons
        : [],
    };
  } catch {
    return { visitedLessons: [] };
  }
}

function writeVisits(data: StoredVisits) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function isActiveEntitlement(row: {
  status: string | null;
  starts_at: string | null;
  ends_at: string | null;
}): boolean {
  if (row.status !== "active") return false;
  const now = Date.now();
  if (row.starts_at) {
    const starts = Date.parse(row.starts_at);
    if (Number.isFinite(starts) && starts > now) return false;
  }
  if (row.ends_at) {
    const ends = Date.parse(row.ends_at);
    if (Number.isFinite(ends) && ends <= now) return false;
  }
  return true;
}

export function useCourseAccess() {
  const { isLoggedIn } = useAuth();
  const [purchasedCourseSlugs, setPurchasedCourseSlugs] = useState<string[]>([]);
  const [visits, setVisits] = useState<StoredVisits>(() => readVisits());

  useEffect(() => {
    if (!isLoggedIn) {
      setPurchasedCourseSlugs([]);
      return;
    }

    let cancelled = false;
    const supabase = createClient();

    void (async () => {
      const { data, error } = await supabase
        .from("lms_entitlements")
        .select("status, starts_at, ends_at, lms_courses ( slug )")
        .eq("status", "active");

      if (cancelled) return;
      if (error) {
        console.warn("[lms] Could not load entitlements:", error.message);
        setPurchasedCourseSlugs([]);
        return;
      }

      const slugs = (data ?? [])
        .filter((row) => isActiveEntitlement(row))
        .map((row) => {
          const course = row.lms_courses as { slug?: string } | { slug?: string }[] | null;
          if (Array.isArray(course)) return course[0]?.slug;
          return course?.slug;
        })
        .filter((slug): slug is string => Boolean(slug));

      setPurchasedCourseSlugs(slugs);
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  const isPurchased = useCallback(
    (courseSlug: string) => purchasedCourseSlugs.includes(courseSlug),
    [purchasedCourseSlugs],
  );

  const purchaseCourse = useCallback((_courseSlug: string) => {
    // Enrollment is granted in SQL / later admin — not from the client.
  }, []);

  const markLessonVisited = useCallback((lessonId: string) => {
    const data = readVisits();
    if (data.visitedLessons.includes(lessonId)) return;
    data.visitedLessons.push(lessonId);
    writeVisits(data);
    setVisits({ ...data });
  }, []);

  const isLessonVisited = useCallback(
    (lessonId: string) => visits.visitedLessons.includes(lessonId),
    [visits.visitedLessons],
  );

  return {
    isPurchased,
    purchaseCourse,
    markLessonVisited,
    isLessonVisited,
    purchasedCourseSlugs,
    visitedLessonIds: visits.visitedLessons,
  };
}
