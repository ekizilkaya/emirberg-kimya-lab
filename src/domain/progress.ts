import { BADGES } from '../data/badges';
import { LIMITS } from '../data/config';
import { DEEP_MAX_Z, ELEMENTS, elementBySymbol } from '../data/elements';
import { getMolecule } from '../data/molecules';
import { QUESTS, type Quest } from '../data/quests';
import { getReaction } from '../data/reactions';
import { findSubstance } from '../data/substances';
import { charge, isStable } from './atom';
import { evaluateCondition } from './conditions';
import { kpOf, questReward, rankIndex, rankOf } from './scoring';
import type { GameEvent, Notification, SaveData } from './types';

export function createSave(name = 'Emir', now = new Date().toISOString()): SaveData {
  return {
    version: 1,
    profile: { name, createdAt: now },
    elements: {},
    isotopes: [],
    unstable: [],
    ions: [],
    nobleShell: false,
    molecules: {},
    reactions: {},
    phaseChanges: [],
    tempMin: null,
    tempMax: null,
    pinnedTemps: {},
    bondOrders: [],
    nobleGasAttempt: false,
    lensesUsed: [],
    quests: { done: {}, active: [] },
    badges: {},
    rankSeen: 'cirak',
    tutorial: 'none',
    toursSeen: [],
    tipsSeen: {},
    settings: { sound: true, volume: 0.6, reducedMotion: false, mascotQuiet: false },
  };
}

const addUnique = <T>(list: T[], item: T): T[] => (list.includes(item) ? list : [...list, item]);

function markElement(save: SaveData, z: number, key: 'viewed' | 'built' | 'used'): SaveData {
  if (key !== 'viewed' && z > DEEP_MAX_Z) return save;
  if (save.elements[z]?.[key]) return save;
  return { ...save, elements: { ...save.elements, [z]: { ...save.elements[z], [key]: true } } };
}

function markUsed(save: SaveData, zs: number[]): SaveData {
  let s = save;
  for (const z of zs) s = markElement(s, z, 'used');
  return s;
}

const NOBLE_Z = [2, 10, 18, 36];

/** Olayı kalıcı ilerlemeye işler (saf) */
export function applyEvent(save: SaveData, ev: GameEvent, now = new Date().toISOString()): SaveData {
  switch (ev.type) {
    case 'element:viewed':
      return markElement(save, ev.z, 'viewed');
    case 'atom:settled': {
      const { p, n, e } = ev;
      if (p <= 0) return save;
      const a = p + n;
      let s: SaveData = { ...save, isotopes: addUnique(save.isotopes, `${p}-${a}`) };
      if (!isStable(p, a)) s = { ...s, unstable: addUnique(s.unstable, `${p}-${a}`) };
      // Çıplak çekirdek (hiç elektron yok) iyon sayılmaz; çocuk elektronlarla oynamamıştır
      if (e !== p && e > 0) s = { ...s, ions: addUnique(s.ions, `${p}:${charge(p, e)}`) };
      return s;
    }
    case 'atom:built': {
      let s = markElement(save, ev.z, 'built');
      s = { ...s, isotopes: addUnique(s.isotopes, `${ev.z}-${ev.a}`) };
      if (NOBLE_Z.includes(ev.z) && !s.nobleShell) s = { ...s, nobleShell: true };
      return s;
    }
    case 'bond:created':
      return save.bondOrders.includes(ev.order) ? save : { ...save, bondOrders: [...save.bondOrders, ev.order] };
    case 'molecule:nobleGasAttempt':
      return save.nobleGasAttempt ? save : { ...save, nobleGasAttempt: true };
    case 'molecule:found': {
      const m = getMolecule(ev.id);
      if (!m) return save;
      let s = save.molecules[ev.id] ? save : { ...save, molecules: { ...save.molecules, [ev.id]: now } };
      s = markUsed(s, Object.keys(m.atoms).map((sym) => elementBySymbol(sym).z));
      return s;
    }
    case 'reaction:found': {
      const r = getReaction(ev.id);
      if (!r) return save;
      let s = save.reactions[ev.id] ? save : { ...save, reactions: { ...save.reactions, [ev.id]: now } };
      const zs = r.inputs.flatMap((id) => findSubstance(id)?.elements ?? []);
      s = markUsed(s, zs);
      return s;
    }
    case 'temp:set': {
      const T = ev.celsius;
      let s: SaveData = {
        ...save,
        tempMin: save.tempMin === null ? T : Math.min(save.tempMin, T),
        tempMax: save.tempMax === null ? T : Math.max(save.tempMax, T),
      };
      if (ev.pinnedZ) {
        const prev = s.pinnedTemps[ev.pinnedZ];
        s = {
          ...s,
          pinnedTemps: {
            ...s.pinnedTemps,
            [ev.pinnedZ]: { min: prev ? Math.min(prev.min, T) : T, max: prev ? Math.max(prev.max, T) : T },
          },
        };
      }
      return s;
    }
    case 'temp:phaseChange': {
      const key = `${ev.z}:${ev.from}:${ev.to}`;
      const s = { ...save, phaseChanges: addUnique(save.phaseChanges, key) };
      return markElement(s, ev.z, 'used');
    }
    case 'lens:used':
      return save.lensesUsed.includes(ev.id) ? save : { ...save, lensesUsed: [...save.lensesUsed, ev.id] };
    case 'tutorial:done':
      return { ...save, tutorial: 'done' };
    case 'tutorial:skipped':
      return save.tutorial === 'done' ? save : { ...save, tutorial: 'skipped' };
  }
}

