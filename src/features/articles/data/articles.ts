export type ArticleCategory = "SQL" | "Analytics" | "Data Science" | "Career";

export type Article = {
  slug: string;
  category: ArticleCategory;
  title: string;
  excerpt: string;
  displayDate: string;
  readTimeLabel: string;
  bodyHtml: string;
};

export type ArticleCardModel = Pick<
  Article,
  "slug" | "category" | "title" | "excerpt" | "displayDate" | "readTimeLabel"
>;

export const ARTICLE_CATEGORY_FILTERS = [
  "All",
  "SQL",
  "Analytics",
  "Data Science",
  "Career",
] as const;

/** Shared cover art per category (card + detail banner). */
export const ARTICLE_COVER_BY_CATEGORY: Record<ArticleCategory, string> = {
  SQL: "/images/articles/sql-cover.png",
  Analytics: "/images/articles/analytics-cover.png",
  "Data Science": "/images/articles/data-science-cover.png",
  Career: "/images/articles/career-cover.png",
};

const CATEGORY_PROGRAM_HINT: Record<ArticleCategory, string> = {
  SQL: "Ready to practice? Explore Digica’s Mini Bootcamp SQL and upcoming live programs.",
  Analytics:
    "Ready to practice? Explore Digica’s Mini Bootcamp Data Analytics and upcoming live programs.",
  "Data Science":
    "Ready to practice? Explore Digica’s Data Science Bootcamp and upcoming live programs.",
  Career:
    "Ready for the next step? Explore Digica’s live bootcamps and find a cohort that fits your goals.",
};

export function getArticleCover(category: ArticleCategory): string {
  return ARTICLE_COVER_BY_CATEGORY[category];
}

export function getProgramHintForCategory(category: ArticleCategory): string {
  return CATEGORY_PROGRAM_HINT[category];
}
