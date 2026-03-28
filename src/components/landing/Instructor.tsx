import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const mentors = [
  {
    name: "Jordy Andreas",
    role: "Senior Frontend Engineer",
    specialty: "React, TypeScript, Design Systems",
  },
  {
    name: "Asha Kumar",
    role: "Data & Analytics Lead",
    specialty: "Python, SQL, Dashboards",
  },
  {
    name: "Michael Chen",
    role: "Product Engineer",
    specialty: "Full‑stack, Product Thinking",
  },
  {
    name: "Sara Lopez",
    role: "UX & Interaction Designer",
    specialty: "UX Flows, Prototyping",
  },
];

export default function Instructor() {
  return (
    <section
      id="instructor"
      className="border-y border-zinc-200/80 bg-gradient-to-b from-primary/5 via-secondary/5 to-tertiary/5 px-6 py-16 md:py-20"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-3">
            <p className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary shadow-sm">
              Mentor Team
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
              Meet our expert mentors
            </h2>
            <p className="max-w-xl text-sm text-zinc-600 md:text-[0.95rem]">
              Learn from practitioners who ship real products. Each mentor blends{" "}
              <span className="font-medium text-primary">hands‑on experience</span> with{" "}
              <span className="font-medium text-tertiary">clear, structured teaching</span> so you
              can move from theory to production‑ready skills.
            </p>
          </div>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full rounded-full border-zinc-200/90 bg-white px-7 text-sm font-medium text-zinc-800 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-zinc-100/90 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:text-primary hover:shadow-[0_8px_24px_-6px_rgba(108,43,141,0.18)] md:w-auto"
          >
            <Link
              href="#mentors-grid"
              className="group inline-flex items-center justify-center gap-1.5"
            >
              View all mentors
              <ChevronRight
                className="h-4 w-4 shrink-0 text-primary/60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
                aria-hidden
              />
            </Link>
          </Button>
        </div>

        <div
          id="mentors-grid"
          className="grid scroll-mt-24 gap-5 md:grid-cols-2 lg:grid-cols-4"
        >
          {mentors.map((mentor) => (
            <article
              key={mentor.name}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-zinc-100 transition hover:-translate-y-1.5 hover:shadow-lg hover:ring-primary/20"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-tertiary opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              <div className="flex items-center gap-3 pb-4">
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-tertiary/20">
                  <div className="absolute inset-1 rounded-xl border border-white/60 bg-gradient-to-br from-white/70 to-primary/5" />
                  <span className="relative flex h-full w-full items-center justify-center text-sm font-semibold text-primary">
                    {mentor.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-zinc-900">{mentor.name}</p>
                  <p className="text-xs font-medium text-primary">{mentor.role}</p>
                  <p className="text-[11px] text-zinc-500">{mentor.specialty}</p>
                </div>
              </div>

              <p className="mb-5 mt-auto text-[11px] leading-relaxed text-zinc-600">
                Weekly live sessions, async feedback on your projects, and real‑world examples from
                active product teams — so you build a portfolio that actually reflects how teams
                ship today.
              </p>

              <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-[11px] text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/5 text-xs font-semibold text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                    +
                  </span>
                  <span className="font-medium">Add to my mentor list</span>
                </div>
                <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-tertiary md:inline">
                  1:1 &amp; group
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

