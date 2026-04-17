"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import useSWR from "swr";
import { useStore } from "@/store/useStore";
import { type PDF } from "@/lib/mock-data";
import { fetcher } from "@/lib/fetcher";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoginModal } from "@/components/auth/LoginModal";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Download, Sparkles } from "@/components/ui/Icons";
import { Bookmark } from "lucide-react";
import { cn, triggerDownload } from "@/lib/utils";

const NAVBAR_H = 64;

function fmtNum(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: string;
  tags: string[];
}

export default function PDFDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: pdf, isLoading } = useSWR<PDF>(`/api/pdfs/${id}`, fetcher);
  const { data: flashcardsData } = useSWR<{ data: Flashcard[] }>(`/api/flashcards/${id}`, fetcher);
  const flashcards = flashcardsData?.data ?? [];
  const { isSaved, toggleSave, user, openAuthModal, showToast } = useStore();
  const saved = pdf ? isSaved(pdf.id) : false;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 animate-pulse">
          <div className="h-4 w-16 bg-[var(--color-surface-alt)] rounded mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
            <div className="h-[60vh] bg-[var(--color-surface-alt)] rounded-xl" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-[var(--color-surface-alt)] rounded" />
              <div className="flex gap-2">
                <div className="h-6 w-14 bg-[var(--color-surface-alt)] rounded-full" />
                <div className="h-6 w-20 bg-[var(--color-surface-alt)] rounded-full" />
              </div>
              <div className="h-32 bg-[var(--color-surface-alt)] rounded-xl mt-4" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }
  if (!pdf) notFound();

  const handleDownload = () => {
    if (!user) { openAuthModal(() => { triggerDownload(pdf.file_url, pdf.title); showToast("Download started"); }); return; }
    triggerDownload(pdf.file_url, pdf.title);
    showToast("Download started");
  };
  const handleSave = () => {
    if (!user) { openAuthModal(() => toggleSave(pdf.id)); return; }
    toggleSave(pdf.id);
  };

  const ctaBar = (
    <div className="flex gap-3">
      <Button onClick={handleDownload} className="flex-1 justify-center" size="lg">
        <Download size={15} />
        Download PDF
      </Button>
      <Button
        variant="secondary"
        onClick={handleSave}
        size="lg"
        className={cn(saved && "border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary-light)] hover:bg-[var(--color-primary-light)]")}
        aria-label={saved ? "Remove from saved" : "Save"}
      >
        <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
      </Button>
    </div>
  );

  const metaContent = (
    <>
      <div className="grid grid-cols-2 gap-px bg-[var(--color-border)] rounded-xl overflow-hidden border border-[var(--color-border)]">
        <MetaItem label="Type"      value={pdf.type.toUpperCase()} span />
        <MetaItem label="Year"      value={`${pdf.year}`} />
        <MetaItem label="Pages"     value={`${pdf.pages}`} />
        <MetaItem label="Downloads" value={fmtNum(pdf.downloads)} />
        <MetaItem label="Saves"     value={fmtNum(pdf.saves)} />
      </div>

      <div>
        <SectionLabel icon={<Sparkles size={13} />} text="Summary" />
        <p className="text-sm text-[var(--color-text-secondary)] font-satoshi leading-relaxed mt-2.5">
          {pdf.summary}
        </p>
      </div>

      {flashcards.length > 0 && (
        <div>
          <SectionLabel text={`Flashcards (${flashcards.length})`} />
          <div className="space-y-2 mt-3">
            {flashcards.map((card, i) => (
              <FlashCard key={card.id} index={i} front={card.question} back={card.answer} />
            ))}
          </div>
        </div>
      )}
    </>
  );

  const PANEL_H = `calc(100vh - ${NAVBAR_H}px)`;

  return (
    <AppLayout>

      {/* ── DESKTOP ─────────────────────────────────────────────
          Outer wrapper is exactly viewport-height so it never
          scrolls. Both columns fill that height independently.
          No framer-motion y-transforms inside overflow:hidden —
          only opacity fades to avoid clip-at-bottom bugs.
      ──────────────────────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col"
        style={{ height: PANEL_H }}
      >
        {/* Back strip */}
        <div className="shrink-0 px-10 pt-4 pb-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors font-satoshi"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>

        {/* Two-column grid — fills remaining height, clips overflow */}
        <div className="flex-1 min-h-0 grid grid-cols-[1fr_360px] gap-8 px-10 pb-5">

          {/* Left: PDF viewer — opacity-only fade (no y shift) */}
          <motion.div
            className="min-h-0 h-full rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            <iframe
              src={`${pdf.file_url}#toolbar=0&navpanes=0&scrollbar=1`}
              className="w-full h-full"
              title={pdf.title}
            />
          </motion.div>

          {/* Right: info column — flex col, fills grid cell height */}
          <motion.div
            className="min-h-0 h-full flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.05 }}
          >
            {/* Title + tags — always visible, never scrolls away */}
            <div className="shrink-0 pb-4 border-b border-[var(--color-border)] mb-4">
              <h1 className="font-sentient text-[1.5rem] leading-snug tracking-tight text-[var(--color-text-primary)] mb-3">
                {pdf.title}
              </h1>
              <div className="flex flex-wrap gap-1.5">
                <Tag label={pdf.subject} variant="subject" />
                <Tag label={pdf.source} variant="collection" />
                {pdf.tags.map((tag) => <Tag key={tag} label={tag} />)}
              </div>
            </div>

            {/* Scrollable meta — flex-1 + min-h-0 ensures it shrinks to fit */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide space-y-6 pr-0.5">
              {metaContent}
            </div>

            {/* CTA bar — always anchored to bottom */}
            <div className="shrink-0 border-t border-[var(--color-border)] pt-4 pb-1 mt-3">
              {ctaBar}
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── MOBILE ──────────────────────────────────────────────
          Normal page scroll. Fixed CTA bar at bottom.
      ──────────────────────────────────────────────────────── */}
      <div className="lg:hidden">
        {/* Back */}
        <div className="px-4 sm:px-6 pt-5 pb-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors font-satoshi"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>

        <div className="px-4 sm:px-6 pb-[80px]">
          {/* Title + tags */}
          <div className="mb-4">
            <h1 className="font-sentient text-[1.4rem] leading-snug tracking-tight text-[var(--color-text-primary)] mb-3">
              {pdf.title}
            </h1>
            <div className="flex flex-wrap gap-1.5">
              <Tag label={pdf.subject} variant="subject" />
              <Tag label={pdf.source} variant="collection" />
              {pdf.tags.map((tag) => <Tag key={tag} label={tag} />)}
            </div>
          </div>

          {/* PDF viewer */}
          <div
            className="w-full rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm mb-6"
            style={{ height: "min(75vw, 440px)" }}
          >
            <iframe
              src={`${pdf.file_url}#toolbar=0&navpanes=0&scrollbar=1`}
              className="w-full h-full"
              title={pdf.title}
            />
          </div>

          {/* Meta */}
          <div className="space-y-6">
            {metaContent}
          </div>
        </div>
      </div>

      {/* Mobile CTAs — fixed at bottom of viewport */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-[var(--color-surface)] border-t border-[var(--color-border)] px-4 py-3">
        {ctaBar}
      </div>

      <LoginModal />
    </AppLayout>
  );
}

