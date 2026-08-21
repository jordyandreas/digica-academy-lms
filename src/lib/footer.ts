import { LEGAL_PATHS } from "@/features/legal/constants";

export const FOOTER_BRAND = {
  name: "Digica Academy",
  tagline:
    "Live online bootcamps and workshops to help you build practical data skills, real projects, and career-ready confidence.",
} as const;

export const FOOTER_SOCIAL_LINKS = [
  {
    id: "threads",
    href: "https://www.threads.com/@digica.academy",
    ariaLabel: "Visit Digica Academy on Threads",
  },
  {
    id: "instagram",
    href: "https://www.instagram.com/digica.academy",
    ariaLabel: "Visit Digica Academy on Instagram",
  },
  {
    id: "tiktok",
    href: "https://www.tiktok.com/@digica.academy",
    ariaLabel: "Visit Digica Academy on TikTok",
  },
  {
    id: "whatsapp",
    href: "",
    ariaLabel: "Chat Digica Academy on WhatsApp",
  },
] as const;

export type FooterCompanyLink = { label: string; href: string };

/** Marketing landing (`GuestLandingMain`) — Programs opens the full catalog. */
export const FOOTER_COMPANY_LINKS: readonly FooterCompanyLink[] = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/programs" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Curriculum", href: "/#curriculum" },
  { label: "Instructors", href: "/#instructor" },
  { label: "Alumni", href: "/#testimonials" },
  { label: "Articles", href: "/articles" },
  { label: "FAQ", href: "/#faq" },
];

/**
 * Logged-in home (`AuthenticatedHome`) does not render guest marketing sections, so hash
 * links like `/#faq` would not scroll. These point at sections that exist on `/` for members.
 */
export const FOOTER_COMPANY_LINKS_LOGGED_IN: readonly FooterCompanyLink[] = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/programs" },
  { label: "Articles", href: "/articles" },
];

export const FOOTER_COPYRIGHT = {
  tagline: "Built for modern data careers",
} as const;

export const FOOTER_LEGAL_LINKS: readonly FooterCompanyLink[] = [
  { label: "Terms of Use", href: LEGAL_PATHS.terms },
  { label: "Privacy Notice", href: LEGAL_PATHS.privacy },
];
