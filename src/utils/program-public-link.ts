import type { SupabaseClient } from "@supabase/supabase-js";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface ProgramPublicLinkFields {
  public_code: string;
  public_slug?: string | null;
}

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value.trim());
}

export function resolvePublicIdentifier(
  program: ProgramPublicLinkFields,
): string {
  const slug = program.public_slug?.trim();
  if (slug) {
    return slug;
  }

  return program.public_code.trim();
}

export function buildRegistrationPath(identifier: string): string {
  return `/r/${encodeURIComponent(identifier.trim())}`;
}

export function buildCheckInPath(identifier: string): string {
  return `/c/${encodeURIComponent(identifier.trim())}`;
}

export function buildRegistrationPathForProgram(
  program: ProgramPublicLinkFields,
): string {
  return buildRegistrationPath(resolvePublicIdentifier(program));
}

export function buildCheckInPathForProgram(
  program: ProgramPublicLinkFields,
): string {
  return buildCheckInPath(resolvePublicIdentifier(program));
}

export async function resolveProgramIdByIdentifier(
  supabase: SupabaseClient,
  identifier: string,
): Promise<string | null> {
  const normalized = identifier.trim();
  if (!normalized) {
    return null;
  }

  if (isUuid(normalized)) {
    const { data, error } = await supabase
      .from("programs")
      .select("id")
      .eq("id", normalized)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data?.id ?? null;
  }

  const { data: bySlug, error: slugError } = await supabase
    .from("programs")
    .select("id")
    .eq("public_slug", normalized)
    .maybeSingle();

  if (slugError) {
    throw slugError;
  }

  if (bySlug?.id) {
    return bySlug.id;
  }

  const { data: byCode, error: codeError } = await supabase
    .from("programs")
    .select("id")
    .eq("public_code", normalized)
    .maybeSingle();

  if (codeError) {
    throw codeError;
  }

  return byCode?.id ?? null;
}
