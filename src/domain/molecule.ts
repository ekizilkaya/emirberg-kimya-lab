import {
  HANDS,
  METALS,
  NOBLE,
  formulaKeyOf,
  moleculeByFormulaKey,
  type MoleculeRecipe,
  type MoleculeStructure,
} from '../data/molecules';

export interface BenchAtom {
  id: string;
  symbol: string;
}

export interface BenchBond {
  id: string;
  a: string;
  b: string;
  order: number;
}

export function handsOf(symbol: string): number {
  return HANDS[symbol] ?? 0;
}

export function usedHands(atomId: string, bonds: BenchBond[]): number {
  let n = 0;
  for (const b of bonds) if (b.a === atomId || b.b === atomId) n += b.order;
  return n;
}

export function freeHands(atom: BenchAtom, bonds: BenchBond[]): number {
  return handsOf(atom.symbol) - usedHands(atom.id, bonds);
}

export function bondKind(symA: string, symB: string): 'paylasim' | 'alisveris' {
  const metalA = METALS.has(symA);
  const metalB = METALS.has(symB);
  return metalA !== metalB ? 'alisveris' : 'paylasim';
}

export function findBond(bonds: BenchBond[], a: string, b: string): BenchBond | undefined {
  return bonds.find((x) => (x.a === a && x.b === b) || (x.a === b && x.b === a));
}

export type BondAttempt =
  | { ok: true }
  | { ok: false; reason: 'ayni-atom' | 'soy-gaz' | 'dolu' | 'zaten-bagli'; atomId?: string };

/** Yeni tekli bağ kurulabilir mi? */
export function canBond(atoms: BenchAtom[], bonds: BenchBond[], aId: string, bId: string): BondAttempt {
  if (aId === bId) return { ok: false, reason: 'ayni-atom' };
  const a = atoms.find((x) => x.id === aId);
  const b = atoms.find((x) => x.id === bId);
  if (!a || !b) return { ok: false, reason: 'ayni-atom' };
  if (NOBLE.has(a.symbol)) return { ok: false, reason: 'soy-gaz', atomId: a.id };
  if (NOBLE.has(b.symbol)) return { ok: false, reason: 'soy-gaz', atomId: b.id };
  if (findBond(bonds, aId, bId)) return { ok: false, reason: 'zaten-bagli' };
  if (freeHands(a, bonds) <= 0) return { ok: false, reason: 'dolu', atomId: a.id };
  if (freeHands(b, bonds) <= 0) return { ok: false, reason: 'dolu', atomId: b.id };
  return { ok: true };
}

/**
 * Bağa tıklama: iki tarafta da boş el varsa derece artar (en çok 3);
 * sınırdayken tekliye döner (SPEC 8.2).
 */
export function nextBondOrder(atoms: BenchAtom[], bonds: BenchBond[], bond: BenchBond): number {
  const a = atoms.find((x) => x.id === bond.a);
  const b = atoms.find((x) => x.id === bond.b);
  if (!a || !b) return bond.order;
  if (bond.order < 3 && freeHands(a, bonds) > 0 && freeHands(b, bonds) > 0) return bond.order + 1;
  return 1;
}

/** Bağlı gruplar (bileşenler) */
export function components(atoms: BenchAtom[], bonds: BenchBond[]): string[][] {
  const adj = new Map<string, string[]>();
  for (const a of atoms) adj.set(a.id, []);
  for (const b of bonds) {
    adj.get(b.a)?.push(b.b);
    adj.get(b.b)?.push(b.a);
  }
  const seen = new Set<string>();
  const out: string[][] = [];
  for (const a of atoms) {
    if (seen.has(a.id)) continue;
    const stack = [a.id];
    const group: string[] = [];
    seen.add(a.id);
    while (stack.length) {
      const cur = stack.pop()!;
      group.push(cur);
      for (const nb of adj.get(cur) ?? []) {
        if (!seen.has(nb)) {
          seen.add(nb);
          stack.push(nb);
        }
      }
    }
    out.push(group);
  }
  return out;
}

export function countSymbols(atoms: BenchAtom[], ids: string[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const id of ids) {
    const a = atoms.find((x) => x.id === id);
    if (a) out[a.symbol] = (out[a.symbol] ?? 0) + 1;
  }
  return out;
}

export interface GroupResult {
  atomIds: string[];
  complete: boolean;
  formulaKey: string;
  recipe?: MoleculeRecipe;
}

