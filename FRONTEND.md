# FRONTEND SPEC — UPSCStudyNotes (v2)

---

## 1. OVERVIEW

Goals:
- Fast (no reload feel)
- Clear (no clutter)
- Predictable (state-driven UI)
- Scalable (future AI support)

---

## 2. TECH STACK

- **Next.js 16** (App Router)
- **TailwindCSS** (design tokens via CSS vars)
- **Zustand** (global state)
- **Framer Motion** (animations)
- **Radix UI** (`@radix-ui/react-dialog`, `@radix-ui/react-select`)
- **lucide-react** (icon system)
- **SWR** (data fetching, when backend is wired)

---

## 3. GLOBAL LAYOUT

```
[Sidebar #E8E5DE 216px] | [Main white flex-1] | [Right panel #F5F2EB 232px]
```

- Sidebar: `fixed`, `lg:translate-x-0`, mobile drawer with backdrop
- Top bar: `sticky top-0 z-30`
- Main content: scrollable, `bg-[var(--color-surface)]`, `border-r`
- Right panel: `hidden xl:flex`, sticky inner scroll, `border-l`

### Responsive
- Desktop (xl+): 3 columns
- Tablet (lg–xl): sidebar + main (right panel hidden)
- Mobile (<lg): sidebar is slide-in drawer, main fills screen

---

## 4. GLOBAL STATE (Zustand)

```ts
// src/store/useStore.ts

selectedSubject: Subject | null
selectedType: string | null
selectedSource: Source | null
searchQuery: string
activeCollection: string | null
user: User | null
isAuthModalOpen: boolean
authRedirectAction: (() => void) | null
savedItems: string[]
isSidebarOpen: boolean
isSearchOverlayOpen: boolean   // NEW: search overlay state
```

Actions:
- `setSubject / setSource / setType / setSearchQuery / setActiveCollection / resetFilters`
- `setUser / openAuthModal / closeAuthModal`
- `toggleSave / isSaved`
- `setSidebarOpen / openSearchOverlay / closeSearchOverlay`

---

## 5. SIDEBAR

### Component: `Sidebar`

Navigation items only — no inline filter or collection lists:
- Home (→ `/`, resets filters)
- Search (triggers `openSearchOverlay()`)
- Collections (→ `/collections`)
- Saved (→ `/saved`, shows badge count)

Mobile: slide-in drawer with `AnimatePresence` backdrop.

---

## 6. TOP BAR

### Component: `TopBar`

Contains:
- Hamburger (mobile only)
- **Search trigger** — pill-shaped button showing current query or placeholder. Click → `openSearchOverlay()`
- **FilterPanel** — single filter icon button; opens floating panel

All elements: `border-radius: 9999px`.

Active filters display: small pill badges below the search trigger.

---

## 7. SEARCH OVERLAY

### Component: `SearchOverlay` (`src/components/search/SearchOverlay.tsx`)

Rendered at root level in `AppLayout`.

**Trigger:** clicking search trigger or pressing `/`

**Behavior:**
1. Full-screen backdrop (`bg-black/50`) fades in
2. Search input animates to center (`top-[28%]`, `max-w-600px`)
3. BorderBeam activates on input (pill radius)
4. Quick-search chips appear below
5. Input auto-focused

**Exit:** ESC key or click outside → overlay closes, `searchQuery` persists → feed filters accordingly

---

## 8. FILTER PANEL

### Component: `FilterPanel` (`src/components/ui/FilterPanel.tsx`)

Single filter icon button (pill shape) opening a floating panel.

Panel contains toggle chips for:
- Subject (GS1–GS4, CA, Optional)
- Source (NCERT, Coaching, PYQ)
- Type (Notes, NCERT, PYQ)

Active filter count shown as badge on trigger button.
Clear all button resets all filters.

---

## 9. FEED

### Component: `PDFFeed`

Modes:
- **Default**: grouped by subject, strong Sentient section headers
- **Filtered / collection**: flat list with result count
- **Search**: flat list

Section headers: `text-[var(--color-text-primary)]` only — no colored subject titles.

Rendering logic:
```ts
if (searchQuery || filters || collection) → filtered list
else → grouped by subject (GS1, GS2, GS3, GS4, CA, Optional)
```

---

## 10. PDF CARD

### Component: `PDFCard`

Horizontal layout: `flex items-start gap-4`

Left:
- Subject-colored thumbnail (68×84px, no shadow, border)

Right:
- Title (Satoshi Medium, near-black)
- Description (2 lines, Satoshi Regular)
- Tags: Subject, Source, first tag
- Meta: `{pages}p · {year}` right-aligned
- Bookmark button

States:
- default: `border-[var(--color-border)]`
- hover: `border-[var(--color-border-strong)]`
- loading: `Skeleton` component

---

## 11. PDF DETAIL PAGE

### Route: `/pdf/[id]`

Two-column layout:
- Left: PDF thumbnail / preview, "Open reader →" link
- Right: title (Sentient), tags, metadata grid, summary, flashcards, CTA buttons

Download button triggers auth modal if not logged in.

---

## 12. PDF READER

### Route: `/reader/[id]`

Minimal dark UI (`bg-[#1C1C1E]`):
- Top bar with back link, title, save/download buttons, "Summary" toggle
- Center: iframe PDF embed
- Right: slide-in summary panel (Framer Motion width animation)

---

## 13. COLLECTIONS PAGE

### Route: `/collections`

Grid of `CollectionCard` components (2–3 columns responsive).

Each card:
- Colored top bar (subject color)
- Subject badge
- Title (Sentient)
- PDF count
- "Browse collection →" link

Clicking → sets `activeCollection` in store → navigates to `/`

---

## 14. LOGIN MODAL

### Component: `LoginModal`

Split layout modal (`max-w-[680px]`):
- Left panel (240px): dark indigo background, quote, step progress bar — hidden on mobile
- Right panel: 3-step form

Steps:
1. **"Login to download"** — phone number → Send OTP
2. **"Enter your OTP"** — 4-digit OTP (demo: `1234`)
3. **"One last thing"** — attempt year + coaching (skippable)

Triggered by: download button or sign-in link.

---

## 15. LOADING & EDGE STATES

- **Skeleton**: `Skeleton`, `PDFCardSkeleton`, `FeedSectionSkeleton` components
- **Empty state**: centered icon + Sentient heading + body text + suggestion
- **Error state**: retry button (not yet wired to backend)

---

## 16. ANIMATION

- Library: Framer Motion
- Duration: 150–200ms
- Easing: `ease-out`
- No bounce
- `AnimatePresence` for mount/unmount transitions
- `layout` prop on `PDFCard` for list reordering

---

## 17. ICONS

Library: `lucide-react`

Common: `Home`, `Search`, `Bookmark`, `BookmarkCheck`, `Download`, `FileText`, `LayoutGrid`, `TrendingUp`, `SlidersHorizontal`, `Menu`, `X`, `ArrowLeft`, `ArrowRight`, `ExternalLink`, `User`, `Check`

---

## 18. PERFORMANCE

- Lazy load PDF previews (iframes)
- Debounced search (300ms in `SearchOverlay`)
- `useMemo` for filtering in `PDFFeed`
- Skeleton loaders on initial content

---

## 19. FINAL PRINCIPLE

Frontend should feel instant, invisible, and structured.
