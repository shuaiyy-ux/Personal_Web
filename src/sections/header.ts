import contactsData from '../data/contacts.json';
import { ContactLink } from '../types';
import { t, getLocale, setLocale } from '../i18n';
import { sanitizeHref } from '../lib/html-safety';

export function renderHeader(): string {
  const contacts = contactsData as ContactLink[];
  const requiredLinks = contacts.filter((c) => c.required);

  const navLinks = [
    { label: t('nav.blog'), href: '/blog/', external: false },
    ...requiredLinks.map((contact) => ({
      label: contact.label,
      href: sanitizeHref(contact.value) || '/#',
      external: contact.type !== 'email',
    })),
  ];

  const linksHtml = navLinks
    .map(
      (link) => `
        <a
          class="site-header__link"
          href="${link.href}"
          ${link.external ? 'target="_blank" rel="noopener noreferrer"' : ''}
        >
          ${link.label}
        </a>
      `
    )
    .join('');

  const nextLocale = getLocale() === 'en' ? 'zh' : 'en';

  return `
    <header class="site-header" aria-label="Primary">
      <div class="site-header__inner container">
        <a class="site-header__brand" aria-label="CM Yao" href="/">CM Yao</a>
        <nav class="site-header__nav" aria-label="Primary navigation">
          ${linksHtml}
          <button class="site-header__link site-header__lang" data-locale="${nextLocale}">${t('lang.switch')}</button>
        </nav>
      </div>
    </header>
  `;
}

export function initLangSwitcher(): void {
  const btn = document.querySelector<HTMLButtonElement>('.site-header__lang');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = btn.dataset.locale as 'en' | 'zh';
    setLocale(next);
  });
}

export default renderHeader;
