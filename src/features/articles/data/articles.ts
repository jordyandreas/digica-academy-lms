export type ArticleCategory = "Development" | "Marketing" | "Design";

export type Article = {
  id: string;
  category: ArticleCategory;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  /** Dummy article body — plain paragraphs */
  bodyParagraphs: string[];
};

export const ARTICLE_CATEGORY_FILTERS = [
  "All",
  "Development",
  "Marketing",
  "Design",
] as const;

export const ARTICLES: Article[] = [
  {
    id: "lifecycle-of-data-projects",
    category: "Development",
    title: "Mapping the Lifecycle of Real Data Projects.",
    excerpt:
      "From messy spreadsheets to production dashboards – see how a modern data project really flows inside a tech team.",
    date: "September 25, 2025",
    readTime: "7 min read",
    bodyParagraphs: [
      "Every data project starts somewhere messy: a CSV export, a one-off SQL query, or a dashboard nobody fully trusts. The gap between that first file and a production pipeline is where teams win or lose momentum.",
      "In practice, the lifecycle usually moves through discovery, modeling, validation, and deployment—not as a straight line, but as loops. You revisit assumptions when stakeholders ask new questions, and you refactor when the data source changes overnight.",
      "What separates high-performing teams is documentation and handoffs. When the analyst who built the prototype documents decisions, metrics, and caveats, the engineer who hardens the pipeline does not have to reverse-engineer intent from code alone.",
      "At Digica Academy, we teach this flow with small, realistic briefs so you can recognize where you are in the lifecycle—and what “done” should mean before you promise a date.",
    ],
  },
  {
    id: "ux-from-execution-to-strategy",
    category: "Marketing",
    title: "Elevating UX from Execution to Strategy.",
    excerpt:
      "Discover how product teams connect experimentation, storytelling, and analytics to design interfaces that actually convert.",
    date: "September 25, 2025",
    readTime: "6 min read",
    bodyParagraphs: [
      "Execution-focused UX teams ship pixels quickly, but strategy-focused UX connects those pixels to business outcomes. The shift is less about tools and more about the questions you ask before opening Figma.",
      "Strong teams pair qualitative insight with behavioral data: not just what users say in interviews, but what they do in funnels, session replays, and A/B tests. That combination keeps narratives honest when stakeholders disagree.",
      "Storytelling matters because decisions are made in rooms full of people who will never read a research report. A concise story arc—problem, insight, recommendation—helps marketing, product, and leadership align on what to test next.",
      "If you are moving from execution to strategy, start by owning one metric that UX can influence and one experiment roadmap tied to it. Small, repeated loops beat one big redesign that ships without learning.",
    ],
  },
  {
    id: "shifting-focus-to-outcomes",
    category: "Design",
    title: "Shifting the Learning Focus to Outcomes.",
    excerpt:
      "Why modern learning experiences focus less on content volume and more on portfolio-ready outcomes and career transitions.",
    date: "September 25, 2025",
    readTime: "5 min read",
    bodyParagraphs: [
      "Learners do not wake up wanting “120 hours of video.” They want proof they can do the job: a portfolio project, a stakeholder-ready narrative, and the vocabulary to pass a technical screen.",
      "Outcome-focused programs replace endless modules with milestones: ship a dashboard, defend your methodology, iterate from feedback. Content exists to support those milestones, not the other way around.",
      "Assessment changes too. Instead of memorization checks, you evaluate artifacts—write-ups, notebooks, slides—that resemble what employers actually review.",
      "Digica Academy structures tracks around deliverables so you always know why a lesson exists and what skill it unlocks next. Volume is easy to measure; outcomes are harder—which is why we optimize for the second.",
    ],
  },
];

export function getArticleById(id: string): Article | undefined {
  return ARTICLES.find((a) => a.id === id);
}

export function getAllArticleIds(): string[] {
  return ARTICLES.map((a) => a.id);
}
