import { chunkText } from './chunking';
import type { LlmClient } from './openai-client';
import { rankChunksBySimilarity } from './retrieval';
import { labelFromScore } from './types';
import type { DetailedCompanyAnalysis } from './types';

const MAX_DETAIL_CHUNKS = 18;
const TOP_MATCHES = 6;

function fallbackDeepAnalysis(company: string, summary: string, snippets: string[]): DetailedCompanyAnalysis {
  const joined = `${summary}\n${snippets.join('\n')}`.toLowerCase();
  const positiveHits = (joined.match(/beat|growth|strong|upside|improve|record|surge|upgrade|positive/g) ?? []).length;
  const negativeHits = (joined.match(/risk|downside|decline|weak|miss|pressure|drop|cut|negative|concern/g) ?? []).length;
  const rawScore = positiveHits - negativeHits;
  const sentimentScore = Math.max(-1, Math.min(1, rawScore / 6));
  const sentimentLabel = sentimentScore > 0.15 ? 'positive' : sentimentScore < -0.15 ? 'negative' : 'neutral';

  return {
    company,
    verdict: 'Deep LLM analysis temporarily unavailable. Returned a heuristic estimate from retrieved evidence. Retry for full model-backed analysis.',
    sentimentLabel,
    sentimentScore,
    confidence: 0.45,
    opportunities: sentimentScore >= 0 ? ['Potential upside signals detected in recent context'] : [],
    risks: sentimentScore <= 0 ? ['Potential downside signals detected in recent context'] : [],
    keyTakeaways: ['Fallback mode was used due to model or embedding failure.', `Computed sentiment is ${sentimentLabel} from local evidence patterns.`],
    retrievedChunks: snippets.map((excerpt, i) => ({ id: `fallback-${i}`, excerpt, score: 0 })),
  };
}

export async function analyzeCompanyDetail(options: {
  company: string;
  summary: string;
  text: string;
  llm: LlmClient;
}): Promise<DetailedCompanyAnalysis> {
  const chunks = chunkText(options.text).filter((c) => c.content.length > 40);
  const companyChunks = chunks.filter((c) => c.content.toLowerCase().includes(options.company.toLowerCase()));
  const candidateChunks = (companyChunks.length > 0 ? companyChunks : chunks).slice(0, MAX_DETAIL_CHUNKS);

  let retrievedChunks = candidateChunks.slice(0, TOP_MATCHES).map((c) => ({ id: c.id, excerpt: c.content, score: 0 }));

  try {
    const embeddings = await options.llm.embedTexts([
      `Detailed sentiment and financial impact analysis for ${options.company}`,
      ...candidateChunks.map((c) => c.content),
    ]);
    const [queryEmbedding, ...chunkEmbeddings] = embeddings;
    retrievedChunks = rankChunksBySimilarity(queryEmbedding, chunkEmbeddings, candidateChunks, TOP_MATCHES);
  } catch {
    return fallbackDeepAnalysis(options.company, options.summary, retrievedChunks.map((c) => c.excerpt));
  }

  try {
    const draft = await options.llm.analyzeCompany({
      company: options.company,
      summary: options.summary,
      contexts: retrievedChunks,
    });

    return {
      company: options.company,
      verdict: draft.verdict,
      sentimentLabel: labelFromScore(draft.sentimentScore),
      sentimentScore: draft.sentimentScore,
      confidence: draft.confidence,
      opportunities: draft.opportunities,
      risks: draft.risks,
      keyTakeaways: draft.keyTakeaways,
      retrievedChunks,
    };
  } catch {
    return fallbackDeepAnalysis(options.company, options.summary, retrievedChunks.map((c) => c.excerpt));
  }
}
