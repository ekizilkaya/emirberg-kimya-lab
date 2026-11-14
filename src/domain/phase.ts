import type { ElementData, Phase } from '../data/elements';

type PhaseInput = Pick<ElementData, 'meltC' | 'boilC' | 'sublimes'>;

/** SPEC 10.2 — 1 atm basınçta T (°C) sıcaklıktaki hâl */
export function phaseAt(el: PhaseInput, T: number): Phase {
  const { meltC, boilC, sublimes } = el;
  if (meltC === null && boilC === null) return 'bilinmiyor';
  if (sublimes && boilC !== null) return T < boilC ? 'kati' : 'gaz';
  if (meltC === null && boilC !== null) return T < boilC ? 'sivi' : 'gaz';
  if (meltC !== null && T < meltC) return 'kati';
  if (boilC === null) return 'bilinmiyor';
  if (T < boilC) return 'sivi';
  return 'gaz';
}

const ORDER: Phase[] = ['kati', 'sivi', 'gaz'];

/**
 * İki hâl arasındaki adım adım geçişler.
 * Kaydırıcı bir anda katıdan gaza atlarsa (süblimleşmeyen element) önce erime, sonra kaynama sayılır.
 */
export function phaseSteps(el: PhaseInput, from: Phase, to: Phase): [Phase, Phase][] {
  if (from === to || from === 'bilinmiyor' || to === 'bilinmiyor') return [];
  if (el.sublimes) return [[from, to]];
  const a = ORDER.indexOf(from);
  const b = ORDER.indexOf(to);
  const steps: [Phase, Phase][] = [];
  const dir = b > a ? 1 : -1;
  for (let i = a; i !== b; i += dir) steps.push([ORDER[i], ORDER[i + dir]]);
  return steps;
}

export type TransitionWord = 'eridi' | 'kaynadi' | 'dondu' | 'yogustu' | 'sublimlesti' | 'katilasti';

export function transitionWord(from: Phase, to: Phase): TransitionWord | null {
  if (from === 'kati' && to === 'sivi') return 'eridi';
  if (from === 'sivi' && to === 'gaz') return 'kaynadi';
  if (from === 'sivi' && to === 'kati') return 'dondu';
  if (from === 'gaz' && to === 'sivi') return 'yogustu';
  if (from === 'kati' && to === 'gaz') return 'sublimlesti';
  if (from === 'gaz' && to === 'kati') return 'katilasti';
  return null;
}

/** Sıcaklık kaydırıcısı: doğrusal olmayan konum (0–1) ↔ °C eşlemesi */
const KNOTS: [number, number][] = [
  [0, -273],
  [0.1, -200],
  [0.22, -100],
  [0.34, 0],
  [0.44, 100],
  [0.56, 500],
  [0.66, 1000],
  [0.77, 2000],
  [0.88, 3500],
  [1, 6000],
];

export function positionToTemp(pos: number): number {
  const p = Math.min(1, Math.max(0, pos));
  for (let i = 1; i < KNOTS.length; i++) {
    const [p1, t1] = KNOTS[i];
    const [p0, t0] = KNOTS[i - 1];
    if (p <= p1) return Math.round(t0 + ((p - p0) / (p1 - p0)) * (t1 - t0));
  }
  return 6000;
}

export function tempToPosition(T: number): number {
  const t = Math.min(6000, Math.max(-273, T));
  for (let i = 1; i < KNOTS.length; i++) {
    const [p1, t1] = KNOTS[i];
    const [p0, t0] = KNOTS[i - 1];
    if (t <= t1) return p0 + ((t - t0) / (t1 - t0)) * (p1 - p0);
  }
  return 1;
}
