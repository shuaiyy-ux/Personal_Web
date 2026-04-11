import contactsData from '../data/contacts.json';
import { ContactLink } from '../types';
import { t } from '../i18n';

interface NavBlock {
  label: string;
  description: string;
  actionLabel: string;
  href: string;
  external: boolean;
}

// Per-contact copy so navigation stays curated while links stay single-sourced.
function contactCopy(): Record<string, { description: string; actionLabel: string }> {
  return {
    linkedin: {
      description: t('nav.linkedin.description'),
      actionLabel: t('nav.linkedin.action'),
    },
    github: {
      description: t('nav.github.description'),
      actionLabel: t('nav.github.action'),
    },
    email: {
      description: t('nav.email.description'),
      actionLabel: t('nav.email.action'),
    },
  };
}

export function renderNavigation(): string {
  const contacts = contactsData as ContactLink[];
  const requiredContacts = contacts.filter((c) => c.required);
  const copy = contactCopy();

  const navBlocks: NavBlock[] = [
    {
      label: t('nav.blog'),
      description: t('nav.blog.description'),
      actionLabel: t('nav.blog.action'),
      href: '/blog/',
      external: false,
    },
    ...requiredContacts.map((contact) => {
      const c = copy[contact.type] ?? {
        description: t('nav.fallback.description'),
        actionLabel: t('nav.fallback.action'),
      };

      return {
        label: contact.label,
        description: c.description,
        actionLabel: c.actionLabel,
        href: contact.value,
        external: contact.type !== 'email',
      };
    }),
  ];

  const blocksHtml = navBlocks
    .map(
      (block) => `
        <a
          class="nav-block"
          href="${block.href}"
          ${block.external ? 'target="_blank" rel="noopener noreferrer"' : ''}
        >
          <div class="nav-block__header">
            <span class="nav-block__label">${block.label}</span>
            <span class="nav-block__arrow" aria-hidden="true">→</span>
          </div>
          <span class="nav-block__description">${block.description}</span>
          <span class="nav-block__action">${block.actionLabel}${block.external ? ' ↗' : ''}</span>
        </a>
      `
    )
    .join('');

  return `
    <nav data-section="navigation" class="navigation" aria-label="Primary navigation">
      ${blocksHtml}
    </nav>
  `;
}
