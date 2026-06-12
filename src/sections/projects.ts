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
  { short: 'BPM', label: 'Tempo / Rhythm',  annotation: '♪ tempo' },
  { short: 'WAV', label: 'Audio Signal',    annotation: '∿ signal' },
  { short: 'SSE', label: 'Server Events',   annotation: '⥅ stream' },
  { short: 'JSON', label: 'JSON / NDJSON',  annotation: '{ } map' },
  { short: 'DB',  label: 'Database',        annotation: '▤ rows' },
  { short: 'KV',  label: 'Key-Value Store', annotation: '[k] → v' },
  { short: 'CACHE', label: 'Cache Layer',   annotation: '⌬ ttl' },
  { short: 'DOM', label: 'DOM Tree',        annotation: '<dom/>' },
  { short: 'WASM', label: 'WebAssembly',    annotation: '<wasm/>' },
  { short: 'CRON', label: 'Scheduled Job',  annotation: '⏱ tick' },
  { short: 'GPU', label: 'GPU Compute',     annotation: '◫ cuda' },
  { short: 'YAML', label: 'Config / YAML',  annotation: '--- key' },
  { short: 'OAUTH', label: 'OAuth 2.0',     annotation: '⚿ scope' },
  { short: 'CDN', label: 'CDN / Edge',      annotation: '⤳ edge' },
  { short: 'DIFF', label: 'Diff / Patch',   annotation: '± delta' },
  { short: 'ENV', label: 'Env Vars',        annotation: '$ getenv' },
  { short: 'HOOK', label: 'Lifecycle Hook', annotation: '⚓ before' },
  { short: 'PR', label: 'Pull Request',     annotation: '↳ merge' },
  { short: 'LSP', label: 'Language Server', annotation: '⇄ rpc' },
  { short: 'MAP', label: 'Source Map',      annotation: '↦ trace' },
];

function localTagline(item: ProjectItem): string {
  return getLocale() === 'zh' ? (item.tagline_zh ?? item.tagline) : item.tagline;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderTagMarquee(tags: TagCard[]): string {
  const item = (t: TagCard) => `
    <li class="tag-chip" aria-hidden="true">
      <span class="tag-chip__short">${escapeHtml(t.short)}</span>
      <span class="tag-chip__sep">·</span>
      <span class="tag-chip__label">${escapeHtml(t.label)}</span>
    </li>`;
  // Two copies of the track produce a seamless loop: the animation
  // translates by exactly -50%, so when copy A scrolls off the left edge,
  // copy B is already in the same position copy A started in.
  const half = tags.map(item).join('');
  return `
    <div class="tag-marquee" aria-hidden="true">
      <ul class="tag-marquee__track">${half}${half}</ul>
    </div>`;
}

export function renderProjects(): string {
  const items = projectsData as ProjectItem[];
  // Newest first: new entries are appended to projects.json so reversing
  // surfaces the most recent project at the top of the grid.
  const ordered = [...items].reverse();
  const cardsHtml = ordered.map((p, i) => renderProjectCard(p, i)).join('');
  const count = String(items.length).padStart(2, '0');

  return `
    <section data-section="projects" class="projects" aria-labelledby="projects-heading">
      <header class="projects__header">
        <h2 id="projects-heading" class="projects__heading">${t('projects.heading')}</h2>
        <span class="projects__count">${count} ${t('projects.count_label')}</span>
      </header>
      ${renderTagMarquee(TAG_CARDS)}
      <ol class="projects__grid" role="list">
        ${cardsHtml}
      </ol>
    </section>
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
  const awardBadge = item.id === 'hca-fleet-allocation'
    ? `<span class="project-card__award" aria-label="Best Capstone">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M8 4h8l-.6 6.2C15.1 13.1 13.7 15 12 15s-3.1-1.9-3.4-4.8L8 4Z" />
          <path d="M8.2 6H5.5c-.6 0-.9.4-.8 1 .2 2.5 1.5 4.2 4.1 4.7" />
          <path d="M15.8 6h2.7c.6 0 .9.4.8 1-.2 2.5-1.5 4.2-4.1 4.7" />
          <path d="M12 15v3" />
          <path d="M9 20h6" />
        </svg>
        Best Capstone
      </span>`
    : '';

  return `
    <li class="projects__cell projects__cell--project${item.featured ? ' projects__cell--featured' : ''}" style="--card-index: ${displayIndex};">
      <a
        class="project-card${featuredClass}"
        href="${href}"
        data-project-id="${item.id}"
      >
        ${awardBadge}
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
