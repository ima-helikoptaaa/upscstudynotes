"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { MOCK_PDFS } from "@/lib/mock-data";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoginModal } from "@/components/auth/LoginModal";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  Download,
  Bookmark,
  BookmarkCheck,
  FileText,
  Sparkles,
} from "@/components/ui/Icons";
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

export default function PDFDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const pdf = MOCK_PDFS.find((p) => p.id === params.id);
  if (!pdf) notFound();

  const { isSaved, toggleSave, user, openAuthModal } = useStore();
  const saved = isSaved(pdf.id);

  const handleDownload = () => {
    if (!user) {
      openAuthModal(() => window.open(pdf.file_url, "_blank"));
      return;
    }
    window.open(pdf.file_url, "_blank");
  };

  const handleSave = () => {
    if (!user) {
      openAuthModal(() => toggleSave(pdf.id));
      return;
    }
    toggleSave(pdf.id);
  };

  return (
    <AppLayout showRightPanel={false}>
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-6 transition-colors font-satoshi"
      >
        <ArrowLeft size={14} />
        Back to library
      </Link>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        {/* ── Left: Preview ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* PDF thumbnail placeholder */}
          <div className="w-full aspect-[3/4] max-h-[500px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg flex flex-col items-center justify-center gap-3 overflow-hidden">
            <div className="w-16 h-16 rounded-xl bg-[var(--color-primary-light)] flex items-center justify-center">
              <FileText size={28} className="text-[var(--color-primary)]" />
            </div>
            <div className="text-center px-6">
              <p className="font-sentient text-h3 text-[var(--color-text-primary)] mb-1">
                {pdf.pages} pages
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] font-satoshi">
                {pdf.source} · {pdf.year}
              </p>
            </div>
            <Link
              href={`/reader/${pdf.id}`}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-satoshi text-[var(--color-text-primary)] hover:bg-[#F0EFE9] transition-colors"
            >
              Open reader →
            </Link>
          </div>
        </motion.div>

        {/* ── Right: Meta + AI ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="flex flex-col gap-5"
        >
          {/* Title */}
          <div>
            <h1 className="font-sentient text-h2 text-[var(--color-text-primary)] text-balance leading-tight mb-3">
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

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-lg">
            <MetaItem label="Author" value={pdf.author} />
            <MetaItem label="Pages" value={`${pdf.pages}`} />
            <MetaItem label="Year" value={`${pdf.year}`} />
            <MetaItem label="Type" value={pdf.type.toUpperCase()} />
          </div>

          {/* Summary */}
          <div>
            <SectionTitle icon={<Sparkles size={14} />} label="Summary" />
            <p className="text-sm text-[var(--color-text-secondary)] font-satoshi leading-relaxed mt-2">
              {pdf.summary}
            </p>
          </div>

          {/* Flashcards */}
          <div>
            <SectionTitle label="Sample flashcards" />
            <div className="space-y-2 mt-2">
              {FLASHCARDS.map((card) => (
                <FlashCard key={card.id} front={card.front} back={card.back} />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1 sticky bottom-4">
            <Button
              onClick={handleDownload}
              className="flex-1 justify-center"
              size="lg"
            >
              <Download size={16} />
              Download PDF
            </Button>
            <Button
              variant="secondary"
              onClick={handleSave}
              size="lg"
              className={cn(
                saved &&
                  "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent-light)] hover:bg-[var(--color-accent-light)]"
              )}
              aria-label={saved ? "Remove from saved" : "Save"}
            >
              {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            </Button>
          </div>
        </motion.div>
      </div>

      <LoginModal />
    </AppLayout>
  );
}

/* ── Sub-components ─────────────────────────────────────── */

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest font-semibold text-[var(--color-text-muted)] font-satoshi mb-0.5">
        {label}
      </p>
      <p className="text-sm font-medium text-[var(--color-text-primary)] font-satoshi">
        {value}
      </p>
    </div>
  );
}

function SectionTitle({
  label,
  icon,
}: {
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
      {icon}
      <p className="text-xs font-semibold uppercase tracking-widest font-satoshi">
        {label}
      </p>
    </div>
  );
}

function FlashCard({ front, back }: { front: string; back: string }) {
  return (
    <details className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md overflow-hidden">
      <summary className="px-4 py-3 cursor-pointer list-none text-sm font-satoshi font-medium text-[var(--color-text-primary)] flex items-start justify-between gap-2 hover:bg-[#F7F6F2] transition-colors select-none">
        <span>{front}</span>
        <span className="shrink-0 text-[var(--color-text-muted)] group-open:rotate-180 transition-transform text-xs mt-0.5">
          ▾
        </span>
      </summary>
      <div className="px-4 pb-3 pt-2 text-sm text-[var(--color-text-secondary)] font-satoshi border-t border-[var(--color-border)] bg-[var(--color-primary-light)]/30 leading-relaxed">
        {back}
      </div>
    </details>
  );
}
