import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import {
  getExperiencePointById,
  getAllExperiencePointIds,
  getExperiencePointIndex,
} from "@/features/experience/data/experiencePoints";
import { ArticleBody } from "@/components/articles/ArticleBody";
import { Button } from "@/components/ui/button";
import { HeaderAuth } from "@/components/auth/HeaderAuth";

interface ExperienceDetailPageProps {
  params: Promise<{ experienceId: string }>;
}

export function generateStaticParams() {
  return getAllExperiencePointIds().map((experienceId) => ({ experienceId }));
}

export async function generateMetadata({
  params,
}: ExperienceDetailPageProps): Promise<Metadata> {
  const { experienceId } = await params;
  const point = getExperiencePointById(experienceId);
  if (!point) {
    return { title: "Learning experience | Digica Academy" };
  }
  return {
    title: `${point.title} | Digica Academy`,
    description: point.description,
  };
}

export default async function ExperienceDetailPage({ params }: ExperienceDetailPageProps) {
  const { experienceId } = await params;
  const point = getExperiencePointById(experienceId);

  if (!point) notFound();

  const index = getExperiencePointIndex(point.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-secondary/5 to-white">
      <header className="glass-panel sticky top-0 z-10 border-b border-zinc-200/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Button asChild variant="ghost" size="sm" className="gap-2 text-primary">
            <Link href="/#experience">
              <ChevronLeft className="h-4 w-4" />
              Experience
            </Link>
          </Button>
          <HeaderAuth variant="compact" />
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Learning experience
        </div>

        <header className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
          <div className="flex items-start justify-between gap-4 border-b border-zinc-100 bg-secondary/5 px-6 py-6 md:px-8 md:py-8">
            <div className="min-w-0 space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
                {point.title}
              </h1>
              <p className="text-sm leading-relaxed text-zinc-600 md:text-[15px]">
                {point.description}
              </p>
            </div>
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
              {index + 1}
            </span>
          </div>
        </header>

        <div className="mt-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">
            How it works
          </p>
          <ArticleBody paragraphs={point.detailParagraphs} />
        </div>

        <footer className="mt-12 flex flex-col gap-4 border-t border-zinc-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-600">
            Part of Digica Academy’s execution-first learning model.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/#experience">All pillars</Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/courses">Browse courses</Link>
            </Button>
          </div>
        </footer>
      </article>
    </div>
  );
}
