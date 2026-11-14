import { useEffect, useRef, useState } from 'react';
import { LIMITS } from '../../data/config';
import { tr } from '../../i18n/tr';
import { exportSave, importSaveFile } from '../../state/persistence';
import { resetAllProgress, useStore } from '../../state/store';
import { Modal } from '../../ui/Modal';
import './settings.css';

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="setting-row">
      <span>{label}</span>
      <button
        role="switch"
        aria-checked={value}
        className={`switch ${value ? 'on' : ''}`}
        onClick={() => onChange(!value)}
      >
        <span className="switch-knob" />
        <span className="sr-only">{value ? tr.settings.on : tr.settings.off}</span>
      </button>
    </label>
  );
}

/** Basılı tutunca açılan Büyükler Köşesi (SPEC 14.5) */
function HoldButton({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const timer = useRef<number | null>(null);
  const start = () => {
    const t0 = Date.now();
    const tick = () => {
      const p = Math.min(1, (Date.now() - t0) / 3000);
      setProgress(p);
      if (p >= 1) {
        onDone();
        timer.current = null;
        return;
      }
      timer.current = requestAnimationFrame(tick);
    };
    timer.current = requestAnimationFrame(tick);
  };
  const stop = () => {
    if (timer.current) cancelAnimationFrame(timer.current);
    timer.current = null;
    setProgress(0);
  };
  useEffect(() => stop, []);
  return (
    <button
      className="btn hold-btn"
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && !e.repeat && start()}
      onKeyUp={stop}
    >
      <span className="hold-fill" style={{ width: `${progress * 100}%` }} />
      <span className="hold-label">
        👪 {tr.settings.grownups} <span className="faint small">· {tr.settings.grownupsHold}</span>
      </span>
    </button>
  );
}

function GrownupsCorner() {
  const save = useStore((s) => s.save);
  const updateSave = useStore((s) => s.updateSave);
  const replaceSave = useStore((s) => s.replaceSave);
  const [name, setName] = useState(save.profile.name);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmStep, setConfirmStep] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="grownups">
      <label className="setting-row">
        <span>{tr.settings.changeName}</span>
        <span className="name-edit">
          <input
            value={name}
            maxLength={LIMITS.nameMaxLength}
            onChange={(e) => setName(e.target.value)}
            className="text-input"
          />
          <button
            className="btn btn-sm"
            disabled={!name.trim()}
            onClick={() => updateSave((s) => ({ ...s, profile: { ...s.profile, name: name.trim() } }))}
          >
            {tr.settings.saveName}
          </button>
        </span>
      </label>
      <div className="grownup-actions">
        <button className="btn" onClick={() => exportSave(save)}>
          💾 {tr.settings.exportSave}
        </button>
        <button className="btn" onClick={() => fileRef.current?.click()}>
          📂 {tr.settings.importSave}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = '';
            if (!f) return;
            try {
              const loaded = await importSaveFile(f);
              replaceSave(loaded);
              setName(loaded.profile.name);
              setMessage(tr.settings.importOk);
            } catch {
              setMessage(tr.settings.importFail);
            }
          }}
        />
      </div>
      {confirmStep === 0 && (
        <button className="btn danger-btn" onClick={() => setConfirmStep(1)}>
          🗑️ {tr.settings.resetSave}
        </button>
      )}
      {confirmStep > 0 && (
        <div className="confirm-box">
          <p>{confirmStep === 1 ? tr.settings.resetConfirm1 : tr.settings.resetConfirm2}</p>
          <div className="grownup-actions">
            <button className="btn" onClick={() => setConfirmStep(0)}>
              {tr.common.cancel}
            </button>
            <button
              className="btn danger-btn"
              onClick={() => {
                if (confirmStep === 1) setConfirmStep(2);
                else {
                  resetAllProgress(save.profile.name);
                  setConfirmStep(0);
                  setMessage(tr.settings.resetDone);
                }
              }}
            >
              {tr.common.yes}
            </button>
          </div>
        </div>
      )}
      {message && <p className="setting-msg">{message}</p>}
    </div>
  );
}

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const settings = useStore((s) => s.save.settings);
  const updateSave = useStore((s) => s.updateSave);
  const corrupt = useStore((s) => s.corruptRecovered);
  const [grownups, setGrownups] = useState(false);
  const [toursMsg, setToursMsg] = useState(false);
  const [fs, setFs] = useState(!!document.fullscreenElement);

  const setSetting = <K extends keyof typeof settings>(k: K, v: (typeof settings)[K]) =>
    updateSave((s) => ({ ...s, settings: { ...s.settings, [k]: v } }));

  useEffect(() => {
    const onFs = () => setFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  return (
    <Modal title={`⚙️ ${tr.settings.title}`} onClose={onClose} width={560}>
      <div className="settings">
        {corrupt && <p className="setting-msg warn">{tr.settings.corrupt}</p>}
        <Toggle label={`🔊 ${tr.settings.sound}`} value={settings.sound} onChange={(v) => setSetting('sound', v)} />
        <label className="setting-row">
          <span>🎚️ {tr.settings.volume}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={settings.volume}
            onChange={(e) => setSetting('volume', Number(e.target.value))}
            disabled={!settings.sound}
          />
        </label>
        <Toggle
          label={`🐢 ${tr.settings.reducedMotion}`}
          value={settings.reducedMotion}
          onChange={(v) => setSetting('reducedMotion', v)}
        />
        <Toggle
          label={`🤫 ${tr.settings.mascotQuiet}`}
          value={settings.mascotQuiet}
          onChange={(v) => setSetting('mascotQuiet', v)}
        />
        <div className="grownup-actions">
          <button
            className="btn"
            onClick={() => {
              if (document.fullscreenElement) void document.exitFullscreen();
              else void document.documentElement.requestFullscreen?.();
            }}
          >
            ⛶ {fs ? tr.settings.exitFullscreen : tr.settings.fullscreen}
          </button>
          <button
            className="btn"
            onClick={() => {
              updateSave((s) => ({ ...s, toursSeen: [] }));
              setToursMsg(true);
            }}
          >
            🧭 {tr.settings.replayTours}
          </button>
          <button
            className="btn"
            onClick={() => {
              updateSave((s) => ({ ...s, tutorial: 'none' }));
              onClose();
            }}
          >
            🎬 {tr.settings.replayIntro}
          </button>
        </div>
        {toursMsg && <p className="setting-msg">{tr.settings.toursReset}</p>}
        <hr className="sep" />
        {grownups ? <GrownupsCorner /> : <HoldButton onDone={() => setGrownups(true)} />}
      </div>
    </Modal>
  );
}
