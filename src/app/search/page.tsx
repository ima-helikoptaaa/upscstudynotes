"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Sparkles } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PDFCard } from "@/components/pdf/PDFCard";
import { LoginModal } from "@/components/auth/LoginModal";
import { MOCK_PDFS } from "@/lib/mock-data";
import { useRouter } from "next/navigation";

/* ── AI briefs (same as overlay) ────────────────────────────── */
const AI_BRIEFS: Array<{ keywords: string[]; brief: string }> = [
  { keywords: ["polity", "constitution", "parliament", "fundamental rights"], brief: "Indian Polity covers the constitutional framework, fundamental rights, DPSP, federal structure, and parliamentary system. Key topics include Articles 12–35, 51A, and constitutional bodies like the EC, CAG, and UPSC." },
  { keywords: ["economy", "gdp", "rbi", "inflation", "fiscal", "monetary"], brief: "Indian Economy spans macroeconomic policy, fiscal & monetary frameworks, post-independence planning, trade, agriculture, infrastructure, and current challenges including inflation and the digital economy." },
  { keywords: ["history", "medieval", "ancient", "mughal", "harappan", "colonial", "freedom", "independence"], brief: "UPSC History includes ancient civilizations (Harappan, Vedic), medieval kingdoms (Delhi Sultanate, Mughals), and modern history — colonial era, freedom movement 1857–1947, and constitution-making." },
  { keywords: ["geography", "monsoon", "river", "climate", "soil", "physical", "drainage"], brief: "Geography covers physical features, climate systems, river networks, mineral distribution, and human geography including migration, urbanization, economic activities, and disaster management." },
  { keywords: ["environment", "ecology", "biodiversity", "climate change", "pollution", "paris"], brief: "Environment & Ecology includes biodiversity hotspots, international conventions (CITES, Ramsar, Paris Agreement), climate change adaptation, pollution control, and India's green policies." },
  { keywords: ["ethics", "integrity", "aptitude", "case study", "civil service", "probity"], brief: "GS4 Ethics covers philosophical foundations, emotional intelligence, civil service values, probity in governance, and case studies on corruption, whistleblowing, and institutional integrity." },
  { keywords: ["current affairs", "monthly", "ca", "news"], brief: "Current Affairs for UPSC covers national & international events, economic updates, scientific breakthroughs, sports, awards, and government schemes — spanning the 12–18 months before the exam." },
  { keywords: ["science", "technology", "space", "isro", "ai", "artificial intelligence"], brief: "S&T for UPSC includes ISRO missions, biotech, AI policy, nanotechnology, cybersecurity, and defence R&D. Focus on Chandrayaan, Aditya-L1, and India's digital public infrastructure." },
];

function getAiBrief(query: string): string {
  const q = query.toLowerCase().trim();
  for (const { keywords, brief } of AI_BRIEFS) {
    if (keywords.some((kw) => q.includes(kw))) return brief;
  }
  return `"${query}" is a relevant UPSC topic. Here's what you should know: this subject typically appears across multiple GS papers and requires understanding both conceptual foundations and current developments. Focus on NCERT basics first, then supplement with coaching material and previous year questions for comprehensive preparation.`;
}

