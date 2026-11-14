import { FAMOUS_ZS } from '../data/elementContent';
import { ELEMENTS, NAME_ORIGINS } from '../data/elements';
import { REAL_FAMILIES, type FamilyId } from '../data/families';
import { getReaction } from '../data/reactions';
import { elementStars, kpOf, rankIndex, rankOf } from './scoring';
import type { Condition, SaveData } from './types';

const FAMOUS = new Set(FAMOUS_ZS);

function viewedZs(save: SaveData): number[] {
  return Object.entries(save.elements)
    .filter(([, p]) => p.viewed)
    .map(([z]) => Number(z));
}

function familyMembers(f: FamilyId): number[] {
  return ELEMENTS.filter((e) => e.family === f).map((e) => e.z);
}

function familyOfZ(z: number): FamilyId {
  return ELEMENTS[z - 1].family;
}

/** SPEC 14.4 — bildirimsel koşul değerlendirici (saf) */
export function evaluateCondition(c: Condition, save: SaveData): boolean {
  switch (c.type) {
    case 'elementViewed':
      return !!save.elements[c.z]?.viewed;
    case 'elementsViewedCount': {
      let zs = viewedZs(save);
      const f = c.filter;
      if (f?.family) zs = zs.filter((z) => familyOfZ(z) === f.family);
      if (f?.zMax !== undefined) zs = zs.filter((z) => z <= f.zMax!);
      if (f?.famous) zs = zs.filter((z) => FAMOUS.has(z));
      if (f?.originKind) zs = zs.filter((z) => NAME_ORIGINS[z]?.kind === f.originKind);
      if (f?.zIn) zs = zs.filter((z) => f.zIn!.includes(z));
      return zs.length >= c.min;
    }
    case 'atomBuilt':
      return !!save.elements[c.z]?.built;
    case 'atomsBuiltCount': {
      const n = Object.entries(save.elements).filter(
        ([z, p]) => p.built && (c.zMax === undefined || Number(z) <= c.zMax),
      ).length;
      return n >= c.min;
    }
    case 'isotopeBuilt':
      return save.isotopes.includes(`${c.z}-${c.massNumber}`);
    case 'distinctIsotopesOfSameElement': {
      const byZ = new Map<string, number>();
      for (const key of save.isotopes) {
        const z = key.split('-')[0];
        byZ.set(z, (byZ.get(z) ?? 0) + 1);
      }
      return [...byZ.values()].some((n) => n >= c.min);
    }
    case 'unstableBuiltCount':
      return save.unstable.length >= c.min;
    case 'ionBuilt':
      return save.ions.some((key) => {
        const [z, ch] = key.split(':').map(Number);
        return (c.z === undefined || z === c.z) && (c.charge === undefined || ch === c.charge);
      });
    case 'ionsBuiltCount':
      return save.ions.length >= c.min;
    case 'nobleShellBuilt':
      return save.nobleShell;
    case 'moleculeFound':
      return !!save.molecules[c.id];
    case 'moleculesFoundCount':
      return Object.keys(save.molecules).length >= c.min;
    case 'bondOrdersUsed':
      return c.orders.every((o) => save.bondOrders.includes(o));
    case 'nobleGasAttempt':
      return save.nobleGasAttempt;
    case 'reactionFound':
      return !!save.reactions[c.id];
    case 'reactionsFoundCount': {
      const f = c.filter;
      const n = Object.keys(save.reactions).filter((id) => {
        const r = getReaction(id);
        if (!r) return false;
        if (f?.kind && r.kind !== f.kind) return false;
        if (f?.safety && r.safety !== f.safety) return false;
        if (f?.tag && !(r.tags ?? []).includes(f.tag)) return false;
        return true;
      }).length;
      return n >= c.min;
    }
    case 'phaseChangeSeen':
      return save.phaseChanges.some((key) => {
        const [z, from, to] = key.split(':');
        return Number(z) === c.z && (!c.from || from === c.from) && (!c.to || to === c.to);
      });
    case 'phaseChangesCount':
      return new Set(save.phaseChanges.map((k) => k.split(':')[0])).size >= c.min;
    case 'tempReached':
      return (
        (c.atMost === undefined || (save.tempMin !== null && save.tempMin <= c.atMost)) &&
        (c.atLeast === undefined || (save.tempMax !== null && save.tempMax >= c.atLeast))
      );
    case 'pinnedTempReached': {
      const t = save.pinnedTemps[c.z];
      if (!t) return false;
      return (c.atMost === undefined || t.min <= c.atMost) && (c.atLeast === undefined || t.max >= c.atLeast);
    }
    case 'lensUsed':
      return save.lensesUsed.includes(c.id);
    case 'anyFamilyComplete':
      return REAL_FAMILIES.some((f) => familyMembers(f).every((z) => save.elements[z]?.viewed));
    case 'familiesTouched': {
      const touched = new Set(viewedZs(save).map(familyOfZ));
      return REAL_FAMILIES.filter((f) => touched.has(f)).length >= c.min;
    }
    case 'elementStarsCount': {
      let n = 0;
      for (let z = 1; z <= c.zMax; z++) n += elementStars(save, z);
      return n >= c.min;
    }
    case 'questsDoneCount':
      return Object.keys(save.quests.done).length >= c.min;
    case 'rankReached':
      return rankIndex(rankOf(kpOf(save)).id) >= rankIndex(c.rank);
    case 'tutorialDone':
      return save.tutorial === 'done';
    case 'all':
      return c.of.every((x) => evaluateCondition(x, save));
    case 'any':
      return c.of.some((x) => evaluateCondition(x, save));
  }
}
