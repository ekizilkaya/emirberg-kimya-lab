import { getDeep } from '../data/elementContent';
import { findElement, getElement, type ElementData } from '../data/elements';

/** Proton sayısı = kimlik (SPEC 7.3) */
export function identifyElement(p: number): ElementData | null {
  if (p <= 0) return null;
  return findElement(p) ?? null;
}

export function charge(p: number, e: number): number {
  return p - e;
}

export function isStable(z: number, a: number): boolean {
  if (z <= 0) return false;
  const deep = getDeep(z);
  return !!deep && deep.stableMassNumbers.includes(a);
}

export function nearestStableA(z: number, a: number): number | null {
  const deep = getDeep(z);
  if (!deep) return null;
  let best = deep.stableMassNumbers[0];
  for (const s of deep.stableMassNumbers) if (Math.abs(s - a) < Math.abs(best - a)) best = s;
  return best;
}

/** Kararsız çekirdekte Mol'ün yön vermesi */
export function neutronHint(z: number, a: number): 'more' | 'less' | null {
  if (z <= 0 || isStable(z, a)) return null;
  const nearest = nearestStableA(z, a);
  if (nearest === null) return null;
  return a < nearest ? 'more' : 'less';
}

/** En yaygın kararlı izotop (atom kütlesine en yakın kararlı A) */
export function commonMassNumber(z: number): number {
  const deep = getDeep(z);
  const mass = getElement(z).atomicMass;
  if (!deep) return Math.round(mass);
  let best = deep.stableMassNumbers[0];
  for (const s of deep.stableMassNumbers) if (Math.abs(s - mass) < Math.abs(best - mass)) best = s;
  return best;
}

/** "Atomu kuruldu" koşulu: proton = Z, nötr, kararlı çekirdek */
export function isBuiltAtom(p: number, n: number, e: number): boolean {
  return p > 0 && e === p && isStable(p, p + n);
}

export type ChargeLabel = { kind: 'notr' } | { kind: 'arti' | 'eksi'; amount: number };

export function chargeLabel(p: number, e: number): ChargeLabel {
  const c = charge(p, e);
  if (c === 0) return { kind: 'notr' };
  return { kind: c > 0 ? 'arti' : 'eksi', amount: Math.abs(c) };
}
