import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { play } from '../../audio/sound';
import { LIMITS } from '../../data/config';
import { elementBySymbol } from '../../data/elements';
import { FAMILIES } from '../../data/families';
import { HANDS, METALS, NOBLE, PALETTE, getMolecule, type MoleculeRecipe } from '../../data/molecules';
import {
  bondKind,
  canBond,
  countSymbols,
  findBond,
  freeHands,
  nextBondOrder,
  recognize,
  relaxStep,
  type BenchAtom,
  type BenchBond,
} from '../../domain/molecule';
import { hillFormula } from '../../domain/text';
import { tr } from '../../i18n/tr';
import { emit, useStore } from '../../state/store';
import { isTyping } from '../../app/Shell';
import { beginDrag, consumeDragClick, useDragOver, useDropTarget, type DragPayload } from '../../ui/drag';
import { RecipeBook } from './RecipeBook';
import './molecule.css';

const W = 900;
const H = 560;
const R = 28;
const REST = 108;

type Pos = { x: number; y: number };

function atomColor(symbol: string): string {
  return FAMILIES[elementBySymbol(symbol).family].color;
}

function toSvg(svg: SVGSVGElement | null, clientX: number, clientY: number): Pos {
  if (!svg) return { x: W / 2, y: H / 2 };
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const m = svg.getScreenCTM();
  if (!m) return { x: W / 2, y: H / 2 };
  const r = pt.matrixTransform(m.inverse());
  return { x: r.x, y: r.y };
}

/** Atomun el yuvaları: bağ yönlerine en yakın yuvalar dolu sayılır, kalanlar boş el olarak çizilir */
function freeHandAngles(atom: BenchAtom, bonds: BenchBond[], pos: Record<string, Pos>): number[] {
  const h = HANDS[atom.symbol] ?? 0;
  if (h === 0) return [];
  const slots = Array.from({ length: h }, (_, i) => -Math.PI / 2 + (i * 2 * Math.PI) / h);
  const used = new Set<number>();
  const p = pos[atom.id];
  for (const b of bonds) {
    if (b.a !== atom.id && b.b !== atom.id) continue;
    const other = pos[b.a === atom.id ? b.b : b.a];
    if (!p || !other) continue;
    const d = Math.atan2(other.y - p.y, other.x - p.x);
    for (let k = 0; k < b.order; k++) {
      let best = -1;
      let bestDiff = Infinity;
      slots.forEach((s, i) => {
        if (used.has(i)) return;
        const diff = Math.abs(Math.atan2(Math.sin(s - d), Math.cos(s - d)));
        if (diff < bestDiff) {
          bestDiff = diff;
          best = i;
        }
      });
      if (best >= 0) used.add(best);
    }
  }
  return slots.filter((_, i) => !used.has(i));
}

function AtomChip({ symbol, size = 44 }: { symbol: string; size?: number }) {
  return (
    <span className="atom-chip" style={{ width: size, height: size, background: atomColor(symbol), fontSize: size * 0.4 }}>
      {symbol}
    </span>
  );
}

interface DragState {
  mode: 'move' | 'bond';
  atomId: string;
  start: Pos;
  moved: boolean;
  pointer: Pos;
}

