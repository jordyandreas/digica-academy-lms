import { createProgramsReaderClient } from "@/lib/supabase/programs-reader";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { fetchProgramPublicContent } from "@/features/programs/programPublicContent";
import type {
  ProgramCardModel,
  ProgramDetailModel,
  ProgramRow,
  ProgramType,
  PublicProgramsResult,
} from "@/features/programs/types";
import { formatScheduleDateLines } from "@/lib/date-utils";
import { isUuid } from "@/utils/program-public-link";

const SELECT_COLUMNS =
  "id, name, type, year, batch, start_date, end_date, start_time, end_time, schedule_days, price, session_count, status, public_code, public_slug";

const PROGRAM_IMAGES: Record<ProgramType, string> = {
  workshop: "/images/programs/workshop.png",
  mini_bootcamp: "/images/programs/mini-bootcamp.png",
  bootcamp: "/images/programs/bootcamp.png",
};

function todayIsoDate(): string {
  // Match Indonesia program scheduling (WIB) instead of UTC midnight edge cases.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
  }).format(new Date());
}

function normalizeDateOnly(value: string | null): string | null {
  if (!value?.trim()) return null;
  return value.trim().slice(0, 10);
}

/** Postgres may store schedule_days as text or json/array (e.g. ["Mon","Wed"]). */
function formatScheduleDays(value: unknown): string | null {
  if (value == null) return null;

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }

  if (Array.isArray(value)) {
    const parts = value
      .map((item) => (typeof item === "string" ? item.trim() : String(item)))
      .filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : null;
  }

  if (typeof value === "object") {
    return null;
  }

  const text = String(value).trim();
  return text || null;
}

function asOptionalString(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }
  return String(value).trim() || null;
}

function typeLabel(type: ProgramType): string {
  switch (type) {
    case "workshop":
      return "Workshop";
    case "bootcamp":
      return "Bootcamp";
    case "mini_bootcamp":
      return "Mini Bootcamp";
    default:
      return type;
  }
}

function formatIdr(amount: number): string {
  return `Rp ${Math.round(amount).toLocaleString("id-ID")}`;
}

