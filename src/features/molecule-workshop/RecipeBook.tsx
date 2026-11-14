import { useState } from 'react';
import { MOLECULES, type MoleculeLevel } from '../../data/molecules';
import { tr } from '../../i18n/tr';
import { useStore } from '../../state/store';

const LEVELS: MoleculeLevel[] = ['kolay', 'orta', 'zor'];

/** Tarif Defteri: keşfedilmemişler gölge + ipucu; İpucu önce formülü, sonra atom listesini gösterir */
export function RecipeBook() {
  const found = useStore((s) => s.save.molecules);
  const [level, setLevel] = useState<MoleculeLevel>('kolay');
  const [hintLevel, setHintLevel] = useState<Record<string, number>>({});
  const list = MOLECULES.filter((m) => m.level === level);
  const total = Object.keys(found).length;

  return (
    <aside className="recipes panel" data-tour="recipes">
      <div className="recipes-head">
        <h3>📖 {tr.molecule.recipes}</h3>
        <span className="dim small">{tr.notebook.count(total, MOLECULES.length)}</span>
      </div>
      <div className="tabs">
        {LEVELS.map((l) => (
          <button key={l} className={`tab ${level === l ? 'active' : ''}`} onClick={() => setLevel(l)}>
            {tr.molecule.levels[l]}
          </button>
        ))}
      </div>
      <ul className="recipe-list">
        {list.map((m) => {
          const known = !!found[m.id];
          const h = hintLevel[m.id] ?? 0;
          return (
            <li key={m.id} className={`recipe ${known ? 'known' : ''}`}>
              {known ? (
                <>
                  <div className="recipe-title">
                    ✅ <b>{m.nameTr}</b> <span className="formula">{m.formulaDisplay}</span>
                  </div>
                  <div className="dim small">{m.buildTipTr}</div>
                </>
              ) : (
                <>
                  <div className="recipe-title">
                    <b>{tr.molecule.unknown}</b> — {m.hintTr}
                  </div>
                  {h >= 1 && (
                    <div className="recipe-hint">
                      🧾 <span className="formula">{m.formulaDisplay}</span>
                    </div>
                  )}
                  {h >= 2 && (
                    <div className="recipe-hint">
                      🧩{' '}
                      {Object.entries(m.atoms)
                        .map(([s, n]) => `${n} ${s}`)
                        .join(' + ')}{' '}
                      · {m.buildTipTr}
                    </div>
                  )}
                  {h < 2 && (
                    <button
                      className="btn btn-sm"
                      onClick={() => setHintLevel((x) => ({ ...x, [m.id]: h + 1 }))}
                    >
                      💡 {h === 0 ? tr.molecule.hint1 : tr.molecule.hint2}
                    </button>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
