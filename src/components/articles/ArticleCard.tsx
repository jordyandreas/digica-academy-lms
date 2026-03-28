"use client";

import Link from "next/link";
import { ChevronRight, CalendarDays, Clock } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Article } from "@/features/articles/data/articles";

type ArticleCardProps = {
  article: Pick<
    Article,
    | "id"
    | "category"
    | "title"
    | "excerpt"
    | "date"
    | "readTime"
  >;
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="group flex flex-col overflow-hidden border-zinc-200/90 bg-white/80 transition-all hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_18px_60px_rgba(22,24,29,0.16)]">
      <div className="relative overflow-hidden">
        <div className="h-40 bg-gradient-to-br from-primary/80 via-secondary to-tertiary/80">
          <div className="flex h-full items-end justify-between px-5 pb-4">
            <div className="space-y-1">
              <span className="inline-flex items-center rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-semibold text-primary shadow-sm backdrop-blur">
                {article.category}
              </span>
              <div className="flex items-center gap-1.5 text-[10px] text-primary-foreground/80">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary-foreground/20 text-[9px] font-semibold text-primary-foreground">
                  DA
                </span>
                <span>Digica Academy Journal</span>
              </div>
            </div>
            <div className="relative flex -space-x-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/20 bg-white/90 text-[10px] font-semibold text-primary shadow-sm">
                JP
              </span>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/20 bg-primary/90 text-[10px] font-semibold text-primary-foreground shadow-sm">
                TK
              </span>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="h-full w-full bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      </div>

      <CardHeader className="space-y-3 pb-4">
        <CardTitle className="text-[15px] leading-snug text-zinc-900 group-hover:text-primary">
          {article.title}
        </CardTitle>
        <CardDescription className="text-[13px] leading-relaxed text-zinc-600">
          {article.excerpt}
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-auto space-y-3 pt-0 text-[11px] text-zinc-500">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-primary/80" />
            <span>{article.date}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-emerald-600/80" />
            <span>{article.readTime}</span>
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <p className="text-zinc-600">
            Curated from real student and mentor sessions inside Digica Academy.
          </p>
        </div>
      </CardContent>

      <CardFooter className="mt-2 flex items-center justify-between border-t border-zinc-100 bg-zinc-50/80 text-[11px] text-zinc-600">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
            ↻
          </span>
          <span className="text-xs text-zinc-700">
            Recommended reading before starting the{" "}
            <span className="font-medium text-primary">Data Foundations</span> track.
          </span>
        </div>
        <Button
          asChild
          size="sm"
          variant="ghost"
          className="ml-3 h-7 px-2 text-[11px] text-primary hover:bg-primary/10"
        >
          <Link href={`/articles/${article.id}`}>
            Read article
            <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
