import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { play, type SoundName } from '../../audio/sound';
import { KP } from '../../data/config';
import { getMolecule } from '../../data/molecules';
import type { Effect, ReactionEntry, Tool } from '../../data/reactions';
import { SUBSTANCES, getSubstance, type Shelf, type Substance } from '../../data/substances';
import { findReaction } from '../../domain/reactions';
import { tr } from '../../i18n/tr';
import { emit, useStore } from '../../state/store';
import { beginDrag, consumeDragClick, useDragOver, useDropTarget, type DragPayload } from '../../ui/drag';
import { CH, CW, CauldronRenderer, effectDuration } from './effects';
import './cauldron.css';

const SHELVES: Shelf[] = ['element', 'mutfak', 'laboratuvar'];
const TOOLS: Tool[] = ['ates', 'elektrik', 'zaman'];

const EFFECT_SOUND: Partial<Record<Effect['type'], SoundName>> = {
  kabarcik: 'bubble',
  'kopuk-tasma': 'fizz',
  alev: 'whoosh',
  'renk-degisimi': 'sparkle',
  'parlak-isik': 'sparkle',
  sis: 'whoosh',
  fiskiye: 'fizz',
  kivilcim: 'sparkle',
  'zaman-kaplama': 'tick',
  cozunme: 'bubble',
  katman: 'bubble',
  'suda-kayan-metal': 'fizz',
  buhar: 'fizz',
  'hicbir-sey': 'tick',
};

function SubstanceIcon({ s, size = 40 }: { s: Substance; size?: number }) {
  if (s.symbol && s.shelf === 'element' && s.look.form !== 'gaz') {
    return (
      <span className="sub-sym" style={{ width: size, height: size, background: s.look.color, fontSize: size * 0.38 }}>
        {s.symbol}
      </span>
    );
  }
  return (
    <span className="sub-icon" style={{ width: size, height: size, fontSize: size * 0.62 }}>
      {s.icon}
      {s.look.form === 'gaz' && s.symbol && <span className="sub-gas-label">{s.symbol}</span>}
    </span>
  );
}

type Phase = 'idle' | 'running' | 'result';

