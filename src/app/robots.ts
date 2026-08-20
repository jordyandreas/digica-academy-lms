import type { MetadataRoute } from "next";
import { SITE_URL } from "@/features/seo/site-metadata";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") || SITE_URL;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account/", "/api/", "/auth/"],
    },
    host: siteUrl,
  };
}
