"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { type User } from "@/store/useStore";

interface ProfileModalProps {
  user: User;
  onClose: () => void;
}

export function ProfileModal({ user, onClose }: ProfileModalProps) {
  const validYear = user.attemptYear && !isNaN(user.attemptYear) ? user.attemptYear : null;
  const showBadge = user.attemptYear !== undefined;
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop — opacity only, never scale */}
      <motion.div
        className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[3px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
      />

      {/* Positioning shell — no animation, prevents scale artifact */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        {/* Card — scale + fade only on the card itself */}
        <motion.div
          className="w-full max-w-[340px] rounded-2xl overflow-hidden shadow-xl bg-white pointer-events-auto relative"
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3.5 right-3.5 z-10 size-7 rounded-full flex items-center justify-center transition-colors"
            style={{ background: "rgba(99,102,241,0.12)", color: "rgba(99,102,241,0.5)" }}
          >
            <X size={13} />
          </button>

          {/* Header — avatar + identity all inside the colored block, nothing floats above */}
          <div className="bg-[var(--color-primary-light)] flex flex-col items-center px-6 pt-8 pb-5">
            <div
              className="size-[72px] rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-[1.75rem] font-sentient shrink-0"
              style={{ boxShadow: "0 4px 18px rgba(99,102,241,0.35)" }}
            >
              {(user.name || "U").charAt(0).toUpperCase()}
            </div>
            <h2 className="font-sentient text-[1.2rem] leading-snug text-[var(--color-text-primary)] text-balance mt-3 text-center">
              {user.name}
            </h2>
            {showBadge && (
              <span
                className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-satoshi"
                style={{ background: "rgba(99,102,241,0.14)", color: "var(--color-primary)" }}
              >
                {validYear ? `UPSC ${validYear} Aspirant` : "UPSC Aspirant"}
              </span>
            )}
          </div>

          {/* Info rows */}
          <div className="px-5 py-1">
            <InfoRow label="Mobile" value={`+91 ${user.phone}`} />
            {user.email && <InfoRow label="Email" value={user.email} />}
            {user.coaching && <InfoRow label="Coaching" value={user.coaching} />}
            <InfoRow label="Member since" value="April 2026" />
          </div>
        </motion.div>
      </div>
    </>,
    document.body
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)] last:border-0">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] font-satoshi">
        {label}
      </span>
      <span className="text-[13px] font-medium font-satoshi text-[var(--color-text-primary)] truncate max-w-[180px] text-right">
        {value}
      </span>
    </div>
  );
}
