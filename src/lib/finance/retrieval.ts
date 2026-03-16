import type { Chunk, RetrievedChunk } from './types';

function cosineSimilarity(left: number[], right: number[]): number {
  if (left.length !== right.length || left.length === 0) return 0;

  let dot = 0, leftNorm = 0, rightNorm = 0;
  for (let i = 0; i < left.length; i++) {
    dot += left[i] * right[i];
    leftNorm += left[i] * left[i];
    rightNorm += right[i] * right[i];
  }

  if (leftNorm === 0 || rightNorm === 0) return 0;
  return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm));
}

export function rankChunksBySimilarity(
  queryEmbedding: number[],
  chunkEmbeddings: number[][],
  chunks: Chunk[],
  limit = 6,
): RetrievedChunk[] {
  return chunks
    .map((chunk, i) => ({
      id: chunk.id,
      excerpt: chunk.content,
      score: cosineSimilarity(queryEmbedding, chunkEmbeddings[i] ?? []),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
