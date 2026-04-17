"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, Bookmark } from "lucide-react";
import { useStore } from "@/store/useStore";

function SuccessSparkles() {
  const dots = [
    { x: "25%", delay: 0 },
    { x: "50%", delay: 0.3 },
    { x: "72%", delay: 0.6 },
    { x: "15%", delay: 0.9 },
    { x: "85%", delay: 0.15 },
    { x: "40%", delay: 0.75 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
      {dots.map((d, i) => (
        <motion.div
          key={i}
          className="absolute bottom-10 w-1.5 h-1.5 rounded-full"
          style={{ left: d.x, background: "rgba(167,139,250,0.8)" }}
          initial={{ y: 0, opacity: 0, scale: 0 }}
          animate={{ y: -100, opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0] }}
          transition={{ duration: 2, delay: d.delay, repeat: Infinity, repeatDelay: 1.2, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export function WelcomeModal() {
  const { isWelcomeOpen, closeWelcome, user } = useStore();
  const firstName = user?.name?.split(" ")[0] ?? null;

  return (
    <AnimatePresence>
      {isWelcomeOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-[3px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeWelcome}
          />
          <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
            <motion.div
              className="w-full max-w-[680px] bg-[var(--color-surface)] rounded-2xl overflow-hidden shadow-2xl shadow-black/25"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex min-h-[460px]">

                {/* ── Left: dot grid + sparkles ── */}
                <div className="hidden md:flex w-[180px] shrink-0 flex-col bg-[#161529] relative overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <SuccessSparkles />

                  {/* Glowing orb in center */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)" }}
                  />
                </div>

                {/* ── Right: content ── */}
                <div className="flex-1 flex flex-col justify-between px-8 py-8">

                  {/* Top: greeting */}
                  <div>
                    <p className="text-[10px] font-satoshi font-bold uppercase tracking-[0.18em] text-[var(--color-primary)] mb-3">
                      You&apos;re all set
                    </p>
                    <h2 className="font-sentient text-[1.9rem] leading-tight text-[var(--color-text-primary)]">
                      {firstName ? `Welcome, ${firstName}!` : "Welcome aboard!"}
                    </h2>
                    <p className="text-[var(--color-text-secondary)] font-satoshi text-sm mt-2 leading-relaxed max-w-xs">
                      Your UPSC journey starts here. Every session brings you one step closer to selection.
                    </p>
                  </div>

                  {/* Middle: feature list */}
                  <div className="space-y-4 my-7">
                    <FeatureRow
                      icon={<BookOpen size={18} />}
                      label="250+ curated PDFs"
                      sub="Top coaching institutes, all papers"
                    />
                    <FeatureRow
                      icon={<Sparkles size={18} />}
                      label="AI briefs & Q&A"
                      sub="Summaries and flashcards for any topic"
                    />
                    <FeatureRow
                      icon={<Bookmark size={18} />}
                      label="Personal library"
                      sub="Save PDFs and collections for quick access"
                    />
                  </div>

                  {/* Bottom: CTA */}
                  <button
                    onClick={closeWelcome}
                    className="w-full py-3 rounded-xl text-[0.9375rem] font-satoshi font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg, #3730A3, #4F46E5)" }}
                  >
                    Start exploring
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function FeatureRow({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
  return (
    <div className="flex items-center gap-3.5">
      <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center bg-[var(--color-primary-light)] text-[var(--color-primary)]">
        {icon}
      </div>
      <div>
        <p className="text-sm font-satoshi font-semibold text-[var(--color-text-primary)] leading-tight">{label}</p>
        <p className="text-xs font-satoshi text-[var(--color-text-muted)] mt-0.5 leading-snug">{sub}</p>
      </div>
    </div>
  );
}
