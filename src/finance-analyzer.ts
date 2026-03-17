import './styles/global.css';
import './styles/header.css';
import './styles/background.css';
import './styles/animations.css';
import './styles/finance-analyzer.css';
import './styles/footer.css';

import { renderHeader } from './sections/header';
import { renderFooter } from './sections/footer';
import initShiftBackground from './backgrounds/shift';
import { analyzeDocument } from './lib/finance/document';
import { analyzeCompanyDetail } from './lib/finance/detail';
import { extractTextFromFile } from './lib/finance/extract-text';
import { createLlmClient, type LlmClient } from './lib/finance/openai-client';
import type { DocumentAnalysis, DetailedCompanyAnalysis, SentimentLabel } from './lib/finance/types';

const app = document.getElementById('app');

// ── Background (lives outside #app so re-renders don't destroy it) ──
let bgInitialized = false;
function ensureBackground(): void {
  if (bgInitialized) return;
  bgInitialized = true;
  let bgEl = document.querySelector('.background-canvas');
  if (!bgEl) {
    bgEl = document.createElement('div');
    bgEl.className = 'background-canvas content--canvas';
    bgEl.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(bgEl, document.body.firstChild);
  }
  initShiftBackground('.content--canvas');
}

// ── State ──
let apiKey = sessionStorage.getItem('fa_api_key') ?? '';
let llm: LlmClient | null = apiKey ? createLlmClient(apiKey) : null;
let selectedFile: File | null = null;
let analysis: DocumentAnalysis | null = null;
let detail: DetailedCompanyAnalysis | null = null;
let isAnalyzing = false;
let deepAnalyzingCompany: string | null = null;
let statusMessage = '';
let errorMessage = '';

// ── Render ──
function render(): void {
  if (!app) return;

  app.innerHTML = `
    <a href="#main-content" class="visually-hidden">Skip to main content</a>
    ${renderHeader()}
    <main id="main-content" class="finance">
      <section class="finance__hero">
        <h1 class="finance__title">Finance Analyzer</h1>
        <p class="finance__subtitle">
          Upload a PDF or TXT finance document. AI classifies the source, extracts companies,
          scores sentiment, and supports deeper RAG analysis per company.
        </p>
      </section>

      ${renderApiKeySection()}
      ${apiKey ? renderUploadSection() : ''}
      ${statusMessage ? `<div class="finance-status">${statusMessage}</div>` : ''}
      ${errorMessage ? `<div class="finance-status finance-status--error">${errorMessage}</div>` : ''}
      ${analysis ? renderResults() : ''}
    </main>
    ${renderFooter()}
  `;

  ensureBackground();
  bindEvents();
}

function renderApiKeySection(): string {
  return `
    <section class="finance-card">
      <h2 class="finance-card__heading">API Configuration</h2>
      <div class="finance-setup">
        <label class="finance-setup__label" for="api-key-input">OpenAI API Key</label>
        <input
          id="api-key-input"
          class="finance-setup__input"
          type="password"
          placeholder="sk-..."
          value="${apiKey ? '••••••••••••' + apiKey.slice(-4) : ''}"
          autocomplete="off"
        />
        <p class="finance-setup__hint">
          Your key is stored only in this browser tab's session and is sent directly to OpenAI.
          It is never stored on any server. The key is cleared when you close the tab.
        </p>
        <div style="display: flex; gap: var(--space-3);">
          <button id="save-key-btn" class="finance-btn finance-btn--primary">
            ${apiKey ? 'Update Key' : 'Save Key'}
          </button>
          ${apiKey ? '<button id="clear-key-btn" class="finance-btn finance-btn--ghost">Clear Key</button>' : ''}
        </div>
      </div>
    </section>
  `;
}

function renderUploadSection(): string {
  return `
    <section class="finance-card">
      <h2 class="finance-card__heading">Document Upload</h2>
      <div class="finance-upload">
        <div id="dropzone" class="finance-upload__dropzone">
          <p class="finance-upload__dropzone-text">
            Drop a PDF or TXT file here, or click to browse
          </p>
          <input id="file-input" class="finance-upload__file-input" type="file" accept=".pdf,.txt" />
        </div>
        ${selectedFile ? `<div class="finance-upload__file-name">${escapeHtml(selectedFile.name)} (${formatFileSize(selectedFile.size)})</div>` : ''}
        <button
          id="analyze-btn"
          class="finance-btn finance-btn--primary"
          ${!selectedFile || isAnalyzing ? 'disabled' : ''}
        >
          ${isAnalyzing ? '<span class="finance-spinner"></span> Analyzing...' : 'Analyze Document'}
        </button>
      </div>
    </section>
  `;
}

function renderResults(): string {
  if (!analysis) return '';

  return `
    <div class="finance-results">
      <div style="display: flex; flex-direction: column; gap: var(--space-6);">
        ${renderSummaryCard()}
        ${renderCompanyList()}
        ${detail ? renderDetailPanel() : ''}
      </div>
      <aside style="display: flex; flex-direction: column; gap: var(--space-6);">
        ${renderSentimentBars()}
        ${renderMentionFrequency()}
        ${renderKeywordCloud()}
      </aside>
    </div>
  `;
}

