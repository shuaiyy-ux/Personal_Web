# Tasks: CM Yao Personal Site

**Input**: Design documents from `/specs/001-personal-site/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include targeted Playwright + axe checks for accessibility and core flows per story.
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

- [X] T001 Initialize Vite + TypeScript static site scaffold in package.json and src/main.ts
- [X] T002 [P] Add project scripts for dev/build/test (vite dev/build, playwright, axe) in package.json
- [X] T003 [P] Add base repo hygiene (.gitignore, README stub, license header) in repository root

---

## Phase 2: Foundational (Blocking Prerequisites)

- [X] T004 Create source layout (src/assets, src/data, src/sections, src/components, src/styles, public) matching plan structure
- [X] T005 [P] Define global styles, typography scale, palette tokens (black/white base, red/pink accents), motion tokens in src/styles/global.css
- [X] T006 [P] Seed content data files (src/data/writing.json, projects.json, contacts.json, meta.json) conforming to contracts/content-schema.json with sample entries
- [X] T007 [P] Set up Playwright + axe test harness (tests/e2e/, tests/accessibility/, playwright.config.ts) with scripts wired
- [X] T008 Configure static hosting and headers in vercel.json (static output, HTTPS, cache, custom domain placeholder)
- [X] T009 Establish page shell and section mounting in src/main.ts with layout container and section insertion points

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Understand the identity fast (Priority: P1) 🎯 MVP

**Goal**: Hero communicates automation-focused identity instantly.
**Independent Test**: Users can restate positioning and CTA within 5 seconds from hero + statement.

### Tests for User Story 1
- [X] T010 [P] [US1] Add Playwright + axe coverage for hero visibility, text clarity, and reduced-motion handling in tests/e2e/hero.spec.ts and tests/accessibility/hero.a11y.spec.ts

### Implementation for User Story 1
- [X] T011 [P] [US1] Implement hero section with brand mark, headline, subheadline, CTA anchor in src/sections/hero.ts
- [X] T012 [P] [US1] Add background animation styles with prefers-reduced-motion fallback in src/styles/animations.css
- [X] T013 [US1] Wire hero and statement section into layout flow with accessibility landmarks in src/main.ts

**Checkpoint**: User Story 1 independently testable.

---

## Phase 4: User Story 2 - Choose where to go (Priority: P2)

**Goal**: Navigation blocks direct users to Blog, LinkedIn, GitHub immediately under hero.
**Independent Test**: Each block reachable and target correct without scrolling further.

### Tests for User Story 2
- [X] T014 [P] [US2] Add Playwright + axe checks for nav blocks focus/hover states and correct destinations in tests/e2e/nav.spec.ts and tests/accessibility/nav.a11y.spec.ts

### Implementation for User Story 2
- [X] T015 [P] [US2] Build navigation blocks component with three cards and labels in src/sections/navigation.ts
- [X] T016 [P] [US2] Style accent hover/focus states and mobile stacking in src/styles/navigation.css
- [X] T017 [US2] Integrate navigation section after hero with responsive spacing and skip-link compatibility in src/main.ts

**Checkpoint**: User Stories 1 and 2 independently testable.

---

## Phase 5: User Story 3 - Browse writing and projects (Priority: P3)

**Goal**: Visitors skim latest writing and projects, then reach CTA to contact.
**Independent Test**: Users can view lists, understand recency/stack, and use CTA without other pages.

### Tests for User Story 3
- [X] T018 [P] [US3] Add Playwright + axe coverage for writing/projects lists and CTA contact visibility in tests/e2e/content.spec.ts and tests/accessibility/content.a11y.spec.ts

### Implementation for User Story 3
- [X] T019 [P] [US3] Render Latest Writing list (6–9 items with title/summary/tags/date) from src/data/writing.json in src/sections/writing.ts
- [X] T020 [P] [US3] Render Projects/Experiments cards (title/summary/tags/github link, optional thumbnail) from src/data/projects.json in src/sections/projects.ts
- [X] T021 [US3] Implement CTA section with button "LET'S START" and required contact links from src/data/contacts.json in src/sections/cta.ts
- [X] T022 [US3] Handle empty/short data gracefully with counts and fallbacks across writing/projects/CTA in src/main.ts

**Checkpoint**: All three user stories independently testable.

---

## Final Phase: Polish & Cross-Cutting Concerns

- [X] T023 [P] Optimize assets and typography loading (font subset/weights, image compression) in src/assets and src/styles/global.css
- [X] T024 [P] Surface lastUpdated meta and footer consistency (accent, links) in src/sections/footer.ts and src/data/meta.json
- [X] T025 [P] Run full preview build, deploy to Vercel preview, verify custom domain mapping and headers using vercel.json
- [X] T026 Validate against quickstart.md, success criteria, and WCAG checklist; update README/quickstart with any adjustments

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Final Phase.
- User stories can start only after Foundational (Phase 2) completes; then proceed in priority order (P1 → P2 → P3) or in parallel if capacity allows.
- Within each story: tests first, then sections/styles, then integration.

## Parallel Opportunities (examples)

- Setup: T002, T003 in parallel after T001.
- Foundational: T005, T006, T007, T008 can run in parallel after T004; T009 follows structure readiness.
- US1: T010 and T011/T012 in parallel; T013 after sections exist.
- US2: T014 and T015/T016 in parallel; T017 after nav built.
- US3: T018 and T019/T020 in parallel; T021/T022 after data sections exist.
- Final: T023, T024, T025 in parallel; T026 last as validation sweep.

## Implementation Strategy

- MVP first: Complete Phases 1-3 to deliver hero + statement clarity with preview deployment.
- Incrementally add navigation (Phase 4) then content/CTA (Phase 5), validating accessibility and flows per phase before promotion.
- Keep JS payload minimal, prefer CSS for motion, and gate production via Vercel preview approval.

---

## Phase 7: Design System Enhancement (P0 - High Impact)

**Goal**: Transform MVP into instantly recognizable CM Yao branded site with depth system, hero brand framing, and strong interaction affordances.

### Background Depth System
- [X] T027 Add design tokens for depth system (glow colors, noise opacity, motion values) in src/styles/tokens.css
- [X] T028 [P] Implement 3-layer background (base, drifting glow, scanline) in src/styles/background.css with CSS animations
- [X] T029 [P] Add noise texture pseudo-element overlay at 0.03–0.06 opacity in src/styles/background.css or via public/noise.svg
- [X] T030 Wire background depth system into global layout in src/styles/global.css and src/main.ts

### Hero Brand System
- [X] T031 Implement corner bracket framing (SVG or CSS borders at low opacity) around hero content in src/styles/hero.css
- [X] T032 [P] Add index label "CM Yao / 001" above brackets in src/sections/hero.ts with staggered reveal animation
- [X] T033 [P] Implement sequenced reveal animation (labels → brackets → headline → subhead → CTA, 400–700ms each) in src/styles/hero.css
- [X] T034 Update hero section with brand framing structure in src/sections/hero.ts

### Enhanced Card Interactions
- [X] T035 Add hover state (border visible, lift 4px, background brighten, arrow nudge) in src/styles/navigation.css
- [X] T036 [P] Add focus state (visible keyboard outline with offset) in src/styles/navigation.css for a11y
- [X] T037 [P] Add press state (scale 0.99, shadow removal) in src/styles/navigation.css
- [X] T038 Add action labels under navigation cards ("Read articles", "Connect", "View code") in src/sections/navigation.ts

**Checkpoint**: P0 design changes complete - background depth + hero brand + card interactions.

---

## Phase 8: Design System Polish (P1 - Adds Polish)

### Scroll Cue
- [X] T039 Implement scroll cue component (animated chevron or "scroll" text) below hero in src/components/scroll-cue.ts
- [X] T040 [P] Add scroll cue CSS with fade-out on scroll and reduced-motion handling in src/styles/hero.css
- [X] T041 Wire scroll cue into hero section in src/sections/hero.ts

### Motion System Standardization
- [X] T042 Unify all motion values to use design tokens (easing: cubic-bezier(0.2, 0.8, 0.2, 1), durations) in src/styles/tokens.css
- [X] T043 [P] Add reduced-motion media queries to all animated elements ensuring functionality preserved in src/styles/animations.css
- [X] T044 [P] Optimize background animations for mobile (reduce glow amplitude, pause scanline on battery saver) in src/styles/background.css

### Brand Symbol
- [X] T045 Design/add brand symbol SVG (8-ray geometric mark, subtle rotating animation 60–120s) in src/assets/brand-symbol.svg
- [X] T046 [P] Implement brand symbol component with rotation animation in src/components/brand-symbol.ts and src/styles/hero.css
- [X] T047 Integrate brand symbol into hero section (near index label or corner) in src/sections/hero.ts

**Checkpoint**: P1 design polish complete - scroll cue + motion system + brand symbol.

---

## Phase 9: Validation & Regression Testing

- [X] T048 Update Playwright tests to cover new interactions (hover lift, focus outline, press compression) in tests/e2e/nav.spec.ts
- [X] T049 [P] Add reduced-motion test coverage for all new animations in tests/accessibility/hero.a11y.spec.ts
- [X] T050 [P] Run Lighthouse performance audit to ensure no regression from depth system (target: same or better scores)
- [X] T051 Full visual review on mobile viewport (375px), tablet (768px), desktop (1440px) - ensure design feels intentional
- [X] T052 Run full build and deploy to Vercel preview, validate brand recognition and interaction quality

---

## Updated Dependencies

- Phases 1–6: Original MVP implementation (COMPLETE)
- Phase 7 (P0): Can start immediately, depends on existing MVP structure
- Phase 8 (P1): Can run in parallel with Phase 7 or after
- Phase 9: After Phases 7–8 complete, final validation
