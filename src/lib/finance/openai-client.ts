import { normalizeLlmJson } from './normalize';
import type { CompanyDetailDraft, CompanySentimentDraft, DocumentLlmDraft, RetrievedChunk } from './types';

const OPENAI_API_BASE = 'https://api.openai.com/v1';

async function chatCompletion(
  apiKey: string,
  model: string,
  messages: Array<{ role: string; content: string }>,
  opts: { temperature?: number; seed?: number } = {},
): Promise<string> {
  const res = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: opts.temperature ?? 0.1,
      ...(opts.seed !== undefined && { seed: opts.seed }),
      response_format: { type: 'json_object' },
      messages,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${body}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '{}';
}

async function createEmbeddings(apiKey: string, model: string, input: string[]): Promise<number[][]> {
  const res = await fetch(`${OPENAI_API_BASE}/embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, input }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI Embeddings API error (${res.status}): ${body}`);
  }

  const data = await res.json();
  return data.data.map((item: { embedding: number[] }) => item.embedding);
}

function parseJsonObject<T>(raw: string, validate: (v: unknown) => T): T {
  const trimmed = raw.trim();
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) throw new Error('LLM did not return a JSON object.');
  const parsed = JSON.parse(trimmed.slice(start, end + 1));
  return validate(normalizeLlmJson(parsed));
}

function validateDocumentDraft(data: unknown): DocumentLlmDraft {
  const obj = data as Record<string, unknown>;
  const companies = Array.isArray(obj.companies) ? obj.companies : [];
  if (companies.length === 0) throw new Error('LLM returned no companies.');

  return {
    sourceType: (obj.sourceType as DocumentLlmDraft['sourceType']) ?? 'news',
    sourceConfidence: typeof obj.sourceConfidence === 'number' ? obj.sourceConfidence : 0.65,
    summary: String(obj.summary ?? ''),
    overallSentimentLabel: (obj.overallSentimentLabel as DocumentLlmDraft['overallSentimentLabel']) ?? 'neutral',
    overallSentimentScore: typeof obj.overallSentimentScore === 'number' ? obj.overallSentimentScore : 0,
    globalKeywords: Array.isArray(obj.globalKeywords) ? obj.globalKeywords.filter((k: unknown) => typeof k === 'string') : [],
    companies: companies.map((c: Record<string, unknown>) => ({
      name: String(c.name ?? ''),
      sentimentLabel: (c.sentimentLabel as DocumentLlmDraft['overallSentimentLabel']) ?? 'neutral',
      sentimentScore: typeof c.sentimentScore === 'number' ? c.sentimentScore : 0,
      reasoning: String(c.reasoning ?? ''),
      keywords: Array.isArray(c.keywords) ? c.keywords.filter((k: unknown) => typeof k === 'string') : [],
      evidenceSnippets: Array.isArray(c.evidenceSnippets) ? c.evidenceSnippets.filter((s: unknown) => typeof s === 'string') : [],
    })),
  };
}

function validateCompanyDraft(data: unknown): CompanyDetailDraft {
  const obj = data as Record<string, unknown>;
  return {
    verdict: String(obj.verdict ?? ''),
    sentimentLabel: (obj.sentimentLabel as CompanyDetailDraft['sentimentLabel']) ?? 'neutral',
    sentimentScore: typeof obj.sentimentScore === 'number' ? obj.sentimentScore : 0,
    confidence: typeof obj.confidence === 'number' ? obj.confidence : 0.6,
    opportunities: Array.isArray(obj.opportunities) ? obj.opportunities.map(String) : [],
    risks: Array.isArray(obj.risks) ? obj.risks.map(String) : [],
    keyTakeaways: Array.isArray(obj.keyTakeaways) ? obj.keyTakeaways.map(String) : [],
  };
}

