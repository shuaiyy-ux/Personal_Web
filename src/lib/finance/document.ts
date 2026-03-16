import { chunkText, normalizeText } from './chunking';
import { computeKeywords } from './keywords';
import { buildEvidenceSnippets, countCompanyMentions } from './mentions';
import type { LlmClient } from './openai-client';
import type { DocumentAnalysis, VisualizationPayload } from './types';

const MAX_DOCUMENT_CHARS = 60_000;

function clampScore(score: number): number {
  return Math.max(-1, Math.min(1, score));
}

function buildVisualizationPayload(
  companies: DocumentAnalysis['companies'],
  globalKeywords: string[],
): VisualizationPayload {
  const keywordWeights = globalKeywords.map((term, index) => ({
    term,
    weight: Math.max(1, globalKeywords.length - index),
  }));

  return {
    sentimentBars: companies.map((c) => ({ company: c.name, label: c.sentimentLabel, score: c.sentimentScore })),
    mentionFrequency: companies.map((c) => ({ company: c.name, mentions: c.mentionCount })),
    keywordCloud: keywordWeights,
  };
}

export async function analyzeDocument(options: {
  filename: string;
  text: string;
  llm: LlmClient;
}): Promise<DocumentAnalysis> {
  const normalizedText = normalizeText(options.text).slice(0, MAX_DOCUMENT_CHARS);

  if (normalizedText.length < 80) {
    throw new Error('The uploaded document is too short to analyze.');
  }

  const llmDraft = await options.llm.analyzeDocument({ filename: options.filename, text: normalizedText });

  const companies = llmDraft.companies
    .map((company) => {
      const mentionCount = Math.max(1, countCompanyMentions(normalizedText, company.name));
      const evidenceSnippets =
        company.evidenceSnippets && company.evidenceSnippets.length > 0
          ? company.evidenceSnippets
          : buildEvidenceSnippets(normalizedText, company.name);
      const companyStopWords = company.name.toLowerCase().split(/\s+/);
      const keywords =
        company.keywords && company.keywords.length > 0
          ? company.keywords
          : computeKeywords(evidenceSnippets.join(' '), 6, companyStopWords);

      return {
        name: company.name,
        sentimentLabel: company.sentimentLabel,
        sentimentScore: clampScore(company.sentimentScore),
        reasoning: company.reasoning,
        keywords,
        evidenceSnippets,
        mentionCount,
      };
    })
    .sort((a, b) => b.mentionCount - a.mentionCount || b.sentimentScore - a.sentimentScore);

  const globalKeywords =
    llmDraft.globalKeywords && llmDraft.globalKeywords.length > 0
      ? llmDraft.globalKeywords
      : computeKeywords(normalizedText, 12, companies.flatMap((c) => c.name.toLowerCase().split(/\s+/)));

  return {
    sourceType: llmDraft.sourceType,
    sourceConfidence: llmDraft.sourceConfidence,
    summary: llmDraft.summary,
    overallSentimentLabel: llmDraft.overallSentimentLabel,
    overallSentimentScore: clampScore(llmDraft.overallSentimentScore),
    globalKeywords,
    companies,
    visualizations: buildVisualizationPayload(companies, globalKeywords),
    analysisContext: { text: normalizedText, chunks: chunkText(normalizedText) },
  };
}
