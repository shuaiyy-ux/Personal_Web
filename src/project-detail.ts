import './styles/global.css';
import './styles/header.css';
import './styles/background.css';
import './styles/animations.css';
import './styles/project-status.css';
import './styles/project-detail.css';
import './styles/email-digest-mock.css';
import './styles/vigil-mock.css';
import './styles/footer.css';

import projectsData from './data/projects.json';
import { renderHeader, initLangSwitcher } from './sections/header';
import { renderFooter } from './sections/footer';
import { ProjectItem, projectStatus, renderStatusBadge } from './sections/projects';
import initShiftBackground from './backgrounds/shift';
import { t, getLocale } from './i18n';

const app = document.getElementById('app');

async function render(): Promise<void> {
  if (!app) return;

  const slug = getSlugFromPath();
  const project = findProject(slug);
  const body = project ? await fetchBodyContent(slug) : null;
  const neighbors = project ? findNeighbors(project.id) : { prev: null, next: null };

  app.innerHTML = `
    <div class="background-canvas content--canvas" aria-hidden="true"></div>
    <a href="#main-content" class="visually-hidden">${t('post.skip')}</a>
    ${renderHeader()}
    <main id="main-content" class="container project-detail-page">
      ${project ? renderArticle(project, body, neighbors) : renderNotFound(slug)}
    </main>
    ${renderFooter()}
  `;

  initShiftBackground('.content--canvas');
  initLangSwitcher();
  await initMermaid();
}

function getSlugFromPath(): string {
  const segments = window.location.pathname.split('/').filter(Boolean);
  return segments[1] ?? '';
}

async function initMermaid(): Promise<void> {
  const blocks = document.querySelectorAll<HTMLElement>('.mermaid');
  if (!blocks.length) return;

  const mermaid = await import('mermaid');
  mermaid.default.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: 'dark',
    themeVariables: {
      background: 'transparent',
      primaryColor: '#0d1f24',
      primaryTextColor: '#e5e7eb',
      primaryBorderColor: '#22d3ee',
      lineColor: '#22d3ee',
      secondaryColor: '#0f172a',
      tertiaryColor: '#111827',
      mainBkg: '#0d1f24',
      clusterBkg: '#0a0a0a',
      clusterBorder: '#1f2937',
    },
  });
  mermaid.default.init(undefined, blocks);
}

function findProject(slug: string): ProjectItem | undefined {
  return (projectsData as ProjectItem[]).find((item) => item.id === slug);
}

interface Neighbors {
  prev: ProjectItem | null;
  next: ProjectItem | null;
}

function findNeighbors(id: string): Neighbors {
  const list = projectsData as ProjectItem[];
  const idx = list.findIndex((item) => item.id === id);
  return {
    prev: idx > 0 ? list[idx - 1] : null,
    next: idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null,
  };
}

async function fetchBodyContent(slug: string): Promise<string | null> {
  const locale = getLocale();
  const paths = locale === 'zh'
    ? [`/projects/${slug}/body.zh.html`, `/projects/${slug}/body.html`]
    : [`/projects/${slug}/body.html`];

  for (const path of paths) {
    try {
      const res = await fetch(path);
      if (res.ok) return await res.text();
    } catch {
      // try next path
    }
  }
  console.warn('Failed to load project body content for', slug);
  return null;
}

function localTitle(p: ProjectItem): string {
  return p.title;
}

function localTagline(p: ProjectItem): string {
  return getLocale() === 'zh' ? (p.tagline_zh ?? p.tagline) : p.tagline;
}

function localSummary(p: ProjectItem): string {
  return getLocale() === 'zh' ? (p.summary_zh ?? p.summary) : p.summary;
}