function validateCompanySentimentDraft(data: unknown): CompanySentimentDraft {
  const obj = data as Record<string, unknown>;
  return {
    sentimentLabel: (obj.sentimentLabel as CompanySentimentDraft['sentimentLabel']) ?? 'neutral',
    sentimentScore: typeof obj.sentimentScore === 'number' ? obj.sentimentScore : 0,
    reasoning: String(obj.reasoning ?? ''),
    keywords: Array.isArray(obj.keywords) ? obj.keywords.filter((k: unknown) => typeof k === 'string') : [],
  };
}

export interface LlmClient {
  analyzeDocument(input: { filename: string; text: string }): Promise<DocumentLlmDraft>;
  embedTexts(texts: string[]): Promise<number[][]>;
  scoreCompanySentiment(input: { company: string; contexts: RetrievedChunk[] }): Promise<CompanySentimentDraft>;
  analyzeCompany(input: { company: string; summary: string; contexts: RetrievedChunk[] }): Promise<CompanyDetailDraft>;
}

export function createLlmClient(apiKey: string, model = 'gpt-4.1-mini', embeddingModel = 'text-embedding-3-small'): LlmClient {
  return {
    async analyzeDocument({ filename, text }) {
      const raw = await chatCompletion(apiKey, model, [
        {
          role: 'system',
          content: 'You are a finance document analyst. Return JSON only. Classify the uploaded text as financial_report, news, or discussion. Extract only companies explicitly mentioned. For each company, assign a company-specific sentiment label and score from -1 to 1 based on what the text says about that specific firm, not the overall article. Keep evidence snippets short and verbatim. Keep keywords concise.',
        },
        {
          role: 'user',
          content: [
            `Filename: ${filename}`,
            'Return JSON with fields:',
            'sourceType, sourceConfidence, summary, overallSentimentLabel, overallSentimentScore, globalKeywords, companies[].',
            'Each company must include: name, sentimentLabel, sentimentScore, reasoning, keywords, evidenceSnippets.',
            'Text:',
            text,
          ].join('\n\n'),
        },
      ]);
      return parseJsonObject(raw, validateDocumentDraft);
    },

    async embedTexts(texts) {
      return createEmbeddings(apiKey, embeddingModel, texts);
    },

    async scoreCompanySentiment({ company, contexts }) {
      const raw = await chatCompletion(
        apiKey,
        model,
        [
          {
            role: 'system',
            content: 'You are a finance sentiment analyst. Return JSON only. Score the sentiment for the specified company based strictly on the provided evidence chunks. Do not infer beyond what the evidence states.',
          },
          {
            role: 'user',
            content: [
              `Company: ${company}`,
              'Evidence chunks:',
              ...contexts.map((c, i) => `Chunk ${i + 1} (relevance ${c.score.toFixed(3)}): ${c.excerpt}`),
              'Return JSON with fields: sentimentLabel (positive/negative/neutral), sentimentScore (-1 to 1), reasoning (1-2 sentences), keywords (up to 6 relevant terms).',
            ].join('\n\n'),
          },
        ],
        { temperature: 0, seed: 42 },
      );
      return parseJsonObject(raw, validateCompanySentimentDraft);
    },

    async analyzeCompany({ company, summary, contexts }) {
      const raw = await chatCompletion(apiKey, model, [
        {
          role: 'system',
          content: 'You are a finance research analyst. Return JSON only. Base your answer strictly on the retrieved context. If evidence is mixed, explain why and score accordingly.',
        },
        {
          role: 'user',
          content: [
            `Company: ${company}`,
            `Existing summary: ${summary}`,
            'Retrieved evidence snippets:',
            ...contexts.map((c, i) => `Context ${i + 1} (score ${c.score.toFixed(3)}): ${c.excerpt}`),
            'Return JSON with fields: verdict, sentimentLabel, sentimentScore, confidence, opportunities, risks, keyTakeaways.',
          ].join('\n\n'),
        },
      ]);
      return parseJsonObject(raw, validateCompanyDraft);
    },
  };
}
