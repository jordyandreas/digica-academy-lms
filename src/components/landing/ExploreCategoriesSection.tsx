"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Sparkles,
  LineChart,
  Code2,
  Laptop,
  Rocket,
  ShieldPlus,
  Globe,
  Users,
  Paintbrush,
  FlaskConical,
  Dice5,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  EXPLORE_CATEGORY_LABELS,
  EXPLORE_CATEGORY_ORDER,
} from "@/lib/exploreCategories";

const CATEGORY_ICONS: Record<(typeof EXPLORE_CATEGORY_ORDER)[number], LucideIcon> = {
  business: Briefcase,
  "artificial-intelligence": Sparkles,
  "data-science": LineChart,
  "computer-science": Code2,
  "information-technology": Laptop,
  "personal-development": Rocket,
  healthcare: ShieldPlus,
  "language-learning": Globe,
  "social-sciences": Users,
  "arts-humanities": Paintbrush,
  "physical-science-engineering": FlaskConical,
  "math-logic": Dice5,
};

export default function ExploreCategoriesSection() {
  return (
    <section
      id="explore-categories"
      className="scroll-mt-24 border-t border-zinc-100 bg-white px-6 py-14 md:py-20"
      aria-labelledby="explore-categories-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="explore-categories-heading"
          className="text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl"
        >
          Explore Categories
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600">
          Pick a focus area—we open the catalog with your topic highlighted at the top.
        </p>

        <ul className="mt-8 flex flex-wrap gap-3 md:gap-3.5">
          {EXPLORE_CATEGORY_ORDER.map((id) => {
            const Icon = CATEGORY_ICONS[id];
            const label = EXPLORE_CATEGORY_LABELS[id];
            return (
              <li key={id}>
                <Link
                  href={{
                    pathname: "/courses",
                    query: { category: id },
                  }}
                  className={cn(
                    "group inline-flex items-center gap-2 rounded-full border border-transparent",
                    "bg-[#f0f4f8] px-4 py-2.5 text-sm font-medium text-zinc-700",
                    "transition-all hover:border-primary/15 hover:bg-primary/5 hover:text-primary",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  )}
                >
                  <Icon
                    className="h-4 w-4 shrink-0 text-zinc-500 transition-colors group-hover:text-primary"
                    aria-hidden
                  />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
