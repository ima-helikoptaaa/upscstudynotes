"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { MOCK_PDFS, type CollectionDef } from "@/lib/mock-data";

export type { CollectionDef };

const PASTEL_PALETTE = [
  { main: "#DBEAFE", mid: "#BFDBFE", back: "#EFF6FF" },
  { main: "#D1FAE5", mid: "#A7F3D0", back: "#ECFDF5" },
  { main: "#FEF3C7", mid: "#FDE68A", back: "#FFFBEB" },
  { main: "#EDE9FE", mid: "#DDD6FE", back: "#F5F3FF" },
  { main: "#FEE2E2", mid: "#FECACA", back: "#FEF2F2" },
  { main: "#FCE7F3", mid: "#FBCFE8", back: "#FDF2F8" },
  { main: "#CFFAFE", mid: "#A5F3FC", back: "#ECFEFF" },
  { main: "#FEF9C3", mid: "#FEF08A", back: "#FEFCE8" },
  { main: "#F0FDF4", mid: "#DCFCE7", back: "#F7FEF8" },
  { main: "#E0F2FE", mid: "#BAE6FD", back: "#F0F9FF" },
];

interface CollectionTileProps {
  col: CollectionDef;
  colorIndex?: number;
  mini?: boolean;
}

export function CollectionTile({ col, colorIndex = 0, mini = false }: CollectionTileProps) {
  const router = useRouter();
  const colors = PASTEL_PALETTE[colorIndex % PASTEL_PALETTE.length];

  const count = MOCK_PDFS.filter(
    (p) =>
      (!col.subjectFilter || p.subject === col.subjectFilter) &&
      (!col.sourceFilter || p.source === col.sourceFilter)
  ).length;

  return (
    <button
      onClick={() => router.push(`/collection/${col.id}`)}
      className="group relative w-full text-left"
      style={{ paddingTop: mini ? 8 : 10, paddingLeft: 2, paddingRight: 2 }}
    >
      {/* Back card 2 */}
      <span
        aria-hidden
        className="absolute rounded-xl"
        style={{
          top: 0, left: 6, right: -6, bottom: 3,
          backgroundColor: colors.back,
          transform: "rotate(3.5deg)",
          transformOrigin: "bottom center",
        }}
      />
      {/* Back card 1 */}
      <span
        aria-hidden
        className="absolute rounded-xl"
        style={{
          top: mini ? 3 : 4, left: 3, right: -3, bottom: 1,
          backgroundColor: colors.mid,
          transform: "rotate(1.5deg)",
          transformOrigin: "bottom center",
        }}
      />
      {/* Main card */}
      <div
        className="relative rounded-xl border border-black/[0.06] transition-transform duration-200 group-hover:-translate-y-1"
        style={{
          backgroundColor: colors.main,
          padding: mini ? "12px 14px" : "14px 16px",
        }}
      >
        <p
          className={`font-medium text-[var(--color-text-primary)] font-satoshi leading-snug line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors ${mini ? "text-[13px]" : "text-[15px]"}`}
        >
          {col.label}
        </p>
        <div className="flex items-center justify-between mt-1">
          <p className={`text-[var(--color-text-muted)] font-satoshi ${mini ? "text-[11px]" : "text-xs"}`}>
            {count} PDFs
          </p>
          {!mini && (
            <div className="opacity-0 group-hover:opacity-100 transition-all text-[var(--color-text-muted)]">
              <ArrowRight size={13} />
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
