# Data Model: CM Yao Personal Site

## Entities

### WritingItem
- **Fields**:
  - `id`: string (slug or UUID; unique)
  - `title`: string (1-120 chars)
  - `summary`: string (1-160 chars, single line)
  - `tags`: string[] (1-5 tags, each 1-24 chars)
  - `publishedAt`: string (ISO 8601 date)
  - `url`: string (relative slug or absolute link)
  - `external`: boolean (default false)
- **Validation rules**: title/summary non-empty; summary <=160 chars; tags deduped; `publishedAt` valid date; external links must be https.
- **Relationships**: standalone list ordered by `publishedAt` desc.

### ProjectItem
- **Fields**:
  - `id`: string (slug; unique; must match an icon key in `src/sections/project-icons.ts`)
  - `code`: string (2–3 uppercase letters; mono badge in card meta)
  - `title`: string (1-120 chars)
  - `tagline`: string (1-line; 3-line clamp at narrow widths; ≤80 chars recommended)
  - `tagline_zh`: string (optional zh translation; falls back to `tagline`)
  - `summary`: string (1-160 chars; long-form, reserved for future detail view)
  - `summary_zh`: string (optional zh translation)
  - `tags`: string[] (1-8 tags, each 1-24 chars) representing stack/areas (surfaced in detail page meta, not on the home grid)
  - `githubUrl`: string (optional; https URL or empty string)
  - `repoPrivate`: boolean (optional, default false; when true the detail page hides the "Source ↗" link even when `githubUrl` is set)
  - `liveUrl`: string (optional, https or relative path; presence triggers LIVE badge and `→` arrow)
  - `year`: string (4-digit year)
  - `featured`: boolean (optional, default false; true triggers AI shimmer border on the card)
  - `status`: enum `'shipped' | 'wip' | 'archived'` (optional, default `'shipped'`; drives the status badge in card top-left and detail-page eyebrow: a custom SVG glyph + uppercase mono label `SHIPPED` / `WIP` / `ARCHIVED`. Shipped is cyan with a soft drop-shadow glow; wip is amber with a slow rotation animation; archived is muted gray and static)
- **Validation rules**: when `githubUrl` is set it must be https; tagline ≤80 chars recommended; tags deduped; `id` must match an entry in `project-icons.ts` ICONS map.
- **Relationships**: rendered in `src/sections/projects.ts` as a card on a variable-count responsive mosaic. The desktop grid auto-fills at min 140px width with `grid-auto-rows: 140px` and `grid-auto-flow: dense`; project cards span 2 columns × 2 rows so they read as anchor tiles; the keyword scatter `tag-card` entries stay 1×1 and fill remaining cells. See [projects-bento.md](./projects-bento.md).

### ContactLink
- **Fields**:
  - `id`: string (unique)
  - `type`: enum (`email`, `linkedin`, `github`, `other`)
  - `label`: string (display text)
  - `value`: string (mailto: for email, https URL otherwise)
  - `required`: boolean (email/linkedin/github required true; others optional)
- **Validation rules**: required items must exist; email must use mailto; URLs https; labels concise.
- **Relationships**: shown collectively in CTA and footer.

### SiteMeta
- **Fields**:
  - `lastUpdated`: string (ISO 8601)
  - `theme`: enum (`light`, `dark`, `auto`)
  - `accent`: enum (`red`, `pink`)
- **Validation rules**: lastUpdated required; accent matches palette; theme controls initial mode if theming is used.
- **Relationships**: drives global layout and footer metadata.
