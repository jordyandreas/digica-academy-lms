import { appendRegistrationSource } from "@/utils/registration-source-url";
import {
  buildRegistrationPath,
  resolvePublicIdentifier,
} from "@/utils/program-public-link";
import type { CheckInProgram } from "@/features/check-in/types";

/** LMS bootcamp register URL for workshop check-in upsell. */
export function buildCheckInBootcampRegisterUrl(
  program: CheckInProgram,
): string {
  const identifier = resolvePublicIdentifier({
    public_code: program.public_code?.trim() || program.id,
    public_slug: program.public_slug,
  });

  const lmsPath = buildRegistrationPath(identifier);
  const bootcampLink = program.bootcamp_registration_link?.trim() ?? "";

  if (
    bootcampLink &&
    (bootcampLink.includes("/r/") ||
      bootcampLink.includes("/programs/") ||
      bootcampLink.startsWith("/"))
  ) {
    return appendRegistrationSource(bootcampLink, "workshop_promo");
  }

  return appendRegistrationSource(lmsPath, "workshop_promo");
}
