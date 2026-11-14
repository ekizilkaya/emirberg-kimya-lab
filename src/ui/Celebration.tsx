import { useEffect, useMemo } from 'react';
import { play } from '../audio/sound';
import { getBadge } from '../data/badges';
import { RANKS } from '../data/config';
import { tr } from '../i18n/tr';
import { useStore } from '../state/store';
import './ui.css';

const CONFETTI_COLORS = ['#ff6b6b', '#ffd43b', '#63e6be', '#4dabf7', '#da77f2', '#ffa94d'];

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        dur: 1.2 + Math.random() * 0.8,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        rot: Math.random() * 360,
      })),
    [],
  );
  return (
    <div className="confetti" aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            transform: `rotate(${p.rot}deg)`,
          }}
        />
      ))}
    </div>
  );
}

/** Rozet ve unvan törenleri: ekran ortasında kısa kutlama, tıklayınca geçilir */
export function Celebration() {
  const current = useStore((s) => s.celebrations[0]);
  const shift = useStore((s) => s.shiftCelebration);
  const reduced = useStore((s) => s.save.settings.reducedMotion);

  useEffect(() => {
    if (!current) return;
    play(current.kind === 'rank' ? 'rank' : 'badge');
    const t = setTimeout(shift, current.kind === 'rank' ? 2600 : 2200);
    return () => clearTimeout(t);
  }, [current, shift]);

  if (!current) return null;
  let icon = '🏅';
  let title = '';
  let subtitle = '';
  if (current.kind === 'badge') {
    const b = getBadge(current.id);
    icon = b?.icon ?? '🏅';
    title = tr.notify.badge;
    subtitle = b?.nameTr ?? '';
  } else if (current.kind === 'rank') {
    const r = RANKS.find((x) => x.id === current.rank);
    icon = r?.icon ?? '🎓';
    title = tr.notify.rank;
    subtitle = tr.notify.rankText(r?.nameTr ?? '');
  }
  return (
    <div className="celebration" onClick={shift} role="alert">
      {!reduced && <Confetti />}
      <div className="celebration-card pop-in">
        <div className="celebration-icon">{icon}</div>
        <div className="celebration-title">{title}</div>
        <div className="celebration-sub">{subtitle}</div>
        <div className="faint small">{tr.notify.tapToContinue}</div>
      </div>
    </div>
  );
}
