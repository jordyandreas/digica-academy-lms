import { createProgramsReaderClient } from "@/lib/supabase/programs-reader";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { isUuid } from "@/utils/program-public-link";

const MINIMAL_COLUMNS = "id, name, status, start_date, public_slug, public_code";
const FULL_COLUMNS =
  "id, name, type, year, batch, start_date, end_date, start_time, end_time, schedule_days, price, session_count, status, public_code, public_slug";

function todayIsoDate(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
  }).format(new Date());
}

function normalizeDateOnly(value: string | null): string | null {
  if (!value?.trim()) return null;
  return value.trim().slice(0, 10);
}

function supabaseProjectRef(): string | null {
  const url = getSupabasePublicEnv().url;
  if (!url) return null;
  try {
    const host = new URL(url).hostname;
    const ref = host.split(".")[0];
    return ref || null;
  } catch {
    return null;
  }
}

export type ProgramLookupDiagnosis = {
  programId: string;
  supabaseProjectRef: string | null;
  todayWib: string;
  found: boolean;
  reasons: string[];
  queryError: string | null;
  rowWithoutFilters: {
    id: string;
    name: string;
    status: string;
    start_date: string | null;
    public_slug: string | null;
    public_code: string | null;
  } | null;
  passesActiveFilter: boolean;
  passesStartDateFilter: boolean;
  fullSelectError: string | null;
};

export async function diagnoseProgramLookup(
  identifier: string,
): Promise<ProgramLookupDiagnosis> {
  const programId = decodeURIComponent(identifier.trim());
  const todayWib = todayIsoDate();
  const reasons: string[] = [];

  const diagnosis: ProgramLookupDiagnosis = {
    programId,
    supabaseProjectRef: supabaseProjectRef(),
    todayWib,
    found: false,
    reasons,
    queryError: null,
    rowWithoutFilters: null,
    passesActiveFilter: false,
    passesStartDateFilter: false,
    fullSelectError: null,
  };

  if (!programId) {
    reasons.push("Empty program id.");
    return diagnosis;
  }

  if (!isUuid(programId)) {
    reasons.push("Identifier is not a UUID; detail debug expects programs.id.");
  }

  try {
    const supabase = await createProgramsReaderClient();

    const { data, error } = await supabase
      .from("programs")
      .select(MINIMAL_COLUMNS)
      .eq("id", programId)
      .maybeSingle();

    if (error) {
      diagnosis.queryError = error.message;
      reasons.push(`Supabase query failed: ${error.message}`);
      return diagnosis;
    }

    if (!data) {
      reasons.push(
        "No row with this id in the Supabase project configured in LMS .env.local. Confirm NEXT_PUBLIC_SUPABASE_URL matches the admin dashboard project (check project ref in Supabase dashboard URL).",
      );
      return diagnosis;
    }

    diagnosis.rowWithoutFilters = {
      id: data.id as string,
      name: data.name as string,
      status: data.status as string,
      start_date: (data.start_date as string | null) ?? null,
      public_slug: (data.public_slug as string | null) ?? null,
      public_code: (data.public_code as string | null) ?? null,
    };

    diagnosis.passesActiveFilter = data.status === "active";
    if (!diagnosis.passesActiveFilter) {
      reasons.push(
        `Program status is "${data.status}", not "active". LMS only shows active programs.`,
      );
    }

    const start = normalizeDateOnly(data.start_date as string | null);
    diagnosis.passesStartDateFilter = Boolean(start && start >= todayWib);
    if (!start) {
      reasons.push("start_date is null or empty — LMS hides programs without a start date.");
    } else if (start < todayWib) {
      reasons.push(
        `start_date (${start}) is before today in WIB (${todayWib}) — treated as already started.`,
      );
    }

    const { error: fullSelectError } = await supabase
      .from("programs")
      .select(FULL_COLUMNS)
      .eq("id", programId)
      .maybeSingle();

    if (fullSelectError) {
      diagnosis.fullSelectError = fullSelectError.message;
      reasons.push(
        `Full column select failed (possible missing migration): ${fullSelectError.message}`,
      );
    }

    diagnosis.found =
      diagnosis.passesActiveFilter &&
      diagnosis.passesStartDateFilter &&
      !diagnosis.fullSelectError;

    if (diagnosis.found) {
      reasons.push("Program should appear on LMS detail page.");
    }

    return diagnosis;
  } catch (err) {
    diagnosis.queryError =
      err instanceof Error ? err.message : "Unknown diagnostic error.";
    reasons.push(diagnosis.queryError);
    return diagnosis;
  }
}
