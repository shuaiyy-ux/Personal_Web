import metaData from '../data/meta.json';
import contactsData from '../data/contacts.json';
import { ContactLink } from '../types';

interface SiteMeta {
  lastUpdated: string;
  accent: string;
  theme: string;
}

export function renderFooter(): string {
  const meta = metaData as SiteMeta;
  const contacts = contactsData as ContactLink[];
  const year = new Date().getFullYear();

  const linksHtml = contacts
    .filter((c) => c.required)
    .map(
      (contact) => `
        <a
          class="footer__link"
          href="${contact.value}"
          ${contact.type !== 'email' ? 'target="_blank" rel="noopener noreferrer"' : ''}
        >
          ${contact.label}
        </a>
      `
    )
    .join('');

  return `
    <footer data-section="footer" class="footer">
      <div class="footer__brand">CM Yao</div>
      <nav class="footer__nav" aria-label="Footer navigation">
        <a class="footer__link" href="/blog">Blog</a>
        ${linksHtml}
      </nav>
      <div class="footer__meta">
        <span>© ${year}</span>
        <span class="footer__updated">Last updated: ${formatDate(meta.lastUpdated)}</span>
      </div>
    </footer>
  `;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
