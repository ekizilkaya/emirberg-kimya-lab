import { useEffect, useRef } from 'react';
import type { ElementData, Phase } from '../../data/elements';
import { FAMILIES } from '../../data/families';

const SIZE = 260;
const PR = 9;

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hx: number;
  hy: number;
}

function lattice(): { x: number; y: number }[] {
  const cols = 6;
  const rows = 5;
  const gap = 24;
  const ox = SIZE / 2 - ((cols - 1) * gap) / 2;
  const oy = SIZE - 24 - (rows - 1) * gap;
  const out = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) out.push({ x: ox + c * gap, y: oy + r * gap });
  return out;
}

/** Tanecik kutusu: katı titreşir, sıvı kayar, gaz uçuşur; hız sıcaklıkla artar */
export function ParticleBox({ el, phase, T, reduced }: { el: ElementData; phase: Phase; T: number; reduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parts = useRef<P[]>([]);
  const state = useRef({ phase, T, el, reduced });
  state.current = { phase, T, el, reduced };

  useEffect(() => {
    const home = lattice();
    parts.current = home.map((h) => ({
      x: h.x,
      y: h.y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      hx: h.x,
      hy: h.y,
    }));
  }, [el.z]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.scale(dpr, dpr);
    let raf = 0;
    let t = 0;

    const frame = () => {
      const { phase: ph, T: temp, el: e, reduced: red } = state.current;
      t += 1;
      const kelvin = temp + 273.15;
      const speedScale = red ? 0.35 : 1;
      ctx.clearRect(0, 0, SIZE, SIZE);
      const color = FAMILIES[e.family].color;
      const ps = parts.current;

      if (ph === 'kati') {
        const melt = e.meltC ?? e.boilC ?? 1000;
        const ratio = Math.max(0, Math.min(1, kelvin / (melt + 273.15)));
        const amp = (0.6 + ratio * 4) * speedScale;
        for (let i = 0; i < ps.length; i++) {
          const p = ps[i];
          const tx = p.hx + Math.sin(t * 0.3 + i * 1.7) * amp;
          const ty = p.hy + Math.cos(t * 0.27 + i * 2.3) * amp;
          p.x += (tx - p.x) * 0.25;
          p.y += (ty - p.y) * 0.25;
        }
      } else if (ph === 'sivi' || ph === 'gaz') {
        const gas = ph === 'gaz';
        const base = gas ? Math.sqrt(kelvin / 300) * 2.6 : 1.1 + Math.min(1.5, kelvin / 2000);
        const sp = Math.min(gas ? 9 : 3, base) * speedScale;
        const top = gas ? PR : SIZE * 0.42;
        for (const p of ps) {
          p.vx += (Math.random() - 0.5) * 0.6;
          p.vy += (Math.random() - 0.5) * 0.6 + (gas ? 0 : 0.08);
          const v = Math.hypot(p.vx, p.vy) || 1;
          p.vx = (p.vx / v) * sp;
          p.vy = (p.vy / v) * sp;
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < PR) {
            p.x = PR;
            p.vx = Math.abs(p.vx);
          }
          if (p.x > SIZE - PR) {
            p.x = SIZE - PR;
            p.vx = -Math.abs(p.vx);
          }
          if (p.y > SIZE - PR) {
            p.y = SIZE - PR;
            p.vy = -Math.abs(p.vy);
          }
          if (p.y < top) {
            p.y += gas ? 0 : (top - p.y) * 0.2;
            if (gas) {
              p.y = top;
              p.vy = Math.abs(p.vy);
            } else p.vy = Math.abs(p.vy);
          }
        }
        if (!gas) {
          // sıvıda tanecikler birbirine yakın ama üst üste binmez
          for (let i = 0; i < ps.length; i++)
            for (let j = i + 1; j < ps.length; j++) {
              const dx = ps[j].x - ps[i].x;
              const dy = ps[j].y - ps[i].y;
              const d = Math.hypot(dx, dy);
              if (d > 0 && d < PR * 2.1) {
                const push = (PR * 2.1 - d) / 2;
                ps[i].x -= (dx / d) * push;
                ps[i].y -= (dy / d) * push;
                ps[j].x += (dx / d) * push;
                ps[j].y += (dy / d) * push;
              }
            }
        }
      }

      const alpha = ph === 'bilinmiyor' ? 0.25 : 1;
      for (const p of ps) {
        const g = ctx.createRadialGradient(p.x - 3, p.y - 3, 1, p.x, p.y, PR);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(1, color);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, PR, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (ph === 'bilinmiyor') {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 90px Baloo 2, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', SIZE / 2, SIZE / 2);
      }
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(frame);
    };
    const onVis = () => (document.hidden ? cancelAnimationFrame(raf) : start());
    start();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" style={{ width: SIZE, height: SIZE }} />;
}
