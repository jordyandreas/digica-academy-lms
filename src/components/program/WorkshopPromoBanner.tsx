"use client";

import { useSearchParams } from "next/navigation";
import { resolveRegistrationSource } from "@/constants/registration-offers";

export function WorkshopPromoBanner() {
  const searchParams = useSearchParams();
  const source = resolveRegistrationSource(searchParams.get("source"));

  if (source !== "workshop_promo") {
    return null;
  }

  return (
    <div className="mb-3 rounded-xl border border-brand-periwinkle/60 bg-brand-pale/40 px-4 py-3 text-center">
      <p className="text-sm font-semibold leading-snug text-brand-deep">
        Tinggal selangkah lagi buat dapat harga spesial workshop!
      </p>
      <p className="mt-1 text-xs leading-snug text-muted-foreground">
        Isi data di bawah, pilih paket, lalu lanjut chat admin untuk pembayaran.
      </p>
    </div>
  );
}