function renderArticle(project: ProjectItem, bodyHtml: string | null, neighbors: Neighbors): string {
  const body = bodyHtml ?? '';
  const status = projectStatus(project);
  const statusBadge = renderStatusBadge(status, 'eyebrow');

  const liveBadge = project.liveUrl
    ? `<span class="project-detail__live">${t('projects.live')}</span>`
    : '';

  const isExternalLive = project.liveUrl ? /^https?:\/\//.test(project.liveUrl) : false;
  const launchCta = project.liveUrl
    ? `<a class="project-detail__launch" href="${project.liveUrl}"${isExternalLive ? ' target="_blank" rel="noopener noreferrer"' : ''}>
         <span class="project-detail__launch-label">${t('projects.detail.launch')}</span>
         <span class="project-detail__launch-arrow" aria-hidden="true">${isExternalLive ? '↗' : '→'}</span>
       </a>`
    : '';

  const repoLink = project.githubUrl && !project.repoPrivate
    ? `<a class="project-detail__meta-link" href="${project.githubUrl}" target="_blank" rel="noopener noreferrer">${t('projects.detail.repo')} ↗</a>`
    : '';
  const liveLink = project.liveUrl
    ? `<a class="project-detail__meta-link" href="${project.liveUrl}"${isExternalLive ? ' target="_blank" rel="noopener noreferrer"' : ''}>${t('projects.detail.live')} ${isExternalLive ? '↗' : '→'}</a>`
    : '';
  const hasLinks = Boolean(repoLink || liveLink);

  return `
    <article class="project-detail" aria-labelledby="project-title">
      <a href="/" class="project-detail__back">← ${t('projects.detail.backHome')}</a>

      <p class="project-detail__eyebrow">
        <span class="project-detail__eyebrow-label">${t('projects.heading').toUpperCase()}</span>
        <span class="project-detail__eyebrow-sep">·</span>
        ${statusBadge}
        <span class="project-detail__eyebrow-sep">·</span>
        <span class="project-detail__eyebrow-num">${project.code}</span>
        <span class="project-detail__eyebrow-sep">·</span>
        <span class="project-detail__eyebrow-year">${project.year}</span>
      </p>

      <h1 id="project-title" class="project-detail__title">
        ${localTitle(project)}${liveBadge}
      </h1>

      <p class="project-detail__tagline">${localTagline(project)}</p>

      <dl class="project-detail__meta">
        <div class="project-detail__meta-row">
          <dt>${t('projects.detail.year')}</dt>
          <dd>${project.year}</dd>
        </div>
        <div class="project-detail__meta-row">
          <dt>${t('projects.detail.stack')}</dt>
          <dd>${project.tags.join(' · ')}</dd>
        </div>
        <div class="project-detail__meta-row">
          <dt>${t('projects.detail.code')}</dt>
          <dd><code>${project.code}</code></dd>
        </div>
        ${hasLinks ? `
        <div class="project-detail__meta-row project-detail__meta-row--links">
          <dt>${t('projects.detail.links')}</dt>
          <dd>${repoLink}${liveLink ? ` ${liveLink}` : ''}</dd>
        </div>` : ''}
      </dl>

      ${localSummary(project) ? `<p class="project-detail__summary">${localSummary(project)}</p>` : ''}

      ${launchCta ? `<div class="project-detail__launch-wrap">${launchCta}</div>` : ''}

      <div class="project-detail__body">${body}</div>

      ${renderFootNav(neighbors)}
    </article>
  `;
}

function renderFootNav(neighbors: Neighbors): string {
  const prev = neighbors.prev
    ? `<a class="project-detail__nav project-detail__nav--prev" href="/projects/${neighbors.prev.id}/">
         <span class="project-detail__nav-label">← ${t('projects.detail.prev')}</span>
         <span class="project-detail__nav-title">${neighbors.prev.title}</span>
       </a>`
    : '<span></span>';
  const next = neighbors.next
    ? `<a class="project-detail__nav project-detail__nav--next" href="/projects/${neighbors.next.id}/">
         <span class="project-detail__nav-label">${t('projects.detail.next')} →</span>
         <span class="project-detail__nav-title">${neighbors.next.title}</span>
       </a>`
    : '<span></span>';

  return `
    <nav class="project-detail__foot-nav" aria-label="${t('projects.detail.navAria')}">
      ${prev}
      ${next}
    </nav>
    <a class="project-detail__back project-detail__back--foot" href="/">← ${t('projects.detail.backHome')}</a>
  `;
}

function renderNotFound(slug: string): string {
  return `
    <section class="project-detail project-detail--not-found">
      <p class="project-detail__eyebrow">${t('projects.heading').toUpperCase()}</p>
      <h1 class="project-detail__title">${t('post.notFound.title')}</h1>
      <p class="project-detail__summary">${t('post.notFound.message')} "${slug}".</p>
      <a class="project-detail__back" href="/">← ${t('projects.detail.backHome')}</a>
    </section>
  `;
}

void render();
