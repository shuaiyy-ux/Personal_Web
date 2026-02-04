import contactsData from '../data/contacts.json';

interface ContactLink {
  id: string;
  type: string;
  label: string;
  value: string;
  required: boolean;
}

export function renderHeader(): string {
  const contacts = contactsData as ContactLink[];
  const requiredLinks = contacts.filter((c) => c.required);

  const navLinks = [
    { label: 'Blog', href: '/blog', external: false },
    ...requiredLinks.map((contact) => ({
      label: contact.label,
      href: contact.value,
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

  return `
    <header class="site-header" aria-label="Primary">
      <div class="site-header__inner container">
        <div class="site-header__brand" aria-label="CM Yao">CM Yao</div>
        <nav class="site-header__nav" aria-label="Primary navigation">
          ${linksHtml}
        </nav>
      </div>
    </header>
  `;
}

export default renderHeader;
