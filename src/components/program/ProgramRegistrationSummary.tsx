"use client";

import { useEffect, useState } from "react";

type ProgramRegistrationSummaryProps = {
  summaryHtml: string | null;
};

export function ProgramRegistrationSummary({
  summaryHtml,
}: ProgramRegistrationSummaryProps) {
  const [sanitizedHtml, setSanitizedHtml] = useState("");

  useEffect(() => {
    if (!summaryHtml) {
      setSanitizedHtml("");
      return;
    }

    let cancelled = false;

    void import("isomorphic-dompurify")
      .then(({ default: DOMPurify }) => {
        if (!cancelled) {
          setSanitizedHtml(DOMPurify.sanitize(summaryHtml));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSanitizedHtml("");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [summaryHtml]);

  if (!sanitizedHtml) {
    return null;
  }

  return (
    <div
      className="rounded-xl border border-brand-periwinkle/35 bg-brand-pale/20 px-4 py-4 text-left text-sm text-foreground [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-2 [&_strong]:font-semibold"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
