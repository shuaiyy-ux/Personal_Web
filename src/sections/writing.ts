import writingData from '../data/writing.json';
import { t, getLocale, formatDateLocale } from '../i18n';

export interface WritingItem {
  id: string;
  title: string;
  title_zh?: string;
  summary: string;
  summary_zh?: string;
  tags: string[];
  publishedAt?: string;
  url: string;
  external: boolean;
  status?: 'published';
}

function localTitle(item: WritingItem): string {
  return getLocale() === 'zh' ? (item.title_zh ?? item.title) : item.title;
}

function localSummary(item: WritingItem): string {
  return getLocale() === 'zh' ? (item.summary_zh ?? item.summary) : item.summary;
}

export function renderWriting(): string {
  const items = sortByPublished(writingData as WritingItem[]).slice(0, 9);
  const content = renderWritingList(items);

  return `
    <section data-section="writing" class="writing" aria-labelledby="writing-heading">
      <h2 id="writing-heading" class="writing__heading">${t('writing.heading')}</h2>
      ${content}
    </section>
  `;
}

export function renderWritingList(items: WritingItem[]): string {
  if (!items || items.length === 0) {
    return `<p class="writing__empty">${t('writing.empty')}</p>`;
  }

  const sorted = sortByPublished(items);
  const latestPublishedId = sorted[0]?.id;
  const itemsHtml = sorted.map((item) => renderWritingItem(item, item.id === latestPublishedId)).join('');
  return `<div class="writing__list">${itemsHtml}</div>`;
}

function renderWritingItem(item: WritingItem, isLatest: boolean): string {
  const badges: string[] = [];

  if (isLatest) {
    badges.push(`<span class="writing-item__badge writing-item__badge--latest">${t('writing.latest')}</span>`);
  }

  return `
    <a
      class="writing-item"
      href="${item.url}"
      ${item.external ? 'target="_blank" rel="noopener noreferrer"' : ''}
    >
      <article>
        <div class="writing-item__top">
          <h3 class="writing-item__title">${localTitle(item)}</h3>
          ${badges.join('')}
        </div>
        <p class="writing-item__summary">${localSummary(item)}</p>
        <div class="writing-item__meta">
          <span class="writing-item__tags">${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}</span>
          <time class="writing-item__date" datetime="${item.publishedAt ?? ''}">${formatDateLocale(item.publishedAt)}</time>
        </div>
      </article>
    </a>
  `;
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
