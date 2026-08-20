const STEPS = [
  {
    label: "Pick your program",
    description:
      "Choose the upcoming workshop or bootcamp that fits your time and goals.",
  },
  {
    label: "Join the live class",
    description:
      "Learn with instructors and your cohort. Miss a session? Watch the recording.",
  },
  {
    label: "Build as you go",
    description:
      "Practice on real-world cases and get feedback before the next week.",
  },
  {
    label: "Finish with proof",
    description:
      "Leave with projects and skills you can talk about in interviews.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-24 bg-gradient-to-b from-tertiary/5 via-white to-primary/5 px-6 py-16 md:py-20"
    >
      <div className="pointer-events-none absolute inset-x-0 top-10 -z-10 mx-auto h-64 max-w-4xl rounded-full bg-gradient-to-r from-primary/10 via-secondary/10 to-tertiary/10 blur-3xl" />

      <div className="mx-auto max-w-6xl space-y-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-primary shadow-sm shadow-primary/5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Getting started
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">
              How it works
            </h2>
            <p className="max-w-xl text-sm text-zinc-600 md:text-[0.95rem]">
              Four simple steps from picking a class to finishing with work you
              can show.
            </p>
            <p className="max-w-xl text-xs text-zinc-500 md:text-[0.8rem]">
              Live classes, a cohort beside you, and projects you actually build.
            </p>
          </div>
        </div>

        <ol className="relative grid gap-6 md:grid-cols-4 md:gap-5">
          <div className="pointer-events-none absolute top-7 hidden h-px bg-gradient-to-r from-primary/20 via-secondary/30 to-tertiary/20 md:block left-[12.5%] right-[12.5%]" />
          {STEPS.map((step, index) => (
            <li
              key={step.label}
              className="relative flex gap-4 md:flex-col md:items-center md:gap-0 md:text-center"
            >
              <div className="flex shrink-0 flex-col items-center md:mb-4">
                <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-primary/15 bg-white font-display text-lg font-semibold text-primary shadow-sm shadow-primary/10">
                  {index + 1}
                </span>
                {index < STEPS.length - 1 ? (
                  <span
                    className="mt-2 w-px flex-1 bg-gradient-to-b from-primary/25 to-transparent md:hidden"
                    aria-hidden
                  />
                ) : null}
              </div>
              <div className="min-w-0 pb-2 md:pb-0">
                <h3 className="text-sm font-semibold text-zinc-900">
                  {step.label}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-600 md:text-[0.8rem]">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
