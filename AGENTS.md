# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

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

**Important:** `generate_posts.py` can create duplicate vite.config.ts entries — check and deduplicate after running.

### Blog Post i18n

Each blog post can have a Chinese version at `body.zh.html` alongside `body.html`. When the locale is `zh`, `blog-post.ts` tries `body.zh.html` first, falling back to `body.html`. Both files must exist in `blog/<slug>/` and `public/blog/<slug>/`.

For bilingual metadata, `writing.json` entries use `title_zh` and `summary_zh` fields alongside `title` and `summary`.

### Project Detail Pipeline

New project detail pages follow the same pattern as blog posts:

1. Add the entry to `src/data/projects.json` (`id`, `code`, `title`, `tagline`, `tagline_zh`, `summary`, `summary_zh`, `tags`, `githubUrl`, optional `repoPrivate`, optional `liveUrl`, `year`, optional `featured`, optional `status` of `'shipped' | 'wip' | 'archived'` — defaults to `'shipped'`).
2. Add an SVG icon to `src/sections/project-icons.ts` and register it in the `ICONS` map under the slug.
3. Copy `content/projects/_TEMPLATE.md` to `content/projects/<slug>.md` (and optionally `<slug>.zh.md`).
4. Run: `python3 scripts/generate_projects.py`

`generate_projects.py` is idempotent. It compiles markdown via `scripts/md_to_body.py` to `public/projects/<slug>/body.html` (and `body.zh.html` if `<slug>.zh.md` exists), creates the `projects/<slug>/index.html` route shell if missing, and registers `project-<slug>` in `vite.config.ts` rollup inputs.

The Projects section on the homepage is a variable-count responsive mosaic (`repeat(auto-fill, minmax(140px, 1fr))` with `grid-auto-rows: 140px` and `grid-auto-flow: dense`). Project cards span 2 columns × 2 rows; keyword scatter cards stay 1×1 and fill the gaps via dense flow. On mobile (≤720px) the grid drops to `minmax(100px, 1fr)` with `grid-auto-rows: 100px` so the mosaic stays intact at phone widths instead of collapsing to a single-column stack. Adding a project is layout-free: a JSON entry + an SVG icon are all that is required. See `specs/001-personal-site/projects-bento.md` and `specs/001-personal-site/projects-detail.md` for full specs.

When a project's GitHub repo is private (or its URL is a placeholder for an unpublished repo), set `"repoPrivate": true` on the entry. The detail page suppresses the "Source ↗" link in that case while keeping the URL on record. The site has used this for `finance-analyzer` and `vigil` because both repos return 404 on `api.github.com`.

**Status badges** replace the legacy zero-padded array index in the card top-left and detail-page eyebrow. Set `"status"` on each entry: `'shipped'` (cyan badge, glowing concentric-rings glyph, label `SHIPPED`), `'wip'` (amber badge, slow-rotating arc glyph, label `WIP`), or `'archived'` (muted badge, outlined-diamond glyph, label `ARCHIVED`). The cluster is `<svg-glyph> + uppercase mono label`, decoratively pilled on the card; the same cluster is rendered without the pill background inside the detail-page eyebrow breadcrumb. The glyph SVGs and the badge renderer live in `src/sections/projects.ts` (`STATUS_SVG` and `renderStatusBadge`). Defaults to `'shipped'` if omitted.

#### Daily-add cadence

For ongoing work that adds 2 to 3 projects per day from `~/Downloads/<project>/`:

1. `cd ~/Downloads/<project>/` and read `AGENTS.md`, `README.md`, `pyproject.toml` / `package.json`, then `src/` or `app/` top level. Surface real design decisions; do not invent.
2. Choose a slug (kebab-case), 2 to 3 letter `code`, 3 to 4 stack tags, bilingual tagline + summary, GitHub URL, `year`, and whether to set `featured: true` (use sparingly).
3. Append to `src/data/projects.json` and add an SVG to `src/sections/project-icons.ts` (48×48 viewBox, stroke, currentColor; register in `ICONS`).
4. Copy `content/projects/_TEMPLATE.md` to `content/projects/<slug>.md` and write the draft. Use `[VERIFY: ...]` markers for any claim not directly grounded in code or docs.
5. Run `python3 scripts/generate_projects.py`. Then `npm run build`. Smoke test at `http://localhost:5173/projects/<slug>/`.

