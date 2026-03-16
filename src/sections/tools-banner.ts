export function renderToolsBanner(): string {
  return `
    <section data-section="tools-banner" class="tools-banner" aria-label="Featured tool">
      <a class="nav-block nav-block--featured" href="/tools/finance-analyzer/">
        <div class="nav-block__header">
          <span class="nav-block__label">Finance Analyzer <span class="nav-block--featured__badge">Tool</span></span>
          <span class="nav-block__arrow" aria-hidden="true">→</span>
        </div>
        <span class="nav-block__description">
          AI-powered document analysis — upload a PDF or TXT, get company sentiment scores,
          keyword extraction, and RAG-based deep insights. Runs entirely in your browser.
        </span>
        <span class="nav-block__action">Launch tool</span>
      </a>
    </section>
  `;
}
