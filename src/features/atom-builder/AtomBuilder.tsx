import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { play } from '../../audio/sound';
import { LIMITS } from '../../data/config';
import { getElement } from '../../data/elements';
import { chargeLabel, commonMassNumber, identifyElement, isBuiltAtom, isStable, neutronHint } from '../../domain/atom';
import { hasNobleShell, shellsFor } from '../../domain/shells';
import { tr } from '../../i18n/tr';
import { emit, useStore } from '../../state/store';
import { isTyping } from '../../app/Shell';
import { beginDrag, consumeDragClick, useDragOver, useDropTarget, type DragPayload } from '../../ui/drag';
import { AtomView, type ParticleType } from './AtomView';
import './atom.css';

const MAX: Record<ParticleType, number> = {
  proton: LIMITS.protonMax,
  neutron: LIMITS.neutronMax,
  electron: LIMITS.electronMax,
};
const KEY: Record<ParticleType, 'p' | 'n' | 'e'> = { proton: 'p', neutron: 'n', electron: 'e' };
const TYPES: ParticleType[] = ['proton', 'neutron', 'electron'];

function ParticleBall({ type, size = 34 }: { type: ParticleType; size?: number }) {
  return (
    <span className={`pball pball-${type}`} style={{ width: size, height: size, fontSize: size * 0.55 }}>
      {type === 'proton' ? '+' : type === 'electron' ? '−' : ''}
    </span>
  );
}

