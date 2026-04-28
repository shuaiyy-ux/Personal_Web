import './styles/global.css';
import './styles/header.css';
import './styles/background.css';
import './styles/animations.css';
import './styles/hero.css';
import './styles/statement.css';
import './styles/navigation.css';
import './styles/writing.css';
import './styles/project-status.css';
import './styles/projects.css';
import './styles/cta.css';
import './styles/footer.css';

import { renderHeader, initLangSwitcher } from './sections/header';
import { t } from './i18n';
import { renderHero } from './sections/hero';
import { renderStatement } from './sections/statement';
import { renderNavigation } from './sections/navigation';
import { renderProjects, initProjectSpotlight } from './sections/projects';
import { renderWriting } from './sections/writing';
import { renderCTA } from './sections/cta';
import { renderFooter } from './sections/footer';
import initShiftBackground from './backgrounds/shift';

const app = document.getElementById('app');

function render(): void {
  if (!app) return;

  app.innerHTML = `
    <div class="background-canvas content--canvas" aria-hidden="true"></div>
    <a href="#main-content" class="visually-hidden">${t('post.skip')}</a>
    ${renderHeader()}
    ${renderHero()}
    <main id="main-content" class="container">
      ${renderStatement()}
      ${renderProjects()}
    </main>
    ${renderNavigation()}
    <div class="container">
      ${renderWriting()}
      ${renderCTA()}
    </div>
    ${renderFooter()}
  `;

  initShiftBackground('.content--canvas');
  initLangSwitcher();
  initProjectSpotlight();
}

render();

