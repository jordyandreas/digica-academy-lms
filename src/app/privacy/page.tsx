import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { LEGAL_PATHS } from "@/features/legal/constants";
import { PRIVACY_NOTICE } from "@/features/legal/privacy-notice";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description:
    "How Digica Academy collects and uses personal data when you register, log in, or enroll in a bootcamp.",
};

export default function PrivacyNoticePage() {
  return (
    <LegalDocument
      document={PRIVACY_NOTICE}
      related={{ href: LEGAL_PATHS.terms, label: "Terms of Use" }}
    />
  );
}
