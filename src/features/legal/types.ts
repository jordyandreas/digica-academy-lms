export type LegalSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LegalDocumentContent = {
  title: string;
  eyebrow: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
};
