import { KP, RANKS, type RankId } from '../data/config';
import { DEEP_MAX_Z, ELEMENTS } from '../data/elements';
import { QUESTS } from '../data/quests';
import type { SaveData } from './types';

export function elementStars(save: SaveData, z: number): number {
  const p = save.elements[z];
  if (!p) return 0;
  if (z > DEEP_MAX_Z) return p.viewed ? 1 : 0;
  return (p.viewed ? 1 : 0) + (p.built ? 1 : 0) + (p.used ? 1 : 0);
}

export function maxStars(z: number): number {
  return z > DEEP_MAX_Z ? 1 : 3;
}

export function totalStars(save: SaveData, zMax = 118): number {
  let n = 0;
  for (const el of ELEMENTS) if (el.z <= zMax) n += elementStars(save, el.z);
  return n;
}

export function questReward(tier: string): number {
  return tier === 'ileri' ? KP.questAdvanced : KP.quest;
}

const QUEST_TIER = new Map(QUESTS.map((q) => [q.id, q.tier]));

export function kpOf(save: SaveData): number {
  let kp = totalStars(save) * KP.star;
  kp += Object.keys(save.molecules).length * KP.molecule;
  kp += Object.keys(save.reactions).length * KP.reaction;
  for (const id of Object.keys(save.quests.done)) kp += questReward(QUEST_TIER.get(id) ?? 'baslangic');
  kp += Object.keys(save.badges).length * KP.badge;
  return kp;
}

export function rankOf(kp: number): (typeof RANKS)[number] {
  let r = RANKS[0];
  for (const rank of RANKS) if (kp >= rank.minKp) r = rank;
  return r;
}

export function rankIndex(id: string): number {
  return RANKS.findIndex((r) => r.id === (id as RankId));
}

export function nextRank(kp: number): (typeof RANKS)[number] | null {
  return RANKS.find((r) => r.minKp > kp) ?? null;
}
