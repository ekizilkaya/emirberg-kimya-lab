import { describe, expect, it } from 'vitest';
import { BADGES } from '../data/badges';
import { QUESTS } from '../data/quests';
import { evaluateCondition } from './conditions';
import { createSave, drawQuest, fillActiveQuests, migrateSave, processEvent, replaceQuest } from './progress';
import { kpOf, rankOf } from './scoring';
import type { GameEvent, SaveData } from './types';

const NOW = '2026-11-14T10:00:00.000Z';

function run(events: GameEvent[], start: SaveData = createSave('Emir', NOW)) {
  let s = start;
  const notes = [];
  for (const ev of events) {
    const r = processEvent(s, ev, NOW);
    s = r.save;
    notes.push(...r.notifications);
  }
  return { save: s, notes };
}

describe('olaylar ve yıldızlar', () => {
  it('kart incelemek 1. yıldızı verir', () => {
    const { save, notes } = run([{ type: 'element:viewed', z: 6 }]);
    expect(save.elements[6]?.viewed).toBe(true);
    expect(notes).toContainEqual({ kind: 'star', z: 6, star: 'viewed' });
    expect(kpOf(save)).toBe(1);
  });
  it('atom kurmak 2. yıldızı verir; 36 üstü için yalnız inceleme', () => {
    const { save } = run([
      { type: 'atom:built', z: 6, a: 12 },
      { type: 'element:viewed', z: 79 },
    ]);
    expect(save.elements[6]?.built).toBe(true);
    expect(save.elements[79]?.viewed).toBe(true);
  });
  it('molekül keşfi elementlerin 3. yıldızını verir', () => {
    const { save } = run([{ type: 'molecule:found', id: 'h2o' }]);
    expect(save.elements[1]?.used).toBe(true);
    expect(save.elements[8]?.used).toBe(true);
  });
  it('tepkime keşfi maddelerin elementlerine 3. yıldız verir (36 üstü hariç)', () => {
    const { save } = run([{ type: 'reaction:found', id: 'r39' }]);
    expect(save.elements[1]?.used).toBe(true);
    expect(save.elements[17]?.used).toBe(true);
    expect(save.elements[79]?.used).toBeUndefined();
  });
  it('hâl değişimi 3. yıldız verir', () => {
    const { save } = run([{ type: 'temp:phaseChange', z: 31, from: 'kati', to: 'sivi' }]);
    expect(save.elements[31]?.used).toBe(true);
  });
  it('yerleşmiş atom izotop/iyon/kararsız kaydı yapar', () => {
    const { save } = run([
      { type: 'atom:settled', p: 6, n: 8, e: 6 },
      { type: 'atom:settled', p: 11, n: 12, e: 10 },
    ]);
    expect(save.isotopes).toEqual(['6-14', '11-23']);
    expect(save.unstable).toEqual(['6-14']);
    expect(save.ions).toEqual(['11:1']);
  });
  it('aynı olay ikinci kez bildirim üretmez', () => {
    const first = run([{ type: 'molecule:found', id: 'h2' }]);
    const again = processEvent(first.save, { type: 'molecule:found', id: 'h2' }, NOW);
    expect(again.notifications).toEqual([]);
  });
});

describe('görevler ve rozetler', () => {
  it('etkin olmayan görev de tamamlanır', () => {
    const { save, notes } = run([{ type: 'reaction:found', id: 'r05' }]);
    expect(save.quests.done.qt01).toBeDefined();
    expect(notes).toContainEqual({ kind: 'quest', id: 'qt01', kp: 5 });
  });
  it('ileri kademe görev 8 KP', () => {
    const { notes } = run([{ type: 'atom:settled', p: 6, n: 8, e: 6 }]);
    expect(notes).toContainEqual({ kind: 'quest', id: 'qa09', kp: 8 });
  });
  it('Çırak Kimyager: tanıtım ya da ilk atom', () => {
    expect(run([{ type: 'tutorial:done' }]).save.badges.b01).toBeDefined();
    expect(run([{ type: 'tutorial:skipped' }]).save.badges.b01).toBeUndefined();
    expect(run([{ type: 'tutorial:skipped' }, { type: 'atom:built', z: 1, a: 1 }]).save.badges.b01).toBeDefined();
  });
  it('Buz ve Ateş', () => {
    const { save } = run([
      { type: 'temp:set', celsius: -273 },
      { type: 'temp:set', celsius: 6000 },
    ]);
    expect(save.badges.b15).toBeDefined();
    expect(save.quests.done.qs05).toBeDefined();
  });
  it('İnatçı Helyum: sabitli sıcaklık', () => {
    const notPinned = run([{ type: 'temp:set', celsius: -273 }]);
    expect(notPinned.save.quests.done.qs06).toBeUndefined();
    const pinned = run([{ type: 'temp:set', celsius: -273, pinnedZ: 2 }]);
    expect(pinned.save.quests.done.qs06).toBeDefined();
  });
  it('unvan atlama bildirimi', () => {
    let s = createSave('Emir', NOW);
    s = { ...s, molecules: Object.fromEntries(Array.from({ length: 12 }, (_, i) => [`x${i}`, NOW])) };
    const r = processEvent(s, { type: 'element:viewed', z: 1 }, NOW);
    expect(r.notifications.some((n) => n.kind === 'rank' && n.rank === 'kalfa')).toBe(true);
    expect(r.save.rankSeen).toBe('kalfa');
  });
});

