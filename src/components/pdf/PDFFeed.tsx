"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import useSWR from "swr";
import { useStore } from "@/store/useStore";
import { COACHING_SOURCES, SOURCE_LABEL, ALL_COLLECTIONS, type PDF } from "@/lib/mock-data";
import { fetcher } from "@/lib/fetcher";
import { PDFCard } from "./PDFCard";
import { CollectionTile } from "./CollectionTile";

function applyFilters(pdfs: PDF[], params: {
  selectedSubject: string | null;
  selectedSource: string | null;
  selectedType: string | null;
  activeCollection: string | null;
}): PDF[] {
  const { selectedSubject, selectedSource, selectedType, activeCollection } = params;
  if (activeCollection) {
    const col = ALL_COLLECTIONS.find((c) => c.id === activeCollection);
    if (col) {
      let r = pdfs;
      if (col.subjectFilter) r = r.filter((p) => p.subject === col.subjectFilter);
      if (col.sourceFilter) r = r.filter((p) => p.source === col.sourceFilter);
      return r;
    }
  }
  let result = pdfs;
  if (selectedSubject) result = result.filter((p) => p.subject === selectedSubject);
  if (selectedSource) result = result.filter((p) => p.source === selectedSource);
  if (selectedType) result = result.filter((p) => p.type === selectedType);
  return result;
}

function FeedSection({ title, sourceId, pdfs }: { title: string; sourceId: string; pdfs: PDF[] }) {
  if (!pdfs.length) return null;
  return (
    <section>
      <div className="flex items-baseline justify-between mb-4 px-4 sm:px-6 lg:px-8">
        <h2 className="font-sentient text-h3 text-[var(--color-text-primary)]">{title}</h2>
        <Link
          href={`/collection/${encodeURIComponent(sourceId)}`}
          className="flex items-center gap-1 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] font-satoshi uppercase tracking-widest transition-colors"
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
          {pdfs.slice(0, 5).map((pdf) => (
            <PDFCard key={pdf.id} pdf={pdf} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ListEnd() {
  return (
    <div className="flex items-center gap-4 px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex-1 h-px bg-[var(--color-border)]" />
      <span className="text-[11px] text-[var(--color-text-muted)] font-satoshi tracking-widest uppercase">
        End of list
      </span>
      <div className="flex-1 h-px bg-[var(--color-border)]" />
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-pulse">
      {[0, 1, 2].map((i) => (
        <section key={i}>
          <div className="flex items-baseline justify-between mb-4 px-4 sm:px-6 lg:px-8">
            <div className="h-6 w-40 bg-[var(--color-surface-alt)] rounded" />
          </div>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
              {[0, 1, 2, 3, 4].map((j) => (
                <div key={j} className="h-[252px] bg-[var(--color-surface-alt)] rounded-2xl" />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

export function PDFFeed() {
  const { selectedSubject, selectedSource, selectedType, activeCollection } = useStore();
  const isFiltered = !!(selectedSubject || selectedSource || selectedType || activeCollection);

  const { data: apiData, isLoading } = useSWR<{ data: PDF[] }>(
    "/api/pdfs?limit=500",
    fetcher
  );
  const allPdfs = apiData?.data ?? [];

  const filteredPDFs = useMemo(
    () => applyFilters(allPdfs, { selectedSubject, selectedSource, selectedType, activeCollection }),
    [allPdfs, selectedSubject, selectedSource, selectedType, activeCollection]
  );

  const bySource = useMemo(() => {
    const map: Record<string, PDF[]> = {};
    for (const pdf of allPdfs) {
      if (!map[pdf.source]) map[pdf.source] = [];
      map[pdf.source].push(pdf);
    }
    return map;
  }, [allPdfs]);

  if (isLoading) return <FeedSkeleton />;

  if (isFiltered) {
    const label = activeCollection
      ? (ALL_COLLECTIONS.find((c) => c.id === activeCollection)?.label ?? "Collection")
      : "Filtered results";
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-sentient text-h3 text-[var(--color-text-primary)]">{label}</h2>
          <span className="text-sm text-[var(--color-text-muted)] font-satoshi">
            {filteredPDFs.length} {filteredPDFs.length === 1 ? "result" : "results"}
          </span>
        </div>
        {filteredPDFs.length === 0 ? (
          <div className="py-20 text-center text-sm text-[var(--color-text-muted)] font-satoshi">
            No PDFs match the selected filters.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
            {filteredPDFs.map((pdf) => <PDFCard key={pdf.id} pdf={pdf} />)}
          </div>
        )}
        <ListEnd />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-12">
      {COACHING_SOURCES.map((src) => (
        <FeedSection
          key={src}
          title={SOURCE_LABEL[src] ?? src}
          sourceId={src}
          pdfs={bySource[src] ?? []}
        />
      ))}

      <section>
        <div className="flex items-baseline justify-between mb-4 px-4 sm:px-6 lg:px-8">
          <h2 className="font-sentient text-h3 text-[var(--color-text-primary)]">Other Collections</h2>
        </div>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 gap-y-6">
            {ALL_COLLECTIONS.map((col, i) => (
              <CollectionTile key={col.id} col={col} colorIndex={i} />
            ))}
          </div>
        </div>
      </section>

      <ListEnd />
    </div>
  );
}
