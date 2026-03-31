"use client";

import Image from "next/image";
import { useState } from "react";
import { Bookmark, Share2 } from "lucide-react";
import type { Course, Lesson, Module } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LessonContent } from "@/components/lesson/LessonContent";
import { LessonNavigation } from "@/components/lesson/LessonNavigation";

const TABS = [
  { id: "overview", label: "Course Overview" },
  { id: "skills", label: "Your Skills" },
  { id: "reviews", label: "Reviews" },
  { id: "results", label: "Results" },
  { id: "faq", label: "FAQ" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const FALLBACK_INSTRUCTOR: NonNullable<Course["instructor"]> = {
  name: "Stephanie",
  credentials: "Lead Data Scientist @JULO | Ex. GOJEK, UNILEVER.",
};

const DEFAULT_AVATAR = "/images/character/avatar.png";
const OVERVIEW_COLLAPSE_AT = 480;

interface LessonTabbedPanelProps {
  course: Course;
  lesson: Lesson;
  currentModule: Module;
  onMarkCompleted: () => void;
  isCompleted: boolean;
}

export function LessonTabbedPanel({
  course,
  lesson,
  currentModule,
  onMarkCompleted,
  isCompleted,
}: LessonTabbedPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [overviewExpanded, setOverviewExpanded] = useState(false);

  const instructor = course.instructor ?? FALLBACK_INSTRUCTOR;
  const avatarSrc = instructor.avatarUrl ?? DEFAULT_AVATAR;

  const lessonContentLong = lesson.content.trim().length > OVERVIEW_COLLAPSE_AT;

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-white/95 shadow-[0_2px_24px_-4px_rgba(0,0,0,0.06)] backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4 border-b border-zinc-200/80 bg-linear-to-r from-primary/5 via-transparent to-tertiary/5 px-5 py-5 sm:px-6">
        <div className="flex min-w-0 gap-3 sm:gap-4">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-zinc-200/80 bg-zinc-100">
            <Image
              src={avatarSrc}
              alt=""
              width={44}
              height={44}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-zinc-900">{instructor.name}</p>
            <p className="mt-0.5 text-sm leading-snug text-zinc-500">
              {instructor.credentials}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-zinc-500 hover:text-zinc-800"
            aria-label="Share"
            onClick={() => {
              if (typeof navigator !== "undefined" && navigator.share) {
                void navigator.share({
                  title: course.title,
                  text: lesson.title,
                  url: window.location.href,
                });
              }
            }}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-zinc-500 hover:text-zinc-800"
            aria-label="Bookmark"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border-b border-zinc-200/80 px-5 sm:px-6">
        <nav
          className="-mb-px flex gap-5 overflow-x-auto pb-px sm:gap-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Lesson sections"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "shrink-0 whitespace-nowrap border-b-2 py-2.5 text-[13px] leading-none font-medium transition-colors sm:py-3 sm:text-sm",
                  isActive
                    ? "border-zinc-900 text-zinc-900"
                    : "border-transparent text-zinc-500 hover:text-zinc-700"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="px-5 py-6 sm:px-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold tracking-tight text-zinc-900">
              Course Overview
            </h3>
            <div className="rounded-xl border border-primary/12 bg-primary/5 p-4 sm:p-5">
              <p className="text-[15px] leading-relaxed text-zinc-700">
                {course.description}
              </p>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary/80">
                This lesson
              </p>
              <div className="border-t border-zinc-100 pt-1">
              <div
                className={cn(
                  "relative",
                  lessonContentLong &&
                    !overviewExpanded &&
                    "max-h-56 overflow-hidden sm:max-h-64"
                )}
              >
                <LessonContent content={lesson.content} />
                {lessonContentLong && !overviewExpanded ? (
                  <div
                    className="pointer-events-none absolute bottom-0 left-0 right-0 h-14 bg-linear-to-t from-white from-40% to-transparent"
                    aria-hidden
                  />
                ) : null}
              </div>
              {lessonContentLong && !overviewExpanded ? (
                <Button
                  type="button"
                  variant="outline"
                  className="mt-6 w-full rounded-lg border-zinc-200/90 bg-white text-zinc-700 hover:bg-zinc-50"
                  onClick={() => setOverviewExpanded(true)}
                >
                  Show more
                </Button>
              ) : null}
              </div>
            </div>
          </div>
        )}

        {activeTab === "skills" && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-900">Your Skills</h3>
            {course.outcomes && course.outcomes.length > 0 ? (
              <div className="rounded-xl border border-primary/10 bg-linear-to-br from-primary/5 to-transparent py-3 pl-3 pr-3 sm:pl-4">
                <ul className="space-y-2.5">
                  {course.outcomes.map((o) => (
                    <li key={o} className="flex gap-3 text-zinc-700">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70 shadow-sm ring-2 ring-primary/20"
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1">{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">
                Outcomes for this course will appear here.
              </p>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-900">Reviews</h3>
            {course.rating != null && course.reviewCount != null ? (
              <p className="text-zinc-600">
                <span className="font-medium text-zinc-900">
                  {course.rating.toFixed(1)}
                </span>{" "}
                average rating from{" "}
                <span className="font-medium text-zinc-900">
                  {course.reviewCount}
                </span>{" "}
                reviews.
              </p>
            ) : (
              <p className="text-sm text-zinc-500">
                Reviews will be available soon.
              </p>
            )}
          </div>
        )}

        {activeTab === "results" && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-zinc-900">Results</h3>
            <p className="text-sm leading-relaxed text-zinc-600">
              Track your progress from the lesson list and mark lessons complete
              as you go. Detailed results and project feedback will appear here
              when available.
            </p>
          </div>
        )}

        {activeTab === "faq" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-900">FAQ</h3>
            <ul className="space-y-3 text-sm text-zinc-600">
              <li>
                <span className="font-medium text-zinc-800">
                  How do I navigate lessons?
                </span>
                <p className="mt-1">
                  Use the Lesson panel to jump between modules, or the Next
                  button after each video.
                </p>
              </li>
              <li>
                <span className="font-medium text-zinc-800">
                  Can I revisit completed lessons?
                </span>
                <p className="mt-1">Yes—open any lesson from the course page.</p>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-zinc-200/80 px-5 py-6 sm:px-6">
        <LessonNavigation
          course={course}
          currentLesson={lesson}
          currentModule={currentModule}
          onMarkCompleted={onMarkCompleted}
          isCompleted={isCompleted}
        />
      </div>
    </div>
  );
}
