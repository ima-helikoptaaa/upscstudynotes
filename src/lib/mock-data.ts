export type Subject = "GS1" | "GS2" | "GS3" | "GS4" | "Optional" | "CA";
export type PDFType = "notes" | "ncert" | "pyq" | "coaching";
export type Source = "NCERT" | "Coaching" | "PYQ";

export interface PDF {
  id: string;
  title: string;
  subject: Subject;
  source: Source;
  author: string;
  tags: string[];
  summary: string;
  visibility: "public" | "private";
  file_url: string;
  pages: number;
  year: number;
  type: PDFType;
}

export const MOCK_PDFS: PDF[] = [
  {
    id: "1",
    title: "Indian History — Ancient to Medieval",
    subject: "GS1",
    source: "NCERT",
    author: "NCERT",
    tags: ["History", "Ancient India", "Medieval India"],
    summary:
      "Covers Indian history from Harappan civilization through medieval Sultanate and Mughal periods. Includes key dynasties, cultural developments, and administrative systems.",
    visibility: "public",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pages: 312,
    year: 2023,
    type: "ncert",
  },
  {
    id: "2",
    title: "Indian Polity — M. Laxmikant Key Chapters",
    subject: "GS2",
    source: "Coaching",
    author: "Vision IAS",
    tags: ["Polity", "Constitution", "Parliament"],
    summary:
      "Curated notes from Laxmikant covering Constitution, Fundamental Rights, Directive Principles, Parliament structure, and the Union Executive.",
    visibility: "public",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pages: 185,
    year: 2024,
    type: "notes",
  },
  {
    id: "3",
    title: "Geography of India — Physical & Economic",
    subject: "GS1",
    source: "NCERT",
    author: "NCERT",
    tags: ["Geography", "Physical Geography", "Monsoon"],
    summary:
      "Physical features, climate patterns, river systems, and economic geography. Covers monsoon, soil types, forest cover, and mineral distribution.",
    visibility: "public",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pages: 240,
    year: 2023,
    type: "ncert",
  },
  {
    id: "4",
    title: "Indian Economy — Ramesh Singh Condensed",
    subject: "GS3",
    source: "Coaching",
    author: "ForumIAS",
    tags: ["Economy", "GDP", "Fiscal Policy", "LPG Reforms"],
    summary:
      "Macroeconomic fundamentals, Indian economic history post-independence, planning era to LPG reforms, and current economic challenges.",
    visibility: "public",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pages: 220,
    year: 2024,
    type: "notes",
  },
  {
    id: "5",
    title: "UPSC Mains 2023 — GS Paper 1 Q&A",
    subject: "GS1",
    source: "PYQ",
    author: "UPSC",
    tags: ["PYQ", "Mains", "2023"],
    summary:
      "Complete question paper with model answers for UPSC Mains 2023 GS1. Includes examiner insights and high-scoring answer templates.",
    visibility: "public",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pages: 45,
    year: 2023,
    type: "pyq",
  },
  {
    id: "6",
    title: "Environment & Ecology — Complete Notes",
    subject: "GS3",
    source: "Coaching",
    author: "Shankar IAS",
    tags: ["Environment", "Ecology", "Biodiversity", "Climate Change"],
    summary:
      "Biodiversity hotspots, international conventions, climate change frameworks, pollution control, and India's environment policy.",
    visibility: "public",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pages: 195,
    year: 2024,
    type: "notes",
  },
  {
    id: "7",
    title: "Ethics, Integrity & Aptitude — GS4 Notes",
    subject: "GS4",
    source: "Coaching",
    author: "Insights IAS",
    tags: ["Ethics", "Integrity", "Case Studies", "Civil Service"],
    summary:
      "Philosophical underpinnings, attitude, emotional intelligence, and civil service values with solved case studies.",
    visibility: "public",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pages: 280,
    year: 2024,
    type: "notes",
  },
  {
    id: "8",
    title: "Current Affairs — March 2024 Compilation",
    subject: "CA",
    source: "Coaching",
    author: "Drishti IAS",
    tags: ["Current Affairs", "2024", "Monthly"],
    summary:
      "National, international, economy, science & tech, environment, sports, and awards. UPSC-focused analysis with exam significance.",
    visibility: "public",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pages: 90,
    year: 2024,
    type: "notes",
  },
  {
    id: "9",
    title: "Science & Technology — PYQ Compilation",
    subject: "GS3",
    source: "PYQ",
    author: "UPSC",
    tags: ["Science", "Technology", "PYQ", "Space"],
    summary:
      "Compiled S&T questions from UPSC Prelims and Mains (2015–2023). Covers space technology, biotech, nanotechnology, and cybersecurity.",
    visibility: "public",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pages: 65,
    year: 2023,
    type: "pyq",
  },
  {
    id: "10",
    title: "Governance & Social Justice — GS2 Notes",
    subject: "GS2",
    source: "Coaching",
    author: "Vision IAS",
    tags: ["Governance", "Social Justice", "Welfare Schemes"],
    summary:
      "Government schemes, social justice mechanisms, NGO & SHG roles, transparency, accountability, and e-governance initiatives.",
    visibility: "public",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pages: 160,
    year: 2024,
    type: "notes",
  },
  {
    id: "11",
    title: "Modern India — Bipin Chandra Summary",
    subject: "GS1",
    source: "NCERT",
    author: "NCERT",
    tags: ["Modern History", "Freedom Movement", "Colonial Era"],
    summary:
      "Colonial economy, peasant and tribal movements, rise of nationalism, Gandhi era, and India's path to independence.",
    visibility: "public",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pages: 175,
    year: 2023,
    type: "ncert",
  },
  {
    id: "12",
    title: "Internal Security — Comprehensive Notes",
    subject: "GS3",
    source: "Coaching",
    author: "Study IQ",
    tags: ["Internal Security", "LWE", "Cyber Security"],
    summary:
      "India's internal security challenges: left-wing extremism, insurgency, border management, terrorism, and cyber threats.",
    visibility: "public",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pages: 145,
    year: 2024,
    type: "notes",
  },
  {
    id: "13",
    title: "International Relations — GS2 Master Notes",
    subject: "GS2",
    source: "Coaching",
    author: "ForumIAS",
    tags: ["International Relations", "Foreign Policy", "SAARC", "BIMSTEC"],
    summary:
      "India's bilateral relations, multilateral institutions, regional groupings (SAARC, BIMSTEC, SCO), and foreign policy principles.",
    visibility: "public",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pages: 200,
    year: 2024,
    type: "notes",
  },
  {
    id: "14",
    title: "Art & Culture — NCERT + Nitin Singhania",
    subject: "GS1",
    source: "NCERT",
    author: "NCERT",
    tags: ["Art", "Culture", "Heritage", "Architecture"],
    summary:
      "Indian art forms, classical dances, music traditions, temple architecture, painting styles, and UNESCO heritage sites.",
    visibility: "public",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pages: 220,
    year: 2023,
    type: "ncert",
  },
  {
    id: "15",
    title: "UPSC Prelims 2023 — All Papers + Solutions",
    subject: "GS1",
    source: "PYQ",
    author: "UPSC",
    tags: ["Prelims", "PYQ", "2023", "MCQ", "CSAT"],
    summary:
      "Complete Prelims 2023 (GS1 + CSAT) with detailed solutions, elimination techniques, and concept notes for each answer.",
    visibility: "public",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pages: 110,
    year: 2023,
    type: "pyq",
  },
  {
    id: "16",
    title: "Agriculture & Food Security — GS3 Notes",
    subject: "GS3",
    source: "Coaching",
    author: "Drishti IAS",
    tags: ["Agriculture", "Food Security", "MSP", "Irrigation"],
    summary:
      "Agricultural economy, cropping patterns, MSP policy, irrigation systems, food security schemes, FCI, and land reforms.",
    visibility: "public",
    file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pages: 130,
    year: 2024,
    type: "notes",
  },
];

