import Link from "next/link";
import { TESTIMONIALS } from "@/features/testimonials/data/testimonials";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { Button } from "@/components/ui/button";
import { HeaderAuth } from "@/components/auth/HeaderAuth";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonials | Digica Academy",
  description:
    "Stories from learners who use Digica Academy to grow in data, analytics, and product.",
};

export default function TestimonialsIndexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary/5 to-white">
      <header className="glass-panel sticky top-0 z-10 border-b border-zinc-200/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Button asChild variant="ghost" size="sm" className="gap-2 text-primary">
            <Link href="/">
              <ChevronLeft className="h-4 w-4" />
              Home
            </Link>
          </Button>
          <HeaderAuth variant="compact" />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="mb-10 space-y-3 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
            Testimonials
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Learner stories
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-zinc-600 md:mx-0 md:text-[15px]">
            Real outcomes from people who applied what they learned on the job.
          </p>
        </div>

        <ul className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <li key={t.id} className="h-full">
              <TestimonialCard testimonial={t} index={i} className="h-full" />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
