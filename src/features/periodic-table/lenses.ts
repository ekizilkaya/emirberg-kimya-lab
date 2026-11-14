import { BODY_MAIN, BODY_TRACE, DEEP_MAX_Z, type ElementData } from '../../data/elements';
import { FAMILIES } from '../../data/families';
import { phaseAt } from '../../domain/phase';
import { elementStars, maxStars } from '../../domain/scoring';
import type { LensId, SaveData } from '../../domain/types';
import { tr } from '../../i18n/tr';

export const LENSES: LensId[] = ['aileler', 'hal', 'kesif', 'vucut', 'isiyan', 'insan-yapimi'];

export const PHASE_COLORS: Record<string, string> = {
  kati: '#9fb4e0',
  sivi: '#3bc9db',
  gaz: '#ffa94d',
  bilinmiyor: '#6c7397',
};

export interface CellLook {
  bg: string;
  faded: boolean;
  icon: string;
  striped?: boolean;
}

export function cellLook(el: ElementData, lens: LensId, save: SaveData): CellLook {
  switch (lens) {
    case 'aileler': {
      const f = FAMILIES[el.family];
      return { bg: f.color, faded: false, icon: f.icon };
    }
    case 'hal': {
      const ph = phaseAt(el, 25);
      return { bg: PHASE_COLORS[ph], faded: false, icon: tr.phaseIcon[ph], striped: ph === 'bilinmiyor' };
    }
    case 'kesif': {
      const s = elementStars(save, el.z);
      const max = maxStars(el.z);
      if (s === 0) return { bg: '#3a4280', faded: true, icon: '' };
      if (s >= max) return { bg: '#f2c94c', faded: false, icon: '🌟' };
      return { bg: s === 1 ? '#74c0fc' : '#63e6be', faded: false, icon: '⭐' };
    }
    case 'vucut': {
      if (BODY_MAIN.includes(el.z)) return { bg: '#ff8fab', faded: false, icon: '❤️' };
      if (BODY_TRACE.includes(el.z)) return { bg: '#ffc9d6', faded: false, icon: '·' };
      return { bg: '#3a4280', faded: true, icon: '' };
    }
    case 'isiyan':
      return el.radioactive ? { bg: '#a9e34b', faded: false, icon: '☢️' } : { bg: '#3a4280', faded: true, icon: '' };
    case 'insan-yapimi':
      return el.synthetic ? { bg: '#ffd43b', faded: false, icon: '🏭' } : { bg: '#3a4280', faded: true, icon: '' };
  }
}

export function isDeep(z: number): boolean {
  return z <= DEEP_MAX_Z;
}
