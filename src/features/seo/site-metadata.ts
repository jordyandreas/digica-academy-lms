import type { Metadata } from "next";

export const SITE_NAME = "Digica Academy";

/** Public LMS origin (admin `NEXT_PUBLIC_PUBLIC_APP_URL` points here). */
export const SITE_URL = "https://digica-academy.web.id";

/** Homepage `<title>` (template is not applied to the default). */
export const SITE_DEFAULT_TITLE =
  "Digica Academy | Data Science, Data Analytics & SQL Bootcamps";

export const SITE_TITLE_TEMPLATE = "%s | Digica Academy";

export const SITE_DEFAULT_DESCRIPTION =
  "Join live Data Science, Data Analytics, and SQL bootcamps at Digica Academy. Learn from industry practitioners and ship portfolio-ready projects in a cohort.";

export const SITE_KEYWORDS = [
  "Digica Academy",
  "data science bootcamp",
  "data analytics bootcamp",
  "SQL bootcamp",
  "SQL mini bootcamp",
] as const;

const SITE_OG_IMAGE = "/logo/logo-digica.webp";

function siteMetadataBase(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || SITE_URL;

  try {
    return new URL(raw);
  } catch {
    return new URL(SITE_URL);
  }
}

export function buildRootMetadata(): Metadata {
  const metadataBase = siteMetadataBase();

  return {
    metadataBase,
    title: {
      default: SITE_DEFAULT_TITLE,
      template: SITE_TITLE_TEMPLATE,
    },
    description: SITE_DEFAULT_DESCRIPTION,
    keywords: [...SITE_KEYWORDS],
    applicationName: SITE_NAME,
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    icons: {
      icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
      apple: "/logo/logo-digica-initial.webp",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/",
      siteName: SITE_NAME,
      title: SITE_DEFAULT_TITLE,
      description: SITE_DEFAULT_DESCRIPTION,
      images: [{ url: SITE_OG_IMAGE, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_DEFAULT_TITLE,
      description: SITE_DEFAULT_DESCRIPTION,
      images: [SITE_OG_IMAGE],
    },
  };
}
