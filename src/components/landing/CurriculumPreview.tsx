const MODULES = [
  { title: "Module 1 – SQL Basics", description: "SELECT, WHERE, ORDER BY, and filtering data." },
  { title: "Module 2 – Aggregation", description: "GROUP BY, HAVING, and working with metrics." },
  { title: "Module 3 – Data Cleaning", description: "Handling missing values, outliers, and joins." },
  {
    title: "Module 4 – Business Case Study",
    description: "End-to-end project using a realistic business dataset.",
  },
];

export default function CurriculumPreview() {
  return (
    <section className="border-y border-zinc-200/80 bg-white/70 px-6 py-16 md:py-20">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">
            Curriculum preview · SQL Bootcamp
          </h2>
          <p className="max-w-xl text-sm text-zinc-600 md:text-[0.95rem]">
            A focused path from zero to confidently writing SQL queries against production-like
            datasets.
          </p>
        </div>

        <div className="space-y-3 rounded-2xl border border-zinc-200/80 bg-white/80 p-4 md:p-5">
          {MODULES.map((module) => (
            <div
              key={module.title}
              className="flex flex-col gap-1 rounded-xl px-2 py-2 hover:bg-zinc-50/80 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-zinc-900">{module.title}</p>
                <p className="text-xs text-zinc-600">{module.description}</p>
              </div>
              <span className="mt-1 text-[11px] text-zinc-400 md:mt-0">
                ~2–3 hours / module
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

