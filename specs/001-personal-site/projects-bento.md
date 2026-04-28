# Feature Specification: Projects Section (Variable-Count Responsive Grid)

**Feature Branch**: `001-personal-site`
**Created**: 2026-04-25
**Updated**: 2026-04-28 (kept keyword scatter cards as 1×1 fillers in the mosaic; mobile mosaic preserves layout instead of stacking)
**Status**: Shipped
**Input**: The Projects section is the centerpiece of the home page. It started as a hand-curated 6×4 bento mosaic of 4 project cards + 8 keyword scatter cards. After the portfolio outgrew 4 projects, the layout was rewritten as a variable-count responsive mosaic that auto-fills at min 140px width with `grid-auto-rows: 140px` and `grid-auto-flow: dense`. Project cards span 2 columns × 2 rows; the 8 keyword scatter cards stay 1×1 and fill the gaps so the rhythm reads as a curated mosaic rather than a uniform tile board.

## Design Purpose

The portfolio is the primary trust signal for the site. The section reads as the most authored block on the home page:

1. **Hierarchy through `featured`.** Featured project cards span 2×2; the rest are 1×1. The size difference declares "this is the featured work today, those are the rest." A flat grid would imply equal weight.
2. **Variable count without layout edits.** New projects drop into the grid through `projects.json` only. No CSS or layout array edits are required.
3. **Cyan as a semantic layer.** The site uses red `#e63946` for interactive accents (CTA, hover, links). Code/AI motifs use a separate token `--color-accent-cool: #22d3ee` for project status glyphs (shipped), code abbreviations, icon strokes, AI shimmer borders, and the dot-grid pattern. Result: red = action, cyan = system data.
4. **Feathered translucent panel anchors the section.** The grid sits inside a card whose background is `rgba(10, 10, 10, 0.5)` blurred 28px on a separate ::before layer, producing a true gaussian-feathered edge rather than a hard mask.
5. **Motion that signals "intelligent system" without becoming theater.** Cursor spotlight, scramble title decode, AI shimmer border on featured cards, and stagger reveal on scroll: each reads as instrumented, not decorative.

The reference target is the editorial-catalog feel of sites like juliakrantz.com (numbered, abbreviated, generous whitespace) wired into a Linear/Vercel/Resend-grade dark UI vocabulary.

---

## User Scenarios & Testing

### User Story 1: See the work as a curated grid (Priority: P1)

A visitor lands, scrolls past the hero, and reads the Projects section as the most authored part of the page: project cards laid out in a responsive grid, with featured work taking visibly more space.

**Why this priority**: The portfolio is the primary trust signal. If the projects section does not feel intentional, nothing else does.

**Independent Test**: Open the homepage on a desktop ≥1024px. Scroll once. The Projects section is fully visible as a responsive grid; the featured card spans 2×2 cells; non-featured cards are 1×1.

**Acceptance Scenarios**:
1. **Given** the page is loaded on desktop, **When** the user scrolls to the Projects section, **Then** the section header reads "Projects · NN ITEMS" (mono cyan, with NN matching the count from `projects.json`), the grid renders one card per project, and the section is contained inside a feathered translucent panel.
2. **Given** the grid is rendered, **When** the user hovers a project card, **Then** a cyan radial spotlight follows the cursor, the project title decodes via scramble animation (~520ms), the icon's border pulses cyan, and the arrow nudges up-right while turning red.
3. **Given** the Finance Analyzer card (`featured: true`), **When** it sits idle, **Then** a conic-gradient cyan shimmer rotates around its border at ~4.5s/turn, and the card occupies 2 columns × 2 rows on viewports ≥720px.
4. **Given** the user prefers reduced motion, **When** the page loads, **Then** scramble, stagger reveal, and shimmer rotation are disabled; a static cyan border replaces the rotating shimmer.

### User Story 2: Reach a project's destination in one click (Priority: P1)

Each project card is a single anchor: clicking anywhere on it navigates to the per-project detail page at `/projects/<slug>/`.

**Independent Test**: Click each project card. Each opens its detail page in the same tab.

