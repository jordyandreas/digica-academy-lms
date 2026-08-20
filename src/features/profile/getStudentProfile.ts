import type { SupabaseClient } from "@supabase/supabase-js";
import type { StudentProfile } from "@/features/profile/types";

export async function getStudentProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<StudentProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, phone, occupation, organization")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.warn("[profile] Could not load profile:", error.message);
    return null;
  }

  if (!data) return null;

  return {
    full_name: typeof data.full_name === "string" ? data.full_name : null,
    phone: typeof data.phone === "string" ? data.phone : null,
    occupation: typeof data.occupation === "string" ? data.occupation : null,
    organization:
      typeof data.organization === "string" ? data.organization : null,
  };
}
