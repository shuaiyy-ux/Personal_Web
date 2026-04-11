import './styles/global.css';
import './styles/header.css';
import './styles/background.css';
import './styles/animations.css';
import './styles/blog-post.css';
import './styles/footer.css';

import writingData from './data/writing.json';
import { renderHeader, initLangSwitcher } from './sections/header';
import { renderFooter } from './sections/footer';
import { WritingItem } from './sections/writing';
import initShiftBackground from './backgrounds/shift';
import { t, getLocale, formatDateLocale } from './i18n';

const app = document.getElementById('app');

async function render(): Promise<void> {
  if (!app) return;

  const slug = getSlugFromPath();
  const post = findPost(slug);
  const body = post ? await fetchBodyContent(slug) : null;

  app.innerHTML = `
    <div class="background-canvas content--canvas" aria-hidden="true"></div>
    <a href="#main-content" class="visually-hidden">${t('post.skip')}</a>
    ${renderHeader()}
    <main id="main-content" class="container blog-post-page">
      ${post ? renderArticle(post, body) : renderNotFound(slug)}
    </main>
    ${renderFooter()}
  `;

  initShiftBackground('.content--canvas');
  initLangSwitcher();
  await initMermaid();
}

function getSlugFromPath(): string {
  const segments = window.location.pathname.split('/').filter(Boolean);
  const slug = segments[1] ?? '';
  return slug;
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
      primaryColor: '#111827',
      primaryTextColor: '#e5e7eb',
      secondaryColor: '#0f172a',
      tertiaryColor: '#111827',
      lineColor: '#6bd1ff',
      mainBkg: '#0f172a',
      clusterBkg: '#0f172a',
      clusterBorder: '#1f2937',
    },
  });
  mermaid.default.init(undefined, blocks);
}

function findPost(slug: string): WritingItem | undefined {
  return (writingData as WritingItem[]).find((item) => item.id === slug);
}

async function fetchBodyContent(slug: string): Promise<string | null> {
  const locale = getLocale();
  // Try locale-specific body first, fall back to default
  const paths = locale === 'zh'
    ? [`/blog/${slug}/body.zh.html`, `/blog/${slug}/body.html`]
    : [`/blog/${slug}/body.html`];

  for (const path of paths) {
    try {
      const res = await fetch(path);
      if (res.ok) return await res.text();
    } catch {
      // continue to next path
    }
  }
  console.warn('Failed to load body content for', slug);
  return null;
}

function localTitle(post: WritingItem): string {
  return getLocale() === 'zh' ? (post.title_zh ?? post.title) : post.title;
}

function localSummary(post: WritingItem): string {
  return getLocale() === 'zh' ? (post.summary_zh ?? post.summary) : post.summary;
}

function renderArticle(post: WritingItem, bodyHtml: string | null): string {
  const body = bodyHtml ?? '';

  return `
    <article class="blog-post" aria-labelledby="post-title">
      <p class="blog-post__eyebrow">${t('post.eyebrow')} · ${formatDateLocale(post.publishedAt)}</p>
      <h1 id="post-title" class="blog-post__title">${localTitle(post)}</h1>
      <div class="blog-post__meta">
        <span class="pill">${post.tags.join(' · ')}</span>
        <span class="pill pill--muted">${t('post.uploaded')} ${formatDateLocale(post.publishedAt)}</span>
        <a class="pill pill--link" href="/blog/">${t('post.backBlog')}</a>
        <a class="pill pill--link" href="/">${t('post.home')}</a>
      </div>
      <p class="blog-post__summary">${localSummary(post)}</p>
      <div class="blog-post__body">${body}</div>
    </article>
  `;
}

function renderNotFound(slug: string): string {
  return `
    <section class="blog-post blog-post--not-found">
      <p class="blog-post__eyebrow">${t('post.eyebrow')}</p>
      <h1 class="blog-post__title">${t('post.notFound.title')}</h1>
      <p class="blog-post__summary">${t('post.notFound.message')} "${slug}".</p>
      <div class="blog-post__meta">
        <a class="pill pill--link" href="/blog/">${t('post.backBlog')}</a>
        <a class="pill pill--link" href="/">${t('post.home')}</a>
      </div>
    </section>
  `;
}

render();
