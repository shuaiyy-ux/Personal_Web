import { t } from '../i18n';

export function renderToolsBanner(): string {
  return `
    <section data-section="tools-banner" class="tools-banner" aria-label="Featured tool">
      <a class="nav-block nav-block--featured" href="/tools/finance-analyzer/">
        <div class="nav-block__header">
          <span class="nav-block__label">${t('tools.name')} <span class="nav-block--featured__badge">${t('tools.badge')}</span></span>
          <span class="nav-block__arrow" aria-hidden="true">→</span>
        </div>
        <span class="nav-block__description">${t('tools.description')}</span>
        <span class="nav-block__action">${t('tools.action')}</span>
      </a>
    </section>
  `;
}
