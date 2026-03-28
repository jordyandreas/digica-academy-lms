export type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  highlight: string;
  quote: string;
  /** Extended story shown on the detail page */
  storyParagraphs: string[];
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "aulia",
    name: "Aulia",
    role: "Product Analyst",
    company: "CodeLine",
    highlight: "Rated #1 in data platform tech",
    quote:
      "Our dynamic educational platform gave me the tools and support to turn messy, real-world data into clear decisions for my team.",
    storyParagraphs: [
      "When I joined CodeLine, I was comfortable with spreadsheets but nervous about owning metrics end to end. Digica Academy’s projects mirrored how we actually work: unclear requirements, messy exports, and stakeholders who want a number they can trust by Friday.",
      "The platform didn’t just teach SQL and visualization—it forced me to document assumptions, sanity-check joins, and explain trade-offs in plain language. That’s what moved me from “running queries” to influencing product decisions.",
      "Today I partner with PMs and engineers on experiment design and dashboards that leadership opens every morning. The messy data is still there; the difference is I know how to tame it and tell the story behind it.",
    ],
  },
  {
    id: "rama",
    name: "Rama",
    role: "Junior Data Scientist",
    company: "InsightWorks",
    highlight: "Built dashboards stakeholders love",
    quote:
      "The hands-on projects felt like real assignments from my manager. I now ship dashboards that leadership actually uses every week.",
    storyParagraphs: [
      "I came from a bootcamp background where notebooks were king and stakeholders were an afterthought. Digica Academy flipped that: every module assumed you’d have to defend your chart to someone who doesn’t care about your model.",
      "I rebuilt a retention dashboard twice—not because the code was wrong, but because the first version answered my curiosity, not the exec’s question. That feedback loop is what made the work feel like InsightWorks, not a classroom.",
      "My manager now routes new visualization requests through me because the dashboards load fast, the definitions are documented, and the narrative matches what we agreed in standup. That’s the bar I was aiming for.",
    ],
  },
  {
    id: "sarah",
    name: "Sarah",
    role: "Career Switcher into Data",
    company: "Northbridge Labs",
    highlight: "From zero to confident in SQL",
    quote:
      "I went from being intimidated by data tools to confidently exploring datasets and presenting insights to non-technical colleagues.",
    storyParagraphs: [
      "I switched careers from operations and spent months feeling like I was “pretending” every time someone said pivot table. Digica Academy started small—filtering, grouping, then layering—so I could build muscle memory without drowning in theory.",
      "The turning point was presenting a cohort analysis to our marketing lead. I didn’t hide behind jargon; I walked through the query logic in simple steps and showed where the data was thin. That honesty landed better than any perfect chart.",
      "Northbridge hired me into a hybrid role because I could translate between data and team leads. Confidence didn’t come from knowing every function—it came from knowing how to explore safely and communicate what I found.",
    ],
  },
];

export function getTestimonialById(id: string): Testimonial | undefined {
  return TESTIMONIALS.find((t) => t.id === id);
}

export function getAllTestimonialIds(): string[] {
  return TESTIMONIALS.map((t) => t.id);
}
