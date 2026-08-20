import Image from "next/image";
import { CalendarDays, Clock3, Sparkles } from "lucide-react";
import { ProgramRegistrationSummary } from "@/components/program/ProgramRegistrationSummary";
import { isRemoteImageSrc } from "@/features/programs/programPublicContent";
import {
  formatProgramDateRange,
  formatProgramTimeRange,
} from "@/utils/program-public";

type ProgramRegistrationHeroProps = {
  title: string;
  startDate: string | null;
  endDate: string | null;
  startTime: string | null;
  endTime: string | null;
  summaryHtml: string | null;
  registrationBannerUrl: string | null;
  fallbackImageSrc: string;
};

export function ProgramRegistrationHero({
  title,
  startDate,
  endDate,
  startTime,
  endTime,
  summaryHtml,
  registrationBannerUrl,
  fallbackImageSrc,
}: ProgramRegistrationHeroProps) {
  const hasCustomBanner = Boolean(registrationBannerUrl);

  if (hasCustomBanner) {
    return (
      <div className="overflow-hidden rounded-2xl border border-brand-periwinkle/50">
        <Image
          src={registrationBannerUrl!}
          alt={`${title} banner`}
          width={1200}
          height={630}
          priority
          unoptimized={isRemoteImageSrc(registrationBannerUrl!)}
          className="h-auto w-full object-cover"
          sizes="(max-width: 512px) 100vw, 512px"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl border border-brand-periwinkle/35">
        <Image
          src={fallbackImageSrc}
          alt=""
          width={800}
          height={400}
          priority
          className="h-auto w-full object-cover"
          sizes="(max-width: 512px) 100vw, 512px"
        />
      </div>

      <div className="space-y-4 rounded-2xl border border-brand-periwinkle/35 bg-brand-pale/15 p-5 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand-periwinkle/35 bg-brand-pale/20 px-3 py-1 text-xs font-medium text-brand-deep">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Digica Program Registration
        </div>

        <h1 className="text-2xl font-semibold text-brand-deep">{title}</h1>

        <div className="flex items-start gap-3 rounded-xl border border-brand-periwinkle/35 bg-brand-pale/20 px-4 py-3 text-left">
          <div className="min-w-0 flex-1">
            <p className="flex items-start gap-2 text-xs font-medium text-brand-deep sm:text-sm">
              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span className="min-w-0">
                {formatProgramDateRange(startDate, endDate)}
              </span>
            </p>
          </div>
          <div className="w-px self-stretch bg-border" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="flex items-start gap-2 text-xs font-medium text-brand-deep sm:text-sm">
              <Clock3 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span className="min-w-0">
                {formatProgramTimeRange(startTime, endTime)}
              </span>
            </p>
          </div>
        </div>

        <ProgramRegistrationSummary summaryHtml={summaryHtml} />
      </div>
    </div>
  );
}
