"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Bookmark } from "lucide-react";
import useSWR from "swr";
import { SOURCE_LABEL, type PDF } from "@/lib/mock-data";
import { fetcher } from "@/lib/fetcher";
import { AppLayout } from "@/components/layout/AppLayout";
import { PDFCard } from "@/components/pdf/PDFCard";
import { LoginModal } from "@/components/auth/LoginModal";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

function ListEnd() {
  return (
    <div className="flex items-center gap-4 py-12">
      <div className="flex-1 h-px bg-[var(--color-border)]" />
      <span className="text-[11px] text-[var(--color-text-muted)] font-satoshi tracking-widest uppercase">End of list</span>
      <div className="flex-1 h-px bg-[var(--color-border)]" />
    </div>
  );
}

export default function SourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: sourceId } = use(params);
  const decodedSource = decodeURIComponent(sourceId);

  const { isSourceSaved, toggleSaveSource, user, openAuthModal } = useStore();
  const saved = isSourceSaved(decodedSource);

  const { data, isLoading } = useSWR<{ data: PDF[] }>(
    `/api/pdfs?source=${encodeURIComponent(decodedSource)}&limit=100`,
    fetcher
  );
  const pdfs = data?.data ?? [];
  const label = SOURCE_LABEL[decodedSource] ?? decodedSource;

  const handleSave = () => {
    if (!user) { openAuthModal(() => toggleSaveSource(decodedSource)); return; }
    toggleSaveSource(decodedSource);
  };

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-6 transition-colors font-satoshi"
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>

        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
              <h1 className="font-sentient text-h2 text-[var(--color-text-primary)]">{label}</h1>
            <p className="text-sm text-[var(--color-text-secondary)] font-satoshi mt-1.5">
              {isLoading ? "..." : `${pdfs.length} ${pdfs.length === 1 ? "document" : "documents"}`}
            </p>
          </div>
          <button
            onClick={handleSave}
            className={cn(
              "shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-satoshi font-medium transition-all mt-1",
              saved
                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                : "bg-white border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            )}
          >
            <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
            {saved ? "Saved" : "Save collection"}
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 animate-pulse">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[252px] bg-[var(--color-surface-alt)] rounded-2xl" />
            ))}
          </div>
        ) : pdfs.length === 0 ? (
          <div className="py-24 text-center text-sm text-[var(--color-text-muted)] font-satoshi">
            No PDFs in this collection yet.
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4"
          >
            {pdfs.map((pdf) => (
              <PDFCard key={pdf.id} pdf={pdf} />
            ))}
          </motion.div>
        )}

        <ListEnd />
      </div>
      <LoginModal />
    </AppLayout>
  );
}
