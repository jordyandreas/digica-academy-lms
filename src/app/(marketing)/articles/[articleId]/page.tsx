import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays, ChevronLeft, Clock } from "lucide-react";
import {
  getArticleCover,
  getProgramHintForCategory,
} from "@/features/articles/data/articles";
import { getPublishedArticleBySlug } from "@/features/articles/getPublishedArticles";
import { ArticleBodyHtml } from "@/components/articles/ArticleBodyHtml";
import { Button } from "@/components/ui/button";
import { HeaderAuth } from "@/components/auth/HeaderAuth";

export const revalidate = 60;

const DIGICA_INITIAL_ICON = "/logo/logo-digica-initial.webp";

interface ArticlePageProps {
  params: Promise<{ articleId: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { articleId } = await params;
  const article = await getPublishedArticleBySlug(articleId);
  if (!article) {
    return { title: "Article" };
  }
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { articleId } = await params;
  const article = await getPublishedArticleBySlug(articleId);

  if (!article) notFound();

  const coverSrc = getArticleCover(article.category);

  return (
    <>
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

      <article className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 md:py-14">
        <header className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
          <div className="relative aspect-[2/1] w-full overflow-hidden bg-primary/5 sm:aspect-[21/9]">
            <Image
              src={coverSrc}
              alt=""
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 768px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 space-y-3 px-6 pb-6 pt-16 md:px-8 md:pb-8">
              <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-primary shadow-sm backdrop-blur">
                {article.category}
              </span>
              <div className="flex items-center gap-2 text-[11px] text-white/95">
                <span className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/95 shadow-sm">
                  <Image
                    src={DIGICA_INITIAL_ICON}
                    alt=""
                    width={16}
                    height={16}
                    className="h-3.5 w-3.5 object-contain"
                  />
                </span>
                <span>Digica Academy Journal</span>
              </div>
              <h1 className="font-display text-balance text-2xl font-semibold tracking-tight text-white md:text-3xl">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-white/85">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {article.readTimeLabel}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                  {article.displayDate}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-100 bg-zinc-50/80 px-6 py-4 md:px-8">
            <p className="text-sm leading-relaxed text-zinc-600">{article.excerpt}</p>
          </div>
        </header>

        <div className="mt-10">
          <ArticleBodyHtml html={article.bodyHtml} />
        </div>

        <footer className="mt-12 space-y-6 border-t border-zinc-200 pt-8">
          <p className="text-sm leading-relaxed text-zinc-600">
            Curated from real student and mentor sessions inside Digica Academy.
          </p>
          <p className="text-sm leading-relaxed text-zinc-600">
            {getProgramHintForCategory(article.category)}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/articles">Back to articles</Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/programs">Explore programs</Link>
            </Button>
          </div>
        </footer>
      </article>
    </>
  );
}