Per-draft hard rules: no em dashes (run `grep "—" content/projects/<slug>.md`, must return zero), first-person voice, no body H1 (page title comes from `projects.json`), figure captions in the form `*FIG.NN: caption.*`. Length 600 to 1000 words for a deep-dive; 400 to 600 for a rough first pass.

## Architecture

**No framework.** This is a Vite MPA (Multi-Page Application) with pure TypeScript. All HTML is generated via template literal strings, rendered into `#app`.

### Entry Points

| URL Path | Entry HTML | TypeScript |
|----------|-----------|------------|
| `/` | `index.html` | `src/main.ts` |
| `/blog/` | `blog/index.html` | `src/blog.ts` |
| `/blog/<slug>/` | `blog/<slug>/index.html` | `src/blog-post.ts` |
| `/projects/<slug>/` | `projects/<slug>/index.html` | `src/project-detail.ts` |
| `/tools/finance-analyzer/` | `tools/finance-analyzer/index.html` | `src/finance-analyzer.ts` |

Each entry point must be registered in `vite.config.ts` → `rollupOptions.input`.

### Rendering Pattern

Each page follows the same pattern: import CSS modules + section renderers, compose them into a single `app.innerHTML` template string, then init background animations and language switcher. Sections are pure functions returning HTML strings (`renderHeader()`, `renderHero()`, etc.) defined in `src/sections/`.

### Internationalization (i18n)

`src/i18n.ts` provides the translation system:

- **`t(key)`** — returns translated string for the current locale.
- **`getLocale()`** — reads from `localStorage`, falls back to browser language (`navigator.language`).
- **`setLocale(locale)`** — saves to `localStorage` and reloads the page.
- **`formatDateLocale(iso)`** — formats dates using locale-appropriate formatting (en-US / zh-CN).

All UI strings are translated inline in `i18n.ts` (no external JSON files), with one entry per key in both `en` and `zh` objects. The language toggle button is in the header and calls `initLangSwitcher()` which must be invoked after rendering on every page.

When adding new UI strings: add the key to both `en` and `zh` objects in `i18n.ts`, then use `t('key')` in the template.

### Data Flow

- `src/data/writing.json` — blog post metadata with bilingual fields (`title`/`title_zh`, `summary`/`summary_zh`).
- `src/data/contacts.json` — contact links shared across header, footer, navigation, and CTA sections.
- `src/data/meta.json` — site-level metadata (lastUpdated date, accent color, theme).
- `src/data/projects.json` — project cards data with bilingual fields (`tagline`/`tagline_zh`, `summary`/`summary_zh`); rendered on the homepage as a bento mosaic and at `/projects/<slug>/` detail pages.
- `src/types.ts` — shared `ContactLink` interface used by header, footer, navigation, and CTA.

### Blog System

`blog-post.ts` extracts the slug from the URL, looks up metadata in `writing.json`, fetches `body.html` (or `body.zh.html` for Chinese locale) at runtime, and renders the article. Mermaid diagrams are lazily initialized only when `.mermaid` elements exist on the page.

### Finance Analyzer (`src/lib/finance/`)

An in-browser AI document analysis tool. Uploads are processed client-side: PDF text extraction via pdfjs-dist, text chunking, keyword extraction, company mention counting, RAG-based retrieval, and LLM-powered sentiment analysis via OpenAI API. The API key is stored in `sessionStorage` only (cleared on tab close).

### CSS Architecture

`src/styles/tokens.css` defines all design tokens (colors, spacing, typography, motion, radii). Other CSS files import tokens via CSS custom properties. The site uses a dark theme with red accent (`--color-accent: #e63946`).

## Key Conventions

- **Shared types go in `src/types.ts`** — don't redeclare interfaces across section files.
- **All UI strings go through `t()`** — never hardcode user-facing text in section files.
- **Blog post `index.html` files are generated** — edit `scripts/generate_posts.py` template, not individual files.
- **`public/` directory is for static assets served as-is** — blog body.html and body.zh.html files must be here for production.
- **All pages need OG meta tags** — the generate_posts.py template includes them automatically for blog posts; other pages must be updated manually.
- **Every page must call `initLangSwitcher()`** after rendering to wire up the language toggle button.
- **Deployment is Vercel** — push to `001-personal-site` branch triggers auto-deploy.

## Testing

Tests use Playwright with two projects: desktop Chromium and Mobile Safari (iPhone 13). Accessibility tests use axe-core. The dev server starts automatically for test runs. Tests are locale-agnostic — they check element visibility and structure, not hardcoded English strings.
