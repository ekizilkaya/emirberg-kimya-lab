import type { FamilyId } from '../data/families';
import type { Phase } from '../data/elements';

export type LensId = 'aileler' | 'hal' | 'kesif' | 'vucut' | 'isiyan' | 'insan-yapimi';
export type WorkshopId = 'tablo' | 'atom' | 'molekul' | 'kazan' | 'sicaklik' | 'defter';

export type Condition =
  | { type: 'elementViewed'; z: number }
  | {
      type: 'elementsViewedCount';
      min: number;
      filter?: { family?: FamilyId; zMax?: number; famous?: boolean; originKind?: string; zIn?: number[] };
    }
  | { type: 'atomBuilt'; z: number }
  | { type: 'atomsBuiltCount'; min: number; zMax?: number }
  | { type: 'isotopeBuilt'; z: number; massNumber: number }
  | { type: 'distinctIsotopesOfSameElement'; min: number }
  | { type: 'unstableBuiltCount'; min: number }
  | { type: 'ionBuilt'; z?: number; charge?: number }
  | { type: 'ionsBuiltCount'; min: number }
  | { type: 'nobleShellBuilt' }
  | { type: 'moleculeFound'; id: string }
  | { type: 'moleculesFoundCount'; min: number }
  | { type: 'bondOrdersUsed'; orders: number[] }
  | { type: 'nobleGasAttempt' }
  | { type: 'reactionFound'; id: string }
  | { type: 'reactionsFoundCount'; min: number; filter?: { kind?: string; safety?: string; tag?: string } }
  | { type: 'phaseChangeSeen'; z: number; from?: Phase; to?: Phase }
  | { type: 'phaseChangesCount'; min: number }
  | { type: 'tempReached'; atMost?: number; atLeast?: number }
  | { type: 'pinnedTempReached'; z: number; atMost?: number; atLeast?: number }
  | { type: 'lensUsed'; id: LensId }
  | { type: 'anyFamilyComplete' }
  | { type: 'familiesTouched'; min: number }
  | { type: 'elementStarsCount'; min: number; zMax: number }
  | { type: 'questsDoneCount'; min: number }
  | { type: 'rankReached'; rank: string }
  | { type: 'tutorialDone' }
  | { type: 'all'; of: Condition[] }
  | { type: 'any'; of: Condition[] };

export interface ElementProgress {
  viewed?: boolean;
  built?: boolean;
  used?: boolean;
}

export interface Settings {
  sound: boolean;
  volume: number;
  reducedMotion: boolean;
  mascotQuiet: boolean;
}

export interface SaveData {
  version: 1;
  profile: { name: string; createdAt: string };
  elements: Record<number, ElementProgress>;
  /** "z-a" — yerleşmiş (settled) çekirdekler */
  isotopes: string[];
  /** "z-a" — kararsız çekirdekler */
  unstable: string[];
  /** "z:yük" */
  ions: string[];
  nobleShell: boolean;
  /** id → ilk keşif tarihi (ISO) */
  molecules: Record<string, string>;
  reactions: Record<string, string>;
  /** "z:from:to" */
  phaseChanges: string[];
  tempMin: number | null;
  tempMax: number | null;
  pinnedTemps: Record<number, { min: number; max: number }>;
  bondOrders: number[];
  nobleGasAttempt: boolean;
  lensesUsed: LensId[];
  quests: { done: Record<string, string>; active: string[] };
  badges: Record<string, string>;
  rankSeen: string;
  tutorial: 'none' | 'done' | 'skipped';
  toursSeen: string[];
  tipsSeen: Record<string, number>;
  settings: Settings;
  daily?: { date: string; z: number };
}

export type GameEvent =
  | { type: 'element:viewed'; z: number }
  | { type: 'atom:settled'; p: number; n: number; e: number }
  | { type: 'atom:built'; z: number; a: number }
  | { type: 'bond:created'; order: number; kind: 'paylasim' | 'alisveris' }
  | { type: 'molecule:nobleGasAttempt' }
  | { type: 'molecule:found'; id: string }
  | { type: 'reaction:found'; id: string }
  | { type: 'temp:set'; celsius: number; pinnedZ?: number }
  | { type: 'temp:phaseChange'; z: number; from: Phase; to: Phase }
  | { type: 'lens:used'; id: LensId }
  | { type: 'tutorial:done' }
  | { type: 'tutorial:skipped' };

export type Notification =
  | { kind: 'star'; z: number; star: 'viewed' | 'built' | 'used' }
  | { kind: 'molecule'; id: string }
  | { kind: 'reaction'; id: string }
  | { kind: 'quest'; id: string; kp: number }
  | { kind: 'badge'; id: string }
  | { kind: 'rank'; rank: string };
