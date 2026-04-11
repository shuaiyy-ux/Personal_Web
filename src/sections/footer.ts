import metaData from '../data/meta.json';
import contactsData from '../data/contacts.json';
import { ContactLink } from '../types';
import { t, formatDateLocale } from '../i18n';

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
        <a class="footer__link" href="/blog">${t('nav.blog')}</a>
        ${linksHtml}
      </nav>
      <div class="footer__meta">
        <span>© ${year}</span>
        <span class="footer__updated">${t('footer.updated')} ${formatDateLocale(meta.lastUpdated)}</span>
      </div>
    </footer>
  `;
}