**Acceptance Scenarios**:
1. **Given** any project card, **When** the user clicks it, **Then** navigation goes to `/projects/<id>/` in the same tab.
2. **Given** a project has `liveUrl`, **When** the card renders, **Then** a LIVE badge appears in the title row.
3. **Given** keyboard focus on a project card, **When** the user presses Enter, **Then** activation behaves identically to mouse click.

### User Story 3: Read in zh as well as en (Priority: P2)

The bilingual switcher swaps every project's tagline to its `tagline_zh`, plus the section header and live badge to Chinese strings.

**Acceptance Scenarios**:
1. **Given** locale is `zh`, **When** the section renders, **Then** the header reads "项目 · NN 项", the live badge reads "在线", and each project's `tagline_zh` is shown if present (falling back to `tagline`).
2. **Given** locale switches at runtime via the header toggle, **Then** `localStorage` persists the choice and a full reload re-renders all bilingual fields.

### User Story 4: Stay readable on a phone (Priority: P2)

On screens ≤720px wide, the mosaic stays intact at smaller scale. Project cards remain 2×2 anchor tiles; the keyword scatter cards remain 1×1 fillers. Padding, icon size, and tagline line-clamp tighten so content stays legible.

**Acceptance Scenarios**:
1. **Given** the viewport is ≤720px, **When** the section renders, **Then** the grid resolves to 2 to 3 columns of 100px cells, project cards span 2×2 (≈210px square), tag cards stay 1×1 (≈100px square), and panel padding/feather inset both shrink.
2. **Given** the same mobile viewport, **When** the user taps a card, **Then** the card responds without the desktop hover-lift transform; the title scramble re-fires on every tap (not gated by the desktop once-per-hover guard).

### Edge Cases

- **Adding a new project**: drop a new entry into `src/data/projects.json` and an SVG into `src/sections/project-icons.ts`. The grid auto-fills with the new card. No layout-array edit required.
- **No featured project**: the grid renders as a flat 1×1 grid for all cards. The section still reads as a curated block because of the panel and dot-grid framing.
- **Multiple featured projects**: each `featured: true` card claims 2 cols × 2 rows. The grid auto-flow (`grid-auto-flow: dense`) backfills the gaps with subsequent 1×1 cards.
- **Tagline overflow**: project taglines are line-clamped to 3 lines (5 lines for featured cards) via `-webkit-line-clamp`. Authors should keep taglines under ~80 chars for natural fit.
- **Missing icon**: `projectIcon(id)` returns `''` for unknown ids; the icon box renders empty. Always add a corresponding SVG when introducing a new project id.
- **Reduced motion**: spotlight tracking still runs (CSS opacity transition is short and non-animating); scramble + stagger reveal + shimmer rotation are skipped.

---

## Requirements

### Functional Requirements

#### Layout
- **FR-PB-001**: Render the Projects section as a CSS Grid with `grid-template-columns: repeat(auto-fill, minmax(140px, 1fr))`, `grid-auto-rows: 140px`, and `grid-auto-flow: dense` at viewports >720px.
- **FR-PB-002**: Every project card spans `grid-column: span 2; grid-row: span 2` at viewports ≥720px (project cards are the anchor tiles). Keyword scatter cards stay at 1×1 and fill gaps via dense flow.
- **FR-PB-003**: On viewports ≤720px the mosaic stays intact at smaller scale: `grid-template-columns: repeat(auto-fill, minmax(100px, 1fr))` with `grid-auto-rows: 100px`. Project cards continue to span 2×2; tag cards continue to fill 1×1 cells. Project-card padding, icon size, and tagline line-clamp are tightened so content stays readable at the smaller cell size.
- **FR-PB-004**: Position the section between the hero and the contact navigation (i.e., above `[data-section="navigation"]`).

#### Visual treatment
- **FR-PB-005**: Wrap the section in a translucent panel using a pseudo-element with `background: rgba(10, 10, 10, 0.5)`, `border-radius: 32px`, `filter: blur(28px)`, `inset: 24px` (12px on mobile) to produce gaussian-feathered edges.
- **FR-PB-006**: Overlay a cyan dot-grid (`radial-gradient` 28px tile) on the section, masked by `radial-gradient(ellipse 75% 65% at 50% 50%, black 25%, transparent 85%)` so the pattern concentrates at center and fades to edges.
- **FR-PB-007**: Apply the new design token `--color-accent-cool: #22d3ee` to: project status glyphs (shipped), mono codes, project icon strokes, terminal cursor in the hero, and the AI shimmer border.

