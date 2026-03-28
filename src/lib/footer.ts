import { EXPLORE_CATEGORY_LABELS, EXPLORE_CATEGORY_ORDER } from "./exploreCategories";

export const FOOTER_BRAND = {
  name: "Digica Academy",
  tagline:
    "We're always in search for talented and motivated people. Don't be shy, introduce yourself and subscribe to our newsletter.",
} as const;

export type FooterSocialVariant = "accent" | "muted";

export const FOOTER_SOCIAL_LINKS = [
  {
    id: "x",
    href: "#",
    ariaLabel: "Visit Digica Academy on X",
    variant: "accent" satisfies FooterSocialVariant,
  },
  {
    id: "facebook",
    href: "#",
    ariaLabel: "Visit Digica Academy on Facebook",
    variant: "muted" satisfies FooterSocialVariant,
  },
  {
    id: "instagram",
    href: "#",
    ariaLabel: "Visit Digica Academy on Instagram",
    variant: "muted" satisfies FooterSocialVariant,
  },
  {
    id: "tiktok",
    href: "#",
    ariaLabel: "Visit Digica Academy on TikTok",
    variant: "muted" satisfies FooterSocialVariant,
  },
] as const;

export type FooterCompanyLink =
  | { label: string; href: string }
  | { label: string; id: "courses" };

/** Marketing landing (`GuestLandingMain`) section anchors — see `src/components/landing/*`. */
export const FOOTER_COMPANY_LINKS: readonly FooterCompanyLink[] = [
  { label: "Home", href: "/" },
  { label: "Courses", id: "courses" },
  { label: "Instructor", href: "/#instructor" },
  { label: "About Digica Academy", href: "/#about" },
  /** No dedicated section; instructor block is the closest CTA on the guest page. */
  { label: "Become Instructor", href: "/#instructor" },
  /** Scroll target: `id="contact"` on the footer app/contact column in `SiteFooter`. */
  { label: "Contact Us", href: "/#contact" },
  { label: "FAQ", href: "/#faq" },
];

/**
 * Logged-in home (`AuthenticatedHome`) does not render guest marketing sections, so hash
 * links like `/#faq` would not scroll. These point at sections that exist on `/` for members.
 */
export const FOOTER_COMPANY_LINKS_LOGGED_IN: readonly { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "My courses", href: "/#my-courses" },
  { label: "Explore courses", href: "/#courses" },
  { label: "Articles", href: "/#articles" },
  { label: "Explore categories", href: "/#explore-categories" },
];

/** Subset of explore category IDs for footer “Top Categories” (matches `?category=`). */
export const FOOTER_TOP_CATEGORY_IDS = EXPLORE_CATEGORY_ORDER.slice(0, 7);

export function footerCategoryHref(categoryId: string) {
  return `/courses?category=${encodeURIComponent(categoryId)}`;
}

export function footerCategoryLabel(categoryId: string) {
  return EXPLORE_CATEGORY_LABELS[categoryId] ?? categoryId;
}

export const FOOTER_APP = {
  title: "Download the LMS App",
  description:
    "Join us on this journey of discovery as we explore the latest trends in data and digital skills.",
  stores: {
    googlePlay: {
      href: "#",
      headline: "Google Play",
      subline: "Get it on",
    },
    appStore: {
      href: "#",
      headline: "App Store",
      subline: "Download on the",
    },
  },
} as const;

/** Payment badges — assets under `public/images/payment/`. */
export const FOOTER_PAYMENT_METHODS = [
  { id: "visa", src: "/images/payment/visa.png", alt: "Visa" },
  { id: "mastercard", src: "/images/payment/mastercard.png", alt: "Mastercard" },
  { id: "gpay", src: "/images/payment/gpay.png", alt: "Google Pay" },
  { id: "applepay", src: "/images/payment/applepay.png", alt: "Apple Pay" },
] as const;

export const FOOTER_COPYRIGHT = {
  tagline: "Built for modern data careers",
} as const;

export const FOOTER_SECTION_TITLES = {
  social: "Social Media",
  company: "Company Info",
  /** Shown when `isLoggedIn` — links match the member dashboard home, not guest marketing. */
  companyLoggedIn: "Quick links",
  categories: "Top Categories",
  payment: "We Accept Payment Gateway",
} as const;
