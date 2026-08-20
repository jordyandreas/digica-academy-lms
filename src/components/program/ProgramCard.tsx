"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronRight, Presentation } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { ProgramCardModel, ProgramType } from "@/features/programs/types";
import { Card } from "@/components/ui/card";

const PROGRAM_IMAGES: Record<ProgramType, string> = {
  workshop: "/images/programs/workshop.png",
  mini_bootcamp: "/images/programs/mini-bootcamp.png",
  bootcamp: "/images/programs/bootcamp.png",
};

type ProgramCardProps = {
  program: ProgramCardModel;
};

export function ProgramCard({ program }: ProgramCardProps) {
  const reduceMotion = useReducedMotion();
  const imageSrc = PROGRAM_IMAGES[program.type] ?? PROGRAM_IMAGES.bootcamp;
  const hasDetailLink = Boolean(program.ctaHref && program.ctaHref !== "#");

  const cardInner = (
    <Card className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-200 hover:border-primary/25 hover:shadow-lg">
      <div className="relative aspect-[2/1] w-full overflow-hidden bg-primary/5 sm:aspect-[16/9]">
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {program.batchLabel && program.type !== "workshop" ? (
          <span className="absolute left-3 top-3 rounded-full border border-white/50 bg-white/55 px-2.5 py-1 text-[11px] font-semibold text-primary shadow-[0_4px_16px_rgba(0,0,0,0.1)] backdrop-blur-md backdrop-saturate-150">
            {program.batchLabel}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <h3 className="line-clamp-2 min-h-[2.6em] text-[0.95rem] font-bold leading-snug tracking-tight text-zinc-900">
          {program.title}
        </h3>

        <div className="mt-3 mb-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] text-zinc-800">
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <CalendarDays
              className="h-3.5 w-3.5 shrink-0 text-primary"
              aria-hidden
            />
            <span className="truncate font-medium">{program.dateLabel}</span>
          </span>
          {program.sessionsLabel ? (
            <>
              <span className="text-zinc-400" aria-hidden>
                ·
              </span>
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <Presentation
                  className="h-3.5 w-3.5 shrink-0 text-primary"
                  aria-hidden
                />
                <span className="truncate font-medium">
                  {program.sessionsLabel}
                </span>
              </span>
            </>
          ) : null}
        </div>

        <div className="my-4 mt-auto h-px w-full bg-zinc-100" aria-hidden />

        <div className="flex items-center justify-between gap-3">
          <span className="text-lg font-bold tabular-nums text-primary">
            {program.priceLabel}
          </span>
          {hasDetailLink ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm transition-colors group-hover:bg-primary/90">
              Register
              <ChevronRight className="h-3.5 w-3.5 opacity-90" aria-hidden />
            </span>
          ) : (
            <span
              className="inline-flex shrink-0 items-center gap-1 rounded-full bg-zinc-200 px-4 py-2.5 text-xs font-semibold text-zinc-500"
              aria-disabled
            >
              Details soon
            </span>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <motion.div
      className="h-full"
      whileHover={reduceMotion ? undefined : { y: -6, scale: 1.01 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 320, damping: 28 }
      }
    >
      {hasDetailLink ? (
        <Link
          href={program.ctaHref}
          className="group block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label={`View details for ${program.title}`}
        >
          {cardInner}
        </Link>
      ) : (
        cardInner
      )}
    </motion.div>
  );
}