function renderSummaryCard(): string {
  if (!analysis) return '';
  const scoreClass = sentimentClass(analysis.overallSentimentLabel);

  return `
    <section class="finance-card">
      <h2 class="finance-card__heading">Document Summary</h2>
      <div class="finance-summary__badge">
        ${formatSourceType(analysis.sourceType)} · confidence ${(analysis.sourceConfidence * 100).toFixed(0)}%
      </div>
      <p class="finance-summary__text">${escapeHtml(analysis.summary)}</p>
      <div class="finance-summary__sentiment">
        <span class="finance-summary__score ${scoreClass}">
          ${analysis.overallSentimentScore >= 0 ? '+' : ''}${analysis.overallSentimentScore.toFixed(2)}
        </span>
        <span class="finance-summary__score-label">
          Overall Sentiment · ${analysis.overallSentimentLabel}
        </span>
      </div>
    </section>
  `;
}

function renderCompanyList(): string {
  if (!analysis) return '';

  const items = analysis.companies.map((c) => `
    <div class="finance-company" data-company="${escapeAttr(c.name)}">
      <div class="finance-company__info">
        <span class="finance-company__name">${escapeHtml(c.name)}</span>
        <span class="finance-company__meta">${c.mentionCount} mentions · ${c.sentimentLabel}</span>
      </div>
      <div style="display: flex; align-items: center;">
        <span class="finance-company__score ${sentimentClass(c.sentimentLabel)}">
          ${c.sentimentScore >= 0 ? '+' : ''}${c.sentimentScore.toFixed(2)}
        </span>
        <span class="finance-company__arrow">
          ${deepAnalyzingCompany === c.name ? '<span class="finance-spinner"></span>' : '→'}
        </span>
      </div>
    </div>
  `).join('');

  return `
    <section class="finance-card">
      <h2 class="finance-card__heading">Companies Detected</h2>
      <p style="font-size: var(--font-size-xs); color: var(--color-fg-subtle); margin-bottom: var(--space-3);">Click a company for deep RAG analysis</p>
      <div class="finance-companies">${items}</div>
    </section>
  `;
}

function renderSentimentBars(): string {
  if (!analysis) return '';
  const maxAbs = Math.max(...analysis.visualizations.sentimentBars.map((b) => Math.abs(b.score)), 0.1);

  const bars = analysis.visualizations.sentimentBars.map((b) => {
    const pct = Math.abs(b.score) / maxAbs * 100;
    return `
      <div class="finance-bar">
        <span class="finance-bar__label">${escapeHtml(b.company)}</span>
        <div class="finance-bar__track">
          <div class="finance-bar__fill finance-bar__fill--${b.label}" style="width: ${pct}%;"></div>
        </div>
        <span class="finance-bar__value">${b.score >= 0 ? '+' : ''}${b.score.toFixed(2)}</span>
      </div>
    `;
  }).join('');

  return `
    <section class="finance-card">
      <h2 class="finance-card__heading">Sentiment</h2>
      <div class="finance-bars">${bars}</div>
    </section>
  `;
}

function renderMentionFrequency(): string {
  if (!analysis) return '';

  const rows = analysis.visualizations.mentionFrequency.map((m) => `
    <div class="finance-freq__row">
      <span class="finance-freq__name">${escapeHtml(m.company)}</span>
      <span class="finance-freq__count">${m.mentions}x</span>
    </div>
  `).join('');

  return `
    <section class="finance-card">
      <h2 class="finance-card__heading">Mention Frequency</h2>
      <div class="finance-freq">${rows}</div>
    </section>
  `;
}

function renderKeywordCloud(): string {
  if (!analysis) return '';

  const maxWeight = Math.max(...analysis.visualizations.keywordCloud.map((k) => k.weight), 1);
  const tags = analysis.visualizations.keywordCloud.map((k) => {
    const opacity = 0.5 + (k.weight / maxWeight) * 0.5;
    return `<span class="finance-keyword" style="opacity: ${opacity};">${escapeHtml(k.term)}</span>`;
  }).join('');

  return `
    <section class="finance-card">
      <h2 class="finance-card__heading">Keywords</h2>
      <div class="finance-keywords">${tags}</div>
    </section>
  `;
}

