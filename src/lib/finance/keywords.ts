const STOP_WORDS = new Set([
  'about', 'after', 'against', 'also', 'among', 'analyst', 'analysts', 'been', 'being',
  'between', 'company', 'could', 'from', 'guidance', 'into', 'market', 'more', 'news',
  'over', 'quarter', 'report', 'said', 'says', 'their', 'there', 'these', 'this', 'those',
  'through', 'under', 'were', 'which', 'while', 'with', 'would',
]);

export function computeKeywords(text: string, limit = 12, extraStopWords: string[] = []): string[] {
  const blocked = new Set([...STOP_WORDS, ...extraStopWords.map((w) => w.toLowerCase())]);
  const counts = new Map<string, number>();

  for (const token of text.toLowerCase().match(/[a-z][a-z0-9-]{2,}/g) ?? []) {
    if (blocked.has(token)) continue;
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([term]) => term);
}
