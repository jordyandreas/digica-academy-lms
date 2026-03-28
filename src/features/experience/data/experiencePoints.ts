export type ExperiencePoint = {
  id: string;
  title: string;
  description: string;
  detailParagraphs: string[];
};

export const EXPERIENCE_POINTS: ExperiencePoint[] = [
  {
    id: "project-based-learning",
    title: "Project-based learning",
    description:
      "Every module ends with a concrete deliverable – dashboards, analyses, and case studies you can show to hiring managers.",
    detailParagraphs: [
      "We structure learning around outputs, not chapter counts. Each milestone produces something you can drop into a portfolio folder or walk through in an interview: a cleaned dataset, a notebook with assumptions spelled out, or a deck that tells the story behind the numbers.",
      "Rubrics mirror what reviewers actually look for: clarity of question, rigor of method, and honesty about limitations. You are not graded on memorizing syntax—you are evaluated on whether someone else could reproduce or extend your work next quarter.",
      "When you finish a track, you leave with artifacts and talking points, not just a certificate. That is the bar we hold for “project-based” at Digica Academy.",
    ],
  },
  {
    id: "mentor-feedback",
    title: "Mentor feedback",
    description:
      "Get direct feedback on your work from practitioners who ship real products, not just record video courses.",
    detailParagraphs: [
      "Feedback comes from people who spend their weeks in standups, stakeholder reviews, and production incidents—not actors reading a script. They comment on how you frame the problem, defend trade-offs, and revise after pushback.",
      "Sessions are async-friendly: you submit your deliverable, get structured notes, and optionally book a short live review when you are stuck. The goal is momentum, not perfection on the first try.",
      "We cap mentor ratios so responses stay thoughtful. You are not shouting into a forum; you are getting signal you can act on before the next milestone.",
    ],
  },
  {
    id: "industry-driven-curriculum",
    title: "Industry-driven curriculum",
    description:
      "Content is shaped by real interview questions, on-the-job tasks, and patterns from modern data teams.",
    detailParagraphs: [
      "Modules are refreshed against what hiring managers ask in screens, what PMs expect in weekly metrics reviews, and what breaks when pipelines move from notebook to production.",
      "You will see the same messy edges that appear in real data: ambiguous labels, shifting definitions, and stakeholders who change the question mid-quarter. The drills are compressed, but the dynamics are honest.",
      "We publish learning objectives tied to observable skills so you always know why a lesson exists and how it maps to the next role you are targeting.",
    ],
  },
];

export function getExperiencePointById(id: string): ExperiencePoint | undefined {
  return EXPERIENCE_POINTS.find((p) => p.id === id);
}

export function getAllExperiencePointIds(): string[] {
  return EXPERIENCE_POINTS.map((p) => p.id);
}

export function getExperiencePointIndex(id: string): number {
  return EXPERIENCE_POINTS.findIndex((p) => p.id === id);
}
