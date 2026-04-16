"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Sparkles, Zap } from "lucide-react";
import { useStore } from "@/store/useStore";
import { LoginAscii } from "@/components/ui/LoginAscii";

/* Sparkle dots that animate upward and fade */
function SuccessSparkles() {
  const dots = [
    { x: "30%", delay: 0 },
    { x: "55%", delay: 0.3 },
    { x: "70%", delay: 0.6 },
    { x: "20%", delay: 0.9 },
    { x: "80%", delay: 0.15 },
    { x: "45%", delay: 0.75 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
      {dots.map((d, i) => (
        <motion.div
          key={i}
          className="absolute bottom-8 w-1 h-1 rounded-full"
          style={{ left: d.x, background: "rgba(167,139,250,0.7)" }}
          initial={{ y: 0, opacity: 0, scale: 0 }}
          animate={{ y: -80, opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0] }}
          transition={{ duration: 1.8, delay: d.delay, repeat: Infinity, repeatDelay: 1.5, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export function WelcomeModal() {
  const { isWelcomeOpen, closeWelcome, user } = useStore();

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
              className="w-full max-w-[700px] bg-[var(--color-surface)] rounded-2xl overflow-hidden shadow-2xl shadow-black/25"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex min-h-[480px]">

                {/* ── Left: ASCII panel (same as login, all dots complete) ── */}
                <div className="hidden md:flex w-[200px] shrink-0 flex-col bg-[#161529] px-5 py-6 relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                      backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                  <SuccessSparkles />
                  <div className="relative z-10 flex flex-col h-full">
                    <LoginAscii step="prep" />
                    {/* All 4 dots filled */}
                    <div className="flex gap-1.5 mt-auto">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="h-[3px] flex-1 rounded-full bg-white/50" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Right: Welcome content ─────────────────────── */}
                <div className="flex-1 flex flex-col px-7 py-7">
                  {/* Close */}
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={closeWelcome}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* Greeting */}
                  <div className="flex-1 flex flex-col justify-center gap-6">
                    <div>
                      <p className="text-[11px] font-satoshi font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
                        You&apos;re all set
                      </p>
                      <h2 className="font-sentient text-[1.75rem] leading-tight text-[var(--color-text-primary)]">
                        Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : " aboard"}!
                      </h2>
                      <p className="text-[var(--color-text-secondary)] font-satoshi text-sm mt-2 leading-relaxed">
                        Your UPSC journey starts here. Every session brings you closer to selection.
                      </p>
                    </div>

                    {/* Feature list */}
                    <div className="space-y-3">
                      <FeatureRow icon={<BookOpen size={14} />} text="Browse 250+ curated PDFs from top coaching institutes" />
                      <FeatureRow icon={<Sparkles size={14} />} text="AI briefs, summaries, and Q&A for any topic" />
                      <FeatureRow icon={<Zap size={14} />} text="Save PDFs and collections to your personal library" />
                    </div>

                    {/* CTA */}
                    <button
                      onClick={closeWelcome}
                      className="w-full py-3 rounded-xl text-sm font-satoshi font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                      style={{ background: "linear-gradient(135deg, #3730A3, #4F46E5)" }}
                    >
                      Start exploring →
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function FeatureRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-md shrink-0 flex items-center justify-center bg-[var(--color-primary-light)] text-[var(--color-primary)] mt-0.5">
        {icon}
      </div>
      <p className="text-sm font-satoshi text-[var(--color-text-secondary)] leading-snug">{text}</p>
    </div>
  );
}