describe('koşul türleri', () => {
  const s = createSave('Emir', NOW);
  const full: SaveData = {
    ...s,
    elements: { 2: { viewed: true }, 10: { viewed: true }, 18: { viewed: true }, 36: { viewed: true }, 54: { viewed: true }, 86: { viewed: true } },
    isotopes: ['6-12', '6-13', '6-14'],
    unstable: ['6-14', '2-2', '1-3'],
    ions: ['11:1', '17:-1'],
    nobleShell: true,
    bondOrders: [1, 2, 3],
    nobleGasAttempt: true,
    phaseChanges: ['31:kati:sivi', '7:gaz:sivi'],
    tempMin: -273,
    tempMax: 6000,
    lensesUsed: ['vucut'],
    reactions: { r20: NOW, r38: NOW, r39: NOW, r28: NOW },
  };
  it.each<[string, Parameters<typeof evaluateCondition>[0], boolean]>([
    ['elementViewed', { type: 'elementViewed', z: 2 }, true],
    ['elementsViewedCount family', { type: 'elementsViewedCount', min: 6, filter: { family: 'soy-gaz' } }, true],
    ['elementsViewedCount famous', { type: 'elementsViewedCount', min: 1, filter: { famous: true } }, true],
    ['elementsViewedCount origin', { type: 'elementsViewedCount', min: 1, filter: { originKind: 'gok-cismi' } }, true],
    ['elementsViewedCount zIn', { type: 'elementsViewedCount', min: 1, filter: { zIn: [1, 8] } }, false],
    ['atomBuilt', { type: 'atomBuilt', z: 6 }, false],
    ['atomsBuiltCount', { type: 'atomsBuiltCount', min: 1 }, false],
    ['isotopeBuilt', { type: 'isotopeBuilt', z: 6, massNumber: 14 }, true],
    ['distinctIsotopes', { type: 'distinctIsotopesOfSameElement', min: 3 }, true],
    ['unstableBuiltCount', { type: 'unstableBuiltCount', min: 3 }, true],
    ['ionBuilt', { type: 'ionBuilt', z: 11, charge: 1 }, true],
    ['ionBuilt yanlış yük', { type: 'ionBuilt', z: 11, charge: -1 }, false],
    ['ionsBuiltCount', { type: 'ionsBuiltCount', min: 2 }, true],
    ['nobleShellBuilt', { type: 'nobleShellBuilt' }, true],
    ['moleculeFound', { type: 'moleculeFound', id: 'h2o' }, false],
    ['moleculesFoundCount', { type: 'moleculesFoundCount', min: 0 }, true],
    ['bondOrdersUsed', { type: 'bondOrdersUsed', orders: [1, 2, 3] }, true],
    ['nobleGasAttempt', { type: 'nobleGasAttempt' }, true],
    ['reactionFound', { type: 'reactionFound', id: 'r20' }, true],
    ['reactionsFoundCount kind', { type: 'reactionsFoundCount', min: 3, filter: { kind: 'tepkime-yok' } }, true],
    ['reactionsFoundCount tag', { type: 'reactionsFoundCount', min: 1, filter: { tag: 'alev-testi' } }, true],
    ['reactionsFoundCount safety', { type: 'reactionsFoundCount', min: 1, filter: { safety: 'evde' } }, false],
    ['phaseChangeSeen', { type: 'phaseChangeSeen', z: 31, from: 'kati', to: 'sivi' }, true],
    ['phaseChangeSeen ters', { type: 'phaseChangeSeen', z: 31, from: 'sivi', to: 'kati' }, false],
    ['phaseChangesCount', { type: 'phaseChangesCount', min: 2 }, true],
    ['tempReached', { type: 'tempReached', atMost: -273, atLeast: 6000 }, true],
    ['pinnedTempReached', { type: 'pinnedTempReached', z: 2, atMost: -272 }, false],
    ['lensUsed', { type: 'lensUsed', id: 'vucut' }, true],
    ['anyFamilyComplete', { type: 'anyFamilyComplete' }, true],
    ['familiesTouched', { type: 'familiesTouched', min: 2 }, false],
    ['elementStarsCount', { type: 'elementStarsCount', min: 1, zMax: 2 }, true],
    ['questsDoneCount', { type: 'questsDoneCount', min: 1 }, false],
    ['rankReached', { type: 'rankReached', rank: 'cirak' }, true],
    ['tutorialDone', { type: 'tutorialDone' }, false],
    ['all', { type: 'all', of: [{ type: 'nobleShellBuilt' }, { type: 'tutorialDone' }] }, false],
    ['any', { type: 'any', of: [{ type: 'nobleShellBuilt' }, { type: 'tutorialDone' }] }, true],
  ])('%s', (_n, cond, expected) => {
    expect(evaluateCondition(cond, full)).toBe(expected);
  });
});