export const SUBJECTS: Subject[] = ["GS1", "GS2", "GS3", "GS4", "Optional", "CA"];
export const SOURCES: Source[] = ["NCERT", "Coaching", "PYQ"];
export const TYPES: PDFType[] = ["notes", "ncert", "pyq", "coaching"];

export const COLLECTIONS = [
  { id: "ncert", label: "NCERT Essentials", subjectFilter: null as Subject | null, sourceFilter: "NCERT" as Source | null },
  { id: "gs1", label: "GS1 — History & Geography", subjectFilter: "GS1" as Subject, sourceFilter: null as Source | null },
  { id: "gs2", label: "GS2 — Polity & IR", subjectFilter: "GS2" as Subject, sourceFilter: null },
  { id: "gs3", label: "GS3 — Economy & Environment", subjectFilter: "GS3" as Subject, sourceFilter: null },
  { id: "gs4", label: "GS4 — Ethics", subjectFilter: "GS4" as Subject, sourceFilter: null },
  { id: "pyq", label: "Previous Year Questions", subjectFilter: null, sourceFilter: "PYQ" as Source },
  { id: "ca", label: "Current Affairs", subjectFilter: "CA" as Subject, sourceFilter: null },
];

export const TRENDING_PDFS = MOCK_PDFS.slice(0, 4);
