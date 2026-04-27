# Quickstart: CM Yao Personal Site

## Prerequisites
- Node.js 20+
- npm (the project ships `package-lock.json`)
- Python 3.10+ (for the blog and project markdown pipelines under `scripts/`)

## Setup
1) Install dependencies
```bash
npm install
```

2) Run locally
```bash
npm run dev
```
- Opens local dev server on `http://localhost:5173` with live reload.

3) Test accessibility and e2e
```bash
npm run test:e2e        # Playwright flows
npm run test:a11y       # Playwright + axe checks (hero, nav blocks, CTA, reduced motion)
```

4) Build static assets
```bash
npm run build
```
- TypeScript check plus Vite production build. Outputs to `dist/` for Vercel static hosting.

5) Deploy
- Pushing to the `001-personal-site` branch triggers Vercel auto-deploy via the git integration. No local Vercel CLI is required for routine releases.

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
