import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EXPERIENCE_POINTS } from "@/features/experience/data/experiencePoints";

export default function ExperienceSection() {
  return (
    <section
      id="experience"
      className="relative overflow-hidden bg-secondary/5 px-6 py-16 md:py-20"
    >
      <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-80 bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-3xl" />

      <div className="mx-auto max-w-6xl space-y-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Designed for real-world work
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">
              A learning experience built for shipping
            </h2>
            <p className="max-w-xl text-sm text-zinc-600 md:text-[0.95rem]">
              Digica is focused on execution. Short, focused lessons followed by exercises that
              mirror real tasks you will face in product and analytics teams.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-600">
            <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 shadow-sm ring-1 ring-zinc-200/80">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-[11px] font-semibold text-emerald-600">
                95%
              </span>
              <span className="whitespace-nowrap">
                Learners finish their first project
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {EXPERIENCE_POINTS.map((point, index) => (
            <div
              key={point.id}
              className="group glass-panel flex h-full min-h-0 flex-col rounded-2xl border border-zinc-200/80 bg-white/80 p-4 shadow-sm ring-1 ring-transparent transition duration-300 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:ring-primary/20 md:p-5"
            >
              <div className="mb-3 flex shrink-0 items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-zinc-900">{point.title}</h3>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/5 text-[11px] font-medium text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  {index + 1}
                </span>
              </div>
              <p className="min-h-0 flex-1 text-xs leading-relaxed text-zinc-600">
                {point.description}
              </p>
              <div className="mt-4 flex shrink-0 items-center justify-between gap-2 border-t border-zinc-100/80 pt-4 text-[11px] text-zinc-500">
                <span className="inline-flex items-center gap-1 transition group-hover:text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500" />
                  Real project milestone
                </span>
                <Button
                  asChild
                  variant="outline"
                  className="h-auto shrink-0 rounded-full border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[10px] font-medium text-zinc-700 group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:text-primary"
                >
                  <Link href={`/experience/${point.id}`}>Explore details</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