#### Project cards
- **FR-PB-008**: Each project card displays: a status badge (custom SVG glyph + uppercase mono label `SHIPPED` / `WIP` / `ARCHIVED`) inside a thin pill in the top-left corner, 44×44 SVG icon, title (700 weight), optional LIVE badge, tagline (3-line clamp; 5-line clamp for featured), and a footer row with `code · year` mono meta and a directional arrow. The status badge color follows status: cyan for shipped (with subtle drop-shadow glow on the glyph), amber for wip (with a slow rotation on the glyph, suppressed under reduced motion), muted gray for archived. The status carries a localized accessible label via `role="img"` + `aria-label`.
- **FR-PB-009**: A project marked `featured: true` renders an animated conic-gradient cyan border via `::after` rotating 360° per 4.5s; reduced-motion users see a static linear-gradient instead.
- **FR-PB-010**: Hover state lifts the card 2px, raises background to `rgba(255, 255, 255, 0.04)`, sets border to `rgba(34, 211, 238, 0.25)`, glows the icon box, and translates the arrow `+4px / -4px`.
- **FR-PB-011**: Cursor-spotlight effect uses CSS variables `--x` and `--y` set by a `pointermove` listener; opacity fades in over `--duration-normal`.
- **FR-PB-012**: Title hover triggers a 520ms scramble decode effect (vanilla impl in `src/lib/scramble.ts`), one-shot per hover, restored on `pointerleave`.

#### Reveal motion
- **FR-PB-013**: All project cells fade in + translate up 16px on first scroll into view via Motion One's `inView`, with stagger delay `Math.min(index, 8) * 0.05s`. Disabled under reduced motion.

#### Internationalization
- **FR-PB-014**: i18n keys `projects.heading`, `projects.count_label`, `projects.live` exist for both `en` and `zh`.
- **FR-PB-015**: Each project entry supports optional `tagline_zh` and `summary_zh`; renderer falls back to English fields if missing.

### Non-Functional Requirements

- **FR-PB-016**: Section adds no >12kB gzipped to the main bundle (current overhead is Motion One only at ~3.8kB).
- **FR-PB-017**: All interactive elements pass axe-core a11y audit (covered in `tests/accessibility/content.a11y.spec.ts`).
- **FR-PB-018**: Section is discoverable via `[data-section="projects"]` for tests and styling hooks.

---

## Key Entities

### ProjectItem (extended from data-model.md)
Source: `src/data/projects.json`. Schema in `src/sections/projects.ts`.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | Slug; matches an icon key in `project-icons.ts` |
| `code` | string | yes | 2–3 uppercase letters; rendered as the mono badge in card meta |
| `title` | string | yes | Display title |
| `tagline` | string | yes | 1-line summary, ≤80 chars recommended |
| `tagline_zh` | string | no | Chinese tagline; falls back to `tagline` if absent |
| `summary` | string | yes | Long-form summary for the detail page |
| `summary_zh` | string | no | Chinese long-form summary |
| `tags` | string[] | yes | Stack/area tags; surfaced on the detail page meta, not on the grid |
| `githubUrl` | string | no | https URL or empty string; the empty case suppresses the Source link entirely |
| `repoPrivate` | boolean | no | Default false; when true, the detail page hides the "Source ↗" link even if `githubUrl` is set (keeps the URL on record for when the repo is published) |
| `liveUrl` | string | no | Optional https URL or relative path; presence triggers the LIVE badge |
| `year` | string | yes | 4-digit year; mono in card meta |
| `featured` | boolean | no | Default false; true triggers AI shimmer border (project cards already span 2×2 by default) |
| `status` | enum | no | `'shipped'` (default) / `'wip'` / `'archived'`. Drives the status badge (custom SVG glyph + uppercase mono label) in the card top-left and the detail-page eyebrow |

