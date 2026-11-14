import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { play } from '../../audio/sound';
import { BADGES } from '../../data/badges';
import { DEEP_MAX_Z, ELEMENTS } from '../../data/elements';
import { FAMILIES } from '../../data/families';
import { MOLECULES } from '../../data/molecules';
import { REACTIONS } from '../../data/reactions';
import { getSubstance } from '../../data/substances';
import { elementStars, maxStars, totalStars } from '../../domain/scoring';
import { tr } from '../../i18n/tr';
import { useStore } from '../../state/store';
import { Diploma } from './Diploma';
import { MoleculeDrawing } from './MoleculeDrawing';
import './notebook.css';

const TABS = ['elementler', 'molekuller', 'tepkimeler', 'rozetler', 'diploma'] as const;
type Tab = (typeof TABS)[number];
const TAB_ICONS: Record<Tab, string> = { elementler: '🧮', molekuller: '🧪', tepkimeler: '⚗️', rozetler: '🏅', diploma: '📜' };

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function Notebook() {
  const [params, setParams] = useSearchParams();
  const tab = (TABS as readonly string[]).includes(params.get('sekme') ?? '') ? (params.get('sekme') as Tab) : 'elementler';
  const focusId = params.get('id');

  return (
    <div className="notebook-page">
      <div className="tabs nb-tabs" data-tour="nb-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={`tab ${tab === t ? 'active' : ''}`}
            onClick={() => {
              setParams({ sekme: t }, { replace: true });
              play('click');
            }}
          >
            {TAB_ICONS[t]} {tr.notebook.tabs[t]}
          </button>
        ))}
      </div>
      <div className="nb-body">
        {tab === 'elementler' && <ElementsTab />}
        {tab === 'molekuller' && <MoleculesTab focusId={focusId} />}
        {tab === 'tepkimeler' && <ReactionsTab focusId={focusId} />}
        {tab === 'rozetler' && <BadgesTab />}
        {tab === 'diploma' && <Diploma />}
      </div>
    </div>
  );
}

function useScrollToFocus(focusId: string | null) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!focusId) return;
    const el = ref.current?.querySelector(`[data-id="${focusId}"]`);
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [focusId]);
  return ref;
}

