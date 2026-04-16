"use client";

import { Menu, Search } from "lucide-react";
import { useStore } from "@/store/useStore";
import { FilterPanel } from "@/components/ui/FilterPanel";
import { cn } from "@/lib/utils";

export function TopBar() {
  const { openSearchOverlay, setSidebarOpen, searchQuery, selectedSubject, selectedSource, selectedType } = useStore();

  const hasQuery = !!searchQuery;
  const hasFilters = selectedSubject || selectedSource || selectedType;

  return (
    <header className="sticky top-0 z-30 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      <div className="flex items-center gap-3 px-5 py-3">
        {/* Hamburger (mobile only) */}
        <button
          className="lg:hidden shrink-0 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] p-1.5 rounded-md transition-colors"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        {/* Search trigger — pill shape, full-width clickable */}
        <button
          onClick={openSearchOverlay}
          className={cn(
            "flex-1 flex items-center gap-2.5 h-9 px-4 rounded-full border text-sm font-satoshi tracking-satoshi transition-all duration-150 text-left",
            "border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text-muted)]",
            "hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-secondary)]",
            "max-w-[440px]"
          )}
          aria-label="Open search"
        >
          <Search size={14} className="shrink-0" />
          <span className="flex-1 text-left truncate">
            {hasQuery ? (
              <span className="text-[var(--color-text-primary)]">{searchQuery}</span>
            ) : (
              "Search PDFs, topics…"
            )}
          </span>
          <kbd className="hidden sm:inline shrink-0 text-[10px] font-mono bg-[var(--color-border)] text-[var(--color-text-muted)] px-1.5 py-0.5 rounded leading-none">
            /
          </kbd>
        </button>

        {/* Filter panel */}
        <FilterPanel />
      </div>

      {/* Active filters indicator bar */}
      {(hasQuery || hasFilters) && (
        <div className="flex items-center gap-2 px-5 pb-2.5">
          <span className="text-[11px] text-[var(--color-text-muted)] font-satoshi">
            Showing results for:
          </span>
          {hasQuery && (
            <ActivePill label={`"${searchQuery}"`} />
          )}
          {selectedSubject && <ActivePill label={selectedSubject} />}
          {selectedSource && <ActivePill label={selectedSource} />}
          {selectedType && <ActivePill label={selectedType} />}
        </div>
      )}
    </header>
  );
}

function ActivePill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-satoshi bg-[var(--color-primary-light)] text-[var(--color-primary)]">
      {label}
    </span>
  );
}
