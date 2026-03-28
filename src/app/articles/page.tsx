import Link from "next/link";
import { ARTICLES } from "@/features/articles/data/articles";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Button } from "@/components/ui/button";
import { HeaderAuth } from "@/components/auth/HeaderAuth";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles | Digica Academy",
  description:
    "Insights, stories, and frameworks from Digica Academy—data, product, and design in practice.",
};

export default function ArticlesIndexPage() {
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
        <div className="mb-10 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
            Latest from the blog
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Insights, stories, and frameworks
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-zinc-600 md:text-[15px]">
            Explore how practitioners in data, product, and design ship work in the real world.
            Short, practical reads – no fluff.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </main>
    </div>
  );
}