function ElementsTab() {
  const save = useStore((s) => s.save);
  const navigate = useNavigate();
  const deepStars = totalStars(save, DEEP_MAX_Z);
  const viewed = ELEMENTS.filter((e) => save.elements[e.z]?.viewed).length;
  return (
    <div className="nb-elements">
      <div className="nb-summary">
        <span className="chip">⭐ {tr.notebook.first36(deepStars, DEEP_MAX_Z * 3)}</span>
        <span className="chip">🃏 {tr.notebook.allCards(viewed, ELEMENTS.length)}</span>
      </div>
      <div className="nb-grid">
        {ELEMENTS.map((el) => {
          const s = elementStars(save, el.z);
          const max = maxStars(el.z);
          return (
            <button
              key={el.z}
              className={`nb-cell ${s === 0 ? 'off' : ''} ${s === max ? 'full' : ''}`}
              style={{ gridColumn: el.tableX, gridRow: el.tableY, ['--fam' as string]: FAMILIES[el.family].color }}
              onClick={() => navigate(`/tablo?z=${el.z}`)}
              title={el.nameTr}
            >
              <span className="nb-sym">{el.symbol}</span>
              <span className="nb-stars">{'★'.repeat(s)}{'☆'.repeat(max - s)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MoleculesTab({ focusId }: { focusId: string | null }) {
  const found = useStore((s) => s.save.molecules);
  const navigate = useNavigate();
  const ref = useScrollToFocus(focusId);
  return (
    <div className="nb-cards-wrap" ref={ref}>
      <div className="nb-summary">
        <span className="chip">🧪 {tr.notebook.count(Object.keys(found).length, MOLECULES.length)}</span>
      </div>
      <div className="nb-cards">
        {MOLECULES.map((m) => {
          const known = !!found[m.id];
          return (
            <div key={m.id} data-id={m.id} className={`nb-card panel ${known ? '' : 'unknown'} ${focusId === m.id ? 'focus' : ''}`}>
              <MoleculeDrawing recipe={m} size={130} hidden={!known} />
              <div className="nb-card-text">
                {known ? (
                  <>
                    <h3>
                      {m.nameTr} <span className="formula">{m.formulaDisplay}</span>
                    </h3>
                    <p>{m.everydayTr}</p>
                    {m.crystal && <p className="dim small">💎 {tr.molecule.crystalNote}</p>}
                    {m.cautionTr && <p className="caution-text small">⚠️ {m.cautionTr}</p>}
                    <p className="faint small">
                      {tr.notebook.firstFound}: {formatDate(found[m.id])}
                    </p>
                    <button className="btn btn-sm" onClick={() => navigate(`/molekul?tarif=${m.id}`)}>
                      🔗 {tr.molecule.openInWorkshop}
                    </button>
                  </>
                ) : (
                  <>
                    <h3>{tr.notebook.hidden}</h3>
                    <p className="dim">{m.hintTr}</p>
                    <span className="chip">{tr.molecule.levels[m.level]}</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReactionsTab({ focusId }: { focusId: string | null }) {
  const found = useStore((s) => s.save.reactions);
  const setCauldron = useStore((s) => s.setCauldron);
  const navigate = useNavigate();
  const ref = useScrollToFocus(focusId);
  return (
    <div className="nb-cards-wrap" ref={ref}>
      <div className="nb-summary">
        <span className="chip">⚗️ {tr.notebook.count(Object.keys(found).length, REACTIONS.length)}</span>
      </div>
      <div className="nb-cards reactions">
        {REACTIONS.map((r) => {
          const known = !!found[r.id];
          return (
            <div key={r.id} data-id={r.id} className={`nb-card panel ${known ? '' : 'unknown'} ${focusId === r.id ? 'focus' : ''}`}>
              <div className="nb-card-text">
                {known ? (
                  <>
                    <h3>{r.titleTr}</h3>
                    <div className="nb-inputs">
                      {r.inputs.map((id, i) => (
                        <span key={id}>
                          {i > 0 && ' + '}
                          {getSubstance(id).icon} {getSubstance(id).nameTr}
                        </span>
                      ))}
                      {r.tool && (
                        <span>
                          {' + '}
                          {tr.cauldron.toolIcons[r.tool]} {tr.cauldron.tools[r.tool]}
                        </span>
                      )}
                    </div>
                    <span className={`kind-badge kind-${r.kind}`}>{tr.cauldron.kinds[r.kind]}</span>
                    <p>{r.explainTr}</p>
                    {r.safety !== 'notr' && <p className="small">{tr.cauldron.safety[r.safety]}</p>}
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        setCauldron({ inputs: [...r.inputs], tool: r.tool ?? null, autoMix: Date.now() });
                        navigate('/kazan');
                      }}
                    >
                      ▶️ {tr.cauldron.replay}
                    </button>
                  </>
                ) : (
                  <>
                    <h3>{tr.notebook.hidden}</h3>
                    <p className="dim">💡 {r.hintTr}</p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BadgesTab() {
  const badges = useStore((s) => s.save.badges);
  return (
    <div className="nb-cards-wrap">
      <div className="nb-summary">
        <span className="chip">🏅 {tr.notebook.count(Object.keys(badges).length, BADGES.length)}</span>
      </div>
      <div className="badge-grid">
        {BADGES.map((b) => {
          const got = badges[b.id];
          return (
            <div key={b.id} className={`badge-card panel ${got ? 'got' : ''}`}>
              <div className="badge-icon">{b.icon}</div>
              <h3>{b.nameTr}</h3>
              <p className="small dim">{got ? `${tr.notebook.earned}: ${formatDate(got)}` : `${tr.notebook.howToEarn} ${b.howTr}`}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
