import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { play } from '../../audio/sound';
import { QUESTS, getQuest } from '../../data/quests';
import { questReward } from '../../domain/scoring';
import { tr } from '../../i18n/tr';
import { useStore } from '../../state/store';
import './quests.css';

const WORKSHOP_ICON: Record<string, string> = {
  tablo: '🧮',
  atom: '⚛️',
  molekul: '🔗',
  kazan: '⚗️',
  sicaklik: '🌡️',
  defter: '📒',
};

export function QuestPanel({ onClose }: { onClose: () => void }) {
  const save = useStore((s) => s.save);
  const swap = useStore((s) => s.swapQuest);
  const navigate = useNavigate();
  const [hints, setHints] = useState<Record<string, boolean>>({});
  const doneCount = Object.keys(save.quests.done).length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <aside className="quest-panel panel" aria-label={tr.quests.title}>
      <div className="quest-head">
        <div className="quest-head-text">
          <h2>🎯 {tr.quests.title}</h2>
          <span className="dim small">{tr.quests.progress(doneCount, QUESTS.length)}</span>
        </div>
        <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label={tr.common.close}>
          ✕
        </button>
      </div>
      {save.quests.active.length === 0 && <p className="dim">{tr.quests.allDone}</p>}
      <div className="quest-list">
        {save.quests.active.map((id) => {
          const q = getQuest(id);
          if (!q) return null;
          const done = !!save.quests.done[id];
          const kp = questReward(q.tier);
          return (
            <div key={id} className={`quest-card ${done ? 'done' : ''} tier-${q.tier}`}>
              <div className="quest-card-top">
                <span className="quest-ws" aria-hidden>
                  {WORKSHOP_ICON[q.workshop]}
                </span>
                <h3>{q.titleTr}</h3>
                <span className="chip">{tr.quests.tiers[q.tier]}</span>
              </div>
              <p>{q.questionTr}</p>
              {hints[id] && !done && <p className="quest-hint">💡 {q.hintTr}</p>}
              {done ? (
                <div className="quest-actions">
                  <span className="quest-done">
                    ✅ {tr.quests.done} {tr.quests.reward(kp)}
                  </span>
                  <button className="btn btn-green btn-sm" onClick={() => swap(id)}>
                    {tr.quests.newQuest}
                  </button>
                </div>
              ) : (
                <div className="quest-actions">
                  <span className="kp small">{tr.quests.reward(kp)}</span>
                  <button className="btn btn-sm" onClick={() => setHints((h) => ({ ...h, [id]: !h[id] }))}>
                    💡 {tr.common.hint}
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      play('click');
                      navigate(q.link);
                      onClose();
                    }}
                  >
                    {tr.quests.goThere}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => swap(id)} title={tr.quests.another}>
                    🔄
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
