import { describe, expect, it } from 'vitest';
import { charge, commonMassNumber, identifyElement, isBuiltAtom, isStable, neutronHint } from './atom';
import { hasNobleShell, shellsFor } from './shells';

describe('identifyElement', () => {
  it('proton sayısı elementi belirler', () => {
    expect(identifyElement(0)).toBeNull();
    expect(identifyElement(1)?.nameTr).toBe('Hidrojen');
    expect(identifyElement(6)?.symbol).toBe('C');
    expect(identifyElement(26)?.nameTr).toBe('Demir');
  });
});

describe('charge', () => {
  it('yük = proton − elektron', () => {
    expect(charge(11, 11)).toBe(0);
    expect(charge(11, 10)).toBe(1);
    expect(charge(17, 18)).toBe(-1);
    expect(charge(0, 3)).toBe(-3);
  });
});

describe('isStable / neutronHint', () => {
  it('kararlı izotop listesine göre', () => {
    expect(isStable(1, 1)).toBe(true);
    expect(isStable(1, 3)).toBe(false);
    expect(isStable(6, 12)).toBe(true);
    expect(isStable(6, 14)).toBe(false);
    expect(isStable(19, 40)).toBe(false);
    expect(isStable(20, 48)).toBe(true);
    expect(isStable(0, 0)).toBe(false);
  });
  it('nötron ipucu yön verir', () => {
    expect(neutronHint(6, 8)).toBe('more');
    expect(neutronHint(6, 16)).toBe('less');
    expect(neutronHint(6, 12)).toBeNull();
    expect(neutronHint(2, 2)).toBe('more');
  });
  it('yaygın kütle numarası kararlıdır', () => {
    for (let z = 1; z <= 36; z++) expect(isStable(z, commonMassNumber(z))).toBe(true);
    expect(commonMassNumber(26)).toBe(56);
    expect(commonMassNumber(6)).toBe(12);
  });
  it('atomu kuruldu koşulu', () => {
    expect(isBuiltAtom(6, 6, 6)).toBe(true);
    expect(isBuiltAtom(6, 8, 6)).toBe(false);
    expect(isBuiltAtom(6, 6, 5)).toBe(false);
    expect(isBuiltAtom(0, 0, 0)).toBe(false);
  });
});

describe('shellsFor (SPEC 16.1)', () => {
  const cases: [string, number, number, number[]][] = [
    ['H', 1, 1, [1]],
    ['He', 2, 2, [2]],
    ['Na', 11, 11, [2, 8, 1]],
    ['Na⁺', 11, 10, [2, 8]],
    ['Cl⁻', 17, 18, [2, 8, 8]],
    ['O²⁻', 8, 10, [2, 8]],
    ['Ca', 20, 20, [2, 8, 8, 2]],
    ['Cr', 24, 24, [2, 8, 13, 1]],
    ['Fe', 26, 26, [2, 8, 14, 2]],
    ['Fe²⁺', 26, 24, [2, 8, 14]],
    ['Cu', 29, 29, [2, 8, 18, 1]],
    ['Kr', 36, 36, [2, 8, 18, 8]],
  ];
  it.each(cases)('%s', (_name, z, e, expected) => {
    expect(shellsFor(z, e)).toEqual(expected);
  });
  it('elektron yoksa boş', () => {
    expect(shellsFor(5, 0)).toEqual([]);
  });
  it('proton yokken elektron sayısı kadar nötr atom dizilimi', () => {
    expect(shellsFor(0, 3)).toEqual([2, 1]);
    expect(shellsFor(0, 40)).toEqual([2, 8, 18, 8, 4]);
  });
  it('soy gaz dizilimi tespiti', () => {
    expect(hasNobleShell(shellsFor(10, 10))).toBe(true);
    expect(hasNobleShell(shellsFor(11, 10))).toBe(true);
    expect(hasNobleShell(shellsFor(11, 11))).toBe(false);
    expect(hasNobleShell(shellsFor(2, 2))).toBe(true);
  });
  it('elektron sayısı her zaman korunur', () => {
    for (let z = 0; z <= 36; z++) {
      for (let e = 0; e <= 40; e++) {
        expect(shellsFor(z, e).reduce((a, b) => a + b, 0)).toBe(e);
      }
    }
  });
});
