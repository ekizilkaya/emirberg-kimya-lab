import { DEEP_MAX_Z } from '../data/elements';
import type { ElementProgress } from '../domain/types';
import { tr } from '../i18n/tr';

export function Stars({ z, progress, showHow = false }: { z: number; progress?: ElementProgress; showHow?: boolean }) {
  const keys = z > DEEP_MAX_Z ? (['viewed'] as const) : (['viewed', 'built', 'used'] as const);
  return (
    <span className="stars">
      {keys.map((k) => {
        const on = !!progress?.[k];
        const label = `${tr.card.stars[k]}${on ? '' : ` — ${tr.card.starHow[k]}`}`;
        return (
          <span key={k} className={on ? '' : 'off'} title={label} aria-label={label}>
            ⭐{showHow && <span className="sr-only">{label}</span>}
          </span>
        );
      })}
    </span>
  );
}
