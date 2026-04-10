# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start Vite dev server (localhost:5173)
npm run build        # TypeScript check + Vite production build
npm run preview      # Preview production build locally
npm run test         # Run all Playwright tests
npm run test:e2e     # Run E2E tests only
npm run test:a11y    # Run accessibility tests only
npx playwright test tests/e2e/hero.spec.ts   # Run a single test file
npx tsc --noEmit     # Type-check without emitting
```

### Blog Post Pipeline

New blog posts follow a three-step process:

1. Write markdown in `content/<slug>.md` (mermaid fenced blocks are preserved)
2. Convert: `python3 scripts/md_to_body.py content/<slug>.md content/bodies/<slug>.html`
3. Register in `content/posts.json`, then run: `python3 scripts/generate_posts.py`

`generate_posts.py` handles everything else: copies body.html to `blog/` and `public/blog/` (required for Vercel), generates `index.html` with OG tags, updates `src/data/writing.json`, and adds the rollup entry to `vite.config.ts`.

**Important:** `body.html` must exist in `public/blog/<slug>/` for production. The frontend fetches it at runtime via `fetch('/blog/<slug>/body.html')` — if it's only in `blog/` but not `public/blog/`, the page shows placeholder content.

## Architecture

**No framework.** This is a Vite MPA (Multi-Page Application) with pure TypeScript. All HTML is generated via template literal strings, rendered into `#app`.

### Entry Points

| URL Path | Entry HTML | TypeScript |
|----------|-----------|------------|
| `/` | `index.html` | `src/main.ts` |
| `/blog/` | `blog/index.html` | `src/blog.ts` |
| `/blog/<slug>/` | `blog/<slug>/index.html` | `src/blog-post.ts` |
| `/tools/finance-analyzer/` | `tools/finance-analyzer/index.html` | `src/finance-analyzer.ts` |

Each entry point must be registered in `vite.config.ts` → `rollupOptions.input`.

### Rendering Pattern

Each page follows the same pattern: import CSS modules + section renderers, compose them into a single `app.innerHTML` template string, then init background animations. Sections are pure functions returning HTML strings (`renderHeader()`, `renderHero()`, etc.) defined in `src/sections/`.

### Data Flow

- `src/data/writing.json` — blog post metadata (title, summary, tags, dates). Source of truth for both the blog listing page and individual post pages.
- `src/data/contacts.json` — contact links shared across header, footer, navigation, and CTA sections.
- `src/data/meta.json` — site-level metadata (lastUpdated date, accent color, theme).
- `src/data/projects.json` — project cards data (currently not rendered on homepage).
- `src/types.ts` — shared `ContactLink` interface used by header, footer, navigation, and CTA.

### Blog System

`blog-post.ts` extracts the slug from the URL, looks up metadata in `writing.json`, fetches `body.html` at runtime, and renders the article. Mermaid diagrams are lazily initialized only when `.mermaid` elements exist on the page.

### Finance Analyzer (`src/lib/finance/`)

An in-browser AI document analysis tool. Uploads are processed client-side: PDF text extraction via pdfjs-dist, text chunking, keyword extraction, company mention counting, RAG-based retrieval, and LLM-powered sentiment analysis via OpenAI API. The API key is stored in `sessionStorage` only (cleared on tab close).

### CSS Architecture

`src/styles/tokens.css` defines all design tokens (colors, spacing, typography, motion, radii). Other CSS files import tokens via CSS custom properties. The site uses a dark theme with red accent (`--color-accent: #e63946`).

## Key Conventions

- **Shared types go in `src/types.ts`** — don't redeclare interfaces across section files.
- **Blog post `index.html` files are generated** — edit `scripts/generate_posts.py` template, not individual files.
- **`public/` directory is for static assets served as-is** — blog body.html files must be here for production.
- **`generate_posts.py` can create duplicate vite.config.ts entries** — check and deduplicate after running.
- **All pages need OG meta tags** — the generate_posts.py template includes them automatically for blog posts; other pages must be updated manually.
- **Deployment is Vercel** — push to `001-personal-site` branch triggers auto-deploy.

## Testing

Tests use Playwright with two projects: desktop Chromium and Mobile Safari (iPhone 13). Accessibility tests use axe-core. The dev server starts automatically for test runs.
