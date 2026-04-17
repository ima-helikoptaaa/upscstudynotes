"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { useStore } from "@/store/useStore";
import { SUBJECTS, SOURCES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const TYPE_OPTIONS = [
  { value: "notes", label: "Notes" },
  { value: "ncert", label: "NCERT" },
  { value: "pyq", label: "PYQ" },
];

export function FilterPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    selectedSubject,
    selectedSource,
    selectedType,
    setSubject,
    setSource,
    setType,
    resetFilters,
  } = useStore();

  const activeCount = [selectedSubject, selectedSource, selectedType].filter(Boolean).length;

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative shrink-0">
      {/* Trigger button - pill shape */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1.5 h-9 px-4 rounded-full border text-sm font-satoshi tracking-satoshi transition-all duration-150",
          isOpen || activeCount > 0
            ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]"
            : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]"
        )}
        aria-label="Open filters"
      >
        <SlidersHorizontal size={13} />
        <span>Filter</span>
        {activeCount > 0 && (
          <span className="ml-0.5 w-4 h-4 rounded-full bg-[var(--color-primary)] text-white text-[9px] font-bold flex items-center justify-center leading-none">
            {activeCount}
          </span>
        )}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 top-full mt-2 w-[272px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 z-40"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)] font-satoshi">
                Filters
              </span>
              {activeCount > 0 && (
                <button
                  onClick={() => { resetFilters(); setIsOpen(false); }}
                  className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] font-satoshi underline underline-offset-2 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            <FilterGroup label="Subject">
              {SUBJECTS.map((s) => (
                <FilterChip
                  key={s}
                  label={s}
                  active={selectedSubject === s}
                  onClick={() =>
                    setSubject(selectedSubject === s ? null : (s as Parameters<typeof setSubject>[0]))
                  }
                />
              ))}
            </FilterGroup>

            <FilterGroup label="Collection">
              {SOURCES.map((s) => (
                <FilterChip
                  key={s}
                  label={s}
                  active={selectedSource === s}
                  onClick={() =>
                    setSource(selectedSource === s ? null : (s as Parameters<typeof setSource>[0]))
                  }
                />
              ))}
            </FilterGroup>

            <FilterGroup label="Type" last>
              {TYPE_OPTIONS.map((t) => (
                <FilterChip
                  key={t.value}
                  label={t.label}
                  active={selectedType === t.value}
                  onClick={() =>
                    setType(selectedType === t.value ? null : t.value)
                  }
                />
              ))}
            </FilterGroup>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────── */

function FilterGroup({
  label,
  children,
  last,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={cn("mb-3", last && "mb-0")}>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)] font-satoshi mb-2">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-2.5 py-1 rounded-full text-xs font-satoshi tracking-satoshi transition-all duration-150 border",
        active
          ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
          : "bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]"
      )}
    >
      {label}
    </button>
  );
}