/** Yeni yıldız, keşif, görev, rozet ve unvanları bulur (saf) */
export function evaluate(
  prev: SaveData,
  next: SaveData,
  now = new Date().toISOString(),
): { save: SaveData; notifications: Notification[] } {
  const notes: Notification[] = [];
  for (const el of ELEMENTS) {
    const a = prev.elements[el.z] ?? {};
    const b = next.elements[el.z] ?? {};
    for (const k of ['viewed', 'built', 'used'] as const) if (b[k] && !a[k]) notes.push({ kind: 'star', z: el.z, star: k });
  }
  for (const id of Object.keys(next.molecules)) if (!prev.molecules[id]) notes.push({ kind: 'molecule', id });
  for (const id of Object.keys(next.reactions)) if (!prev.reactions[id]) notes.push({ kind: 'reaction', id });

  let s = next;
  for (let pass = 0; pass < 6; pass++) {
    let changed = false;
    for (const q of QUESTS) {
      if (s.quests.done[q.id]) continue;
      if (evaluateCondition(q.condition, s)) {
        s = { ...s, quests: { ...s.quests, done: { ...s.quests.done, [q.id]: now } } };
        notes.push({ kind: 'quest', id: q.id, kp: questReward(q.tier) });
        changed = true;
      }
    }
    for (const b of BADGES) {
      if (s.badges[b.id]) continue;
      if (evaluateCondition(b.condition, s)) {
        s = { ...s, badges: { ...s.badges, [b.id]: now } };
        notes.push({ kind: 'badge', id: b.id });
        changed = true;
      }
    }
    if (!changed) break;
  }

  const rank = rankOf(kpOf(s));
  if (rankIndex(rank.id) > rankIndex(s.rankSeen)) {
    notes.push({ kind: 'rank', rank: rank.id });
    s = { ...s, rankSeen: rank.id };
  }
  return { save: s, notifications: notes };
}

export function processEvent(
  save: SaveData,
  ev: GameEvent,
  now = new Date().toISOString(),
): { save: SaveData; notifications: Notification[] } {
  const next = applyEvent(save, ev, now);
  if (next === save) return { save, notifications: [] };
  return evaluate(save, next, now);
}

// ---------------- Görev panosu ----------------

