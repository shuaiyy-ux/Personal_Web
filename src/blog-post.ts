import './styles/global.css';
import './styles/header.css';
import './styles/background.css';
import './styles/animations.css';
import './styles/blog-post.css';
import './styles/footer.css';

import writingData from './data/writing.json';
import { renderHeader } from './sections/header';
import { renderFooter } from './sections/footer';
import { WritingItem } from './sections/writing';
import initShiftBackground from './backgrounds/shift';

const app = document.getElementById('app');

async function render(): Promise<void> {
  if (!app) return;

  const slug = getSlugFromPath();
  const post = findPost(slug);
  const body = post ? await fetchBodyContent(slug) : null;

  app.innerHTML = `
    <div class="background-canvas content--canvas" aria-hidden="true"></div>
    <a href="#main-content" class="visually-hidden">Skip to main content</a>
    ${renderHeader()}
    <main id="main-content" class="container blog-post-page">
      ${post ? renderArticle(post, body) : renderNotFound(slug)}
    </main>
    ${renderFooter()}
  `;

  initShiftBackground('.content--canvas');
}

function getSlugFromPath(): string {
  const segments = window.location.pathname.split('/').filter(Boolean);
  const slug = segments[1] ?? '';
  return slug;
}

function findPost(slug: string): WritingItem | undefined {
  return (writingData as WritingItem[]).find((item) => item.id === slug);
}

async function fetchBodyContent(slug: string): Promise<string | null> {
  const path = `/blog/${slug}/body.html`;
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    return await res.text();
  } catch (err) {
    console.warn('Failed to load body content', err);
    return null;
  }
}

function renderArticle(post: WritingItem, bodyHtml: string | null): string {
  const body = bodyHtml ?? getDefaultBody();

  return `
    <article class="blog-post" aria-labelledby="post-title">
      <p class="blog-post__eyebrow">Blog · ${formatDate(post.publishedAt)}</p>
      <h1 id="post-title" class="blog-post__title">${post.title}</h1>
      <div class="blog-post__meta">
        <span class="pill">${post.tags.join(' · ')}</span>
        <span class="pill pill--muted">Uploaded ${formatDate(post.publishedAt)}</span>
        <a class="pill pill--link" href="/blog/">Back to blog</a>
        <a class="pill pill--link" href="/">Home</a>
      </div>
      <p class="blog-post__summary">${post.summary}</p>
      <div class="blog-post__body">${body}</div>
    </article>
  `;
}

function getDefaultBody(): string {
  return `
    <h2>Why an automation mindset?</h2>
    <p>
      This demo page shows how individual articles can be routed while sharing the same data source as the homepage.
      Replace this section with your actual content. Keep paragraphs short and front-load the takeaway.
    </p>
    <h3>What to include</h3>
    <ul>
      <li>Problem statement and constraints</li>
      <li>Before/after workflow</li>
      <li>System diagram or snippet illustrating the change</li>
      <li>Metrics or heuristics to validate impact</li>
    </ul>
    <p>
      When you're ready, drop in your real article content here. The metadata and hero above will stay in sync with
      the listings.
    </p>
  `;
}

function renderNotFound(slug: string): string {
  return `
    <section class="blog-post blog-post--not-found">
      <p class="blog-post__eyebrow">Blog</p>
      <h1 class="blog-post__title">Post not found</h1>
      <p class="blog-post__summary">We couldn't find an article for “${slug}”.</p>
      <div class="blog-post__meta">
        <a class="pill pill--link" href="/blog/">Back to blog</a>
        <a class="pill pill--link" href="/">Home</a>
      </div>
    </section>
  `;
}

function formatDate(iso?: string): string {
  if (!iso) return 'TBD';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'TBD';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

render();
