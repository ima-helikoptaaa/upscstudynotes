"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, User, LogOut, ChevronDown } from "lucide-react";
import { useStore } from "@/store/useStore";
import { ProfileModal } from "@/components/ui/ProfileModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, openAuthModal, logout } = useStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-30 flex items-center justify-between px-7 h-16 bg-white border-b border-[var(--color-border)]">
        <Link href="/" className="flex flex-col leading-none select-none">
          <span className="font-sentient text-[1.1rem] text-[var(--color-text-primary)]">
            UPSC<span className="text-[var(--color-primary)]">Notes</span>
          </span>
          <span className="text-[9px] text-[var(--color-text-muted)] font-satoshi tracking-widest uppercase mt-0.5">
            Study smarter
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Saved - icon + label on desktop */}
          <Link
            href="/saved"
            className="flex items-center gap-2 h-10 px-3.5 rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)] hover:border-[var(--color-border-strong)] transition-all"
          >
            <Bookmark size={16} />
            <span className="hidden sm:inline text-sm font-satoshi font-medium">Saved</span>
          </Link>

          {/* Auth / Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className={cn(
                  "flex items-center gap-2 h-10 px-3.5 rounded-full border transition-all",
                  dropdownOpen
                    ? "border-[var(--color-primary)]/40 bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                    : "border-[var(--color-border)] bg-[var(--color-primary-light)] text-[var(--color-primary)] hover:border-[var(--color-primary)]/30"
                )}
              >
                <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-[11px] font-medium font-satoshi shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-sm font-satoshi font-medium">Profile</span>
                <ChevronDown
                  size={13}
                  className={cn("transition-transform duration-150", dropdownOpen && "rotate-180")}
                />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-[var(--color-border)] rounded-xl z-50 py-1.5 overflow-hidden">
                    <button
                      onClick={() => { setDropdownOpen(false); setProfileOpen(true); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-satoshi text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-2.5"
                    >
                      <User size={14} />
                      Profile
                    </button>
                    <div className="h-px bg-[var(--color-border)] mx-3 my-0.5" />
                    <button
                      onClick={() => { setDropdownOpen(false); setConfirmLogout(true); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-satoshi text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2.5"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal()}
              className="flex items-center gap-2 h-10 px-3.5 rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)] hover:border-[var(--color-border-strong)] transition-all"
            >
              <User size={16} />
              <span className="hidden sm:inline text-sm font-satoshi font-medium">Sign in</span>
            </button>
          )}
        </div>
      </nav>

      {profileOpen && user && (
        <ProfileModal user={user} onClose={() => setProfileOpen(false)} />
      )}

      <ConfirmModal
        open={confirmLogout}
        title="Log out?"
        body="You'll be signed out and won't be able to save or download unless you sign back in."
        confirmLabel="Log out"
        onConfirm={() => { setConfirmLogout(false); logout(); }}
        onCancel={() => setConfirmLogout(false)}
      />
    </>
  );
}
