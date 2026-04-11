import { t } from '../i18n';

export function renderStatement(): string {
  return `
    <section data-section="statement" class="statement" aria-label="Site statement">
      <span class="statement__icon" aria-hidden="true">✦</span>
      <p class="statement__text">${t('statement.text')}</p>
    </section>
  `;
}
