import { useEffect, useState, type ReactNode } from 'react';
import { tr } from '../i18n/tr';

const MIN_W = 1280;
const MIN_H = 720;

/**
 * 1280×720'den küçük pencerede sahne orantılı küçültülür ve not gösterilir (SPEC 4.3).
 */
export function ScaledRoot({ children }: { children: ReactNode }) {
  const [size, setSize] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const [noteClosed, setNoteClosed] = useState(false);

  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const scale = Math.min(1, size.w / MIN_W, size.h / MIN_H);
  const small = scale < 1;
  const style: React.CSSProperties = small
    ? { width: MIN_W, height: MIN_H, transform: `scale(${scale})`, transformOrigin: 'top left' }
    : { width: '100vw', height: '100vh' };

  return (
    <div className="app-root" style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <div className="app-scaled" style={{ ...style, position: 'absolute', left: 0, top: 0 }}>
        {children}
      </div>
      {small && !noteClosed && (
        <button className="small-window-note" onClick={() => setNoteClosed(true)}>
          {tr.smallWindow} ✕
        </button>
      )}
    </div>
  );
}
