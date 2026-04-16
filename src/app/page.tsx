"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { SearchBar } from "@/components/search/SearchOverlay";
import { PDFFeed } from "@/components/pdf/PDFFeed";
import { FilterBar } from "@/components/ui/FilterBar";
import { LoginModal } from "@/components/auth/LoginModal";
import { HeroAscii } from "@/components/ui/HeroAscii";

export default function HomePage() {
  return (
    <AppLayout>
      {/* ── Hero section ───────────────────────────────────── */}
      <div className="relative overflow-hidden">
        {/* Radial glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(55,48,163,0.09) 0%, rgba(55,48,163,0.03) 50%, transparent 75%)",
          }}
        />

        {/* Parliament ASCII art — scrolls with hero */}
        <HeroAscii />

        {/* Decorative bottom rule */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, var(--color-border) 30%, var(--color-border) 70%, transparent)" }}
        />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 relative">
          <div className="text-center mb-8">
            <p className="text-[11px] text-[var(--color-text-muted)] font-satoshi uppercase tracking-[0.18em] mb-3">
              250+ curated PDFs · Top coaching institutes
            </p>
            <h1 className="font-sentient text-h1 text-[var(--color-text-primary)] text-balance leading-tight">
              Study smarter, score higher
            </h1>
          </div>

          <div className="max-w-[600px] mx-auto">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* ── Feed ─────────────────────────────────────────────── */}
      <div className="pb-16 pt-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <FilterBar />
        </div>
        <PDFFeed />
      </div>

      <LoginModal />
    </AppLayout>
  );
}
