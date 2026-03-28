"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { courses } from "@/features/courses/data/courses";
import { useCourseAccess } from "@/features/courses/hooks/useCourseAccess";
import { CourseCard } from "@/components/course/CourseCard";
import { getExploreCategoryLabel } from "@/lib/exploreCategories";
import { X } from "lucide-react";

export function CoursesCatalogGrid() {
  const { isPurchased } = useCourseAccess();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");
  const categoryLabel = getExploreCategoryLabel(categoryId);

  return (
    <div className="space-y-6">
      {categoryLabel ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-zinc-800">
          <p>
            <span className="font-medium text-primary">Topic:</span>{" "}
            <span>{categoryLabel}</span>
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-primary/30 hover:text-primary"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            Clear
          </Link>
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            variant={isPurchased(course.slug) ? "enrolled" : "default"}
          />
        ))}
      </div>
    </div>
  );
}
