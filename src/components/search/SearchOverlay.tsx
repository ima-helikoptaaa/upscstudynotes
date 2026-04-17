"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowUpRight, Zap, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { MOCK_PDFS, COLLECTIONS, type PDF } from "@/lib/mock-data";
import { THUMB_FLAT } from "@/components/pdf/PDFCard";
import { cn } from "@/lib/utils";

/* ── Suggestions ──────────────────────────────────────────────── */
const SUGGESTIONS = [
  "Indian Polity",
  "Current Affairs 2024",
  "NCERT Geography",
  "Ethics Case Studies",
  "PYQ 2023",
  "Environment & Ecology",
];

const chipContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};
const chipItem = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.18 } },
};

const MINI_COLORS = [
  { main: "#DBEAFE", mid: "#BFDBFE", back: "#EFF6FF" },
  { main: "#D1FAE5", mid: "#A7F3D0", back: "#ECFDF5" },
  { main: "#FEF3C7", mid: "#FDE68A", back: "#FFFBEB" },
  { main: "#EDE9FE", mid: "#DDD6FE", back: "#F5F3FF" },
  { main: "#FEE2E2", mid: "#FECACA", back: "#FEF2F2" },
];

/* ── AI knowledge bank ────────────────────────────────────────── */
const AI_BRIEFS: Array<{ keywords: string[]; brief: string }> = [
  { keywords: ["polity", "constitution", "parliament", "fundamental rights"], brief: "Indian Polity covers the constitutional framework, fundamental rights, DPSP, federal structure, and parliamentary system. Key topics include Articles 12–35, 51A, and constitutional bodies like the EC, CAG, and UPSC." },
  { keywords: ["economy", "gdp", "rbi", "inflation", "fiscal", "monetary"], brief: "Indian Economy spans macroeconomic policy, fiscal & monetary frameworks, post-independence planning, trade, agriculture, infrastructure, and current challenges including inflation and the digital economy." },
  { keywords: ["history", "medieval", "ancient", "mughal", "harappan", "colonial", "freedom", "independence"], brief: "UPSC History includes ancient civilizations (Harappan, Vedic), medieval kingdoms (Delhi Sultanate, Mughals), and modern history - colonial era, freedom movement 1857–1947, and constitution-making." },
  { keywords: ["geography", "monsoon", "river", "climate", "soil", "physical", "drainage"], brief: "Geography covers physical features, climate systems, river networks, mineral distribution, and human geography including migration, urbanization, economic activities, and disaster management." },
  { keywords: ["environment", "ecology", "biodiversity", "climate change", "pollution", "paris"], brief: "Environment & Ecology includes biodiversity hotspots, international conventions (CITES, Ramsar, Paris Agreement), climate change adaptation, pollution control, and India's green policies." },
  { keywords: ["ethics", "integrity", "aptitude", "case study", "civil service", "probity"], brief: "GS4 Ethics covers philosophical foundations, emotional intelligence, civil service values, probity in governance, and case studies on corruption, whistleblowing, and institutional integrity." },
  { keywords: ["current affairs", "monthly", "ca", "news"], brief: "Current Affairs for UPSC covers national & international events, economic updates, scientific breakthroughs, sports, awards, and government schemes - spanning the 12–18 months before the exam." },
  { keywords: ["science", "technology", "space", "isro", "ai", "artificial intelligence"], brief: "S&T for UPSC includes ISRO missions, biotech, AI policy, nanotechnology, cybersecurity, and defence R&D. Focus on Chandrayaan, Aditya-L1, and India's digital public infrastructure." },
];

function getAiBrief(query: string): string | null {
  const q = query.toLowerCase().trim();
  if (q.length < 3) return null;
  for (const { keywords, brief } of AI_BRIEFS) {
    if (keywords.some((kw) => q.includes(kw))) return brief;
  }
  return null;
}

function countResults(query: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  return MOCK_PDFS.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.author.toLowerCase().includes(q) ||
      p.subject.toLowerCase().includes(q) ||
      p.source.toLowerCase().includes(q)
  ).length;
}

