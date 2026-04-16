"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Bookmark, LayoutGrid, User, X } from "lucide-react";

export function Sidebar() {
  const {
    savedItems,
    resetFilters,
    isSidebarOpen,
    setSidebarOpen,
    openSearchOverlay,
    user,
    openAuthModal,
  } = useStore();
  const pathname = usePathname();

  const handleSearchClick = () => {
    setSidebarOpen(false);
    openSearchOverlay();
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.175 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-[216px] z-40 flex flex-col",
          "bg-[var(--color-sidebar)] border-r border-[var(--color-border)]",
          "transition-transform duration-200 ease-out",
          "lg:translate-x-0",
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[var(--color-border)]">
          <Link
            href="/"
            onClick={() => { resetFilters(); setSidebarOpen(false); }}
          >
            <p className="font-sentient text-[1.125rem] text-[var(--color-text-primary)] leading-none">
              UPSC<span className="text-[var(--color-primary)]">Notes</span>
            </p>
            <p className="text-[11px] text-[var(--color-text-muted)] font-satoshi mt-0.5 tracking-satoshi">
              Study smarter
            </p>
          </Link>
          <button
            className="lg:hidden text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-1 rounded-md transition-colors"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <NavLink
            href="/"
            icon={<Home size={15} />}
            label="Home"
            active={pathname === "/"}
            onClick={() => { resetFilters(); setSidebarOpen(false); }}
          />

          <button
            onClick={handleSearchClick}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-satoshi tracking-satoshi text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg)] transition-colors duration-150"
          >
            <Search size={15} />
            <span>Search</span>
            <kbd className="ml-auto text-[10px] font-mono text-[var(--color-text-muted)] bg-[var(--color-border)] px-1.5 py-0.5 rounded leading-none">
              /
            </kbd>
          </button>

          <NavLink
            href="/collections"
            icon={<LayoutGrid size={15} />}
            label="Collections"
            active={pathname === "/collections"}
            onClick={() => setSidebarOpen(false)}
          />

          <NavLink
            href="/saved"
            icon={<Bookmark size={15} />}
            label="Saved"
            active={pathname === "/saved"}
            onClick={() => setSidebarOpen(false)}
            badge={savedItems.length > 0 ? savedItems.length : undefined}
          />
        </nav>

        {/* User */}
        <div className="p-3 border-t border-[var(--color-border)]">
          {user ? (
            <div className="flex items-center gap-2.5 px-2 py-2">
              <div className="w-7 h-7 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-medium flex items-center justify-center shrink-0 font-satoshi">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate leading-none font-satoshi tracking-satoshi">
                  {user.name}
                </p>
                <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5 font-satoshi">
                  {user.phone}
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { openAuthModal(); setSidebarOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-satoshi tracking-satoshi text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg)] transition-colors"
            >
              <User size={15} />
              Sign in
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

/* ── NavLink ────────────────────────────────────────────── */

function NavLink({
  href,
  icon,
  label,
  active,
  onClick,
  badge,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-satoshi tracking-satoshi transition-colors duration-150",
        active
          ? "bg-[var(--color-bg)] text-[var(--color-text-primary)] font-medium"
          : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg)]"
      )}
    >
      {icon}
      <span className="flex-1">{label}</span>
      {badge !== undefined && (
        <span className="w-5 h-5 rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent)] text-[10px] font-semibold flex items-center justify-center leading-none">
          {badge}
        </span>
      )}
    </Link>
  );
}