export default function AtomBuilder() {
  const atom = useStore((s) => s.atom);
  const setAtom = useStore((s) => s.setAtom);
  const say = useStore((s) => s.say);
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [shakeBin, setShakeBin] = useState<ParticleType | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const stageOver = useDragOver('atom-stage');
  const prevBuilt = useRef(false);
  const prevP = useRef(atom.p);

  const { p, n, e, target } = atom;
  const el = identifyElement(p);
  const a = p + n;
  const stable = p > 0 && isStable(p, a);
  const unstable = p > 0 && !stable;
  const charge = chargeLabel(p, e);
  const shells = shellsFor(p, e);

  // Hedef modu: kart ya da görevden gelindiğinde sahne boş açılır
  useEffect(() => {
    const hedef = params.get('hedef');
    if (hedef) {
      const z = Number(hedef);
      if (z >= 1 && z <= 36) {
        setAtom({ p: 0, n: 0, e: 0, target: z, randomLoaded: false });
        setShowHint(false);
      }
      setParams({}, { replace: true });
    }
  }, [params, setParams, setAtom]);

  const change = useCallback(
    (type: ParticleType, delta: number) => {
      const cur = useStore.getState().atom;
      const k = KEY[type];
      const next = Math.max(0, Math.min(MAX[type], cur[k] + delta));
      if (next === cur[k]) {
        if (delta > 0) {
          setShakeBin(type);
          setTimeout(() => setShakeBin(null), 350);
          say(tr.atom.binFull, { mood: 'surprised' });
          play('nope');
        }
        return;
      }
      play(delta > 0 ? type : 'remove');
      setAtom({ [k]: next, randomLoaded: false });
    },
    [setAtom, say],
  );

  // Anında öğretici anlar
  useEffect(() => {
    if (p !== prevP.current) {
      if (prevP.current === 0 && p === 1) say(tr.atomTips.firstProton, { key: 'tip-first-proton', mood: 'happy' });
      else if (p > 0 && el) say(tr.atomTips.protonChanged(el.nameTr), { key: 'tip-proton-changed', max: 3 });
      prevP.current = p;
    }
  }, [p, el, say]);
  useEffect(() => {
    if (n > 0) say(tr.atomTips.firstNeutron, { key: 'tip-first-neutron' });
  }, [n, say]);
  const shell0 = shells[0] ?? 0;
  useEffect(() => {
    if (shell0 === 2 && e >= 2) say(tr.atomTips.shell1Full, { key: 'tip-shell1' });
  }, [shell0, e, say]);

  // "Atomu kuruldu" koşulu
  const built = isBuiltAtom(p, n, e);
  useEffect(() => {
    if (built && !prevBuilt.current && !atom.randomLoaded) {
      emit({ type: 'atom:built', z: p, a: p + n });
      play('discover');
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 1600);
      say(tr.atom.built(getElement(p).nameTr), { mood: 'happy', key: `built-${p}` });
      if ([2, 10, 18, 36].includes(p)) setTimeout(() => say(tr.atomTips.nobleShell, { key: 'tip-noble-shell' }), 2500);
    }
    prevBuilt.current = built;
  }, [built, p, n, atom.randomLoaded, say]);

  // Yerleşme: 0,9 sn değişmeyen yapı kaydedilir (izotop, iyon, kararsız çekirdek)
  useEffect(() => {
    if (p === 0 || atom.randomLoaded) return;
    const t = setTimeout(() => {
      const save = useStore.getState().save;
      const sameZOther = save.isotopes.some((k) => k.startsWith(`${p}-`) && k !== `${p}-${a}`);
      const isNewIsotope = !save.isotopes.includes(`${p}-${a}`);
      emit({ type: 'atom:settled', p, n, e });
      if (unstable) {
        if (p === 1 && a === 3) say(tr.atomTips.h3, { key: 'tip-h3', mood: 'surprised' });
        else if (p === 6 && a === 14) say(tr.atomTips.c14, { key: 'tip-c14', mood: 'surprised' });
        else if (p === 19 && a === 40) say(tr.atomTips.k40, { key: 'tip-k40', mood: 'surprised' });
        else if (!save.tipsSeen['tip-first-unstable']) say(tr.atomTips.firstUnstable, { key: 'tip-first-unstable', mood: 'surprised' });
        else {
          const hint = neutronHint(p, a);
          if (hint) say(hint === 'more' ? tr.atomTips.moreNeutrons : tr.atomTips.lessNeutrons, { mood: 'thinking' });
        }
      } else if (e > 0 && e !== p) {
        say(tr.atomTips.firstIon, { key: 'tip-first-ion', mood: 'surprised' });
        if (hasNobleShell(shellsFor(p, e))) setTimeout(() => say(tr.atomTips.nobleShell, { key: 'tip-noble-shell' }), 2500);
      } else if (sameZOther && isNewIsotope && e === p) {
        say(tr.atomTips.secondIsotope, { key: 'tip-second-isotope' });
      }
    }, 900);
    return () => clearTimeout(t);
  }, [p, n, e, a, unstable, atom.randomLoaded, say]);

  // Klavye: P, N, E ekler; Shift ile çıkarır; R sıfırlar
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (isTyping(ev) || ev.ctrlKey || ev.metaKey || ev.altKey) return;
      const map: Record<string, ParticleType> = { KeyP: 'proton', KeyN: 'neutron', KeyE: 'electron' };
      const type = map[ev.code];
      if (type) {
        ev.preventDefault();
        change(type, ev.shiftKey ? -1 : 1);
      } else if (ev.code === 'KeyR') {
        ev.preventDefault();
        setAtom({ p: 0, n: 0, e: 0, randomLoaded: false });
        play('whoosh');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [change, setAtom]);

  const onStageDrop = useCallback(
    (payload: DragPayload) => {
      if (payload.kind !== 'particle' || payload.value.startsWith('remove:')) return;
      change(payload.value as ParticleType, 1);
    },
    [change],
  );
  const onBinsDrop = useCallback(
    (payload: DragPayload) => {
      if (payload.kind === 'particle' && payload.value.startsWith('remove:'))
        change(payload.value.slice(7) as ParticleType, -1);
    },
    [change],
  );
  useDropTarget('atom-stage', onStageDrop);
  useDropTarget('atom-bins', onBinsDrop);

  const onParticleDown = (type: ParticleType, ev: React.PointerEvent) => {
    beginDrag(ev, { kind: 'particle', value: `remove:${type}` }, <ParticleBall type={type} />, {
      onDropOutside: () => change(type, -1),
    });
  };

  const random = () => {
    const z = 1 + Math.floor(Math.random() * 36);
    prevBuilt.current = true; // rastgele yükleme kutlama/yıldız vermez
    setAtom({ p: z, n: commonMassNumber(z) - z, e: z, randomLoaded: true });
    play('sparkle');
  };

  const targetEl = target ? getElement(target) : null;
  const checks = target
    ? [
        { ok: p === target, label: tr.atom.targetProtons(target) },
        { ok: p > 0 && e === p, label: tr.atom.targetNeutral },
        { ok: stable, label: tr.atom.targetStable },
      ]
    : [];

  return (
    <div className="atom-page">
      <div className="atom-toolbar">
        <button className="btn" onClick={() => { setAtom({ p: 0, n: 0, e: 0, randomLoaded: false }); play('whoosh'); }}>
          🧹 {tr.atom.reset}
        </button>
        <button className="btn" onClick={random}>
          🎲 {tr.atom.random}
        </button>
        <span className="faint small atom-keys">{tr.atom.keys}</span>
      </div>

      <div
        className={`atom-stage ${stageOver ? 'drop-over' : ''}`}
        data-drop="atom-stage"
        data-tour="atom-stage"
        onContextMenu={(ev) => ev.preventDefault()}
      >
        <AtomView
          p={p}
          n={n}
          e={e}
          size={500}
          spin={!useStore.getState().save.settings.reducedMotion}
          unstable={unstable}
          celebrate={celebrate}
          onParticlePointerDown={onParticleDown}
          onParticleContextMenu={(type) => change(type, -1)}
          title={el?.nameTr ?? tr.atom.noElement}
        />
        {p === 0 && n === 0 && e === 0 && <div className="stage-empty">{tr.atom.dragHint}</div>}
      </div>

      <div className="atom-bins" data-drop="atom-bins" data-tour="bins">
        {TYPES.map((type) => (
          <div key={type} className={`bin bin-${type} ${shakeBin === type ? 'shake' : ''}`}>
            <button
              className="bin-source"
              onPointerDown={(ev) => beginDrag(ev, { kind: 'particle', value: type }, <ParticleBall type={type} />)}
              onClick={(ev) => {
                if (consumeDragClick()) return;
                change(type, ev.shiftKey ? 5 : 1);
              }}
              aria-label={`${tr.atom[type]} +1`}
            >
              <span className="bin-balls" aria-hidden>
                <ParticleBall type={type} size={30} />
                <ParticleBall type={type} size={30} />
                <ParticleBall type={type} size={30} />
              </span>
              <span className="bin-label">{tr.atom[type]}</span>
            </button>
            <div className="bin-counter">
              <button className="btn btn-sm" onClick={(ev) => change(type, ev.shiftKey ? -5 : -1)} aria-label={`${tr.atom[type]} −1`}>
                −
              </button>
              <span className="bin-count">{atom[KEY[type]]}</span>
              <button className="btn btn-sm" onClick={(ev) => change(type, ev.shiftKey ? 5 : 1)} aria-label={`${tr.atom[type]} +1`}>
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <aside className="atom-panel panel" data-tour="atom-panel">
        <div className={`atom-id ${built ? 'built' : ''}`}>
          {el ? (
            <>
              <div className="atom-id-sym">{el.symbol}</div>
              <div>
                <div className="atom-id-name">{el.nameTr}</div>
                <div className="dim">{tr.atom.isotope(el.nameTr, a)}</div>
              </div>
            </>
          ) : (
            <div className="dim">{tr.atom.noElement}</div>
          )}
        </div>
        <div className="atom-stat">
          <span>{tr.atom.massNumber}</span>
          <b>
            {p} + {n} = {a}
          </b>
        </div>
        <div className="atom-stat">
          <span>{tr.atom.charge}</span>
          <ChargeGauge p={p} e={e} />
        </div>
        <div className={`charge-label ${charge.kind}`}>
          {charge.kind === 'notr'
            ? `⚖️ ${tr.atom.neutral}`
            : charge.kind === 'arti'
              ? `➕ ${tr.atom.ionPlus(charge.amount)}`
              : `➖ ${tr.atom.ionMinus(charge.amount)}`}
        </div>
        {p > 0 && (
          <div className={`atom-stat nucleus-status ${stable ? 'ok' : 'bad'}`}>
            <span>{tr.atom.nucleus}</span>
            <b>{stable ? `😌 ${tr.atom.stable}` : `☢️ ${tr.atom.unstable}`}</b>
          </div>
        )}
        {shells.length > 0 && (
          <div className="atom-stat">
            <span>{tr.atom.shells}</span>
            <b>{shells.join(' · ')}</b>
          </div>
        )}
        {el && (
          <button className="btn" onClick={() => navigate(`/tablo?z=${el.z}`)}>
            🃏 {tr.atom.seeCard}
          </button>
        )}

        {targetEl && (
          <div className={`target-card ${checks.every((c) => c.ok) ? 'done' : ''}`}>
            <div className="target-title">🎯 {tr.atom.targetTitle(targetEl.nameTr)}</div>
            <ul>
              {checks.map((c) => (
                <li key={c.label} className={c.ok ? 'ok' : ''}>
                  {c.ok ? '✅' : '⬜'} {c.label}
                </li>
              ))}
            </ul>
            {showHint ? (
              <p className="quest-hint">💡 {tr.atom.targetHint(commonMassNumber(targetEl.z) - targetEl.z)}</p>
            ) : (
              <button className="btn btn-sm" onClick={() => setShowHint(true)}>
                💡 {tr.common.hint}
              </button>
            )}
            <button className="btn btn-ghost btn-sm" onClick={() => setAtom({ target: null })}>
              {tr.atom.exitTarget}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

/** Terazi benzeri yük göstergesi */
function ChargeGauge({ p, e }: { p: number; e: number }) {
  const c = p - e;
  const angle = Math.max(-30, Math.min(30, c * 6));
  return (
    <svg width="120" height="44" viewBox="0 0 120 44" aria-hidden>
      <rect x="57" y="18" width="6" height="24" rx="2" fill="#7f88c6" />
      <g transform={`rotate(${-angle} 60 18)`} style={{ transition: 'transform 300ms ease' }}>
        <rect x="10" y="15" width="100" height="5" rx="2.5" fill="#b4bbec" />
        <circle cx="16" cy="12" r="9" fill="#e03131" />
        <text x="16" y="16" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">
          {p}
        </text>
        <circle cx="104" cy="12" r="9" fill="#1c7ed6" />
        <text x="104" y="16" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">
          {e}
        </text>
      </g>
    </svg>
  );
}
