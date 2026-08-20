import type { ComponentType } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderAuth } from "@/components/auth/HeaderAuth";
import { BrandInstagramIcon } from "@/components/icons/2D/BrandInstagramIcon";
import { BrandThreadsIcon } from "@/components/icons/2D/BrandThreadsIcon";
import { BrandTiktokIcon } from "@/components/icons/2D/BrandTiktokIcon";
import { BrandWhatsAppIcon } from "@/components/icons/2D/BrandWhatsAppIcon";
import type { LegalDocumentContent } from "@/features/legal/types";
import { FOOTER_SOCIAL_LINKS } from "@/lib/footer";
import { buildLegalInquiryWhatsAppUrl } from "@/utils/admin-whatsapp";

type LegalDocumentProps = {
  document: LegalDocumentContent;
  related: { href: string; label: string };
};

const SOCIAL_ICON: Record<
  (typeof FOOTER_SOCIAL_LINKS)[number]["id"],
  ComponentType<{ className?: string }>
> = {
  threads: BrandThreadsIcon,
  instagram: BrandInstagramIcon,
  tiktok: BrandTiktokIcon,
  whatsapp: BrandWhatsAppIcon,
};

const SOCIAL_LABEL: Record<(typeof FOOTER_SOCIAL_LINKS)[number]["id"], string> = {
  threads: "Threads",
  instagram: "Instagram",
  tiktok: "TikTok",
  whatsapp: "WhatsApp",
};

const contactLinkClass =
  "inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-2 text-sm font-medium text-primary shadow-sm transition hover:border-primary/30 hover:bg-primary/10";

export function LegalDocument({ document, related }: LegalDocumentProps) {
  const whatsappUrl = buildLegalInquiryWhatsAppUrl();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary/5 to-white">
      <header className="glass-panel sticky top-0 z-10 border-b border-zinc-200/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Button asChild variant="ghost" size="sm" className="gap-2 text-primary">
            <Link href="/">
              <ChevronLeft className="h-4 w-4" />
              Home
            </Link>
          </Button>
          <HeaderAuth variant="compact" />
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <header className="mb-10 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
            {document.eyebrow}
          </p>
          <h1 className="font-display text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            {document.title}
          </h1>
          <p className="text-sm text-zinc-500">Last updated {document.lastUpdated}</p>
          <p className="text-sm leading-relaxed text-zinc-600 md:text-[15px]">
            {document.description}
          </p>
        </header>

        <div className="space-y-8">
          {document.sections.map((section, index) => (
            <section key={section.title} className="space-y-3">
              <h2 className="font-display text-lg font-semibold tracking-tight text-zinc-900">
                {index + 1}. {section.title}
              </h2>
              {section.paragraphs.map((paragraph, paragraphIndex) => (
                <p
                  key={`${section.title}-p-${paragraphIndex}`}
                  className="text-[15px] leading-relaxed text-zinc-700 md:text-base"
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets && section.bullets.length > 0 ? (
                <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-zinc-700 md:text-base">
                  {section.bullets.map((bullet, bulletIndex) => (
                    <li key={`${section.title}-b-${bulletIndex}`}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <footer className="mt-12 space-y-5 border-t border-zinc-200/80 pt-8">
          <p className="text-sm text-zinc-600">
            Also read our{" "}
            <Link
              href={related.href}
              className="font-semibold text-primary underline underline-offset-2"
            >
              {related.label}
            </Link>
            .
          </p>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-zinc-900">Contact us on:</p>
            <div className="flex flex-wrap items-center gap-2">
              {FOOTER_SOCIAL_LINKS.map((item) => {
                const Icon = SOCIAL_ICON[item.id];
                const href = item.id === "whatsapp" ? whatsappUrl : item.href;
                if (!href) return null;
                return (
                  <a
                    key={item.id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.ariaLabel}
                    className={contactLinkClass}
                  >
                    <Icon className="size-4" />
                    {SOCIAL_LABEL[item.id]}
                  </a>
                );
              })}
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
