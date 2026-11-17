import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import { getPublicProgramByIdentifier } from "@/features/programs/getPublicPrograms";
import { Button } from "@/components/ui/button";
import { HeaderAuth } from "@/components/auth/HeaderAuth";
import { DigicaLogo } from "@/components/brand/DigicaLogo";
import { ProgramRegistrationForm } from "@/components/program/ProgramRegistrationForm";
import { ProgramRegistrationCurriculum } from "@/components/program/ProgramRegistrationCurriculum";
import { ProgramRegistrationHero } from "@/components/program/ProgramRegistrationHero";
import { RegistrationHeroWithSource } from "@/components/program/RegistrationHeroWithSource";
import { RegistrationWhatsAppFab } from "@/components/program/RegistrationWhatsAppFab";
import { WorkshopPromoBanner } from "@/components/program/WorkshopPromoBanner";
import { buildInquiryWhatsAppUrl } from "@/utils/admin-whatsapp";
import { getCurriculumForProgram } from "@/features/skills/data/programCurricula";

type ProgramRegistrationPageProps = {
  identifier: string;
};

export async function buildProgramRegistrationMetadata(
  identifier: string,
): Promise<Metadata> {
  const program = await getPublicProgramByIdentifier(identifier);

  if (!program) {
    return { title: "Program" };
  }

  const description = `${program.typeLabel} · ${program.dateLabel}. Register for this live Digica Academy cohort.`;

  return {
    title: program.title,
    description,
    openGraph: {
      title: program.title,
      description,
    },
  };
}

export async function ProgramRegistrationPage({
  identifier,
}: ProgramRegistrationPageProps) {
  const program = await getPublicProgramByIdentifier(identifier);

  if (!program) notFound();

  const inquiryWhatsAppUrl = buildInquiryWhatsAppUrl({
    programName: program.title,
  });

  const curriculum = getCurriculumForProgram({
    type: program.type,
    title: program.title,
    slug: program.publicSlug,
  });

  const hasCustomBanner = Boolean(program.registrationBannerUrl);

  return (
    <div className="registration-shell min-h-screen">
      <header className="glass-panel sticky top-0 z-10 border-b border-zinc-200/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Button asChild variant="ghost" size="sm" className="gap-2 text-primary">
            <Link href="/programs">
              <ChevronLeft className="h-4 w-4" />
              Programs
            </Link>
          </Button>
          <HeaderAuth />
        </div>
      </header>

      <main className="mx-auto w-full max-w-md px-4 py-6 pb-24 sm:max-w-lg sm:py-8 lg:max-w-6xl lg:px-6">
        <div className="flex w-full flex-col gap-5 rounded-2xl border border-brand-periwinkle/40 bg-card p-5 shadow-sm sm:p-6 lg:gap-6 lg:p-8">
          <div className="flex flex-col items-center gap-1">
            <DigicaLogo showEst priority />
          </div>

          <Suspense fallback={null}>
            <WorkshopPromoBanner
              normalPrice={program.price}
              promoIndividualPrice={program.promoIndividualPrice}
              promoBarengTemanPrice={program.promoBarengTemanPrice}
            />
          </Suspense>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-start lg:gap-8">
            <div className="flex min-w-0 flex-col gap-5">
              <Suspense
                fallback={
                  <ProgramRegistrationHero
                    title={program.title}
                    startDate={program.startDate}
                    endDate={program.endDate}
                    startTime={program.startTime}
                    endTime={program.endTime}
                    summaryHtml={program.summaryHtml}
                    registrationBannerUrl={program.registrationBannerUrl}
                    fallbackImageSrc={program.fallbackImageSrc}
                  />
                }
              >
                <RegistrationHeroWithSource
                  title={program.title}
                  startDate={program.startDate}
                  endDate={program.endDate}
                  startTime={program.startTime}
                  endTime={program.endTime}
                  summaryHtml={program.summaryHtml}
                  registrationBannerUrl={program.registrationBannerUrl}
                  promoBannerUrl={program.promoBannerUrl}
                  fallbackImageSrc={program.fallbackImageSrc}
                />
              </Suspense>

              {!hasCustomBanner && curriculum ? (
                <ProgramRegistrationCurriculum curriculum={curriculum} />
              ) : null}
            </div>

            <div className="min-w-0 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-brand-periwinkle/35 bg-brand-pale/10 p-5 shadow-[0_8px_24px_rgba(98,10,121,0.05)] sm:p-6">
                <ProgramRegistrationForm
                  programId={program.id}
                  programType={program.type}
                  programTitle={program.title}
                  embedded
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <RegistrationWhatsAppFab href={inquiryWhatsAppUrl} />
    </div>
  );
}
