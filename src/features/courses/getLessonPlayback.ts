import { createClient } from "@/lib/supabase/server";

export type LessonPlayback = {
  videoUrl: string;
  content: string;
};

export async function getLessonPlayback(
  lessonId: string,
): Promise<LessonPlayback | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lms_lesson_media")
      .select("video_url, content")
      .eq("lesson_id", lessonId)
      .maybeSingle();

    if (error) {
      console.warn("[lms] Could not load lesson media:", error.message);
      return null;
    }

    if (!data) return null;

    return {
      videoUrl: typeof data.video_url === "string" ? data.video_url : "",
      content: typeof data.content === "string" ? data.content : "",
    };
  } catch (error) {
    console.warn(
      "[lms] Could not load lesson media:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

export async function userHasCourseAccess(courseId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from("lms_entitlements")
      .select("id, status, starts_at, ends_at")
      .eq("course_id", courseId)
      .eq("status", "active")
      .maybeSingle();

    if (error || !data) return false;

    const now = Date.now();
    const startsAt = data.starts_at ? Date.parse(String(data.starts_at)) : 0;
    const endsAt = data.ends_at ? Date.parse(String(data.ends_at)) : null;
    if (Number.isFinite(startsAt) && startsAt > now) return false;
    if (endsAt != null && Number.isFinite(endsAt) && endsAt <= now) return false;
    return true;
  } catch {
    return false;
  }
}
