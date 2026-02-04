import projectsData from '../data/projects.json';

interface ProjectItem {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
  thumbnail?: string;
}

export function renderProjects(): string {
  const items = (projectsData as ProjectItem[]).slice(0, 6);

  if (items.length === 0) {
    return `
      <section data-section="projects" class="projects" aria-labelledby="projects-heading">
        <h2 id="projects-heading" class="projects__heading">Projects / Experiments</h2>
        <p class="projects__empty">No projects yet. Stay tuned!</p>
      </section>
    `;
  }

  const cardsHtml = items
    .map(
      (item) => `
        <article class="project-card">
          <h3 class="project-card__title">${item.title}</h3>
          <p class="project-card__summary">${item.summary}</p>
          <div class="project-card__tags">
            ${item.tags.map((t) => `<span class="tag">${t}</span>`).join('')}
          </div>
          <div class="project-card__links">
            <a class="project-card__link" href="${item.githubUrl}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            ${item.liveUrl ? `<a class="project-card__link" href="${item.liveUrl}" target="_blank" rel="noopener noreferrer">Live ↗</a>` : ''}
          </div>
        </article>
      `
    )
    .join('');

  return `
    <section data-section="projects" class="projects" aria-labelledby="projects-heading">
      <h2 id="projects-heading" class="projects__heading">Projects / Experiments</h2>
      <div class="projects__grid">${cardsHtml}</div>
    </section>
  `;
}
