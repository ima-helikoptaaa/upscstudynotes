"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Bookmark, Download, ArrowRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import { type PDF } from "@/lib/mock-data";
import { cn, triggerDownload } from "@/lib/utils";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { PDFThumbnail } from "@/components/pdf/PDFThumbnail";
import { preload } from "swr";

function fmtNum(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export const THUMB_FLAT: Record<string, { bg: string; text: string }> = {
  GS1:      { bg: "#DBEAFE", text: "#1E40AF" },
  GS2:      { bg: "#D1FAE5", text: "#065F46" },
  GS3:      { bg: "#FEF3C7", text: "#92400E" },
  GS4:      { bg: "#EDE9FE", text: "#5B21B6" },
  CSAT:     { bg: "#FEF3C7", text: "#78350F" },
  Optionals:{ bg: "#FCE7F3", text: "#9D174D" },
  Essay:    { bg: "#CCFBF1", text: "#0F766E" },
};

const SUBJECT_LABEL: Record<string, string> = {
  GS1: "GS 1", GS2: "GS 2", GS3: "GS 3", GS4: "GS 4",
  CSAT: "CSAT", Optionals: "OPT", Essay: "Essay",
};

const THUMB_H = 160;

export function PDFCard({ pdf }: { pdf: PDF }) {
  const { isSaved, toggleSave, user, openAuthModal, showToast } = useStore();
  const saved = isSaved(pdf.id);
  const flat = THUMB_FLAT[pdf.subject] ?? { bg: "#F3F4F6", text: "#374151" };
  const [confirmUnsave, setConfirmUnsave] = useState(false);

  const handlePrefetch = useCallback(() => {
    const f = (url: string) => fetch(url).then((r) => r.json());
    preload(`/api/pdfs/${pdf.id}`, f);
    preload(`/api/flashcards/${pdf.id}`, f);
  }, [pdf.id]);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { openAuthModal(() => toggleSave(pdf.id)); return; }
    if (saved) { setConfirmUnsave(true); return; }
    toggleSave(pdf.id);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { openAuthModal(() => { triggerDownload(pdf.file_url, pdf.title); showToast("Download started"); }); return; }
    triggerDownload(pdf.file_url, pdf.title);
    showToast("Download started");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="w-full"
    >
      <Link href={`/pdf/${pdf.id}`} className="group block" onMouseEnter={handlePrefetch}>
        <div
          className="bg-white rounded-2xl overflow-hidden border-2 border-transparent ring-1 ring-[var(--color-border)] group-hover:ring-0 group-hover:border-[var(--color-primary)] flex flex-col transition-all duration-200"
        >

          <div
            className="relative flex-shrink-0 overflow-hidden"
            style={{ height: THUMB_H, backgroundColor: flat.bg }}
          >
            <PDFThumbnail url={pdf.file_url} height={THUMB_H} />

            <div className="absolute inset-0 z-[1] bg-black/0 group-hover:bg-black/10 transition-colors duration-200 pointer-events-none" />

            <div className="absolute bottom-2.5 left-3 z-10">
              <span
                className="inline-block text-[11.5px] font-bold font-satoshi leading-none px-2.5 py-1 rounded-md"
                style={{ backgroundColor: flat.bg, color: flat.text }}
              >
                {SUBJECT_LABEL[pdf.subject] ?? pdf.subject}
              </span>
            </div>

            <div
              className="absolute bottom-0 right-0 w-20 h-16 z-[2] pointer-events-none lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200"
              style={{ background: "radial-gradient(ellipse at 100% 100%, rgba(0,0,0,0.65) 0%, transparent 72%)" }}
            />

            <div className="absolute bottom-3 right-3 z-10 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
              <ArrowRight size={16} className="text-white" />
            </div>

            <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleDownload}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm text-[var(--color-text-secondary)] hover:bg-white hover:text-[var(--color-primary)] hover:scale-110 transition-all shadow-sm"
                aria-label="Download PDF"
              >
                <Download size={15} />
              </button>
              <button
                onClick={handleSave}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-sm",
                  saved
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-white/90 backdrop-blur-sm text-[var(--color-text-secondary)] hover:bg-white hover:text-[var(--color-primary)]"
                )}
                aria-label={saved ? "Unsave" : "Save"}
              >
                <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          {/* ── Card body ── fixed height keeps all cards the same size */}
          <div className="flex flex-col justify-between px-4 pt-3 pb-3.5" style={{ height: 92 }}>
            <h3 className="text-base font-semibold text-[var(--color-text-primary)] font-satoshi leading-snug line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors duration-150">
              {pdf.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] font-satoshi">
              <span>{pdf.year}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Download size={12} />{fmtNum(pdf.downloads)}</span>
              <span className="flex items-center gap-1"><Bookmark size={12} />{fmtNum(pdf.saves)}</span>
            </div>
          </div>

        </div>
      </Link>

      <ConfirmModal
        open={confirmUnsave}
        title="Remove from library?"
        body="You can always save it again."
        confirmLabel="Remove"
        cancelLabel="Keep"
        variant="default"
        onConfirm={() => { setConfirmUnsave(false); toggleSave(pdf.id); }}
        onCancel={() => setConfirmUnsave(false)}
      />
    </motion.div>
  );
}
