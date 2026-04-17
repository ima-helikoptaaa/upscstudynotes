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
  const tabH = mini ? 10 : 12;

  const count = MOCK_PDFS.filter(
    (p) =>
      (!col.subjectFilter || p.subject === col.subjectFilter) &&
      (!col.sourceFilter || p.source === col.sourceFilter)
  ).length;

  return (
    <button
      onClick={() => router.push(`/collection/${col.id}`)}
      className="group w-full text-left"
      /* paddingTop = tab height + gap; paddingBottom = space for stack peek */
      style={{ paddingTop: tabH + 4, paddingBottom: 10, paddingLeft: 2, paddingRight: 2 }}
    >
      {/* Stacking context so z-index works locally */}
      <div className="relative" style={{ isolation: "isolate" }}>

        {/* Back paper — peeks most from below, no rotation */}
        <span
          aria-hidden
          className="absolute rounded-xl"
          style={{
            top: tabH + 2,
            left: 5,
            right: 5,
            bottom: -9,
            backgroundColor: colors.back,
            border: "1px solid rgba(0,0,0,0.04)",
          }}
        />

        {/* Mid paper — peeks a bit less */}
        <span
          aria-hidden
          className="absolute rounded-xl"
          style={{
            top: tabH,
            left: 3,
            right: 3,
            bottom: -5,
            backgroundColor: colors.mid,
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        />

        {/* Folder — z-index 1 keeps it above the paper stack */}
        <div
          className="relative transition-transform duration-200 group-hover:-translate-y-1"
          style={{ zIndex: 1 }}
        >
          {/* Tab ear */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: -tabH,
              left: 0,
              width: "42%",
              height: tabH + 2,
              backgroundColor: colors.main,
              borderRadius: "5px 5px 0 0",
              border: "1px solid rgba(0,0,0,0.06)",
              borderBottom: "none",
            }}
          />

          {/* Folder body */}
          <div
            className="border border-black/[0.06]"
            style={{
              backgroundColor: colors.main,
              padding: mini ? "12px 14px" : "14px 16px",
              borderRadius: "0 8px 8px 8px",
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
        </div>

      </div>
    </button>
  );
}
