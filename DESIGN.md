# DESIGN GUIDELINES — UPSCStudyNotes (v2)

---

## 1. DESIGN PHILOSOPHY

A focused study tool for UPSC aspirants.

It should feel:
- Calm
- Focused
- Trustworthy
- Fast
- Human

**Core principle:** Calm surface, responsive interactions.

---

## 2. VISUAL DIRECTION

### Tone
- Warm, not sterile
- Minimal, not empty
- Serious, not intimidating

Avoid:
- Neon gradients
- Glassmorphism
- Shadows (zero box-shadows anywhere)
- Flat all-white surfaces (use structural contrast instead)

---

## 3. COLOR SYSTEM

### Structure (depth via background contrast — NO shadows)

| Surface | Token | Value |
|---|---|---|
| Page background | `--color-bg` | `#F0EDE6` |
| Sidebar | `--color-sidebar` | `#E8E5DE` |
| Main content + cards | `--color-surface` | `#FFFFFF` |
| Right panel | `--color-surface-alt` | `#F5F2EB` |

### Brand
| | Token | Value |
|---|---|---|
| Primary | `--color-primary` | `#3730A3` (deep indigo) |
| Primary hover | `--color-primary-hover` | `#312E81` |
| Primary light | `--color-primary-light` | `#EEF2FF` |
| Accent | `--color-accent` | `#D97706` (muted amber) |
| Accent light | `--color-accent-light` | `#FEF3C7` |

### Text — near-black hierarchy
| | Token | Value |
|---|---|---|
| Primary text | `--color-text-primary` | `#111111` |
| Secondary text | `--color-text-secondary` | `#525252` |
| Muted/label text | `--color-text-muted` | `#A3A3A3` |

### Borders
| | Token | Value |
|---|---|---|
| Default | `--color-border` | `#DDD9D1` |
| Strong | `--color-border-strong` | `#C8C4BB` |

---

## 4. TYPOGRAPHY

### Fonts (Fontshare CDN)
- **Sentient** — headings and primary CTAs only
- **Satoshi** — all body, UI, labels, secondary text

### Rules
- Sentient: page headings, section titles, CTA button text, modal titles
- Satoshi: everything else
- Letter spacing: `-0.02em` on both fonts
- **NO semibold** — use `font-medium` (500) for emphasis, `font-normal` (400) for body
- Text hierarchy via **size + weight + spacing** only — never color

### Scale
| Name | Size | Weight | Font |
|---|---|---|---|
| H1 | 2.25rem | 500 | Sentient |
| H2 | 1.75rem | 500 | Sentient |
| H3 | 1.25rem | 500 | Sentient |
| H4 | 1.0625rem | 500 | Sentient |
| Body | 0.9375rem | 400 | Satoshi |
| SM | 0.8125rem | 400 | Satoshi |
| XS / labels | 0.75rem | 500 | Satoshi |

---

## 5. LAYOUT SYSTEM

Three columns:

```
[Sidebar #E8E5DE] | [Main #FFFFFF] | [Right panel #F5F2EB]
```

Each column has a distinct background — depth without shadows.

### Sidebar
- Width: 216px
- Fixed position
- Contains: Home, Search, Collections, Saved, User
- Does NOT contain inline collection list

### Top Bar
- Sticky
- Background: `--color-surface` (white)
- Contains: search trigger (pill), filter icon button
- All elements use `border-radius: 9999px` (pill shape)
- NO 3-column filter dropdowns — single filter icon

### Main Content
- Pure white background
- Scrollable
- Padding: 24px

### Right Panel
- Width: 232px
- Background: `--color-surface-alt`
- Contains cards with borders — no plain text lists
- Sticky inner scroll

---

## 6. ELEVATION — ZERO SHADOWS

**All box-shadows are removed.**

Depth is achieved via:
1. Background contrast between sidebar/main/right panel
2. Borders (`--color-border`, `--color-border-strong`)
3. Spacing and size contrast

---

## 7. COMPONENTS

### Cards
- Border: `1px solid --color-border`
- Background: `--color-surface`
- Radius: `0.625rem` (md)
- Hover: border darkens to `--color-border-strong`
- **No shadow on default or hover**

### Buttons
- **Primary**: Sentient font, indigo fill, no shadow
- **Secondary**: Satoshi font, outline style
- Radius: `0.625rem` (lg)
- Size lg for CTAs

### Tags — pill style
- Subject: pastel subject color
- Source: subtle border
- Default: muted background

### PDF Card
- Horizontal layout: thumbnail (left) + content (right)
- Thumbnail: subject-colored placeholder (68×84px)
- No shadows

---

## 8. SEARCH SYSTEM

### Search overlay (triggered by clicking search trigger or `/` key)
1. Full-screen backdrop at ~50% opacity
2. Search input animates to center of screen
3. BorderBeam activates on input
4. Quick-search chips appear below

### Search trigger (in TopBar)
- Pill-shaped, non-interactive "fake bar"
- Click opens overlay
- Shows current query if active

### Exit
- ESC or click outside backdrop
- Overlay fades, query persists in feed

---

## 9. INTERACTIONS

- Duration: 150–200ms
- Easing: ease-out
- No bounce
- Hover: border darkens (no lift, no shadow)
- Click: instant response, `active:scale-[0.98]` on buttons

---

## 10. BORDER BEAM

Used **only** on the search input inside the overlay when active.

```tsx
<BorderBeam active borderRadius="9999px">
  <SearchInput />
</BorderBeam>
```

Rule: subtle, no neon.

---

## 11. LOGIN MODAL

### Layout
- Split: left visual panel (240px, dark indigo `#1C1B38`) + right form (flex-1)
- Max width: 680px, centered
- Mobile: left panel hidden, form fills

### Copy
- Step 1 title: "Login to download"
- Step 2 title: "Enter your OTP"
- Step 3 title: "One last thing"

### Flow
1. Phone number
2. OTP verification (mock: `1234`)
3. Attempt year + coaching (optional, skippable)

---

## 12. DO NOT

- No box-shadows
- No colored headings (all headings: `#111111`)
- No 3-dropdown filters in the TopBar
- No semibold weight
- No mixed typography per section
- No inline collections in sidebar

---

## 13. FINAL PRINCIPLE

The UI should disappear while studying and respond instantly while interacting.
