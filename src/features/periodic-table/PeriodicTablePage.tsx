import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { play } from '../../audio/sound';
import { ELEMENTS, getElement, type ElementData } from '../../data/elements';
import { FAMILIES, FAMILY_ORDER } from '../../data/families';
import { phaseAt } from '../../domain/phase';
import { pickDaily } from '../../domain/progress';
import { elementStars, maxStars } from '../../domain/scoring';
import { foldTr, todayKey } from '../../domain/text';
import type { LensId } from '../../domain/types';
import { tr } from '../../i18n/tr';
import { emit, useStore } from '../../state/store';
import { isTyping } from '../../app/Shell';
import { ElementCard } from './ElementCard';
import { LENSES, PHASE_COLORS, cellLook } from './lenses';
import './table.css';

function matches(el: ElementData, q: string): boolean {
  if (!q) return true;
  const f = foldTr(q);
  if (/^\d+$/.test(f)) return String(el.z) === f;
  return (
    foldTr(el.symbol) === f ||
    foldTr(el.nameTr).includes(f) ||
    foldTr(el.nameEn).includes(f) ||
    (f.length <= 2 && foldTr(el.symbol).startsWith(f))
  );
}

/** Yön tuşlarıyla bir sonraki hücre (boşluklar atlanır) */
function neighbor(z: number, key: string): number | null {
  const cur = getElement(z);
  const rowOrder = (y: number) => y;
  let cands: ElementData[] = [];
  if (key === 'ArrowRight') cands = ELEMENTS.filter((e) => e.tableY === cur.tableY && e.tableX > cur.tableX);
  if (key === 'ArrowLeft') cands = ELEMENTS.filter((e) => e.tableY === cur.tableY && e.tableX < cur.tableX);
  if (key === 'ArrowDown') cands = ELEMENTS.filter((e) => rowOrder(e.tableY) > rowOrder(cur.tableY));
  if (key === 'ArrowUp') cands = ELEMENTS.filter((e) => rowOrder(e.tableY) < rowOrder(cur.tableY));
  if (cands.length === 0) return null;
  if (key === 'ArrowRight' || key === 'ArrowLeft') {
    cands.sort((a, b) => Math.abs(a.tableX - cur.tableX) - Math.abs(b.tableX - cur.tableX));
    return cands[0].z;
  }
  const targetY =
    key === 'ArrowDown' ? Math.min(...cands.map((e) => e.tableY)) : Math.max(...cands.map((e) => e.tableY));
  const row = cands.filter((e) => e.tableY === targetY);
  row.sort((a, b) => Math.abs(a.tableX - cur.tableX) - Math.abs(b.tableX - cur.tableX));
  return row[0].z;
}

function useCellSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [cell, setCell] = useState(60);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const gap = 3;
      const byW = (w - 26 - 18 * gap) / 18;
      const byH = (h - 22 - 12 - 10 * gap) / 9;
      setCell(Math.max(40, Math.floor(Math.min(byW, byH))));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return cell;
}

