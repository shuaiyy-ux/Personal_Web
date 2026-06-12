"""Convert a Markdown file to blog body.html, preserving Mermaid fenced blocks."""

import re
import sys
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from pathlib import Path
import markdown


ALLOWED_TAGS = {
    "a",
    "abbr",
    "article",
    "aside",
    "b",
    "blockquote",
    "br",
    "caption",
    "code",
    "col",
    "colgroup",
    "dd",
    "details",
    "div",
    "dl",
    "dt",
    "em",
    "figcaption",
    "figure",
    "footer",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "hr",
    "i",
    "img",
    "li",
    "main",
    "mark",
    "ol",
    "p",
    "pre",
    "s",
    "section",
    "small",
    "span",
    "strong",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "tfoot",
    "th",
    "thead",
    "time",
    "tr",
    "u",
    "ul",
}

REMOVED_TAGS = {
    "audio",
    "base",
    "embed",
    "form",
    "iframe",
    "link",
    "meta",
    "object",
    "script",
    "style",
    "video",
}

VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}

SAFE_ATTR_PREFIX = "on"
SAFE_PROTOCOLS = {"http", "https", "mailto", "tel"}


def sanitize_href(raw: str) -> str:
    trimmed = (raw or "").strip()
    if not trimmed:
        return ""

    if trimmed.startswith("#") or trimmed.startswith("/") or trimmed.startswith("./") or trimmed.startswith("../"):
        return trimmed

    parsed = urlparse(trimmed)
    if parsed.scheme:
        if parsed.scheme.lower() in SAFE_PROTOCOLS:
            return trimmed
        return ""

    if parsed.netloc:
        return ""

    return trimmed


class HTMLSanitizer(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self._out = []
        # stack entries: (tag_name, should_output_tag, should_suppress_children)
        self._stack: list[tuple[str, bool, bool]] = []
        self._skip_data_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self._emit_start_or_end(tag, attrs, is_self_closing=False)

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self._emit_start_or_end(tag, attrs, is_self_closing=True)

    def _emit_start_or_end(self, tag: str, attrs: list[tuple[str, str | None]], is_self_closing: bool) -> None:
        normalized = tag.lower()

        if normalized in REMOVED_TAGS or normalized not in ALLOWED_TAGS:
            if is_self_closing and normalized in REMOVED_TAGS:
                return
            if is_self_closing and normalized not in ALLOWED_TAGS:
                return
            if normalized in REMOVED_TAGS:
                self._skip_data_depth += 1
            self._stack.append((normalized, False, normalized in REMOVED_TAGS))
            return

        safe_attrs = self._sanitize_attrs(normalized, attrs)
        attrs_text = "".join(f' {name}="{escape(value)}"' for name, value in safe_attrs.items())
        self._out.append(f"<{normalized}{attrs_text}>")
        if is_self_closing or normalized in VOID_TAGS:
            return
        self._stack.append((normalized, True, False))

    def handle_endtag(self, tag: str) -> None:
        normalized = tag.lower()
        while self._stack:
            top, should_output, should_suppress = self._stack.pop()
            if should_suppress:
                self._skip_data_depth -= 1
            if should_output:
                self._out.append(f"</{top}>")
            if top == normalized:
                break
        else:
            return

    def handle_data(self, data: str) -> None:
        if self._skip_data_depth > 0:
            return
        self._out.append(data)

    def handle_entityref(self, name: str) -> None:
        if self._skip_data_depth > 0:
            return
        self._out.append(f"&{name};")

    def handle_charref(self, name: str) -> None:
        if self._skip_data_depth > 0:
            return
        self._out.append(f"&#{name};")

    def handle_comment(self, data: str) -> None:
        if self._skip_data_depth > 0:
            return
        self._out.append(f"<!--{data}-->")

    def _sanitize_attrs(self, tag: str, attrs: list[tuple[str, str | None]]) -> dict[str, str]:
        safe: dict[str, str] = {}
        for name, value in attrs:
            normalized = name.lower()
            if normalized.startswith(SAFE_ATTR_PREFIX):
                continue
            if normalized in {"style", "srcdoc", "sandbox"}:
                continue
            if normalized == "srcset":
                continue
            if normalized == "target":
                normalized_value = value or ""
                if normalized_value not in {"_self", "_blank", "_parent", "_top"}:
                    continue
                safe[normalized] = normalized_value
                continue
            if normalized in {"href", "src"}:
                sanitized = sanitize_href(value or "")
                if sanitized:
                    safe[normalized] = sanitized
                continue
            if value is None:
                continue
            safe[normalized] = value
        if tag == "a":
            href = safe.get("href", "")
            if href and href.startswith("#"):
                safe.pop("href", None)
            if safe.get("target") == "_blank" and "rel" not in safe:
                safe["rel"] = "noopener noreferrer"
        return safe


def sanitize_html(raw_html: str) -> str:
    parser = HTMLSanitizer()
    parser.feed(raw_html)
    return "".join(parser._out)


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

    html = sanitize_html(html)

    body_html = f"{html}\n"

    Path(out_path).parent.mkdir(parents=True, exist_ok=True)
    Path(out_path).write_text(body_html, encoding="utf-8")
    print(f"[md_to_body] {md_path} -> {out_path}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(f"Usage: {sys.argv[0]} <input.md> <output.html>")
        sys.exit(1)
    convert(sys.argv[1], sys.argv[2])
