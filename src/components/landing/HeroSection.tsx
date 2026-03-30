"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 6500;

const HERO_PADDING = "py-8 md:py-10 lg:py-12 xl:pb-0";

const HERO_CHARACTER_SRC = "/images/character/character_2.png";

type HeroSlide = {
  id: string;
  badge: string;
  title: React.ReactNode;
  description: string;
  showCtas?: boolean;
};

const slides: HeroSlide[] = [
  {
    id: "practitioners",
    badge: "Data & Tech bootcamps",
    title: (
      <>
        <span className="text-primary-foreground">Learn Data & Tech from </span>
        <span className="text-white">Industry Practitioners</span>
      </>
    ),
    description:
      "Join practical bootcamps in SQL, Data Analysis, and Data Science designed to help you build real-world skills and ship production-grade projects with confidence.",
    showCtas: true,
  },
  {
    id: "projects",
    badge: "Project-first curriculum",
    title: (
      <>
        <span className="text-primary-foreground">Ship </span>
        <span className="text-tertiary-foreground">portfolio-ready work</span>
        <span className="text-primary-foreground"> every week</span>
      </>
    ),
    description:
      "Work through guided scenarios, peer reviews, and capstone builds so you leave with artifacts you can show in interviews—not just notes from lectures.",
    showCtas: false,
  },
  {
    id: "community",
    badge: "Cohort learning",
    title: (
      <>
        <span className="text-primary-foreground">Learn faster inside a </span>
        <span className="text-white">supportive cohort</span>
      </>
    ),
    description:
      "Stay accountable with live sessions, office hours, and a community of learners leveling up in analytics, engineering, and data—same pace, real feedback.",
    showCtas: false,
  },
];

const fadeY = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export default function HeroSection() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const slide = slides[index]!;
  const reserveCtaSlot = slides.some((s) => s.showCtas);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      id="hero"
      className={cn(
        "relative overflow-hidden border-b border-zinc-200/80 bg-linear-to-br from-primary to-secondary px-6 text-primary-foreground",
        HERO_PADDING,
      )}
      aria-roledescription="carousel"
    >
      <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden>
        <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full border border-primary-foreground/20" />
        <div className="absolute right-[-32px] top-6 h-40 w-40 rounded-full border border-primary-foreground/10" />
      </div>

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 xl:min-h-[min(22rem,52svh)] xl:grid-cols-2 xl:items-center xl:gap-12 2xl:min-h-[min(26rem,58svh)]">
        <div className="relative z-30 flex min-h-0 flex-col">
          <div className="flex min-h-0 flex-col">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={slide.id}
                initial={fadeY.initial}
                animate={fadeY.animate}
                exit={fadeY.exit}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4"
                aria-live="polite"
              >
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/15 px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-none">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/80" />
                  <span>{slide.badge}</span>
                </div>

                <div className="min-h-44 space-y-3 sm:min-h-46 md:min-h-48 xl:min-h-[min(13.5rem,32svh)]">
                  <h1 className="text-balance text-4xl font-bold leading-[1.12] tracking-tight sm:text-[2.5rem] md:text-5xl xl:text-[3.15rem]">
                    {slide.title}
                  </h1>
                  <p className="max-w-lg text-base leading-relaxed text-primary-foreground/80 md:text-[1.05rem]">
                    {slide.description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div
              className={cn(
                "mt-8 flex shrink-0 flex-col gap-3",
                reserveCtaSlot && "min-h-13 md:min-h-14",
              )}
              aria-hidden={!slide.showCtas ? true : undefined}
            >
              {slide.showCtas ? (
                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full bg-primary-foreground px-8 text-primary shadow-md shadow-black/10 hover:bg-primary-foreground/90"
                  >
                    <Link href="#courses">
                      Explore Courses
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full border-2 border-primary-foreground/40 bg-transparent px-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  >
                    <Link href="#courses">Join Bootcamp</Link>
                  </Button>
                </div>
              ) : null}
            </div>
          </div>

          <div
            className="mt-10 flex shrink-0 items-center gap-2 md:mt-8 xl:mt-8"
            role="tablist"
            aria-label="Hero highlights"
          >
            {slides.map((s, i) => (
              <Button
                key={s.id}
                type="button"
                variant="ghost"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show slide ${i + 1}`}
                className={cn(
                  "h-2 min-h-0 w-2 min-w-0 shrink-0 rounded-full p-0 transition-all duration-300 hover:bg-primary-foreground/55",
                  i === index
                    ? "w-8 bg-primary-foreground hover:bg-primary-foreground"
                    : "bg-primary-foreground/35",
                )}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 hidden min-h-0 w-full xl:flex xl:min-h-[min(16rem,38svh)] xl:items-end xl:justify-end 2xl:min-h-[min(18rem,42svh)]">
          <div
            className="pointer-events-none absolute bottom-0 right-0 h-48 w-[min(100%,24rem)] rounded-[50%] bg-linear-to-t from-primary-foreground/10 to-transparent blur-2xl"
            aria-hidden
          />
          <motion.div
            className="relative h-full w-full max-w-lg"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduceMotion ? 0 : 0.08,
              type: "spring",
              stiffness: 180,
              damping: 22,
            }}
          >
            <div className="relative ml-auto aspect-5/6 w-full max-w-md xl:max-w-[min(100%,26rem)] 2xl:max-w-[min(100%,32rem)]">
              <Image
                src={HERO_CHARACTER_SRC}
                alt="Digica Academy learner"
                fill
                className="object-contain object-bottom"
                sizes="(max-width: 1279px) 0px, min(32rem, 40vw)"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
