"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CourseCard } from "@/components/course/CourseCard";
import { courses } from "@/features/courses/data/courses";
import { Button } from "@/components/ui/button";

const FEATURED_COURSES_SLUGS = [
  "data-analyst-python",
  "data-analyst-sql-bigquery",
  "data-science-end-to-end",
];

type CoursesSectionProps = {
  sectionId?: string;
  heading?: string;
  description?: string;
  showTagline?: boolean;
  /** When set, those courses are omitted (e.g. already enrolled). */
  excludeSlugs?: string[];
};

export default function CoursesSection({
  sectionId = "courses",
  heading = "Explore our courses",
  description = "Hand-picked programs to help you level up your design and tech career, guided by practitioners who build in production every day.",
  showTagline = true,
  excludeSlugs,
}: CoursesSectionProps = {}) {
  const reduceMotion = useReducedMotion();
  const featuredCourses = courses.filter((c) =>
    FEATURED_COURSES_SLUGS.includes(c.slug)
  );
  const excluded = new Set(excludeSlugs ?? []);
  const visibleCourses =
    excludeSlugs === undefined
      ? featuredCourses
      : featuredCourses.filter((c) => !excluded.has(c.slug));

  if (visibleCourses.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.04,
      },
    },
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 24,
        mass: 0.65,
      },
    },
  } as const;

  return (
    <section id={sectionId} className="px-6 py-16 md:py-20">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">
              {heading}
            </h2>
            <p className="max-w-xl text-sm text-zinc-600 md:text-[0.95rem]">
              {description}
            </p>
          </div>
          {showTagline ? (
            <p className="text-xs text-zinc-500">
              Cohort-based · Small groups · Hands-on projects
            </p>
          ) : null}
        </div>

        <motion.div
          className="grid gap-6 md:grid-cols-3"
          variants={containerVariants}
          initial={reduceMotion ? "show" : "hidden"}
          whileInView={reduceMotion ? undefined : "show"}
          viewport={reduceMotion ? undefined : { once: true, margin: "-80px" }}
        >
          {visibleCourses.map((course) => {
            return (
              <motion.div
                key={course.slug}
                className="h-full"
                variants={cardVariants}
              >
                <CourseCard course={course} />
              </motion.div>
            );
          })}
        </motion.div>

        <div className="flex justify-center pt-4">
          <Button asChild size="lg" variant="outline" className="rounded-full px-8">
            <Link href="/courses">See all courses</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

