import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { play } from '../../audio/sound';
import { ELEMENTS, getElement, type Phase } from '../../data/elements';
import { FAMILIES } from '../../data/families';
import { phaseAt, phaseSteps, tempToPosition, transitionWord } from '../../domain/phase';
import { formatTemp } from '../../domain/text';
import { tr } from '../../i18n/tr';
import { emit, useStore } from '../../state/store';
import { PHASE_COLORS } from '../periodic-table/lenses';
import { ParticleBox } from './ParticleBox';
import { TempSlider } from './TempSlider';
import './temp.css';

const PHASES: Phase[] = ['kati', 'sivi', 'gaz', 'bilinmiyor'];

function useMiniCell(ref: React.RefObject<HTMLDivElement | null>) {
  const [cell, setCell] = useState(40);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const byW = (el.clientWidth - 17 * 2) / 18;
      const byH = (el.clientHeight - 8 - 9 * 2) / 9.3;
      setCell(Math.max(26, Math.floor(Math.min(byW, byH))));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return cell;
}

export default function TemperatureRoom() {
  const { T, pinned } = useStore((s) => s.temp);
  const setTemp = useStore((s) => s.setTemp);
  const say = useStore((s) => s.say);
  const reduced = useStore((s) => s.save.settings.reducedMotion);
  const [params, setParams] = useSearchParams();
  const [word, setWord] = useState<{ text: string; n: number } | null>(null);
  const prev = useRef<{ z: number | null; phase: Phase | null }>({ z: null, phase: null });
  const wrapRef = useRef<HTMLDivElement>(null);
  const cell = useMiniCell(wrapRef);

  useEffect(() => {
    const z = params.get('z');
    if (z) {
      setTemp({ pinned: Number(z) });
      setParams({}, { replace: true });
    }
  }, [params, setParams, setTemp]);

  const counts = useMemo(() => {
    const c: Record<Phase, number> = { kati: 0, sivi: 0, gaz: 0, bilinmiyor: 0 };
    for (const el of ELEMENTS) c[phaseAt(el, T)]++;
    return c;
  }, [T]);

  const changeTemp = useCallback(
    (t: number) => {
      setTemp({ T: t });
      const s = useStore.getState().save;
      const pz = useStore.getState().temp.pinned;
      const pr = pz ? s.pinnedTemps[pz] : undefined;
      const newGlobal = s.tempMin === null || t < s.tempMin || s.tempMax === null || t > s.tempMax;
      const newPinned = !!pz && (!pr || t < pr.min || t > pr.max);
      if (newGlobal || newPinned) emit({ type: 'temp:set', celsius: t, pinnedZ: pz ?? undefined });
    },
    [setTemp],
  );

  // Sabitlenen elementin hâl değişimi
  const pinnedEl = pinned ? getElement(pinned) : null;
  const pinnedPhase = pinnedEl ? phaseAt(pinnedEl, T) : null;
  useEffect(() => {
    if (!pinnedEl || !pinnedPhase) {
      prev.current = { z: null, phase: null };
      return;
    }
    const p = prev.current;
    if (p.z === pinnedEl.z && p.phase && p.phase !== pinnedPhase) {
      const steps = phaseSteps(pinnedEl, p.phase, pinnedPhase);
      for (const [from, to] of steps) emit({ type: 'temp:phaseChange', z: pinnedEl.z, from, to });
      const last = steps[steps.length - 1];
      if (last) {
        const w = transitionWord(last[0], last[1]);
        if (w) setWord({ text: tr.temp.words[w], n: Date.now() });
        play('phase');
        if (pinnedEl.sublimes) say(tr.temp.sublimes, { key: 'tip-sublimes', mood: 'surprised' });
      }
    }
    prev.current = { z: pinnedEl.z, phase: pinnedPhase };
    if (pinnedEl.z === 2 && T <= -272) say(tr.temp.helium, { key: 'tip-helium', mood: 'surprised' });
  }, [pinnedEl, pinnedPhase, T, say]);

  useEffect(() => {
    if (!word) return;
    const t = setTimeout(() => setWord(null), 1500);
    return () => clearTimeout(t);
  }, [word]);

  const pin = (z: number) => {
    setTemp({ pinned: z });
    play('click');
    // Sabitleme anında sıcaklık kaydı da güncellensin (İnatçı Helyum görevi için)
    const s = useStore.getState().save;
    const pr = s.pinnedTemps[z];
    if (!pr || T < pr.min || T > pr.max) emit({ type: 'temp:set', celsius: T, pinnedZ: z });
  };

  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: `repeat(18, ${cell}px)`,
    gridTemplateRows: `repeat(7, ${cell}px) 8px repeat(2, ${cell}px)`,
    gap: 2,
  };

  return (
    <div className="temp-page">
      <div className="temp-main">
        <div className="mini-wrap" ref={wrapRef}>
          <div className="mini-table" style={gridStyle}>
            {ELEMENTS.map((el) => {
              const ph = phaseAt(el, T);
              return (
                <button
                  key={el.z}
                  className={`mini-cell ph-${ph} ${pinned === el.z ? 'pinned' : ''}`}
                  style={{ gridColumn: el.tableX, gridRow: el.tableY, background: PHASE_COLORS[ph], fontSize: cell * 0.38 }}
                  onClick={() => pin(el.z)}
                  title={`${el.nameTr}: ${tr.phase[ph]}`}
                  aria-label={`${el.nameTr}: ${tr.phase[ph]}`}
                >
                  {el.symbol}
                  <span className="mini-icon" aria-hidden>
                    {tr.phaseIcon[ph]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="particle-panel panel" data-tour="particle-box">
          {pinnedEl && pinnedPhase ? (
            <>
              <div className="pp-head">
                <span className="pp-sym" style={{ background: FAMILIES[pinnedEl.family].color }}>
                  {pinnedEl.symbol}
                </span>
                <div>
                  <h3>{pinnedEl.nameTr}</h3>
                  <span className="chip">
                    {tr.phaseIcon[pinnedPhase]} {tr.phase[pinnedPhase]}
                  </span>
                </div>
              </div>
              <div className="pp-box">
                <ParticleBox el={pinnedEl} phase={pinnedPhase} T={T} reduced={reduced} />
                {word && (
                  <div key={word.n} className="phase-word">
                    {word.text}
                  </div>
                )}
              </div>
              <PhaseScale el={pinnedEl} T={T} />
            </>
          ) : (
            <p className="dim pp-empty">👆 {tr.temp.pickElement}</p>
          )}
        </aside>
      </div>

      <div className="temp-controls panel">
        <div className="temp-now">
          <span className="temp-big">{formatTemp(T)}</span>
          <div className="temp-counts">
            {PHASES.map((p) => (
              <span key={p} className="chip">
                <i className="dot" style={{ background: PHASE_COLORS[p] }} /> {tr.phase[p]}: {counts[p]}
              </span>
            ))}
          </div>
        </div>
        <div data-tour="temp-slider">
          <TempSlider value={T} onChange={changeTemp} />
        </div>
        <div className="presets" data-tour="presets">
          {tr.temp.presets.map((p) => (
            <button
              key={p.label}
              className={`btn btn-sm ${T === p.t ? 'active' : ''}`}
              onClick={() => {
                changeTemp(p.t);
                play('click');
              }}
            >
              {p.label} <span className="faint">{formatTemp(p.t)}</span>
            </button>
          ))}
          <span className="faint small">{tr.temp.keys}</span>
        </div>
      </div>
    </div>
  );
}

/** Erime ve kaynama noktalarını gösteren küçük çizgi */
function PhaseScale({ el, T }: { el: ReturnType<typeof getElement>; T: number }) {
  if (el.meltC === null && el.boilC === null) return <p className="dim small">{tr.temp.noData}</p>;
  const marks: { label: string; t: number }[] = [];
  if (el.sublimes && el.boilC !== null) marks.push({ label: tr.temp.sublime, t: el.boilC });
  else {
    if (el.meltC !== null) marks.push({ label: tr.temp.melt, t: el.meltC });
    if (el.boilC !== null) marks.push({ label: tr.temp.boil, t: el.boilC });
  }
  return (
    <div className="phase-scale">
      <div className="ps-line">
        {marks.map((m) => (
          <span key={m.label} className="ps-mark" style={{ left: `${tempToPosition(m.t) * 100}%` }} />
        ))}
        <span className="ps-now" style={{ left: `${tempToPosition(T) * 100}%` }} />
      </div>
      <div className="ps-labels">
        {marks.map((m) => (
          <span key={m.label}>
            {m.label}: <b>{formatTemp(m.t)}</b>
          </span>
        ))}
      </div>
    </div>
  );
}
