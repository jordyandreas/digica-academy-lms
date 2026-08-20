import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { LEGAL_PATHS } from "@/features/legal/constants";
import { TERMS_OF_USE } from "@/features/legal/terms-of-use";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms of Use for Digica Academy accounts, live bootcamp registration, and related services.",
};

export default function TermsOfUsePage() {
  return (
    <LegalDocument
      document={TERMS_OF_USE}
      related={{ href: LEGAL_PATHS.privacy, label: "Privacy Notice" }}
    />
  );
}
