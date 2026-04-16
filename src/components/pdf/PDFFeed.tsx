"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useStore } from "@/store/useStore";
import { MOCK_PDFS, COLLECTIONS, type PDF } from "@/lib/mock-data";
import { PDFCard } from "./PDFCard";
import { FeedSectionSkeleton } from "@/components/ui/Skeleton";

/* ── Filter logic ────────────────────────────────────────── */

function filterPDFs(
  pdfs: PDF[],
  state: {
    searchQuery: string;
    selectedSubject: string | null;
    selectedSource: string | null;
    selectedType: string | null;
    activeCollection: string | null;
  }
): PDF[] {
  const { searchQuery, selectedSubject, selectedSource, selectedType, activeCollection } = state;

  if (activeCollection) {
    const col = COLLECTIONS.find((c) => c.id === activeCollection);
    if (col) {
      if (col.subjectFilter) return pdfs.filter((p) => p.subject === col.subjectFilter);
      if (col.sourceFilter) return pdfs.filter((p) => p.source === col.sourceFilter);
    }
  }

  let result = pdfs;
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.author.toLowerCase().includes(q)
    );
  }
  if (selectedSubject) result = result.filter((p) => p.subject === selectedSubject);
  if (selectedSource) result = result.filter((p) => p.source === selectedSource);
  if (selectedType) result = result.filter((p) => p.type === selectedType);

  return result;
}

function groupBySubject(pdfs: PDF[]): Record<string, PDF[]> {
  return pdfs.reduce<Record<string, PDF[]>>((acc, pdf) => {
    if (!acc[pdf.subject]) acc[pdf.subject] = [];
    acc[pdf.subject].push(pdf);
    return acc;
  }, {});
}

/* ── Section titles — near-black, size/weight only hierarchy ── */
const SECTION_META: Record<string, { title: string; subtitle: string }> = {
  GS1: { title: "History, Geography & Society", subtitle: "GS Paper 1" },
  GS2: { title: "Polity, Governance & International Relations", subtitle: "GS Paper 2" },
  GS3: { title: "Economy, Environment & Technology", subtitle: "GS Paper 3" },
  GS4: { title: "Ethics, Integrity & Aptitude", subtitle: "GS Paper 4" },
  CA:  { title: "Current Affairs", subtitle: "Monthly compilations" },
  Optional: { title: "Optional Subjects", subtitle: "Specialisation papers" },
};

/* ── PDFFeed ─────────────────────────────────────────────── */

export function PDFFeed({ loading = false }: { loading?: boolean }) {
  const {
    searchQuery,
    selectedSubject,
    selectedSource,
    selectedType,
    activeCollection,
  } = useStore();

  const isFiltered = searchQuery || selectedSubject || selectedSource || selectedType || activeCollection;

  const filtered = useMemo(
    () => filterPDFs(MOCK_PDFS, { searchQuery, selectedSubject, selectedSource, selectedType, activeCollection }),
    [searchQuery, selectedSubject, selectedSource, selectedType, activeCollection]
  );

  if (loading) return <FeedSectionSkeleton />;

  /* ── Filtered / search view ── */
  if (isFiltered) {
    const label = activeCollection
      ? (COLLECTIONS.find((c) => c.id === activeCollection)?.label ?? "Collection")
      : searchQuery
      ? `Results for "${searchQuery}"`
      : "Filtered results";

    return (
      <div>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-sentient text-h2 text-[var(--color-text-primary)]">
            {label}
          </h2>
          <span className="text-sm text-[var(--color-text-muted)] font-satoshi tracking-satoshi">
            {filtered.length} {filtered.length === 1 ? "result" : "results"}
          </span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState query={searchQuery} />
        ) : (
          <motion.div
            className="space-y-2.5"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.04 } }, hidden: {} }}
          >
            {filtered.map((pdf) => (
              <PDFCard key={pdf.id} pdf={pdf} />
            ))}
          </motion.div>
        )}
      </div>
    );
  }

  /* ── Default grouped home view ── */
  const grouped = groupBySubject(MOCK_PDFS);
  const subjectOrder = ["GS1", "GS2", "GS3", "GS4", "CA", "Optional"];

  return (
    <div className="space-y-10">
      {subjectOrder
        .filter((s) => grouped[s]?.length > 0)
        .map((subject) => {
          const meta = SECTION_META[subject] ?? { title: subject, subtitle: "" };
          return (
            <section key={subject}>
              {/* Section header — size + weight only, no color */}
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] font-satoshi mb-1">
                  {meta.subtitle}
                </p>
                <h2 className="font-sentient text-h3 text-[var(--color-text-primary)]">
                  {meta.title}
                </h2>
              </div>

              <div className="space-y-2.5">
                {grouped[subject].slice(0, 3).map((pdf) => (
                  <PDFCard key={pdf.id} pdf={pdf} />
                ))}
              </div>
            </section>
          );
        })}
    </div>
  );
}

/* ── Empty state ────────────────────────────────────────── */

function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 rounded-full bg-[var(--color-surface-alt)] border border-[var(--color-border)] flex items-center justify-center mb-4">
        <Search size={20} className="text-[var(--color-text-muted)]" />
      </div>
      <h3 className="font-sentient text-h3 text-[var(--color-text-primary)] mb-2">
        No results found
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] font-satoshi tracking-satoshi max-w-xs leading-relaxed">
        {query
          ? `No PDFs match "${query}". Try different keywords or adjust the filters.`
          : "No PDFs match the selected filters."}
      </p>
    </div>
  );
}
