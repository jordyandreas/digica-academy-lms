"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ARTICLE_CATEGORY_FILTERS,
  type ArticleCardModel,
} from "@/features/articles/data/articles";
import { ArticleCard } from "@/components/articles/ArticleCard";

type ArticlesIndexClientProps = {
  articles: ArticleCardModel[];
};

export function ArticlesIndexClient({ articles }: ArticlesIndexClientProps) {
  const [activeCategory, setActiveCategory] = useState<
    (typeof ARTICLE_CATEGORY_FILTERS)[number]
  >("All");

  const filteredArticles = useMemo(() => {
    if (activeCategory === "All") return articles;
    return articles.filter((article) => article.category === activeCategory);
  }, [activeCategory, articles]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2 rounded-full border border-primary/10 bg-white/70 p-1 text-[11px] text-zinc-700 shadow-sm w-fit max-w-full">
        {ARTICLE_CATEGORY_FILTERS.map((category) => (
          <Button
            key={category}
            type="button"
            variant="ghost"
            onClick={() => setActiveCategory(category)}
            className={cn(
              "h-auto rounded-full px-3 py-1.5 text-[11px] font-normal transition-all hover:bg-primary/5 hover:text-primary",
              activeCategory === category &&
                "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground"
            )}
          >
            {category === "All" ? "All articles" : category}
          </Button>
        ))}
      </div>

      {filteredArticles.length === 0 ? (
        <p className="text-sm text-zinc-600">No articles in this category yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
