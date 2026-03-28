"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SKILL_STACK_ITEMS } from "@/features/skills/data/skillStacks";

export default function SkillsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLeaveTimer = useCallback(() => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  }, []);

  const handleEnter = useCallback(
    (index: number) => {
      clearLeaveTimer();
      setOpenIndex(index);
    },
    [clearLeaveTimer]
  );

  const handleLeave = useCallback(() => {
    clearLeaveTimer();
    leaveTimer.current = setTimeout(() => setOpenIndex(null), 120);
  }, [clearLeaveTimer]);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex]);

  return (
    <section className="relative border-y border-primary/10 bg-gradient-to-b from-white/90 via-primary/5 to-secondary/5 px-6 py-16 md:py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-2xl" />

      <div className="mx-auto max-w-6xl space-y-8 md:space-y-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Skills you actually use at work
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">
              What you will learn
            </h2>
            <p className="max-w-xl text-sm text-zinc-600 md:text-[0.95rem]">
              Build the core skills that every modern data professional needs – from querying raw
              data to presenting clear, actionable insights.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-600">
            <div className="flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 shadow-sm ring-1 ring-zinc-200/80">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-[11px] font-semibold text-emerald-600">
                {SKILL_STACK_ITEMS.length}
              </span>
              <span className="whitespace-nowrap">Job-ready skill pillars</span>
            </div>
          </div>
        </div>

        <div className="grid gap-3 overflow-visible md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-start">
          <div className="flex flex-wrap gap-2.5 overflow-visible">
            {SKILL_STACK_ITEMS.map((item, index) => (
              <div
                key={item.chipLabel}
                className="relative"
                onMouseEnter={() => handleEnter(index)}
                onMouseLeave={handleLeave}
              >
                <Button
                  type="button"
                  variant="outline"
                  aria-expanded={openIndex === index}
                  aria-haspopup="dialog"
                  className={cn(
                    "group h-auto gap-2 rounded-full border-zinc-200 bg-white/80 px-4 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-primary hover:shadow-md",
                    openIndex === index && "border-primary/50 bg-primary/5 text-primary shadow-md"
                  )}
                  onFocus={() => handleEnter(index)}
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/5 text-[10px] font-semibold text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                    {index + 1}
                  </span>
                  <span>{item.chipLabel}</span>
                </Button>

                {openIndex === index && (
                  <div
                    role="dialog"
                    aria-label={`${item.popoverTitle} stack preview`}
                    className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-[min(100vw-2rem,20rem)] rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl md:left-0 md:right-auto"
                    onMouseEnter={() => handleEnter(index)}
                    onMouseLeave={handleLeave}
                  >
                    <p className="text-[11px] font-semibold text-zinc-900">{item.popoverTitle}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-zinc-600">{item.popoverBody}</p>

                    <div className="mt-4 flex flex-col gap-2">
                      {item.stackLayers.map((layer, layerIndex) => (
                        <div
                          key={layer}
                          className="rounded-lg border border-primary/15 bg-gradient-to-br from-white to-primary/5 px-3 py-2 text-[10px] font-medium leading-snug text-primary shadow-sm"
                          style={{ marginLeft: layerIndex * 8 }}
                        >
                          <span className="text-[9px] font-semibold uppercase tracking-wide text-primary/70">
                            Stack {layerIndex + 1}
                          </span>
                          <span className="mt-0.5 block text-zinc-800">{layer}</span>
                        </div>
                      ))}
                    </div>

                    <p className="mt-3 border-t border-zinc-100 pt-2 text-[10px] text-zinc-500">
                      Skills 1–{index + 1} combine into one workflow in the Digica curriculum.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-3 rounded-2xl border border-dashed border-primary/20 bg-primary/5 px-4 py-4 text-xs text-primary md:mt-0 md:px-5 md:py-5">
            <p className="font-medium">
              Hover over each skill chip to see how your stack comes together as a data professional.
            </p>
            <p className="text-primary/80">
              This isn&apos;t a random list. Every module is designed to build on the previous one so you graduate
              with a cohesive toolkit – not isolated fragments of knowledge.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
