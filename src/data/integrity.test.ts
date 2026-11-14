import { describe, expect, it } from 'vitest';
import { phaseAt } from '../domain/phase';
import { reactionKey } from '../domain/reactions';
import type { Condition } from '../domain/types';
import { BADGES } from './badges';
import { TEMP } from './config';
import { DEEP_CONTENT, FAMOUS_CONTENT } from './elementContent';
import { ELEMENTS, NAME_ORIGINS, findElement } from './elements';
import { FAMILY_ORDER } from './families';
import { HANDS, MOLECULES, PALETTE, getMolecule } from './molecules';
import { QUESTS } from './quests';
import { REACTIONS, getReaction } from './reactions';
import { SUBSTANCES, findSubstance } from './substances';

/** Ek A — adlar (spec ile birebir) */
const EK_A =
  'Hidrojen Helyum Lityum Berilyum Bor Karbon Azot Oksijen Flor Neon Sodyum Magnezyum Alüminyum Silisyum Fosfor Kükürt Klor Argon Potasyum Kalsiyum Skandiyum Titanyum Vanadyum Krom Mangan Demir Kobalt Nikel Bakır Çinko Galyum Germanyum Arsenik Selenyum Brom Kripton Rubidyum Stronsiyum İtriyum Zirkonyum Niyobyum Molibden Teknesyum Rutenyum Rodyum Paladyum Gümüş Kadmiyum İndiyum Kalay Antimon Tellür İyot Ksenon Sezyum Baryum Lantan Seryum Praseodim Neodim Prometyum Samaryum Evropiyum Gadolinyum Terbiyum Disprosyum Holmiyum Erbiyum Tulyum İterbiyum Lutesyum Hafniyum Tantal Tungsten Renyum Osmiyum İridyum Platin Altın Cıva Talyum Kurşun Bizmut Polonyum Astatin Radon Fransiyum Radyum Aktinyum Toryum Protaktinyum Uranyum Neptünyum Plütonyum Amerikyum Küriyum Berkelyum Kaliforniyum Aynştaynyum Fermiyum Mendelevyum Nobelyum Lavrensiyum Rutherfordiyum Dubniyum Seaborgiyum Bohriyum Hassiyum Meitneriyum Darmstadtiyum Röntgenyum Kopernikyum Nihonyum Flerovyum Moskovyum Livermoryum Tennesin Oganesson'.split(
    ' ',
  );

describe('elementler', () => {
  it('118 element, z kesintisiz', () => {
    expect(ELEMENTS).toHaveLength(118);
    ELEMENTS.forEach((e, i) => expect(e.z).toBe(i + 1));
  });
  it('sembol ve ad benzersiz', () => {
    expect(new Set(ELEMENTS.map((e) => e.symbol)).size).toBe(118);
    expect(new Set(ELEMENTS.map((e) => e.nameTr)).size).toBe(118);
  });
  it('tablo konumları çakışmasız', () => {
    const keys = ELEMENTS.map((e) => `${e.tableX},${e.tableY}`);
    expect(new Set(keys).size).toBe(118);
    for (const e of ELEMENTS) {
      expect(e.tableX).toBeGreaterThanOrEqual(1);
      expect(e.tableX).toBeLessThanOrEqual(18);
      expect([1, 2, 3, 4, 5, 6, 7, 9, 10]).toContain(e.tableY);
      // Lantanit/aktinit yer tutucularıyla çakışma yok
      expect(`${e.tableX},${e.tableY}`).not.toBe('3,6');
      expect(`${e.tableX},${e.tableY}`).not.toBe('3,7');
    }
  });
  it('Ek A adları birebir', () => {
    expect(ELEMENTS.map((e) => e.nameTr)).toEqual(EK_A);
  });
  it('Z ≥ 100 için erime/kaynama null (SPEC 14.6)', () => {
    for (const e of ELEMENTS.filter((x) => x.z >= 100)) {
      expect(e.meltC).toBeNull();
      expect(e.boilC).toBeNull();
    }
  });
  it('erime < kaynama', () => {
    for (const e of ELEMENTS) if (e.meltC !== null && e.boilC !== null) expect(e.meltC).toBeLessThan(e.boilC);
  });
  it('her aile en az bir üyeye sahip', () => {
    for (const f of FAMILY_ORDER) expect(ELEMENTS.some((e) => e.family === f)).toBe(true);
  });
  it('ad kökenleri geçerli elementlere ait', () => {
    for (const z of Object.keys(NAME_ORIGINS)) expect(findElement(Number(z))).toBeDefined();
  });
});