function renderDetailPanel(): string {
  if (!detail) return '';

  const opportunities = detail.opportunities.map((o) =>
    `<li class="finance-detail__list-item finance-detail__list-item--opportunity">${escapeHtml(o)}</li>`
  ).join('');

  const risks = detail.risks.map((r) =>
    `<li class="finance-detail__list-item finance-detail__list-item--risk">${escapeHtml(r)}</li>`
  ).join('');

  const takeaways = detail.keyTakeaways.map((t) =>
    `<li class="finance-detail__list-item finance-detail__list-item--takeaway">${escapeHtml(t)}</li>`
  ).join('');

  return `
    <section class="finance-card">
      <h2 class="finance-card__heading">Deep Analysis: ${escapeHtml(detail.company)}</h2>
      <div class="finance-detail">
        <div class="finance-summary__sentiment">
          <span class="finance-summary__score ${sentimentClass(detail.sentimentLabel)}">
            ${detail.sentimentScore >= 0 ? '+' : ''}${detail.sentimentScore.toFixed(2)}
          </span>
          <span class="finance-summary__score-label">
            ${detail.sentimentLabel} · confidence ${(detail.confidence * 100).toFixed(0)}%
          </span>
        </div>
        <div class="finance-detail__verdict">${escapeHtml(detail.verdict)}</div>

        ${opportunities ? `
          <div class="finance-detail__section">
            <h3 class="finance-detail__section-title">Opportunities</h3>
            <ul class="finance-detail__list">${opportunities}</ul>
          </div>
        ` : ''}

        ${risks ? `
          <div class="finance-detail__section">
            <h3 class="finance-detail__section-title">Risks</h3>
            <ul class="finance-detail__list">${risks}</ul>
          </div>
        ` : ''}

        ${takeaways ? `
          <div class="finance-detail__section">
            <h3 class="finance-detail__section-title">Key Takeaways</h3>
            <ul class="finance-detail__list">${takeaways}</ul>
          </div>
        ` : ''}
      </div>
    </section>
  `;
}

// ── Event Binding ──
function bindEvents(): void {
  // API key
  const saveKeyBtn = document.getElementById('save-key-btn');
  const clearKeyBtn = document.getElementById('clear-key-btn');
  const apiKeyInput = document.getElementById('api-key-input') as HTMLInputElement | null;

  saveKeyBtn?.addEventListener('click', () => {
    const val = apiKeyInput?.value?.trim() ?? '';
    if (!val || val.startsWith('••')) return;
    apiKey = val;
    sessionStorage.setItem('fa_api_key', apiKey);
    llm = createLlmClient(apiKey);
    errorMessage = '';
    statusMessage = 'API key saved for this session.';
    render();
  });

  clearKeyBtn?.addEventListener('click', () => {
    apiKey = '';
    sessionStorage.removeItem('fa_api_key');
    llm = null;
    analysis = null;
    detail = null;
    selectedFile = null;
    statusMessage = '';
    errorMessage = '';
    render();
  });

  // File upload
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input') as HTMLInputElement | null;

  dropzone?.addEventListener('click', () => fileInput?.click());

  dropzone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('finance-upload__dropzone--drag');
  });

  dropzone?.addEventListener('dragleave', () => {
    dropzone.classList.remove('finance-upload__dropzone--drag');
  });

  dropzone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('finance-upload__dropzone--drag');
    const file = (e as DragEvent).dataTransfer?.files[0];
    if (file) {
      selectedFile = file;
      analysis = null;
      detail = null;
      errorMessage = '';
      statusMessage = '';
      render();
    }
  });

  fileInput?.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (file) {
      selectedFile = file;
      analysis = null;
      detail = null;
      errorMessage = '';
      statusMessage = '';
      render();
    }
  });

  // Analyze
  const analyzeBtn = document.getElementById('analyze-btn');
  analyzeBtn?.addEventListener('click', handleAnalyze);

  // Company deep analysis
  document.querySelectorAll<HTMLElement>('.finance-company').forEach((el) => {
    el.addEventListener('click', () => {
      const company = el.dataset.company;
      if (company) handleDeepAnalysis(company);
    });
  });
}

async function handleAnalyze(): Promise<void> {
  if (!selectedFile || !llm || isAnalyzing) return;

  isAnalyzing = true;
  errorMessage = '';
  detail = null;
  statusMessage = 'Extracting text from document...';
  render();

  try {
    const text = await extractTextFromFile(selectedFile);
    statusMessage = 'Analyzing document with AI...';
    render();

    analysis = await analyzeDocument({ filename: selectedFile.name, text, llm });
    statusMessage = 'Analysis complete. Click a company for deep analysis.';
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Analysis failed.';
    statusMessage = '';
    analysis = null;
  } finally {
    isAnalyzing = false;
    render();
  }
}

async function handleDeepAnalysis(company: string): Promise<void> {
  if (!analysis || !llm || deepAnalyzingCompany) return;

  deepAnalyzingCompany = company;
  detail = null;
  errorMessage = '';
  statusMessage = `Running deep analysis for ${company}...`;
  render();

  try {
    detail = await analyzeCompanyDetail({
      company,
      summary: analysis.summary,
      text: analysis.analysisContext.text,
      llm,
    });
    // Override deep analysis score with the initial RAG-grounded score for consistency
    const initialCompany = analysis.companies.find((c) => c.name === company);
    if (initialCompany) {
      detail.sentimentScore = initialCompany.sentimentScore;
      detail.sentimentLabel = initialCompany.sentimentLabel;
    }
    statusMessage = `Deep analysis complete for ${company}.`;
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Deep analysis failed.';
    statusMessage = '';
  } finally {
    deepAnalyzingCompany = null;
    render();
  }
}

// ── Helpers ──
function sentimentClass(label: SentimentLabel): string {
  return `finance-summary__score--${label}`;
}

function formatSourceType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function escapeAttr(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ── Init ──
render();
