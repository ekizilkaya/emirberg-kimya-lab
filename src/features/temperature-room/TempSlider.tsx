import { useRef } from 'react';
import { TEMP } from '../../data/config';
import { positionToTemp, tempToPosition } from '../../domain/phase';
import { formatTemp } from '../../domain/text';
import { tr } from '../../i18n/tr';

const TICKS = [-273, -200, -100, 0, 100, 500, 1000, 2000, 3500, 6000];

/** Doğrusal olmayan sıcaklık kaydırıcısı. Ok ±1 °C, Shift+ok ±50 °C. */
export function TempSlider({ value, onChange }: { value: number; onChange: (t: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pos = tempToPosition(value);

  const fromClient = (clientX: number) => {
    const r = trackRef.current!.getBoundingClientRect();
    return positionToTemp((clientX - r.left) / r.width);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    (e.currentTarget as HTMLElement).focus();
    onChange(fromClient(e.clientX));
    const move = (ev: PointerEvent) => onChange(fromClient(ev.clientX));
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 50 : 1;
    let t: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') t = value + step;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') t = value - step;
    if (e.key === 'Home') t = TEMP.min;
    if (e.key === 'End') t = TEMP.max;
    if (e.key === 'PageUp') t = value + 100;
    if (e.key === 'PageDown') t = value - 100;
    if (t !== null) {
      e.preventDefault();
      onChange(Math.max(TEMP.min, Math.min(TEMP.max, t)));
    }
  };

  return (
    <div className="temp-slider">
      <div
        className="temp-track"
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label={tr.temp.slider}
        aria-valuemin={TEMP.min}
        aria-valuemax={TEMP.max}
        aria-valuenow={value}
        aria-valuetext={formatTemp(value)}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
      >
        <div className="temp-fill" style={{ width: `${pos * 100}%` }} />
        <div className="temp-thumb" style={{ left: `${pos * 100}%` }}>
          <span className="temp-thumb-label">{formatTemp(value)}</span>
        </div>
      </div>
      <div className="temp-ticks" aria-hidden>
        {TICKS.map((t) => (
          <span key={t} style={{ left: `${tempToPosition(t) * 100}%` }}>
            {t === -273 ? '−273' : t < 0 ? `−${Math.abs(t)}` : t.toLocaleString('tr-TR')}
          </span>
        ))}
      </div>
    </div>
  );
}
