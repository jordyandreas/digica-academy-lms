import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ArticleCardModel } from "@/features/articles/data/articles";
import { ArticleCard } from "@/components/articles/ArticleCard";

type ArticlesSectionProps = {
  articles: ArticleCardModel[];
};

export default function ArticlesSection({ articles }: ArticlesSectionProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section
      id="articles"
      className="bg-gradient-to-b from-white to-primary/5 px-6 py-16 md:py-20"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
            Academy Journal
          </p>
          <h2 className="font-display text-balance text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Insights for data learners
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-zinc-600 md:text-[15px]">
            Practical frameworks from live Digica sessions — SQL, analytics, data
            science, and career moves. Short reads, no fluff.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>

        <div className="flex justify-center pt-2">
          <Button asChild size="lg" variant="outline" className="rounded-full px-8">
            <Link href="/articles">View all articles</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