/* ── AI Brief card (overlay) ─────────────────────────────────── */
function AiBriefOverlayCard({ briefText, queryKey }: { briefText: string; queryKey: string }) {
  const [genState, setGenState] = useState<"idle" | "loading" | "done">("idle");
  const [brief, setBrief] = useState<string | null>(null);

  useEffect(() => {
    setGenState("idle");
    setBrief(null);
  }, [queryKey]);

  const generate = async () => {
    setGenState("loading");
    await new Promise((r) => setTimeout(r, 900));
    setBrief(briefText);
    setGenState("done");
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "#0F172A", border: "1px solid rgba(56,189,248,0.2)" }}
    >
      <div className="flex items-center justify-between px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Zap size={13} className="text-sky-400" />
          <span className="text-[10px] font-satoshi font-semibold uppercase tracking-widest text-sky-400">
            AI Brief
          </span>
        </div>
        {genState === "idle" && (
          <button
            onClick={generate}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-satoshi font-medium text-sky-400 transition-colors"
            style={{ border: "1px solid rgba(56,189,248,0.3)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(56,189,248,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Generate <ChevronRight size={11} />
          </button>
        )}
        {genState === "loading" && (
          <div className="flex items-center gap-1.5 text-xs font-satoshi text-sky-400">
            <Loader2 size={12} className="animate-spin" />
            Generating…
          </div>
        )}
      </div>
      <AnimatePresence>
        {genState === "done" && brief && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="border-t"
            style={{ borderColor: "rgba(56,189,248,0.15)" }}
          >
            <p className="px-5 py-4 text-sm text-white/70 font-satoshi leading-relaxed">{brief}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── SearchBar ───────────────────────────────────────────────── */
export function SearchBar() {
  const router = useRouter();
  const { setSearchQuery, searchQuery, setSearchActive } = useStore();
  const [isActive, setIsActive] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isTyping = localQuery.length > 0;
  const resultCount = isTyping ? countResults(localQuery) : 0;
  const aiBrief = isTyping ? getAiBrief(localQuery) : null;

  useEffect(() => { setLocalQuery(searchQuery); }, [searchQuery]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchQuery(localQuery), 250);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [localQuery, setSearchQuery]);

  useEffect(() => { setSearchActive(isActive); }, [isActive, setSearchActive]);

  useEffect(() => {
    document.body.style.overflow = isActive ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isActive]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        activate();
      }
      if (e.key === "Escape" && isActive) close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isActive]);

  const activate = () => {
    setIsActive(true);
    setTimeout(() => inputRef.current?.focus(), 30);
  };

  const close = () => {
    setIsActive(false);
    setLocalQuery("");
    setSearchQuery("");
  };

  const clearQuery = () => {
    setLocalQuery("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && localQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(localQuery.trim())}`);
      close();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="fixed inset-0 z-[35] bg-black/55 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={close}
          />
        )}
      </AnimatePresence>

      {/* Search panel */}
      <div className="relative z-[40]">
        {/* Fixed-height container prevents layout jerk during crossfade */}
        <div className="relative h-[52px]">
          <AnimatePresence initial={false}>
            {isActive ? (
              <motion.div
                key="active"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <BorderBeam
                  size="md"
                  colorVariant="ocean"
                  duration={3}
                  strength={isTyping ? 0.11 : 0.6}
                  borderRadius="9999px"
                  bgColor="transparent"
                >
                  <div
                    className="flex items-center gap-3 px-5 py-3.5 rounded-full backdrop-blur-xl h-full"
                    style={{ background: "rgba(0,0,0,0.25)" }}
                  >
                    <Search size={18} className="shrink-0 text-white/70" />
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Search PDFs, topics, authors…"
                      value={localQuery}
                      onChange={(e) => setLocalQuery(e.target.value)}
                      onFocus={activate}
                      onKeyDown={handleKeyDown}
                      className="flex-1 bg-transparent text-base font-satoshi focus:outline-none min-w-0 text-white placeholder:text-white/35"
                    />
                    <div className="shrink-0">
                      {isTyping ? (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); clearQuery(); }}
                          className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/25 transition-colors"
                          aria-label="Clear"
                        >
                          <X size={14} />
                        </button>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/40">
                          <span className="text-sm leading-none font-satoshi font-medium">/</span>
                        </div>
                      )}
                    </div>
                  </div>
                </BorderBeam>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <div
                  className="flex items-center gap-3 px-5 py-3.5 rounded-full bg-white border border-[var(--color-border)] cursor-text hover:border-[var(--color-border-strong)] transition-colors h-full"
                  onClick={activate}
                >
                  <Search size={18} className="shrink-0 text-[var(--color-text-muted)]" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search PDFs, topics, authors…"
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    onFocus={activate}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent text-base font-satoshi focus:outline-none min-w-0 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
                  />
                  <div className="w-7 h-7 rounded-full bg-[var(--color-surface-muted)] flex items-center justify-center text-[var(--color-text-muted)]">
                    <span className="text-sm leading-none font-satoshi font-medium">/</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Idle suggestion chips */}
        <AnimatePresence>
          {!isActive && (
            <motion.div
              className="flex flex-wrap gap-2 mt-4 justify-center"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => { setLocalQuery(s); activate(); }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-satoshi transition-all"
                  style={{
                    background: "#FEFAF3",
                    border: "1px solid rgba(200,155,70,0.28)",
                    color: "rgba(120,80,20,0.7)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(200,155,70,0.55)";
                    e.currentTarget.style.color = "rgba(120,80,20,1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(200,155,70,0.28)";
                    e.currentTarget.style.color = "rgba(120,80,20,0.7)";
                  }}
                >
                  {s}
                  <ArrowUpRight size={16} className="opacity-50" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active panels */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              className="mt-6 space-y-3"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {/* No query: staggered chips + popular collections */}
              {!isTyping && (
                <>
                  <motion.div
                    className="flex flex-wrap gap-2 justify-center mb-8"
                    variants={chipContainer}
                    initial="hidden"
                    animate="show"
                  >
                    {SUGGESTIONS.map((s) => (
                      <motion.button
                        key={s}
                        variants={chipItem}
                        onClick={() => setLocalQuery(s)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-satoshi bg-white/10 border border-white/20 text-white/80 hover:bg-white/20 hover:text-white transition-all"
                      >
                        {s}
                        <ArrowUpRight size={16} className="opacity-60" />
                      </motion.button>
                    ))}
                  </motion.div>

                  {/* Popular collections */}
                  <div>
                    <p className="text-[10px] text-white/40 font-satoshi uppercase tracking-widest mb-3 px-1">
                      Popular collections
                    </p>
                    <div className="grid grid-cols-5 gap-3">
                      {COLLECTIONS.slice(0, 5).map((col, i) => {
                        const colors = MINI_COLORS[i % MINI_COLORS.length];
                        const count = MOCK_PDFS.filter(
                          (p) =>
                            (!col.subjectFilter || p.subject === col.subjectFilter) &&
                            (!col.sourceFilter || p.source === col.sourceFilter)
                        ).length;
                        return (
                          <div key={col.id} style={{ height: 96, paddingTop: 8 }}>
                            <Link
                              href={`/collection/${col.id}`}
                              onClick={close}
                              className="group relative w-full h-full text-left block"
                              style={{ paddingLeft: 2, paddingRight: 2 }}
                            >
                              <span aria-hidden className="absolute rounded-lg"
                                style={{ top: 0, left: 4, right: -4, bottom: 0, backgroundColor: colors.back, transform: "rotate(3deg)", transformOrigin: "bottom center" }}
                              />
                              <span aria-hidden className="absolute rounded-lg"
                                style={{ top: 2, left: 2, right: -2, bottom: 0, backgroundColor: colors.mid, transform: "rotate(1.5deg)", transformOrigin: "bottom center" }}
                              />
                              <div
                                className="relative h-full rounded-lg p-2.5 flex flex-col justify-between transition-transform duration-200 group-hover:-translate-y-0.5"
                                style={{ backgroundColor: colors.main, border: "1px solid rgba(0,0,0,0.06)" }}
                              >
                                <p className="text-[12px] font-medium font-satoshi text-[var(--color-text-primary)] line-clamp-2 leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                                  {col.label}
                                </p>
                                <p className="text-[10px] text-[var(--color-text-muted)] font-satoshi">{count} PDFs</p>
                              </div>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* Has query: result count / no-results */}
              {isTyping && (
                <>
                  {resultCount > 0 ? (
                    <button
                      onClick={() => {
                        router.push(`/search?q=${encodeURIComponent(localQuery.trim())}`);
                        close();
                      }}
                      className="w-full group relative overflow-hidden rounded-2xl text-left transition-all"
                      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.11)" }}
                    >
                      {/* Hover glow */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl"
                        style={{ background: "rgba(99,102,241,0.09)" }} />

                      <div className="relative flex items-center gap-4 px-5 py-4">
                        {/* Count badge */}
                        <div
                          className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                          style={{ background: "rgba(99,102,241,0.22)", border: "1px solid rgba(99,102,241,0.35)" }}
                        >
                          <span className="text-[15px] font-bold font-satoshi text-white tabular-nums leading-none">
                            {resultCount > 99 ? "99+" : resultCount}
                          </span>
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[13.5px] font-semibold font-satoshi text-white leading-snug truncate">
                            Results for &ldquo;{localQuery}&rdquo;
                          </p>
                          <p className="text-[11px] text-white/40 font-satoshi mt-0.5">
                            Press Enter to see all {resultCount} PDF{resultCount !== 1 ? "s" : ""}
                          </p>
                        </div>

                        {/* Arrow */}
                        <ArrowUpRight size={16} className="shrink-0 text-white/25 group-hover:text-white/65 transition-colors" />
                      </div>
                    </button>
                  ) : (
                    <div
                      className="rounded-2xl px-5 py-5 text-center"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      <p className="text-[13px] font-semibold font-satoshi text-white/55 mb-1">
                        No results for &ldquo;{localQuery}&rdquo;
                      </p>
                      <p className="text-[11px] text-white/30 font-satoshi">
                        Try a different term or browse collections
                      </p>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

/* ── Result row (kept for potential reuse) ────────────────────── */
export function ResultRow({ pdf, onSelect }: { pdf: PDF; onSelect: () => void }) {
  const flat = THUMB_FLAT[pdf.subject] ?? { bg: "#F3F4F6", text: "#374151" };
  return (
    <Link href={`/pdf/${pdf.id}`} onClick={onSelect}>
      <div className="flex items-center gap-3.5 px-5 py-3 hover:bg-[var(--color-bg)] transition-colors">
        <div className="w-9 h-11 rounded-lg shrink-0 flex items-center justify-center" style={{ background: flat.bg }}>
          <span className="text-[10px] font-medium font-satoshi" style={{ color: flat.text }}>{pdf.subject}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-[var(--color-text-primary)] font-satoshi truncate">{pdf.title}</p>
          <p className="text-[11px] text-[var(--color-text-muted)] font-satoshi mt-0.5">{pdf.source} · {pdf.pages}p</p>
        </div>
      </div>
    </Link>
  );
}
