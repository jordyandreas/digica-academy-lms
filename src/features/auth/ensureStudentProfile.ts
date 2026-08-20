import type { SupabaseClient, User } from "@supabase/supabase-js";

export async function ensureStudentProfile(
  supabase: SupabaseClient,
  user: User | null
) {
  if (!user) return;

  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name.trim()
      : "";

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      role: "student",
      ...(fullName ? { full_name: fullName } : {}),
    },
    { onConflict: "id", ignoreDuplicates: true }
  );

  if (error) {
    console.warn(
      "[auth] Could not ensure profiles.role=student (trigger/RLS may already handle this):",
      error.message
    );
  }
}
