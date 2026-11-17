"use client";

import { useSearchParams } from "next/navigation";
import { resolveRegistrationSource } from "@/constants/registration-offers";
import { cn } from "@/lib/utils";

type WorkshopPromoBannerProps = {
  normalPrice?: number | null;
  promoIndividualPrice?: number | null;
  promoBarengTemanPrice?: number | null;
};

const STEPS = [
  { n: 1, label: "Isi data", emphasize: false },
  { n: 2, label: "Pilih promo", emphasize: true },
  { n: 3, label: "Chat admin", emphasize: false },
] as const;

function formatIdr(amount: number): string {
  return `Rp ${Math.round(amount).toLocaleString("id-ID")}`;
}

function positivePrice(value: number | null | undefined): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null;
  }
  return Math.round(value);
}

export function WorkshopPromoBanner({
  normalPrice,
  promoIndividualPrice,
  promoBarengTemanPrice,
}: WorkshopPromoBannerProps) {
  const searchParams = useSearchParams();
  const source = resolveRegistrationSource(searchParams.get("source"));

  if (source !== "workshop_promo") {
    return null;
  }

  const individual = positivePrice(promoIndividualPrice);
  const barengTeman = positivePrice(promoBarengTemanPrice);
  const normal = positivePrice(normalPrice);
  const promoPrices = [individual, barengTeman].filter(
    (value): value is number => value != null,
  );
  const fromPrice =
    promoPrices.length > 0 ? Math.min(...promoPrices) : null;
  const showNormalStrike =
    normal != null && fromPrice != null && normal > fromPrice;

  return (
    <div className="mb-3 rounded-xl border border-brand-periwinkle/60 bg-brand-pale/40 px-3 py-3 text-center sm:px-4">
      <p className="text-sm font-semibold leading-snug text-brand-deep">
        Tinggal selangkah lagi buat dapat harga spesial workshop!
      </p>

      {fromPrice != null ? (
        <div className="mt-1.5 space-y-0.5">
          <p className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-0.5 text-brand-deep">
            <span className="text-base font-bold tracking-tight text-brand-royal sm:text-lg">
              Mulai {formatIdr(fromPrice)}
            </span>
            {showNormalStrike ? (
              <span className="text-sm text-muted-foreground line-through decoration-muted-foreground/80">
                {formatIdr(normal)}
              </span>
            ) : null}
          </p>

          {individual != null || barengTeman != null ? (
            <p className="text-xs leading-snug text-muted-foreground">
              {[
                individual != null
                  ? `Individual ${formatIdr(individual)}`
                  : null,
                barengTeman != null
                  ? `Bareng teman ${formatIdr(barengTeman)} / orang`
                  : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          ) : null}
        </div>
      ) : null}

      <ol
        className="mt-2 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-xs leading-snug"
        aria-label="Langkah pendaftaran"
      >
        {STEPS.map((step, index) => {
          const content = (
            <span className="inline-flex items-center gap-1">
              <span
                className={cn(
                  "inline-flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold leading-none tabular-nums",
                  step.emphasize
                    ? "bg-brand-royal text-white"
                    : "bg-brand-periwinkle/55 text-brand-deep",
                )}
              >
                {step.n}
              </span>
              <span
                className={cn(
                  step.emphasize
                    ? "font-bold text-brand-royal underline decoration-brand-royal/40 underline-offset-2"
                    : "font-medium text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </span>
          );

          return (
            <li key={step.n} className="flex items-center gap-1.5">
              {index > 0 ? (
                <span aria-hidden className="text-brand-periwinkle">
                  →
                </span>
              ) : null}
              {step.emphasize ? (
                <a
                  href="#promo"
                  className="rounded-sm transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-royal"
                >
                  {content}
                </a>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
