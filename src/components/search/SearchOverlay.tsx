"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const QUICK_SEARCHES = [
  "Indian Economy",
  "Polity Constitution",
  "NCERT Geography",
  "PYQ 2023",
  "Ethics Case Studies",
  "Environment Ecology",
];

export function SearchOverlay() {
  const {
    isSearchOverlayOpen,
    openSearchOverlay,
    closeSearchOverlay,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [localQuery, setLocalQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  /* Focus input on open */
  useEffect(() => {
    if (isSearchOverlayOpen) {
      setLocalQuery(searchQuery);
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [isSearchOverlayOpen, searchQuery]);

  /* Global "/" shortcut */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        openSearchOverlay();
      }
      if (e.key === "Escape" && isSearchOverlayOpen) {
        closeSearchOverlay();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isSearchOverlayOpen, openSearchOverlay, closeSearchOverlay]);

  /* Debounced query commit */
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchQuery(localQuery), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [localQuery, setSearchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    closeSearchOverlay();
    router.push("/");
  };

  const handleQuickSearch = (q: string) => {
    setLocalQuery(q);
    setSearchQuery(q);
    closeSearchOverlay();
    router.push("/");
  };

  const handleClose = () => {
    closeSearchOverlay();
  };

  return (
    <AnimatePresence>
      {isSearchOverlayOpen && (
        <>
          {/* ── Backdrop ───────────────────────────────── */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.175 }}
            onClick={handleClose}
          />

          {/* ── Centered search container ──────────────── */}
          <motion.div
            className="fixed top-[28%] left-1/2 -translate-x-1/2 z-50 w-full max-w-[600px] px-4"
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.175, ease: "easeOut" }}
          >
            {/* Search input */}
            <form onSubmit={handleSubmit}>
              <BorderBeam active borderRadius="9999px">
                <div className="flex items-center gap-3 px-5 py-3.5 bg-[var(--color-surface)] rounded-full border border-[var(--color-border)]">
                  <Search
                    size={18}
                    className="text-[var(--color-primary)] shrink-0"
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search PDFs, topics, authors…"
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    className="flex-1 bg-transparent text-[1.0625rem] font-satoshi text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none tracking-satoshi"
                  />
                  {localQuery ? (
                    <button
                      type="button"
                      onClick={() => {
                        setLocalQuery("");
                        setSearchQuery("");
                        inputRef.current?.focus();
                      }}
                      className="shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors p-0.5"
                      aria-label="Clear"
                    >
                      <X size={14} />
                    </button>
                  ) : (
                    <kbd className="hidden sm:inline shrink-0 text-[10px] font-mono text-[var(--color-text-muted)] bg-[#F0EDE6] px-1.5 py-0.5 rounded-md">
                      ESC
                    </kbd>
                  )}
                </div>
              </BorderBeam>
            </form>

            {/* Quick searches */}
            <motion.div
              className="mt-4 flex flex-wrap items-center gap-2"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.175, delay: 0.06 }}
            >
              <span className="text-xs text-white/50 font-satoshi">Try:</span>
              {QUICK_SEARCHES.map((q) => (
                <button
                  key={q}
                  onClick={() => handleQuickSearch(q)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/12 hover:bg-white/20 border border-white/15 text-xs text-white/80 hover:text-white font-satoshi transition-all duration-150"
                >
                  {q}
                  <ArrowRight size={10} className="opacity-60" />
                </button>
              ))}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
