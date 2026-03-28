export type SkillStackItem = {
  chipLabel: string;
  /** Shown in the popover header */
  popoverTitle: string;
  popoverBody: string;
  /** Bottom → top: how the stack “builds” for this skill */
  stackLayers: string[];
};

export const SKILL_STACK_ITEMS: SkillStackItem[] = [
  {
    chipLabel: "SQL querying",
    popoverTitle: "Foundation: trustworthy queries",
    popoverBody:
      "Pull data from warehouses and spreadsheets with joins and filters you can explain in a standup.",
    stackLayers: ["Connect to sources", "Filter & join", "Named metrics"],
  },
  {
    chipLabel: "Data cleaning",
    popoverTitle: "Quality before charts",
    popoverBody:
      "Fix nulls, types, and duplicates so downstream dashboards do not lie by accident.",
    stackLayers: ["Profile columns", "Handle nulls", "Validate rules"],
  },
  {
    chipLabel: "Data visualization",
    popoverTitle: "Clarity over decoration",
    popoverBody:
      "Choose chart types and encodings that match the question—not the trendiest palette.",
    stackLayers: ["Pick the chart", "Label honestly", "Highlight the insight"],
  },
  {
    chipLabel: "Dashboard building",
    popoverTitle: "From notebook to daily habit",
    popoverBody:
      "Wire refreshes, permissions, and guardrails so stakeholders trust the numbers every morning.",
    stackLayers: ["Layout & filters", "Refresh & access", "Alerts & caveats"],
  },
  {
    chipLabel: "Real business case studies",
    popoverTitle: "Proof you can ship",
    popoverBody:
      "Tie SQL, cleaning, viz, and dashboards into one narrative tied to a business outcome.",
    stackLayers: ["Define the decision", "Ship the analysis", "Tell the story"],
  },
];
