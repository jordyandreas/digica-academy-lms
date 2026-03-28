import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import {
  getTestimonialById,
  getAllTestimonialIds,
} from "@/features/testimonials/data/testimonials";
import { ArticleBody } from "@/components/articles/ArticleBody";
import { Button } from "@/components/ui/button";
import { HeaderAuth } from "@/components/auth/HeaderAuth";

interface TestimonialPageProps {
  params: Promise<{ testimonialId: string }>;
}

export function generateStaticParams() {
  return getAllTestimonialIds().map((testimonialId) => ({ testimonialId }));
}

export async function generateMetadata({
  params,
}: TestimonialPageProps): Promise<Metadata> {
  const { testimonialId } = await params;
  const t = getTestimonialById(testimonialId);
  if (!t) {
    return { title: "Story | Digica Academy" };
  }
  return {
    title: `${t.name} — ${t.company} | Digica Academy`,
    description: t.quote,
  };
}

export default async function TestimonialDetailPage({ params }: TestimonialPageProps) {
  const { testimonialId } = await params;
  const t = getTestimonialById(testimonialId);

  if (!t) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary/5 to-white">
      <header className="glass-panel sticky top-0 z-10 border-b border-zinc-200/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Button asChild variant="ghost" size="sm" className="gap-2 text-primary">
            <Link href="/testimonials">
              <ChevronLeft className="h-4 w-4" />
              All stories
            </Link>
          </Button>
          <HeaderAuth variant="compact" />
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <header className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-primary/15 via-secondary/10 to-tertiary/15 px-6 py-8 md:px-8 md:py-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  {t.company}
                </p>
                <p className="mt-2 text-sm font-medium text-primary">{t.highlight}</p>
              </div>
              <div className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground shadow-sm">
                <span>★ 4.9</span>
                <span className="text-primary-foreground/70">/5.0</span>
              </div>
            </div>

            <h1 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
              {t.name}
            </h1>
            <p className="mt-1 text-sm text-zinc-600">{t.role}</p>
          </div>

          <div className="border-t border-zinc-100 bg-zinc-50/80 px-6 py-6 md:px-8">
            <blockquote className="text-[15px] leading-relaxed text-zinc-800 md:text-base">
              “{t.quote}”
            </blockquote>
          </div>
        </header>

        <div className="mt-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">
            Full story
          </p>
          <ArticleBody paragraphs={t.storyParagraphs} />
        </div>

        <footer className="mt-12 flex flex-col gap-4 border-t border-zinc-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-600">
            Digica Academy learner — story shared with permission.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/testimonials">More stories</Link>
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
