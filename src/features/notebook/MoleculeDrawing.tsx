import { useMemo } from 'react';
import { elementBySymbol } from '../../data/elements';
import { FAMILIES } from '../../data/families';
import { METALS, type MoleculeRecipe } from '../../data/molecules';
import { layoutStructure } from '../../domain/molecule';

/** Tarif yapısından deterministik 2B molekül çizimi */
export function MoleculeDrawing({ recipe, size = 160, hidden = false }: { recipe: MoleculeRecipe; size?: number; hidden?: boolean }) {
  const pts = useMemo(() => layoutStructure(recipe.structure, 220), [recipe]);
  const atoms = recipe.structure.atoms;
  const r = atoms.length > 6 ? 15 : 19;
  return (
    <svg width={size} height={size} viewBox="0 0 220 220" aria-hidden className={hidden ? 'mol-hidden' : ''}>
      {recipe.structure.bonds.map(([a, b, order], i) => {
        const pa = pts[a];
        const pb = pts[b];
        const dx = pb.x - pa.x;
        const dy = pb.y - pa.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const ionic = METALS.has(atoms[a]) !== METALS.has(atoms[b]);
        const offs = order === 1 ? [0] : order === 2 ? [-3.5, 3.5] : [-6, 0, 6];
        return offs.map((o) => (
          <line
            key={`${i}-${o}`}
            x1={pa.x + nx * o}
            y1={pa.y + ny * o}
            x2={pb.x + nx * o}
            y2={pb.y + ny * o}
            stroke={hidden ? '#3a4280' : ionic ? '#ffd8a8' : '#e9ecff'}
            strokeWidth={3.5}
            strokeDasharray={ionic ? '2 5' : undefined}
            strokeLinecap="round"
          />
        ));
      })}
      {atoms.map((s, i) => (
        <g key={i} transform={`translate(${pts[i].x} ${pts[i].y})`}>
          <circle r={r} fill={hidden ? '#2b347a' : FAMILIES[elementBySymbol(s).family].color} stroke="rgba(255,255,255,.5)" strokeWidth={2} />
          <text textAnchor="middle" dy={r * 0.36} fontSize={r * 0.95} fontWeight={700} fill={hidden ? '#7f88c6' : '#10132f'} fontFamily="Baloo 2, sans-serif">
            {hidden ? '?' : s}
          </text>
        </g>
      ))}
    </svg>
  );
}
