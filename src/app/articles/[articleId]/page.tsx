import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays, ChevronLeft, Clock } from "lucide-react";
import { getArticleById, getAllArticleIds } from "@/features/articles/data/articles";
import { ArticleBody } from "@/components/articles/ArticleBody";
import { Button } from "@/components/ui/button";
import { HeaderAuth } from "@/components/auth/HeaderAuth";

interface ArticlePageProps {
  params: Promise<{ articleId: string }>;
}

export function generateStaticParams() {
  return getAllArticleIds().map((articleId) => ({ articleId }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { articleId } = await params;
  const article = getArticleById(articleId);
  if (!article) {
    return { title: "Article | Digica Academy" };
  }
  return {
    title: `${article.title} | Digica Academy`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { articleId } = await params;
  const article = getArticleById(articleId);

  if (!article) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary/5 to-white">
      <header className="glass-panel sticky top-0 z-10 border-b border-zinc-200/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Button asChild variant="ghost" size="sm" className="gap-2 text-primary">
            <Link href="/articles">
              <ChevronLeft className="h-4 w-4" />
              All articles
            </Link>
          </Button>
          <HeaderAuth variant="compact" />
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <header className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-primary/80 via-secondary to-tertiary/80 px-6 py-8 md:px-8 md:py-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-primary shadow-sm backdrop-blur">
                  {article.category}
                </span>
                <div className="flex items-center gap-2 text-[11px] text-primary-foreground/90">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/20 text-[10px] font-semibold text-primary-foreground">
                    DA
                  </span>
                  <span>Digica Academy Journal</span>
                </div>
              </div>
              <div className="flex -space-x-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 bg-white/90 text-[11px] font-semibold text-primary shadow-sm">
                  JP
                </span>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 bg-primary/90 text-[11px] font-semibold text-primary-foreground shadow-sm">
                  TK
                </span>
              </div>
            </div>

            <h1 className="mt-6 text-balance text-2xl font-semibold tracking-tight text-primary-foreground md:text-3xl">
              {article.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-primary-foreground/85">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                {article.date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {article.readTime}
              </span>
            </div>
          </div>

          <div className="border-t border-zinc-100 bg-zinc-50/80 px-6 py-4 md:px-8">
            <p className="text-sm leading-relaxed text-zinc-600">{article.excerpt}</p>
          </div>
        </header>

        <div className="mt-10">
          <ArticleBody paragraphs={article.bodyParagraphs} />
        </div>

        <footer className="mt-12 flex flex-col gap-4 border-t border-zinc-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-600">
            Curated from real student and mentor sessions inside Digica Academy.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/articles">Back to articles</Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/courses">Explore courses</Link>
            </Button>
          </div>
        </footer>
      </article>
    </div>
  );
}