/* ── AI Brief Card ───────────────────────────────────────────── */
function AiBriefCard({ query }: { query: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [brief, setBrief] = useState<string | null>(null);

  const handleGenerate = async () => {
    setState("loading");
    await new Promise((r) => setTimeout(r, 1200));
    setBrief(getAiBrief(query));
    setState("done");
  };

  return (
    <div
      className="rounded-xl mb-8"
      style={{ background: "#EEF2FF", border: "1px solid rgba(55,48,163,0.1)" }}
    >
      <div className="px-4 py-3">
        {/* Label + generate row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles size={11} style={{ color: "rgba(55,48,163,0.55)" }} />
            <span
              className="text-[10px] font-satoshi font-bold uppercase tracking-[0.12em]"
              style={{ color: "rgba(55,48,163,0.5)" }}
            >
              AI Brief
            </span>
          </div>

          {state === "idle" && (
            <button
              onClick={handleGenerate}
              className="flex items-center gap-1.5 text-[11px] font-satoshi font-semibold px-3 py-1 rounded-full text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: "#3730A3" }}
            >
              <Sparkles size={10} />
              Generate
            </button>
          )}
        </div>

        {/* Idle */}
        {state === "idle" && (
          <div className="flex items-baseline gap-2">
            <p className="font-sentient text-[14px] leading-snug" style={{ color: "#1e1b4b" }}>
              &ldquo;{query}&rdquo;
            </p>
            <span className="text-[11px] font-satoshi" style={{ color: "rgba(55,48,163,0.38)" }}>
              · get a curated overview
            </span>
          </div>
        )}

        {/* Loading */}
        {state === "loading" && (
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-satoshi" style={{ color: "rgba(55,48,163,0.55)" }}>
              Generating brief
            </span>
            <div className="flex gap-1 items-center">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="block w-1 h-1 rounded-full"
                  style={{ background: "rgba(55,48,163,0.4)" }}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Done */}
        {state === "done" && brief && (
          <motion.div
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <p className="text-[10.5px] font-satoshi font-semibold mb-1.5" style={{ color: "rgba(55,48,163,0.45)" }}>
              {query}
            </p>
            <p className="text-[13px] font-satoshi leading-[1.7] text-[var(--color-text-secondary)]">
              {brief}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ── Inline SearchBar (search page only) ────────────────────── */
function PageSearchBar({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValue);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  };

  return (
    <div className="flex items-center gap-3 px-5 py-3.5 rounded-full bg-white border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-colors">
      <Search size={18} className="shrink-0 text-[var(--color-text-muted)]" />
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search PDFs, topics, authors…"
        className="flex-1 bg-transparent text-base font-satoshi focus:outline-none min-w-0 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
        autoFocus
      />
      {q && (
        <button
          onClick={() => setQ("")}
          className="w-6 h-6 rounded-full bg-[var(--color-surface-muted)] flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-border)] transition-colors text-xs"
          aria-label="Clear"
        >
          ×
        </button>
      )}
    </div>
  );
}

function SearchResults() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";

  const results =
    q.length >= 2
      ? MOCK_PDFS.filter(
          (p) =>
            p.title.toLowerCase().includes(q.toLowerCase()) ||
            p.summary.toLowerCase().includes(q.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(q.toLowerCase())) ||
            p.subject.toLowerCase().includes(q.toLowerCase()) ||
            p.source.toLowerCase().includes(q.toLowerCase())
        )
      : [];

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-satoshi text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          Home
        </Link>

        {/* Search bar */}
        <div className="max-w-[600px] mb-8">
          <PageSearchBar defaultValue={q} />
        </div>

        {/* AI Brief card — same width as search bar */}
        {q && (
          <div className="max-w-[600px]">
            <AiBriefCard key={q} query={q} />
          </div>
        )}

        {/* Header */}
        {q && (
          <div className="flex items-center gap-2.5 mb-6">
            <h1 className="font-sentient text-h3 text-[var(--color-text-primary)]">
              Results for &ldquo;{q}&rdquo;
            </h1>
            {results.length > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-medium font-satoshi">
                {results.length}
              </span>
            )}
          </div>
        )}

        {/* Results */}
        {!q ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search size={32} className="text-[var(--color-text-muted)] mb-4" />
            <p className="text-sm text-[var(--color-text-secondary)] font-satoshi">
              Enter a search term to find PDFs.
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="font-sentient text-h3 text-[var(--color-text-primary)] mb-2">No results found</p>
            <p className="text-sm text-[var(--color-text-secondary)] font-satoshi max-w-xs leading-relaxed mb-6">
              We couldn&apos;t find any PDFs matching &ldquo;{q}&rdquo;. Try a different term.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-primary)] text-white text-sm font-satoshi font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              Browse all PDFs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
            {results.map((pdf) => (
              <PDFCard key={pdf.id} pdf={pdf} />
            ))}
          </div>
        )}

        {results.length > 0 && (
          <div className="flex items-center gap-4 py-12">
            <div className="flex-1 h-px bg-[var(--color-border)]" />
            <span className="text-[11px] text-[var(--color-text-muted)] font-satoshi tracking-widest uppercase">
              End of results
            </span>
            <div className="flex-1 h-px bg-[var(--color-border)]" />
          </div>
        )}
      </div>
      <LoginModal />
    </AppLayout>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}