describe('derin içerik (Ek B)', () => {
  it('ilk 36 elementin hepsi var', () => {
    expect(DEEP_CONTENT.map((d) => d.z)).toEqual(Array.from({ length: 36 }, (_, i) => i + 1));
  });
  it.each(DEEP_CONTENT.map((d) => [d.z, d] as const))('z=%i: katman toplamı = z, kararlı A ≥ z', (z, d) => {
    expect(d.shells.reduce((a, b) => a + b, 0)).toBe(z);
    expect(d.stableMassNumbers.length).toBeGreaterThan(0);
    for (const a of d.stableMassNumbers) expect(a).toBeGreaterThanOrEqual(z);
    // Atom Kurucu sınırı: en az bir kararlı izotop kurulabilir olmalı (nötron ≤ 60)
    expect(d.stableMassNumbers.some((a) => a - z <= 60)).toBe(true);
  });
  it('ünlü kartlar 37–118 arasında', () => {
    expect(FAMOUS_CONTENT).toHaveLength(22);
    for (const f of FAMOUS_CONTENT) {
      expect(f.z).toBeGreaterThanOrEqual(37);
      expect(f.z).toBeLessThanOrEqual(118);
    }
  });
});

describe('moleküller (Ek D)', () => {
  it('27 tarif', () => expect(MOLECULES).toHaveLength(27));
  it.each(MOLECULES.map((m) => [m.id, m] as const))('%s', (_id, m) => {
    const handSum = Object.entries(m.atoms).reduce((s, [sym, n]) => s + HANDS[sym] * n, 0);
    expect(handSum % 2).toBe(0);
    for (const sym of Object.keys(m.atoms)) expect(PALETTE).toContain(sym);
    // yapıdaki bağ dereceleri el sayılarıyla tutarlı
    const used = m.structure.atoms.map(() => 0);
    for (const [a, b, o] of m.structure.bonds) {
      used[a] += o;
      used[b] += o;
      expect(o).toBeGreaterThanOrEqual(1);
      expect(o).toBeLessThanOrEqual(3);
    }
    m.structure.atoms.forEach((sym, i) => expect(used[i]).toBe(HANDS[sym]));
  });
  it('formül anahtarları ve kimlikler benzersiz', () => {
    expect(new Set(MOLECULES.map((m) => m.formulaKey)).size).toBe(MOLECULES.length);
    expect(new Set(MOLECULES.map((m) => m.id)).size).toBe(MOLECULES.length);
  });
});

describe('tepkimeler (Ek E)', () => {
  it('38 madde, 45 tepkime', () => {
    expect(SUBSTANCES).toHaveLength(38);
    expect(REACTIONS).toHaveLength(45);
  });
  it('girdiler madde listesinde var; ürün molekülleri katalogda', () => {
    for (const r of REACTIONS) {
      expect(r.inputs.length).toBeGreaterThanOrEqual(1);
      expect(r.inputs.length).toBeLessThanOrEqual(2);
      for (const id of r.inputs) expect(findSubstance(id), `${r.id}: ${id}`).toBeDefined();
      for (const id of r.productMoleculeIds ?? []) expect(getMolecule(id), `${r.id}: ${id}`).toBeDefined();
      expect(r.effects.length).toBeGreaterThan(0);
    }
  });
  it('arama anahtarları benzersiz', () => {
    const keys = REACTIONS.map((r) => reactionKey(r.inputs, r.tool));
    expect(new Set(keys).size).toBe(keys.length);
  });
  it('madde elementleri geçerli', () => {
    for (const s of SUBSTANCES) for (const z of s.elements) expect(findElement(z)).toBeDefined();
  });
});

