"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Bookmark, BookmarkCheck } from "lucide-react";
import { MOCK_PDFS, type Source } from "@/lib/mock-data";
import { AppLayout } from "@/components/layout/AppLayout";
import { PDFCard } from "@/components/pdf/PDFCard";
import { LoginModal } from "@/components/auth/LoginModal";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

const SOURCE_LABEL: Record<string, string> = {
  VisionIAS:   "Vision IAS",
  ForumIAS:    "Forum IAS",
  DrishtiIAS:  "Drishti IAS",
  ShankarIAS:  "Shankar IAS",
  InsightsIAS: "Insights IAS",
  StudyIQ:     "Study IQ",
  NCERT:       "NCERT",
  PYQ:         "Previous Year Questions",
};

const VALID_SOURCES = new Set(Object.keys(SOURCE_LABEL));

function ListEnd() {
  return (
    <div className="flex items-center gap-4 py-12">
      <div className="flex-1 h-px bg-[var(--color-border)]" />
      <span className="text-[11px] text-[var(--color-text-muted)] font-satoshi tracking-widest uppercase">End of list</span>
      <div className="flex-1 h-px bg-[var(--color-border)]" />
    </div>
  );
}

export default function SourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: sourceId } = use(params);
  if (!VALID_SOURCES.has(sourceId)) notFound();

  const { isSourceSaved, toggleSaveSource, user, openAuthModal } = useStore();
  const saved = isSourceSaved(sourceId);

  const pdfs = MOCK_PDFS.filter((p) => p.source === (sourceId as Source));
  const label = SOURCE_LABEL[sourceId];

  const handleSave = () => {
    if (!user) { openAuthModal(() => toggleSaveSource(sourceId)); return; }
    toggleSaveSource(sourceId);
  };

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-6 transition-colors font-satoshi"
        >
          <ArrowLeft size={14} />
          Back to library
        </Link>

        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] font-satoshi mb-1">Source</p>
            <h1 className="font-sentient text-h2 text-[var(--color-text-primary)]">{label}</h1>
            <p className="text-sm text-[var(--color-text-secondary)] font-satoshi mt-1.5">
              {pdfs.length} {pdfs.length === 1 ? "document" : "documents"}
            </p>
          </div>
          <button
            onClick={handleSave}
            className={cn(
              "shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-satoshi font-medium transition-all mt-1",
              saved
                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                : "bg-white border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            )}
          >
            {saved
              ? <BookmarkCheck size={14} fill="currentColor" strokeWidth={1.5} />
              : <Bookmark size={14} />}
            {saved ? "Saved" : "Save source"}
          </button>
        </div>

        {pdfs.length === 0 ? (
          <div className="py-24 text-center text-sm text-[var(--color-text-muted)] font-satoshi">
            No PDFs from this source yet.
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4"
          >
            {pdfs.map((pdf) => (
              <PDFCard key={pdf.id} pdf={pdf} />
            ))}
          </motion.div>
        )}

        <ListEnd />
      </div>
      <LoginModal />
    </AppLayout>
  );
}