export function PeriodicTablePage() {
  const save = useStore((s) => s.save);
  const updateSave = useStore((s) => s.updateSave);
  const [params, setParams] = useSearchParams();
  const [lens, setLens] = useState<LensId>('aileler');
  const [query, setQuery] = useState('');
  const [focusZ, setFocusZ] = useState(1);
  const [fRowFlash, setFRowFlash] = useState<number | null>(null);
  const [newCard, setNewCard] = useState(false);
  const gridWrap = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const cellRefs = useRef(new Map<number, HTMLButtonElement>());
  const cell = useCellSize(gridWrap);
  const openZ = params.get('z') ? Number(params.get('z')) : null;

  // Günün elementi
  useEffect(() => {
    const key = todayKey();
    if (save.daily?.date !== key) updateSave((s) => pickDaily(s, key));
  }, [save.daily?.date, updateSave]);

  const openCard = useCallback(
    (z: number) => {
      const wasViewed = !!useStore.getState().save.elements[z]?.viewed;
      setNewCard(!wasViewed);
      play(wasViewed ? 'click' : 'card');
      emit({ type: 'element:viewed', z });
      setFocusZ(z);
      setParams({ z: String(z) }, { replace: true });
    },
    [setParams],
  );
  const closeCard = useCallback(() => {
    setParams({}, { replace: true });
    setTimeout(() => cellRefs.current.get(focusZ)?.focus(), 0);
  }, [setParams, focusZ]);

  // Derin bağlantıyla gelinen kart da "incelendi" sayılır
  useEffect(() => {
    if (openZ && !useStore.getState().save.elements[openZ]?.viewed) emit({ type: 'element:viewed', z: openZ });
  }, [openZ]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !isTyping(e)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const matchSet = useMemo(() => new Set(ELEMENTS.filter((e) => matches(e, query)).map((e) => e.z)), [query]);

  const onCellKey = (e: React.KeyboardEvent, z: number) => {
    if (e.key.startsWith('Arrow')) {
      e.preventDefault();
      const nz = neighbor(z, e.key);
      if (nz) {
        setFocusZ(nz);
        cellRefs.current.get(nz)?.focus();
      }
    }
  };

  const chooseLens = (l: LensId) => {
    setLens(l);
    play('click');
    emit({ type: 'lens:used', id: l });
  };

  const daily = save.daily ? getElement(save.daily.z) : null;
  const gap = 3;
  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: `22px repeat(18, ${cell}px)`,
    gridTemplateRows: `20px repeat(7, ${cell}px) 12px repeat(2, ${cell}px)`,
    gap,
    ['--cell' as string]: `${cell}px`,
  };

  return (
    <div className="table-page">
      <div className="table-toolbar">
        <div className="lens-picker" data-tour="lens" role="radiogroup" aria-label={tr.table.lens}>
          <span className="dim small">👓 {tr.table.lens}:</span>
          {LENSES.map((l) => (
            <button
              key={l}
              role="radio"
              aria-checked={lens === l}
              className={`tab ${lens === l ? 'active' : ''}`}
              onClick={() => chooseLens(l)}
            >
              {tr.table.lenses[l]}
            </button>
          ))}
        </div>
        <div className="search" data-tour="search">
          <span aria-hidden>🔍</span>
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tr.table.search}
            aria-label={tr.table.search}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const first = ELEMENTS.find((el) => matchSet.has(el.z));
                if (first) openCard(first.z);
              }
              if (e.key === 'Escape') setQuery('');
            }}
          />
          {query && (
            <button className="btn btn-ghost btn-sm" onClick={() => setQuery('')} aria-label={tr.common.close}>
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="table-wrap" ref={gridWrap}>
        <div className="ptable" style={gridStyle} data-tour="table-grid" role="grid" aria-label={tr.nav.tabloLong}>
          {Array.from({ length: 18 }, (_, i) => (
            <div key={`g${i}`} className="axis-label" style={{ gridColumn: i + 2, gridRow: 1 }}>
              {i + 1}
            </div>
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <div key={`p${i}`} className="axis-label" style={{ gridColumn: 1, gridRow: i + 2 }}>
              {i + 1}
            </div>
          ))}

          {daily && (
            <div className="daily-box" style={{ gridColumn: '4 / 8', gridRow: '2 / 5' }}>
              <div className="daily-title">✨ {tr.table.daily}</div>
              <button className="daily-el" onClick={() => openCard(daily.z)} style={{ background: FAMILIES[daily.family].color }}>
                <span className="daily-z">{daily.z}</span>
                <span className="daily-sym">{daily.symbol}</span>
              </button>
              <div className="daily-name">{daily.nameTr}</div>
            </div>
          )}
          <Legend lens={lens} />

          {[6, 7].map((row) => (
            <button
              key={`ph${row}`}
              className="placeholder-cell"
              style={{ gridColumn: 4, gridRow: row + 1, background: row === 6 ? FAMILIES.lantanit.color : FAMILIES.aktinit.color }}
              onClick={() => {
                setFRowFlash(row === 6 ? 9 : 10);
                setTimeout(() => setFRowFlash(null), 1800);
              }}
            >
              {row === 6 ? tr.table.lanthanides : tr.table.actinides}
            </button>
          ))}

          {ELEMENTS.map((el) => {
            const look = cellLook(el, lens, save);
            const stars = elementStars(save, el.z);
            const max = maxStars(el.z);
            const searchedOut = !matchSet.has(el.z);
            const faded = look.faded || searchedOut;
            return (
              <button
                key={el.z}
                ref={(b) => {
                  if (b) cellRefs.current.set(el.z, b);
                }}
                role="gridcell"
                tabIndex={focusZ === el.z ? 0 : -1}
                className={`cell ${faded ? 'faded' : ''} ${look.striped ? 'striped' : ''} ${
                  fRowFlash === el.tableY ? 'flash' : ''
                } ${openZ === el.z ? 'open' : ''} ${query && !searchedOut ? 'hit' : ''}`}
                style={{ gridColumn: el.tableX + 1, gridRow: el.tableY + 1, background: look.bg }}
                onClick={() => openCard(el.z)}
                onKeyDown={(e) => onCellKey(e, el.z)}
                onFocus={() => setFocusZ(el.z)}
                title={`${el.nameTr} · ${FAMILIES[el.family].nickTr} · ${tr.phase[cellPhaseLabel(el)]}`}
                aria-label={`${el.z} ${el.nameTr}, ${stars}/${max} ${tr.table.discovered}`}
              >
                <span className="cell-z">{el.z}</span>
                {look.icon && <span className="cell-icon">{look.icon}</span>}
                <span className="cell-sym">{el.symbol}</span>
                <span className="cell-name">{el.nameTr}</span>
                <span className="cell-stars" aria-hidden>
                  {Array.from({ length: max }, (_, i) => (
                    <i key={i} className={i < stars ? 'on' : ''} />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {openZ && <ElementCard key={openZ} z={openZ} isNew={newCard} onClose={closeCard} />}
    </div>
  );
}

function cellPhaseLabel(el: ElementData): string {
  return phaseAt(el, 25);
}

function Legend({ lens }: { lens: LensId }) {
  return (
    <div className="legend" style={{ gridColumn: '8 / 14', gridRow: '2 / 5' }}>
      <div className="legend-desc">{tr.table.lensDesc[lens]}</div>
      <div className={`legend-items ${lens === 'aileler' ? 'two-col' : ''}`}>
        {lens === 'aileler' &&
          FAMILY_ORDER.map((f) => (
            <span key={f} className="legend-item" title={FAMILIES[f].descTr}>
              <i style={{ background: FAMILIES[f].color }} />
              {FAMILIES[f].icon} {FAMILIES[f].nickTr}
            </span>
          ))}
        {lens === 'hal' &&
          (['kati', 'sivi', 'gaz', 'bilinmiyor'] as const).map((p) => (
            <span key={p} className="legend-item">
              <i style={{ background: PHASE_COLORS[p] }} />
              {tr.phaseIcon[p]} {tr.phase[p]}
            </span>
          ))}
        {lens === 'kesif' && (
          <>
            <span className="legend-item">
              <i style={{ background: '#3a4280' }} /> {tr.table.notDiscovered}
            </span>
            <span className="legend-item">
              <i style={{ background: '#74c0fc' }} /> ⭐
            </span>
            <span className="legend-item">
              <i style={{ background: '#63e6be' }} /> ⭐⭐
            </span>
            <span className="legend-item">
              <i style={{ background: '#f2c94c' }} /> 🌟
            </span>
          </>
        )}
        {lens === 'vucut' && (
          <>
            <span className="legend-item">
              <i style={{ background: '#ff8fab' }} /> ❤️ {tr.table.bodyMain}
            </span>
            <span className="legend-item">
              <i style={{ background: '#ffc9d6' }} /> {tr.table.bodyTrace}
            </span>
          </>
        )}
        {lens === 'isiyan' && (
          <span className="legend-item">
            <i style={{ background: '#a9e34b' }} /> ☢️ {tr.table.radioactive}
          </span>
        )}
        {lens === 'insan-yapimi' && (
          <span className="legend-item">
            <i style={{ background: '#ffd43b' }} /> 🏭 {tr.table.synthetic}
          </span>
        )}
      </div>
    </div>
  );
}