/** Koşulu sağlayan içerik var mı? (ulaşılabilirlik) */
function reachable(c: Condition): boolean {
  switch (c.type) {
    case 'elementViewed':
      return !!findElement(c.z);
    case 'elementsViewedCount':
      return ELEMENTS.length >= c.min;
    case 'atomBuilt':
      return c.z >= 1 && c.z <= 36;
    case 'atomsBuiltCount':
      return c.min <= 36;
    case 'isotopeBuilt':
      return c.z >= 1 && c.z <= 36 && c.massNumber - c.z >= 0 && c.massNumber - c.z <= 60;
    case 'moleculeFound':
      return !!getMolecule(c.id);
    case 'moleculesFoundCount':
      return MOLECULES.length >= c.min;
    case 'reactionFound':
      return !!getReaction(c.id);
    case 'reactionsFoundCount': {
      const f = c.filter;
      const n = REACTIONS.filter(
        (r) =>
          (!f?.kind || r.kind === f.kind) &&
          (!f?.safety || r.safety === f.safety) &&
          (!f?.tag || (r.tags ?? []).includes(f.tag)),
      ).length;
      return n >= c.min;
    }
    case 'phaseChangeSeen': {
      const el = findElement(c.z);
      if (!el) return false;
      const phases = new Set<string>();
      for (let T = TEMP.min; T <= TEMP.max; T += 1) phases.add(phaseAt(el, T));
      return (!c.from || phases.has(c.from)) && (!c.to || phases.has(c.to));
    }
    case 'pinnedTempReached':
      return !!findElement(c.z) && (c.atMost === undefined || c.atMost >= TEMP.min);
    case 'tempReached':
      return (c.atMost === undefined || c.atMost >= TEMP.min) && (c.atLeast === undefined || c.atLeast <= TEMP.max);
    case 'all':
    case 'any':
      return c.of.every(reachable);
    default:
      return true;
  }
}

describe('görevler ve rozetler', () => {
  it('kimlikler benzersiz', () => {
    expect(new Set(QUESTS.map((q) => q.id)).size).toBe(QUESTS.length);
    expect(new Set(BADGES.map((b) => b.id)).size).toBe(BADGES.length);
  });
  it.each(QUESTS.map((q) => [q.id, q] as const))('görev %s ulaşılabilir', (_id, q) => {
    expect(reachable(q.condition)).toBe(true);
  });
  it.each(BADGES.map((b) => [b.id, b] as const))('rozet %s ulaşılabilir', (_id, b) => {
    expect(reachable(b.condition)).toBe(true);
  });
  it('görev kademeleri dağılımı', () => {
    expect(QUESTS.filter((q) => q.tier === 'ileri')).toHaveLength(10);
  });
});

describe('metin uzunlukları (SPEC 12.2)', () => {
  const LIMIT = 160;
  it('görev metinleri', () => {
    for (const q of QUESTS) {
      expect(q.questionTr.length, q.id).toBeLessThanOrEqual(LIMIT);
      expect(q.hintTr.length, q.id).toBeLessThanOrEqual(LIMIT);
    }
  });
  it('tepkime açıklamaları', () => {
    for (const r of REACTIONS) {
      expect(r.explainTr.length, r.id).toBeLessThanOrEqual(LIMIT);
      expect(r.hintTr.length, r.id).toBeLessThanOrEqual(LIMIT);
    }
  });
  it('molekül metinleri', () => {
    for (const m of MOLECULES) {
      expect(m.everydayTr.length, m.id).toBeLessThanOrEqual(LIMIT);
      expect(m.hintTr.length, m.id).toBeLessThanOrEqual(LIMIT);
    }
  });
});
