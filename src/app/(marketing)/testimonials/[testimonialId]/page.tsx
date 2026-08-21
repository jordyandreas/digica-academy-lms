import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import {
  getTestimonialById,
  getAllTestimonialIds,
} from "@/features/testimonials/data/testimonials";
import { TestimonialStory } from "@/components/testimonials/TestimonialStory";
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
    return { title: "Story" };
  }
  return {
    title: `${t.name} — ${t.company}`,
    description: t.quote,
  };
}

export default async function TestimonialDetailPage({
  params,
}: TestimonialPageProps) {
  const { testimonialId } = await params;
  const t = getTestimonialById(testimonialId);

  if (!t) notFound();

  return (
    <>
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

      <div className="flex-1">
        <TestimonialStory testimonial={t} />
      </div>
    </>
  );
}
