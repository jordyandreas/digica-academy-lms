import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient, isServiceRoleConfigured } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

/**
 * Server-only client for reading public program catalog data.
 * Prefer service role (same as registration API) so RLS / logged-in role cannot block reads.
 */
export async function createProgramsReaderClient(): Promise<SupabaseClient> {
  if (isServiceRoleConfigured()) {
    return createAdminClient();
  }
  return createClient();
}

export function isProgramsReaderConfigured(): boolean {
  return isServiceRoleConfigured();
}
