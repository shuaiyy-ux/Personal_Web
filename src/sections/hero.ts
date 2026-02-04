import { renderBrandSymbol } from '../components/brand-symbol';

export function renderHero(): string {
  return `
    <section data-section="hero" class="hero" aria-labelledby="hero-headline">
      <div class="hero__content">
        <!-- Index Label with Brand Symbol -->
        <div class="hero__index" aria-hidden="true">
          ${renderBrandSymbol(20, 'hero__symbol')}
          <span class="hero__index-name">CM Yao</span>
          <span class="hero__index-divider">/</span>
          <span class="hero__index-number">001</span>
        </div>
        
        <!-- Corner Brackets Frame -->
        <div class="hero__frame" aria-hidden="true">
          <span class="hero__bracket hero__bracket--tl"></span>
          <span class="hero__bracket hero__bracket--tr"></span>
          <span class="hero__bracket hero__bracket--bl"></span>
          <span class="hero__bracket hero__bracket--br"></span>
        </div>
        
        <!-- Core Content -->
        <div class="hero__body">
          <h1 id="hero-headline" class="hero__headline">Let Machine Work, So We Don't Have To</h1>
          <p class="hero__subheadline">Automating the mundane. Amplifying the meaningful.</p>
        </div>
        
        <!-- Scroll Cue -->
        <div class="hero__scroll-cue" aria-hidden="true">
          <span class="hero__scroll-text">scroll</span>
          <span class="hero__scroll-arrow">↓</span>
        </div>
      </div>
    </section>
  `;
}
