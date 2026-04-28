import { animate, inView } from 'motion';
import projectsData from '../data/projects.json';
import { t, getLocale } from '../i18n';
import { projectIcon } from './project-icons';
import { scramble, prefersReducedMotion } from '../lib/scramble';

export interface ProjectItem {
  id: string;
  code: string;
  title: string;
  tagline: string;
  tagline_zh?: string;
  summary: string;
  summary_zh?: string;
  tags: string[];
  githubUrl: string;
  repoPrivate?: boolean;
  liveUrl?: string;
  year: string;
  featured?: boolean;
  status?: ProjectStatus;
}

export type ProjectStatus = 'shipped' | 'wip' | 'archived';

const STATUS_SVG: Record<ProjectStatus, string> = {
  shipped: `
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true">
      <circle cx="7" cy="7" r="6" stroke-width="0.75" opacity="0.32" />
      <circle cx="7" cy="7" r="3.5" stroke-width="0.75" opacity="0.7" />
      <circle cx="7" cy="7" r="1.6" fill="currentColor" stroke="none" />
    </svg>`,
  wip: `
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true">
      <path d="M 13 7 A 6 6 0 1 1 7 1" stroke-width="1.25" />
      <circle cx="7" cy="7" r="1.1" fill="currentColor" stroke="none" />
    </svg>`,
  archived: `
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-linejoin="round" aria-hidden="true">
      <path d="M 7 1 L 13 7 L 7 13 L 1 7 Z" stroke-width="1.25" />
      <path d="M 4.5 7 L 9.5 7" stroke-width="0.75" opacity="0.55" stroke-linecap="round" />
    </svg>`,
};

export function projectStatus(item: ProjectItem): ProjectStatus {
  return item.status ?? 'shipped';
}

export function projectStatusGlyph(status: ProjectStatus): string {
  return STATUS_SVG[status];
}

export function renderStatusBadge(status: ProjectStatus, scope: 'card' | 'eyebrow' = 'card'): string {
  const label = t(`projects.status.${status}`);
  const cls = scope === 'eyebrow' ? 'project-status project-status--eyebrow' : 'project-status';
  return `
    <span class="${cls} project-status--${status}" role="img" aria-label="${label}" title="${label}">
      <span class="project-status__glyph" aria-hidden="true">${STATUS_SVG[status]}</span>
      <span class="project-status__label">${label}</span>
    </span>`;
}

interface TagCard {
  short: string;
  label: string;
  annotation: string;
}

const TAG_CARDS: TagCard[] = [
  { short: 'TS',  label: 'TypeScript',      annotation: '// lang' },
  { short: 'AI',  label: 'Machine Learning', annotation: '<ml/>' },
  { short: 'CLI', label: 'Command Line',    annotation: '$ run' },
  { short: 'GH',  label: 'GitHub Actions',  annotation: '◆ ci' },
  { short: 'PY',  label: 'Python',          annotation: '# script' },
  { short: 'OPS', label: 'DevOps',          annotation: '⎈ infra' },
  { short: 'RAG', label: 'Retrieval Aug',   annotation: '⟶ ctx' },
  { short: 'AGT', label: 'Agents',          annotation: '◐ loop' },
  { short: 'iOS', label: 'iOS Native',      annotation: '<App/>' },
  { short: 'CV',  label: 'Computer Vision', annotation: '▣ ml' },
  { short: 'WS',  label: 'WebSocket',       annotation: '↯ live' },
  { short: 'API', label: 'HTTP API',        annotation: '→ rest' },
  { short: 'MD',  label: 'Markdown',        annotation: '# doc' },
  { short: 'SVG', label: 'Vector Graphics', annotation: '<svg/>' },
  { short: 'TDD', label: 'Test-Driven Dev', annotation: '✓ red→grn' },
  { short: 'I18N', label: 'i18n / locale',  annotation: 'en · zh' },
  { short: 'LLM', label: 'Language Model',  annotation: '⚡ token' },
  { short: 'E2E', label: 'End-to-End Test', annotation: '✓ flow' },
  { short: 'VEC', label: 'Vector Embed',    annotation: '⟢ cos' },
  { short: 'A11Y', label: 'Accessibility',  annotation: '◉ wcag' },
];

type Slot =
  | { kind: 'project'; item: ProjectItem; index: number }
  | { kind: 'tag'; tag: TagCard };

function localTagline(item: ProjectItem): string {
  return getLocale() === 'zh' ? (item.tagline_zh ?? item.tagline) : item.tagline;
}

