export type Subject = "GS1" | "GS2" | "GS3" | "GS4" | "Multi" | "CSAT" | "Optionals" | "Essay";
export type PDFType = "notes" | "ncert" | "pyq" | "coaching" | "quick_revision" | "current_affairs";
export type Source = string;

export interface PDF {
  id: string;
  title: string;
  subject: string;
  source: string;
  author: string;
  tags: string[];
  summary: string;
  visibility: "public" | "private";
  file_url: string;
  pages: number;
  year: number;
  type: string;
  downloads: number;
  saves: number;
  gsPaper?: string;
  contentType?: string;
  collection?: string | null;
  flashcardCount?: number;
}

export const MOCK_PDFS: PDF[] = [];

export const SUBJECTS: string[] = ["GS1", "GS2", "GS3", "GS4", "Multi", "CSAT"];

export const SOURCES: string[] = [
  "Vision IAS",
  "NextIAS",
  "PMF IAS",
  "Unacademy",
  "Vajiram",
  "Mrunal",
  "PWONLYias",
  "Atish Mathur",
  "UPSC Planner",
  "SuperKalam",
  "Saarthi",
  "Sunya",
  "UPSCPrep.com",
  "IAS Mentor_s Circle",
  "Government Docs",
  "Misc",
];

export const TYPES: string[] = ["notes", "quick_revision", "current_affairs", "pyq", "coaching"];

export interface CollectionDef {
  id: string;
  label: string;
  subjectFilter: string | null;
  sourceFilter: string | null;
}

export const COLLECTIONS: CollectionDef[] = [
  { id: "gs1",   label: "GS1 - History & Geography", subjectFilter: "GS1",  sourceFilter: null },
  { id: "gs2",   label: "GS2 - Polity & IR",         subjectFilter: "GS2",  sourceFilter: null },
  { id: "gs3",   label: "GS3 - Economy & Env",        subjectFilter: "GS3",  sourceFilter: null },
  { id: "gs4",   label: "GS4 - Ethics",               subjectFilter: "GS4",  sourceFilter: null },
  { id: "multi", label: "Multi-Subject",               subjectFilter: "Multi", sourceFilter: null },
  { id: "csat",  label: "CSAT",                        subjectFilter: "CSAT", sourceFilter: null },
];

export const ALL_COLLECTIONS: CollectionDef[] = [
  ...COLLECTIONS,
];

export const TRENDING_PDFS: PDF[] = [];

export const COACHING_SOURCES: string[] = [
  "Vision IAS",
  "NextIAS",
  "PMF IAS",
  "Unacademy",
  "Vajiram",
  "Mrunal",
];

export const SOURCE_LABEL: Record<string, string> = {
  "Vision IAS": "Vision IAS",
  "NextIAS": "Next IAS",
  "PMF IAS": "PMF IAS",
  "Unacademy": "Unacademy",
  "Vajiram": "Vajiram & Ravi",
  "Mrunal": "Mrunal",
  "PWONLYias": "PW Only IAS",
  "Atish Mathur": "Atish Mathur",
  "UPSC Planner": "UPSC Planner",
  "SuperKalam": "Super Kalam",
  "Saarthi": "Saarthi IAS",
  "Sunya": "Sunya IAS",
  "UPSCPrep.com": "UPSC Prep",
  "IAS Mentor_s Circle": "IAS Mentor's Circle",
  "Government Docs": "Government Docs",
  "Misc": "Misc",
};