function priceLabel(row: ProgramRow): string {
  const amount = row.price;
  if (amount == null) return "—";
  if (amount === 0) return "Free";
  return formatIdr(amount);
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function dateLabel(row: ProgramRow): string {
  const start = formatDate(row.start_date);
  const end = formatDate(row.end_date);
  if (start && end && start !== end) return `${start} – ${end}`;
  if (start) return start;
  if (end) return `Until ${end}`;
  return "Dates TBA";
}

function batchLabel(row: ProgramRow): string | null {
  if (!row.batch) return null;
  return `Batch ${row.batch}`;
}

function sessionsLabel(row: ProgramRow): string | null {
  if (typeof row.session_count !== "number" || row.session_count <= 0) {
    return null;
  }
  return `${row.session_count} Session${row.session_count === 1 ? "" : "s"}`;
}

/** Format HH:MM:SS or HH:MM from Postgres time into a short label. */
function formatTime(value: string | null): string | null {
  if (!value) return null;
  const match = value.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return value;
  const hours = Number(match[1]);
  const minutes = match[2];
  if (Number.isNaN(hours)) return value;
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return minutes === "00"
    ? `${hour12} ${period}`
    : `${hour12}:${minutes} ${period}`;
}

function timeLabel(row: ProgramRow): string | null {
  const start = formatTime(row.start_time);
  const end = formatTime(row.end_time);
  if (start && end) return `${start} – ${end}`;
  if (start) return `From ${start}`;
  if (end) return `Until ${end}`;
  return null;
}

/** Admin registration time chip: range + WIB, or "Time to be / announced". */
function scheduleTimeLines(row: ProgramRow): {
  primary: string;
  secondary: string;
} {
  const start = formatTime(row.start_time);
  const end = formatTime(row.end_time);
  if (!start && !end) {
    return { primary: "Time to be", secondary: "announced" };
  }
  if (start && end) {
    return { primary: `${start} – ${end}`, secondary: "WIB" };
  }
  return { primary: start ?? end ?? "", secondary: "WIB" };
}

function programPublicIdentifier(row: ProgramRow): string | null {
  const slug = asOptionalString(row.public_slug);
  if (slug) return slug;

  const code = asOptionalString(row.public_code);
  if (code) return code;

  return row.id;
}

function programHref(row: ProgramRow): string {
  const identifier = programPublicIdentifier(row);
  return identifier ? `/r/${encodeURIComponent(identifier)}` : "#";
}

function imageSrc(type: ProgramType): string {
  return PROGRAM_IMAGES[type] ?? PROGRAM_IMAGES.bootcamp;
}

/** Only cohorts that have not started yet (start_date today or later, WIB). */
function isNotYetStarted(row: ProgramRow, today: string): boolean {
  const start = normalizeDateOnly(row.start_date);
  if (!start) return false;
  return start >= today;
}

function toCardModel(row: ProgramRow): ProgramCardModel {
  return {
    id: row.id,
    title: row.name,
    type: row.type,
    typeLabel: typeLabel(row.type),
    dateLabel: dateLabel(row),
    priceLabel: priceLabel(row),
    sessionsLabel: sessionsLabel(row),
    batchLabel: batchLabel(row),
    publicSlug: row.public_slug,
    ctaHref: programHref(row),
  };
}

function toDetailModel(
  row: ProgramRow,
  publicContent: {
    registrationBannerUrl: string | null;
    summaryHtml: string | null;
  } = { registrationBannerUrl: null, summaryHtml: null },
): ProgramDetailModel | null {
  const identifier = programPublicIdentifier(row);
  if (!identifier) return null;

  const registrationBannerUrl = publicContent.registrationBannerUrl;

  return {
    id: row.id,
    title: row.name,
    type: row.type,
    typeLabel: typeLabel(row.type),
    dateLabel: dateLabel(row),
    priceLabel: priceLabel(row),
    sessionsLabel: sessionsLabel(row),
    batchLabel: batchLabel(row),
    scheduleDays: formatScheduleDays(row.schedule_days),
    timeLabel: timeLabel(row),
    startDate: normalizeDateOnly(row.start_date),
    endDate: normalizeDateOnly(row.end_date),
    startTime: asOptionalString(row.start_time),
    endTime: asOptionalString(row.end_time),
    summaryHtml: publicContent.summaryHtml,
    scheduleDateLines: formatScheduleDateLines(row.start_date),
    scheduleTimeLines: scheduleTimeLines(row),
    year: row.year,
    publicSlug: identifier,
    registrationBannerUrl,
    fallbackImageSrc: imageSrc(row.type),
    imageSrc: registrationBannerUrl ?? imageSrc(row.type),
  };
}

async function fetchProgramRowByIdentifier(
  identifier: string,
): Promise<ProgramRow | null> {
  const supabase = await createProgramsReaderClient();
  const normalized = decodeURIComponent(identifier.trim());
  if (!normalized) return null;

  const selectRow = () =>
    supabase.from("programs").select(SELECT_COLUMNS);

  if (isUuid(normalized)) {
    const { data, error } = await selectRow()
      .eq("id", normalized)
      .maybeSingle();

    if (error) {
      console.error("[programs] fetch by id failed:", error.message);
      throw error;
    }

    return (data as ProgramRow | null) ?? null;
  }

  const { data: bySlug, error: slugError } = await selectRow()
    .eq("public_slug", normalized)
    .maybeSingle();

  if (slugError) {
    console.error("[programs] fetch by slug failed:", slugError.message);
    throw slugError;
  }

  if (bySlug) {
    return bySlug as ProgramRow;
  }

  const { data: byCode, error: codeError } = await selectRow()
    .eq("public_code", normalized)
    .maybeSingle();

  if (codeError) {
    console.error("[programs] fetch by code failed:", codeError.message);
    throw codeError;
  }

  return (byCode as ProgramRow | null) ?? null;
}

function isActiveProgram(row: ProgramRow): boolean {
  return asOptionalString(row.status) === "active";
}

export async function getPublicPrograms(): Promise<PublicProgramsResult> {
  if (!isSupabaseConfigured()) {
    return {
      programs: [],
      error:
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  try {
    const supabase = await createProgramsReaderClient();
    const today = todayIsoDate();

    const { data, error } = await supabase
      .from("programs")
      .select(SELECT_COLUMNS)
      .gte("start_date", today)
      .order("start_date", { ascending: true });

    if (error) {
      const detail = [error.code, error.message, error.details, error.hint]
        .filter(Boolean)
        .join(" | ");
      console.error("[programs] getPublicPrograms failed:", detail);
      return {
        programs: [],
        error: detail || error.message,
      };
    }

    const rows = (data ?? []) as ProgramRow[];
    const programs = rows
      .filter((row) => isActiveProgram(row) && isNotYetStarted(row, today))
      .map(toCardModel);

    return { programs, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load programs.";
    console.error("[programs] getPublicPrograms exception:", message);
    return { programs: [], error: message };
  }
}

export async function getPublicProgramByIdentifier(
  identifier: string,
): Promise<ProgramDetailModel | null> {
  if (!identifier || !isSupabaseConfigured()) return null;

  try {
    const today = todayIsoDate();
    const row = await fetchProgramRowByIdentifier(identifier);

    if (!row) {
      console.warn("[programs] detail not found:", identifier);
      return null;
    }

    if (!isActiveProgram(row)) {
      console.warn(
        "[programs] detail filtered (not active):",
        identifier,
        row.status,
      );
      return null;
    }

    if (!isNotYetStarted(row, today)) {
      console.warn(
        "[programs] detail filtered (already started or no start_date):",
        identifier,
        row.start_date,
        "today=",
        today,
      );
      return null;
    }

    const publicContent = await fetchProgramPublicContent(row.id);

    return toDetailModel(row, publicContent);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load program.";
    console.error("[programs] getPublicProgramByIdentifier exception:", message);
    return null;
  }
}

/** @deprecated Use getPublicProgramByIdentifier */
export async function getPublicProgramBySlug(
  slug: string,
): Promise<ProgramDetailModel | null> {
  return getPublicProgramByIdentifier(slug);
}
