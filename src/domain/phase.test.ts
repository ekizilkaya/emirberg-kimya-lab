import { describe, expect, it } from 'vitest';
import { ELEMENTS, getElement } from '../data/elements';
import { phaseAt, phaseSteps, positionToTemp, tempToPosition } from './phase';

const symbolsAt = (T: number, phase: string) =>
  ELEMENTS.filter((e) => phaseAt(e, T) === phase)
    .map((e) => e.symbol)
    .sort();

describe('phaseAt — veri doğrulama (SPEC 10.2)', () => {
  it('25 °C’de sıvı olanlar tam olarak Br ve Hg', () => {
    expect(symbolsAt(25, 'sivi')).toEqual(['Br', 'Hg']);
  });
  it('25 °C’de gaz olanlar tam olarak 11 element', () => {
    expect(symbolsAt(25, 'gaz')).toEqual(['Ar', 'Cl', 'F', 'H', 'He', 'Kr', 'N', 'Ne', 'O', 'Rn', 'Xe']);
  });
  it('37 °C’de Ga ve Cs sıvı', () => {
    expect(phaseAt(getElement(31), 37)).toBe('sivi');
    expect(phaseAt(getElement(55), 37)).toBe('sivi');
  });
  it('3400 °C’de katı kalanlar yalnızca W ve C', () => {
    expect(symbolsAt(3400, 'kati')).toEqual(['C', 'W']);
  });
  it('6000 °C’de hiçbir element katı ya da sıvı değil', () => {
    expect(symbolsAt(6000, 'kati')).toEqual([]);
    expect(symbolsAt(6000, 'sivi')).toEqual([]);
  });
  it('helyum mutlak sıfırda bile sıvı', () => {
    expect(phaseAt(getElement(2), -273)).toBe('sivi');
    expect(phaseAt(getElement(2), -268)).toBe('gaz');
  });
  it('karbon süblimleşir', () => {
    expect(phaseAt(getElement(6), 3000)).toBe('kati');
    expect(phaseAt(getElement(6), 3700)).toBe('gaz');
  });
  it('verisi olmayanlar bilinmiyor', () => {
    expect(phaseAt(getElement(110), 25)).toBe('bilinmiyor');
    expect(phaseAt(getElement(112), 25)).toBe('bilinmiyor');
    // Es: erime var, kaynama yok
    expect(phaseAt(getElement(99), 25)).toBe('kati');
    expect(phaseAt(getElement(99), 1000)).toBe('bilinmiyor');
  });
});

describe('phaseSteps', () => {
  it('katıdan gaza atlayışta erime + kaynama sayılır', () => {
    expect(phaseSteps(getElement(31), 'kati', 'gaz')).toEqual([
      ['kati', 'sivi'],
      ['sivi', 'gaz'],
    ]);
    expect(phaseSteps(getElement(7), 'gaz', 'kati')).toEqual([
      ['gaz', 'sivi'],
      ['sivi', 'kati'],
    ]);
  });
  it('süblimleşen element doğrudan geçer', () => {
    expect(phaseSteps(getElement(6), 'kati', 'gaz')).toEqual([['kati', 'gaz']]);
  });
  it('aynı hâl ya da bilinmiyor → adım yok', () => {
    expect(phaseSteps(getElement(26), 'kati', 'kati')).toEqual([]);
    expect(phaseSteps(getElement(26), 'kati', 'bilinmiyor')).toEqual([]);
  });
});

describe('sıcaklık kaydırıcısı eşlemesi', () => {
  it('uçlar', () => {
    expect(positionToTemp(0)).toBe(-273);
    expect(positionToTemp(1)).toBe(6000);
    expect(tempToPosition(-273)).toBe(0);
    expect(tempToPosition(6000)).toBe(1);
  });
  it('gidiş-dönüş tutarlı', () => {
    for (const T of [-270, -196, -18, 25, 37, 100, 250, 1200, 1600, 2500, 5500]) {
      expect(Math.abs(positionToTemp(tempToPosition(T)) - T)).toBeLessThanOrEqual(1);
    }
  });
});
