import { getDeep } from '../data/elementContent';
import { DEEP_MAX_Z } from '../data/elements';

/** Nötr atomun katman dizilimi (1–36; Ek B tablosundan) */
export function neutralShells(z: number): number[] {
  if (z <= 0) return [];
  const deep = getDeep(Math.min(z, DEEP_MAX_Z));
  if (!deep) throw new Error(`Katman verisi yok: ${z}`);
  return [...deep.shells];
}

const capacity = (shellIndex: number) => (shellIndex === 0 ? 2 : 8);

function addElectrons(shells: number[], count: number): number[] {
  const out = [...shells];
  for (let i = 0; i < count; i++) {
    if (out.length === 0) {
      out.push(1);
      continue;
    }
    const last = out.length - 1;
    if (out[last] < capacity(last)) out[last] += 1;
    else out.push(1);
  }
  return out;
}

function removeElectrons(shells: number[], count: number): number[] {
  const out = [...shells];
  for (let i = 0; i < count && out.length > 0; i++) {
    out[out.length - 1] -= 1;
    if (out[out.length - 1] === 0) out.pop();
  }
  return out;
}

/**
 * SPEC 7.3 — Bohr modeli (sadeleştirilmiş) katman dizilimi.
 * z: proton sayısı, e: elektron sayısı
 */
export function shellsFor(z: number, e: number): number[] {
  if (e <= 0) return [];
  if (z <= 0) {
    const base = neutralShells(Math.min(e, DEEP_MAX_Z));
    return e > DEEP_MAX_Z ? addElectrons(base, e - DEEP_MAX_Z) : base;
  }
  const base = neutralShells(z);
  if (e === z) return base;
  if (e < z) return removeElectrons(base, z - e);
  return addElectrons(base, e - z);
}

/** Dış katmanı dolu mu? (soy gaz dizilimi) */
export function hasNobleShell(shells: number[]): boolean {
  if (shells.length === 0) return false;
  const last = shells.length - 1;
  return shells[last] === capacity(last);
}
