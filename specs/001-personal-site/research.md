# Research: CM Yao Personal Site

## Findings

### Decision: Static stack with Vite + TypeScript + CSS
- **Rationale**: Keeps build simple and fast, outputs plain static assets for Vercel, supports modular sections without heavy framework overhead.
- **Alternatives considered**: Next.js static export (heavier for this scope); Astro (good for islands but adds tooling overhead).

### Decision: Content as versioned local data files (JSON/TS)
- **Rationale**: Aligns with privacy and authenticity principles; no runtime storage or CMS needed; easy to review in PRs with visible diffs.
- **Alternatives considered**: Headless CMS (overkill, adds auth and data handling); remote markdown repo (adds fetch/runtime dependencies).

### Decision: Motion via CSS keyframes with prefers-reduced-motion fallbacks
- **Rationale**: Meets accessibility and simplicity; minimal JS footprint; easy to disable for reduced-motion users.
- **Alternatives considered**: Canvas/WebGL or GSAP (too heavy for stated simplicity and performance goals).

### Decision: Accessibility checks using Playwright + axe
- **Rationale**: Automates WCAG 2.1 AA regressions and validates navigation/CTA flows; integrates with preview gating before production.
- **Alternatives considered**: Manual-only reviews (insufficient coverage); Lighthouse-only (does not catch all issues).

### Decision: No analytics by default; optional privacy-first toggle later
- **Rationale**: Constitution requires minimal data; shipping without analytics avoids consent/UI overhead; can add a privacy-preserving option (e.g., Plausible) behind explicit consent if ever needed.
- **Alternatives considered**: Google Analytics/Segment (conflicts with privacy principle); always-on analytics (unnecessary for MVP).

### Decision: Deployment via Vercel static hosting with preview gate
- **Rationale**: Native previews match constitution; static output avoids serverless/edge; custom domain enforced at production promotion.
- **Alternatives considered**: Netlify or self-hosting (adds infra variance); Vercel serverless (not needed for static site).
