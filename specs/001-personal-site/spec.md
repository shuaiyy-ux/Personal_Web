# Feature Specification: CM Yao Personal Site

**Feature Branch**: `001-personal-site`  
**Created**: 2026-02-03  
**Status**: Draft  
**Input**: User description: "CM Yao Personal Blog Site Description ... minimal, engineering-minded personal website with black/white base, red or pink accents, subtle star/geometric motion, typography-led hero, navigation blocks for Blog/LinkedIn/GitHub, writing and project showcase, statement, CTA, mobile principles, footer; deploy on Vercel with preview/production gating."

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Understand the identity fast (Priority: P1)

First-time visitors immediately grasp CM Yao's automation-focused positioning via the hero and supporting statement within seconds of landing. The hero feels like a branded control surface, not a stock template.

**Why this priority**: Sets the site's promise and tone; without instant clarity, visitors will bounce before exploring content.

**Independent Test**: Load the homepage and confirm users can restate the positioning and CTA within 5 seconds using only the hero and statement.

**Acceptance Scenarios**:

1. **Given** a visitor lands on the homepage, **When** the hero loads, **Then** the headline, subheadline, brand mark with index label (CM Yao / 001), and corner bracket framing are legible and communicate a system-branded automation focus.
2. **Given** the hero is displayed, **When** motion settings are reduced or disabled, **Then** the background animation gracefully degrades to a static state while retaining readability and depth.
3. **Given** the hero loads, **When** animation plays, **Then** corner brackets reveal first, then name label, then headline, then subtitle—each with a short upward drift (6–10px) plus fade-in.
4. **Given** the hero is displayed, **When** looking at the bottom of the viewport, **Then** a scroll cue (thin line with dot or arrow) indicates content below.

---

### User Story 2 - Choose where to go (Priority: P2)

Visitors pick a primary destination (Blog, LinkedIn, GitHub) from immediately visible navigation blocks that feel like clickable modules with strong affordance.

**Why this priority**: These destinations drive engagement and conversions; clarity and speed of choice are critical.

**Independent Test**: From the landing section, each navigation block can be clicked or tapped to reach the correct external/internal destination without scrolling further.

**Acceptance Scenarios**:

1. **Given** the navigation blocks are visible under the hero, **When** a visitor hovers a block, **Then** the border becomes visible, the card lifts 4px, background brightens subtly, and the arrow icon nudges 2px or rotates.
2. **Given** a navigation block, **When** a visitor focuses it via keyboard, **Then** a visible focus outline appears matching the accent color.
3. **Given** a navigation block, **When** a visitor presses/clicks it, **Then** a slight compression (scale 0.99) provides tactile feedback.
4. **Given** a mobile viewport, **When** viewing the navigation blocks, **Then** they stack into full-width touch-friendly cards with larger spacing and touch targets.
5. **Given** each navigation block, **Then** it displays: title, one-sentence description, clear action label (Read, Connect, View Repo), and unified arrow icon top-right.

---

### User Story 3 - Browse writing and projects (Priority: P3)

Visitors skim latest writing (6–9 entries) and selected projects (3–6 entries) with concise summaries, tags, dates, and GitHub links, then reach the CTA to contact.

**Why this priority**: Demonstrates credibility and directs collaboration opportunities.

**Independent Test**: From the homepage, users can review writing and projects, understand recency and scope, and use the CTA to initiate contact without needing other pages.

**Acceptance Scenarios**:

1. **Given** the writing section, **When** viewing the list, **Then** each item shows title, one-line summary, tags, and date for at least six items (or all available if fewer) with consistent spacing.
2. **Given** the projects section, **When** viewing the cards, **Then** each shows title, one-line description, stack tags, and a GitHub link, with optional thumbnails not blocking load performance.
3. **Given** the CTA section, **When** a visitor reaches it, **Then** email, LinkedIn, and GitHub contact options are immediately visible, and the CTA button text reads "LET'S START".

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

- Motion-reduced or prefers-reduced-motion: all animation loops disabled, reveal animations shortened, site renders as clean static version without layout shifts.
- Limited content: if fewer than 6 posts or 3 projects exist, the sections still render gracefully and label the count without empty gaps.
- External links: Blog (if external), LinkedIn, and GitHub open reliably with clear target indication; failure states surface a plain fallback link.
- Small screens: hero headline fits 2–3 lines, cards stack vertically with larger spacing and touch targets, background animation degrades (reduced noise intensity, disabled scanline, only slow glow drift if performance allows).
- No-JS or blocked fonts: typography and layout remain legible using system-safe fallbacks.
- Mid-range phones: no jank, readable without zoom, primary actions visible within 1.5 screens.

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

#### Background & Depth System
- **FR-001**: Replace flat black with a three-layer background: (1) dark base gradient (slightly off-black), (2) subtle noise texture overlay (opacity 0.03–0.06), (3) localized radial glow near hero content.
- **FR-002**: Add slow drifting glow field animation that moves 20–40px over 20–40 seconds; add barely visible scanline/soft band moving vertically once every 8–12 seconds at very low opacity.

