import './styles/global.css';
import './styles/header.css';
import './styles/background.css';
import './styles/animations.css';
import './styles/hero.css';
import './styles/statement.css';
import './styles/navigation.css';
import './styles/writing.css';
import './styles/projects.css';
import './styles/cta.css';
import './styles/footer.css';

import { renderHeader } from './sections/header';
import { renderHero } from './sections/hero';
import { renderStatement } from './sections/statement';
import { renderNavigation } from './sections/navigation';
import { renderWriting } from './sections/writing';
import { renderProjects } from './sections/projects';
import { renderCTA } from './sections/cta';
import { renderFooter } from './sections/footer';
import initShiftBackground from './backgrounds/shift';

const app = document.getElementById('app');

function render(): void {
  if (!app) return;

  app.innerHTML = `
    <div class="background-canvas content--canvas" aria-hidden="true"></div>
    <a href="#main-content" class="visually-hidden">Skip to main content</a>
    ${renderHeader()}
    ${renderHero()}
    ${renderNavigation()}
    <main id="main-content" class="container">
      ${renderStatement()}
      ${renderWriting()}
      ${renderProjects()}
      ${renderCTA()}
    </main>
    ${renderFooter()}
  `;

  initShiftBackground('.content--canvas');
}

render();

