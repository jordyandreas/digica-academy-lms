import { Suspense } from "react";
import Link from "next/link";
import { CoursesCatalogGrid } from "@/components/course/CoursesCatalogGrid";
import { Button } from "@/components/ui/button";
import { HeaderAuth } from "@/components/auth/HeaderAuth";
import { ChevronLeft } from "lucide-react";

function CatalogFallback() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-64 animate-pulse rounded-xl border border-zinc-100 bg-zinc-100/80"
        />
      ))}
    </div>
  );
}

export default function CoursesPage() {
  return (
    <div className="min-h-screen">
      <header className="glass-panel border-b border-zinc-200/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Button asChild variant="ghost" size="sm" className="gap-2 text-primary">
            <Link href="/">
              <ChevronLeft className="h-4 w-4" />
              Home
            </Link>
          </Button>
          <HeaderAuth variant="compact" />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Courses
          </h1>
          <p className="mt-1 text-zinc-600">
            Choose a course and start learning.
          </p>
        </div>
        <Suspense fallback={<CatalogFallback />}>
          <CoursesCatalogGrid />
        </Suspense>
      </main>
    </div>
  );
}
