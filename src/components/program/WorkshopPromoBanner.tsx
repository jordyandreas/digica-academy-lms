"use client";

import { useSearchParams } from "next/navigation";
import { resolveRegistrationSource } from "@/constants/registration-offers";

type WorkshopPromoBannerProps = {
  normalPrice?: number | null;
  promoIndividualPrice?: number | null;
  promoBarengTemanPrice?: number | null;
};

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
    <div className="mb-3 rounded-xl border border-brand-periwinkle/60 bg-brand-pale/40 px-4 py-3 text-center">
      <p className="text-sm font-semibold leading-snug text-brand-deep">
        Tinggal selangkah lagi buat dapat harga spesial workshop!
      </p>

      {fromPrice != null ? (
        <div className="mt-2 space-y-1">
          <p className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-0.5 text-brand-deep">
            <span className="text-lg font-bold tracking-tight text-brand-royal">
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

      <p className="mt-1 text-xs leading-snug text-muted-foreground">
        Isi data di bawah, pilih promo, lalu lanjut chat admin untuk pembayaran.
      </p>
    </div>
  );
}
