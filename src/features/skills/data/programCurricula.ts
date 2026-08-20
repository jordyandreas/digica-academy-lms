export type ProgramCurriculumId = "sql" | "da" | "ds";

export type CurriculumPhase = {
  title: string;
  sessionRange: string;
  startSession: number;
  modules: string[];
};

export type ProgramCurriculum = {
  id: ProgramCurriculumId;
  tabLabel: string;
  title: string;
  sessionCount: number;
  sessionLabel: string;
  modules: string[];
  phases?: readonly CurriculumPhase[];
};

export const PROGRAM_CURRICULA: readonly ProgramCurriculum[] = [
  {
    id: "ds",
    tabLabel: "Data Science Bootcamp",
    title: "Data Science Bootcamp",
    sessionCount: 20,
    sessionLabel: "20 live sessions",
    modules: [
      "Introduction to Data Science",
      "Mastering SQL",
      "Python Introduction",
      "Python Data Types",
      "Python Data Processing (Pandas & DataFrame)",
      "Statistics",
      "Data Cleansing & Preprocessing",
      "Data Visualization",
      "EDA (Exploratory Data Analysis)",
      "Introduction to Machine Learning",
      "Supervised Learning - Regression",
      "Supervised Learning - Classification",
      "Unsupervised Learning",
      "Introduction to Deep Learning",
      "Business Implementation & Final Project Brief",
      "Recap End-to-End Data Science",
      "Mentoring - Business, Data Understanding, Data Cleansing, EDA",
      "Mentoring - Modeling & Evaluation (Business Implementation)",
      "Final Project Presentation (Part 1)",
      "Final Project Presentation (Part 2)",
    ],
    phases: [
      {
        title: "Foundations",
        sessionRange: "Sessions 1–5",
        startSession: 1,
        modules: [
          "Introduction to Data Science",
          "Mastering SQL",
          "Python Introduction",
          "Python Data Types",
          "Python Data Processing (Pandas & DataFrame)",
        ],
      },
      {
        title: "Analysis",
        sessionRange: "Sessions 6–9",
        startSession: 6,
        modules: [
          "Statistics",
          "Data Cleansing & Preprocessing",
          "Data Visualization",
          "EDA (Exploratory Data Analysis)",
        ],
      },
      {
        title: "Machine learning",
        sessionRange: "Sessions 10–14",
        startSession: 10,
        modules: [
          "Introduction to Machine Learning",
          "Supervised Learning - Regression",
          "Supervised Learning - Classification",
          "Unsupervised Learning",
          "Introduction to Deep Learning",
        ],
      },
      {
        title: "Capstone",
        sessionRange: "Sessions 15–20",
        startSession: 15,
        modules: [
          "Business Implementation & Final Project Brief",
          "Recap End-to-End Data Science",
          "Mentoring - Business, Data Understanding, Data Cleansing, EDA",
          "Mentoring - Modeling & Evaluation (Business Implementation)",
          "Final Project Presentation (Part 1)",
          "Final Project Presentation (Part 2)",
        ],
      },
    ],
  },
  {
    id: "sql",
    tabLabel: "Mini Bootcamp SQL",
    title: "Mini Bootcamp SQL",
    sessionCount: 6,
    sessionLabel: "6 live sessions",
    modules: [
      "Introduction to Database & BigQuery",
      "Basic Querying in SQL",
      "Intermediate SQL (Aggregation)",
      "Subquery & CTE",
      "Window Functions",
      "Final Project",
    ],
  },
  {
    id: "da",
    tabLabel: "Mini Bootcamp Data Analytics",
    title: "Mini Bootcamp Data Analytics",
    sessionCount: 6,
    sessionLabel: "6 live sessions",
    modules: [
      "Python Introduction",
      "Python Data Types",
      "Data Analysis with Python (Pandas & DataFrame)",
      "Data Analysis with Python (Data Cleansing & Analysis)",
      "Data Visualization with Python",
      "Final Project",
    ],
  },
];

export const DEFAULT_CURRICULUM_ID: ProgramCurriculumId = "ds";

type CurriculumLookup = {
  type: "mini_bootcamp" | "bootcamp" | "workshop";
  title: string;
  slug?: string | null;
};

function curriculumById(id: ProgramCurriculumId): ProgramCurriculum | null {
  return PROGRAM_CURRICULA.find((track) => track.id === id) ?? null;
}

/** Map a public program to a syllabus. Workshops and unmatched names return null. */
export function getCurriculumForProgram(
  input: CurriculumLookup
): ProgramCurriculum | null {
  if (input.type === "workshop") return null;

  const haystack = `${input.title} ${input.slug ?? ""}`.toLowerCase();

  if (haystack.includes("sql")) {
    return curriculumById("sql");
  }
  if (
    haystack.includes("analytics") ||
    haystack.includes("data analyst")
  ) {
    return curriculumById("da");
  }
  if (haystack.includes("data science") || input.type === "bootcamp") {
    return curriculumById("ds");
  }

  return null;
}
