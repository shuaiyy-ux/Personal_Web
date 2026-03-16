import type { Chunk } from './types';

export function normalizeText(text: string): string {
  return text.replace(/\r/g, '').replace(/\t/g, ' ').replace(/\u0000/g, '').replace(/\n{3,}/g, '\n\n').trim();
}

export function chunkText(text: string, maxChars = 1600, overlapChars = 220): Chunk[] {
  const normalized = normalizeText(text);
  if (!normalized) return [];

  const paragraphs = normalized.split(/\n\n+/);
  const chunks: Chunk[] = [];
  let buffer = '';
  let cursor = 0;
  let idx = 0;

  for (const para of paragraphs) {
    const candidate = buffer ? `${buffer}\n\n${para}` : para;

    if (candidate.length <= maxChars) {
      buffer = candidate;
      continue;
    }

    if (buffer) {
      const start = cursor;
      const end = start + buffer.length;
      chunks.push({ id: `chunk-${idx++}`, content: buffer, start, end });
      cursor = Math.max(0, end - overlapChars);
      buffer = para;
      continue;
    }

    let pc = 0;
    while (pc < para.length) {
      const slice = para.slice(pc, pc + maxChars);
      const start = cursor + pc;
      chunks.push({ id: `chunk-${idx++}`, content: slice, start, end: start + slice.length });
      pc += Math.max(1, maxChars - overlapChars);
    }
    cursor += para.length;
    buffer = '';
  }

  if (buffer) {
    chunks.push({ id: `chunk-${idx++}`, content: buffer, start: cursor, end: cursor + buffer.length });
  }

  return chunks;
}
