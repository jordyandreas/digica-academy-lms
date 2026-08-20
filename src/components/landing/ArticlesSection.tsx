"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ARTICLES,
  ARTICLE_CATEGORY_FILTERS,
} from "@/features/articles/data/articles";
import { ArticleCard } from "@/components/articles/ArticleCard";

export default function ArticlesSection() {
  const [activeCategory, setActiveCategory] = useState<
    (typeof ARTICLE_CATEGORY_FILTERS)[number]
  >("All");

  const filteredArticles = useMemo(() => {
    if (activeCategory === "All") return ARTICLES;
    return ARTICLES.filter((article) => article.category === activeCategory);
  }, [activeCategory]);

  return (
    <section
      id="articles"
      className="bg-gradient-to-b from-white to-primary/5 px-6 py-16 md:py-20"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
              Latest from the blog
            </p>
            <h2 className="font-display text-balance text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              Insights, stories, and frameworks
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-zinc-600 md:text-[15px]">
              Explore how practitioners in data, product, and design ship work in the real
              world. Short, practical reads – no fluff.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-full border border-primary/10 bg-white/70 p-1 text-[11px] text-zinc-700 shadow-sm">
            {ARTICLE_CATEGORY_FILTERS.map((category) => (
              <Button
                key={category}
                type="button"
                variant="ghost"
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "h-auto rounded-full px-3 py-1 text-[11px] font-normal transition-all hover:bg-primary/5 hover:text-primary",
                  activeCategory === category &&
                    "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground"
                )}
              >
                {category === "All" ? "All articles" : category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
