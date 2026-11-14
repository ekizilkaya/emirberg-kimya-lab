import { describe, expect, it } from 'vitest';
import { MOLECULES } from '../data/molecules';
import {
  canBond,
  nextBondOrder,
  recognize,
  structureToBench,
  type BenchAtom,
  type BenchBond,
} from './molecule';

describe('molekül tanıma (SPEC 8.4)', () => {
  it.each(MOLECULES.map((m) => [m.id, m] as const))('%s doğru kurulunca eşleşir', (_id, m) => {
    const { atoms, bonds } = structureToBench(m.structure);
    const res = recognize(atoms, bonds);
    expect(res).toHaveLength(1);
    expect(res[0].complete).toBe(true);
    expect(res[0].recipe?.id).toBe(m.id);
  });

  it('eli boşta kalan yapı eşleşmez', () => {
    const atoms: BenchAtom[] = [
      { id: 'o', symbol: 'O' },
      { id: 'h1', symbol: 'H' },
    ];
    const bonds: BenchBond[] = [{ id: 'b1', a: 'o', b: 'h1', order: 1 }];
    const [g] = recognize(atoms, bonds);
    expect(g.complete).toBe(false);
    expect(g.recipe).toBeUndefined();
  });

  it('bağlı olmayan iki grup ayrı değerlendirilir', () => {
    const w1 = structureToBench(MOLECULES.find((m) => m.id === 'h2o')!.structure, 'x');
    const w2 = structureToBench(MOLECULES.find((m) => m.id === 'co2')!.structure, 'y');
    const res = recognize([...w1.atoms, ...w2.atoms], [...w1.bonds, ...w2.bonds]);
    expect(res.map((r) => r.recipe?.id).sort()).toEqual(['co2', 'h2o']);
  });

  it('H₂O ile H₂O₂ karışmaz', () => {
    const h2o = structureToBench(MOLECULES.find((m) => m.id === 'h2o')!.structure);
    const h2o2 = structureToBench(MOLECULES.find((m) => m.id === 'h2o2')!.structure);
    expect(recognize(h2o.atoms, h2o.bonds)[0].recipe?.id).toBe('h2o');
    expect(recognize(h2o2.atoms, h2o2.bonds)[0].recipe?.id).toBe('h2o2');
  });

  it('tek başına soy gaz tamamlanmış sayılmaz', () => {
    const [g] = recognize([{ id: 'he', symbol: 'He' }], []);
    expect(g.complete).toBe(false);
  });

  it('katalogda olmayan tam yapı tarifsiz döner', () => {
    // H–O–O–O–H: eller dolu ama katalogda yok
    const atoms: BenchAtom[] = ['H', 'O', 'O', 'O', 'H'].map((s, i) => ({ id: `a${i}`, symbol: s }));
    const bonds: BenchBond[] = [0, 1, 2, 3].map((i) => ({ id: `b${i}`, a: `a${i}`, b: `a${i + 1}`, order: 1 }));
    const [g] = recognize(atoms, bonds);
    expect(g.complete).toBe(true);
    expect(g.recipe).toBeUndefined();
  });
});

describe('bağ kuralları', () => {
  const atoms: BenchAtom[] = [
    { id: 'o1', symbol: 'O' },
    { id: 'o2', symbol: 'O' },
    { id: 'he', symbol: 'He' },
    { id: 'h', symbol: 'H' },
  ];
  it('soy gaz bağ kurmaz', () => {
    expect(canBond(atoms, [], 'he', 'h')).toEqual({ ok: false, reason: 'soy-gaz', atomId: 'he' });
  });
  it('dolu atom bağ kurmaz', () => {
    const bonds: BenchBond[] = [{ id: 'b', a: 'o1', b: 'o2', order: 2 }];
    expect(canBond(atoms, bonds, 'o1', 'h')).toMatchObject({ ok: false, reason: 'dolu' });
  });
  it('bağa tıklama derece artırır, sınırda tekliye döner', () => {
    const b: BenchBond = { id: 'b', a: 'o1', b: 'o2', order: 1 };
    expect(nextBondOrder(atoms, [b], b)).toBe(2);
    const b2 = { ...b, order: 2 };
    expect(nextBondOrder(atoms, [b2], b2)).toBe(1);
    const n: BenchAtom[] = [
      { id: 'n1', symbol: 'N' },
      { id: 'n2', symbol: 'N' },
    ];
    const nb: BenchBond = { id: 'nb', a: 'n1', b: 'n2', order: 2 };
    expect(nextBondOrder(n, [nb], nb)).toBe(3);
    const nb3 = { ...nb, order: 3 };
    expect(nextBondOrder(n, [nb3], nb3)).toBe(1);
  });
});
