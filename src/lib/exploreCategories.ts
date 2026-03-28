/** IDs match query param `?category=` from Explore Categories chips. */
export const EXPLORE_CATEGORY_LABELS: Record<string, string> = {
  business: "Business",
  "artificial-intelligence": "Artificial Intelligence",
  "data-science": "Data Science",
  "computer-science": "Computer Science",
  "information-technology": "Information Technology",
  "personal-development": "Personal Development",
  healthcare: "Healthcare",
  "language-learning": "Language Learning",
  "social-sciences": "Social Sciences",
  "arts-humanities": "Arts and Humanities",
  "physical-science-engineering": "Physical Science and Engineering",
  "math-logic": "Math and Logic",
};

/** Display order for home Explore Categories section. */
export const EXPLORE_CATEGORY_ORDER = [
  "business",
  "artificial-intelligence",
  "data-science",
  "computer-science",
  "information-technology",
  "personal-development",
  "healthcare",
  "language-learning",
  "social-sciences",
  "arts-humanities",
  "physical-science-engineering",
  "math-logic",
] as const;

export function getExploreCategoryLabel(id: string | null): string | undefined {
  if (!id) return undefined;
  return EXPLORE_CATEGORY_LABELS[id];
}
