"use client";

import { cn } from "@/lib/utils";

interface BorderBeamProps {
  active?: boolean;
  children: React.ReactNode;
  className?: string;
  borderRadius?: string;
}

/**
 * Wraps children with an animated gradient border when `active`.
 * The beam travels around the border using a CSS background-position animation.
 */
export function BorderBeam({
  active = false,
  children,
  className,
  borderRadius = "0.625rem",
}: BorderBeamProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Animated border layer */}
      {active && (
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-[1.5px] z-0 animate-border-beam"
          style={{
            borderRadius,
            background:
              "linear-gradient(90deg, transparent 0%, #3730A3 25%, #6366F1 45%, #D97706 55%, #3730A3 75%, transparent 100%)",
            backgroundSize: "300% 100%",
            opacity: 0.7,
          }}
        />
      )}
      {/* Content sits above the beam */}
      <span
        className="relative z-10 block"
        style={{ borderRadius: active ? `calc(${borderRadius} - 1px)` : undefined }}
      >
        {children}
      </span>
    </div>
  );
}
