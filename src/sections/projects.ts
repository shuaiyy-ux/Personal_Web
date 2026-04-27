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
  liveUrl?: string;
  year: string;
  featured?: boolean;
}

interface TagCard {
  short: string;
  label: string;
  annotation: string;
}

const TAG_CARDS: TagCard[] = [
  { short: 'TS',  label: 'TypeScript',     annotation: '// lang' },
  { short: 'AI',  label: 'Machine Learning', annotation: '<ml/>' },
  { short: 'CLI', label: 'Command Line',   annotation: '$ run' },
  { short: 'GH',  label: 'GitHub Actions', annotation: '◆ ci' },
  { short: 'PY',  label: 'Python',         annotation: '# script' },
  { short: 'OPS', label: 'DevOps',         annotation: '⎈ infra' },
  { short: 'RAG', label: 'Retrieval Aug',  annotation: '⟶ ctx' },
  { short: 'AGT', label: 'Agents',         annotation: '◐ loop' },
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
  const tagCount = Math.min(tags.length, Math.max(6, projects.length * 2));
  const tagSlots: Slot[] = tags.slice(0, tagCount).map((tag) => ({ kind: 'tag', tag }));
  const featuredSlots: Slot[] = [];
  const regularSlots: Slot[] = [];
  projects.forEach((item, i) => {
    const slot: Slot = { kind: 'project', item, index: i + 1 };
    (item.featured ? featuredSlots : regularSlots).push(slot);
  });
  const mixed = stableShuffle([...regularSlots, ...tagSlots], projects.length * 31 + tagCount * 7);
  return [...featuredSlots, ...mixed];
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

function renderProjectCard(item: ProjectItem, index: number): string {
  const number = String(index).padStart(2, '0');
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
          <span class="project-card__number" aria-hidden="true">${number}</span>
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
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--y', `${event.clientY - rect.top}px`);
    });

    const titleEl = card.querySelector<HTMLElement>('.project-card__title');
    if (titleEl && !reduced) {
      let scrambled = false;
      let cancel: (() => void) | null = null;
      card.addEventListener('pointerenter', () => {
        if (scrambled) return;
        scrambled = true;
        const finalText = titleEl.dataset.title ?? titleEl.textContent ?? '';
        cancel?.();
        cancel = scramble(titleEl, finalText, 520);
      });
      card.addEventListener('pointerleave', () => {
        scrambled = false;
        cancel?.();
        cancel = null;
        titleEl.textContent = titleEl.dataset.title ?? titleEl.textContent ?? '';
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
