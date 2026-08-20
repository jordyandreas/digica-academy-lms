import { notFound } from "next/navigation";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";
import { getCourseBySlug } from "@/features/courses/getPublishedCourses";
import {
  getLessonPlayback,
  userHasCourseAccess,
} from "@/features/courses/getLessonPlayback";
import { getLessonBySlug } from "@/features/courses/mapCourse";

interface LessonPageProps {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseSlug, lessonSlug } = await params;
  const course = await getCourseBySlug(courseSlug);
  if (!course) notFound();

  const resolved = getLessonBySlug(course, lessonSlug);
  if (!resolved) notFound();

  const canPlay = await userHasCourseAccess(course.id);
  const playback = canPlay ? await getLessonPlayback(resolved.lesson.id) : null;

  const lesson = {
    ...resolved.lesson,
    videoUrl: playback?.videoUrl ?? "",
    content: playback?.content || resolved.lesson.content,
  };

  return (
    <LessonPlayer
      course={course}
      lesson={lesson}
      module={resolved.module}
      canPlay={Boolean(canPlay && playback?.videoUrl)}
    />
  );
}
