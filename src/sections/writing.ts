import writingData from '../data/writing.json';

interface WritingItem {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  publishedAt: string;
  url: string;
  external: boolean;
}

export function renderWriting(): string {
  const items = (writingData as WritingItem[]).slice(0, 9);

  if (items.length === 0) {
    return `
      <section data-section="writing" class="writing" aria-labelledby="writing-heading">
        <h2 id="writing-heading" class="writing__heading">Latest Writing</h2>
        <p class="writing__empty">No posts yet. Check back soon!</p>
      </section>
    `;
  }

  const itemsHtml = items
    .map(
      (item) => `
        <article class="writing-item">
          <a
            class="writing-item__link"
            href="${item.url}"
            ${item.external ? 'target="_blank" rel="noopener noreferrer"' : ''}
          >
            <h3 class="writing-item__title">${item.title}</h3>
          </a>
          <p class="writing-item__summary">${item.summary}</p>
          <div class="writing-item__meta">
            <span class="writing-item__tags">${item.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</span>
            <time class="writing-item__date" datetime="${item.publishedAt}">${formatDate(item.publishedAt)}</time>
          </div>
        </article>
      `
    )
    .join('');

  return `
    <section data-section="writing" class="writing" aria-labelledby="writing-heading">
      <h2 id="writing-heading" class="writing__heading">Latest Writing</h2>
      <div class="writing__list">${itemsHtml}</div>
    </section>
  `;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
