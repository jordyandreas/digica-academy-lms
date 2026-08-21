"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  getArticleCover,
  type Article,
} from "@/features/articles/data/articles";

type ArticleCardProps = {
  article: Pick<
    Article,
    "id" | "category" | "title" | "excerpt" | "date" | "readTime"
  >;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const coverSrc = getArticleCover(article.category);

  return (
    <Link
      href={`/articles/${article.id}`}
      className="group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
    >
      <Card className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-primary/5">
          <Image
            src={coverSrc}
            alt=""
            fill
            className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            {article.category}
          </span>

          <h3 className="mt-2 line-clamp-2 min-h-[2.6em] font-display text-[0.95rem] font-semibold leading-snug tracking-tight text-zinc-900 transition-colors group-hover:text-primary">
            {article.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-zinc-600">
            {article.excerpt}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-4 text-[12px] text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0 text-primary/80" aria-hidden />
              <span>{article.readTime}</span>
            </span>
            <span className="text-zinc-300" aria-hidden>
              ·
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays
                className="h-3.5 w-3.5 shrink-0 text-primary/80"
                aria-hidden
              />
              <span>{article.date}</span>
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
