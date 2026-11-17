"use client";

import { useSearchParams } from "next/navigation";
import { ProgramRegistrationHero } from "@/components/program/ProgramRegistrationHero";
import { resolveRegistrationSource } from "@/constants/registration-offers";

type RegistrationHeroWithSourceProps = {
  title: string;
  startDate: string | null;
  endDate: string | null;
  startTime: string | null;
  endTime: string | null;
  summaryHtml: string | null;
  registrationBannerUrl: string | null;
  promoBannerUrl: string | null;
  fallbackImageSrc: string;
};

export function RegistrationHeroWithSource({
  title,
  startDate,
  endDate,
  startTime,
  endTime,
  summaryHtml,
  registrationBannerUrl,
  promoBannerUrl,
  fallbackImageSrc,
}: RegistrationHeroWithSourceProps) {
  const searchParams = useSearchParams();
  const source = resolveRegistrationSource(searchParams.get("source"));
  const enablePromoSlide = source === "workshop_promo";

  return (
    <ProgramRegistrationHero
      title={title}
      startDate={startDate}
      endDate={endDate}
      startTime={startTime}
      endTime={endTime}
      summaryHtml={summaryHtml}
      registrationBannerUrl={registrationBannerUrl}
      promoBannerUrl={promoBannerUrl}
      enablePromoSlide={enablePromoSlide}
      fallbackImageSrc={fallbackImageSrc}
    />
  );
}
