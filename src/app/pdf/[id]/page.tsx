"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useStore } from "@/store/useStore";
import { MOCK_PDFS } from "@/lib/mock-data";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoginModal } from "@/components/auth/LoginModal";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Download, Bookmark, BookmarkCheck, Sparkles } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

const FLASHCARDS = [
  {
    id: 1,
    front: "What is the Preamble of the Indian Constitution?",
    back: "It declares India a Sovereign, Socialist, Secular, Democratic Republic ensuring Justice, Liberty, Equality, and Fraternity.",
  },
  {
    id: 2,
    front: "Name the Fundamental Rights guaranteed by the Indian Constitution.",
    back: "Right to Equality, Right to Freedom, Right against Exploitation, Right to Freedom of Religion, Cultural & Educational Rights, Right to Constitutional Remedies.",
  },
  {
    id: 3,
    front: "What is the significance of Article 32?",
    back: "Dr. Ambedkar called it the 'heart and soul' of the Constitution. It guarantees the right to move the Supreme Court for enforcement of Fundamental Rights.",
  },
];

export default function PDFDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const pdf = MOCK_PDFS.find((p) => p.id === id);
  if (!pdf) notFound();

  const { isSaved, toggleSave, user, openAuthModal } = useStore();
  const saved = isSaved(pdf.id);

  const handleDownload = () => {
    if (!user) { openAuthModal(() => window.open(pdf.file_url, "_blank")); return; }
    window.open(pdf.file_url, "_blank");
  };
  const handleSave = () => {
    if (!user) { openAuthModal(() => toggleSave(pdf.id)); return; }
    toggleSave(pdf.id);
  };

  const VIEWER_H = "calc(100vh - 104px)";

  return (
    <AppLayout>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-7">

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors font-satoshi mb-6"
        >
          <ArrowLeft size={14} />
          Back to library
        </Link>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* ── Left: PDF viewer (sticky) ─────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="sticky top-[72px]"
          >
            <div
              className="w-full rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm"
              style={{ height: VIEWER_H }}
            >
              <iframe
                src={`${pdf.file_url}#toolbar=0&navpanes=0&scrollbar=1`}
                className="w-full h-full"
                title={pdf.title}
              />
            </div>
          </motion.div>

          {/* ── Right: scrollable meta + sticky actions ────── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.06 }}
            className="sticky top-[72px] flex flex-col"
            style={{ height: VIEWER_H }}
          >
            {/* Scrollable content */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-6 pr-1 pb-4">

              {/* Title + tags */}
              <div>
                <h1 className="font-sentient text-[1.55rem] leading-snug tracking-tight text-[var(--color-text-primary)] mb-3">
                  {pdf.title}
                </h1>
                <div className="flex flex-wrap gap-1.5">
                  <Tag label={pdf.subject} variant="subject" />
                  <Tag label={pdf.source} variant="source" />
                  {pdf.tags.map((tag) => (
                    <Tag key={tag} label={tag} />
                  ))}
                </div>
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-px bg-[var(--color-border)] rounded-xl overflow-hidden border border-[var(--color-border)]">
                <MetaItem label="Author" value={pdf.author} />
                <MetaItem label="Pages"  value={`${pdf.pages}`} />
                <MetaItem label="Year"   value={`${pdf.year}`} />
                <MetaItem label="Type"   value={pdf.type.toUpperCase()} />
              </div>

              {/* Summary */}
              <div>
                <SectionLabel icon={<Sparkles size={13} />} text="AI Summary" />
                <p className="text-sm text-[var(--color-text-secondary)] font-satoshi leading-relaxed mt-2.5">
                  {pdf.summary}
                </p>
              </div>

              {/* Flashcards */}
              <div>
                <SectionLabel text="Sample Flashcards" />
                <div className="space-y-2 mt-3">
                  {FLASHCARDS.map((card, i) => (
                    <FlashCard key={card.id} index={i} front={card.front} back={card.back} />
                  ))}
                </div>
              </div>

            </div>

            {/* Sticky actions — always visible at bottom */}
            <div className="shrink-0 border-t border-[var(--color-border)] pt-4 flex gap-2">
              <Button onClick={handleDownload} className="flex-1 justify-center" size="lg">
                <Download size={15} />
                Download PDF
              </Button>
              <Button
                variant="secondary"
                onClick={handleSave}
                size="lg"
                className={cn(saved && "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent-light)] hover:bg-[var(--color-accent-light)]")}
                aria-label={saved ? "Remove from saved" : "Save"}
              >
                {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              </Button>
            </div>
          </motion.div>

        </div>
      </div>

      <LoginModal />
    </AppLayout>
  );
}

/* ── Sub-components ──────────────────────────────────────────── */

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3 bg-[var(--color-surface-alt)]">
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
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden border transition-all duration-200",
        open ? "border-[var(--color-primary)]/25 shadow-sm" : "border-[var(--color-border)]"
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full flex items-start justify-between gap-3 px-4 py-3.5 text-left transition-colors",
          open
            ? "bg-[var(--color-primary-light)]"
            : "bg-[var(--color-surface)] hover:bg-[var(--color-surface-alt)]"
        )}
      >
        <div className="flex items-start gap-2.5 min-w-0">
          <span
            className={cn(
              "shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold font-satoshi mt-0.5 transition-colors",
              open
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-surface-alt)] text-[var(--color-text-muted)]"
            )}
          >
            {index + 1}
          </span>
          <span className="text-sm font-satoshi font-medium text-[var(--color-text-primary)] leading-snug">
            {front}
          </span>
        </div>
        <ChevronDown
          size={15}
          className={cn(
            "shrink-0 mt-0.5 transition-transform duration-200",
            open ? "rotate-180 text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pt-3 pb-4 flex gap-2.5 bg-[var(--color-surface)] border-t border-[var(--color-border)]">
              <div className="w-5 shrink-0" />
              <p className="text-sm text-[var(--color-text-secondary)] font-satoshi leading-relaxed">
                {back}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