export default function MoleculeWorkshop() {
  const bench = useStore((s) => s.bench);
  const setBench = useStore((s) => s.setBench);
  const say = useStore((s) => s.say);
  const reduced = useStore((s) => s.save.settings.reducedMotion);
  const [params, setParams] = useSearchParams();
  const svgRef = useRef<SVGSVGElement>(null);
  const trashRef = useRef<HTMLDivElement>(null);
  const posRef = useRef<Record<string, Pos>>({ ...bench.pos });
  const [, setFrame] = useState(0);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [flash, setFlash] = useState<{ id: string; kind: 'noble' | 'full'; n: number } | null>(null);
  const [transfer, setTransfer] = useState<{ from: Pos; to: Pos; n: number } | null>(null);
  const [discovery, setDiscovery] = useState<{ recipe: MoleculeRecipe; isNew: boolean } | null>(null);
  const [trashOver, setTrashOver] = useState(false);
  const announced = useRef(new Set<string>());
  const benchOver = useDragOver('bench');
  const { atoms, bonds } = bench;

  const rerender = useCallback(() => setFrame((f) => f + 1), []);

  // ---------- Yay düzeni ----------
  const relaxRaf = useRef(0);
  const fixedRef = useRef<string | null>(null);
  const relax = useCallback(() => {
    cancelAnimationFrame(relaxRaf.current);
    let frames = 0;
    const step = () => {
      const st = useStore.getState().bench;
      const map = new Map(st.atoms.map((a) => [a.id, posRef.current[a.id] ?? { x: W / 2, y: H / 2 }]));
      const moved = relaxStep(map, st.bonds, {
        rest: REST,
        repel: REST * 0.95,
        width: W,
        height: H,
        margin: R + 6,
        fixed: fixedRef.current,
      });
      for (const [id, p] of map) posRef.current[id] = p;
      rerender();
      frames++;
      if (moved > 0.6 && frames < 160) relaxRaf.current = requestAnimationFrame(step);
      else setBench({ pos: { ...posRef.current } });
    };
    relaxRaf.current = requestAnimationFrame(step);
  }, [rerender, setBench]);
  useEffect(() => () => cancelAnimationFrame(relaxRaf.current), []);

  // ---------- Tanıma ----------
  const groups = useMemo(() => recognize(atoms, bonds), [atoms, bonds]);
  useEffect(() => {
    const live = new Set<string>();
    for (const g of groups) {
      if (!g.complete) continue;
      const sig = `${g.formulaKey}|${[...g.atomIds].sort().join(',')}`;
      live.add(sig);
      if (announced.current.has(sig)) continue;
      announced.current.add(sig);
      if (g.recipe) {
        const isNew = !useStore.getState().save.molecules[g.recipe.id];
        emit({ type: 'molecule:found', id: g.recipe.id });
        setDiscovery({ recipe: g.recipe, isNew });
        play(isNew ? 'discover' : 'sparkle');
        if (isNew) say(`${tr.molecule.discovered} ${g.recipe.nameTr} (${g.recipe.formulaDisplay})`, { mood: 'happy' });
      } else {
        say(tr.molecule.unknownComplete, { mood: 'thinking' });
      }
    }
    for (const sig of [...announced.current]) if (!live.has(sig)) announced.current.delete(sig);
  }, [groups, say]);

  // ---------- "Atölyede aç" ----------
  useEffect(() => {
    const id = params.get('tarif');
    if (!id) return;
    const m = getMolecule(id);
    setParams({}, { replace: true });
    if (!m) return;
    const list = m.structure.atoms;
    const newAtoms: BenchAtom[] = list.map((symbol, i) => ({ id: `t${Date.now()}_${i}`, symbol }));
    const pos: Record<string, Pos> = {};
    newAtoms.forEach((a, i) => {
      const cols = Math.min(6, list.length);
      pos[a.id] = { x: W / 2 + ((i % cols) - (cols - 1) / 2) * 100, y: H / 2 - 60 + Math.floor(i / cols) * 100 };
    });
    posRef.current = pos;
    announced.current.clear();
    setDiscovery(null);
    setBench({ atoms: newAtoms, bonds: [], pos });
  }, [params, setParams, setBench]);

  // ---------- Eylemler ----------
  const addAtom = useCallback(
    (symbol: string, at?: Pos) => {
      const st = useStore.getState().bench;
      if (st.atoms.length >= LIMITS.benchAtomsMax) {
        say(tr.molecule.benchFull, { mood: 'surprised' });
        play('nope');
        return;
      }
      const id = `a${st.nextId}`;
      const p = at ?? { x: 120 + Math.random() * (W - 240), y: 100 + Math.random() * (H - 200) };
      posRef.current[id] = { x: Math.max(R, Math.min(W - R, p.x)), y: Math.max(R, Math.min(H - R, p.y)) };
      setBench({ atoms: [...st.atoms, { id, symbol }], nextId: st.nextId + 1 });
      play('click');
      relax();
    },
    [setBench, say, relax],
  );

  const removeAtom = useCallback(
    (id: string) => {
      const st = useStore.getState().bench;
      delete posRef.current[id];
      setBench({
        atoms: st.atoms.filter((a) => a.id !== id),
        bonds: st.bonds.filter((b) => b.a !== id && b.b !== id),
        pos: { ...posRef.current },
      });
      setSelected((s) => (s === id ? null : s));
      play('remove');
    },
    [setBench],
  );

  const setOrder = useCallback(
    (bond: BenchBond, order: number) => {
      const st = useStore.getState().bench;
      setBench({ bonds: st.bonds.map((b) => (b.id === bond.id ? { ...b, order } : b)) });
    },
    [setBench],
  );

  const cycleBond = useCallback(
    (bond: BenchBond) => {
      const st = useStore.getState().bench;
      const next = nextBondOrder(st.atoms, st.bonds, bond);
      if (next === bond.order) return;
      const a = st.atoms.find((x) => x.id === bond.a)!;
      const b = st.atoms.find((x) => x.id === bond.b)!;
      setOrder(bond, next);
      if (next > bond.order) {
        emit({ type: 'bond:created', order: next, kind: bondKind(a.symbol, b.symbol) });
        play('bond');
      } else play('unbond');
    },
    [setOrder],
  );

  const tryBond = useCallback(
    (aId: string, bId: string) => {
      const st = useStore.getState().bench;
      const existing = findBond(st.bonds, aId, bId);
      if (existing) {
        cycleBond(existing);
        return;
      }
      const res = canBond(st.atoms, st.bonds, aId, bId);
      if (!res.ok) {
        if (res.reason === 'soy-gaz') {
          setFlash({ id: res.atomId!, kind: 'noble', n: Date.now() });
          emit({ type: 'molecule:nobleGasAttempt' });
          say(tr.molecule.nobleGas, { mood: 'thinking' });
          play('nope');
        } else if (res.reason === 'dolu') {
          const atom = st.atoms.find((x) => x.id === res.atomId)!;
          setFlash({ id: atom.id, kind: 'full', n: Date.now() });
          say(tr.molecule.full(elementBySymbol(atom.symbol).nameTr), { mood: 'thinking' });
          play('nope');
        }
        return;
      }
      const a = st.atoms.find((x) => x.id === aId)!;
      const b = st.atoms.find((x) => x.id === bId)!;
      const kind = bondKind(a.symbol, b.symbol);
      const bond: BenchBond = { id: `b${st.nextId}`, a: aId, b: bId, order: 1 };
      setBench({ bonds: [...st.bonds, bond], nextId: st.nextId + 1 });
      emit({ type: 'bond:created', order: 1, kind });
      play('bond');
      if (kind === 'alisveris') {
        const metal = METALS.has(a.symbol) ? a : b;
        const nonmetal = metal === a ? b : a;
        const from = posRef.current[metal.id];
        const to = posRef.current[nonmetal.id];
        if (from && to && !reduced) setTransfer({ from: { ...from }, to: { ...to }, n: Date.now() });
        say(tr.molecule.giving(elementBySymbol(metal.symbol).nameTr, elementBySymbol(nonmetal.symbol).nameTr), {
          key: 'tip-giving',
        });
      } else {
        say(tr.molecule.sharing, { key: 'tip-sharing' });
      }
      relax();
    },
    [setBench, say, relax, cycleBond, reduced],
  );

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 900);
    return () => clearTimeout(t);
  }, [flash]);
  useEffect(() => {
    if (!transfer) return;
    const t = setTimeout(() => setTransfer(null), 800);
    return () => clearTimeout(t);
  }, [transfer]);

  // ---------- Paletten sürükle-bırak ----------
  const onBenchDrop = useCallback(
    (payload: DragPayload, point: Pos) => {
      if (payload.kind !== 'atom') return;
      addAtom(payload.value, toSvg(svgRef.current, point.x, point.y));
    },
    [addAtom],
  );
  useDropTarget('bench', onBenchDrop);

  // ---------- Tezgâhta atom sürükleme ----------
  const overTrash = (clientX: number, clientY: number) => {
    const r = trashRef.current?.getBoundingClientRect();
    return !!r && clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
  };

  const onAtomPointerDown = (ev: React.PointerEvent, atomId: string, mode: 'move' | 'bond') => {
    if (ev.button !== 0) return;
    ev.stopPropagation();
    const start = toSvg(svgRef.current, ev.clientX, ev.clientY);
    const st: DragState = { mode, atomId, start, moved: false, pointer: start };
    setDrag(st);
    const offset = { x: posRef.current[atomId].x - start.x, y: posRef.current[atomId].y - start.y };
    let cur = st;
    const move = (e: PointerEvent) => {
      const p = toSvg(svgRef.current, e.clientX, e.clientY);
      const moved = cur.moved || Math.hypot(p.x - start.x, p.y - start.y) > 5;
      cur = { ...cur, moved, pointer: p };
      if (mode === 'move' && moved) {
        fixedRef.current = atomId;
        posRef.current[atomId] = {
          x: Math.max(R, Math.min(W - R, p.x + offset.x)),
          y: Math.max(R, Math.min(H - R, p.y + offset.y)),
        };
        setTrashOver(overTrash(e.clientX, e.clientY));
        rerender();
      }
      setDrag(cur);
    };
    const up = (e: PointerEvent) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      fixedRef.current = null;
      setDrag(null);
      setTrashOver(false);
      const p = toSvg(svgRef.current, e.clientX, e.clientY);
      const stAtoms = useStore.getState().bench.atoms;
      if (!cur.moved) {
        onAtomClick(atomId);
        return;
      }
      if (mode === 'move' && overTrash(e.clientX, e.clientY)) {
        removeAtom(atomId);
        relax();
        return;
      }
      // Bırakılan yerde başka bir atom var mı?
      const ref = mode === 'move' ? posRef.current[atomId] : p;
      const target = stAtoms
        .filter((a) => a.id !== atomId)
        .map((a) => ({ a, d: Math.hypot(posRef.current[a.id].x - ref.x, posRef.current[a.id].y - ref.y) }))
        .filter((x) => x.d < R * 1.9)
        .sort((x, y) => x.d - y.d)[0];
      if (target) tryBond(atomId, target.a.id);
      setBench({ pos: { ...posRef.current } });
      relax();
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const onAtomClick = (atomId: string) => {
    if (selected && selected !== atomId) {
      tryBond(selected, atomId);
      setSelected(null);
    } else if (selected === atomId) {
      setSelected(null);
    } else {
      setSelected(atomId);
      play('tick');
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e)) return;
      if ((e.key === 'Delete' || e.key === 'Backspace') && selected) {
        e.preventDefault();
        removeAtom(selected);
        relax();
      }
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, removeAtom, relax]);

  // ---------- Görünüm hesapları ----------
  const pos = posRef.current;
  const groupOf = new Map<string, (typeof groups)[number]>();
  for (const g of groups) for (const id of g.atomIds) groupOf.set(id, g);
  const selectedGroup = selected ? groupOf.get(selected) : null;
  const formula = selectedGroup ? hillFormula(countSymbols(atoms, selectedGroup.atomIds)) : null;

  const ionicCharge = (atom: BenchAtom): number => {
    let c = 0;
    for (const b of bonds) {
      if (b.a !== atom.id && b.b !== atom.id) continue;
      const other = atoms.find((x) => x.id === (b.a === atom.id ? b.b : b.a));
      if (other && bondKind(atom.symbol, other.symbol) === 'alisveris') c += b.order;
    }
    return METALS.has(atom.symbol) ? c : -c;
  };

  return (
    <div className="mol-page">
      <aside className="palette panel" data-tour="palette">
        {PALETTE.map((sym) => (
          <button
            key={sym}
            className="palette-item"
            onPointerDown={(e) => beginDrag(e, { kind: 'atom', value: sym }, <AtomChip symbol={sym} />)}
            onClick={() => {
              if (consumeDragClick()) return;
              addAtom(sym);
            }}
            title={`${elementBySymbol(sym).nameTr} · ${HANDS[sym] ? tr.molecule.hands(HANDS[sym]) : tr.molecule.noHands}`}
          >
            <AtomChip symbol={sym} size={42} />
            <span className="palette-hands">{NOBLE.has(sym) ? '🤷' : '✋'.repeat(Math.min(HANDS[sym], 4))}</span>
          </button>
        ))}
      </aside>

      <div className="bench-col">
        <div className="bench-toolbar">
          <button
            className="btn"
            onClick={() => {
              posRef.current = {};
              announced.current.clear();
              setSelected(null);
              setDiscovery(null);
              setBench({ atoms: [], bonds: [], pos: {} });
              play('whoosh');
            }}
          >
            🧹 {tr.molecule.clear}
          </button>
          <span className="formula-box">
            {tr.molecule.formula}: <b>{formula ?? '—'}</b>
          </span>
          <span className="faint small bench-help">{tr.molecule.help}</span>
        </div>
        <div className={`bench ${benchOver ? 'drop-over' : ''}`} data-drop="bench" data-tour="bench">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid meet"
            onPointerDown={() => setSelected(null)}
            onContextMenu={(e) => e.preventDefault()}
          >
            {/* Bağlar */}
            {bonds.map((b) => {
              const pa = pos[b.a];
              const pb = pos[b.b];
              if (!pa || !pb) return null;
              const aa = atoms.find((x) => x.id === b.a)!;
              const bb = atoms.find((x) => x.id === b.b)!;
              const ionic = bondKind(aa.symbol, bb.symbol) === 'alisveris';
              const dx = pb.x - pa.x;
              const dy = pb.y - pa.y;
              const len = Math.hypot(dx, dy) || 1;
              const nx = -dy / len;
              const ny = dx / len;
              const offsets = b.order === 1 ? [0] : b.order === 2 ? [-5, 5] : [-8, 0, 8];
              return (
                <g
                  key={b.id}
                  className="bond"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => cycleBond(b)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    const st = useStore.getState().bench;
                    setBench({ bonds: st.bonds.filter((x) => x.id !== b.id) });
                    play('unbond');
                    relax();
                  }}
                >
                  <line x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke="transparent" strokeWidth={26} />
                  {offsets.map((o) => (
                    <line
                      key={o}
                      x1={pa.x + nx * o}
                      y1={pa.y + ny * o}
                      x2={pb.x + nx * o}
                      y2={pb.y + ny * o}
                      className={ionic ? 'bond-line ionic' : 'bond-line'}
                    />
                  ))}
                </g>
              );
            })}

            {/* Atomlar */}
            {atoms.map((atom) => {
              const p = pos[atom.id];
              if (!p) return null;
              const g = groupOf.get(atom.id);
              const glow = !!g?.complete && !!g.recipe;
              const incomplete = !!g && g.atomIds.length >= 2 && !g.complete;
              const free = freeHandAngles(atom, bonds, pos);
              const charge = ionicCharge(atom);
              const fl = flash?.id === atom.id ? flash.kind : null;
              const hasFree = freeHands(atom, bonds) > 0;
              return (
                <g key={atom.id} transform={`translate(${p.x} ${p.y})`}>
                <g
                  className={`bench-atom ${selected === atom.id ? 'selected' : ''} ${glow ? 'glow' : ''} ${
                    fl === 'noble' ? 'noble-no' : ''
                  } ${fl === 'full' ? 'full-no' : ''}`}
                >
                  {glow && <circle r={R + 10} className="atom-halo" />}
                  {free.map((ang, i) => (
                    <g key={i} className={`hand ${incomplete ? 'blink' : ''}`} onPointerDown={(e) => onAtomPointerDown(e, atom.id, 'bond')}>
                      <line x1={Math.cos(ang) * (R - 2)} y1={Math.sin(ang) * (R - 2)} x2={Math.cos(ang) * (R + 11)} y2={Math.sin(ang) * (R + 11)} />
                      <circle cx={Math.cos(ang) * (R + 13)} cy={Math.sin(ang) * (R + 13)} r={6} />
                    </g>
                  ))}
                  <circle
                    r={R}
                    fill={atomColor(atom.symbol)}
                    className="atom-body"
                    onPointerDown={(e) => onAtomPointerDown(e, atom.id, 'move')}
                    style={{ cursor: hasFree || NOBLE.has(atom.symbol) ? 'grab' : 'move' }}
                  />
                  <text textAnchor="middle" dy={8} className="atom-label" pointerEvents="none">
                    {atom.symbol}
                  </text>
                  {charge !== 0 && (
                    <g transform={`translate(${R * 0.8} ${-R * 0.8})`} pointerEvents="none">
                      <circle r={11} className={charge > 0 ? 'charge-plus' : 'charge-minus'} />
                      <text textAnchor="middle" dy={4.5} className="charge-text">
                        {Math.abs(charge) > 1 ? Math.abs(charge) : ''}
                        {charge > 0 ? '+' : '−'}
                      </text>
                    </g>
                  )}
                  {fl === 'noble' && (
                    <text y={-R - 10} textAnchor="middle" fontSize={26} pointerEvents="none">
                      🤷
                    </text>
                  )}
                </g>
                </g>
              );
            })}

            {/* Molekül adları */}
            {groups
              .filter((g) => g.complete && g.recipe)
              .map((g) => {
                const pts = g.atomIds.map((id) => pos[id]).filter(Boolean);
                const cx = pts.reduce((s, q) => s + q.x, 0) / pts.length;
                const top = Math.min(...pts.map((q) => q.y));
                return (
                  <g key={g.atomIds.join()} transform={`translate(${cx} ${Math.max(22, top - R - 26)})`} pointerEvents="none">
                    <rect x={-90} y={-16} width={180} height={28} rx={14} className="mol-label-bg" />
                    <text textAnchor="middle" dy={5} className="mol-label">
                      {g.recipe!.nameTr} · {g.recipe!.formulaDisplay}
                    </text>
                  </g>
                );
              })}

            {/* Bağ çizme çizgisi */}
            {drag?.mode === 'bond' && drag.moved && pos[drag.atomId] && (
              <line
                x1={pos[drag.atomId].x}
                y1={pos[drag.atomId].y}
                x2={drag.pointer.x}
                y2={drag.pointer.y}
                className="bond-draft"
              />
            )}

            {/* Elektron alışverişi animasyonu */}
            {transfer && (
              <circle key={transfer.n} r={7} className="transfer-electron">
                <animate attributeName="cx" from={transfer.from.x} to={transfer.to.x} dur="0.7s" fill="freeze" />
                <animate attributeName="cy" from={transfer.from.y} to={transfer.to.y} dur="0.7s" fill="freeze" />
              </circle>
            )}
          </svg>
          {atoms.length === 0 && <div className="bench-empty">{tr.molecule.empty}</div>}
          <div ref={trashRef} className={`trash ${trashOver ? 'over' : ''}`} aria-label={tr.molecule.trash}>
            🗑️
          </div>
          {discovery && (
            <div className={`discovery panel ${discovery.isNew ? 'new' : ''}`} key={discovery.recipe.id}>
              <button className="btn btn-ghost btn-icon discovery-close" onClick={() => setDiscovery(null)} aria-label={tr.common.close}>
                ✕
              </button>
              <div className="discovery-title">
                {discovery.isNew ? `✨ ${tr.molecule.discovered}` : tr.molecule.alreadyKnown} {discovery.recipe.nameTr}{' '}
                <span className="formula">{discovery.recipe.formulaDisplay}</span>
              </div>
              <p>{discovery.recipe.everydayTr}</p>
              {discovery.recipe.crystal && <p className="dim small">💎 {tr.molecule.crystalNote}</p>}
              {discovery.recipe.cautionTr && <p className="caution-text">⚠️ {discovery.recipe.cautionTr}</p>}
            </div>
          )}
        </div>
      </div>

      <RecipeBook />
    </div>
  );
}
