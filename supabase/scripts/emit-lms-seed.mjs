import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PLACEHOLDER_COVER = "/images/placeholder/placeholder.webp";
const VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4";
const INSTRUCTOR = {
  name: "Stephanie",
  credentials: "Lead Data Scientist @JULO | Ex. GOJEK, UNILEVER.",
};

function excerptFromLessonContent(content, max = 140) {
  const text = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, "")
    .replace(/\*\*|__/g, "")
    .replace(/^#+\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

function sqlStr(value) {
  if (value == null) return "null";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlDollar(value) {
  return `$lms$${value}$lms$`;
}

const courses = [
  {
    id: "11111111-1111-4111-8111-111111111001",
    slug: "data-analyst-python",
    title: "Data Analyst with Python",
    description:
      "Build practical data analysis skills with Python: clean data, explore patterns, and communicate insights with confidence.",
    sessions: 6,
    priceLabel: "$499",
    priceCompareLabel: "$799",
    rating: 4.9,
    reviewCount: 28,
    studentCount: 186,
    level: "beginner",
    outcomes: [
      "Load, clean, and explore datasets with Python and pandas.",
      "Summarize findings with clear visuals and narrative.",
      "Build a repeatable workflow you can reuse on new data.",
    ],
    modules: [
      {
        id: "22222222-2222-4222-8222-222222222001",
        title: "Python fundamentals",
        lessons: [
          {
            id: "33333333-3333-4333-8333-333333333001",
            slug: "python-introduction",
            title: "Python Introduction",
            content: `Get comfortable with Python as a tool for analytics: how to run code, use notebooks or scripts, and read errors with confidence.

**You will cover:**
- Why Python is widely used in data teams
- Environments, packages, and reproducible setups
- Writing small programs that load files and print summaries

Focus on clarity and repetition—speed comes later.`,
          },
          {
            id: "33333333-3333-4333-8333-333333333002",
            slug: "python-data-types",
            title: "Python Data Types",
            content: `Data analysis in Python leans on a small set of core types. Understanding them prevents subtle bugs later.

**Core ideas:**
- Numbers, strings, booleans, and type conversion
- Lists, tuples, and dictionaries for structured data
- Iteration, comprehensions, and functions for reuse

These building blocks map directly to how pandas represents tables and columns.`,
          },
        ],
      },
      {
        id: "22222222-2222-4222-8222-222222222002",
        title: "Data analysis with pandas",
        lessons: [
          {
            id: "33333333-3333-4333-8333-333333333003",
            slug: "data-analysis-python-pandas-dataframe",
            title: "Pandas & DataFrame",
            content: `Pandas gives you **DataFrames**—tabular data with named columns and rich operations for exploration.

**Skills in this lesson:**
- Loading CSV and inspecting shape, dtypes, and head()
- Selecting columns, filtering rows, and sorting
- Basic aggregates: counts, sums, and grouped summaries

Goal: answer simple business questions directly from the table.`,
          },
          {
            id: "33333333-3333-4333-8333-333333333004",
            slug: "data-analysis-python-cleansing-analysis",
            title: "Data Cleansing & Analysis",
            content: `Real datasets are messy. Cleansing turns ambiguous inputs into trustworthy metrics.

**Typical tasks:**
- Handling missing values and duplicates
- Parsing dates and normalizing categories
- Feature-ready tables for aggregation and joins

Document assumptions as you clean—your future self (and teammates) will thank you.`,
          },
        ],
      },
      {
        id: "22222222-2222-4222-8222-222222222003",
        title: "Visualization & capstone",
        lessons: [
          {
            id: "33333333-3333-4333-8333-333333333005",
            slug: "data-visualization-python",
            title: "Data Visualization with Python",
            content: `Visualization helps you spot patterns fast and communicate results without drowning stakeholders in tables.

**Practice:**
- Choosing chart types for comparisons, trends, and distributions
- Labeling axes, titles, and units for clarity
- Iterating from exploratory plots to presentation-ready figures

Keep the story simple: one main message per visual.`,
          },
          {
            id: "33333333-3333-4333-8333-333333333006",
            slug: "final-project",
            title: "Final Project",
            content: `Bring the course together: load a dataset, clean it, analyze it, and present insights with visuals.

**Deliverable outline:**
- Problem statement and success metrics
- Data dictionary and cleansing notes
- Key findings backed by charts
- Limitations and next steps

Treat this as a portfolio piece you can talk through in an interview.`,
          },
        ],
      },
    ],
  },
  {
    id: "11111111-1111-4111-8111-111111111002",
    slug: "data-analyst-sql-bigquery",
    title: "Data Analyst with SQL (Bigquery)",
    description:
      "Learn SQL fundamentals for analytics and query large datasets with Google BigQuery.",
    sessions: 6,
    priceLabel: "$499",
    priceCompareLabel: "$699",
    rating: 4.8,
    reviewCount: 17,
    studentCount: 94,
    level: "beginner",
    outcomes: [
      "Write readable SQL for filtering, joins, and aggregations.",
      "Design queries suited for large warehouses like BigQuery.",
      "Translate business questions into verifiable metrics.",
    ],
    modules: [
      {
        id: "22222222-2222-4222-8222-222222222011",
        title: "Foundations & core querying",
        lessons: [
          {
            id: "33333333-3333-4333-8333-333333333011",
            slug: "introduction-database-bigquery",
            title: "Introduction to Database & Bigquery",
            content:
              "Get started with core database concepts and how BigQuery works as a cloud data warehouse.",
          },
          {
            id: "33333333-3333-4333-8333-333333333012",
            slug: "basic-querying-sql",
            title: "Basic Querying in SQL",
            content:
              "Learn SELECT, WHERE, ORDER BY, and LIMIT to retrieve and filter data accurately.",
          },
        ],
      },
      {
        id: "22222222-2222-4222-8222-222222222012",
        title: "Analytics SQL",
        lessons: [
          {
            id: "33333333-3333-4333-8333-333333333013",
            slug: "intermediate-sql-aggregation",
            title: "Intermediate SQL (Aggregation)",
            content:
              "Use GROUP BY with aggregate functions to summarize metrics and answer business questions.",
          },
          {
            id: "33333333-3333-4333-8333-333333333014",
            slug: "subquery-and-cte",
            title: "Subquery & CTE",
            content:
              "Break complex SQL into manageable parts with subqueries and common table expressions (CTE).",
          },
          {
            id: "33333333-3333-4333-8333-333333333015",
            slug: "window-functions",
            title: "Window Functions",
            content:
              "Apply analytic functions for ranking, running totals, and partition-based calculations.",
          },
        ],
      },
      {
        id: "22222222-2222-4222-8222-222222222013",
        title: "Capstone project",
        lessons: [
          {
            id: "33333333-3333-4333-8333-333333333016",
            slug: "sql-final-project",
            title: "Final Project.",
            content:
              "Build an end-to-end SQL analysis project in BigQuery from raw data to actionable insight.",
          },
        ],
      },
    ],
  },
  {
    id: "11111111-1111-4111-8111-111111111003",
    slug: "data-science-end-to-end",
    title: "Data Science End to End",
    description:
      "Go end-to-end from data sourcing to modeling and interpretation, with hands-on practice and project work.",
    sessions: 17,
    priceLabel: "$1,999",
    priceCompareLabel: "$2,499",
    rating: 4.9,
    reviewCount: 41,
    studentCount: 223,
    level: "beginner",
    outcomes: [
      "Frame an end-to-end data science problem from business context.",
      "Prepare data, train baselines, and evaluate models responsibly.",
      "Communicate trade-offs and next steps to stakeholders.",
    ],
    modules: [
      {
        id: "22222222-2222-4222-8222-222222222021",
        title: "Foundations & Python stack",
        lessons: [
          {
            id: "33333333-3333-4333-8333-333333333021",
            slug: "introduction-to-data-science",
            title: "Introduction to Data Science",
            content:
              "Build a solid foundation of the data science workflow, from problem framing to model delivery.",
          },
          {
            id: "33333333-3333-4333-8333-333333333022",
            slug: "mastering-sql",
            title: "Mastering SQL",
            content:
              "Strengthen SQL skills for analytics, joins, aggregations, and warehouse-scale querying.",
          },
          {
            id: "33333333-3333-4333-8333-333333333023",
            slug: "python-introduction",
            title: "Python Introduction",
            content:
              "Set up Python fundamentals for data work, including syntax, variables, and basic control flow.",
          },
          {
            id: "33333333-3333-4333-8333-333333333024",
            slug: "python-data-types",
            title: "Python Data Types",
            content:
              "Understand lists, dictionaries, tuples, and sets to structure data effectively.",
          },
          {
            id: "33333333-3333-4333-8333-333333333025",
            slug: "pandas-data-processing",
            title: "Pandas Data Processing",
            content:
              "Process tabular datasets with pandas using filtering, transformation, and joining workflows.",
          },
        ],
      },
      {
        id: "22222222-2222-4222-8222-222222222022",
        title: "Data understanding & exploration",
        lessons: [
          {
            id: "33333333-3333-4333-8333-333333333026",
            slug: "statistics",
            title: "Statistics",
            content:
              "Cover key statistical concepts for analysis, inference, and model interpretation.",
          },
          {
            id: "33333333-3333-4333-8333-333333333027",
            slug: "data-cleansing-and-preprocessing",
            title: "Data Cleansing & Preprocessing",
            content:
              "Clean missing, duplicate, and inconsistent data to prepare reliable model-ready inputs.",
          },
          {
            id: "33333333-3333-4333-8333-333333333028",
            slug: "data-visualization",
            title: "Data Visualization",
            content:
              "Visualize trends, distributions, and comparisons to communicate insights clearly.",
          },
          {
            id: "33333333-3333-4333-8333-333333333029",
            slug: "eda",
            title: "EDA",
            content:
              "Perform exploratory data analysis to discover patterns, anomalies, and hypotheses.",
          },
        ],
      },
      {
        id: "22222222-2222-4222-8222-222222222023",
        title: "Machine learning",
        lessons: [
          {
            id: "33333333-3333-4333-8333-333333333030",
            slug: "introduction-to-machine-learning",
            title: "Introduction to Machine Learning",
            content:
              "Learn core machine learning concepts, training flow, and evaluation fundamentals.",
          },
          {
            id: "33333333-3333-4333-8333-333333333031",
            slug: "supervised-learning-regression",
            title: "Supervised Learning - Regression",
            content:
              "Build and evaluate regression models to predict continuous outcomes.",
          },
          {
            id: "33333333-3333-4333-8333-333333333032",
            slug: "supervised-learning-classification",
            title: "Supervised Learning - Classification",
            content:
              "Train classification models and assess performance with suitable metrics.",
          },
          {
            id: "33333333-3333-4333-8333-333333333033",
            slug: "unsupervised-learning",
            title: "Unsupervised Learning",
            content:
              "Apply clustering and dimensionality reduction for unlabeled data exploration.",
          },
          {
            id: "33333333-3333-4333-8333-333333333034",
            slug: "introduction-to-deep-learning",
            title: "Introduction to Deep Learning",
            content:
              "Understand neural network basics and when deep learning is the right approach.",
          },
        ],
      },
      {
        id: "22222222-2222-4222-8222-222222222024",
        title: "Business impact & capstone",
        lessons: [
          {
            id: "33333333-3333-4333-8333-333333333035",
            slug: "business-implementation",
            title: "Business Implementation",
            content:
              "Translate model outputs into business actions, KPIs, and stakeholder decisions.",
          },
          {
            id: "33333333-3333-4333-8333-333333333036",
            slug: "recap-end-to-end-data-science",
            title: "Recap End-to-end Data Science",
            content:
              "Review the full lifecycle from problem framing through deployment-oriented thinking.",
          },
          {
            id: "33333333-3333-4333-8333-333333333037",
            slug: "data-science-final-project",
            title: "Final Project",
            content:
              "Deliver an end-to-end data science project that demonstrates technical and business impact.",
          },
        ],
      },
    ],
  },
];

const lines = [
  "-- Seed recorded LMS courses from the previous hardcoded catalog.",
  "-- Placeholder video_url only (do not upload video files to Supabase Storage).",
  "--",
  "-- Grant yourself access (replace USER_UUID):",
  "--   insert into public.lms_entitlements (user_id, course_id, status)",
  "--   values ('USER_UUID', '11111111-1111-4111-8111-111111111001', 'active')",
  "--   on conflict (user_id, course_id) do update set status = 'active';",
  "",
];

for (const course of courses) {
  lines.push(
    `insert into public.lms_courses (
  id, slug, title, description, status,
  price_label, compare_at_price_label, level, sessions,
  rating, review_count, student_count,
  instructor_name, instructor_credentials, outcomes
) values (
  '${course.id}',
  ${sqlStr(course.slug)},
  ${sqlStr(course.title)},
  ${sqlStr(course.description)},
  'published',
  ${sqlStr(course.priceLabel)},
  ${sqlStr(course.priceCompareLabel)},
  ${sqlStr(course.level)},
  ${course.sessions},
  ${course.rating},
  ${course.reviewCount},
  ${course.studentCount},
  ${sqlStr(INSTRUCTOR.name)},
  ${sqlStr(INSTRUCTOR.credentials)},
  ${sqlStr(JSON.stringify(course.outcomes))}::jsonb
)
on conflict (id) do update set
  slug = excluded.slug,
  title = excluded.title,
  description = excluded.description,
  status = excluded.status,
  price_label = excluded.price_label,
  compare_at_price_label = excluded.compare_at_price_label,
  level = excluded.level,
  sessions = excluded.sessions,
  rating = excluded.rating,
  review_count = excluded.review_count,
  student_count = excluded.student_count,
  instructor_name = excluded.instructor_name,
  instructor_credentials = excluded.instructor_credentials,
  outcomes = excluded.outcomes,
  updated_at = now();`,
    "",
  );

  course.modules.forEach((mod, mi) => {
    lines.push(
      `insert into public.lms_modules (id, course_id, title, sort_order) values (
  '${mod.id}', '${course.id}', ${sqlStr(mod.title)}, ${mi}
)
on conflict (id) do update set
  title = excluded.title,
  sort_order = excluded.sort_order;`,
      "",
    );

    mod.lessons.forEach((lesson, li) => {
      const excerpt = excerptFromLessonContent(lesson.content);
      lines.push(
        `insert into public.lms_lessons (
  id, module_id, slug, title, excerpt, duration_minutes, cover_image_url, sort_order
) values (
  '${lesson.id}',
  '${mod.id}',
  ${sqlStr(lesson.slug)},
  ${sqlStr(lesson.title)},
  ${sqlStr(excerpt)},
  60,
  ${sqlStr(PLACEHOLDER_COVER)},
  ${li}
)
on conflict (id) do update set
  slug = excluded.slug,
  title = excluded.title,
  excerpt = excluded.excerpt,
  duration_minutes = excluded.duration_minutes,
  cover_image_url = excluded.cover_image_url,
  sort_order = excluded.sort_order;`,
        "",
        `insert into public.lms_lesson_media (lesson_id, video_url, content) values (
  '${lesson.id}',
  ${sqlStr(VIDEO)},
  ${sqlDollar(lesson.content)}
)
on conflict (lesson_id) do update set
  video_url = excluded.video_url,
  content = excluded.content;`,
        "",
      );
    });
  });
}

const sql = `${lines.join("\n").trim()}\n`;
const here = dirname(fileURLToPath(import.meta.url));
const lmsPath = join(here, "..", "migrations", "20260818101000_seed_lms_courses.sql");
writeFileSync(lmsPath, sql);
console.log("wrote", lmsPath);
