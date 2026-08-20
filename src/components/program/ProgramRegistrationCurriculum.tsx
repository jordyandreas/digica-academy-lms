import { ChevronDown } from "lucide-react";
import { ProgramCurriculum } from "@/components/program/ProgramCurriculum";
import type { ProgramCurriculum as ProgramCurriculumModel } from "@/features/skills/data/programCurricula";

type ProgramRegistrationCurriculumProps = {
  curriculum: ProgramCurriculumModel;
};

export function ProgramRegistrationCurriculum({
  curriculum,
}: ProgramRegistrationCurriculumProps) {
  return (
    <details className="group rounded-2xl border border-brand-periwinkle/35 bg-brand-pale/10 px-4 py-3 shadow-[0_8px_24px_rgba(98,10,121,0.05)]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-brand-deep marker:content-none [&::-webkit-details-marker]:hidden">
        <span>See curriculum</span>
        <span className="inline-flex items-center gap-2 text-xs font-normal text-zinc-500">
          {curriculum.sessionLabel}
          <ChevronDown className="h-4 w-4 shrink-0 transition group-open:rotate-180" />
        </span>
      </summary>
      <div className="pt-3 pb-1">
        <ProgramCurriculum curriculum={curriculum} variant="compact" />
      </div>
    </details>
  );
}
