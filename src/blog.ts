import './styles/global.css';
import './styles/header.css';
import './styles/background.css';
import './styles/animations.css';
import './styles/writing.css';
import './styles/blog.css';
import './styles/footer.css';

import writingData from './data/writing.json';
import { renderHeader } from './sections/header';
import { renderFooter } from './sections/footer';
import { renderWritingList, WritingItem } from './sections/writing';
import initShiftBackground from './backgrounds/shift';

const app = document.getElementById('app');

function render(): void {
  if (!app) return;
  const items = sortByPublished(writingData as WritingItem[]);

  app.innerHTML = `
    <div class="background-canvas content--canvas" aria-hidden="true"></div>
    <a href="#main-content" class="visually-hidden">Skip to main content</a>
    ${renderHeader()}
    <main id="main-content" class="container blog-page">
      ${renderBlogHero(items)}
      <section class="writing blog-list" aria-labelledby="blog-list-heading">
        <div class="blog-list__header">
          <div>
            <p class="blog-list__eyebrow">All writing</p>
            <h2 id="blog-list-heading" class="blog-list__title">Recent and upcoming</h2>
          </div>
        </div>
        ${renderWritingList(items)}
      </section>
    </main>
    ${renderFooter()}
  `;

  initShiftBackground('.content--canvas');
}

function sortByPublished(items: WritingItem[]): WritingItem[] {
  return [...items].sort((a, b) => {
    const ad = Date.parse(a.publishedAt ?? '');
    const bd = Date.parse(b.publishedAt ?? '');
    const aValid = Number.isFinite(ad);
    const bValid = Number.isFinite(bd);

    if (aValid && bValid) return bd - ad;
    if (aValid) return -1;
    if (bValid) return 1;
    return 0;
  });
}

function renderBlogHero(items: WritingItem[]): string {
  const publishedCount = items.filter((item) => (item.status ?? 'published') === 'published').length;
  const upcomingCount = items.length - publishedCount;

  return `
    <section class="blog-hero" aria-labelledby="blog-hero-heading">
      <p class="blog-hero__eyebrow">Blog</p>
      <h1 id="blog-hero-heading" class="blog-hero__title">Less busywork. More leverage.</h1>
      <p class="blog-hero__lede">
        Essays and notes on automation, applied AI, and building systems that stay calm at scale.
      </p>
      <div class="blog-hero__meta">
        <span class="pill">${publishedCount} published</span>
        ${upcomingCount > 0 ? `<span class="pill pill--muted">${upcomingCount} coming soon</span>` : ''}
        <a class="pill pill--link" href="/#writing">Back to homepage</a>
      </div>
    </section>
  `;
}

render();
