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
  - `id`: string (slug or UUID; unique)
  - `title`: string (1-120 chars)
  - `summary`: string (1-160 chars)
  - `tags`: string[] (1-8 tags, each 1-24 chars) representing stack/areas
  - `githubUrl`: string (required, https)
  - `liveUrl`: string (optional, https)
  - `thumbnail`: string (optional path to optimized asset)
  - `order`: number (optional for manual ordering)
- **Validation rules**: githubUrl required https; thumbnail optional but must be optimized/accessible; summary <=160 chars; tags deduped.
- **Relationships**: ordered list; linkable from cards.

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
