# Quickstart: CM Yao Personal Site

## Prerequisites
- Node.js 20+
- pnpm or npm
- Vercel CLI (optional for preview promotion)

## Setup
1) Install dependencies
```bash
pnpm install
```

2) Run locally
```bash
pnpm dev
```
- Opens local dev server with live reload.

3) Lint and test accessibility/e2e
```bash
pnpm test:e2e        # Playwright flows
pnpm test:a11y       # Playwright + axe checks (hero, nav blocks, CTA, reduced motion)
```

4) Build static assets
```bash
pnpm build
```
- Outputs static files suitable for Vercel static hosting.

5) Preview on Vercel
```bash
vercel --prebuilt --confirm
```
- Creates a preview URL; ensure checks pass before promoting.

6) Promote to production (after review)
```bash
vercel deploy --prebuilt --prod --confirm
```
- Use custom domain per constitution; only after preview approval.

## Content inputs
- `src/data/writing.json`: array of WritingItem (see contracts/content-schema.json)
- `src/data/projects.json`: array of ProjectItem
- `src/data/contacts.json`: array of ContactLink (must include email, LinkedIn, GitHub)
- `src/data/meta.json`: SiteMeta (lastUpdated, accent, theme)

## Accessibility & motion
- Honor `prefers-reduced-motion`; animations degrade to static.
- Maintain WCAG 2.1 AA contrast; keep accent within palette.

## Privacy
- Ship without analytics by default. If enabling privacy-first analytics, gate behind explicit consent and honor Do Not Track.