/**
 * Deterministic non-adjacent placement for project cards on a 6-column desktop
 * grid. Projects are 2x2; columns rotate through [1, 5, 3] and rows step by 4
 * every three projects, so no two project tiles share an edge:
 *
 *     row 1-2:  P0(1-2) . . P1(5-6)
 *     row 3-4:  .  P2(3-4)  .
 *     row 5-6:  P3(1-2) . . P4(5-6)
 *     row 7-8:  .  P5(3-4)  .
 */
function projectGridPos(displayIndex: number): { col: number; row: number } {
  const cols = [1, 5, 3];
  const baseRows = [1, 1, 3];
  const slot = displayIndex % 3;
  const cycle = Math.floor(displayIndex / 3);
  return { col: cols[slot], row: baseRows[slot] + cycle * 4 };
}

/**
 * Mobile (≤720px) placement on a 4-column grid. Projects zigzag between the
 * left half (cols 1-2) and right half (cols 3-4), stepping down 2 rows each
 * time. Diagonal corners only — no two project tiles share an edge — and the
 * tag cards fill the open quadrants on each row pair, breaking the regular
 * "project-left, tags-right" stripe that auto-flow produced.
 *
 *     row 1-2:  P0(1-2)   tags(3-4)
 *     row 3-4:  tags(1-2) P1(3-4)
 *     row 5-6:  P2(1-2)   tags(3-4)
 *     row 7-8:  tags(1-2) P3(3-4)
 */
function projectGridPosMobile(displayIndex: number): { col: number; row: number } {
  const col = displayIndex % 2 === 0 ? 1 : 3;
  const row = 1 + displayIndex * 2;
  return { col, row };
}

/**
 * Stable pseudo-random shuffle (LCG seeded so the order is deterministic
 * across reloads but reads as scattered). Used to mix project + tag slots.
 */
function stableShuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  let state = seed || 1;
  for (let i = out.length - 1; i > 0; i--) {
    state = (state * 9301 + 49297) % 233280;
    const j = Math.floor((state / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Build the slot list. Project cards are placed first with stable display
 * indices (featured then shuffled regulars); their grid coordinates are
 * computed by `projectGridPos` so they never share edges. Tag cards follow
 * and fill remaining cells via CSS `grid-auto-flow: dense`.
 */
function buildSlots(projects: ProjectItem[], tags: TagCard[]): Slot[] {
  // Each project is a 2×2 block. Compute the cell budget for both the
  // desktop 6-col layout and the mobile 4-col zigzag, then pick the
  // larger so the same set of tags fills either grid without trailing
  // empty cells.
  const lastIdx = Math.max(0, projects.length - 1);
  const desktopLastRow = projects.length > 0 ? projectGridPos(lastIdx).row + 1 : 0;
  const mobileLastRow = projects.length > 0 ? projectGridPosMobile(lastIdx).row + 1 : 0;
  const desktopFreeCells = desktopLastRow * 6 - projects.length * 4;
  const mobileFreeCells = mobileLastRow * 4 - projects.length * 4;
  const tagsNeeded = Math.max(8, desktopFreeCells, mobileFreeCells);
  const tagCount = Math.min(tags.length, tagsNeeded);

  const featured: ProjectItem[] = [];
  const regular: ProjectItem[] = [];
  projects.forEach((item) => {
    (item.featured ? featured : regular).push(item);
  });

  const seed = projects.length * 31 + tagCount * 7;
  // Shuffle all tags first so the trailing entries in TAG_CARDS still
  // get a chance to appear when the slice is smaller than the pool.
  const tagsShuffled = stableShuffle(tags, seed).slice(0, tagCount);
  const regularsShuffled = stableShuffle(regular, seed * 13 + 1);

  const ordered: ProjectItem[] = [...featured, ...regularsShuffled];
  const result: Slot[] = ordered.map((item, displayIndex) => ({
    kind: 'project',
    item,
    index: displayIndex,
  }));
  for (const tag of tagsShuffled) {
    result.push({ kind: 'tag', tag });
  }
  return result;
}

export function renderProjects(): string {
  const items = projectsData as ProjectItem[];
  const slots = buildSlots(items, TAG_CARDS);
  const cellsHtml = slots
    .map((slot) =>
      slot.kind === 'project'
        ? renderProjectCard(slot.item, slot.index)
        : renderTagCard(slot.tag),
    )
    .join('');
  const count = String(items.length).padStart(2, '0');

  return `
    <section data-section="projects" class="projects" aria-labelledby="projects-heading">
      <header class="projects__header">
        <h2 id="projects-heading" class="projects__heading">${t('projects.heading')}</h2>
        <span class="projects__count">${count} ${t('projects.count_label')}</span>
      </header>
      <ol class="projects__grid" role="list">
        ${cellsHtml}
      </ol>
    </section>
  `;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderTagCard(tag: TagCard): string {
  return `
    <li class="projects__cell projects__cell--tag" aria-hidden="true">
      <div class="tag-card">
        <span class="tag-card__annotation">${escapeHtml(tag.annotation)}</span>
        <span class="tag-card__short">${escapeHtml(tag.short)}</span>
        <span class="tag-card__label">${escapeHtml(tag.label)}</span>
      </div>
    </li>
  `;
}

function renderProjectCard(item: ProjectItem, displayIndex: number): string {
  const status = projectStatus(item);
  const statusBadge = renderStatusBadge(status, 'card');
  const href = `/projects/${item.id}/`;
  const featuredClass = item.featured ? ' project-card--featured' : '';
  const liveBadge = item.liveUrl
    ? `<span class="project-card__live" aria-label="${t('projects.live')}">${t('projects.live')}</span>`
    : '';
  const desktop = projectGridPos(displayIndex);
  const mobile = projectGridPosMobile(displayIndex);
  const cellStyle = `--p-col: ${desktop.col}; --p-row: ${desktop.row}; --m-col: ${mobile.col}; --m-row: ${mobile.row};`;

  return `
    <li class="projects__cell projects__cell--project${item.featured ? ' projects__cell--featured' : ''}" style="${cellStyle}">
      <a
        class="project-card${featuredClass}"
        href="${href}"
        data-project-id="${item.id}"
      >
        <div class="project-card__head">
          ${statusBadge}
          <span class="project-card__icon" aria-hidden="true">${projectIcon(item.id)}</span>
        </div>
        <div class="project-card__body">
          <div class="project-card__top">
            <h3 class="project-card__title" data-title="${item.title}">${item.title}</h3>
            ${liveBadge}
          </div>
          <p class="project-card__tagline">${localTagline(item)}</p>
        </div>
        <div class="project-card__foot">
          <span class="project-card__meta" aria-hidden="true">
            <span class="project-card__code">${item.code}</span>
            <span class="project-card__meta-sep">·</span>
            <span class="project-card__year">${item.year}</span>
          </span>
          <span class="project-card__arrow" aria-hidden="true">→</span>
        </div>
      </a>
    </li>
  `;
}

/**
 * Wire interactions on project cards:
 *   - cursor spotlight (--x / --y CSS vars)
 *   - scramble title on hover
 *   - scroll-driven stagger reveal
 */
export function initProjectSpotlight(): void {
  const cards = document.querySelectorAll<HTMLElement>('.project-card');
  const reduced = prefersReducedMotion();

  cards.forEach((card) => {
    // Desync the shimmer animation across cards: each gets a random
    // negative delay within one cycle so the rotating cyan arc starts
    // mid-cycle at a different angle on every card.
    card.style.setProperty('--shimmer-delay', `${-Math.random() * 4.5}s`);

    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--y', `${event.clientY - rect.top}px`);
    });

    const titleEl = card.querySelector<HTMLElement>('.project-card__title');
    if (titleEl && !reduced) {
      let scrambled = false;
      let cancel: (() => void) | null = null;
      const runScramble = () => {
        const finalText = titleEl.dataset.title ?? titleEl.textContent ?? '';
        cancel?.();
        cancel = scramble(titleEl, finalText, 520);
      };
      card.addEventListener('pointerenter', (event) => {
        if (event.pointerType === 'touch') return;
        if (scrambled) return;
        scrambled = true;
        runScramble();
      });
      card.addEventListener('pointerleave', (event) => {
        if (event.pointerType === 'touch') return;
        scrambled = false;
        cancel?.();
        cancel = null;
        titleEl.textContent = titleEl.dataset.title ?? titleEl.textContent ?? '';
      });
      card.addEventListener('pointerdown', (event) => {
        if (event.pointerType !== 'touch') return;
        runScramble();
      });
    }
  });

  if (!reduced) {
    const cells = Array.from(document.querySelectorAll<HTMLElement>('.projects__cell'));
    cells.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
    });
    inView('.projects__cell', (element) => {
      const idx = cells.indexOf(element as HTMLElement);
      animate(
        element as HTMLElement,
        { opacity: [0, 1], transform: ['translateY(16px)', 'translateY(0)'] },
        { duration: 0.5, delay: Math.min(idx, 8) * 0.05, ease: [0.2, 0.8, 0.2, 1] },
      );
    });
  }
}