export default function ReactionCauldron() {
  const { inputs, tool, autoMix } = useStore((s) => s.cauldron);
  const setCauldron = useStore((s) => s.setCauldron);
  const say = useStore((s) => s.say);
  const reduced = useStore((s) => s.save.settings.reducedMotion);
  const navigate = useNavigate();
  const [shelf, setShelf] = useState<Shelf>('element');
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<{ r: ReactionEntry; isNew: boolean } | null>(null);
  const [showMore, setShowMore] = useState(false);
  const [shake, setShake] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<CauldronRenderer | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const over = useDragOver('cauldron');

  // Çizim döngüsü
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CW * dpr;
    canvas.height = CH * dpr;
    ctx.scale(dpr, dpr);
    const r = new CauldronRenderer(ctx);
    r.onShake = () => {
      setShake(true);
      setTimeout(() => setShake(false), 350);
    };
    renderer.current = r;
    let raf = 0;
    const loop = (now: number) => {
      r.draw(now);
      raf = requestAnimationFrame(loop);
    };
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVis);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    renderer.current?.setScene({ inputs: inputs.map(getSubstance), tool, reduced });
  }, [inputs, tool, reduced]);

  const addInput = useCallback(
    (id: string) => {
      if (phase === 'running') return;
      const cur = useStore.getState().cauldron.inputs;
      if (phase === 'result') {
        setResult(null);
        setPhase('idle');
        renderer.current?.stop();
        setCauldron({ inputs: [id] });
        play('click');
        return;
      }
      if (cur.includes(id)) return;
      if (cur.length >= 2) {
        say(tr.cauldron.tooMany, { mood: 'surprised' });
        play('nope');
        return;
      }
      setCauldron({ inputs: [...cur, id] });
      play('click');
    },
    [phase, setCauldron, say],
  );

  const onDrop = useCallback(
    (payload: DragPayload) => {
      if (payload.kind === 'substance') addInput(payload.value);
    },
    [addInput],
  );
  useDropTarget('cauldron', onDrop);

  const empty = () => {
    if (phase === 'running') return;
    setResult(null);
    setPhase('idle');
    renderer.current?.stop();
    setCauldron({ inputs: [] });
    play('whoosh');
  };

  const mix = useCallback(() => {
    const st = useStore.getState().cauldron;
    if (st.inputs.length === 0 || !renderer.current) return;
    const r = findReaction(st.inputs, st.tool);
    setResult(null);
    setShowMore(false);
    setPhase('running');
    renderer.current.setScene({ inputs: st.inputs.map(getSubstance), tool: st.tool, reduced });
    const effects: Effect[] = r ? r.effects : [{ type: 'hicbir-sey' }];
    const duration = r ? effectDuration(effects) : 1500;
    renderer.current.start({ effects, started: performance.now(), duration });
    for (const e of effects) {
      if (e.type === 'patlama') play((e.params?.size ?? 1) === 1 ? 'pop' : 'boom');
      else {
        const s = EFFECT_SOUND[e.type];
        if (s) play(s);
      }
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (r) {
        const isNew = !useStore.getState().save.reactions[r.id];
        emit({ type: 'reaction:found', id: r.id });
        setResult({ r, isNew });
        setPhase('result');
        if (isNew) play('discover');
      } else {
        setPhase('idle');
        say(tr.cauldron.nothing, { mood: 'thinking' });
      }
    }, duration);
  }, [reduced, say]);

  // "Tekrar izle": defterden gelindiğinde otomatik karıştır (autoMix > 0 bekleyen istek demektir)
  useEffect(() => {
    if (autoMix > 0) {
      setCauldron({ autoMix: 0 });
      setResult(null);
      setPhase('idle');
      const t = setTimeout(mix, 450);
      return () => clearTimeout(t);
    }
  }, [autoMix, mix, setCauldron]);

  const items = SUBSTANCES.filter((s) => s.shelf === shelf);

  return (
    <div className="cauldron-page">
      <aside className="shelf panel" data-tour="shelf">
        <div className="tabs shelf-tabs">
          {SHELVES.map((s) => (
            <button key={s} className={`tab ${shelf === s ? 'active' : ''}`} onClick={() => setShelf(s)}>
              {tr.cauldron.shelves[s]}
            </button>
          ))}
        </div>
        <div className="shelf-items">
          {items.map((s) => (
            <button
              key={s.id}
              className={`shelf-item ${inputs.includes(s.id) ? 'in' : ''}`}
              onPointerDown={(e) => beginDrag(e, { kind: 'substance', value: s.id }, <SubstanceIcon s={s} size={52} />)}
              onClick={() => {
                if (consumeDragClick()) return;
                addInput(s.id);
              }}
              disabled={phase === 'running'}
            >
              <SubstanceIcon s={s} />
              <span className="shelf-name">{s.nameTr}</span>
            </button>
          ))}
        </div>
      </aside>

      <div className="cauldron-center">
        <div className="cauldron-inputs">
          {inputs.length === 0 ? (
            <span className="dim">{tr.cauldron.dropHere}</span>
          ) : (
            inputs.map((id, i) => {
              const s = getSubstance(id);
              return (
                <span key={id} className="input-chip">
                  {i > 0 && <b className="plus">+</b>}
                  <SubstanceIcon s={s} size={30} /> {s.nameTr}
                  {phase !== 'running' && (
                    <button
                      className="chip-x"
                      onClick={() => {
                        setResult(null);
                        setPhase('idle');
                        setCauldron({ inputs: inputs.filter((x) => x !== id) });
                      }}
                      aria-label={tr.common.close}
                    >
                      ✕
                    </button>
                  )}
                </span>
              );
            })
          )}
          {tool && (
            <span className="input-chip tool-chip">
              <b className="plus">+</b> {tr.cauldron.toolIcons[tool]} {tr.cauldron.tools[tool]}
            </span>
          )}
        </div>
        <div className={`cauldron-stage ${over ? 'drop-over' : ''} ${shake ? 'shake' : ''}`} data-drop="cauldron">
          <canvas ref={canvasRef} style={{ width: CW, height: CH }} className="cauldron-canvas" />
        </div>
        <div className="cauldron-actions">
          <div className="tools" data-tour="tools" role="group" aria-label={tr.cauldron.selectTool}>
            <span className="dim small">{tr.cauldron.selectTool}:</span>
            {TOOLS.map((tl) => (
              <button
                key={tl}
                className={`btn ${tool === tl ? 'active' : ''}`}
                aria-pressed={tool === tl}
                disabled={phase === 'running'}
                onClick={() => {
                  setCauldron({ tool: tool === tl ? null : tl });
                  if (phase === 'result') {
                    setResult(null);
                    setPhase('idle');
                  }
                  play('click');
                }}
              >
                {tr.cauldron.toolIcons[tl]} {tr.cauldron.tools[tl]}
              </button>
            ))}
          </div>
          <button className="btn" onClick={empty} disabled={phase === 'running' || inputs.length === 0}>
            🫗 {tr.cauldron.empty}
          </button>
          <button
            className="btn btn-green btn-big mix-btn"
            data-tour="mix"
            onClick={mix}
            disabled={phase === 'running' || inputs.length === 0}
          >
            🥄 {tr.cauldron.mix}
          </button>
        </div>
      </div>

      <aside className="result-col">
        {result ? (
          <div className={`result-card panel ${result.isNew ? 'new' : ''}`}>
            <h2>{result.r.titleTr}</h2>
            <span className={`kind-badge kind-${result.r.kind}`}>{tr.cauldron.kinds[result.r.kind]}</span>
            <p className="dim small">{tr.cauldron.kindDesc[result.r.kind]}</p>
            <div className="result-section">
              <div className="card-section-title">{tr.cauldron.whatHappened}</div>
              <p>{result.r.explainTr}</p>
            </div>
            {result.r.wordEquationTr && (
              <div className="result-section">
                <div className="card-section-title">{tr.cauldron.products}</div>
                <p>{result.r.wordEquationTr}</p>
                {result.r.symbolEquation &&
                  (showMore ? (
                    <p className="equation">
                      {tr.cauldron.symbolEq}: {result.r.symbolEquation}
                    </p>
                  ) : (
                    <button className="btn btn-ghost btn-sm" onClick={() => setShowMore(true)}>
                      {tr.common.more} ▾
                    </button>
                  ))}
                {result.r.productMoleculeIds && (
                  <div className="link-chips">
                    {result.r.productMoleculeIds.map((id) => {
                      const m = getMolecule(id);
                      return m ? (
                        <button key={id} className="chip link-chip" onClick={() => navigate(`/molekul?tarif=${id}`)}>
                          🧪 {m.formulaDisplay} {m.nameTr}
                        </button>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            )}
            {result.r.safety !== 'notr' && (
              <div className={`safety safety-${result.r.safety}`}>
                <b>{tr.cauldron.safety[result.r.safety]}</b>
                <p>
                  {tr.cauldron.safetyDesc[result.r.safety]} {result.r.safety === 'evde' && result.r.homeMaterialsTr}
                </p>
              </div>
            )}
            {result.isNew && (
              <p className="new-note">
                📒 {tr.cauldron.addedToNotebook} · {tr.quests.reward(KP.reaction)}
              </p>
            )}
          </div>
        ) : (
          <div className="result-placeholder panel">
            <div className="big-emoji">⚗️</div>
            <p className="dim">{tr.mascot.workshopHello.kazan}</p>
          </div>
        )}
      </aside>
    </div>
  );
}
