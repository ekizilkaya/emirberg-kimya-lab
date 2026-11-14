import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScaledRoot } from '../../app/ScaledRoot';
import logoUrl from '../../assets/emirberg-logo.webp';
import { play } from '../../audio/sound';
import { LIMITS } from '../../data/config';
import { getElement } from '../../data/elements';
import { FAMILIES } from '../../data/families';
import { tr } from '../../i18n/tr';
import { emit, useStore } from '../../state/store';
import { beginDrag, consumeDragClick, useDragOver, useDropTarget, type DragPayload } from '../../ui/drag';
import { AtomView } from '../atom-builder/AtomView';
import { Mol } from '../mascot/Mol';
import './onboarding.css';

type Step = 'hello' | 'zoom' | 'build' | 'card' | 'free';

const H = getElement(1);

/** Bardak → damla → moleküller → atom yakınlaşma sahneleri */
function ZoomScene({ level }: { level: number }) {
  return (
    <div className="zoom-scene">
      <svg viewBox="0 0 400 400" className={`zoom-layer ${level === 0 ? 'on' : level > 0 ? 'past' : ''}`}>
        <path d="M120 80 L280 80 L260 340 Q258 360 238 360 L162 360 Q142 360 140 340 Z" fill="rgba(200,220,255,.15)" stroke="#d0ebff" strokeWidth="6" />
        <path d="M130 170 L270 170 L260 340 Q258 352 238 352 L162 352 Q144 352 140 340 Z" fill="#4dabf7" opacity=".85" />
        <circle cx="200" cy="260" r="18" fill="none" stroke="#fff" strokeWidth="4" strokeDasharray="6 6" />
      </svg>
      <svg viewBox="0 0 400 400" className={`zoom-layer ${level === 1 ? 'on' : level > 1 ? 'past' : 'future'}`}>
        <path d="M200 60 C 260 150 300 200 300 260 A100 100 0 0 1 100 260 C100 200 140 150 200 60 Z" fill="#4dabf7" stroke="#a5d8ff" strokeWidth="6" />
        <ellipse cx="165" cy="230" rx="18" ry="30" fill="rgba(255,255,255,.45)" />
        <circle cx="210" cy="280" r="16" fill="none" stroke="#fff" strokeWidth="4" strokeDasharray="6 6" />
      </svg>
      <svg viewBox="0 0 400 400" className={`zoom-layer ${level === 2 ? 'on' : level > 2 ? 'past' : 'future'}`}>
        {[
          [110, 120, 0.2],
          [260, 100, -0.5],
          [190, 210, 0.9],
          [90, 290, -0.2],
          [300, 270, 0.4],
          [210, 330, -0.9],
        ].map(([x, y, rot], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${rot * 57})`} className="water-mol" style={{ animationDelay: `${i * 0.2}s` }}>
            <circle cx="-26" cy="18" r="14" fill="#f1f3f5" />
            <circle cx="26" cy="18" r="14" fill="#f1f3f5" />
            <circle r="24" fill="#ff6b6b" />
          </g>
        ))}
      </svg>
      <div className={`zoom-layer atom-layer ${level === 3 ? 'on' : 'future'}`}>
        <AtomView p={8} n={8} e={8} size={360} />
      </div>
    </div>
  );
}

export function Onboarding() {
  const [step, setStep] = useState<Step>('hello');
  const savedName = useStore((s) => s.save.profile.name);
  const updateSave = useStore((s) => s.updateSave);
  const setQuestPanel = useStore((s) => s.setQuestPanel);
  const navigate = useNavigate();
  const [name, setName] = useState(savedName || 'Emir');
  const [zoom, setZoom] = useState(0);
  const [p, setP] = useState(0);
  const [e, setE] = useState(0);
  const over = useDragOver('intro-stage');

  const saveName = useCallback(() => {
    const n = name.trim() || 'Emir';
    updateSave((s) => ({ ...s, profile: { ...s.profile, name: n } }));
  }, [name, updateSave]);

  const skip = () => {
    saveName();
    emit({ type: 'tutorial:skipped' });
    navigate('/tablo');
  };

  const zoomIn = useCallback(() => {
    setZoom((z) => {
      if (z >= 3) return z;
      play('whoosh');
      return z + 1;
    });
  }, []);

  const addParticle = useCallback(
    (type: string) => {
      if (type === 'proton' && p === 0) {
        setP(1);
        play('proton');
      } else if (type === 'electron' && p === 1 && e === 0) {
        setE(1);
        play('electron');
        setTimeout(() => play('discover'), 250);
      } else play('nope');
    },
    [p, e],
  );

  const onDrop = useCallback((payload: DragPayload) => addParticle(payload.value), [addParticle]);
  useDropTarget('intro-stage', onDrop);

  useEffect(() => {
    if (step === 'card') {
      emit({ type: 'element:viewed', z: 1 });
      emit({ type: 'atom:built', z: 1, a: 1 });
      play('card');
    }
  }, [step]);

  const finish = () => {
    emit({ type: 'tutorial:done' });
    navigate('/tablo');
    // Görev Panosu, tablonun ipucu turu bittiğinde açılır (bkz. Tour)
    if (useStore.getState().save.toursSeen.includes('tablo')) setTimeout(() => setQuestPanel(true), 2600);
  };

  const zoomText = zoom === 0 ? tr.onboarding.zoomIntro : tr.onboarding.zoomSteps[zoom - 1];
  const buildText = p === 0 ? tr.onboarding.buildIntro : e === 0 ? tr.onboarding.addElectron : tr.onboarding.hydrogen;

  return (
    <ScaledRoot>
      <div className="onboarding">
        <button className="btn btn-ghost onb-skip" onClick={skip}>
          {tr.common.skip} ⏭
        </button>

        {step === 'hello' && (
          <div className="onb-center pop-in">
            <div className="onb-hero">
              <img className="onb-poster" src={logoUrl} alt={tr.logoAlt} draggable={false} />
              <div className="onb-hero-mol">
                <Mol mood="happy" size={110} />
              </div>
            </div>
            <h1 className="onb-title">{tr.appName}</h1>
            <p className="onb-bubble">{tr.onboarding.hello}</p>
            <label className="onb-name">
              <span>{tr.onboarding.askName}</span>
              <input
                value={name}
                maxLength={LIMITS.nameMaxLength}
                onChange={(ev) => setName(ev.target.value)}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter') {
                    saveName();
                    setStep('zoom');
                  }
                }}
                autoFocus
              />
            </label>
            <button
              className="btn btn-primary btn-big"
              onClick={() => {
                saveName();
                play('click');
                setStep('zoom');
              }}
            >
              {tr.onboarding.start} 🚀
            </button>
          </div>
        )}

        {step === 'zoom' && (
          <div className="onb-split" onWheel={(ev) => ev.deltaY < 0 && zoomIn()}>
            <ZoomScene level={zoom} />
            <div className="onb-side">
              <Mol mood={zoom === 3 ? 'surprised' : 'neutral'} size={90} />
              <p className="onb-bubble">{zoomText}</p>
              {zoom < 3 ? (
                <button className="btn btn-primary btn-big" onClick={zoomIn} autoFocus>
                  🔍 {tr.onboarding.zoom}
                </button>
              ) : (
                <button className="btn btn-green btn-big" onClick={() => setStep('build')} autoFocus>
                  {tr.common.next} ➜
                </button>
              )}
              <div className="zoom-dots">
                {[0, 1, 2, 3].map((i) => (
                  <i key={i} className={i <= zoom ? 'on' : ''} />
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'build' && (
          <div className="onb-split">
            <div className={`onb-stage ${over ? 'drop-over' : ''}`} data-drop="intro-stage">
              <AtomView p={p} n={0} e={e} size={380} celebrate={e === 1} title={p ? H.nameTr : ''} />
              {p > 0 && <div className="onb-elname pop-in">{e === 1 ? `${H.nameTr}!` : H.nameTr}</div>}
            </div>
            <div className="onb-side">
              <Mol mood={e === 1 ? 'happy' : 'thinking'} size={90} />
              <p className="onb-bubble">{buildText}</p>
              <div className="onb-bins">
                <button
                  className={`onb-bin ${p === 0 ? 'pulse' : ''}`}
                  onPointerDown={(ev) => beginDrag(ev, { kind: 'particle', value: 'proton' }, <span className="pball pball-proton onb-ball">+</span>)}
                  onClick={() => !consumeDragClick() && addParticle('proton')}
                  disabled={p > 0}
                >
                  <span className="pball pball-proton onb-ball">+</span>
                  {tr.atom.proton}
                </button>
                <button
                  className={`onb-bin ${p === 1 && e === 0 ? 'pulse' : ''}`}
                  onPointerDown={(ev) => beginDrag(ev, { kind: 'particle', value: 'electron' }, <span className="pball pball-electron onb-ball">−</span>)}
                  onClick={() => !consumeDragClick() && addParticle('electron')}
                  disabled={p === 0 || e > 0}
                >
                  <span className="pball pball-electron onb-ball">−</span>
                  {tr.atom.electron}
                </button>
              </div>
              {e === 1 && (
                <button className="btn btn-green btn-big pop-in" onClick={() => setStep('card')} autoFocus>
                  {tr.common.next} ➜
                </button>
              )}
            </div>
          </div>
        )}

        {step === 'card' && (
          <div className="onb-center">
            <div className="fly-wrap">
              <div className="mini-table-outline" aria-hidden>
                {Array.from({ length: 18 * 7 }, (_, i) => (
                  <i key={i} className={i === 0 ? 'target' : ''} />
                ))}
              </div>
              <div className="fly-card" style={{ background: FAMILIES[H.family].color }}>
                <span className="fly-z">{H.z}</span>
                <span className="fly-sym">{H.symbol}</span>
                <span className="fly-name">{H.nameTr}</span>
              </div>
            </div>
            <p className="onb-bubble">{tr.onboarding.cardFly}</p>
            <button className="btn btn-green btn-big" onClick={() => setStep('free')} autoFocus>
              {tr.common.next} ➜
            </button>
          </div>
        )}

        {step === 'free' && (
          <div className="onb-center pop-in">
            <Mol mood="happy" size={160} />
            <p className="onb-bubble big">{tr.onboarding.free(name.trim() || 'Emir')}</p>
            <button className="btn btn-primary btn-big" onClick={finish} autoFocus>
              🧪 {tr.onboarding.goLab}
            </button>
          </div>
        )}
      </div>
    </ScaledRoot>
  );
}