#### Hero Brand System
- **FR-003**: Present a system-style branded hero with: small index label near name (CM Yao / 001) in accent red, 1px guide lines or corner brackets framing the hero block (low-contrast gray), subtitle formatted like console annotation with restrained prefix (//).
- **FR-004**: On load, reveal corner brackets first → name label → headline → subtitle; each step uses short upward drift (6–10px) plus fade-in with consistent motion tokens.
- **FR-005**: Add scroll cue at hero bottom: thin line with dot that loops downward, or small arrow icon with gentle movement.

#### Navigation Blocks
- **FR-006**: Provide three primary navigation blocks (Blog, LinkedIn, GitHub) as strong clickable modules with: title, one-sentence description, clear action label (Read, Connect, View Repo), unified arrow icon top-right.
- **FR-007**: Card hover state: border becomes visible, lift 4px, background slightly brighter, arrow nudges 2px or rotates subtly.
- **FR-008**: Card focus state: visible keyboard focus outline in accent color.
- **FR-009**: Card press state: slight compression (scale 0.99) for tactile feedback.
- **FR-010**: Cards stack vertically on mobile with larger spacing and touch targets.

#### Content Sections
- **FR-011**: Render a Latest Writing list showing 6–9 items, each with title, one-line summary, tags, and date, ordered by recency; handle fewer items without empty placeholders.
- **FR-012**: Render a Projects section as a **bento mosaic** (6×4 grid) mixing 4 large project cards (2×2) with 8 small keyword cards (1×1), inside a feathered translucent panel positioned above the contact navigation. Project cards link to live demo or GitHub. See full spec in [projects-bento.md](./projects-bento.md).
- **FR-013**: Include a statement line mid-page using one of the provided options with the brand symbol for continuity.
- **FR-014**: Provide a CTA section with the line "Ready to build something cool together?" and a button labeled "LET'S START" that surfaces contact options: email (required), LinkedIn (required), GitHub (required).

#### Brand Symbol
- **FR-015**: Create a minimal geometric mark (star-like, 8-ray, or abstract CM) placed consistently: near hero label, as section divider, in footer.
- **FR-016**: Brand symbol animates with very slow rotation (one revolution per 60–120s) or gentle opacity pulse; on hover, sharpens or brightens slightly.

#### Motion System
- **FR-017**: Standardize motion tokens: easing cubic-bezier(0.2, 0.8, 0.2, 1), duration 400–700ms for UI elements, background loops 20–40s with minimal amplitude.
- **FR-018**: All sections reveal with subtle fade and small vertical translate on scroll.
- **FR-019**: Implement prefers-reduced-motion: disable all loops, shorten reveals, render clean static version.

#### Design Tokens
- **FR-020**: Introduce unified design tokens for colors, borders, glow, noise, and motion—ensuring consistent system feel across all components.
- **FR-021**: Maintain sufficient contrast and legibility; depth visible on different displays but never distracts from text.

#### Privacy & Deployment
- **FR-022**: Avoid collecting personal data; if analytics are present, they must be privacy-preserving and honor Do Not Track.
- **FR-023**: Enforce accessibility to at least WCAG 2.1 AA for color contrast, focus visibility, keyboard navigation, and alt text.
- **FR-024**: Publish changes through Vercel preview deployments reviewed before production; production must use the custom domain.

### Key Entities *(include if feature involves data)*

- **Writing Item**: title, one-line summary, tags, publish date, link/slug; ordered by recency.
- **Project Item**: title, one-line description, stack tags, GitHub link, optional thumbnail, optional live link.
- **Contact Link**: label (Email, LinkedIn, GitHub), target URL or mailto, visibility (required/optional).

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: 90% of first-time visitors can state the hero message and intended focus within 5 seconds of page load in usability tests.
- **SC-002**: All three primary navigation blocks are visible without scrolling on desktop and are reachable within one tap on mobile; 95% of test users reach their chosen destination in under 8 seconds.
- **SC-003**: Writing section displays at least six items (or all available) with complete metadata, and 90% of users can identify a recent post and open it within 10 seconds.
- **SC-004**: Projects section displays at least three items (or all available) with stack tags, and 90% of users can reach the GitHub link for a project within 10 seconds.
- **SC-005**: CTA contact options (email, LinkedIn, GitHub) are visible without searching and usable on first attempt by 95% of test users.
- **SC-006**: Page meets WCAG 2.1 AA checks with zero blocking issues in manual review plus automated audit; motion-degraded mode renders without layout shifts.
- **SC-007**: Any screenshot of the site contains a recognizable brand system (corner brackets, index label, geometric mark).
- **SC-008**: No noticeable Lighthouse performance regression from background depth system; initial render under 1.5s on good 3G.
- **SC-009**: 95% of users naturally scroll past hero due to scroll cue; hero is not perceived as a dead end.
- **SC-010**: Motion feels premium and intentional in user testing; reduced-motion users see a clean static version with no animation artifacts.
