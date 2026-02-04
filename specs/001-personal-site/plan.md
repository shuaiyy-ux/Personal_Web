# Implementation Plan: CM Yao Personal Site

**Branch**: `001-personal-site` | **Date**: 2026-02-03 | **Spec**: [specs/001-personal-site/spec.md](specs/001-personal-site/spec.md)
**Input**: Feature specification from `/specs/001-personal-site/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a static, system-branded personal site that feels instantly recognizable as CM Yao—not a stock landing template. The design uses a three-layer background depth system, a hero with corner bracket framing and indexed label, navigation blocks with strong click affordance, and a unified motion system that makes "automating the mundane" part of the experience through precise, restrained motion. Deploy as static assets on Vercel with preview-to-production gating, WCAG 2.1 AA accessibility, and no personal data collection.

### Design Principles
- Keep it minimal, but make it instantly recognizable as CM Yao
- Make "Automating the mundane" part of the experience through precise, restrained motion
- Mobile must feel equally intentional and performant

### Non-Goals
- No heavy WebGL scenes that hurt first load
- No large illustration dependencies
- No motion that competes with readability

## Technical Context

**Language/Version**: TypeScript 5.x (minimal DOM), CSS
**Primary Dependencies**: Vite (static build), Playwright + @axe-core/playwright for a11y/e2e, PostCSS/autoprefixer
**Storage**: Static JSON/TS data files (no runtime storage)
**Testing**: Playwright for flows + axe checks; Lighthouse for performance regression
**Target Platform**: Vercel static hosting; modern evergreen browsers + mobile
**Project Type**: Single-page static web
**Performance Goals**: Initial render under ~1.5s on good 3G; JS payload <100KB; no Lighthouse regression from depth system
**Constraints**: No serverless/edge functions; no personal data collection; WCAG 2.1 AA; custom domain on Vercel
**Scale/Scope**: Single site, one primary page with sections and static content feeds

### Design Token System
- **Colors**: off-black base (#0a0a0a), accent red, low-contrast grays for guides
- **Borders**: 1px guide lines, corner brackets at low opacity
- **Glow**: radial gradients, localized near content
- **Noise**: pseudo-element overlay at 0.03–0.06 opacity
- **Motion tokens**:
  - Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)`
  - UI duration: 400–700ms
  - Background loops: 20–40s, minimal amplitude (20–40px drift)
  - Scanline: 8–12s cycle, very low opacity
  - Symbol rotation: 60–120s per revolution

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Static Simplicity: plan uses static assets via Vite build; no server runtimes. ✅
- Accessible by Default: WCAG 2.1 AA targeted; axe + manual checks planned. ✅
- Privacy and Minimal Data: no data collection; optional analytics only if privacy-preserving and DNT-aware. ✅
- Authentic Content and Traceability: content authored/attributed, versioned in repo with visible last-updated metadata. ✅
- Preview-Gated Deployments: Vercel previews required; production promotion only after review on custom domain. ✅

## Project Structure

### Documentation (this feature)

```text
specs/001-personal-site/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── assets/           # static images/icons, noise texture, brand symbol SVG
├── data/             # writing.json, projects.json, contacts.json, meta.json
├── sections/         # hero, navigation, writing, projects, statement, CTA, footer
├── components/       # shared UI (buttons, cards, tags, scroll-cue, brand-symbol)
├── styles/
│   ├── tokens.css      # design tokens (colors, borders, glow, noise, motion)
│   ├── global.css      # reset, base styles, utility classes
│   ├── background.css  # 3-layer depth system, drifting glow, scanline
│   ├── hero.css        # corner brackets, index label, staggered reveal
│   ├── navigation.css  # card hover/focus/press states, arrow animation
│   ├── animations.css  # motion system, reveal animations, reduced-motion
│   └── [section].css   # per-section styles
└── main.ts           # entry for static site

public/               # favicon, manifest, noise.svg, static files

tests/
├── e2e/              # Playwright flows (hero, nav blocks, scroll cue, CTA)
└── accessibility/    # axe checks, reduced-motion tests
```

**Structure Decision**: Single static web project built with Vite + TypeScript targeting Vercel static hosting; no backend directories required.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
| _None_ |  |  |
