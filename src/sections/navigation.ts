interface NavBlock {
  label: string;
  description: string;
  actionLabel: string;
  href: string;
  external: boolean;
}

const navBlocks: NavBlock[] = [
  {
    label: 'Blog',
    description: 'Where I distill ideas, break down complex systems, and share what I learn along the way.',
    actionLabel: 'Read articles',
    href: '/blog',
    external: false,
  },
  {
    label: 'LinkedIn',
    description: "Let's connect — always open to new opportunities and conversations.",
    actionLabel: 'Connect',
    href: 'https://linkedin.com/in/cmyao',
    external: true,
  },
  {
    label: 'GitHub',
    description: 'Code speaks louder. Check out my projects and experiments.',
    actionLabel: 'View code',
    href: 'https://github.com/cmyao',
    external: true,
  },
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
