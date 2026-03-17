import { chunkText, normalizeText } from './chunking';
import { computeKeywords } from './keywords';
import { buildEvidenceSnippets, countCompanyMentions } from './mentions';
import type { LlmClient } from './openai-client';
import { rankChunksBySimilarity } from './retrieval';
import { labelFromScore } from './types';
import type { CompanyAnalysis, DocumentAnalysis, VisualizationPayload } from './types';

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

function fallbackCompanyFromDraft(
  text: string,
  draft: { name: string; sentimentLabel: string; sentimentScore: number; reasoning: string; keywords?: string[]; evidenceSnippets?: string[] },
): CompanyAnalysis {
  const mentionCount = Math.max(1, countCompanyMentions(text, draft.name));
  const evidenceSnippets =
    draft.evidenceSnippets && draft.evidenceSnippets.length > 0 ? draft.evidenceSnippets : buildEvidenceSnippets(text, draft.name);
  const companyStopWords = draft.name.toLowerCase().split(/\s+/);
  const keywords =
    draft.keywords && draft.keywords.length > 0 ? draft.keywords : computeKeywords(evidenceSnippets.join(' '), 6, companyStopWords);

  return {
    name: draft.name,
    sentimentLabel: labelFromScore(clampScore(draft.sentimentScore)),
    sentimentScore: clampScore(draft.sentimentScore),
    reasoning: draft.reasoning,
    keywords,
    evidenceSnippets,
    mentionCount,
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

  // Chunk the document for RAG retrieval
  const allChunks = chunkText(normalizedText).filter((c) => c.content.length > 40);
  const companyNames = llmDraft.companies.map((c) => c.name);

  // Attempt RAG-grounded per-company sentiment scoring
  let companies: CompanyAnalysis[];

  const chunkTexts = allChunks.map((c) => c.content);
  const queryTexts = companyNames.map((name) => `Financial sentiment analysis for ${name}`);

  try {
    // Batch embed: all chunks + one query per company in a single API call
    const allEmbeddings = await options.llm.embedTexts([...chunkTexts, ...queryTexts]);
    const chunkEmbeddings = allEmbeddings.slice(0, chunkTexts.length);
    const queryEmbeddings = allEmbeddings.slice(chunkTexts.length);

    // Score each company from its retrieved evidence (in parallel)
    companies = await Promise.all(
      llmDraft.companies.map(async (draft, i) => {
        const companyLower = draft.name.toLowerCase();
        const companyChunks = allChunks.filter((c) => c.content.toLowerCase().includes(companyLower));
        const candidates = (companyChunks.length > 0 ? companyChunks : allChunks).slice(0, 18);

        const candidateEmbeddings = candidates.map((c) => {
          const idx = allChunks.indexOf(c);
          return chunkEmbeddings[idx];
        });

        const retrieved = rankChunksBySimilarity(queryEmbeddings[i], candidateEmbeddings, candidates, 6);

        try {
          const scored = await options.llm.scoreCompanySentiment({
            company: draft.name,
            summary: llmDraft.summary,
            contexts: retrieved,
          });

          const mentionCount = Math.max(1, countCompanyMentions(normalizedText, draft.name));
          const evidenceSnippets = retrieved.map((r) => r.excerpt).slice(0, 3);
          const companyStopWords = draft.name.toLowerCase().split(/\s+/);
          const keywords =
            scored.keywords.length > 0 ? scored.keywords : computeKeywords(evidenceSnippets.join(' '), 6, companyStopWords);

          const score = clampScore(scored.sentimentScore);
          return {
            name: draft.name,
            sentimentLabel: labelFromScore(score),
            sentimentScore: score,
            reasoning: scored.reasoning,
            keywords,
            evidenceSnippets,
            mentionCount,
          };
        } catch {
          // Per-company LLM failure: fall back to original draft scores
          return fallbackCompanyFromDraft(normalizedText, draft);
        }
      }),
    );
  } catch {
    // Embedding failure: fall back to original LLM-only scores for all companies
    companies = llmDraft.companies.map((draft) => fallbackCompanyFromDraft(normalizedText, draft));
  }

  companies.sort((a, b) => b.mentionCount - a.mentionCount || b.sentimentScore - a.sentimentScore);

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
