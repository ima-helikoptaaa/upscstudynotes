"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MOCK_PDFS } from "@/lib/mock-data";
import { LoginModal } from "@/components/auth/LoginModal";
import { ArrowLeft, Bookmark, BookmarkCheck, Download } from "@/components/ui/Icons";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

export default function ReaderPage({ params }: { params: { id: string } }) {
  const pdf = MOCK_PDFS.find((p) => p.id === params.id);
  const { isSaved, toggleSave, user, openAuthModal } = useStore();
  const [showSummary, setShowSummary] = useState(false);

  if (!pdf) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <p className="text-[var(--color-text-secondary)] font-satoshi">PDF not found.</p>
      </div>
    );
  }

  const saved = isSaved(pdf.id);

  const handleSave = () => {
    if (!user) {
      openAuthModal(() => toggleSave(pdf.id));
      return;
    }
    toggleSave(pdf.id);
  };

  const handleDownload = () => {
    if (!user) {
      openAuthModal(() => window.open(pdf.file_url, "_blank"));
      return;
    }
    window.open(pdf.file_url, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#1C1C1E] flex flex-col">
      {/* ── Reader top bar ──────────────────────────────── */}
      <header className="sticky top-0 z-20 flex items-center gap-3 px-4 py-2.5 bg-[#1C1C1E]/95 backdrop-blur-sm border-b border-white/8">
        <Link
          href={`/pdf/${pdf.id}`}
          className="text-white/60 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/10"
          aria-label="Back"
        >
          <ArrowLeft size={16} />
        </Link>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-satoshi font-medium text-white/90 truncate leading-none">
            {pdf.title}
          </p>
          <p className="text-[11px] font-satoshi text-white/40 mt-0.5">
            {pdf.source} · {pdf.pages} pages
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowSummary((s) => !s)}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-satoshi font-medium transition-colors",
              showSummary
                ? "bg-[var(--color-primary)] text-white"
                : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
            )}
          >
            Summary
          </button>
          <button
            onClick={handleSave}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              saved
                ? "text-[var(--color-accent)] bg-[var(--color-accent-light)]/20"
                : "text-white/60 hover:text-white hover:bg-white/10"
            )}
            aria-label={saved ? "Remove from saved" : "Save"}
          >
            {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 text-white/70 hover:text-white text-xs font-satoshi font-medium transition-colors"
          >
            <Download size={13} />
            Download
          </button>
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* PDF viewport */}
        <motion.main
          className="flex-1 overflow-auto bg-[#2C2C2E] flex items-start justify-center p-6"
          layout
          transition={{ duration: 0.175 }}
        >
          {/* Embed PDF via iframe */}
          <div className="w-full max-w-3xl bg-white rounded-md shadow-2xl overflow-hidden" style={{ minHeight: "80vh" }}>
            <iframe
              src={`${pdf.file_url}#toolbar=0&navpanes=0`}
              className="w-full"
              style={{ height: "85vh" }}
              title={pdf.title}
            />
          </div>
        </motion.main>

        {/* Summary side panel */}
        <motion.aside
          initial={false}
          animate={{ width: showSummary ? 300 : 0, opacity: showSummary ? 1 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="overflow-hidden shrink-0 bg-[#1C1C1E] border-l border-white/8"
        >
          <div className="w-[300px] h-full overflow-y-auto p-5">
            <h2 className="font-sentient text-h3 text-white mb-3">Summary</h2>
            <p className="text-sm font-satoshi text-white/70 leading-relaxed">
              {pdf.summary}
            </p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs font-semibold uppercase tracking-widest font-satoshi text-white/40 mb-2">
                Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {pdf.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-xs font-satoshi bg-white/10 text-white/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.aside>
      </div>

      <LoginModal />
    </div>
  );
}
