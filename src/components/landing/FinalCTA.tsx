import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HashLink } from "@/components/layout/HashLink";
import { BrandWhatsAppIcon } from "@/components/icons/2D/BrandWhatsAppIcon";
import { buildGeneralWhatsAppUrl } from "@/utils/admin-whatsapp";

export default function FinalCTA() {
  const whatsappHref = buildGeneralWhatsAppUrl();

  return (
    <section className="border-y border-primary/10 bg-primary/5 px-6 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="glass-panel flex flex-col items-start gap-6 rounded-2xl border border-zinc-200/80 bg-white/85 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8 md:py-9">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              It&apos;s your time now!
            </p>
            <h2 className="font-display text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">
              Start your data career today
            </h2>
            <p className="max-w-xl text-sm text-zinc-600 md:text-[0.95rem]">
              Join a practical bootcamp, work on real projects, and build a portfolio that shows
              hiring managers you can deliver.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Button asChild size="lg" className="w-full px-7 sm:w-auto">
              <HashLink href="#programs">View Programs</HashLink>
            </Button>
            {whatsappHref ? (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full px-7 sm:w-auto"
              >
                <Link
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BrandWhatsAppIcon className="size-4" />
                  Chat on WhatsApp
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

