"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  body,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-[3px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onCancel}
          />
          <div className="fixed inset-0 z-[71] flex items-center justify-center p-4">
            <motion.div
              className="w-full max-w-sm bg-[var(--color-surface)] rounded-2xl shadow-2xl shadow-black/25 overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="px-6 pt-6 pb-5">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${variant === "danger" ? "bg-red-50" : "bg-[var(--color-primary-light)]"}`}>
                  <AlertTriangle size={18} className={variant === "danger" ? "text-red-500" : "text-[var(--color-primary)]"} />
                </div>

                <h2 className="font-sentient text-[1.1rem] leading-snug text-[var(--color-text-primary)] mb-2">
                  {title}
                </h2>
                <p className="text-sm font-satoshi text-[var(--color-text-secondary)] leading-relaxed">
                  {body}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2.5 px-6 pb-6">
                <button
                  onClick={onCancel}
                  className="flex-1 py-2.5 rounded-xl text-sm font-satoshi font-medium border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-satoshi font-semibold text-white transition-all active:scale-[0.98] ${
                    variant === "danger"
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]"
                  }`}
                >
                  {confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
