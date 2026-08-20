"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { DigicaLogo } from "@/components/brand/DigicaLogo";
import { HashLink } from "@/components/layout/HashLink";
import { BrandInstagramIcon } from "@/components/icons/2D/BrandInstagramIcon";
import { BrandThreadsIcon } from "@/components/icons/2D/BrandThreadsIcon";
import { BrandTiktokIcon } from "@/components/icons/2D/BrandTiktokIcon";
import { BrandWhatsAppIcon } from "@/components/icons/2D/BrandWhatsAppIcon";
import {
  FOOTER_BRAND,
  FOOTER_COMPANY_LINKS,
  FOOTER_COPYRIGHT,
  FOOTER_LEGAL_LINKS,
  FOOTER_SOCIAL_LINKS,
} from "@/lib/footer";
import { buildGeneralWhatsAppUrl } from "@/utils/admin-whatsapp";

const SOCIAL_ICON: Record<
  (typeof FOOTER_SOCIAL_LINKS)[number]["id"],
  ComponentType<{ className?: string }>
> = {
  threads: BrandThreadsIcon,
  instagram: BrandInstagramIcon,
  tiktok: BrandTiktokIcon,
  whatsapp: BrandWhatsAppIcon,
};

const socialClass =
  "flex h-8 w-8 items-center justify-center rounded-full border border-primary/10 bg-primary/5 text-primary shadow-sm transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary-foreground hover:shadow-md";

export function SiteFooter() {
  const links = FOOTER_COMPANY_LINKS;
  const whatsappHref = buildGeneralWhatsAppUrl();

  return (
    <footer className="border-t border-primary/10 bg-gradient-to-b from-primary/5 via-secondary/5 to-tertiary/10 px-6 py-8 text-xs text-zinc-500">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-12">
          <div className="max-w-sm space-y-3">
            <DigicaLogo className="items-start" imageClassName="h-8 w-auto" />
            <p className="text-[11px] leading-relaxed text-zinc-600">
              {FOOTER_BRAND.tagline}
            </p>
            <div className="flex gap-2 pt-0.5">
              {FOOTER_SOCIAL_LINKS.map((item) => {
                const Icon = SOCIAL_ICON[item.id];
                const href =
                  item.id === "whatsapp" ? whatsappHref : item.href;
                if (!href) return null;
                return (
                  <Link
                    key={item.id}
                    href={href}
                    aria-label={item.ariaLabel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={socialClass}
                  >
                    <Icon className="size-3.5" />
                  </Link>
                );
              })}
            </div>
          </div>

          <nav
            aria-label="Quick links"
            className="grid grid-cols-2 gap-x-10 gap-y-2.5 text-sm text-zinc-600"
          >
            {links.map((link) => (
              <HashLink
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </HashLink>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-primary/10 pt-5 text-[11px] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2020 {FOOTER_BRAND.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-3">
              {FOOTER_LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <span className="hidden text-zinc-300 sm:inline" aria-hidden>
              ·
            </span>
            <p>{FOOTER_COPYRIGHT.tagline}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
