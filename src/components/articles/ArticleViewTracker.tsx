"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type ArticleViewTrackerProps = {
  slug: string;
};

export function ArticleViewTracker({ slug }: ArticleViewTrackerProps) {
  const trackedSlugRef = useRef<string | null>(null);

  useEffect(() => {
    const normalizedSlug = slug.trim();
    if (!normalizedSlug || !isSupabaseConfigured()) {
      return;
    }

    if (trackedSlugRef.current === normalizedSlug) {
      return;
    }
    trackedSlugRef.current = normalizedSlug;

    let cancelled = false;

    void (async () => {
      try {
        const supabase = createClient();
        const { error } = await supabase.rpc(
          "increment_lms_article_view_count",
          { p_slug: normalizedSlug }
        );

        if (cancelled) return;

        if (error) {
          console.warn(
            `[lms] Could not increment article views for "${normalizedSlug}":`,
            error.message
          );
        }
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : String(error);
        console.warn(
          `[lms] Could not increment article views for "${normalizedSlug}":`,
          message
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return null;
}
