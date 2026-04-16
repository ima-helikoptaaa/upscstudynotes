"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Bookmark, BookmarkCheck, FileText } from "lucide-react";
import { useStore } from "@/store/useStore";
import { type PDF } from "@/lib/mock-data";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/utils";

/* ── Subject thumbnail palette ───────────────────────────── */
const THUMBNAIL: Record<
  string,
  { bg: string; border: string; label: string; text: string }
> = {
  GS1: { bg: "#DBEAFE", border: "#BFDBFE", text: "#1E40AF", label: "GS1" },
  GS2: { bg: "#D1FAE5", border: "#A7F3D0", text: "#065F46", label: "GS2" },
  GS3: { bg: "#FEF3C7", border: "#FDE68A", text: "#92400E", label: "GS3" },
  GS4: { bg: "#EDE9FE", border: "#DDD6FE", text: "#5B21B6", label: "GS4" },
  CA:  { bg: "#FEF9C3", border: "#FEF08A", text: "#713F12", label: "CA"  },
  Optional: { bg: "#FCE7F3", border: "#FBCFE8", text: "#9D174D", label: "OPT" },
};

function PDFThumbnail({ subject, type }: { subject: string; type: string }) {
  const t = THUMBNAIL[subject] ?? {
    bg: "#F5F3EE",
    border: "#E2E0DA",
    text: "#525252",
    label: "PDF",
  };

  return (
    <div
      className="shrink-0 flex flex-col items-center justify-center gap-1 rounded-md"
      style={{
        width: 68,
        height: 84,
        background: t.bg,
        border: `1px solid ${t.border}`,
      }}
    >
      <span
        className="font-sentient text-base leading-none"
        style={{ color: t.text }}
      >
        {t.label}
      </span>
      <span
        className="text-[9px] font-satoshi uppercase tracking-wider opacity-60"
        style={{ color: t.text }}
      >
        {type}
      </span>
    </div>
  );
}

/* ── PDFCard ─────────────────────────────────────────────── */

interface PDFCardProps {
  pdf: PDF;
}

export function PDFCard({ pdf }: PDFCardProps) {
  const { isSaved, toggleSave, user, openAuthModal } = useStore();
  const saved = isSaved(pdf.id);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      openAuthModal(() => toggleSave(pdf.id));
      return;
    }
    toggleSave(pdf.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.175, ease: "easeOut" }}
    >
      <Link href={`/pdf/${pdf.id}`} className="group block">
        <div
          className={cn(
            "flex items-start gap-4 p-4 bg-[var(--color-surface)]",
            "border border-[var(--color-border)] rounded-lg",
            "transition-all duration-[175ms] ease-out",
            "hover:border-[var(--color-border-strong)]",
            /* No shadows — border + bg contrast provides depth */
          )}
        >
          {/* Thumbnail */}
          <PDFThumbnail subject={pdf.subject} type={pdf.type} />

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Title row */}
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <h3 className="font-satoshi font-medium text-sm text-[var(--color-text-primary)] leading-snug line-clamp-2 tracking-satoshi group-hover:text-[var(--color-primary)] transition-colors">
                {pdf.title}
              </h3>
              <button
                onClick={handleSave}
                aria-label={saved ? "Remove from saved" : "Save"}
                className={cn(
                  "shrink-0 p-1 rounded-md transition-all duration-150",
                  saved
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                )}
              >
                {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-[var(--color-text-secondary)] font-satoshi tracking-satoshi leading-relaxed line-clamp-2 mb-2.5">
              {pdf.summary}
            </p>

            {/* Tags + meta */}
            <div className="flex items-center gap-1.5 flex-wrap mt-auto">
              <Tag label={pdf.subject} variant="subject" />
              <Tag label={pdf.source} variant="source" />
              {pdf.tags.slice(0, 1).map((tag) => (
                <Tag key={tag} label={tag} variant="default" />
              ))}
              {/* Meta right-aligned */}
              <div className="ml-auto flex items-center gap-1 text-[var(--color-text-muted)]">
                <FileText size={11} />
                <span className="text-[11px] font-satoshi">
                  {pdf.pages}p · {pdf.year}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
