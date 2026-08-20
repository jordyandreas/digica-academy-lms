import type { SupabaseClient } from "@supabase/supabase-js";
import { studentProfileSchema } from "@/features/profile/student-profile-schema";
import type { StudentProfileInput } from "@/features/profile/types";
import { normalizeParticipantPhoneForSubmit } from "@/utils/phone";

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export async function updateStudentProfile(
  supabase: SupabaseClient,
  input: StudentProfileInput,
): Promise<{ error: string | null }> {
  const parsed = studentProfileSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid profile details.",
    };
  }

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    return { error: "You need to log in to update your profile." };
  }

  const values = parsed.data;
  const phone = emptyToNull(values.phone);
  const profileFields = {
    full_name: values.full_name,
    phone: phone ? normalizeParticipantPhoneForSubmit(phone) : null,
    occupation: emptyToNull(values.occupation),
    organization: emptyToNull(values.organization),
  };

  // UPDATE only — upsert uses INSERT ... ON CONFLICT, which still requires an
  // INSERT RLS policy even when the row already exists (typical profiles setup
  // lets a trigger insert, and the user only UPDATE their own row).
  const { data, error } = await supabase
    .from("profiles")
    .update(profileFields)
    .eq("id", authData.user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  if (!data) {
    return {
      error:
        "Profile row was not found. Sign out and back in, or add an UPDATE policy on public.profiles for auth.uid() = id.",
    };
  }

  const { error: metadataError } = await supabase.auth.updateUser({
    data: { full_name: values.full_name },
  });

  if (metadataError) {
    return { error: metadataError.message };
  }

  return { error: null };
}
