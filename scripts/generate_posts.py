import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = ROOT / "src/data/writing.json"
POSTS_FILE = ROOT / "content/posts.json"
BLOG_DIR = ROOT / "blog"
PUBLIC_BLOG_DIR = ROOT / "public" / "blog"
VITE_CONFIG = ROOT / "vite.config.ts"

INDEX_TEMPLATE = """<!DOCTYPE html>
<html lang=\"en\">
  <head>
    <meta charset=\"UTF-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    <title>{title} — CM Yao</title>
    <meta name=\"description\" content=\"{summary}\" />
    <link rel=\"canonical\" href=\"https://www.cmyao.com/blog/{slug}/\" />
    <meta property=\"og:type\" content=\"article\" />
    <meta property=\"og:url\" content=\"https://www.cmyao.com/blog/{slug}/\" />
    <meta property=\"og:title\" content=\"{title} — CM Yao\" />
    <meta property=\"og:description\" content=\"{summary}\" />
    <meta name=\"twitter:card\" content=\"summary\" />
    <meta name=\"twitter:title\" content=\"{title} — CM Yao\" />
    <meta name=\"twitter:description\" content=\"{summary}\" />
    <link rel=\"stylesheet\" href=\"/src/styles/global.css\" />
  </head>
  <body>
    <div id=\"app\"></div>
    <script type=\"module\" src=\"/src/blog-post.ts\"></script>
  </body>
</html>
"""

def load_json(path: Path):
  with path.open("r", encoding="utf-8") as f:
    return json.load(f)

def save_json(path: Path, data):
  with path.open("w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

def ensure_rollup_input(slug: str):
  text = VITE_CONFIG.read_text(encoding="utf-8")
  token = f'"blog-{slug}"'
  if token in text:
    return

  marker = "rollupOptions: {\n      input: {"
  if marker not in text:
    raise SystemExit("vite.config.ts structure unexpected — manually update rollupOptions.input and rerun.")

  insert = f'{marker}\n        "blog-{slug}": resolve(rootDir, "blog/{slug}/index.html"),'
  text = text.replace(marker, insert, 1)
  VITE_CONFIG.write_text(text, encoding="utf-8")
  print(f"[vite.config] added blog-{slug}")

def upsert_writing(post, data):
  data = [item for item in data if item.get("id") != post["id"]]
  entry = {
    "id": post["id"],
    "title": post["title"],
    "summary": post["summary"],
    "tags": post.get("tags", []),
    "publishedAt": post.get("publishedAt", ""),
    "url": f"/blog/{post['id']}/",
    "external": False,
    "status": post.get("status", "published"),
  }
  data.append(entry)
  return sort_writing(data)

def sort_writing(items):
  def parse_date(val):
    from datetime import datetime
    try:
      return datetime.fromisoformat(val)
    except Exception:
      return None

  def sort_key(item):
    dt = parse_date(item.get("publishedAt", ""))
    # Newest first: use negative timestamp; missing dates go to end
    return (0 if dt else 1, -(dt.timestamp()) if dt else 0)

  return sorted(items, key=sort_key)

def write_body_and_index(post):
  slug = post["id"]
  body_src = ROOT / post["bodyHtmlFile"]
  if not body_src.exists():
    print(f"[skip] body not found, skipped: {body_src}")
    return False

  body_html = body_src.read_text(encoding="utf-8")

  page_dir = BLOG_DIR / slug
  page_dir.mkdir(parents=True, exist_ok=True)

  # ensure body is available from public for production hosting
  public_dir = PUBLIC_BLOG_DIR / slug
  public_dir.mkdir(parents=True, exist_ok=True)

  (public_dir / "body.html").write_text(body_html, encoding="utf-8")
  (page_dir / "body.html").write_text(body_html, encoding="utf-8")
  (page_dir / "index.html").write_text(
    INDEX_TEMPLATE.format(title=post["title"], summary=post["summary"], slug=slug),
    encoding="utf-8",
  )
  print(f"[page] /blog/{slug}/ generated")
  return True

def main():
  posts = load_json(POSTS_FILE)
  writing = load_json(DATA_FILE)

  for post in posts:
    required = ["id", "title", "summary", "bodyHtmlFile"]
    for k in required:
      if not post.get(k):
        raise SystemExit(f"Missing required field: {k} in {post}")

    ok = write_body_and_index(post)
    if not ok:
      continue
    writing = upsert_writing(post, writing)
    ensure_rollup_input(post["id"])

  save_json(DATA_FILE, writing)
  print("Done: writing.json updated, pages generated, vite.config.ts entries registered.")

if __name__ == "__main__":
  main()