const TIER_ORDER = ['baslangic', 'orta', 'ileri'];

export function drawQuest(save: SaveData, exclude: string[], rng: () => number = Math.random): Quest | null {
  const active = new Set(save.quests.active);
  const candidates = QUESTS.filter((q) => !save.quests.done[q.id] && !active.has(q.id) && !exclude.includes(q.id));
  if (candidates.length === 0) return null;
  const lowest = TIER_ORDER.find((t) => candidates.some((q) => q.tier === t))!;
  const tierCands = candidates.filter((q) => q.tier === lowest);
  const activeWorkshops = new Set(
    save.quests.active
      .filter((id) => !save.quests.done[id])
      .map((id) => QUESTS.find((q) => q.id === id)?.workshop),
  );
  const varied = tierCands.filter((q) => !activeWorkshops.has(q.workshop));
  const pool = varied.length > 0 ? varied : tierCands;
  return pool[Math.floor(rng() * pool.length) % pool.length];
}

export function fillActiveQuests(save: SaveData, rng: () => number = Math.random): SaveData {
  let s = save;
  // Tanımsız görev kimliklerini temizle
  const valid = s.quests.active.filter((id) => QUESTS.some((q) => q.id === id));
  if (valid.length !== s.quests.active.length) s = { ...s, quests: { ...s.quests, active: valid } };
  while (s.quests.active.length < LIMITS.activeQuests) {
    const q = drawQuest(s, [], rng);
    if (!q) break;
    s = { ...s, quests: { ...s.quests, active: [...s.quests.active, q.id] } };
  }
  return s;
}

/** "Başka görev ver" / tamamlanan kartı yenile */
export function replaceQuest(save: SaveData, id: string, rng: () => number = Math.random): SaveData {
  const idx = save.quests.active.indexOf(id);
  if (idx < 0) return save;
  const without = { ...save, quests: { ...save.quests, active: save.quests.active.filter((x) => x !== id) } };
  const q = drawQuest(without, [id], rng);
  if (!q) {
    // Havuz boşsa: tamamlanmış kart kaldırılır, tamamlanmamış kart yerinde kalır
    return save.quests.done[id] ? without : save;
  }
  const active = [...without.quests.active];
  active.splice(idx, 0, q.id);
  return { ...save, quests: { ...save.quests, active } };
}

// ---------------- Günün elementi ----------------

export function pickDaily(save: SaveData, dateKey: string, rng: () => number = Math.random): SaveData {
  if (save.daily?.date === dateKey) return save;
  const unseen = ELEMENTS.filter((e) => !save.elements[e.z]?.viewed);
  const pool = unseen.length > 0 ? unseen : ELEMENTS;
  const pick = pool[Math.floor(rng() * pool.length) % pool.length];
  return { ...save, daily: { date: dateKey, z: pick.z } };
}

// ---------------- Göç / doğrulama ----------------

/** Kayıt verisini doğrular ve eksik alanları tamamlar. Geçersizse hata fırlatır. */
export function migrateSave(raw: unknown): SaveData {
  if (!raw || typeof raw !== 'object') throw new Error('Kayıt nesne değil');
  const r = raw as Partial<SaveData> & { version?: number };
  if (r.version !== 1) throw new Error(`Bilinmeyen kayıt sürümü: ${String(r.version)}`);
  const base = createSave(r.profile?.name ?? 'Emir', r.profile?.createdAt);
  const merged: SaveData = {
    ...base,
    ...r,
    profile: { ...base.profile, ...(r.profile ?? {}) },
    quests: { ...base.quests, ...(r.quests ?? {}) },
    settings: { ...base.settings, ...(r.settings ?? {}) },
  } as SaveData;
  if (typeof merged.elements !== 'object' || !Array.isArray(merged.isotopes) || !Array.isArray(merged.quests.active)) {
    throw new Error('Kayıt alanları bozuk');
  }
  return merged;
}
