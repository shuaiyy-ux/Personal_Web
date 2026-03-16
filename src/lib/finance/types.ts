export type SourceType = 'financial_report' | 'news' | 'discussion';
export type SentimentLabel = 'positive' | 'negative' | 'neutral';

export interface Chunk {
  id: string;
  content: string;
  start: number;
  end: number;
}

export interface CompanyAnalysis {
  name: string;
  sentimentLabel: SentimentLabel;
  sentimentScore: number;
  reasoning: string;
  keywords: string[];
  evidenceSnippets: string[];
  mentionCount: number;
}

export interface VisualizationPayload {
  sentimentBars: Array<{ company: string; label: SentimentLabel; score: number }>;
  mentionFrequency: Array<{ company: string; mentions: number }>;
  keywordCloud: Array<{ term: string; weight: number }>;
}

export interface AnalysisContext {
  text: string;
  chunks: Chunk[];
}

export interface DocumentAnalysis {
  sourceType: SourceType;
  sourceConfidence: number;
  summary: string;
  overallSentimentLabel: SentimentLabel;
  overallSentimentScore: number;
  globalKeywords: string[];
  companies: CompanyAnalysis[];
  visualizations: VisualizationPayload;
  analysisContext: AnalysisContext;
}

export interface RetrievedChunk {
  id: string;
  excerpt: string;
  score: number;
}

export interface DetailedCompanyAnalysis {
  company: string;
  verdict: string;
  sentimentLabel: SentimentLabel;
  sentimentScore: number;
  confidence: number;
  opportunities: string[];
  risks: string[];
  keyTakeaways: string[];
  retrievedChunks: RetrievedChunk[];
}

export interface DocumentLlmDraft {
  sourceType: SourceType;
  sourceConfidence: number;
  summary: string;
  overallSentimentLabel: SentimentLabel;
  overallSentimentScore: number;
  globalKeywords?: string[];
  companies: Array<{
    name: string;
    sentimentLabel: SentimentLabel;
    sentimentScore: number;
    reasoning: string;
    keywords?: string[];
    evidenceSnippets?: string[];
  }>;
}

export interface CompanyDetailDraft {
  verdict: string;
  sentimentLabel: SentimentLabel;
  sentimentScore: number;
  confidence: number;
  opportunities: string[];
  risks: string[];
  keyTakeaways: string[];
}
