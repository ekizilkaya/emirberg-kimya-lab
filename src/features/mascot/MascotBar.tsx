import { useEffect } from 'react';
import { useStore } from '../../state/store';
import { Mol } from './Mol';
import './mascot.css';

/** Üst çubuktaki maskot + konuşma balonu: 6 sn sonra kendiliğinden kapanır */
export function MascotBar() {
  const line = useStore((s) => s.mascot);
  const hush = useStore((s) => s.hushMascot);

  useEffect(() => {
    if (!line) return;
    const t = setTimeout(hush, 6000);
    return () => clearTimeout(t);
  }, [line, hush]);

  return (
    <div className="mascot-bar">
      <div className={`mascot-avatar ${line ? 'talking' : ''}`}>
        <Mol mood={line?.mood ?? 'neutral'} size={52} />
      </div>
      {line && (
        <button key={line.id} className="mascot-bubble" onClick={hush} aria-live="polite">
          {line.text}
        </button>
      )}
    </div>
  );
}
