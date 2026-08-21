import Link from "next/link";
import { HeaderAuth } from "@/components/auth/HeaderAuth";
import { ArticlesIndexClient } from "@/components/articles/ArticlesIndexClient";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academy Journal",
  description:
    "Practical articles for data learners from Digica Academy — SQL, analytics, data science, and career frameworks.",
};

export default function ArticlesIndexPage() {
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
        <div className="mb-10 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
            Academy Journal
          </p>
          <h1 className="font-display text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Insights for data learners
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-zinc-600 md:text-[15px]">
            Short, practical reads from Digica mentors and cohorts — built around the
            skills you practice in our live programs.
          </p>
        </div>

        <ArticlesIndexClient />
      </main>
    </>
  );
}
