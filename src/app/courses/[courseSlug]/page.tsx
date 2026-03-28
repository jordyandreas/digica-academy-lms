import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/features/courses/data/courses";
import { CourseOverviewBanner } from "@/components/course/CourseOverviewBanner";
import { CourseLessonCards } from "@/components/course/CourseLessonCards";
import { Button } from "@/components/ui/button";
import { HeaderAuth } from "@/components/auth/HeaderAuth";
import { ChevronLeft } from "lucide-react";

interface CoursePageProps {
  params: Promise<{ courseSlug: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);

  if (!course) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary/5 to-white">
      <header className="glass-panel sticky top-0 z-10 border-b border-zinc-200/80 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/courses">
              <ChevronLeft className="h-4 w-4" />
              Courses
            </Link>
          </Button>
          <HeaderAuth variant="compact" />
        </div>
      </header>
      <CourseOverviewBanner course={course} />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <CourseLessonCards course={course} />
      </div>
    </div>
  );
}
