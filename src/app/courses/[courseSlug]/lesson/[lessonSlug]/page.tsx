"use client";

import { HeaderAuth } from "@/components/auth/HeaderAuth";
import { LessonCurriculum } from "@/components/lesson/LessonCurriculum";
import { LessonTabbedPanel } from "@/components/lesson/LessonTabbedPanel";
import { LessonVideo } from "@/components/lesson/LessonVideo";
import { Button } from "@/components/ui/button";
import { getCourseBySlug, getLessonBySlug } from "@/features/courses/data/courses";
import { useCourseAccess } from "@/features/courses/hooks/useCourseAccess";
import { useLessonProgress } from "@/features/progress/hooks/useLessonProgress";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ListCollapse } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

function CourseLessonHeader({
  showLessonExpand,
  onLessonExpand,
}: {
  showLessonExpand?: boolean;
  onLessonExpand?: () => void;
}) {
  return (
    <header className="glass-panel shrink-0 border-b border-zinc-200/80 px-6 py-4">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          {showLessonExpand && onLessonExpand ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 text-zinc-600"
              onClick={onLessonExpand}
              aria-label="Expand lesson list"
            >
              <ListCollapse className="h-5 w-5" />
            </Button>
          ) : null}
        </div>
        <HeaderAuth variant="compact" />
      </div>
    </header>
  );
}

const MD_QUERY = "(min-width: 768px)";

function subscribeMd(callback: () => void) {
  const mq = window.matchMedia(MD_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getMdSnapshot() {
  return window.matchMedia(MD_QUERY).matches;
}

function getServerMdSnapshot() {
  return false;
}

function useMediaMd() {
  return useSyncExternalStore(subscribeMd, getMdSnapshot, getServerMdSnapshot);
}

export default function LessonPage() {
  const reduceMotion = useReducedMotion();
  const isMd = useMediaMd();

  const params = useParams();
  const courseSlug = params.courseSlug as string;
  const lessonSlug = params.lessonSlug as string;

  const resolved = useMemo(() => {
    const course = getCourseBySlug(courseSlug);
    if (!course) return null;
    const result = getLessonBySlug(course, lessonSlug);
    if (!result) return null;
    return { course, ...result };
  }, [courseSlug, lessonSlug]);

  const { markLessonCompleted, isLessonCompleted } = useLessonProgress();
  const { markLessonVisited } = useCourseAccess();

  useEffect(() => {
    if (resolved?.lesson) markLessonVisited(resolved.lesson.id);
  }, [resolved?.lesson, markLessonVisited]);

  const handleMarkCompleted = () => {
    if (resolved?.lesson) markLessonCompleted(resolved.lesson.id);
  };

  if (!resolved) notFound();

  const { course, lesson, module } = resolved;
  const completed = isLessonCompleted(lesson.id);

  const [lessonPanelOpen, setLessonPanelOpen] = useState(false);
  const [sidebarAnimated, setSidebarAnimated] = useState(false);

  useEffect(() => {
    setLessonPanelOpen(isMd);
  }, [isMd]);

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: "easeOut" as const };

  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden">
      <div className="shrink-0 md:hidden">
        <CourseLessonHeader
          showLessonExpand
          onLessonExpand={() => {
            setSidebarAnimated(true);
            setLessonPanelOpen((s) => !s);
          }}
        />
      </div>
      <div className="flex min-h-0 flex-1 flex-col md:flex-row md:overflow-hidden">
        <LessonCurriculum
          course={course}
          currentLesson={lesson}
          panelOpen={lessonPanelOpen}
          onPanelOpenChange={(open) => {
            setSidebarAnimated(true);
            setLessonPanelOpen(open);
          }}
          desktopAnimate={sidebarAnimated}
        />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="hidden md:block">
            <CourseLessonHeader
              showLessonExpand={!lessonPanelOpen}
              onLessonExpand={() => {
                setSidebarAnimated(true);
                setLessonPanelOpen(true);
              }}
            />
          </div>
          <main className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto max-w-4xl px-6 pb-8 pt-10">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={lesson.id}
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
                  transition={transition}
                >
                  <div className="mb-8 flex items-center gap-4 sm:gap-5">
                    <Button
                      asChild
                      variant="outline"
                      size="icon"
                      className="h-11 w-11 shrink-0 rounded-full border-zinc-200/90 bg-white shadow-sm hover:bg-zinc-50"
                    >
                      <Link
                        href={`/courses/${course.slug}`}
                        aria-label="Back to course"
                      >
                        <ChevronLeft className="h-5 w-5 text-zinc-700" />
                      </Link>
                    </Button>
                    <div className="min-w-0 flex-1">
                      <h1 className="text-2xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-[1.75rem]">
                        {lesson.title}
                      </h1>
                      <p className="mt-1.5 text-sm font-medium text-zinc-500">
                        {module.title}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <LessonVideo videoUrl={lesson.videoUrl} title={lesson.title} />
                    <LessonTabbedPanel
                      course={course}
                      lesson={lesson}
                      currentModule={module}
                      onMarkCompleted={handleMarkCompleted}
                      isCompleted={completed}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
