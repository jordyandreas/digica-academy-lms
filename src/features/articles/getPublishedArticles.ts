import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Article, ArticleCategory } from "@/features/articles/data/articles";

const ARTICLE_CARD_SELECT =
  "slug, category, title, excerpt, published_at, display_date, read_time_minutes, read_time_display";

const ARTICLE_DETAIL_SELECT = `${ARTICLE_CARD_SELECT}, body_html`;

const VALID_CATEGORIES = new Set<string>([
  "SQL",
  "Analytics",
  "Data Science",
  "Career",
]);

type LmsArticleCardRow = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  published_at: string | null;
  display_date: string | null;
  read_time_minutes: number | null;
  read_time_display: string | null;
};

type LmsArticleDetailRow = LmsArticleCardRow & {
  body_html: string | null;
};

function formatPublishedDate(publishedAt: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(publishedAt));
}

function mapRowToArticleCard(
  row: LmsArticleCardRow
): Omit<Article, "bodyHtml"> | null {
  if (!VALID_CATEGORIES.has(row.category)) {
    console.warn(
      `[lms] Skipping article "${row.slug}": unknown category "${row.category}".`
    );
    return null;
  }

  const displayDate =
    row.display_date?.trim() ||
    (row.published_at ? formatPublishedDate(row.published_at) : "");

  const readTimeLabel =
    row.read_time_display?.trim() ||
    (row.read_time_minutes != null
      ? `${row.read_time_minutes} min read`
      : "");

  return {
    slug: row.slug,
    category: row.category as ArticleCategory,
    title: row.title,
    excerpt: row.excerpt,
    displayDate,
    readTimeLabel,
  };
}

function mapRowToArticle(row: LmsArticleDetailRow): Article | null {
  const card = mapRowToArticleCard(row);
  if (!card) return null;
  return { ...card, bodyHtml: row.body_html ?? "" };
}

async function fetchPublishedCardRows(
  limit?: number
): Promise<LmsArticleCardRow[]> {
  if (!isSupabaseConfigured()) {
    console.warn("[lms] Supabase not configured; articles unavailable.");
    return [];
  }

  try {
    const supabase = await createClient();
    let query = supabase
      .from("lms_articles")
      .select(ARTICLE_CARD_SELECT)
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false });

    if (limit != null) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.warn("[lms] Could not load articles:", error.message);
      return [];
    }

    return (data ?? []) as LmsArticleCardRow[];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn("[lms] Could not load articles:", message);
    return [];
  }
}

export async function getPublishedArticleCards(): Promise<
  Omit<Article, "bodyHtml">[]
> {
  const rows = await fetchPublishedCardRows();
  return rows
    .map(mapRowToArticleCard)
    .filter((article): article is Omit<Article, "bodyHtml"> => article != null);
}

/** @deprecated Prefer getPublishedArticleCards for list views. */
export async function getPublishedArticles(): Promise<Article[]> {
  const cards = await getPublishedArticleCards();
  return cards.map((card) => ({ ...card, bodyHtml: "" }));
}

export async function getPublishedArticleBySlug(
  slug: string
): Promise<Article | null> {
  if (!slug.trim() || !isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lms_articles")
      .select(ARTICLE_DETAIL_SELECT)
      .eq("status", "published")
      .eq("slug", slug.trim())
      .maybeSingle();

    if (error) {
      console.warn("[lms] Could not load article:", error.message);
      return null;
    }

    if (!data) {
      return null;
    }

    return mapRowToArticle(data as LmsArticleDetailRow);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn("[lms] Could not load article:", message);
    return null;
  }
}

export async function getLatestPublishedArticles(n: number): Promise<Article[]> {
  if (n <= 0) {
    return [];
  }

  const rows = await fetchPublishedCardRows(n);
  return rows
    .map((row) => {
      const card = mapRowToArticleCard(row);
      return card ? { ...card, bodyHtml: "" } : null;
    })
    .filter((article): article is Article => article != null);
}
