import { create } from "zustand";
import type { Subject, Source } from "@/lib/mock-data";

export interface User {
  id: string;
  name: string;
  phone: string;
  attemptYear?: number;
  coaching?: string;
}

interface StoreState {
  /* ── Filter state ─────────────────────────────────── */
  selectedSubject: Subject | null;
  selectedType: string | null;
  selectedSource: Source | null;
  searchQuery: string;
  activeCollection: string | null;

  /* ── Auth ─────────────────────────────────────────── */
  user: User | null;
  isAuthModalOpen: boolean;
  authRedirectAction: (() => void) | null;

  /* ── Saved items ──────────────────────────────────── */
  savedItems: string[];

  /* ── UI state ─────────────────────────────────────── */
  isSidebarOpen: boolean;
  isSearchOverlayOpen: boolean;

  /* ── Filter actions ───────────────────────────────── */
  setSubject: (subject: Subject | null) => void;
  setType: (type: string | null) => void;
  setSource: (source: Source | null) => void;
  setSearchQuery: (q: string) => void;
  setActiveCollection: (collection: string | null) => void;
  resetFilters: () => void;

  /* ── Auth actions ─────────────────────────────────── */
  setUser: (user: User) => void;
  openAuthModal: (onSuccess?: () => void) => void;
  closeAuthModal: () => void;

  /* ── Save actions ─────────────────────────────────── */
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;

  /* ── UI actions ───────────────────────────────────── */
  setSidebarOpen: (open: boolean) => void;
  openSearchOverlay: () => void;
  closeSearchOverlay: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  selectedSubject: null,
  selectedType: null,
  selectedSource: null,
  searchQuery: "",
  activeCollection: null,
  user: null,
  isAuthModalOpen: false,
  authRedirectAction: null,
  savedItems: [],
  isSidebarOpen: false,
  isSearchOverlayOpen: false,

  setSubject: (subject) =>
    set({ selectedSubject: subject, activeCollection: null }),
  setType: (type) => set({ selectedType: type }),
  setSource: (source) =>
    set({ selectedSource: source, activeCollection: null }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setActiveCollection: (collection) =>
    set({
      activeCollection: collection,
      selectedSubject: null,
      selectedSource: null,
      selectedType: null,
      searchQuery: "",
    }),
  resetFilters: () =>
    set({
      selectedSubject: null,
      selectedType: null,
      selectedSource: null,
      searchQuery: "",
      activeCollection: null,
    }),

  setUser: (user) => set({ user, isAuthModalOpen: false }),
  openAuthModal: (onSuccess) =>
    set({ isAuthModalOpen: true, authRedirectAction: onSuccess ?? null }),
  closeAuthModal: () =>
    set({ isAuthModalOpen: false, authRedirectAction: null }),

  toggleSave: (id) => {
    const saved = get().savedItems;
    set({
      savedItems: saved.includes(id)
        ? saved.filter((s) => s !== id)
        : [...saved, id],
    });
  },
  isSaved: (id) => get().savedItems.includes(id),

  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  openSearchOverlay: () => set({ isSearchOverlayOpen: true }),
  closeSearchOverlay: () => set({ isSearchOverlayOpen: false }),
}));
