"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { SUBJECTS, type Subject, type Source } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const COACHING_SOURCES = ["VisionIAS", "ForumIAS", "DrishtiIAS", "ShankarIAS", "InsightsIAS", "StudyIQ"];
const COACHING_LABELS: Record<string, string> = {
  VisionIAS: "Vision IAS", ForumIAS: "Forum IAS", DrishtiIAS: "Drishti IAS",
  ShankarIAS: "Shankar IAS", InsightsIAS: "Insights IAS", StudyIQ: "Study IQ",
};
const FORMAT_OPTIONS = [
  { value: "notes", label: "Notes" },
  { value: "ncert", label: "Books" },
  { value: "pyq", label: "PYQs" },
];

export function FilterBar() {
  const { selectedSubject, selectedSource, selectedType, setSubject, setSource, setType, resetFilters } = useStore();
  const hasFilters = selectedSubject || selectedSource || selectedType;

  return (
    <div className="flex items-center gap-2 flex-wrap mb-8">
      <FilterDropdown
        label="Paper"
        options={SUBJECTS.map((s) => ({ value: s, label: s }))}
        selected={selectedSubject}
        onSelect={(v) => setSubject(selectedSubject === v ? null : v as Subject)}
        onClear={() => setSubject(null)}
      />
      <FilterDropdown
        label="Coaching"
        options={COACHING_SOURCES.map((s) => ({ value: s, label: COACHING_LABELS[s] ?? s }))}
        selected={selectedSource}
        onSelect={(v) => setSource(selectedSource === v ? null : v as Source)}
        onClear={() => setSource(null)}
      />
      <FilterDropdown
        label="Format"
        options={FORMAT_OPTIONS}
        selected={selectedType}
        onSelect={(v) => setType(selectedType === v ? null : v)}
        onClear={() => setType(null)}
      />
      {hasFilters && (
        <button
          onClick={resetFilters}
          className="text-xs font-satoshi text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors ml-1"
        >
          Clear all
        </button>
      )}
    </div>
  );
}

function FilterDropdown({
  label,
  options,
  selected,
  onSelect,
  onClear,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string | null;
  onSelect: (v: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selectedLabel = options.find((o) => o.value === selected)?.label ?? selected;

  if (selected) {
    return (
      <button
        onClick={onClear}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium font-satoshi bg-[var(--color-primary)] text-white transition-all"
      >
        {selectedLabel}
        <X size={11} />
      </button>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium font-satoshi border transition-all",
          open
            ? "bg-[var(--color-surface-muted)] border-[var(--color-border-strong)] text-[var(--color-text-primary)]"
            : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]"
        )}
      >
        {label}
        <ChevronDown size={11} className={cn("transition-transform duration-150", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 min-w-[152px] bg-white border border-[var(--color-border)] rounded-xl z-40 py-1 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onSelect(opt.value); setOpen(false); }}
              className="w-full text-left px-3.5 py-2 text-xs font-satoshi text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
