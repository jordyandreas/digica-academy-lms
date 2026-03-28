"use client";

import { useMemo } from "react";
import Link from "next/link";
import { BookOpen, PlayCircle } from "lucide-react";
import { CourseCard } from "@/components/course/CourseCard";
import CoursesSection from "@/components/landing/CoursesSection";
import ArticlesSection from "@/components/landing/ArticlesSection";
import ExploreCategoriesSection from "@/components/landing/ExploreCategoriesSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCourseAccess } from "@/features/courses/hooks/useCourseAccess";
import {
  courses,
  getCourseBySlug,
  getFirstIncompleteLesson,
  getLessonLocationByLessonId,
} from "@/features/courses/data/courses";
import { useLessonProgress } from "@/features/progress/hooks/useLessonProgress";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Reveal } from "@/components/motion/Reveal";

type ResumeInfo = {
  href: string;
  lessonTitle: string;
  courseTitle: string;
};

export function AuthenticatedHome() {
  const { email } = useAuth();
  const { purchasedCourseSlugs, visitedLessonIds } = useCourseAccess();
  const { completedLessonIds } = useLessonProgress();

  const resume = useMemo((): ResumeInfo | null => {
    const completed = new Set(completedLessonIds);

    if (visitedLessonIds.length > 0) {
      const lastId = visitedLessonIds[visitedLessonIds.length - 1];
      const loc = getLessonLocationByLessonId(lastId);
      if (loc) {
        return {
          href: `/courses/${loc.courseSlug}/lesson/${loc.lessonSlug}`,
          lessonTitle: loc.lessonTitle,
          courseTitle: loc.courseTitle,
        };
      }
    }

    for (const slug of purchasedCourseSlugs) {
      const next = getFirstIncompleteLesson(slug, completed);
      if (next) {
        const course = getCourseBySlug(slug);
        return {
          href: `/courses/${slug}/lesson/${next.lessonSlug}`,
          lessonTitle: next.lessonTitle,
          courseTitle: course?.title ?? slug,
        };
      }
    }

    for (const slug of purchasedCourseSlugs) {
      const course = getCourseBySlug(slug);
      const first = course?.modules[0]?.lessons[0];
      if (course && first) {
        return {
          href: `/courses/${slug}/lesson/${first.slug}`,
          lessonTitle: first.title,
          courseTitle: course.title,
        };
      }
    }

    return null;
  }, [purchasedCourseSlugs, visitedLessonIds, completedLessonIds]);

  const displayName = email?.split("@")[0]?.trim() || "there";
  const purchasedCourses = courses.filter((c) =>
    purchasedCourseSlugs.includes(c.slug)
  );

  return (
    <>
      <section className="border-b border-primary/10 bg-linear-to-br from-primary/6 via-white to-secondary/6 px-6 py-12 md:py-16">
        <div className="mx-auto max-w-6xl space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary/80">
            Your dashboard
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
            Welcome back, {displayName}
          </h1>
          <p className="max-w-xl text-sm text-zinc-600 md:text-base">
            Pick up where you left off or explore a new course.
          </p>
        </div>
      </section>

      <Reveal>
        <section className="px-6 py-10 md:py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="sr-only">Continue learning</h2>
            {resume ? (
              <Card className="overflow-hidden border border-zinc-200/90 bg-white/95 p-6 shadow-sm md:flex md:items-center md:justify-between md:gap-8 md:p-8">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <PlayCircle className="h-6 w-6" aria-hidden />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                      Continue learning
                    </p>
                    <p className="font-semibold text-zinc-900">{resume.lessonTitle}</p>
                    <p className="text-sm text-zinc-600">{resume.courseTitle}</p>
                  </div>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="mt-6 w-full shrink-0 rounded-full md:mt-0 md:w-auto"
                >
                  <Link href={resume.href}>Resume lesson</Link>
                </Button>
              </Card>
            ) : (
              <Card className="border border-dashed border-zinc-200 bg-zinc-50/80 p-6 text-center md:p-10">
                <BookOpen
                  className="mx-auto h-10 w-10 text-primary/70"
                  aria-hidden
                />
                <p className="mt-4 text-sm font-medium text-zinc-800">
                  No active lesson yet
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  Enroll in a course to start tracking progress and resume from here.
                </p>
                <Button asChild className="mt-6 rounded-full" size="lg">
                  <Link href="/courses">Browse courses</Link>
                </Button>
              </Card>
            )}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="my-courses" className="scroll-mt-24 px-6 py-10 md:py-12">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">
                My courses
              </h2>
              <p className="max-w-xl text-sm text-zinc-600">
                Courses you&apos;ve enrolled in and your progress.
              </p>
            </div>

            {purchasedCourses.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {purchasedCourses.map((course) => (
                  <CourseCard
                    key={course.slug}
                    course={course}
                    variant="enrolled"
                  />
                ))}
              </div>
            ) : (
              <Card className="border border-zinc-200/90 bg-white p-8 text-center shadow-sm">
                <p className="text-sm text-zinc-600">
                  You haven&apos;t enrolled in any courses yet. Explore the catalog and
                  start learning.
                </p>
                <Button asChild variant="outline" className="mt-4 rounded-full">
                  <Link href="/courses">View all courses</Link>
                </Button>
              </Card>
            )}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <CoursesSection
          sectionId="courses"
          heading="Explore more courses"
          description="Discover additional programs to grow your data and analytics skills."
          showTagline={false}
          excludeSlugs={purchasedCourseSlugs}
        />
      </Reveal>

      <Reveal>
        <ArticlesSection />
      </Reveal>

      <Reveal>
        <ExploreCategoriesSection />
      </Reveal>
    </>
  );
}
