# Figma-Inspired UI Redesign

**Date:** 2026-04-29  
**Status:** Approved  
**Reference:** Figma, Linear, Arc Browser

## Goal

Redesign the entire app UI to be:
- **De-AI-ified** — no AI clichés (purple gradients, sparkles, robot imagery, tech-hype copy)
- **Clean** — generous whitespace, clear hierarchy, minimal chrome
- **Cool/polished** — Figma-tool quality, refined, handcrafted feel
- **Scannable** — information hierarchy clear at a glance

## Design System

### Color Palette

| Role | Value | Usage |
|------|-------|-------|
| Background | `#0D0D0D` | Page canvas |
| Surface | `#141414` | Sidebar, elevated panels |
| Card | `#1C1C1C` | Cards, form containers |
| Input | `#242424` | Text inputs, select, buttons |
| Hover | `#2A2A2A` | Row/card hover feedback |
| Border | `rgba(255,255,255,0.06)` | Hairline borders |
| Border-Active | `rgba(255,255,255,0.10)` | Focus/active borders |
| Text Primary | `#EDEDED` | Body, headings |
| Text Secondary | `#888888` | Labels, muted info |
| Text Tertiary | `#5A5A5A` | Placeholders, disabled |
| Accent | `#6B8CFF` | Active nav, primary CTA |
| Accent Hover | `#8BA3FF` | Button hover |
| Accent Subtle | `rgba(107,140,255,0.10)` | Badge bg, selection |

### Typography

- **Font:** Geist (sans) + Geist Mono (mono) — already in project
- **Weights:** 400 body / 500 labels / 600 headings
- **Tighter tracking** on headings

### Spacing Scale

4px base: 0, 4, 8, 12, 16, 24, 32, 48

### Effects

- No gradients anywhere
- No glow/shadow except dialog overlays
- 1px hairline borders (Figma signature)
- 100–150ms color-shift transitions only
- Background-color hover feedback (no scale, no shadow)

### Anti-Patterns (Avoid)

- Purple/indigo gradients
- Gradient text (bg-clip-text)
- AI sparkle/robot iconography
- "AI" prefix language
- Tech-hype buzzwords
- Emoji as icons

---

## Page Redesigns

### Landing Page

- Remove indigo icon container
- Hero: solid white text, bold, no gradient
- Subtitle: product verbs — "Create. Edit. Export."
- CTA: single accent button + ghost text link
- Background: subtle geometric abstract or pure dark canvas
- Show tool interface preview (muted)

### Login / Register

- Centered card, refined: thinner borders, cleaner spacing
- Labels above inputs
- Submit: accent blue-gray, full-width, 44px
- OAuth divider: subtle horizontal rule + "or"

### Dashboard Shell

- Sidebar: `#141414`, no right border
- Active nav: 2px left accent bar on `#1C1C1C` bg
- Inactive: secondary text
- Brand: name only, medium weight, no icon
- Topbar: transparent, hairline bottom border, breadcrumb + avatar
- Sign out: bottom of sidebar, ghost style

### Generate Page (Core)

- Left panel 380px: compact form
- Prompt: large textarea, hairline border, character count
- Advanced options: collapsed behind toggle
- Model selector: compact dropdown
- Generate button: accent, full-width, 44px
- Right area: large preview canvas with empty state guide
- Mode toggle: small segmented control
- Results: subtle fade-in only

### History Page

- Grid: 3–4 column thumbnails
- Card: thumbnail + prompt snippet + timestamp
- Hover: subtle border brighten
- Empty state: "No generations yet" → link to Generate
- Filter tabs: underline style

### Settings Page

- Grouped sections with dividers
- Label above input
- Save per section
- Danger zone: separated at bottom, red-tinged border

---

## Implementation Order

1. Design tokens (globals.css CSS variables)
2. Landing page
3. Auth pages (login, register)
4. Dashboard shell (sidebar, topbar, layout)
5. Generate page components
6. History page
7. Settings page
8. Final polish pass