/** SPEC 8.4 — her bağlı grup ayrı değerlendirilir */
export function recognize(atoms: BenchAtom[], bonds: BenchBond[]): GroupResult[] {
  return components(atoms, bonds).map((ids) => {
    const counts = countSymbols(atoms, ids);
    const formulaKey = formulaKeyOf(counts);
    const allFull = ids.every((id) => {
      const atom = atoms.find((x) => x.id === id)!;
      return freeHands(atom, bonds) === 0;
    });
    const complete = ids.length >= 2 && allFull;
    const recipe = complete ? moleculeByFormulaKey(formulaKey) : undefined;
    return { atomIds: ids, complete, formulaKey, recipe };
  });
}

/** Tarif yapısını tezgâh atom/bağlarına çevirir (testler ve "Atölyede aç" için) */
export function structureToBench(
  structure: MoleculeStructure,
  prefix = 'a',
): { atoms: BenchAtom[]; bonds: BenchBond[] } {
  const atoms = structure.atoms.map((symbol, i) => ({ id: `${prefix}${i}`, symbol }));
  const bonds = structure.bonds.map(([i, j, order], k) => ({
    id: `${prefix}b${k}`,
    a: `${prefix}${i}`,
    b: `${prefix}${j}`,
    order,
  }));
  return { atoms, bonds };
}

/**
 * Basit yay düzeni: bağlılar çekişir, herkes birbirini iter.
 * Konumları yerinde günceller; toplam hareketi döndürür.
 */
export function relaxStep(
  pos: Map<string, { x: number; y: number }>,
  bonds: { a: string; b: string }[],
  opts: { rest: number; repel: number; width: number; height: number; margin: number; fixed?: string | null },
): number {
  const ids = [...pos.keys()];
  const force = new Map(ids.map((id) => [id, { x: 0, y: 0 }]));
  for (const b of bonds) {
    const pa = pos.get(b.a);
    const pb = pos.get(b.b);
    if (!pa || !pb) continue;
    const dx = pb.x - pa.x;
    const dy = pb.y - pa.y;
    const d = Math.hypot(dx, dy) || 0.01;
    const f = (d - opts.rest) * 0.12;
    const fx = (dx / d) * f;
    const fy = (dy / d) * f;
    force.get(b.a)!.x += fx;
    force.get(b.a)!.y += fy;
    force.get(b.b)!.x -= fx;
    force.get(b.b)!.y -= fy;
  }
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const pa = pos.get(ids[i])!;
      const pb = pos.get(ids[j])!;
      let dx = pb.x - pa.x;
      let dy = pb.y - pa.y;
      let d = Math.hypot(dx, dy);
      if (d < 0.01) {
        dx = 1 + i;
        dy = 1 + j;
        d = Math.hypot(dx, dy);
      }
      if (d < opts.repel) {
        const f = (opts.repel - d) * 0.18;
        const fx = (dx / d) * f;
        const fy = (dy / d) * f;
        force.get(ids[i])!.x -= fx;
        force.get(ids[i])!.y -= fy;
        force.get(ids[j])!.x += fx;
        force.get(ids[j])!.y += fy;
      }
    }
  }
  let total = 0;
  for (const id of ids) {
    if (id === opts.fixed) continue;
    const p = pos.get(id)!;
    const f = force.get(id)!;
    const mx = Math.max(-12, Math.min(12, f.x));
    const my = Math.max(-12, Math.min(12, f.y));
    p.x = Math.max(opts.margin, Math.min(opts.width - opts.margin, p.x + mx));
    p.y = Math.max(opts.margin, Math.min(opts.height - opts.margin, p.y + my));
    total += Math.abs(mx) + Math.abs(my);
  }
  return total;
}

/** Bir yapı için deterministik çizim düzeni (defter kartı) */
export function layoutStructure(structure: MoleculeStructure, size = 220): { x: number; y: number }[] {
  const n = structure.atoms.length;
  const pos = new Map<string, { x: number; y: number }>();
  structure.atoms.forEach((_, i) => {
    const ang = (i / n) * Math.PI * 2;
    pos.set(String(i), { x: size / 2 + Math.cos(ang) * size * 0.3, y: size / 2 + Math.sin(ang) * size * 0.3 });
  });
  const bonds = structure.bonds.map(([a, b]) => ({ a: String(a), b: String(b) }));
  const rest = n > 6 ? 44 : 56;
  for (let i = 0; i < 400; i++) {
    relaxStep(pos, bonds, { rest, repel: rest * 1.15, width: size, height: size, margin: 22 });
  }
  return structure.atoms.map((_, i) => pos.get(String(i))!);
}
