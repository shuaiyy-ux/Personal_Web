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
  - `githubUrl`: string (required, https)
  - `liveUrl`: string (optional, https or relative path; presence triggers LIVE badge and `→` arrow)
  - `year`: string (4-digit year)
  - `featured`: boolean (optional, default false; true triggers AI shimmer border + 2-column 2-row grid span on the card)
- **Validation rules**: githubUrl required https; tagline ≤80 chars recommended; tags deduped; `id` must match an entry in `project-icons.ts` ICONS map.
- **Relationships**: rendered in `src/sections/projects.ts` as a card on a variable-count responsive grid. The grid auto-fills at min 280px width; `featured: true` cards span 2 columns × 2 rows on viewports ≥720px. See [projects-bento.md](./projects-bento.md).

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