---

## Success Criteria

- **SC-PB-001**: 95% of first-time visitors recognize the Projects section as the page's most authored block (vs. statement, writing, contact) in usability testing.
- **SC-PB-002**: All project cards reach their detail page on first click in 100% of test runs (covered by `tests/e2e/project-detail.spec.ts`).
- **SC-PB-003**: Page passes axe-core audit on the projects section with zero violations.
- **SC-PB-004**: Reduced-motion users see a fully readable section with no animation artifacts.
- **SC-PB-005**: zh locale renders zh tagline + zh header strings on every project; falls back to en gracefully when zh fields missing.
- **SC-PB-006**: Mobile viewport (≤720px) shows the mosaic intact at smaller scale (project cards 2×2, tag cards 1×1), no horizontal scroll, and tag cards remain visible.
- **SC-PB-007**: Adding a project requires only a JSON edit + an SVG icon; no CSS or layout-array changes.

---

## Authoring Guide

### Adding a new project

1. **Edit `src/data/projects.json`**, adding a new entry:
   ```json
   {
     "id": "new-thing",
     "code": "NT",
     "title": "New Thing",
     "tagline": "What it does in one line.",
     "tagline_zh": "一句话说明它做什么。",
     "summary": "Long form for the detail page.",
     "summary_zh": "长文版本，用于详情页。",
     "tags": ["TypeScript", "AI"],
     "githubUrl": "https://github.com/cmyao/new-thing",
     "year": "2026"
   }
   ```

2. **Add an SVG icon** in `src/sections/project-icons.ts` and register it:
   ```ts
   const iconNewThing = `
     <svg viewBox="0 0 48 48" fill="none" stroke="currentColor"
          stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
          aria-hidden="true">
       <!-- line-art using strokes; 48×48 viewBox; currentColor inherits cyan -->
     </svg>
   `;
   ICONS['new-thing'] = iconNewThing;
   ```

3. **Run `python3 scripts/generate_projects.py`** to scaffold the route shell, compile any markdown body, and register the rollup entry. No CSS or grid-array edit is needed.

### Marking a project as featured (AI shimmer + 2×2 span)

Set `"featured": true` on the project entry. This triggers:
- The rotating conic-gradient cyan border via `.project-card--featured::after`.
- A 2-column × 2-row grid span at viewports ≥720px.

Use sparingly: featured cards are focal cues. Multiple featured cards still tile, but the visual hierarchy weakens with more than 2 to 3.

### Adding a live demo

Add a `liveUrl` field. The card will show a LIVE badge in the title row. The card itself always navigates to `/projects/<slug>/`; the live destination lives on the detail page.

### Adding new UI strings

i18n keys live in `src/i18n.ts` under both `en` and `zh` objects. Existing project-related keys: `projects.heading`, `projects.count_label`, `projects.live`. Use `t('key')` in templates.

### Tweaking visual feel

Visual tokens are centralized:
- `src/styles/tokens.css`: `--color-accent-cool` and its glow/soft variants
- `src/styles/projects.css`: panel feather, dot grid, card padding, hover states, featured span rules
- `src/styles/hero.css`: terminal cursor `▌` blink at end of subheadline

### Disabling motion

The section honors `prefers-reduced-motion: reduce`. JS-level: scramble, stagger reveal are gated. CSS-level: AI shimmer rotation falls back to static linear gradient; card hover-lift is suppressed.

---

## Implementation Map

| Concern | File |
|---|---|
| Section renderer | `src/sections/projects.ts` |
| Per-project SVG icons | `src/sections/project-icons.ts` |
| Section + card styles | `src/styles/projects.css` |
| Cyan accent + terminal cursor styles | `src/styles/tokens.css`, `src/styles/hero.css` |
| Project data | `src/data/projects.json` |
| i18n keys | `src/i18n.ts` |
| Scramble utility | `src/lib/scramble.ts` |
| Section wiring (insertion point) | `src/main.ts` |
| E2E tests | `tests/e2e/content.spec.ts`, `tests/e2e/project-detail.spec.ts` |
| A11y tests | `tests/accessibility/content.a11y.spec.ts` |
