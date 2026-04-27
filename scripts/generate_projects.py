"""Compile project detail pages from content/projects/*.md.

For each project listed in src/data/projects.json this script:
  1. Runs md_to_body.py on content/projects/<slug>.md  -> public/projects/<slug>/body.html
  2. Runs md_to_body.py on content/projects/<slug>.zh.md -> public/projects/<slug>/body.zh.html (if present)
  3. Ensures projects/<slug>/index.html exists (route shell)
  4. Ensures vite.config.ts has a "project-<slug>" rollup input

Run from repo root:  python3 scripts/generate_projects.py
(Use the venv at .venv/ if present.)
"""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = ROOT / "src/data/projects.json"
CONTENT_DIR = ROOT / "content/projects"
ROUTES_DIR = ROOT / "projects"
PUBLIC_DIR = ROOT / "public/projects"
VITE_CONFIG = ROOT / "vite.config.ts"

# Make scripts/ importable so we can call md_to_body.convert directly
sys.path.insert(0, str(ROOT / "scripts"))
from md_to_body import convert as md_convert  # noqa: E402


INDEX_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title} — CM Yao</title>
    <meta name="description" content="{description}" />
    <link rel="canonical" href="https://www.cmyao.com/projects/{slug}/" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://www.cmyao.com/projects/{slug}/" />
    <meta property="og:title" content="{title} — CM Yao" />
    <meta property="og:description" content="{description}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="{title} — CM Yao" />
    <meta name="twitter:description" content="{description}" />
    <link rel="stylesheet" href="/src/styles/global.css" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/project-detail.ts"></script>
  </body>
</html>
"""


def load_projects() -> list[dict]:
    with DATA_FILE.open("r", encoding="utf-8") as f:
        return json.load(f)


def ensure_index_html(project: dict) -> bool:
    slug = project["id"]
    target = ROUTES_DIR / slug / "index.html"
    if target.exists():
        return False
    target.parent.mkdir(parents=True, exist_ok=True)
    description = project.get("tagline") or project.get("summary", "")
    target.write_text(
        INDEX_TEMPLATE.format(title=project["title"], slug=slug, description=description),
        encoding="utf-8",
    )
    print(f"[route] projects/{slug}/index.html created")
    return True


def ensure_rollup_input(slug: str) -> bool:
    text = VITE_CONFIG.read_text(encoding="utf-8")
    token = f'"project-{slug}"'
    if token in text:
        return False

    marker = "input: {"
    if marker not in text:
        raise SystemExit("vite.config.ts structure unexpected — manually add the entry and rerun.")

    insert = f'{marker}\n        "project-{slug}": resolve(rootDir, "projects/{slug}/index.html"),'
    text = text.replace(marker, insert, 1)
    VITE_CONFIG.write_text(text, encoding="utf-8")
    print(f"[vite.config] added project-{slug}")
    return True


def compile_body(project: dict) -> None:
    slug = project["id"]
    md_en = CONTENT_DIR / f"{slug}.md"
    md_zh = CONTENT_DIR / f"{slug}.zh.md"
    out_dir = PUBLIC_DIR / slug
    out_dir.mkdir(parents=True, exist_ok=True)

    if md_en.exists():
        md_convert(str(md_en), str(out_dir / "body.html"))
    else:
        print(f"[warn] {md_en.relative_to(ROOT)} missing — copy from content/projects/_TEMPLATE.md")

    if md_zh.exists():
        md_convert(str(md_zh), str(out_dir / "body.zh.html"))


def main() -> None:
    projects = load_projects()
    for project in projects:
        slug = project["id"]
        print(f"\n— {slug} —")
        compile_body(project)
        ensure_index_html(project)
        ensure_rollup_input(slug)

    print("\nDone. Run `npm run build` to verify the new entries compile.")


if __name__ == "__main__":
    main()
