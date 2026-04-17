export type Subject = "GS1" | "GS2" | "GS3" | "GS4" | "CSAT" | "Optionals" | "Essay";
export type PDFType = "notes" | "ncert" | "pyq" | "coaching";
export type Source =
  | "VisionIAS"
  | "ForumIAS"
  | "DrishtiIAS"
  | "ShankarIAS"
  | "InsightsIAS"
  | "StudyIQ"
  | "NCERT"
  | "PYQ";

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
  downloads: number;
  saves: number;
}

/* Rotate 3 real local PDFs across all mock entries */
const PDF_CA       = "/pdfs/current-affairs.pdf";
const PDF_MAINS    = "/pdfs/mains-timetable.pdf";
const PDF_PRELIMS  = "/pdfs/prelims-timetable.pdf";

const PDFS = [PDF_CA, PDF_MAINS, PDF_PRELIMS];
let _pdfIdx = 0;
const nextPdf = () => PDFS[_pdfIdx++ % PDFS.length];

export const MOCK_PDFS: PDF[] = [
  /* ── NCERT ────────────────────────────────────────────────── */
  {
    id: "n1",
    title: "Indian History - Ancient to Medieval",
    subject: "GS1", source: "NCERT", author: "NCERT",
    tags: ["History", "Ancient India", "Medieval India"],
    summary: "Harappan civilization through the Mughal period. Key dynasties, cultural developments, and administrative systems.",
    visibility: "public", file_url: nextPdf(), pages: 312, year: 2023, type: "ncert",
    downloads: 18400, saves: 5200,
  },
  {
    id: "n2",
    title: "Geography of India - Physical & Economic",
    subject: "GS1", source: "NCERT", author: "NCERT",
    tags: ["Geography", "Physical Geography", "Monsoon"],
    summary: "Physical features, climate patterns, river systems, and economic geography including monsoon and mineral distribution.",
    visibility: "public", file_url: nextPdf(), pages: 240, year: 2023, type: "ncert",
    downloads: 15600, saves: 4100,
  },
  {
    id: "n3",
    title: "Modern India - Freedom Movement",
    subject: "GS1", source: "NCERT", author: "NCERT",
    tags: ["Modern History", "Freedom Movement", "Colonial Era"],
    summary: "Colonial economy, peasant movements, rise of nationalism, Gandhi era, and India's path to independence.",
    visibility: "public", file_url: nextPdf(), pages: 175, year: 2023, type: "ncert",
    downloads: 14200, saves: 3800,
  },
  {
    id: "n4",
    title: "Art & Culture - NCERT Compilation",
    subject: "GS1", source: "NCERT", author: "NCERT",
    tags: ["Art", "Culture", "Heritage", "Architecture"],
    summary: "Indian art forms, classical dances, music traditions, temple architecture, and UNESCO heritage sites.",
    visibility: "public", file_url: nextPdf(), pages: 220, year: 2023, type: "ncert",
    downloads: 11900, saves: 3400,
  },
  {
    id: "n5",
    title: "Indian Economy - Class XI & XII",
    subject: "GS3", source: "NCERT", author: "NCERT",
    tags: ["Economy", "Development", "Planning"],
    summary: "Development economics, planning, poverty, infrastructure, and globalization as per NCERT curriculum.",
    visibility: "public", file_url: nextPdf(), pages: 195, year: 2024, type: "ncert",
    downloads: 10800, saves: 2900,
  },
  {
    id: "n6",
    title: "Political Science - Constitution at Work",
    subject: "GS2", source: "NCERT", author: "NCERT",
    tags: ["Polity", "Constitution", "Fundamental Rights"],
    summary: "Constitutional provisions, fundamental rights, DPSP, federalism, elections, and political institutions.",
    visibility: "public", file_url: nextPdf(), pages: 265, year: 2024, type: "ncert",
    downloads: 13500, saves: 4500,
  },

  /* ── Vision IAS ───────────────────────────────────────────── */
  {
    id: "v1",
    title: "Indian Polity - Laxmikant Key Chapters",
    subject: "GS2", source: "VisionIAS", author: "VisionIAS",
    tags: ["Polity", "Constitution", "Parliament"],
    summary: "Curated notes covering Constitution, Fundamental Rights, DPSP, Parliament structure, and the Union Executive.",
    visibility: "public", file_url: nextPdf(), pages: 185, year: 2024, type: "notes",
    downloads: 24300, saves: 7100,
  },
  {
    id: "v2",
    title: "Governance & Social Justice - GS2 Notes",
    subject: "GS2", source: "VisionIAS", author: "VisionIAS",
    tags: ["Governance", "Social Justice", "Welfare Schemes"],
    summary: "Government schemes, transparency, accountability, social justice mechanisms, and e-governance initiatives.",
    visibility: "public", file_url: nextPdf(), pages: 160, year: 2024, type: "notes",
    downloads: 17600, saves: 5300,
  },
  {
    id: "v3",
    title: "Current Affairs - Vision PT 365",
    subject: "GS2", source: "VisionIAS", author: "VisionIAS",
    tags: ["Current Affairs", "PT 365", "2024"],
    summary: "Prelims-focused current affairs compilation covering polity, economy, science, and international affairs.",
    visibility: "public", file_url: nextPdf(), pages: 480, year: 2024, type: "coaching",
    downloads: 32800, saves: 9400,
  },
  {
    id: "v4",
    title: "Ethics - GS4 Comprehensive Notes",
    subject: "GS4", source: "VisionIAS", author: "VisionIAS",
    tags: ["Ethics", "Integrity", "Aptitude"],
    summary: "Philosophical underpinnings, emotional intelligence, civil service values, and solved case studies.",
    visibility: "public", file_url: nextPdf(), pages: 280, year: 2024, type: "notes",
    downloads: 19100, saves: 5800,
  },
  {
    id: "v5",
    title: "International Relations - Master Notes",
    subject: "GS2", source: "VisionIAS", author: "VisionIAS",
    tags: ["International Relations", "Foreign Policy", "SAARC"],
    summary: "India's bilateral relations, multilateral institutions, regional groupings, and foreign policy principles.",
    visibility: "public", file_url: nextPdf(), pages: 200, year: 2024, type: "notes",
    downloads: 16400, saves: 4700,
  },
  {
    id: "v6",
    title: "Society & Social Justice - GS1 Notes",
    subject: "GS1", source: "VisionIAS", author: "VisionIAS",
    tags: ["Society", "Caste", "Tribes", "Women"],
    summary: "Salient features of Indian society, diversity, poverty, women empowerment, and social justice issues.",
    visibility: "public", file_url: nextPdf(), pages: 150, year: 2024, type: "notes",
    downloads: 12800, saves: 3600,
  },

  /* ── Forum IAS ─────────────────────────────────────────────── */
  {
    id: "f1",
    title: "Indian Economy - Ramesh Singh Condensed",
    subject: "GS3", source: "ForumIAS", author: "ForumIAS",
    tags: ["Economy", "GDP", "Fiscal Policy", "LPG Reforms"],
    summary: "Macroeconomic fundamentals, Indian economic history post-independence, and current economic challenges.",
    visibility: "public", file_url: nextPdf(), pages: 220, year: 2024, type: "notes",
    downloads: 21500, saves: 6400,
  },
  {
    id: "f2",
    title: "Internal Security - Comprehensive Notes",
    subject: "GS3", source: "ForumIAS", author: "ForumIAS",
    tags: ["Internal Security", "LWE", "Cyber Security"],
    summary: "India's internal security challenges: left-wing extremism, insurgency, border management, and cyber threats.",
    visibility: "public", file_url: nextPdf(), pages: 145, year: 2024, type: "notes",
    downloads: 14700, saves: 4200,
  },
  {
    id: "f3",
    title: "ForumIAS Economy Advanced - GS3",
    subject: "GS3", source: "ForumIAS", author: "ForumIAS",
    tags: ["Banking", "Monetary Policy", "RBI", "SEBI"],
    summary: "Banking system, RBI policy, capital markets, SEBI regulations, and financial sector reforms.",
    visibility: "public", file_url: nextPdf(), pages: 175, year: 2024, type: "notes",
    downloads: 13900, saves: 3900,
  },
  {
    id: "f4",
    title: "Modern Indian History - In-depth Notes",
    subject: "GS1", source: "ForumIAS", author: "ForumIAS",
    tags: ["Modern History", "1857", "Gandhi", "Nehru"],
    summary: "Post-1857 freedom struggle, political formations, partition, and India's constitutional evolution.",
    visibility: "public", file_url: nextPdf(), pages: 210, year: 2024, type: "notes",
    downloads: 16800, saves: 4900,
  },
  {
    id: "f5",
    title: "Science & Technology - PYQ Analysis",
    subject: "GS3", source: "ForumIAS", author: "ForumIAS",
    tags: ["Science", "Technology", "Space", "AI"],
    summary: "Key S&T themes for UPSC including space, biotech, AI, nano-technology, and defence technology.",
    visibility: "public", file_url: nextPdf(), pages: 130, year: 2024, type: "notes",
    downloads: 18200, saves: 5400,
  },
  {
    id: "f6",
    title: "Disaster Management - GS3 Compact",
    subject: "GS3", source: "ForumIAS", author: "ForumIAS",
    tags: ["Disaster Management", "NDMA", "Resilience"],
    summary: "Disaster types, NDMA framework, NDRF, international conventions, and India's DM policy.",
    visibility: "public", file_url: nextPdf(), pages: 90, year: 2024, type: "notes",
    downloads: 11300, saves: 3200,
  },

  /* ── Drishti IAS ───────────────────────────────────────────── */
  {
    id: "d1",
    title: "Current Affairs - March 2024 Compilation",
    subject: "GS3", source: "DrishtiIAS", author: "DrishtiIAS",
    tags: ["Current Affairs", "2024", "Monthly"],
    summary: "National, international, economy, science & tech, environment, sports, and awards with UPSC focus.",
    visibility: "public", file_url: nextPdf(), pages: 90, year: 2024, type: "coaching",
    downloads: 27600, saves: 7800,
  },
  {
    id: "d2",
    title: "Agriculture & Food Security - GS3 Notes",
    subject: "GS3", source: "DrishtiIAS", author: "DrishtiIAS",
    tags: ["Agriculture", "Food Security", "MSP", "Irrigation"],
    summary: "Agricultural economy, cropping patterns, MSP policy, irrigation systems, food security schemes.",
    visibility: "public", file_url: nextPdf(), pages: 130, year: 2024, type: "notes",
    downloads: 15200, saves: 4400,
  },
  {
    id: "d3",
    title: "Drishti Monthly - April 2024",
    subject: "GS3", source: "DrishtiIAS", author: "DrishtiIAS",
    tags: ["Current Affairs", "April 2024"],
    summary: "April 2024 current affairs: geopolitics, economy, science, sports, and important government schemes.",
    visibility: "public", file_url: nextPdf(), pages: 95, year: 2024, type: "coaching",
    downloads: 24900, saves: 7100,
  },
  {
    id: "d4",
    title: "Indian Geography - Complete Notes",
    subject: "GS1", source: "DrishtiIAS", author: "DrishtiIAS",
    tags: ["Geography", "Drainage", "Climate", "Soils"],
    summary: "Physical, human, and economic geography covering drainage systems, climate, soils, and economic activities.",
    visibility: "public", file_url: nextPdf(), pages: 280, year: 2024, type: "notes",
    downloads: 18700, saves: 5600,
  },
  {
    id: "d5",
    title: "Indian Polity - Quick Revision",
    subject: "GS2", source: "DrishtiIAS", author: "DrishtiIAS",
    tags: ["Polity", "Quick Revision", "Prelims"],
    summary: "Concise polity notes for Prelims revision covering constitution, bodies, acts, and key judgments.",
    visibility: "public", file_url: nextPdf(), pages: 120, year: 2024, type: "notes",
    downloads: 22400, saves: 6500,
  },
  {
    id: "d6",
    title: "Environment - Shankar IAS Style Notes",
    subject: "GS3", source: "DrishtiIAS", author: "DrishtiIAS",
    tags: ["Environment", "Ecology", "Climate Change"],
    summary: "Biodiversity, conventions, climate frameworks, pollution control, and India's environment policy.",
    visibility: "public", file_url: nextPdf(), pages: 195, year: 2024, type: "notes",
    downloads: 19600, saves: 5900,
  },

  /* ── Shankar IAS ───────────────────────────────────────────── */
  {
    id: "s1",
    title: "Environment & Ecology - Complete Notes",
    subject: "GS3", source: "ShankarIAS", author: "ShankarIAS",
    tags: ["Environment", "Ecology", "Biodiversity"],
    summary: "Biodiversity hotspots, international conventions, climate change frameworks, and pollution control.",
    visibility: "public", file_url: nextPdf(), pages: 195, year: 2024, type: "notes",
    downloads: 29400, saves: 8700,
  },
  {
    id: "s2",
    title: "Shankar Environment - GS3 Supplementary",
    subject: "GS3", source: "ShankarIAS", author: "ShankarIAS",
    tags: ["Forests", "Wildlife", "Protected Areas"],
    summary: "Forest types, wildlife sanctuaries, National Parks, Biosphere Reserves, and conservation strategies.",
    visibility: "public", file_url: nextPdf(), pages: 110, year: 2024, type: "notes",
    downloads: 17800, saves: 5200,
  },
  {
    id: "s3",
    title: "Climate Change & Energy - Policy Notes",
    subject: "GS3", source: "ShankarIAS", author: "ShankarIAS",
    tags: ["Climate Change", "Paris Agreement", "Renewable Energy"],
    summary: "Paris Agreement, India's NDC, renewable energy targets, and green hydrogen policy.",
    visibility: "public", file_url: nextPdf(), pages: 85, year: 2024, type: "notes",
    downloads: 15100, saves: 4400,
  },
  {
    id: "s4",
    title: "Disaster Risk Reduction - Sendai Framework",
    subject: "GS3", source: "ShankarIAS", author: "ShankarIAS",
    tags: ["Disaster", "Sendai", "NDMA", "Risk"],
    summary: "Sendai Framework, NDMA guidelines, disaster-resilient infrastructure, and early warning systems.",
    visibility: "public", file_url: nextPdf(), pages: 75, year: 2024, type: "notes",
    downloads: 11200, saves: 3100,
  },
  {
    id: "s5",
    title: "Environmental Laws - Acts & Conventions",
    subject: "GS3", source: "ShankarIAS", author: "ShankarIAS",
    tags: ["Environmental Law", "EPA", "Wildlife Act"],
    summary: "Environment Protection Act, Wildlife Protection Act, Forest Rights Act, and major international conventions.",
    visibility: "public", file_url: nextPdf(), pages: 95, year: 2024, type: "notes",
    downloads: 12900, saves: 3700,
  },

  /* ── PYQ ───────────────────────────────────────────────────── */
  {
    id: "p1",
    title: "UPSC Mains 2023 - GS1 Q&A with Model Answers",
    subject: "GS1", source: "PYQ", author: "UPSC",
    tags: ["PYQ", "Mains", "2023", "GS1"],
    summary: "Complete question paper with model answers for UPSC Mains 2023 GS1 with examiner insights.",
    visibility: "public", file_url: nextPdf(), pages: 45, year: 2023, type: "pyq",
    downloads: 38600, saves: 11200,
  },
  {
    id: "p2",
    title: "Science & Technology - PYQ 2015–2023",
    subject: "GS3", source: "PYQ", author: "UPSC",
    tags: ["Science", "Technology", "PYQ", "Space"],
    summary: "Compiled S&T questions from UPSC Prelims and Mains 2015–2023. Space, biotech, AI, cybersecurity.",
    visibility: "public", file_url: nextPdf(), pages: 65, year: 2023, type: "pyq",
    downloads: 22400, saves: 6800,
  },
  {
    id: "p3",
    title: "UPSC Prelims 2023 - All Papers + Solutions",
    subject: "GS1", source: "PYQ", author: "UPSC",
    tags: ["Prelims", "PYQ", "2023", "MCQ", "CSAT"],
    summary: "Complete Prelims 2023 (GS1 + CSAT) with detailed solutions and concept notes for each answer.",
    visibility: "public", file_url: nextPdf(), pages: 110, year: 2023, type: "pyq",
    downloads: 45200, saves: 13400,
  },
  {
    id: "p4",
    title: "Mains 2022 - GS2 + GS3 with Analysis",
    subject: "GS2", source: "PYQ", author: "UPSC",
    tags: ["PYQ", "Mains 2022", "GS2", "GS3"],
    summary: "GS2 and GS3 Mains 2022 papers with answer frameworks, important keywords, and model answers.",
    visibility: "public", file_url: nextPdf(), pages: 90, year: 2022, type: "pyq",
    downloads: 31800, saves: 9200,
  },
  {
    id: "p5",
    title: "Essay PYQ Compilation - 2010 to 2023",
    subject: "Essay", source: "PYQ", author: "UPSC",
    tags: ["Essay", "PYQ", "Writing", "Mains"],
    summary: "All UPSC Mains essay questions from 2010–2023 with toppers' approaches and structure templates.",
    visibility: "public", file_url: nextPdf(), pages: 55, year: 2023, type: "pyq",
    downloads: 28700, saves: 8100,
  },
  {
    id: "p6",
    title: "Ethics Case Studies - PYQ 2015–2023",
    subject: "GS4", source: "PYQ", author: "UPSC",
    tags: ["Ethics", "Case Studies", "GS4", "PYQ"],
    summary: "All GS4 ethics and case study questions from 2015–2023 Mains with model answers and evaluation tips.",
    visibility: "public", file_url: nextPdf(), pages: 80, year: 2023, type: "pyq",
    downloads: 26100, saves: 7600,
  },

  /* ── Insights IAS ──────────────────────────────────────────── */
  {
    id: "i1",
    title: "Ethics, Integrity & Aptitude - GS4 Notes",
    subject: "GS4", source: "InsightsIAS", author: "InsightsIAS",
    tags: ["Ethics", "Integrity", "Case Studies", "Civil Service"],
    summary: "Philosophical underpinnings, attitude, EI, and civil service values with solved case studies.",
    visibility: "public", file_url: nextPdf(), pages: 280, year: 2024, type: "notes",
    downloads: 21300, saves: 6400,
  },
  {
    id: "i2",
    title: "Insights Secure - GS Mains Questions 2024",
    subject: "GS2", source: "InsightsIAS", author: "InsightsIAS",
    tags: ["Mains", "Practice Questions", "GS2", "2024"],
    summary: "Curated GS2 Mains practice questions with hints, answer structure, and relevant examples.",
    visibility: "public", file_url: nextPdf(), pages: 160, year: 2024, type: "coaching",
    downloads: 16700, saves: 4800,
  },
  {
    id: "i3",
    title: "GS4 Case Studies - Model Answers",
    subject: "GS4", source: "InsightsIAS", author: "InsightsIAS",
    tags: ["Ethics", "Case Studies", "Model Answers"],
    summary: "30 GS4 case studies with complete model answers demonstrating ethical decision-making frameworks.",
    visibility: "public", file_url: nextPdf(), pages: 120, year: 2024, type: "coaching",
    downloads: 19400, saves: 5700,
  },
  {
    id: "i4",
    title: "Prelims Test Series - Polity & Governance",
    subject: "GS2", source: "InsightsIAS", author: "InsightsIAS",
    tags: ["Prelims", "Test Series", "Polity", "MCQ"],
    summary: "500 MCQs on Polity and Governance with detailed explanations for UPSC Prelims 2024.",
    visibility: "public", file_url: nextPdf(), pages: 95, year: 2024, type: "coaching",
    downloads: 23800, saves: 7200,
  },
  {
    id: "i5",
    title: "Society & Social Issues - GS1 Notes",
    subject: "GS1", source: "InsightsIAS", author: "InsightsIAS",
    tags: ["Society", "Social Issues", "Welfare"],
    summary: "Indian society, demographic dividend, population challenges, migration, and social welfare programmes.",
    visibility: "public", file_url: nextPdf(), pages: 140, year: 2024, type: "notes",
    downloads: 13600, saves: 3900,
  },
  {
    id: "cs1",
    title: "CSAT Paper 2 - Comprehension & Reasoning",
    subject: "CSAT", source: "StudyIQ", author: "StudyIQ",
    tags: ["CSAT", "Reasoning", "Comprehension", "Prelims"],
    summary: "Complete CSAT preparation covering reading comprehension, logical reasoning, basic numeracy, and data interpretation with 800+ practice questions.",
    visibility: "public", file_url: nextPdf(), pages: 310, year: 2024, type: "coaching",
    downloads: 18400, saves: 5200,
  },
  {
    id: "cs2",
    title: "CSAT Solved Papers 2011–2023",
    subject: "CSAT", source: "PYQ", author: "UPSC",
    tags: ["CSAT", "PYQ", "Prelims", "Solved"],
    summary: "All CSAT Prelims Paper 2 questions from 2011 to 2023 with detailed solutions, difficulty ratings, and topic-wise analysis.",
    visibility: "public", file_url: nextPdf(), pages: 220, year: 2023, type: "pyq",
    downloads: 22100, saves: 6300,
  },
  {
    id: "o1",
    title: "PSIR Optional - International Relations",
    subject: "Optionals", source: "VisionIAS", author: "VisionIAS",
    tags: ["PSIR", "Optional", "IR", "Political Science"],
    summary: "Political Science & IR optional complete notes covering theories of IR, India's foreign policy, international institutions, and global political economy.",
    visibility: "public", file_url: nextPdf(), pages: 420, year: 2024, type: "notes",
    downloads: 11800, saves: 3400,
  },
  {
    id: "o2",
    title: "Essay Writing - Structure, Strategy & Practice",
    subject: "Essay", source: "InsightsIAS", author: "InsightsIAS",
    tags: ["Essay", "Writing", "Mains", "Strategy"],
    summary: "Step-by-step essay writing framework for UPSC Mains: introduction techniques, argument building, counterpoints, and 40 model essays on philosophy, society, and governance.",
    visibility: "public", file_url: nextPdf(), pages: 180, year: 2024, type: "coaching",
    downloads: 16700, saves: 4900,
  },
];

