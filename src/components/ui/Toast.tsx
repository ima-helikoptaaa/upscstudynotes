"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";
import { useStore } from "@/store/useStore";

export function Toast() {
  const { toast, clearToast } = useStore();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast}
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 bg-[#1C1B38] text-white rounded-xl max-w-xs"
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <CheckCircle size={16} className="text-[#A78BFA] shrink-0" />
          <p className="text-sm font-satoshi font-medium flex-1">{toast}</p>
          <button
            onClick={clearToast}
            className="shrink-0 text-white/40 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <X size={13} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
