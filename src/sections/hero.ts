import { renderBrandSymbol } from '../components/brand-symbol';
import { t } from '../i18n';

export function renderHero(): string {
  return `
    <section data-section="hero" class="hero" aria-labelledby="hero-headline">
      <div class="hero__content">
        <div class="hero__index" aria-hidden="true">
          ${renderBrandSymbol(40, 'hero__symbol')}
          <span class="hero__index-name">CM Yao</span>
          <span class="hero__index-divider">/</span>
          <span class="hero__index-number">001</span>
        </div>
        <div class="hero__frame" aria-hidden="true">
          <span class="hero__bracket hero__bracket--tl"></span>
          <span class="hero__bracket hero__bracket--tr"></span>
          <span class="hero__bracket hero__bracket--bl"></span>
          <span class="hero__bracket hero__bracket--br"></span>
        </div>
        <div class="hero__body">
          <h1 id="hero-headline" class="hero__headline">${t('hero.headline')}</h1>
          <p class="hero__subheadline">${t('hero.subheadline')}<span class="hero__cursor" aria-hidden="true">▌</span></p>
        </div>
        <div class="hero__scroll-cue" aria-hidden="true">
          <span class="hero__scroll-text">${t('hero.scroll')}</span>
          <span class="hero__scroll-arrow">↓</span>
        </div>
      </div>
    </section>
  `;
}
