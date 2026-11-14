import { createPortal } from 'react-dom';
import { BADGES } from '../../data/badges';
import { ELEMENTS } from '../../data/elements';
import { MOLECULES } from '../../data/molecules';
import { QUESTS } from '../../data/quests';
import { REACTIONS } from '../../data/reactions';
import { kpOf, nextRank, rankOf, totalStars } from '../../domain/scoring';
import type { SaveData } from '../../domain/types';
import { tr } from '../../i18n/tr';
import { useStore } from '../../state/store';
import { Mol } from '../mascot/Mol';
import './notebook.css';

function maxTotalStars(): number {
  return ELEMENTS.reduce((s, e) => s + (e.z <= 36 ? 3 : 1), 0);
}

function Certificate({ save }: { save: SaveData }) {
  const kp = kpOf(save);
  const rank = rankOf(kp);
  const isTop = rank.id === 'bas-kimyager';
  const date = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const stats = [
    { label: tr.notebook.stats.stars, value: `${totalStars(save)}/${maxTotalStars()}` },
    { label: tr.notebook.stats.molecules, value: `${Object.keys(save.molecules).length}/${MOLECULES.length}` },
    { label: tr.notebook.stats.reactions, value: `${Object.keys(save.reactions).length}/${REACTIONS.length}` },
    { label: tr.notebook.stats.badges, value: `${Object.keys(save.badges).length}/${BADGES.length}` },
    { label: tr.notebook.stats.quests, value: `${Object.keys(save.quests.done).length}/${QUESTS.length}` },
    { label: tr.notebook.stats.kp, value: String(kp) },
  ];
  return (
    <div className={`certificate ${isTop ? 'top' : ''}`}>
      <div className="cert-inner">
        <div className="cert-mol">
          <Mol mood="happy" size={70} />
        </div>
        <div className="cert-kicker">{tr.appName}</div>
        <h1 className="cert-title">{isTop ? tr.notebook.diplomaTitle : tr.notebook.certificateTitle}</h1>
        <div className="cert-rank">
          {rank.icon} {isTop ? tr.notebook.bas : rank.nameTr}
        </div>
        <p className="cert-text">{tr.notebook.diplomaText(save.profile.name, rank.nameTr)}</p>
        <div className="cert-stats">
          {stats.map((s) => (
            <div key={s.label}>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <div className="cert-date">
          {tr.notebook.date}: {date}
        </div>
      </div>
    </div>
  );
}

export function Diploma() {
  const save = useStore((s) => s.save);
  const kp = kpOf(save);
  const nr = nextRank(kp);
  return (
    <div className="diploma-tab">
      <Certificate save={save} />
      <div className="diploma-actions">
        <p className="dim">{nr ? tr.notebook.nextRank(nr.nameTr, nr.minKp - kp) : tr.notebook.maxRank}</p>
        <button className="btn btn-primary" onClick={() => window.print()}>
          🖨️ {tr.notebook.print}
        </button>
      </div>
    </div>
  );
}

/** Yalnız yazdırırken görünen diploma (SPEC 11.5) */
export function DiplomaPrint() {
  const save = useStore((s) => s.save);
  return createPortal(
    <div className="print-only">
      <Certificate save={save} />
    </div>,
    document.body,
  );
}
