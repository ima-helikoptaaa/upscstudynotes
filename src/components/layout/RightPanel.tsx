"use client";

import Link from "next/link";
import { COLLECTIONS, TRENDING_PDFS } from "@/lib/mock-data";
import { useStore } from "@/store/useStore";
import { Tag } from "@/components/ui/Tag";
import { TrendingUp, LayoutGrid, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const SUBJECT_ACCENT: Record<string, string> = {
  GS1: "bg-blue-400",
  GS2: "bg-emerald-400",
  GS3: "bg-orange-400",
  GS4: "bg-purple-400",
  CA: "bg-amber-400",
  Optional: "bg-pink-400",
  ncert: "bg-sky-400",
  pyq: "bg-rose-400",
};

export function RightPanel() {
  const { setActiveCollection, activeCollection } = useStore();

  return (
    <aside className="hidden xl:flex flex-col w-[232px] shrink-0 bg-[var(--color-surface-alt)] border-l border-[var(--color-border)]">
      <div className="flex flex-col gap-6 p-5 overflow-y-auto scrollbar-hide sticky top-0 max-h-screen">
        {/* ── Collections ────────────────────────────── */}
        <section>
          <PanelHeader icon={<LayoutGrid size={12} />} label="Collections" />
          <div className="space-y-1 mt-2.5">
            {COLLECTIONS.slice(0, 5).map((col) => (
              <button
                key={col.id}
                onClick={() => setActiveCollection(col.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left transition-colors duration-150",
                  activeCollection === col.id
                    ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-border)]"
                )}
              >
                <span
                  className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    SUBJECT_ACCENT[col.subjectFilter ?? col.id] ?? "bg-gray-300"
                  )}
                />
                <span className="text-xs font-satoshi tracking-satoshi truncate">
                  {col.label}
                </span>
              </button>
            ))}
            <Link
              href="/collections"
              className="flex items-center gap-1 px-3 pt-1 text-[11px] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] font-satoshi transition-colors"
            >
              View all <ExternalLink size={10} />
            </Link>
          </div>
        </section>

        {/* ── Trending ───────────────────────────────── */}
        <section>
          <PanelHeader icon={<TrendingUp size={12} />} label="Trending" />
          <div className="space-y-2 mt-2.5">
            {TRENDING_PDFS.map((pdf, i) => (
              <Link key={pdf.id} href={`/pdf/${pdf.id}`}>
                <div className="flex items-start gap-2.5 p-2.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)] transition-colors group">
                  <span className="text-[11px] font-semibold text-[var(--color-text-muted)] font-satoshi mt-0.5 w-3.5 shrink-0 text-center">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors leading-snug line-clamp-2 font-satoshi tracking-satoshi">
                      {pdf.title}
                    </p>
                    <Tag label={pdf.subject} variant="subject" className="mt-1.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Quick links ────────────────────────────── */}
        <section>
          <PanelHeader label="Quick links" />
          <div className="mt-2.5 space-y-1">
            {[
              { label: "UPSC Official", href: "https://upsc.gov.in" },
              { label: "Mains Syllabus", href: "#" },
              { label: "Prelims Syllabus", href: "#" },
              { label: "PYQ Repository", href: "#" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-satoshi text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-border-strong)] transition-colors"
              >
                {link.label}
                <ExternalLink size={10} className="opacity-50" />
              </a>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}

function PanelHeader({
  label,
  icon,
}: {
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
      {icon}
      <p className="text-[10px] font-semibold uppercase tracking-widest font-satoshi">
        {label}
      </p>
    </div>
  );
}
