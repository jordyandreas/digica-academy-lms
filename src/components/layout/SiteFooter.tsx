"use client";

import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import { BrandFacebookIcon } from "@/components/icons/2D/BrandFacebookIcon";
import { BrandInstagramIcon } from "@/components/icons/2D/BrandInstagramIcon";
import { BrandTiktokIcon } from "@/components/icons/2D/BrandTiktokIcon";
import { BrandXIcon } from "@/components/icons/2D/BrandXIcon";
import { cn } from "@/lib/utils";
import {
  FOOTER_APP,
  FOOTER_BRAND,
  FOOTER_COMPANY_LINKS,
  FOOTER_COMPANY_LINKS_LOGGED_IN,
  FOOTER_COPYRIGHT,
  FOOTER_PAYMENT_METHODS,
  FOOTER_SECTION_TITLES,
  FOOTER_SOCIAL_LINKS,
  FOOTER_TOP_CATEGORY_IDS,
  footerCategoryHref,
  footerCategoryLabel,
  type FooterCompanyLink,
} from "@/lib/footer";

const SOCIAL_ICON: Record<
  (typeof FOOTER_SOCIAL_LINKS)[number]["id"],
  ComponentType<{ className?: string }>
> = {
  x: BrandXIcon,
  facebook: BrandFacebookIcon,
  instagram: BrandInstagramIcon,
  tiktok: BrandTiktokIcon,
};

function resolveCompanyHref(link: FooterCompanyLink, isLoggedIn: boolean): string {
  if ("href" in link) return link.href;
  return isLoggedIn ? "/courses" : "#courses";
}

const socialAccentClass =
  "flex h-7 w-7 items-center justify-center rounded-full bg-tertiary text-tertiary-foreground shadow-sm transition hover:bg-tertiary/90 hover:shadow-md";

const socialMutedClass =
  "flex h-7 w-7 items-center justify-center rounded-full border border-primary/10 bg-primary/5 text-primary shadow-sm transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary-foreground hover:shadow-md";

export interface SiteFooterProps {
  isLoggedIn: boolean;
}

export function SiteFooter({ isLoggedIn }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const companySectionTitle = isLoggedIn
    ? FOOTER_SECTION_TITLES.companyLoggedIn
    : FOOTER_SECTION_TITLES.company;

  return (
    <footer className="border-t border-primary/10 bg-gradient-to-b from-primary/5 via-secondary/5 to-tertiary/10 px-6 py-10 text-xs text-zinc-500">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.5fr)_minmax(0,2fr)]">
          <div className="space-y-4">
            <div className="text-lg font-semibold tracking-tight text-primary">
              <span>{FOOTER_BRAND.name}</span>
            </div>
            <p className="max-w-xs text-[11px] leading-relaxed text-zinc-600">
              {FOOTER_BRAND.tagline}
            </p>
            <div className="space-y-2">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                {FOOTER_SECTION_TITLES.social}
              </p>
              <div className="flex gap-2">
                {FOOTER_SOCIAL_LINKS.map((item) => {
                  const Icon = SOCIAL_ICON[item.id];
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      aria-label={item.ariaLabel}
                      className={cn(
                        item.variant === "accent" ? socialAccentClass : socialMutedClass
                      )}
                    >
                      <Icon className="size-3.5" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-3 text-[11px] text-zinc-600">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              {companySectionTitle}
            </p>
            <div className="space-y-1">
              {isLoggedIn
                ? FOOTER_COMPANY_LINKS_LOGGED_IN.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="block transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))
                : FOOTER_COMPANY_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      href={resolveCompanyHref(link, isLoggedIn)}
                      className="block transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
            </div>
          </div>

          <div className="space-y-3 text-[11px] text-zinc-600">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              {FOOTER_SECTION_TITLES.categories}
            </p>
            <div className="space-y-1">
              {FOOTER_TOP_CATEGORY_IDS.map((id) => (
                <Link
                  key={id}
                  href={footerCategoryHref(id)}
                  className="block transition-colors hover:text-primary"
                >
                  {footerCategoryLabel(id)}
                </Link>
              ))}
            </div>
          </div>

          <div id="contact" className="space-y-4 scroll-mt-24 text-[11px] text-zinc-600">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              {FOOTER_APP.title}
            </p>
            <p className="max-w-xs leading-relaxed">{FOOTER_APP.description}</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href={FOOTER_APP.stores.googlePlay.href}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-[11px] font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 hover:shadow-md"
              >
                <span className="text-[16px]">▶</span>
                <span className="text-left leading-tight">
                  <span className="block text-[9px] uppercase tracking-[0.16em] text-primary-foreground/70">
                    {FOOTER_APP.stores.googlePlay.subline}
                  </span>
                  {FOOTER_APP.stores.googlePlay.headline}
                </span>
              </Link>
              <Link
                href={FOOTER_APP.stores.appStore.href}
                className="inline-flex items-center gap-2 rounded-md bg-tertiary px-3 py-2 text-[11px] font-medium text-tertiary-foreground shadow-sm transition hover:bg-tertiary/90 hover:shadow-md"
              >
                <span className="text-[16px]"></span>
                <span className="text-left leading-tight">
                  <span className="block text-[9px] uppercase tracking-[0.16em] text-tertiary-foreground/70">
                    {FOOTER_APP.stores.appStore.subline}
                  </span>
                  {FOOTER_APP.stores.appStore.headline}
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-4 border-t border-primary/10 pt-6">
          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
              {FOOTER_SECTION_TITLES.payment}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {FOOTER_PAYMENT_METHODS.map((method) => (
                <span
                  key={method.id}
                  className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-200 bg-white px-3 py-1.5 shadow-sm"
                >
                  <Image
                    src={method.src}
                    alt={method.alt}
                    width={56}
                    height={28}
                    className="h-6 w-auto max-w-[72px] object-contain"
                  />
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-2 border-t border-zinc-100 pt-4 text-[11px] text-zinc-500 md:flex-row">
            <p>
              © {year} {FOOTER_BRAND.name}. All rights reserved.
            </p>
            <p>{FOOTER_COPYRIGHT.tagline}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
