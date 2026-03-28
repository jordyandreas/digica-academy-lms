const STEPS = [
  {
    label: "Register",
    description: "Pick your bootcamp and secure your spot in the next cohort.",
  },
  {
    label: "Join Bootcamp",
    description: "Attend live sessions and follow the structured weekly schedule.",
  },
  {
    label: "Build Projects",
    description: "Complete hands-on projects that mirror real work scenarios.",
  },
  {
    label: "Graduate",
    description: "Leave with a portfolio and skills you can use on day one.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative bg-gradient-to-b from-tertiary/5 via-white to-primary/5 px-6 py-16 md:py-20"
    >
      {/* soft background glow */}
      <div className="pointer-events-none absolute inset-x-0 top-10 -z-10 mx-auto h-64 max-w-4xl rounded-full bg-gradient-to-r from-primary/10 via-secondary/10 to-tertiary/10 blur-3xl" />

      <div className="mx-auto max-w-6xl space-y-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-primary shadow-sm shadow-primary/5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              4 Simple Steps
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">
                How it works
              </h2>
              <p className="max-w-xl text-sm text-zinc-600 md:text-[0.95rem]">
                No fluff, no endless playlists. Follow a guided path from sign-up to shipping your
                first real data projects with confidence.
              </p>
            </div>
          </div>

          <div className="hidden text-xs text-zinc-500 md:flex md:flex-col md:items-end md:gap-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-100">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live & project-based
            </span>
            <span className="text-[11px]">
              Each step unlocks new materials, feedback and milestones.
            </span>
          </div>
        </div>

        <ol className="relative grid gap-5 md:grid-cols-4">
          {/* connecting line for desktop */}
          <div className="pointer-events-none absolute inset-x-6 top-8 hidden h-px bg-gradient-to-r from-primary/20 via-secondary/30 to-tertiary/20 md:block" />
          {STEPS.map((step, index) => (
            <li
              key={step.label}
              className="group glass-panel relative flex h-full flex-col rounded-2xl border border-zinc-200/80 bg-white/80 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 md:p-5"
            >
              <div className="mb-3 flex items-center justify-between text-xs text-zinc-500">
                <div className="relative flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/5 text-[11px] font-semibold text-primary shadow-sm shadow-primary/20">
                    {index + 1}
                  </span>
                  <span className="hidden text-[10px] uppercase tracking-[0.18em] text-primary/70 md:inline">
                    Step {index + 1}
                  </span>
                  <span className="absolute -bottom-1 left-1/2 hidden h-1 w-1 -translate-x-1/2 rounded-full bg-primary/40 group-hover:bg-primary md:block" />
                </div>
                <span className="rounded-full bg-zinc-50 px-2 py-0.5 text-[10px] font-medium text-zinc-500 group-hover:bg-primary/5 group-hover:text-primary">
                  {index === 0
                    ? "Start here"
                    : index === STEPS.length - 1
                    ? "You made it"
                    : "Keep going"}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-primary">
                {step.label}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-600">
                {step.description}
              </p>

              <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-primary/80 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span>See what you unlock</span>
                <span aria-hidden="true">↗</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

