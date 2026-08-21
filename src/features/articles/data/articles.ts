export type ArticleCategory = "SQL" | "Analytics" | "Data Science" | "Career";

export type Article = {
  id: string;
  category: ArticleCategory;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  /** Article body — plain paragraphs */
  bodyParagraphs: string[];
};

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

export function getArticleCover(category: ArticleCategory): string {
  return ARTICLE_COVER_BY_CATEGORY[category];
}

export const ARTICLES: Article[] = [
  {
    id: "sql-window-functions-that-interviewers-love",
    category: "SQL",
    title: "Window Functions That Actually Show Up in Interviews",
    excerpt:
      "RANK, LAG, and running totals — not as trivia, but as the moves analysts use when stakeholders ask “compared to last month?”",
    date: "August 12, 2026",
    readTime: "6 min read",
    bodyParagraphs: [
      "Most beginners stop at GROUP BY. That is enough for a weekly report — until a hiring manager asks how revenue changed week over week without collapsing every row into one number. That is where window functions earn their keep.",
      "Think of a window as “look at this row, but also see its neighbors.” LAG compares to the previous period. SUM() OVER (ORDER BY …) builds a running total. RANK surfaces top performers without filtering the rest of the table away.",
      "In Digica’s Mini Bootcamp SQL, we treat window functions as a project skill: messy event tables, business questions in plain language, then SQL that answers them cleanly. You practice explaining the query out loud — the same way you would in a live case interview.",
      "A practical drill: take one metric your team cares about (active users, GMV, ticket volume). Write the aggregation version, then rewrite it with windows so you keep grain and still answer “vs previous.” That before/after story is portfolio gold.",
      "If you can defend when to use a window vs a join or a CTE, you are already past “I know SQL syntax” and into “I can think like an analyst.”",
    ],
  },
  {
    id: "from-messy-csv-to-stakeholder-ready-story",
    category: "Analytics",
    title: "From Messy CSV to a Stakeholder-Ready Story",
    excerpt:
      "Cleaning is not the finish line. The win is a clear narrative: what changed, why it might have changed, and what to do next.",
    date: "August 5, 2026",
    readTime: "5 min read",
    bodyParagraphs: [
      "Real datasets arrive late, incomplete, and slightly wrong. Duplicate IDs, mixed date formats, nulls that mean three different things — that is normal. The analysts who get trusted are the ones who document assumptions while they clean.",
      "Pandas (or BigQuery + notebooks) should get you to a trustworthy table. The second half of the job is framing: one insight, one chart that supports it, one recommendation. Stakeholders rarely want every pivot you tried.",
      "Digica’s Mini Bootcamp Data Analytics runs this as a loop: load → clean → explore → visualize → present. Mentors push on “so what?” until your slide would survive a product standup.",
      "Portfolio tip: show the before (raw quirks), the after (clean grain), and one decision your analysis would unlock. That beats a wall of colorful charts with no owner.",
      "Outcome-focused learning means every lesson exists to ship that loop faster — not to collect more library names on a resume.",
    ],
  },
  {
    id: "why-your-first-ml-model-should-be-boring",
    category: "Data Science",
    title: "Why Your First ML Model Should Be Boring",
    excerpt:
      "Start with a baseline you can explain. Complexity without a clear lift is how portfolios confuse interviewers.",
    date: "July 28, 2026",
    readTime: "7 min read",
    bodyParagraphs: [
      "Fancy architectures look great in demos. In interviews and on the job, the question is usually: Did you beat a simple baseline? Did you check leakage? Can a business person act on the prediction?",
      "A “boring” first model — logistic regression or a shallow tree on well-engineered features — forces you to understand the problem. You learn which features matter, where labels are noisy, and what “good enough” means for the use case.",
      "Digica’s Data Science Bootcamp sequences SQL and Python foundations before ML, then asks for a business capstone: not only accuracy, but implementation thinking — who consumes the score, how often it refreshes, what happens when it is wrong.",
      "Document the baseline, the chosen model, the metric, and one failure mode. That write-up is often more persuasive than a black-box notebook with 0.01 AUC improvement.",
      "Depth comes after clarity. Boring first models are how you earn the right to go deep.",
    ],
  },
  {
    id: "portfolio-projects-that-pass-the-hiring-manager-test",
    category: "Career",
    title: "Portfolio Projects That Pass the Hiring Manager Test",
    excerpt:
      "Recruiters skim. Hiring managers dig. Build projects that survive both — with a problem, method, and business impact on the first screen.",
    date: "July 20, 2026",
    readTime: "5 min read",
    bodyParagraphs: [
      "A GitHub full of tutorial clones signals effort, not judgment. Hiring managers look for problem framing, tradeoffs, and whether you can talk about the work without reading the README.",
      "Structure every project like a mini case: context → question → data → approach → result → limitation. Put that story above the code.",
      "Digica cohorts ship portfolio-ready deliverables with mentor feedback for a reason: feedback is the difference between “I finished the notebook” and “I can defend this in a panel.”",
      "Prefer one sharp project (SQL + viz, or EDA + simple model) over five half-finished repos. Depth beats volume when time is scarce.",
      "If you are mid-transition, map each project to a role title you want (analyst vs scientist) so your narrative stays consistent across LinkedIn, CV, and interview.",
    ],
  },
  {
    id: "ctes-subqueries-and-readable-sql-teams-trust",
    category: "SQL",
    title: "CTEs, Subqueries, and SQL Teams Actually Trust",
    excerpt:
      "Clever one-liners break in code review. Readable layered SQL survives handoffs — and that is a career skill.",
    date: "July 14, 2026",
    readTime: "6 min read",
    bodyParagraphs: [
      "Production analytics is collaborative. The next person to touch your query should not need a séance. CTEs let you name each step: filter events, aggregate daily, join dimensions, then select the final grain.",
      "Subqueries are fine when the nest is shallow. When logic stacks, prefer CTEs so each block has a purpose you can test independently.",
      "In Digica SQL sessions we grade clarity as hard as correctness: aliases, consistent grain, and comments only where intent is non-obvious.",
      "Practice refactoring a nested mess into three CTEs. That exercise mirrors what you will do in your first week on a data team.",
      "Trusted SQL is less about showing off and more about reducing surprise when the dashboard number moves.",
    ],
  },
  {
    id: "live-cohorts-vs-solo-video-what-actually-sticks",
    category: "Career",
    title: "Live Cohorts vs Solo Video: What Actually Sticks",
    excerpt:
      "Recordings help you review. Live sessions force you to ship, ask, and get unstuck — the loop career changers need.",
    date: "July 7, 2026",
    readTime: "4 min read",
    bodyParagraphs: [
      "Self-paced libraries are generous with content and quiet on accountability. Many learners finish 40% and stall exactly when projects get ambiguous.",
      "Live cohorts add deadlines, peers, and mentors who have shipped similar work. Ambiguity becomes a conversation instead of a closed tab.",
      "Digica’s model — live sessions, recordings, project milestones — is designed so you can miss a night and still catch up, without losing the pressure to deliver.",
      "Choose formats based on your bottleneck: if you lack structure, pick a cohort; if you only need a reference, video is enough. Most career movers need the first more than they admit.",
      "Skills stick when you reuse them under light pressure: present a finding, answer a mentor challenge, revise once. That is the loop we optimize for.",
    ],
  },
  {
    id: "bigquery-habits-that-save-hours-every-week",
    category: "SQL",
    title: "BigQuery Habits That Save Hours Every Week",
    excerpt:
      "Partition filters, dry runs, and naming conventions — small habits that keep costs down and queries reviewable.",
    date: "June 30, 2026",
    readTime: "6 min read",
    bodyParagraphs: [
      "Writing a query that returns the right answer is step one. Writing a query your team can rerun next month without a surprise bill is step two — and that is where BigQuery habits matter.",
      "Start with partition and cluster awareness. Filter on the partition column early. Prefer SELECT of the columns you need. Use dry runs when exploring unfamiliar tables so you see bytes processed before you pay for a full scan.",
      "In Digica SQL sessions we treat warehouse hygiene as part of the craft: aliases that match the grain, CTEs with clear names, and comments only where a future reader would otherwise guess wrong.",
      "A useful drill: take one slow dashboard query and rewrite it with an earlier filter and fewer columns. Measure bytes processed before and after. That before/after note belongs in your portfolio as much as the chart.",
      "Good SQL is not only correct — it is cheap enough to trust and clear enough to hand off.",
    ],
  },
  {
    id: "choosing-charts-that-answer-the-question",
    category: "Analytics",
    title: "Choosing Charts That Answer the Question",
    excerpt:
      "Bar, line, or table? Pick the visual that matches the decision — not the one that looks busiest in a deck.",
    date: "June 23, 2026",
    readTime: "5 min read",
    bodyParagraphs: [
      "Pretty charts fail when stakeholders still ask “so what changed?” The right visual starts from the question: comparison, trend, composition, or distribution.",
      "Comparisons favor bars. Trends favor lines with a clear time axis. Composition needs care — stacked bars and pies mislead when categories shift. Sometimes the best “chart” is a well-sorted table with one highlighted delta.",
      "Digica Analytics projects grade storytelling as hard as Pandas: one insight, one supporting visual, one recommendation. Mentors cut decoration that does not move the decision.",
      "Before you open a library, write the sentence you want the slide to prove. If the chart cannot carry that sentence, change the chart — not the font size.",
      "Visualization is a communication skill. Treat it like SQL: intentional, testable, and easy to defend.",
    ],
  },
  {
    id: "feature-leakage-the-silent-portfolio-killer",
    category: "Data Science",
    title: "Feature Leakage: The Silent Portfolio Killer",
    excerpt:
      "Impressive metrics that vanish in production usually share one cause — information from the future sneaking into training.",
    date: "June 16, 2026",
    readTime: "7 min read",
    bodyParagraphs: [
      "Leakage is when your model sees something it would not have at prediction time — a post-purchase flag, a target-derived score, or a join that quietly includes tomorrow’s labels.",
      "Interviewers and hiring managers know the pattern: sky-high validation scores, vague feature lists, no discussion of when each column becomes available. Calling out leakage risk is a maturity signal.",
      "In Digica’s Data Science Bootcamp, capstones are reviewed for train/serve consistency: which features exist at decision time, how you split by time, and what a failed prediction costs the business.",
      "Practical check: for every feature, write one line — “available at prediction?” If you hesitate, drop it or rebuild it from only past data.",
      "A slightly weaker honest model beats a perfect leaked one. Clarity about limitations is part of the deliverable.",
    ],
  },
  {
    id: "how-to-talk-about-your-project-in-interviews",
    category: "Career",
    title: "How to Talk About Your Project in Interviews",
    excerpt:
      "A two-minute project story: context, approach, result, and limitation — practiced until it sounds natural under pressure.",
    date: "June 9, 2026",
    readTime: "5 min read",
    bodyParagraphs: [
      "Technical screens often start with “walk me through a project.” Candidates who ramble through tools lose the room. Candidates who lead with the business question keep attention.",
      "Use a simple arc: context (who needed what), approach (data + method), result (metric or decision), limitation (what you would improve). Keep tools as supporting detail, not the headline.",
      "Digica mentor feedback sessions rehearse this arc on purpose. Presenting to peers under light pressure is closer to an interview than polishing a README alone.",
      "Record yourself once. Cut filler. Replace “I used Pandas” with “I cleaned duplicates and fixed date grain so weekly trends were trustworthy.”",
      "Your project is not a museum of libraries — it is proof you can think with data and explain it.",
    ],
  },
  {
    id: "joins-that-match-the-business-grain",
    category: "SQL",
    title: "Joins That Match the Business Grain",
    excerpt:
      "Fan-outs and double counts usually come from joining at the wrong grain — fix the grain first, then the join type.",
    date: "June 2, 2026",
    readTime: "6 min read",
    bodyParagraphs: [
      "INNER vs LEFT is not the hard part. Knowing whether you are joining orders to customers, or order lines to payments, is. Wrong grain creates silent fan-outs that inflate revenue until someone audits the dashboard.",
      "Before you JOIN, write the primary key of each side and the grain of the output you need. If one side is many-to-many in disguise, aggregate first or use a bridge carefully.",
      "Digica SQL projects use messy real-ish schemas on purpose: duplicate keys, late-arriving dimensions, and metrics that break if you skip the grain check.",
      "Habit: after every join, spot-check row counts and a known total. If orders ballooned, you probably multiplied rows.",
      "Analysts who protect grain earn trust. Syntax is easy to Google; judgment is what interviews try to surface.",
    ],
  },
  {
    id: "eda-checklist-before-you-model-anything",
    category: "Data Science",
    title: "An EDA Checklist Before You Model Anything",
    excerpt:
      "Nulls, class balance, leakage risks, and a sanity baseline — the hour of EDA that saves a week of wrong modeling.",
    date: "May 26, 2026",
    readTime: "6 min read",
    bodyParagraphs: [
      "Jumping to fit a model feels productive. Skipping EDA is how you ship a model that predicts the label you accidentally left in the features.",
      "A short checklist: target definition, missingness patterns, duplicates, class balance, time range, obvious outliers, and a dumb baseline (majority class or mean). Write what you found before you tune hyperparameters.",
      "Digica’s path into ML assumes you can defend that checklist out loud. Mentors ask what surprised you in the data — not which library had the nicest API.",
      "Keep a one-page EDA note in every repo. Future you (and interviewers) will thank you when metrics look “too good.”",
      "Exploration is not procrastination when it prevents wasted modeling. Make it a gate, not a vibe.",
    ],
  },
];

const CATEGORY_PROGRAM_HINT: Record<ArticleCategory, string> = {
  SQL: "Ready to practice? Explore Digica’s Mini Bootcamp SQL and upcoming live programs.",
  Analytics:
    "Ready to practice? Explore Digica’s Mini Bootcamp Data Analytics and upcoming live programs.",
  "Data Science":
    "Ready to practice? Explore Digica’s Data Science Bootcamp and upcoming live programs.",
  Career:
    "Ready for the next step? Explore Digica’s live bootcamps and find a cohort that fits your goals.",
};

export function getArticleById(id: string): Article | undefined {
  return ARTICLES.find((a) => a.id === id);
}

export function getAllArticleIds(): string[] {
  return ARTICLES.map((a) => a.id);
}

/** Latest articles for homepage teasers (array order = newest first). */
export function getLatestArticles(n: number): Article[] {
  return ARTICLES.slice(0, n);
}

export function getProgramHintForCategory(category: ArticleCategory): string {
  return CATEGORY_PROGRAM_HINT[category];
}
