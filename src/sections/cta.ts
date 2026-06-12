import contactsData from '../data/contacts.json';
import { ContactLink } from '../types';
import { t } from '../i18n';
import { sanitizeHref } from '../lib/html-safety';

export function renderCTA(): string {
  const contacts = contactsData as ContactLink[];
  const requiredContacts = contacts.filter((c) => c.required);
  const emailLink = sanitizeHref(requiredContacts.find((c) => c.type === 'email')?.value ?? '') || 'mailto:';

  const linksHtml = requiredContacts
    .map(
      (contact) => `
        <a
          class="cta__contact-link"
          href="${sanitizeHref(contact.value) || '/#'}"
          ${contact.type !== 'email' ? 'target="_blank" rel="noopener noreferrer"' : ''}
        >
          ${contact.label}
        </a>
      `
    )
    .join('');

  return `
    <section data-section="cta" class="cta" aria-labelledby="cta-heading">
      <h2 id="cta-heading" class="cta__heading">${t('cta.heading')}</h2>
      <a class="cta__button" href="${emailLink}">
        ${t('cta.button')}
      </a>
      <div id="cta-contacts" class="cta__contacts">
        ${linksHtml}
      </div>
    </section>
  `;
}
