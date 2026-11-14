import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { tr } from '../i18n/tr';
import { useStore } from '../state/store';
import { Portal } from './Portal';
import './ui.css';

/** Atölyenin ilk ziyaretinde en çok 3 adımlık ipucu turu (SPEC 5) */
export function Tour({ id }: { id: string }) {
  const seen = useStore((s) => s.save.toursSeen.includes(id));
  const tutorial = useStore((s) => s.save.tutorial);
  const updateSave = useStore((s) => s.updateSave);
  const steps = useMemo(() => tr.tours[id] ?? [], [id]);
  const [i, setI] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const active = !seen && tutorial !== 'none' && steps.length > 0;

  useEffect(() => setI(0), [id]);

  useLayoutEffect(() => {
    if (!active) return;
    let raf = 0;
    const measure = () => {
      const el = document.querySelector(steps[i]?.sel ?? '');
      setRect(el ? el.getBoundingClientRect() : null);
    };
    const t = setTimeout(measure, 120);
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [active, i, steps]);

  if (!active) return null;
  const finish = () => {
    updateSave((s) => ({ ...s, toursSeen: [...s.toursSeen, id] }));
    // İlk turdan sonra Görev Panosu kısaca gösterilir (SPEC 5.5)
    if (id === 'tablo') setTimeout(() => useStore.getState().setQuestPanel(true), 400);
  };
  const last = i >= steps.length - 1;
  const pad = 8;
  const box = rect
    ? { left: rect.left - pad, top: rect.top - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }
    : null;
  // Balonu vurgulanan alanın altına (yer yoksa üstüne) koy
  let bubbleStyle: React.CSSProperties = { left: '50%', top: '40%', transform: 'translate(-50%, -50%)' };
  if (box) {
    const below = box.top + box.height + 170 < window.innerHeight;
    const left = Math.min(Math.max(16, box.left + box.width / 2 - 180), window.innerWidth - 376);
    bubbleStyle = below ? { left, top: box.top + box.height + 14 } : { left, top: Math.max(16, box.top - 160) };
  }
  return (
    <Portal>
      <div className="tour" role="dialog" aria-live="polite">
        {box ? <div className="tour-spot" style={box} /> : <div className="tour-dim" />}
        <div className="tour-bubble panel pop-in" style={bubbleStyle}>
          <p>{steps[i].text}</p>
          <div className="tour-actions">
            <span className="faint small">
              {i + 1}/{steps.length}
            </span>
            <button className="btn btn-ghost btn-sm" onClick={finish}>
              {tr.common.skip}
            </button>
            <button className="btn btn-primary btn-sm" autoFocus onClick={() => (last ? finish() : setI(i + 1))}>
              {last ? tr.common.ok : tr.common.next}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
