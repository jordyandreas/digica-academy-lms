"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const leadInstructor = {
  name: "Stephanie",
  role: "Data Science Lead",
  company: "JULO | Ex. GOJEK & UNILEVER",
  image: "/images/instructors/stephanie.jpg",
} as const;

const instructors = [
  {
    name: "Darren",
    role: "Data Scientist",
    company: "DANA",
    image: "/images/instructors/darren-portrait.jpg",
  },
  {
    name: "Sherin Widya Sari",
    role: "Senior Data Scientist",
    company: "Gojek",
    image: "/images/instructors/sherin-widya-sari.jpg",
  },
  {
    name: "Katia Evelyn Husen",
    role: "Data Analytics",
    company: "Grab",
    image: "/images/instructors/katia-evelyn-husen.jpg",
  },
  {
    name: "Liliek Darmawan",
    role: "Product Data Specialist",
    company: "Traveloka",
    image: "/images/instructors/liliek-darmawan.jpg",
  },
] as const;

const leadVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 24,
      mass: 0.65,
    },
  },
} as const;

const gridVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.16,
    },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 24,
      mass: 0.65,
    },
  },
} as const;

export default function Instructor() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="instructor"
      className="relative scroll-mt-24 border-y border-zinc-200/80 bg-gradient-to-b from-primary/5 via-white to-tertiary/5 px-6 py-16 md:py-20"
    >
      <div className="pointer-events-none absolute inset-x-0 top-16 -z-10 flex justify-center">
        <div className="h-64 w-[36rem] rounded-full bg-gradient-to-r from-primary/15 via-secondary/15 to-tertiary/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl space-y-10 md:space-y-12">
        <motion.div
          className="mx-auto max-w-3xl space-y-4 text-center"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={reduceMotion ? undefined : { once: true, margin: "-80px" }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 260, damping: 22, mass: 0.7 }
          }
        >
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Instructor Team
          </span>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-zinc-900 md:text-[1.9rem] md:leading-tight">
            Meet our{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">
              expert instructors
            </span>
          </h2>
          <p className="text-sm text-zinc-600 md:text-[0.95rem]">
            Learn from practitioners who ship real products — blending{" "}
            <span className="font-medium text-primary">hands-on experience</span> with{" "}
            <span className="font-medium text-tertiary">clear, structured teaching</span>.
          </p>
        </motion.div>

        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
          <motion.div
            className="group flex cursor-default flex-col items-center text-center"
            variants={leadVariants}
            initial={reduceMotion ? "show" : "hidden"}
            whileInView={reduceMotion ? undefined : "show"}
            viewport={reduceMotion ? undefined : { once: true, margin: "-80px" }}
          >
            <InstructorPortrait
              name={leadInstructor.name}
              image={leadInstructor.image}
              size="lead"
            />
            <p className="mt-5 font-display text-lg font-semibold tracking-tight text-zinc-900 md:text-xl">
              {leadInstructor.name}
            </p>
            <span className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              Lead Instructor
            </span>
            <p className="mt-2 text-sm font-medium text-primary md:text-base">{leadInstructor.role}</p>
            <p className="mt-0.5 text-sm font-medium text-zinc-600">{leadInstructor.company}</p>
          </motion.div>

          <motion.ul
            className="grid grid-cols-2 gap-8 sm:gap-6"
            variants={gridVariants}
            initial={reduceMotion ? "show" : "hidden"}
            whileInView={reduceMotion ? undefined : "show"}
            viewport={reduceMotion ? undefined : { once: true, margin: "-80px" }}
          >
            {instructors.map((instructor) => (
              <motion.li
                key={instructor.name}
                className="group flex cursor-default flex-col items-center text-center"
                variants={cardVariants}
              >
                <InstructorPortrait name={instructor.name} image={instructor.image} size="team" />
                <p className="mt-4 font-display text-sm font-semibold tracking-tight text-zinc-900 md:text-base">
                  {instructor.name}
                </p>
                <p className="mt-1 text-xs font-medium text-primary md:text-sm">{instructor.role}</p>
                <p className="mt-0.5 text-xs font-medium text-zinc-600">{instructor.company}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}

const portraitSizes = {
  team: {
    frame: "h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36",
    sizes: "(max-width: 640px) 112px, (max-width: 768px) 128px, 144px",
  },
  lead: {
    frame: "h-44 w-44 md:h-52 md:w-52",
    sizes: "(max-width: 768px) 176px, 208px",
  },
} as const;

function InstructorPortrait({
  name,
  image,
  size = "team",
}: {
  name: string;
  image: string;
  size?: keyof typeof portraitSizes;
}) {
  const reduceMotion = useReducedMotion();
  const portrait = portraitSizes[size];

  return (
    <motion.div
      className="relative"
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -6,
              scale: 1.04,
            }
      }
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-primary/20 via-secondary/25 to-tertiary/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative rounded-full bg-gradient-to-br from-primary via-secondary to-tertiary p-[3px] shadow-sm shadow-primary/15 transition-[box-shadow] duration-300 group-hover:shadow-lg group-hover:shadow-primary/25">
        <div className="overflow-hidden rounded-full bg-white p-[3px]">
          <div className={cn("relative overflow-hidden rounded-full", portrait.frame)}>
            <Image
              src={image}
              alt={name}
              fill
              sizes={portrait.sizes}
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
