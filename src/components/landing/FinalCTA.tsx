import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FinalCTA() {
  return (
    <section className="border-y border-primary/10 bg-primary/5 px-6 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="glass-panel flex flex-col items-start gap-6 rounded-2xl border border-zinc-200/80 bg-white/85 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8 md:py-9">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              Final call
            </p>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">
              Start your data career today
            </h2>
            <p className="max-w-xl text-sm text-zinc-600 md:text-[0.95rem]">
              Join a practical bootcamp, work on real projects, and build a portfolio that shows
              hiring managers you can deliver.
            </p>
          </div>

          <Button asChild size="lg" className="w-full px-7 md:w-auto">
            <Link href="#courses">Explore Courses</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

