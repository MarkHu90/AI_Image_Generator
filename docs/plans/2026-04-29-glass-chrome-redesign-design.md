# Glass & Chrome — UI Redesign

> A fresh, polished creative tool aesthetic replacing the current dark-only theme.

**Date:** 2026-04-29
**Status:** Approved

---

## Design Direction

Glass & Chrome — frosted glass panels float over subtle gradient backdrops, metallic accents catch the light. Professional creative tool feel, like a polished camera lens meets Figma.

---

## Color System

**Light mode (default):**
- Background: warm off-white with subtle gradient halo (`oklch(0.98 0.002 260)`)
- Glass panels: `white/60` to `white/80` with `backdrop-blur-xl`
- Accent: chrome blue — `oklch(0.62 0.12 240)` with metallic gradient
- Borders: `oklch(0 0 0 / 6%)` to `oklch(0 0 0 / 10%)`
- Text: `oklch(0.15 0 0)` primary, `oklch(0.45 0 0)` secondary

**Dark mode:**
- Background: deep navy-grey (`oklch(0.13 0.01 260)`) with subtle gradient
- Glass panels: `white/5` to `white/10` with `backdrop-blur-xl`
- Accent: brighter chrome blue — `oklch(0.72 0.12 240)`
- Borders: `white/8` to `white/12`
- Text: `oklch(0.93 0 0)` primary, `oklch(0.60 0 0)` secondary

**Chrome accent gradient:** A metallic linear-gradient from silver-blue to deeper blue, used on primary buttons and active states. Brushed aluminum with studio lighting.

---

## Typography

- **Display/Heading:** DM Serif Display — refined serif for "ImageForge" logo and page titles
- **Body/UI:** Manrope — geometric sans with characterful apertures for all UI text

Geist and Geist Mono are removed entirely.

---

## Spatial Composition

- **Sidebar:** Wider (60px → 240px), glass panel floating with gap from viewport edge. Active item has inner glow highlight
- **Topbar:** Transparent, no bottom border — pure glass blur over scrolling content
- **Content:** Generous padding, glass cards. Asymmetric — more space at top, tighter at bottom
- **Corners:** Layered — large cards 12px (radius-lg), small controls 6px (radius-sm)
- **Theme toggle:** Icon button in topbar, morphs sun/moon

---

## Motion

All CSS-only where possible:

| Moment | Effect |
|---|---|
| Page load | Sidebar slides from left (200ms), content fades up (100ms delay) |
| Route change | Content 8px slide-up + fade |
| Card hover | Lift -2px + shadow bloom, 200ms ease-out |
| Generate button | Idle: pulsing chrome gradient (~3s). Active: liquid metal shimmer |
| Image reveal | Fade in + scale 0.95→1, quick blur-out transition |
| Dark/light toggle | Document-level transition, no flash |

---

## Implementation Scope

### Files to modify:
1. `globals.css` — complete CSS variable overhaul (light + dark)
2. `layout.tsx` — remove forced `dark` class, wire theme toggle
3. `layout.tsx` (dashboard) — add glass backgrounds to sidebar/content
4. `sidebar.tsx` — glass panel styling, width, active indicator
5. `topbar.tsx` — transparent, glass blur, theme toggle button
6. `page.tsx` (landing) — glass treatment, new typography
7. All page components — glass card containers, motion
8. UI components — button metallic gradient, card glass treatment

### Files to create:
- `src/components/layout/theme-toggle.tsx` — sun/moon toggle
- `src/lib/theme.tsx` — ThemeProvider with class toggling
