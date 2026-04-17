"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, BookmarkX } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PDFCard } from "@/components/pdf/PDFCard";
import { CollectionTile } from "@/components/pdf/CollectionTile";
import { LoginModal } from "@/components/auth/LoginModal";
import { useStore } from "@/store/useStore";
import useSWR from "swr";
import { ALL_COLLECTIONS, SOURCE_LABEL as SL, type CollectionDef, type PDF } from "@/lib/mock-data";
import { fetcher } from "@/lib/fetcher";
import { cn } from "@/lib/utils";

type Tab = "pdfs" | "collections";

export default function SavedPage() {
  const [tab, setTab] = useState<Tab>("pdfs");
  const { savedItems, savedCollections } = useStore();

  const { data: allPdfsData } = useSWR<{ data: PDF[] }>("/api/pdfs?limit=500", fetcher);
  const allPdfs = allPdfsData?.data ?? [];
  const savedPDFs = allPdfs.filter((p) => savedItems.includes(p.id));

  const savedCols = savedCollections
    .map((id): CollectionDef | null => {
      const col = ALL_COLLECTIONS.find((c) => c.id === id);
      if (col) return col;
      if (id in SL) return { id, label: SL[id], subjectFilter: null, sourceFilter: id };
      return null;
    })
    .filter((c): c is CollectionDef => c !== null);

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-7">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-satoshi text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <ArrowLeft size={15} />
            Home
          </Link>
          <div className="w-px h-4 bg-[var(--color-border)]" />
          <div className="flex items-center gap-2.5">
            <Bookmark size={17} className="text-[var(--color-primary)]" />
            <h1 className="font-sentient text-h3 text-[var(--color-text-primary)]">Saved</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-[var(--color-surface-muted)] rounded-xl w-fit mb-8">
          <TabBtn active={tab === "pdfs"} onClick={() => setTab("pdfs")}>
            PDFs{savedPDFs.length > 0 ? ` (${savedPDFs.length})` : ""}
          </TabBtn>
          <TabBtn active={tab === "collections"} onClick={() => setTab("collections")}>
            Collections{savedCols.length > 0 ? ` (${savedCols.length})` : ""}
          </TabBtn>
        </div>

        {/* Content */}
        {tab === "pdfs" ? (
          savedPDFs.length === 0 ? (
            <EmptyState
              icon={<Bookmark size={24} className="text-[var(--color-text-muted)]" />}
              title="Nothing saved yet"
              body="Bookmark PDFs while browsing and they'll appear here for quick access."
            />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
                {savedPDFs.map((pdf) => (
                  <PDFCard key={pdf.id} pdf={pdf} />
                ))}
              </div>
              <ListEnd />
            </>
          )
        ) : (
          savedCols.length === 0 ? (
            <EmptyState
              icon={<BookmarkX size={24} className="text-[var(--color-text-muted)]" />}
              title="No saved collections"
              body="Save collections from the library or collection pages to find them here quickly."
            />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 gap-y-6">
                {savedCols.map((col, i) => (
                  <CollectionTile key={col.id} col={col} colorIndex={i} />
                ))}
              </div>
              <ListEnd />
            </>
          )
        )}
      </div>
      <LoginModal />
    </AppLayout>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-lg text-sm font-medium font-satoshi transition-all",
        active
          ? "bg-white text-[var(--color-text-primary)]"
          : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
      )}
    >
      {children}
    </button>
  );
}

function ListEnd() {
  return (
    <div className="flex items-center gap-4 py-12">
      <div className="flex-1 h-px bg-[var(--color-border)]" />
      <span className="text-[11px] text-[var(--color-text-muted)] font-satoshi tracking-widest uppercase">End of list</span>
      <div className="flex-1 h-px bg-[var(--color-border)]" />
    </div>
  );
}

function EmptyState({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center mb-5">
        {icon}
      </div>
      <h2 className="font-sentient text-h3 text-[var(--color-text-primary)] mb-2">{title}</h2>
      <p className="text-sm text-[var(--color-text-secondary)] font-satoshi max-w-xs leading-relaxed mb-6">{body}</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-primary)] text-white text-sm font-satoshi font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
      >
        Browse library
      </Link>
    </div>
  );
}
