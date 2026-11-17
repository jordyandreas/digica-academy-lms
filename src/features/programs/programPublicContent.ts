import { createProgramsReaderClient } from "@/lib/supabase/programs-reader";

export { isRemoteImageSrc } from "@/features/programs/isRemoteImageSrc";

function asOptionalString(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }
  return String(value).trim() || null;
}

export type ProgramPublicContent = {
  registrationBannerUrl: string | null;
  promoBannerUrl: string | null;
  summaryHtml: string | null;
};

const EMPTY_PUBLIC_CONTENT: ProgramPublicContent = {
  registrationBannerUrl: null,
  promoBannerUrl: null,
  summaryHtml: null,
};

export async function fetchProgramPublicContent(
  programId: string,
): Promise<ProgramPublicContent> {
  if (!programId) {
    return { ...EMPTY_PUBLIC_CONTENT };
  }

  try {
    const supabase = await createProgramsReaderClient();

    const { data, error } = await supabase
      .from("program_public_contents")
      .select("registration_banner_url, promo_banner_url, summary_html")
      .eq("program_id", programId)
      .maybeSingle();

    if (error) {
      if (error.code === "42703") {
        return { ...EMPTY_PUBLIC_CONTENT };
      }
      console.error(
        "[programs] public content fetch failed:",
        error.message,
      );
      return { ...EMPTY_PUBLIC_CONTENT };
    }

    return {
      registrationBannerUrl: asOptionalString(data?.registration_banner_url),
      promoBannerUrl: asOptionalString(data?.promo_banner_url),
      summaryHtml: asOptionalString(data?.summary_html),
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to load program public content.";
    console.error("[programs] public content exception:", message);
    return { ...EMPTY_PUBLIC_CONTENT };
  }
}

/** @deprecated Use fetchProgramPublicContent */
export async function fetchRegistrationBannerUrl(
  programId: string,
): Promise<string | null> {
  const content = await fetchProgramPublicContent(programId);
  return content.registrationBannerUrl;
}