/* ── Sub-components ──────────────────────────────────────────── */

function MetaItem({ label, value, span }: { label: string; value: string; span?: boolean }) {
  return (
    <div className={`px-4 py-3 bg-[var(--color-surface-alt)]${span ? " col-span-2" : ""}`}>
      <p className="text-[10px] uppercase tracking-widest font-semibold text-[var(--color-text-muted)] font-satoshi mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-[var(--color-text-primary)] font-satoshi">{value}</p>
    </div>
  );
}

function SectionLabel({ text, icon }: { text: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon && <span className="text-[var(--color-text-muted)]">{icon}</span>}
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)] font-satoshi">{text}</p>
    </div>
  );
}

function FlashCard({ front, back, index }: { front: string; back: string; index: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="cursor-pointer select-none"
      style={{ perspective: "1200px" }}
      onClick={() => setFlipped((v) => !v)}
    >
      <motion.div
        style={{ transformStyle: "preserve-3d", position: "relative" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {/* Front face */}
        <div
          className="rounded-xl p-4 min-h-[140px] flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background: "var(--color-primary-light)",
            border: "1px solid rgba(99,102,241,0.18)",
          }}
        >
          <div className="flex items-start gap-2.5">
            <span className="shrink-0 size-5 rounded-md bg-[var(--color-primary)] text-white text-[10px] font-bold font-satoshi flex items-center justify-center mt-0.5">
              {index + 1}
            </span>
            <p className="text-[13px] font-satoshi font-medium text-[var(--color-text-primary)] leading-snug text-pretty">
              {front}
            </p>
          </div>
          <p className="text-[10.5px] font-satoshi text-[var(--color-primary)]/45 text-right mt-3">
            Tap to reveal →
          </p>
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 rounded-xl p-4 flex flex-col justify-between bg-white"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div className="flex items-start gap-2.5">
            <span className="shrink-0 size-5 rounded-md bg-emerald-500 text-white text-[10px] font-bold font-satoshi flex items-center justify-center mt-0.5">
              A
            </span>
            <p className="text-[13px] font-satoshi text-[var(--color-text-secondary)] leading-relaxed text-pretty">
              {back}
            </p>
          </div>
          <p className="text-[10.5px] font-satoshi text-[var(--color-text-muted)] text-right mt-3">
            ← Tap to flip back
          </p>
        </div>
      </motion.div>
    </div>
  );
}
