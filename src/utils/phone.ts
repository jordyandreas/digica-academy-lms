import {
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import { getCountryCallingCode } from "react-phone-number-input/input";

export const DEFAULT_PHONE_COUNTRY = "ID" as const;
export const MAX_PHONE_DIGITS = 15;

function stripSeparators(value: string): string {
  return value.trim().replace(/[\s-]/g, "");
}

export function countPhoneDigits(value: string): number {
  return value.replace(/\D/g, "").length;
}

export function isWithinMaxPhoneDigits(value: string): boolean {
  return countPhoneDigits(value) <= MAX_PHONE_DIGITS;
}

/** Max national digits allowed for a country (15 total minus calling code). */
export function getMaxNationalDigits(
  country: CountryCode = DEFAULT_PHONE_COUNTRY,
): number {
  const callingCode = getCountryCallingCode(country);
  return MAX_PHONE_DIGITS - callingCode.length;
}

export function countNationalDigits(value: string): number {
  return value.replace(/\D/g, "").length;
}

export function wouldExceedMaxNationalDigits(
  currentValue: string,
  insert: string,
  selectionStart: number,
  selectionEnd: number,
  country: CountryCode = DEFAULT_PHONE_COUNTRY,
): boolean {
  const nextValue =
    currentValue.slice(0, selectionStart) +
    insert +
    currentValue.slice(selectionEnd);
  return (
    countNationalDigits(nextValue) > getMaxNationalDigits(country)
  );
}

export function toE164Phone(
  value: string,
  defaultCountry: CountryCode = DEFAULT_PHONE_COUNTRY,
): string | null {
  const normalized = stripSeparators(value);
  if (!normalized) return null;

  const parsed = parsePhoneNumberFromString(normalized, defaultCountry);
  if (!parsed || !parsed.isValid()) return null;

  const e164 = parsed.format("E.164");
  if (!isWithinMaxPhoneDigits(e164)) return null;

  return e164;
}

/** Coerce legacy/local values to E.164 for react-phone-number-input. */
export function toE164PhoneForInput(
  value: string,
  defaultCountry: CountryCode = DEFAULT_PHONE_COUNTRY,
): string | undefined {
  const normalized = stripSeparators(value);
  if (!normalized) return undefined;

  if (normalized.startsWith("+")) {
    return isWithinMaxPhoneDigits(normalized) ? normalized : undefined;
  }

  return toE164Phone(normalized, defaultCountry) ?? undefined;
}

export function isValidParticipantPhone(
  value: string,
  defaultCountry: CountryCode = DEFAULT_PHONE_COUNTRY,
): boolean {
  const normalized = stripSeparators(value);
  if (!normalized) return false;
  if (!isWithinMaxPhoneDigits(normalized)) return false;
  return isValidPhoneNumber(normalized, defaultCountry);
}

/** Normalize to E.164 for API/DB writes (call after schema validation). */
export function normalizePhoneForSubmit(phone: string): string {
  const e164 = toE164Phone(phone);
  if (!e164) {
    throw new Error("Phone number must be valid E.164 before submit");
  }
  return e164;
}
