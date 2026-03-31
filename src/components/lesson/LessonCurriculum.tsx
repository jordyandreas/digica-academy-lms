"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Circle,
  ListCollapse,
  Minus,
  Plus,
  X,
} from "lucide-react";
import type { Course, Lesson, Module } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useLessonProgress } from "@/features/progress/hooks/useLessonProgress";
import { Button } from "@/components/ui/button";

interface LessonCurriculumProps {
  course: Course;
  currentLesson: Lesson;
  panelOpen: boolean;
  onPanelOpenChange: (open: boolean) => void;
  /** Whether desktop width changes should animate (user-initiated toggles only). */
  desktopAnimate?: boolean;
}

function moduleCompletionState(
  module: Module,
  isLessonCompleted: (id: string) => boolean
): "done" | "none" {
  if (module.lessons.length === 0) return "none";
  const allDone = module.lessons.every((l) => isLessonCompleted(l.id));
  return allDone ? "done" : "none";
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

const SIDEBAR_W = 320;

export function LessonCurriculum({
  course,
  currentLesson,
  panelOpen,
  onPanelOpenChange,
  desktopAnimate = false,
}: LessonCurriculumProps) {
  const { isLessonCompleted } = useLessonProgress();
  const isMd = useMediaMd();
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});

  const toggleModule = (moduleId: string) => {
    setOpenModules((s) => ({ ...s, [moduleId]: !s[moduleId] }));
  };

  const isModuleOpen = (m: Module) =>
    openModules[m.id] ?? m.lessons.some((l) => l.id === currentLesson.id);

  const mobileDrawerTransition = { duration: 0.26, ease: [0.32, 0.72, 0, 1] as const };

  const sidebarInner = (
    <aside
      className={cn(
        "flex h-full min-h-0 w-full flex-col overflow-hidden border-b border-zinc-200/80 bg-white",
        "md:border-b-0 md:border-r"
      )}
    >
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-zinc-200/80 px-6 py-4">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <h2 className="text-base font-bold leading-none tracking-tight text-zinc-900">
            Lesson
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-zinc-600"
            onClick={() => onPanelOpenChange(false)}
            aria-expanded={panelOpen}
            aria-label="Collapse lesson list"
          >
            {panelOpen ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <ListCollapse
                className={cn("h-5 w-5", isMd && "-scale-x-100")}
                aria-hidden
              />
            )}
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2 sm:px-3 sm:py-3">
          {course.modules.map((module) => (
            <ModuleBlock
              key={module.id}
              courseSlug={course.slug}
              module={module}
              currentLessonId={currentLesson.id}
              isOpen={isModuleOpen(module)}
              onToggle={() => toggleModule(module.id)}
              isLessonCompleted={isLessonCompleted}
              moduleCompletion={moduleCompletionState(module, isLessonCompleted)}
              reduceMotion={false}
            />
          ))}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {!isMd ? (
        <AnimatePresence>
          {panelOpen ? (
            <motion.div
              key="lesson-curriculum-mobile"
              className="fixed inset-0 z-50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={mobileDrawerTransition}
            >
              <button
                type="button"
                className="absolute inset-0 bg-black/40"
                aria-label="Close lesson list"
                onClick={() => onPanelOpenChange(false)}
              />
              <motion.div
                className="absolute inset-y-0 left-0 w-[min(86vw,18rem)]"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={mobileDrawerTransition}
              >
                <div className="h-full min-h-0 shadow-xl">{sidebarInner}</div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      ) : (
        <div className="relative flex h-full min-h-0 shrink-0 flex-col md:h-full md:flex-row">
          {desktopAnimate ? (
            <motion.div
              className="h-full min-h-0 overflow-hidden will-change-[width]"
              initial={false}
              animate={{ width: panelOpen ? SIDEBAR_W : 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 32,
                mass: 0.85,
              }}
            >
              {sidebarInner}
            </motion.div>
          ) : (
            <div
              className="h-full min-h-0 overflow-hidden"
              style={{ width: panelOpen ? SIDEBAR_W : 0 }}
            >
              {sidebarInner}
            </div>
          )}
        </div>
      )}
    </>
  );
}

interface ModuleBlockProps {
  courseSlug: string;
  module: Module;
  currentLessonId: string;
  isOpen: boolean;
  onToggle: () => void;
  isLessonCompleted: (id: string) => boolean;
  moduleCompletion: "done" | "none";
  reduceMotion: boolean;
}

function ModuleBlock({
  courseSlug,
  module,
  currentLessonId,
  isOpen,
  onToggle,
  isLessonCompleted,
  moduleCompletion,
}: ModuleBlockProps) {
  return (
    <div className="border-b border-zinc-100 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full items-center gap-3 px-3 py-3 text-left transition-colors",
          "bg-zinc-50/80 hover:bg-zinc-100/70",
          "sm:px-4"
        )}
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center">
          {moduleCompletion === "done" ? (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
          ) : (
            <Circle className="h-5 w-5 text-zinc-300" strokeWidth={1.5} />
          )}
        </span>
        <span className="min-w-0 flex-1 text-[13px] font-extrabold uppercase tracking-wide text-zinc-900">
          {module.title}
        </span>
        <span className="shrink-0 text-zinc-400" aria-hidden>
          {isOpen ? (
            <Minus className="h-4 w-4" strokeWidth={2} />
          ) : (
            <Plus className="h-4 w-4" strokeWidth={2} />
          )}
        </span>
      </button>

      {isOpen && (
        <div className="overflow-hidden">
          <ul className="bg-white pb-1">
            {module.lessons.map((lesson) => {
              const href = `/courses/${courseSlug}/lesson/${lesson.slug}`;
              const completed = isLessonCompleted(lesson.id);
              const active = lesson.id === currentLessonId;

              return (
                <li key={lesson.id}>
                  <Link
                    href={href}
                    className={cn(
                      "relative flex items-center gap-3 border-t border-zinc-100 py-3 pl-10 pr-3 transition-colors sm:pl-12 sm:pr-4",
                      active ? "bg-primary/7" : "hover:bg-zinc-50"
                    )}
                  >
                    <span className="flex w-5 shrink-0 justify-center">
                      {completed ? (
                        <Check
                          className="h-4 w-4 text-primary"
                          strokeWidth={2.5}
                        />
                      ) : active ? (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary" />
                      ) : (
                        <Circle
                          className="h-4 w-4 text-zinc-300"
                          strokeWidth={1.5}
                        />
                      )}
                    </span>
                    <span
                      className={cn(
                        "min-w-0 flex-1 text-[13px] leading-snug",
                        active
                          ? "font-semibold text-zinc-900"
                          : "text-zinc-600"
                      )}
                    >
                      {lesson.title}
                    </span>
                    <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
                      {lesson.duration} min
                    </span>
                    {active && (
                      <span
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        aria-hidden
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
