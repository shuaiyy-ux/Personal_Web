"""Convert a Markdown file to blog body.html, preserving Mermaid fenced blocks."""

import re
import sys
from pathlib import Path
import markdown

def extract_mermaid_blocks(md_text: str) -> tuple[str, dict[str, str]]:
    """Replace ```mermaid blocks with placeholders, return map of placeholder -> HTML."""
    blocks: dict[str, str] = {}
    counter = 0

    def replacer(m: re.Match) -> str:
        nonlocal counter
        key = f"%%MERMAID_{counter}%%"
        # Wrap in a <div class="mermaid"> for the frontend renderer
        blocks[key] = f'<div class="mermaid">\n{m.group(1).strip()}\n</div>'
        counter += 1
        return key

    cleaned = re.sub(r"```mermaid\n(.*?)```", replacer, md_text, flags=re.DOTALL)
    return cleaned, blocks


def convert(md_path: str, out_path: str) -> None:
    md_text = Path(md_path).read_text(encoding="utf-8")

    # Step 1: pull out mermaid blocks before markdown processing
    md_text, mermaid_blocks = extract_mermaid_blocks(md_text)

    # Step 2: convert markdown to HTML
    html = markdown.markdown(
        md_text,
        extensions=["tables", "fenced_code", "codehilite", "toc"],
        extension_configs={
            "codehilite": {"css_class": "highlight", "guess_lang": False},
        },
    )

    # Step 3: restore mermaid blocks
    for placeholder, block_html in mermaid_blocks.items():
        html = html.replace(f"<p>{placeholder}</p>", block_html)
        html = html.replace(placeholder, block_html)

    # Step 4: wrap in <body> tag to match blog convention
    body_html = f"<body>\n{html}\n</body>\n"

    Path(out_path).parent.mkdir(parents=True, exist_ok=True)
    Path(out_path).write_text(body_html, encoding="utf-8")
    print(f"[md_to_body] {md_path} -> {out_path}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(f"Usage: {sys.argv[0]} <input.md> <output.html>")
        sys.exit(1)
    convert(sys.argv[1], sys.argv[2])
