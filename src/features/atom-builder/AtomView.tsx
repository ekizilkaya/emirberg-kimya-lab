import { useMemo } from 'react';
import { shellsFor } from '../../domain/shells';

export type ParticleType = 'proton' | 'neutron' | 'electron';

interface Props {
  p: number;
  n: number;
  e: number;
  size?: number;
  spin?: boolean;
  unstable?: boolean;
  celebrate?: boolean;
  onParticlePointerDown?: (type: ParticleType, ev: React.PointerEvent) => void;
  onParticleContextMenu?: (type: ParticleType, ev: React.MouseEvent) => void;
  title?: string;
}

const HALF = 260;

/** Protonları ve nötronları karışık dizer */
function nucleusOrder(p: number, n: number): ParticleType[] {
  const total = p + n;
  const out: ParticleType[] = [];
  for (let i = 0; i < total; i++) {
    const want = Math.round(((i + 1) * p) / total) - Math.round((i * p) / total);
    out.push(want > 0 ? 'proton' : 'neutron');
  }
  return out;
}

/** Bohr modeli atom çizimi (SVG). Merkez (0,0). */
export function AtomView({
  p,
  n,
  e,
  size = 480,
  spin = true,
  unstable = false,
  celebrate = false,
  onParticlePointerDown,
  onParticleContextMenu,
  title,
}: Props) {
  const total = p + n;
  const pr = total > 40 ? 6.5 : total > 16 ? 8 : 10;
  const c = pr * 1.75;
  const nucleus = useMemo(() => {
    const order = nucleusOrder(p, n);
    return order.map((type, i) => {
      const r = c * Math.sqrt(i + 0.5) * (i === 0 && total === 1 ? 0 : 1);
      const th = i * 2.39996;
      return { type, x: r * Math.cos(th), y: r * Math.sin(th) };
    });
  }, [p, n, c, total]);
  const nucleusR = total > 0 ? c * Math.sqrt(total) + pr : 0;
  const shells = shellsFor(p, e);
  const first = Math.max(nucleusR + 26, 62);
  const spacing = shells.length > 1 ? Math.min(44, (HALF - 18 - first) / (shells.length - 1)) : 0;
  const ringR = shells.map((_, k) => first + k * spacing);
  // Küçük atomlar daha yakından görünsün: görünüm kutusu en dış katmana göre daralır
  const outer = ringR.length ? ringR[ringR.length - 1] + 12 : nucleusR;
  const half = Math.min(HALF, Math.max(150, outer + 26));
  const interactive = !!onParticlePointerDown;

  const particleProps = (type: ParticleType) =>
    interactive
      ? {
          onPointerDown: (ev: React.PointerEvent) => {
            ev.stopPropagation();
            onParticlePointerDown?.(type, ev);
          },
          onContextMenu: (ev: React.MouseEvent) => {
            ev.preventDefault();
            onParticleContextMenu?.(type, ev);
          },
          style: { cursor: 'grab' },
        }
      : {};

  return (
    <svg
      width={size}
      height={size}
      viewBox={`${-half} ${-half} ${half * 2} ${half * 2}`}
      style={{ transition: 'all 300ms ease' }}
      role="img"
      aria-label={title}
      className="atom-svg"
    >
      <defs>
        <radialGradient id="g-proton" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#ffc9c9" />
          <stop offset="100%" stopColor="#e03131" />
        </radialGradient>
        <radialGradient id="g-neutron" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#f1f3f5" />
          <stop offset="100%" stopColor="#868e96" />
        </radialGradient>
        <radialGradient id="g-electron" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#d0ebff" />
          <stop offset="100%" stopColor="#1c7ed6" />
        </radialGradient>
        <radialGradient id="g-glow">
          <stop offset="0%" stopColor="#ffd43b" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffd43b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="g-celebrate">
          <stop offset="0%" stopColor="#63e6be" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#63e6be" stopOpacity="0" />
        </radialGradient>
      </defs>
      {celebrate && <circle r={half - 4} fill="url(#g-celebrate)" className="atom-celebrate" />}
      {ringR.map((r, k) => (
        <circle key={`ring${k}`} r={r} fill="none" stroke="rgba(160,180,255,.28)" strokeWidth={2} strokeDasharray="4 6" />
      ))}
      {unstable && total > 0 && <circle r={nucleusR + 22} fill="url(#g-glow)" className="atom-glow" />}
      <g className={unstable ? 'nucleus-shake' : ''}>
        {nucleus.map((pt, i) => (
          <g key={i} transform={`translate(${pt.x} ${pt.y})`} {...particleProps(pt.type)}>
            <circle r={pr} fill={`url(#g-${pt.type})`} stroke="rgba(0,0,0,.25)" strokeWidth={1} />
            {pt.type === 'proton' && pr >= 8 && (
              <text textAnchor="middle" dy={pr * 0.38} fontSize={pr * 1.15} fontWeight={800} fill="#fff" pointerEvents="none">
                +
              </text>
            )}
          </g>
        ))}
      </g>
      {shells.map((count, k) => {
        const r = ringR[k];
        const dur = 9 + k * 5;
        return (
          <g key={`sh${k}-${count}`}>
            {spin && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={k % 2 ? '360 0 0' : '0 0 0'}
                to={k % 2 ? '0 0 0' : '360 0 0'}
                dur={`${dur}s`}
                repeatCount="indefinite"
              />
            )}
            {Array.from({ length: count }, (_, j) => {
              const a = (j / count) * Math.PI * 2 + k * 0.4;
              return (
                <g key={j} transform={`translate(${r * Math.cos(a)} ${r * Math.sin(a)})`} {...particleProps('electron')}>
                  <circle r={8} fill="url(#g-electron)" stroke="rgba(255,255,255,.5)" strokeWidth={1} />
                  <text textAnchor="middle" dy={3.5} fontSize={11} fontWeight={800} fill="#fff" pointerEvents="none">
                    −
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
