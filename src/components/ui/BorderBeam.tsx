"use client";

import { cn } from "@/lib/utils";

type BeamSize = "line" | "sm" | "md" | "lg";
type ColorVariant = "ocean" | "fire" | "aurora";

interface BorderBeamProps {
  children: React.ReactNode;
  size?: BeamSize;
  colorVariant?: ColorVariant;
  duration?: number;
  strength?: number;
  className?: string;
  bgColor?: string;
  borderRadius?: string;
  active?: boolean;
}

const BEAM_COLORS: Record<ColorVariant, (s: number) => [string, string, string]> = {
  ocean:  (s) => [`rgba(14,165,233,${s})`,  `rgba(56,189,248,${s})`,  `rgba(14,165,233,${s * 0.35})`],
  fire:   (s) => [`rgba(249,115,22,${s})`,  `rgba(239,68,68,${s})`,   `rgba(249,115,22,${s * 0.35})`],
  aurora: (s) => [`rgba(139,92,246,${s})`,  `rgba(236,72,153,${s})`,  `rgba(6,182,212,${s * 0.35})`],
};

const BEAM_WIDTH: Record<BeamSize, number> = {
  line: 1,
  sm:   1.5,
  md:   2,
  lg:   3,
};

export function BorderBeam({
  children,
  size = "sm",
  colorVariant = "ocean",
  duration = 4,
  strength = 0.6,
  className,
  bgColor = "#ffffff",
  borderRadius = "9999px",
  active,
}: BorderBeamProps) {
  const resolvedSize: BeamSize = active !== undefined ? (active ? "sm" : "line") : size;

  const [c1, c2, c3] = BEAM_COLORS[colorVariant](strength);
  const beamWidth = BEAM_WIDTH[resolvedSize];
  const innerRadius =
    resolvedSize === "line"
      ? `calc(${borderRadius} - 1px)`
      : `calc(${borderRadius} - ${beamWidth}px)`;

  return (
    <div
      className={cn("relative w-full", className)}
      style={{
        padding: beamWidth,
        borderRadius,
        background: `conic-gradient(from var(--beam-angle), transparent 0deg, ${c1} 40deg, ${c2} 80deg, ${c3} 120deg, transparent 180deg, transparent 360deg)`,
        animation: `beam-rotate ${duration}s linear infinite`,
      }}
    >
      <div style={{ borderRadius: innerRadius, background: bgColor, position: "relative" }}>
        {children}
      </div>
    </div>
  );
}
