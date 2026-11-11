import Link from "next/link";
import { TESTIMONIALS } from "@/features/testimonials/data/testimonials";
import { TestimonialCardGrid } from "@/components/testimonials/TestimonialCard";
import { Button } from "@/components/ui/button";
import { HeaderAuth } from "@/components/auth/HeaderAuth";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Alumni stories from Digica Academy — roles at Jago, DANA, and Traveloka.",
};

export default function TestimonialsIndexPage() {
  return (
    <>
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

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 md:py-14">
        <div className="mb-10 space-y-3 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
            Alumni stories
          </p>
          <h1 className="font-display text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            From bootcamp to data careers
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-zinc-600 md:mx-0 md:text-[15px]">
            Digica Academy alumni who landed data roles at Jago, DANA, and Traveloka.
          </p>
        </div>

        <TestimonialCardGrid testimonials={TESTIMONIALS} />
      </main>
    </>
  );
}
