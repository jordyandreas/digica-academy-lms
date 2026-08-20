import { getJakartaTodayDateString } from "@/lib/date-utils";

export type CheckInSessionInput = {
  id: string;
  session_number: number;
  session_date: string | null;
};

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Calendar date in Asia/Jakarta (YYYY-MM-DD).
 * Date-only values are used as-is. Timestamps are converted to WIB so
 * midnight-in-Jakarta stored as UTC (e.g. 2026-08-19T17:00:00.000Z) still
 * matches 20 August in Indonesia.
 */
export function normalizeSessionDate(
  date: string | null | undefined,
): string | null {
  if (!date?.trim()) {
    return null;
  }

  const trimmed = date.trim();
  if (DATE_ONLY.test(trimmed)) {
    return trimmed;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return trimmed.split("T")[0] ?? null;
  }

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
  }).format(parsed);
}

/** Sessions participants may self check-in for (today in Asia/Jakarta only). */
export function getPublicCheckInSessions(
  sessions: CheckInSessionInput[],
  today: string = getJakartaTodayDateString(),
): CheckInSessionInput[] {
  return sessions.filter(
    (session) => normalizeSessionDate(session.session_date) === today,
  );
}
