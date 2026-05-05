I have a long tail of MD docs scattered across project folders: architecture notes, postmortems, playbooks, PRD-style specs, half-finished plans. Every one of them is a hard-won bit of context that a fresh Claude Code session cannot see, because each session only sees the project it is opened in. sync-docs is a `/sync-docs` slash command I wrote that scans every MD file across `~/Downloads`, `~/Documents`, `~/projects`, `~/code`, deduplicates by content hash, categorizes into nine buckets, and produces a single `claude-knowledge/context.md` that any future session can pull in as priming. It runs as a Claude Code skill (a markdown file at `~/.claude/commands/sync-docs.md` that Claude follows step-by-step), not as a binary. State lives in `claude-knowledge/hashes.json` so subsequent runs touch only the changed files.

The non-obvious decision is what counts as a file's identity. v1 used path. As soon as I started reorganizing folders (which I do constantly, moving projects from `~/Downloads/foo` to `~/Downloads/archive/foo` or to a different scan root entirely), the index treated every move as delete-plus-new and burned an LLM read on each one. The cached title and takeaway, which were the whole point of the incremental index, got thrown away on every reshuffle. v2 rewrote identity around the file's MD5 hash. Path is just a label that updates when the file moves. Content unchanged means same identity, no re-read.

```
For each (old_path, old_hash) where old_path no longer exists:
  candidates = new paths with the same hash that weren't in the previous index
  if len == 1            -> unambiguous move (filename can change, content is what matters)
  elif len > 1:
    same_name = candidates whose basename matches old_path's basename
    if len(same_name) == 1 -> moved to that one (filename as tiebreaker)
    else                  -> ambiguous, log and treat as deleted
  else (len == 0)         -> deleted
```

*FIG.01: the move detection algorithm. Filename is not required to match. `mv old/notes.md new/guide.md` is detected as a move because the hash is unchanged. Filename only enters as a tiebreaker when multiple new paths share the hash, which is rare in real text.*

Multi-root scanning is what makes content-based moves work in practice. If only `~/Downloads` is in scope and a project moves to `~/projects`, the algorithm sees the old path disappear with no candidate at any new path, and falls back to "deleted". Both ends of the move have to be in scope for the hash match to fire. The default root set covers the four places I actually put code; passing arguments overrides. The `previous_paths` field on each entry records the move chain capped at five entries, so a `~/Downloads/foo -> ~/projects/foo -> ~/projects/archive/foo` history stays traceable through `hashes.json`.

Categorization is two-pass and deliberately cheap. The first pass uses filename plus path-component rules. Architecture, for example, only matches when the path contains `/architecture/` or `/design/` as an actual path component, not just a filename suffix. That one rule eliminates the false positives that plagued v1, where any file whose name ended in `-architecture.md` got bucketed regardless of whether it was actually about architecture. Anything that lands in `Other` runs through a secondary pass that lowercase-substring-matches the cached takeaway against keyword sets: `lesson|pitfall|gotcha|postmortem` promotes to Engineering Lessons, `playbook|manifesto|methodology|规范|心得` promotes to Personal Knowledge, and so on. The secondary pass uses the cached takeaway, so it costs zero extra LLM calls.

```
noise excludes (filtered out before hashing):
  .specify/  .cursor/  .github/  node_modules/  .venv/  .git/
  LICENSE.md  CHANGELOG.md  CONTRIBUTING.md
  CODE_OF_CONDUCT.md  SECURITY.md
  claude-knowledge/   (avoid self-indexing the output)
```

*FIG.02: the noise excludes. AI-tool boilerplate, GitHub repo metadata, and standard repo files would otherwise dilute the index without carrying real knowledge. The output directory excludes itself so re-runs do not pick up their own previous output.*

Output ordering matters because context.md has a 2000-line hard cap and gets truncated under pressure. Project Profiles (each project's `CLAUDE.md` or root `README.md`) and Personal Knowledge (playbooks, conventions, methodology) come first because they are what prime a fresh session. Engineering Lessons, Architecture, Product Specs, Security, Dev Guides, Planning follow as reference material to dip into. Other comes last and is dropped first under the cap. Engineering Lessons and Architecture get truncated next, longest takeaway downward; Project Profiles and Personal Knowledge are never touched.

The shape this leaves is the property the README pitches: an O(changed) incremental document indexer that treats content hash as identity, output drops straight into AI context, reorganize the filesystem freely and the knowledge base follows. Files that did not change cost nothing on a re-sync. Files that moved cost only the path field update. Files that were edited cost one LLM takeaway read. Same-name different-content files (the ten different `CLAUDE.md` files I have, one per project) are listed separately rather than collapsed by name. The whole skill is one markdown file under 400 lines; the only persistent state is `hashes.json`, which is schema-versioned to read v1's `scan_root` (singular) as `scan_roots: [scan_root]` without a migration script.

The known limit is honest: this is a single-machine indexer that reads every MD file's first 2000 characters via `head -c` and asks the LLM for a short takeaway. It does not parse code, does not follow links, does not handle binary attachments, and has no opinion about which projects are interesting. The 9-category taxonomy is mine and would not survive contact with someone else's filesystem. What it does do well is exactly the thing I needed: turn scattered MD files into something a new session can actually load.
