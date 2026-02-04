<!--
Sync Impact Report
Version: 0.0.0 → 1.0.0
Modified Principles: Initialized (Static Simplicity; Accessible by Default; Privacy and Minimal Data; Authentic Content and Traceability; Preview-Gated Deployments)
Added Sections: Core Principles; Operational Constraints; Development Workflow; Governance
Removed Sections: None
Templates requiring updates:
- ✅ .specify/templates/plan-template.md (Constitution Check remains aligned)
- ✅ .specify/templates/spec-template.md (No constitution-driven changes)
- ✅ .specify/templates/tasks-template.md (No constitution-driven changes)
- ✅ .specify/templates/agent-file-template.md (No constitution-driven changes)
- ✅ .specify/templates/checklist-template.md (No constitution-driven changes)
- ⚠ .specify/templates/commands (directory not present; create if command docs needed)
Follow-up TODOs: None
-->

# CMYAO_Personal_Web Constitution

## Core Principles

### Static Simplicity
Keep the site static-first with minimal build tooling; prefer plain HTML/CSS/JS, no server-side runtimes, and only essential dependencies to reduce complexity and hosting risk.

### Accessible by Default
Meet or exceed WCAG 2.1 AA for content, including keyboard navigation, color contrast, focus states, and text alternatives; no deployment passes without an accessibility pass (manual or automated).

### Privacy and Minimal Data
Avoid collecting personal data; use privacy-preserving, first-party analytics only when necessary, honor Do Not Track, and keep no long-term identifiers or user-level logs.

### Authentic Content and Traceability
Publish only owner-authored or clearly attributed content; track edits through version control, include visible last-updated metadata on pages, and avoid auto-generated content without disclosure.

### Preview-Gated Deployments
All changes ship through Vercel preview deployments with checks green; production promotions require explicit approval after preview review, and production must point to the custom domain only.

## Operational Constraints

Host on Vercel using the custom domain; keep the build output static assets only; enforce HTTPS; set caching headers to favor fast first paint while allowing quick content updates; avoid serverless/edge functions unless a future principle amendment approves them.

## Development Workflow

Work on short-lived branches; open pull requests for every change; require preview URL evidence plus accessibility and privacy confirmations before merge; only maintainers can promote preview to production; roll back immediately if authenticity or privacy is compromised.

## Governance

This constitution supersedes other process documents. Amendments require a pull request that redlines changes, updates the Sync Impact Report, and notes any template implications. Versioning follows semantic rules (MAJOR for principle or governance redefinitions, MINOR for new principles/sections, PATCH for clarifications). Reviews and releases MUST confirm alignment with Core Principles, Operational Constraints, and Development Workflow; non-compliance blocks deployment until resolved or formally amended.

**Version**: 1.0.0 | **Ratified**: 2026-02-03 | **Last Amended**: 2026-02-03