describe('KP ve unvan', () => {
  it('unvan eşikleri', () => {
    expect(rankOf(0).id).toBe('cirak');
    expect(rankOf(59).id).toBe('cirak');
    expect(rankOf(60).id).toBe('kalfa');
    expect(rankOf(180).id).toBe('usta');
    expect(rankOf(380).id).toBe('profesor');
    expect(rankOf(650).id).toBe('bas-kimyager');
  });
  it('KP hesabı', () => {
    const s: SaveData = {
      ...createSave('Emir', NOW),
      elements: { 1: { viewed: true, built: true, used: true }, 79: { viewed: true } },
      molecules: { h2: NOW },
      reactions: { r05: NOW },
      quests: { done: { qa01: NOW, qa09: NOW }, active: [] },
      badges: { b01: NOW },
    };
    expect(kpOf(s)).toBe(4 + 5 + 3 + 5 + 8 + 10);
  });
});

describe('görev panosu', () => {
  const seq = () => 0;
  it('3 etkin görev doldurur, önce başlangıç kademesi, farklı atölyeler', () => {
    const s = fillActiveQuests(createSave('Emir', NOW), seq);
    expect(s.quests.active).toHaveLength(3);
    const qs = s.quests.active.map((id) => QUESTS.find((q) => q.id === id)!);
    expect(qs.every((q) => q.tier === 'baslangic')).toBe(true);
    expect(new Set(qs.map((q) => q.workshop)).size).toBe(3);
  });
  it('başka görev ver kartı değiştirir', () => {
    const s = fillActiveQuests(createSave('Emir', NOW), seq);
    const old = s.quests.active[1];
    const r = replaceQuest(s, old, seq);
    expect(r.quests.active).toHaveLength(3);
    expect(r.quests.active).not.toContain(old);
  });
  it('havuz boşsa null', () => {
    const s = createSave('Emir', NOW);
    const done = Object.fromEntries(QUESTS.map((q) => [q.id, NOW]));
    expect(drawQuest({ ...s, quests: { done, active: [] } }, [])).toBeNull();
  });
});

describe('kayıt göçü', () => {
  it('geçerli kaydı tamamlar', () => {
    const raw = JSON.parse(JSON.stringify(createSave('Ali', NOW)));
    delete raw.settings.mascotQuiet;
    const m = migrateSave(raw);
    expect(m.profile.name).toBe('Ali');
    expect(m.settings.mascotQuiet).toBe(false);
  });
  it('bozuk kayıtta hata fırlatır', () => {
    expect(() => migrateSave(null)).toThrow();
    expect(() => migrateSave({ version: 99 })).toThrow();
    expect(() => migrateSave('abc')).toThrow();
  });
});

describe('rozet ve görev listeleri', () => {
  it('22 rozet, 54 görev', () => {
    expect(BADGES).toHaveLength(22);
    expect(QUESTS).toHaveLength(54);
  });
});