export const SUBJECTS: Subject[] = ["GS1", "GS2", "GS3", "GS4", "CSAT", "Optionals", "Essay"];
export const SOURCES: Source[] = ["NCERT", "VisionIAS", "ForumIAS", "DrishtiIAS", "ShankarIAS", "InsightsIAS", "PYQ"];
export const TYPES: PDFType[] = ["notes", "ncert", "pyq", "coaching"];

export interface CollectionDef {
  id: string;
  label: string;
  subjectFilter: Subject | null;
  sourceFilter: Source | null;
}

export const COLLECTIONS: CollectionDef[] = [
  { id: "ncert",  label: "NCERT Essentials",        subjectFilter: null,    sourceFilter: "NCERT"  },
  { id: "gs1",   label: "GS1 - History & Geography",subjectFilter: "GS1",   sourceFilter: null     },
  { id: "gs2",   label: "GS2 - Polity & IR",        subjectFilter: "GS2",   sourceFilter: null     },
  { id: "gs3",   label: "GS3 - Economy & Env",      subjectFilter: "GS3",   sourceFilter: null     },
  { id: "gs4",   label: "GS4 - Ethics",             subjectFilter: "GS4",      sourceFilter: null     },
  { id: "pyq",   label: "Previous Year Questions",  subjectFilter: null,       sourceFilter: "PYQ"    },
  { id: "csat",  label: "CSAT",                     subjectFilter: "CSAT",     sourceFilter: null     },
  { id: "essay", label: "Essay",                    subjectFilter: "Essay",    sourceFilter: null     },
];

export const ALL_COLLECTIONS: CollectionDef[] = [
  ...COLLECTIONS,
  { id: "shankar",  label: "Shankar IAS",    subjectFilter: null, sourceFilter: "ShankarIAS"  },
  { id: "insights", label: "Insights IAS",   subjectFilter: null, sourceFilter: "InsightsIAS" },
  { id: "studyiq",  label: "Study IQ",       subjectFilter: null, sourceFilter: "StudyIQ"     },
];

export const TRENDING_PDFS = [
  MOCK_PDFS.find(p => p.id === "p3")!,
  MOCK_PDFS.find(p => p.id === "v3")!,
  MOCK_PDFS.find(p => p.id === "s1")!,
  MOCK_PDFS.find(p => p.id === "d1")!,
];
