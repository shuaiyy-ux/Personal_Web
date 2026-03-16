function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function countCompanyMentions(text: string, companyName: string): number {
  const pattern = new RegExp(`\\b${escapeRegExp(companyName)}\\b`, 'gi');
  return [...text.matchAll(pattern)].length;
}

export function buildEvidenceSnippets(text: string, companyName: string, maxSnippets = 3, radius = 180): string[] {
  const pattern = new RegExp(`\\b${escapeRegExp(companyName)}\\b`, 'gi');
  const snippets: string[] = [];

  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    const start = Math.max(0, index - radius);
    const end = Math.min(text.length, index + companyName.length + radius);
    const snippet = text.slice(start, end).replace(/\s+/g, ' ').trim();

    if (snippet && !snippets.includes(snippet)) snippets.push(snippet);
    if (snippets.length >= maxSnippets) break;
  }

  return snippets;
}
