"use client";

import { useEffect, useState } from "react";

type ArticleBodyHtmlProps = {
  html: string;
};

const PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    "p",
    "h2",
    "h3",
    "strong",
    "em",
    "ul",
    "ol",
    "li",
    "a",
    "blockquote",
    "br",
  ],
  ALLOWED_ATTR: ["href", "target", "rel"],
};

export function ArticleBodyHtml({ html }: ArticleBodyHtmlProps) {
  const [sanitizedHtml, setSanitizedHtml] = useState("");

  useEffect(() => {
    if (!html) {
      setSanitizedHtml("");
      return;
    }

    let cancelled = false;

    void import("isomorphic-dompurify")
      .then(({ default: DOMPurify }) => {
        if (!cancelled) {
          setSanitizedHtml(DOMPurify.sanitize(html, PURIFY_CONFIG));
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
  }, [html]);

  if (!sanitizedHtml) {
    return null;
  }

  return (
    <div
      className="space-y-5 text-base leading-relaxed text-zinc-700 md:text-[17px] md:leading-[1.75] [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-4 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-0 [&_strong]:font-semibold [&_ul]:list-disc"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
