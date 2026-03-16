import type { SentimentLabel, SourceType } from './types';

const SENTIMENT_MAP: Record<string, SentimentLabel> = {
  bull: 'positive', bullish: 'positive', good: 'positive', positive: 'positive', up: 'positive',
  bearish: 'negative', bad: 'negative', down: 'negative', negative: 'negative',
  mixed: 'neutral', neutral: 'neutral', flat: 'neutral',
};

const SOURCE_MAP: Record<string, SourceType> = {
  filing: 'financial_report', financial: 'financial_report', financial_report: 'financial_report',
  financialreport: 'financial_report', report: 'financial_report',
  article: 'news', finance_news: 'news', financenews: 'news', market_news: 'news',
  marketnews: 'news', news: 'news',
  post: 'discussion', discussion: 'discussion', forum: 'discussion',
  forumthread: 'discussion', thread: 'discussion',
};

function normalizeSentimentLabel(value: unknown): SentimentLabel {
  const normalized = String(value ?? '').toLowerCase().replace(/[^a-z]/g, '');
  return SENTIMENT_MAP[normalized] ?? 'neutral';
}

function normalizeSourceType(value: unknown): SourceType {
  const normalized = String(value ?? '').toLowerCase().replace(/[^a-z_]/g, '');
  return SOURCE_MAP[normalized] ?? 'news';
}

function normalizeNumber(value: unknown, fallback: number, min: number, max: number): number {
  const parsed = typeof value === 'number' ? value : Number.parseFloat(String(value ?? ''));
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}

function normalizeKey(key: string): string {
  return key.endsWith('_') ? key.slice(0, -1) : key;
}

export function normalizeLlmJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeLlmJson);

  if (value && typeof value === 'object') {
    const source = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};

    for (const [rawKey, rawValue] of Object.entries(source)) {
      out[normalizeKey(rawKey)] = normalizeLlmJson(rawValue);
    }

    if ('sentimentLabel' in out) out.sentimentLabel = normalizeSentimentLabel(out.sentimentLabel);
    if ('overallSentimentLabel' in out) out.overallSentimentLabel = normalizeSentimentLabel(out.overallSentimentLabel);
    if ('sourceType' in out) out.sourceType = normalizeSourceType(out.sourceType);
    if ('sourceConfidence' in out) out.sourceConfidence = normalizeNumber(out.sourceConfidence, 0.65, 0, 1);
    if ('overallSentimentScore' in out) out.overallSentimentScore = normalizeNumber(out.overallSentimentScore, 0, -1, 1);
    if ('sentimentScore' in out) out.sentimentScore = normalizeNumber(out.sentimentScore, 0, -1, 1);
    if ('confidence' in out) out.confidence = normalizeNumber(out.confidence, 0.6, 0, 1);

    return out;
  }

  return value;
}
