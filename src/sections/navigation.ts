import contactsData from '../data/contacts.json';
import { ContactLink } from '../types';

interface NavBlock {
  label: string;
  description: string;
  actionLabel: string;
  href: string;
  external: boolean;
}

// Per-contact copy so navigation stays curated while links stay single-sourced.
const contactCopy: Record<string, { description: string; actionLabel: string }> = {
  linkedin: {
    description: "Let's connect — always open to new opportunities and conversations.",
    actionLabel: 'Connect',
  },
  github: {
    description: 'Code speaks louder. Check out my projects and experiments.',
    actionLabel: 'View code',
  },
  email: {
    description: 'Prefer inbox? Drop me a line.',
    actionLabel: 'Send email',
  },
};

const contacts = contactsData as ContactLink[];
const requiredContacts = contacts.filter((c) => c.required);

const navBlocks: NavBlock[] = [
  {
    label: 'Blog',
    description: 'Where I distill ideas, break down complex systems, and share what I learn along the way.',
    actionLabel: 'Read articles',
    href: '/blog/',
    external: false,
  },
  ...requiredContacts.map((contact) => {
    const copy = contactCopy[contact.type] ?? {
      description: 'Learn more or reach out here.',
      actionLabel: 'Open link',
    };

    return {
      label: contact.label,
      description: copy.description,
      actionLabel: copy.actionLabel,
      href: contact.value,
      external: contact.type !== 'email',
    };
  }),
];

export function renderNavigation(): string {
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
