import { REACTIONS, type ReactionEntry, type Tool } from '../data/reactions';

export function reactionKey(inputs: string[], tool?: Tool | null): string {
  return `${[...inputs].sort().join('+')}|${tool ?? '-'}`;
}

const BY_KEY = new Map<string, ReactionEntry>(REACTIONS.map((r) => [reactionKey(r.inputs, r.tool), r]));

/**
 * (maddeler + araç) birleşimini katalogda arar; sıra önemsizdir.
 * Araç seçiliyken araçlı eşleşme yoksa araçsız tepkimeye düşülür
 * (ör. sirke + karbonat + zaman yine köpürür). Tersi yapılmaz:
 * demir çivi + su araçsız → "hiçbir şey olmadı".
 */
export function findReaction(inputs: string[], tool?: Tool | null): ReactionEntry | null {
  if (inputs.length === 0) return null;
  const exact = BY_KEY.get(reactionKey(inputs, tool));
  if (exact) return exact;
  if (tool) return BY_KEY.get(reactionKey(inputs, null)) ?? null;
  return null;
}
