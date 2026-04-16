"use client";

import { useStore } from "@/store/useStore";
import { MOCK_PDFS, type Subject } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface CollectionCardProps {
  id: string;
  label: string;
  subjectFilter: Subject | null;
  sourceFilter: string | null;
}

const CARD_COLORS: Record<string, { bar: string; bg: string; text: string }> = {
  ncert:    { bar: "bg-sky-400",     bg: "bg-sky-50",     text: "text-sky-700" },
  gs1:      { bar: "bg-blue-400",    bg: "bg-blue-50",    text: "text-blue-700" },
  gs2:      { bar: "bg-emerald-400", bg: "bg-emerald-50", text: "text-emerald-700" },
  gs3:      { bar: "bg-orange-400",  bg: "bg-orange-50",  text: "text-orange-700" },
  gs4:      { bar: "bg-purple-400",  bg: "bg-purple-50",  text: "text-purple-700" },
  pyq:      { bar: "bg-rose-400",    bg: "bg-rose-50",    text: "text-rose-700" },
  ca:       { bar: "bg-amber-400",   bg: "bg-amber-50",   text: "text-amber-700" },
  optional: { bar: "bg-pink-400",    bg: "bg-pink-50",    text: "text-pink-700" },
};

export function CollectionCard({ id, label, subjectFilter, sourceFilter }: CollectionCardProps) {
  const { setActiveCollection } = useStore();
  const router = useRouter();

  const pdfCount = MOCK_PDFS.filter((p) => {
    if (subjectFilter) return p.subject === subjectFilter;
    if (sourceFilter) return p.source === sourceFilter;
    return true;
  }).length;

  const c = CARD_COLORS[id] ?? CARD_COLORS.ncert;

  const handleClick = () => {
    setActiveCollection(id);
    router.push("/");
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group w-full text-left border border-[var(--color-border)] rounded-xl overflow-hidden",
        "bg-[var(--color-surface)] hover:border-[var(--color-border-strong)]",
        "transition-all duration-[175ms] ease-out"
      )}
    >
      {/* Color bar */}
      <div className={cn("h-1.5 w-full", c.bar)} />

      <div className="p-5">
        {/* Subject badge */}
        <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold font-satoshi mb-3", c.bg, c.text)}>
          {subjectFilter ?? (sourceFilter ?? id.toUpperCase())}
        </span>

        <h3 className="font-sentient text-h4 text-[var(--color-text-primary)] leading-snug text-balance mb-1.5">
          {label}
        </h3>

        <p className="text-xs text-[var(--color-text-muted)] font-satoshi tracking-satoshi mb-4">
          {pdfCount} {pdfCount === 1 ? "PDF" : "PDFs"} available
        </p>

        <div className="flex items-center gap-1.5 text-xs font-satoshi text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors">
          Browse collection <ArrowRight size={12} />
        </div>
      </div>
    </button>
  );
}
