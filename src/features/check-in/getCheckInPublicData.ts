import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { getJakartaTodayDateString } from "@/lib/date-utils";
import type { ProgramType } from "@/features/programs/types";
import { resolveProgramIdByIdentifier } from "@/utils/program-public-link";
import { getPublicCheckInSessions } from "@/utils/check-in-sessions";
import { fetchAllPages } from "@/utils/supabase-fetch-all";
import type { CheckInPublicData } from "@/features/check-in/types";

type SecureSeatTargetType = Extract<ProgramType, "mini_bootcamp" | "bootcamp">;

function parseBatch(raw: unknown): number | null {
  if (typeof raw === "number" && Number.isFinite(raw) && raw >= 1) {
    return raw;
  }
  if (raw == null) {
    return null;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : null;
}

function extractProgramIdentifierFromUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const hasOrigin = /^https?:\/\//i.test(trimmed);
    const parsed = hasOrigin
      ? new URL(trimmed)
      : new URL(trimmed, "https://placeholder.local");
    const match = parsed.pathname.match(
      /\/(?:r|registration|c|check-in|programs)\/([^/]+)/i,
    );
    if (!match?.[1]) {
      return null;
    }
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

async function resolveSecureSeatTargetType(
  supabase: SupabaseClient,
  bootcampRegistrationLink: string | null,
): Promise<SecureSeatTargetType | null> {
  if (!bootcampRegistrationLink?.trim()) {
    return null;
  }

  const identifier = extractProgramIdentifierFromUrl(bootcampRegistrationLink);
  if (!identifier) {
    return null;
  }

  const linkedProgramId = await resolveProgramIdByIdentifier(
    supabase,
    identifier,
  );
  if (!linkedProgramId) {
    return null;
  }

  const { data, error } = await supabase
    .from("programs")
    .select("type")
    .eq("id", linkedProgramId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  const type = data?.type;
  if (type === "mini_bootcamp" || type === "bootcamp") {
    return type;
  }

  return null;
}

export type CheckInPublicDataResult =
  | { status: "ok"; data: CheckInPublicData }
  | { status: "not_found" }
  | { status: "no_sessions" };

export async function getCheckInPublicData(
  identifier: string,
): Promise<CheckInPublicDataResult> {
  const supabase = createAdminClient();
  const programId = await resolveProgramIdByIdentifier(supabase, identifier);

  if (!programId) {
    return { status: "not_found" };
  }

  const { data: program, error: programError } = await supabase
    .from("programs")
    .select(
      "id, name, type, batch, session_count, registration_link, bootcamp_registration_link, public_code, public_slug",
    )
    .eq("id", programId)
    .maybeSingle();

  if (programError) {
    throw programError;
  }

  if (!program) {
    return { status: "not_found" };
  }

  const sessionCount =
    typeof program.session_count === "number" ? program.session_count : 0;

  if (sessionCount <= 0) {
    return { status: "no_sessions" };
  }

  const { data: participants, error: participantsError } = await fetchAllPages(
    (from, to) =>
      supabase
        .from("participants")
        .select("id, name, email, phone")
        .eq("program_id", programId)
        .order("name", { ascending: true })
        .range(from, to),
  );

  if (participantsError) {
    throw participantsError;
  }

  const { data: sessions, error: sessionsError } = await supabase
    .from("program_sessions")
    .select("id, session_number, session_date")
    .eq("program_id", programId)
    .order("session_number", { ascending: true });

  if (sessionsError) {
    throw sessionsError;
  }

  const { data: publicContent } = await supabase
    .from("program_public_contents")
    .select("promo_banner_url")
    .eq("program_id", programId)
    .maybeSingle();

  const today = getJakartaTodayDateString();
  const checkInSessions = getPublicCheckInSessions(sessions ?? [], today);
  const secureSeatTargetType =
    (program.type as ProgramType) === "workshop"
      ? await resolveSecureSeatTargetType(
          supabase,
          (program.bootcamp_registration_link as string | null) ?? null,
        )
      : null;

  return {
    status: "ok",
    data: {
      program: {
        id: program.id as string,
        name: program.name as string,
        type: program.type as ProgramType,
        batch: parseBatch(program.batch),
        registration_link: (program.registration_link as string | null) ?? null,
        bootcamp_registration_link:
          (program.bootcamp_registration_link as string | null) ?? null,
        public_code: (program.public_code as string | null) ?? null,
        public_slug: (program.public_slug as string | null) ?? null,
        promo_banner_url:
          (publicContent?.promo_banner_url as string | null) ?? null,
        secure_seat_target_type: secureSeatTargetType,
      },
      participants: (participants ?? []).map((participant) => ({
        id: participant.id as string,
        name: (participant.name as string | null) ?? null,
        email: (participant.email as string | null) ?? null,
        phone: (participant.phone as string | null) ?? null,
      })),
      sessions: checkInSessions.map((session) => ({
        id: session.id,
        session_number: session.session_number,
        session_date: session.session_date,
      })),
    },
  };
}
