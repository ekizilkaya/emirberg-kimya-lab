import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDeep, getFamous } from '../../data/elementContent';
import { DEEP_MAX_Z, getElement } from '../../data/elements';
import { FAMILIES, type FamilyId } from '../../data/families';
import { MOLECULES } from '../../data/molecules';
import { REACTIONS } from '../../data/reactions';
import { findSubstance } from '../../data/substances';
import { commonMassNumber } from '../../domain/atom';
import { phaseAt } from '../../domain/phase';
import { formatNumber } from '../../domain/text';
import { tr } from '../../i18n/tr';
import { useStore } from '../../state/store';
import { Stars } from '../../ui/Stars';
import { AtomView } from '../atom-builder/AtomView';
import './card.css';

const METAL_FAMILIES: FamilyId[] = ['alkali', 'toprak-alkali', 'gecis', 'gecis-sonrasi', 'lantanit', 'aktinit'];

export function ElementCard({ z, isNew, onClose }: { z: number; isNew: boolean; onClose: () => void }) {
  const el = getElement(z);
  const deep = getDeep(z);
  const famous = getFamous(z);
  const fam = FAMILIES[el.family];
  const progress = useStore((s) => s.save.elements[z]);
  const molecules = useStore((s) => s.save.molecules);
  const reactions = useStore((s) => s.save.reactions);
  const navigate = useNavigate();
  const phase = phaseAt(el, 25);
  const hasTempData = el.meltC !== null || el.boilC !== null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const linkedMolecules = MOLECULES.filter((m) => molecules[m.id] && m.atoms[el.symbol]);
  const linkedReactions = REACTIONS.filter(
    (r) => reactions[r.id] && r.inputs.some((id) => findSubstance(id)?.elements.includes(z)),
  );

  return (
    <aside
      className={`element-card panel ${famous ? 'famous' : ''} ${isNew ? 'new-card' : ''}`}
      aria-label={el.nameTr}
      style={{ ['--fam' as string]: fam.color }}
    >
      <button className="btn btn-ghost btn-icon card-close" onClick={onClose} aria-label={tr.common.close} autoFocus>
        ✕
      </button>
      <header className="card-head">
        <div className="card-symbol" style={{ background: fam.color }}>
          <span className="card-z">{el.z}</span>
          <span className="card-sym">{el.symbol}</span>
        </div>
        <div>
          <h2>{el.nameTr}</h2>
          <div className="card-en">{el.nameEn}</div>
          {z === 74 && <div className="dim small">{tr.card.tungstenAlt}</div>}
          <div className="card-stars">
            <Stars z={z} progress={progress} />
          </div>
        </div>
      </header>

      <div className="card-chips">
        <span className="chip" title={fam.descTr}>
          <i className="dot" style={{ background: fam.color }} /> {fam.icon} {fam.nickTr}
        </span>
        <span className="chip">
          {tr.phaseIcon[phase]} {tr.card.state}: {tr.phase[phase]}
        </span>
        <span className="chip">
          ⚖️ {tr.card.mass}: {formatNumber(el.atomicMass, el.atomicMass < 100 ? 1 : 0)}
        </span>
        {el.radioactive && <span className="chip">{tr.card.radioactiveTag}</span>}
        {el.synthetic && (
          <span className="chip" title={tr.card.syntheticNote}>
            {tr.card.syntheticTag}
          </span>
        )}
        {famous && <span className="chip gold-chip">{tr.card.famousTag}</span>}
      </div>
      <p className="dim small fam-desc">
        {fam.nameTr}: {fam.descTr}
      </p>

      <div className="card-body">
        {deep ? (
          <>
            <div className="card-atom">
              <AtomView p={z} n={commonMassNumber(z) - z} e={z} size={140} title={el.nameTr} />
              <div className="card-where">
                <div className="card-section-title">
                  {deep.icon} {tr.card.where}
                </div>
                <p>{deep.whereTr}</p>
              </div>
            </div>
            <div className="card-section">
              <div className="card-section-title">💡 {tr.card.fact}</div>
              <p>{deep.factTr}</p>
            </div>
            {deep.cautionTr && (
              <div className="card-section caution">
                <div className="card-section-title">⚠️ {tr.card.caution}</div>
                <p>{deep.cautionTr}</p>
              </div>
            )}
          </>
        ) : famous ? (
          <div className="card-section famous-fact">
            <div className="famous-icon">{famous.icon}</div>
            <p>{famous.factTr}</p>
          </div>
        ) : (
          <div className="card-section">
            <p>{tr.card.shortCard(el.nameTr, fam.nickTr, METAL_FAMILIES.includes(el.family))}</p>
          </div>
        )}
        {el.nameOrigin && (
          <div className="card-section">
            <div className="card-section-title">🌍 {tr.card.origin}</div>
            <p>{el.nameOrigin.textTr}</p>
          </div>
        )}
        {el.synthetic && <p className="dim small">{tr.card.syntheticNote}</p>}

        <div className="card-actions">
          {z <= DEEP_MAX_Z ? (
            <button className="btn btn-primary" onClick={() => navigate(`/atom?hedef=${z}`)}>
              ⚛️ {tr.card.buildAtom}
            </button>
          ) : (
            <p className="dim small">{tr.card.tooBig}</p>
          )}
          {hasTempData && (
            <button className="btn" onClick={() => navigate(`/sicaklik?z=${z}`)}>
              🌡️ {tr.card.heatCool}
            </button>
          )}
        </div>

        {z <= DEEP_MAX_Z && (
          <div className="card-section">
            <div className="card-section-title">🔗 {tr.card.links}</div>
            {linkedMolecules.length + linkedReactions.length === 0 ? (
              <p className="dim small">{tr.card.noLinks}</p>
            ) : (
              <div className="link-chips">
                {linkedMolecules.map((m) => (
                  <button key={m.id} className="chip link-chip" onClick={() => navigate(`/defter?sekme=molekuller&id=${m.id}`)}>
                    🧪 {m.formulaDisplay} {m.nameTr}
                  </button>
                ))}
                {linkedReactions.map((r) => (
                  <button key={r.id} className="chip link-chip" onClick={() => navigate(`/defter?sekme=tepkimeler&id=${r.id}`)}>
                    ⚗️ {r.titleTr}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {deep && <p className="faint small model-note">{tr.card.modelNote}</p>}
      </div>
    </aside>
  );
}
