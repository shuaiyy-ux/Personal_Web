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
];

type Slot =
  | { kind: 'project'; item: ProjectItem; index: number }
  | { kind: 'tag'; tag: TagCard };

function localTagline(item: ProjectItem): string {
  return getLocale() === 'zh' ? (item.tagline_zh ?? item.tagline) : item.tagline;
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
 * Build a scattered grid of project cards (2x2) + keyword tag cards (1x1).
 * Featured projects are anchored at the start so the top-left reads as the
 * focal point; regular projects and tag cards are interleaved via a stable
 * shuffle so the layout looks organic but does not flicker on reload.
 */
function buildSlots(projects: ProjectItem[], tags: TagCard[]): Slot[] {
  const tagCount = Math.min(tags.length, Math.max(8, Math.ceil(projects.length * 2.5)));
  const usableTags = tags.slice(0, tagCount);

  const featured: Slot[] = [];
  const regular: Slot[] = [];
  projects.forEach((item, i) => {
    const slot: Slot = { kind: 'project', item, index: i + 1 };
    (item.featured ? featured : regular).push(slot);
  });

  // Shuffle each list independently with different seeds so the layout
  // reads as scattered but stays deterministic across reloads.
  const seed = projects.length * 31 + tagCount * 7;
  const tagsShuffled = stableShuffle(usableTags, seed);
  const regularsShuffled = stableShuffle(regular, seed * 13 + 1);

  // Bucket each regular project into its own slice of the mixed list, then
  // jitter the exact position within the bucket using an LCG. This keeps the
  // big picture spread out (projects don't cluster on one side) while
  // breaking the metronome of strictly-even placement.
  const total = regularsShuffled.length + tagsShuffled.length;
  const projectPositions = new Set<number>();
  let lcg = seed * 23 + 11;
  for (let k = 0; k < regularsShuffled.length; k++) {
    const bucketStart = Math.floor((k * total) / regularsShuffled.length);
    const bucketEnd = Math.floor(((k + 1) * total) / regularsShuffled.length);
    const bucketSize = Math.max(1, bucketEnd - bucketStart);
    lcg = (lcg * 9301 + 49297) % 233280;
    const offset = Math.floor((lcg / 233280) * bucketSize);
    projectPositions.add(bucketStart + offset);
  }

  const result: Slot[] = [...featured];
  let pIdx = 0;
  let tIdx = 0;
  for (let i = 0; i < total; i++) {
    if (projectPositions.has(i) && pIdx < regularsShuffled.length) {
      result.push(regularsShuffled[pIdx++]);
    } else if (tIdx < tagsShuffled.length) {
      result.push({ kind: 'tag', tag: tagsShuffled[tIdx++] });
    } else if (pIdx < regularsShuffled.length) {
      result.push(regularsShuffled[pIdx++]);
    }
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

function renderTagCard(tag: TagCard): string {
  return `
    <li class="projects__cell projects__cell--tag" aria-hidden="true">
      <div class="tag-card">
        <span class="tag-card__annotation">${tag.annotation}</span>
        <span class="tag-card__short">${tag.short}</span>
        <span class="tag-card__label">${tag.label}</span>
      </div>
    </li>
  `;
}

function renderProjectCard(item: ProjectItem, _index: number): string {
  const status = projectStatus(item);
  const statusBadge = renderStatusBadge(status, 'card');
  const href = `/projects/${item.id}/`;
  const featuredClass = item.featured ? ' project-card--featured' : '';
  const liveBadge = item.liveUrl
    ? `<span class="project-card__live" aria-label="${t('projects.live')}">${t('projects.live')}</span>`
    : '';

  return `
    <li class="projects__cell projects__cell--project${item.featured ? ' projects__cell--featured' : ''}">
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
