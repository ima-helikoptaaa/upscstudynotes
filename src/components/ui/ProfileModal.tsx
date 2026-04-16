"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type User } from "@/store/useStore";

interface ProfileModalProps {
  user: User;
  onClose: () => void;
}

export function ProfileModal({ user, onClose }: ProfileModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          className="w-full max-w-sm rounded-2xl overflow-hidden pointer-events-auto"
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {/* Header */}
          <div
            className="relative px-6 py-8 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)" }}
          >
            <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5" />
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-[var(--color-accent)]/10" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X size={13} />
            </button>
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-2xl font-sentient shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-sentient text-white text-[1.15rem] leading-tight">{user.name}</p>
                <p className="text-white/50 font-satoshi text-sm mt-0.5">+91 {user.phone}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white px-6 py-4">
            {user.attemptYear && (
              <ProfileRow label="Attempt Year" value={`${user.attemptYear}`} />
            )}
            {user.coaching && (
              <ProfileRow label="Coaching" value={user.coaching} />
            )}
            <ProfileRow label="Member since" value="April 2026" />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)] last:border-0">
      <span className="text-[10px] text-[var(--color-text-muted)] font-satoshi uppercase tracking-widest">{label}</span>
      <span className="text-sm font-medium font-satoshi text-[var(--color-text-primary)]">{value}</span>
    </div>
  );
}
