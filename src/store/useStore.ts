import { create } from "zustand";
// Subject and Source are now strings (not strict union types)

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  attemptYear?: number;
  coaching?: string;
}

interface StoreState {
  /* ── Filter state ─────────────────────────────────── */
  selectedSubject:    string | null;
  selectedType:       string | null;
  selectedSource:     string | null;
  searchQuery:        string;
  activeCollection:   string | null;

  /* ── Auth ─────────────────────────────────────────── */
  user:               User | null;
  isAuthModalOpen:    boolean;
  authRedirectAction: (() => void) | null;
  isWelcomeOpen:      boolean;

  /* ── Saved items ──────────────────────────────────── */
  savedItems:         string[];
  savedCollections:   string[];
  savedSources:       string[];

  /* ── UI state ─────────────────────────────────────── */
  isSearchActive:     boolean;
  toast:              string | null;

  /* ── Filter actions ───────────────────────────────── */
  setSubject:           (subject: string | null) => void;
  setType:              (type: string | null) => void;
  setSource:            (source: string | null) => void;
  setSearchQuery:       (q: string) => void;
  setActiveCollection:  (collection: string | null) => void;
  resetFilters:         () => void;

  /* ── Auth actions ─────────────────────────────────── */
  setUser:       (user: User | null, showWelcome?: boolean) => void;
  logout:        () => void;
  openAuthModal: (onSuccess?: () => void) => void;
  closeAuthModal:() => void;
  closeWelcome:  () => void;

  /* ── Save actions ─────────────────────────────────── */
  setSavedItems:         (ids: string[]) => void;
  toggleSave:            (id: string) => void;
  isSaved:               (id: string) => boolean;
  toggleSaveCollection:  (id: string) => void;
  isCollectionSaved:     (id: string) => boolean;
  toggleSaveSource:      (id: string) => void;
  isSourceSaved:         (id: string) => boolean;

  /* ── Toast ────────────────────────────────────────── */
  showToast: (msg: string) => void;
  clearToast:() => void;

  /* ── UI actions ───────────────────────────────────── */
  setSearchActive:    (active: boolean) => void;
  /* Legacy compat */
  isSidebarOpen:      boolean;
  isSearchOverlayOpen:boolean;
  setSidebarOpen:     (open: boolean) => void;
  openSearchOverlay:  () => void;
  closeSearchOverlay: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  selectedSubject:    null,
  selectedType:       null,
  selectedSource:     null,
  searchQuery:        "",
  activeCollection:   null,
  user:               null,
  isAuthModalOpen:    false,
  authRedirectAction: null,
  isWelcomeOpen:      false,
  savedItems:         [],
  savedCollections:   [],
  savedSources:       [],
  isSearchActive:     false,
  isSidebarOpen:      false,
  isSearchOverlayOpen:false,
  toast:              null,

  setSubject:  (subject)    => set({ selectedSubject: subject, activeCollection: null }),
  setType:     (type)       => set({ selectedType: type }),
  setSource:   (source)     => set({ selectedSource: source, activeCollection: null }),
  setSearchQuery: (q)       => set({ searchQuery: q }),
  setActiveCollection: (collection) =>
    set({ activeCollection: collection, selectedSubject: null, selectedSource: null, selectedType: null, searchQuery: "" }),
  resetFilters: () =>
    set({ selectedSubject: null, selectedType: null, selectedSource: null, searchQuery: "", activeCollection: null }),

  setUser: (user, showWelcome) => set({ user, isAuthModalOpen: false, ...(showWelcome ? { isWelcomeOpen: true } : {}) }),
  logout:  ()     => set({ user: null, savedItems: [], savedCollections: [], savedSources: [] }),
  openAuthModal: (onSuccess)=> set({ isAuthModalOpen: true, authRedirectAction: onSuccess ?? null }),
  closeAuthModal:()         => set({ isAuthModalOpen: false, authRedirectAction: null }),
  closeWelcome:  ()         => set({ isWelcomeOpen: false }),

  setSavedItems: (ids) => set({ savedItems: ids }),
  toggleSave: (id) => {
    const saved = get().savedItems;
    const adding = !saved.includes(id);
    set({ savedItems: adding ? [...saved, id] : saved.filter((s) => s !== id) });
    if (adding) get().showToast("PDF saved to your library");
  },
  isSaved: (id) => get().savedItems.includes(id),

  toggleSaveCollection: (id) => {
    const saved = get().savedCollections;
    const adding = !saved.includes(id);
    set({ savedCollections: adding ? [...saved, id] : saved.filter((s) => s !== id) });
    if (adding) get().showToast("Collection saved to your library");
  },
  isCollectionSaved: (id) => get().savedCollections.includes(id),

  toggleSaveSource: (id) => {
    const saved = get().savedSources;
    const adding = !saved.includes(id);
    set({ savedSources: adding ? [...saved, id] : saved.filter((s) => s !== id) });
    if (adding) get().showToast("Collection saved to your library");
  },
  isSourceSaved: (id) => get().savedSources.includes(id),

  showToast: (msg) => {
    set({ toast: msg });
    setTimeout(() => set({ toast: null }), 3200);
  },
  clearToast: () => set({ toast: null }),

  setSearchActive:    (active) => set({ isSearchActive: active, isSearchOverlayOpen: active }),
  setSidebarOpen:     (open)   => set({ isSidebarOpen: open }),
  openSearchOverlay:  ()       => set({ isSearchActive: true, isSearchOverlayOpen: true }),
  closeSearchOverlay: ()       => set({ isSearchActive: false, isSearchOverlayOpen: false }),
}));
