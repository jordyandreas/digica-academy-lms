import type { Course, Lesson, Module } from "@/lib/types";

const DEFAULT_INSTRUCTOR: NonNullable<Course["instructor"]> = {
  name: "Stephanie",
  credentials: "Lead Data Scientist @JULO | Ex. GOJEK, UNILEVER.",
};

const LESSON_PLACEHOLDER_COVER = "/images/placeholder/placeholder.webp";

const rawCourses: Course[] = [
  {
    id: "1",
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
    instructor: DEFAULT_INSTRUCTOR,
    modules: [
      {
        id: "m-py-fundamentals",
        title: "Python fundamentals",
        lessons: [
          {
            id: "py-da-1",
            slug: "python-introduction",
            title: "Python Introduction",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Get comfortable with Python as a tool for analytics: how to run code, use notebooks or scripts, and read errors with confidence.

**You will cover:**
- Why Python is widely used in data teams
- Environments, packages, and reproducible setups
- Writing small programs that load files and print summaries

Focus on clarity and repetition—speed comes later.
            `.trim(),
            duration: 12,
          },
          {
            id: "py-da-2",
            slug: "python-data-types",
            title: "Python Data Types",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Data analysis in Python leans on a small set of core types. Understanding them prevents subtle bugs later.

**Core ideas:**
- Numbers, strings, booleans, and type conversion
- Lists, tuples, and dictionaries for structured data
- Iteration, comprehensions, and functions for reuse

These building blocks map directly to how pandas represents tables and columns.
            `.trim(),
            duration: 14,
          },
        ],
      },
      {
        id: "m-py-pandas",
        title: "Data analysis with pandas",
        lessons: [
          {
            id: "py-da-3",
            slug: "data-analysis-python-pandas-dataframe",
            title: "Pandas & DataFrame",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Pandas gives you **DataFrames**—tabular data with named columns and rich operations for exploration.

**Skills in this lesson:**
- Loading CSV and inspecting \`shape\`, \`dtypes\`, and \`head()\`
- Selecting columns, filtering rows, and sorting
- Basic aggregates: counts, sums, and grouped summaries

Goal: answer simple business questions directly from the table.
            `.trim(),
            duration: 18,
          },
          {
            id: "py-da-4",
            slug: "data-analysis-python-cleansing-analysis",
            title: "Data Cleansing & Analysis",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Real datasets are messy. Cleansing turns ambiguous inputs into trustworthy metrics.

**Typical tasks:**
- Handling missing values and duplicates
- Parsing dates and normalizing categories
- Feature-ready tables for aggregation and joins

Document assumptions as you clean—your future self (and teammates) will thank you.
            `.trim(),
            duration: 20,
          },
        ],
      },
      {
        id: "m-py-viz-project",
        title: "Visualization & capstone",
        lessons: [
          {
            id: "py-da-5",
            slug: "data-visualization-python",
            title: "Data Visualization with Python",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Visualization helps you spot patterns fast and communicate results without drowning stakeholders in tables.

**Practice:**
- Choosing chart types for comparisons, trends, and distributions
- Labeling axes, titles, and units for clarity
- Iterating from exploratory plots to presentation-ready figures

Keep the story simple: one main message per visual.
            `.trim(),
            duration: 16,
          },
          {
            id: "py-da-6",
            slug: "final-project",
            title: "Final Project",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Bring the course together: load a dataset, clean it, analyze it, and present insights with visuals.

**Deliverable outline:**
- Problem statement and success metrics
- Data dictionary and cleansing notes
- Key findings backed by charts
- Limitations and next steps

Treat this as a portfolio piece you can talk through in an interview.
            `.trim(),
            duration: 24,
          },
        ],
      },
    ],
  },
  {
    id: "2",
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
        id: "m-sql-foundations",
        title: "Foundations & core querying",
        lessons: [
          {
            id: "sql-1",
            slug: "introduction-database-bigquery",
            title: "Introduction to Database & Bigquery",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Get started with core database concepts and how BigQuery works as a cloud data warehouse.
            `.trim(),
            duration: 10,
          },
          {
            id: "sql-2",
            slug: "basic-querying-sql",
            title: "Basic Querying in SQL",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Learn SELECT, WHERE, ORDER BY, and LIMIT to retrieve and filter data accurately.
            `.trim(),
            duration: 12,
          },
        ],
      },
      {
        id: "m-sql-analytics",
        title: "Analytics SQL",
        lessons: [
          {
            id: "sql-3",
            slug: "intermediate-sql-aggregation",
            title: "Intermediate SQL (Aggregation)",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Use GROUP BY with aggregate functions to summarize metrics and answer business questions.
            `.trim(),
            duration: 14,
          },
          {
            id: "sql-4",
            slug: "subquery-and-cte",
            title: "Subquery & CTE",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Break complex SQL into manageable parts with subqueries and common table expressions (CTE).
            `.trim(),
            duration: 14,
          },
          {
            id: "sql-5",
            slug: "window-functions",
            title: "Window Functions",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Apply analytic functions for ranking, running totals, and partition-based calculations.
            `.trim(),
            duration: 16,
          },
        ],
      },
      {
        id: "m-sql-capstone",
        title: "Capstone project",
        lessons: [
          {
            id: "sql-6",
            slug: "sql-final-project",
            title: "Final Project.",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Build an end-to-end SQL analysis project in BigQuery from raw data to actionable insight.
            `.trim(),
            duration: 20,
          },
        ],
      },
    ],
  },
  {
    id: "3",
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
        id: "m-ds-foundations",
        title: "Foundations & Python stack",
        lessons: [
          {
            id: "ds-1",
            slug: "introduction-to-data-science",
            title: "Introduction to Data Science",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Build a solid foundation of the data science workflow, from problem framing to model delivery.
            `.trim(),
            duration: 10,
          },
          {
            id: "ds-2",
            slug: "mastering-sql",
            title: "Mastering SQL",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Strengthen SQL skills for analytics, joins, aggregations, and warehouse-scale querying.
            `.trim(),
            duration: 12,
          },
          {
            id: "ds-3",
            slug: "python-introduction",
            title: "Python Introduction",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Set up Python fundamentals for data work, including syntax, variables, and basic control flow.
            `.trim(),
            duration: 10,
          },
          {
            id: "ds-4",
            slug: "python-data-types",
            title: "Python Data Types",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Understand lists, dictionaries, tuples, and sets to structure data effectively.
            `.trim(),
            duration: 11,
          },
          {
            id: "ds-5",
            slug: "pandas-data-processing",
            title: "Pandas Data Processing",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Process tabular datasets with pandas using filtering, transformation, and joining workflows.
            `.trim(),
            duration: 14,
          },
        ],
      },
      {
        id: "m-ds-understanding",
        title: "Data understanding & exploration",
        lessons: [
          {
            id: "ds-6",
            slug: "statistics",
            title: "Statistics",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Cover key statistical concepts for analysis, inference, and model interpretation.
            `.trim(),
            duration: 13,
          },
          {
            id: "ds-7",
            slug: "data-cleansing-and-preprocessing",
            title: "Data Cleansing & Preprocessing",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Clean missing, duplicate, and inconsistent data to prepare reliable model-ready inputs.
            `.trim(),
            duration: 14,
          },
          {
            id: "ds-8",
            slug: "data-visualization",
            title: "Data Visualization",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Visualize trends, distributions, and comparisons to communicate insights clearly.
            `.trim(),
            duration: 12,
          },
          {
            id: "ds-9",
            slug: "eda",
            title: "EDA",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Perform exploratory data analysis to discover patterns, anomalies, and hypotheses.
            `.trim(),
            duration: 12,
          },
        ],
      },
      {
        id: "m-ds-ml",
        title: "Machine learning",
        lessons: [
          {
            id: "ds-10",
            slug: "introduction-to-machine-learning",
            title: "Introduction to Machine Learning",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Learn core machine learning concepts, training flow, and evaluation fundamentals.
            `.trim(),
            duration: 12,
          },
          {
            id: "ds-11",
            slug: "supervised-learning-regression",
            title: "Supervised Learning - Regression",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Build and evaluate regression models to predict continuous outcomes.
            `.trim(),
            duration: 14,
          },
          {
            id: "ds-12",
            slug: "supervised-learning-classification",
            title: "Supervised Learning - Classification",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Train classification models and assess performance with suitable metrics.
            `.trim(),
            duration: 14,
          },
          {
            id: "ds-13",
            slug: "unsupervised-learning",
            title: "Unsupervised Learning",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Apply clustering and dimensionality reduction for unlabeled data exploration.
            `.trim(),
            duration: 13,
          },
          {
            id: "ds-14",
            slug: "introduction-to-deep-learning",
            title: "Introduction to Deep Learning",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Understand neural network basics and when deep learning is the right approach.
            `.trim(),
            duration: 13,
          },
        ],
      },
      {
        id: "m-ds-delivery",
        title: "Business impact & capstone",
        lessons: [
          {
            id: "ds-15",
            slug: "business-implementation",
            title: "Business Implementation",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Translate model outputs into business actions, KPIs, and stakeholder decisions.
            `.trim(),
            duration: 11,
          },
          {
            id: "ds-16",
            slug: "recap-end-to-end-data-science",
            title: "Recap End-to-end Data Science",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Review the full lifecycle from problem framing through deployment-oriented thinking.
            `.trim(),
            duration: 10,
          },
          {
            id: "ds-17",
            slug: "data-science-final-project",
            title: "Final Project",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            content: `
Deliver an end-to-end data science project that demonstrates technical and business impact.
            `.trim(),
            duration: 20,
          },
        ],
      },
    ],
  },
];

export const courses: Course[] = rawCourses.map((course) => ({
  ...course,
  instructor: DEFAULT_INSTRUCTOR,
  modules: course.modules.map((courseModule) => ({
    ...courseModule,
    lessons: courseModule.lessons.map((lesson) => ({
      ...lesson,
      duration: 60,
      coverImage: LESSON_PLACEHOLDER_COVER,
    })),
  })),
}));

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getLessonBySlug(
  course: Course,
  lessonSlug: string
): { lesson: Lesson; module: Module } | undefined {
  for (const courseModule of course.modules) {
    const lesson = courseModule.lessons.find((l) => l.slug === lessonSlug);
    if (lesson) return { lesson, module: courseModule };
  }
  return undefined;
}

export function getLessonLocationByLessonId(lessonId: string):
  | {
      courseSlug: string;
      lessonSlug: string;
      courseTitle: string;
      lessonTitle: string;
    }
  | undefined {
  for (const course of courses) {
    for (const courseModule of course.modules) {
      const lesson = courseModule.lessons.find((l) => l.id === lessonId);
      if (lesson) {
        return {
          courseSlug: course.slug,
          lessonSlug: lesson.slug,
          courseTitle: course.title,
          lessonTitle: lesson.title,
        };
      }
    }
  }
  return undefined;
}

/** First lesson in course order that is not in `completedIds`, if any. */
export function getFirstIncompleteLesson(
  courseSlug: string,
  completedIds: Set<string>
): { lessonSlug: string; lessonTitle: string } | undefined {
  const course = getCourseBySlug(courseSlug);
  if (!course) return undefined;
  for (const courseModule of course.modules) {
    for (const lesson of courseModule.lessons) {
      if (!completedIds.has(lesson.id)) {
        return { lessonSlug: lesson.slug, lessonTitle: lesson.title };
      }
    }
  }
  return undefined;
}
