"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Bookmark, BookmarkCheck, Download, ArrowRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import { type PDF } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const THUMB_FLAT: Record<string, { bg: string; text: string }> = {
  GS1:      { bg: "#DBEAFE", text: "#1E40AF" },
  GS2:      { bg: "#D1FAE5", text: "#065F46" },
  GS3:      { bg: "#FEF3C7", text: "#92400E" },
  GS4:      { bg: "#EDE9FE", text: "#5B21B6" },
  CA:       { bg: "#FEE2E2", text: "#991B1B" },
  Optional: { bg: "#FCE7F3", text: "#9D174D" },
};

const SUBJECT_LABEL: Record<string, string> = {
  GS1: "GS 1", GS2: "GS 2", GS3: "GS 3", GS4: "GS 4", CA: "CA", Optional: "OPT",
};

const THUMB_H = 160; // px — thumbnail area height
const IFRAME_H = 740; // px — iframe height; must be >> THUMB_H so the PDF page
                      // renders with enough vertical space and nothing scrolls.
                      // The container (THUMB_H, overflow:hidden) clips the rest.

export function PDFCard({ pdf }: { pdf: PDF }) {
  const { isSaved, toggleSave, user, openAuthModal } = useStore();
  const saved = isSaved(pdf.id);
  const flat = THUMB_FLAT[pdf.subject] ?? { bg: "#F3F4F6", text: "#374151" };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { openAuthModal(() => toggleSave(pdf.id)); return; }
    toggleSave(pdf.id);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { openAuthModal(() => window.open(pdf.file_url, "_blank")); return; }
    window.open(pdf.file_url, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="w-full"
    >
      <Link href={`/pdf/${pdf.id}`} className="group block">
        <div
          className="bg-white rounded-2xl overflow-hidden border border-[var(--color-border)] group-hover:border-[var(--color-border-strong)] flex flex-col transition-colors duration-200"
          style={{ height: 240 }}
        >

          {/* ── Thumbnail ───────────────────────────────────────
              Strategy: iframe is IFRAME_H px tall inside a THUMB_H px container
              with overflow:hidden. The PDF renders at full width (fit-width) with
              plenty of vertical space — no scroll possible. Container clips to top
              THUMB_H px, showing the first page as a thumbnail.
              Pastel flat.bg is the container background colour, visible while the
              PDF loads (before the iframe paints over it).
          ──────────────────────────────────────────────────── */}
          <div
            className="relative flex-shrink-0 overflow-hidden"
            style={{ height: THUMB_H, backgroundColor: flat.bg }}
          >
            <iframe
              src={`${pdf.file_url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
              scrolling="no"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "calc(100% + 20px)", // push scrollbar 20px past the clipping edge
                height: IFRAME_H,
                border: "none",
                pointerEvents: "none",
                display: "block",
              }}
              loading="lazy"
              tabIndex={-1}
              aria-hidden
              title=""
            />

            {/* Hover dim overlay */}
            <div className="absolute inset-0 z-[1] bg-black/0 group-hover:bg-black/10 transition-colors duration-200 pointer-events-none" />

            {/* Subject pill — bottom-left, sits above PDF */}
            <div className="absolute bottom-2.5 left-3 z-10">
              <span
                className="inline-block text-[11.5px] font-bold font-satoshi leading-none px-2.5 py-1 rounded-md"
                style={{ backgroundColor: flat.bg, color: flat.text }}
              >
                {SUBJECT_LABEL[pdf.subject] ?? pdf.subject}
              </span>
            </div>

            {/* Arrow — bottom-right, slides in on hover */}
            <div className="absolute bottom-2.5 right-3 z-10 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
              >
                <ArrowRight size={11} className="text-white" />
              </div>
            </div>

            {/* Download + Save buttons — top-right, appear on hover */}
            <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleDownload}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm text-[var(--color-text-secondary)] hover:bg-white hover:text-[var(--color-primary)] hover:scale-110 transition-all shadow-sm"
                aria-label="Download PDF"
              >
                <Download size={13} />
              </button>
              <button
                onClick={handleSave}
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-sm",
                  saved
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-white/90 backdrop-blur-sm text-[var(--color-text-secondary)] hover:bg-white hover:text-[var(--color-primary)]"
                )}
                aria-label={saved ? "Unsave" : "Save"}
              >
                {saved
                  ? <BookmarkCheck size={13} fill="currentColor" strokeWidth={1.5} />
                  : <Bookmark size={13} />}
              </button>
            </div>
          </div>

          {/* ── Card body ── */}
          <div className="flex flex-col px-3.5 pt-3 pb-3 gap-1.5 flex-1 min-h-0 overflow-hidden">
            <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)] font-satoshi leading-snug line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors duration-150">
              {pdf.title}
            </h3>
            <p className="text-[11px] text-[var(--color-text-muted)] font-satoshi truncate">
              {pdf.source} · {pdf.year}
            </p>
          </div>

        </div>
      </Link>
    </motion.div>
  );
}
