import { format, isValid, parse, parseISO } from "date-fns";

/** Storage format used across forms and APIs (YYYY-MM-DD). */
export const DATE_STORAGE_FORMAT = "yyyy-MM-dd";

/** @deprecated Use DATE_STORAGE_FORMAT */
export const DATE_FORMAT = DATE_STORAGE_FORMAT;

export const DATE_TIME_LOCAL_FORMAT = "yyyy-MM-dd'T'HH:mm";

export function parseDateString(
  value: string | null | undefined,
): Date | undefined {
  if (!value?.trim()) return undefined;

  const datePart = value.split("T")[0];
  const isoParsed = parseISO(datePart);
  if (isValid(isoParsed)) return isoParsed;

  const parsed = parse(datePart, DATE_STORAGE_FORMAT, new Date());
  return isValid(parsed) ? parsed : undefined;
}

export function toDateString(date: Date | undefined): string {
  if (!date || !isValid(date)) return "";
  return format(date, DATE_STORAGE_FORMAT);
}

/** @deprecated Use toDateString */
export const formatDateString = toDateString;

export function formatDateLabel(value: string): string {
  const date = parseDateString(value);
  if (!date) return "";
  return format(date, "MMMM d, yyyy");
}

export type ScheduleLinePair = {
  primary: string;
  secondary: string;
};

/** Admin registration date chip: "Mon, 31 August" / "2026". */
export function formatScheduleDateLines(
  value: string | null | undefined,
): ScheduleLinePair {
  const date = parseDateString(value);
  if (!date) {
    return { primary: "Date to be", secondary: "announced" };
  }
  return {
    primary: format(date, "EEE, d MMMM"),
    secondary: format(date, "yyyy"),
  };
}

/** en-GB DD/MM/YYYY for check-in session labels, in Asia/Jakarta. */
export function formatCheckInSessionDate(dateString: string | null): string {
  if (!dateString) return "N/A";

  const trimmed = dateString.trim();
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
    ? trimmed
    : new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
      }).format(new Date(trimmed));

  const [year, month, day] = dateOnly.split("-");
  if (!year || !month || !day) return "N/A";
  return `${day}/${month}/${year}`;
}

export function getTodayDateString(): string {
  return format(new Date(), DATE_STORAGE_FORMAT);
}

/** Calendar date in Indonesia (WIB), YYYY-MM-DD. */
export function getJakartaTodayDateString(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
  }).format(new Date());
}

export function parseDateTimeString(
  value: string | null | undefined,
): Date | undefined {
  if (!value?.trim()) return undefined;

  const localParsed = parse(value, DATE_TIME_LOCAL_FORMAT, new Date());
  if (isValid(localParsed)) return localParsed;

  const isoParsed = new Date(value);
  return isValid(isoParsed) ? isoParsed : undefined;
}

export function formatDateTimeLocalString(date: Date | undefined): string {
  if (!date || !isValid(date)) return "";
  return format(date, DATE_TIME_LOCAL_FORMAT);
}

export function formatDateDisplay(
  date: Date | undefined,
  displayFormat = "dd MMM yyyy",
): string {
  if (!date || !isValid(date)) return "";
  return format(date, displayFormat);
}

export function formatDateTimeDisplay(
  date: Date | undefined,
  displayFormat = "dd MMM yyyy, HH:mm",
): string {
  if (!date || !isValid(date)) return "";
  return format(date, displayFormat);
}
