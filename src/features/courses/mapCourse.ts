import type { Course, Lesson, Module } from "@/lib/types";

export type LmsCourseRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  price_label: string | null;
  compare_at_price_label: string | null;
  level: string | null;
  sessions: number | null;
  rating: number | null;
  review_count: number | null;
  student_count: number | null;
  instructor_name: string | null;
  instructor_credentials: string | null;
  instructor_avatar_url: string | null;
  outcomes: unknown;
  lms_modules?: LmsModuleRow[] | null;
};

export type LmsModuleRow = {
  id: string;
  title: string;
  sort_order: number | null;
  lms_lessons?: LmsLessonRow[] | null;
};

export type LmsLessonRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  duration_minutes: number | null;
  cover_image_url: string | null;
  sort_order: number | null;
};

function asLevel(value: string | null): Course["level"] {
  if (value === "intermediate" || value === "advanced") return value;
  return "beginner";
}

function asOutcomes(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function mapLesson(row: LmsLessonRow): Lesson {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    videoUrl: "",
    content: row.excerpt ?? "",
    duration: row.duration_minutes ?? 0,
    coverImage: row.cover_image_url ?? undefined,
  };
}

function mapModule(row: LmsModuleRow): Module {
  const lessons = [...(row.lms_lessons ?? [])]
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map(mapLesson);

  return {
    id: row.id,
    title: row.title,
    lessons,
  };
}

export function mapCourse(row: LmsCourseRow): Course {
  const modules = [...(row.lms_modules ?? [])]
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map(mapModule);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? "",
    sessions: row.sessions ?? undefined,
    priceLabel: row.price_label ?? undefined,
    priceCompareLabel: row.compare_at_price_label ?? undefined,
    rating: row.rating ?? undefined,
    reviewCount: row.review_count ?? undefined,
    studentCount: row.student_count ?? undefined,
    level: asLevel(row.level),
    modules,
    outcomes: asOutcomes(row.outcomes),
    instructor:
      row.instructor_name && row.instructor_credentials
        ? {
            name: row.instructor_name,
            credentials: row.instructor_credentials,
            avatarUrl: row.instructor_avatar_url ?? undefined,
          }
        : undefined,
  };
}

export function getLessonBySlug(
  course: Course,
  lessonSlug: string,
): { lesson: Lesson; module: Module } | undefined {
  for (const courseModule of course.modules) {
    const lesson = courseModule.lessons.find((item) => item.slug === lessonSlug);
    if (lesson) return { lesson, module: courseModule };
  }
  return undefined;
}

export function getLessonLocationByLessonId(
  courses: Course[],
  lessonId: string,
):
  | {
      courseSlug: string;
      lessonSlug: string;
      courseTitle: string;
      lessonTitle: string;
    }
  | undefined {
  for (const course of courses) {
    for (const courseModule of course.modules) {
      const lesson = courseModule.lessons.find((item) => item.id === lessonId);
      if (lesson) {
        return {
          courseSlug: course.slug,
          lessonSlug: lesson.slug,
          courseTitle: course.title,
          lessonTitle: lesson.title,
        };
      }
    }
  }
  return undefined;
}

export function getFirstIncompleteLesson(
  course: Course | undefined,
  completedIds: Set<string>,
): { lessonSlug: string; lessonTitle: string } | undefined {
  if (!course) return undefined;
  for (const courseModule of course.modules) {
    for (const lesson of courseModule.lessons) {
      if (!completedIds.has(lesson.id)) {
        return { lessonSlug: lesson.slug, lessonTitle: lesson.title };
      }
    }
  }
  return undefined;
}
