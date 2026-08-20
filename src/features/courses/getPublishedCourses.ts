import { createClient } from "@/lib/supabase/server";
import type { Course } from "@/lib/types";
import { mapCourse, type LmsCourseRow } from "@/features/courses/mapCourse";

const COURSE_SELECT = `
  id,
  slug,
  title,
  description,
  price_label,
  compare_at_price_label,
  level,
  sessions,
  rating,
  review_count,
  student_count,
  instructor_name,
  instructor_credentials,
  instructor_avatar_url,
  outcomes,
  lms_modules (
    id,
    title,
    sort_order,
    lms_lessons (
      id,
      slug,
      title,
      excerpt,
      duration_minutes,
      cover_image_url,
      sort_order
    )
  )
`;

export async function getPublishedCourses(): Promise<Course[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lms_courses")
      .select(COURSE_SELECT)
      .eq("status", "published")
      .order("title");

    if (error) {
      console.warn("[lms] Could not load published courses:", error.message);
      return [];
    }

    return ((data ?? []) as LmsCourseRow[]).map(mapCourse);
  } catch (error) {
    console.warn(
      "[lms] Could not load published courses:",
      error instanceof Error ? error.message : error,
    );
    return [];
  }
}

export async function getCourseBySlug(
  slug: string,
): Promise<Course | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lms_courses")
      .select(COURSE_SELECT)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) {
      console.warn("[lms] Could not load course:", error.message);
      return null;
    }

    return data ? mapCourse(data as LmsCourseRow) : null;
  } catch (error) {
    console.warn(
      "[lms] Could not load course:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
