import type { Effect, Tool } from '../../data/reactions';
import type { Substance } from '../../data/substances';

/**
 * Tepkime Kazanı efekt motoru (SPEC 9.4): sınırlı, parametreli yapı taşları.
 * Patlama ve parlama saniyede 3'ten fazla yanıp sönmez; "hareketi azalt" modunda sadeleşir.
 */

export const CW = 520;
export const CH = 440;

const BX = CW / 2; // kazan merkezi
const TOP = 150; // kazan ağzı
const BOTTOM = 400;
const HALF_TOP = 120;
const HALF_BOTTOM = 105;
const SURFACE = 275;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  r: number;
  color: string;
  kind: 'bubble' | 'foam' | 'flame' | 'spark' | 'smoke' | 'fog' | 'drop' | 'crystal' | 'oil' | 'steam' | 'debris';
  outside?: boolean;
}

export interface SceneInput {
  inputs: Substance[];
  tool: Tool | null;
  reduced: boolean;
}

export interface RunConfig {
  effects: Effect[];
  started: number;
  duration: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(a: string, b: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  const k = Math.max(0, Math.min(1, t));
  return `rgb(${Math.round(r1 + (r2 - r1) * k)},${Math.round(g1 + (g2 - g1) * k)},${Math.round(b1 + (b2 - b1) * k)})`;
}

function rgba(hex: string, a: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

function halfWidthAt(y: number): number {
  const t = (y - TOP) / (BOTTOM - TOP);
  return HALF_TOP + (HALF_BOTTOM - HALF_TOP) * t;
}

export function effectDuration(effects: Effect[]): number {
  let d = 3600;
  for (const e of effects) {
    if (e.type === 'patlama') d = Math.max(d, 2600);
    if (e.type === 'zaman-kaplama') d = Math.max(d, 4600);
    if (e.type === 'kopuk-tasma' && (e.params?.size ?? 1) >= 3) d = Math.max(d, 4600);
    if (e.type === 'hicbir-sey') d = Math.max(d, 2200);
  }
  return d;
}

export class CauldronRenderer {
  private ctx: CanvasRenderingContext2D;
  private parts: Particle[] = [];
  private scene: SceneInput = { inputs: [], tool: null, reduced: false };
  private run: RunConfig | null = null;
  /** Son oynatılan efektler: tepkime bitince sonuç görünümü (tükenen metal, kaplanan çivi) korunur */
  private lastEffects: Effect[] = [];
  private liquidColor: string | null = null;
  private foamLevel = 0;
  private foamColor = '#ffffff';
  private oilLevel = 0;
  private flash = 0;
  private glow = 0;
  private ring = 0;
  private metalX = BX;
  private metalDir = 1;
  private coat = 0;
  private dissolved = 0;
  onShake: (() => void) | null = null;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  setScene(s: SceneInput): void {
    const changed = s.inputs.map((x) => x.id).join() !== this.scene.inputs.map((x) => x.id).join();
    this.scene = s;
    if (changed && !this.run) this.resetState();
  }

  private baseLiquid(): string | null {
    const liquids = this.scene.inputs.filter((x) => x.look.form === 'sivi');
    if (liquids.length === 0) return null;
    if (liquids.length === 1) return liquids[0].look.color;
    return mix(liquids[0].look.color, liquids[1].look.color, 0.5);
  }

  private resetState(): void {
    this.lastEffects = [];
    this.parts = [];
    this.liquidColor = this.baseLiquid();
    this.foamLevel = 0;
    this.oilLevel = 0;
    this.flash = 0;
    this.glow = 0;
    this.ring = 0;
    this.coat = 0;
    this.dissolved = 0;
    this.metalX = BX;
  }

  start(cfg: RunConfig): void {
    this.resetState();
    this.run = cfg;
    this.lastEffects = cfg.effects;
    for (const e of cfg.effects) {
      if (e.type === 'patlama') {
        this.flash = this.scene.reduced ? 0.25 : 1;
        this.ring = 1;
        if (!this.scene.reduced) this.onShake?.();
        const n = (e.params?.size ?? 1) * 40;
        for (let i = 0; i < n; i++) {
          const a = Math.random() * Math.PI * 2;
          const sp = 2 + Math.random() * 6 * (e.params?.size ?? 1);
          this.parts.push({
            x: BX, y: TOP + 30, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2, life: 0,
            max: 50 + Math.random() * 40, r: 2 + Math.random() * 3,
            color: i % 3 === 0 ? '#ffd43b' : i % 3 === 1 ? '#ff922b' : '#fff', kind: 'debris',
          });
        }
      }
    }
  }

  stop(): void {
    this.run = null;
  }

  get running(): boolean {
    return !!this.run;
  }

  // ---------------- çizim ----------------
  draw(now: number): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CW, CH);
    const t = this.run ? (now - this.run.started) / this.run.duration : 0;
    const active = this.run && t < 1;
    if (this.run && t >= 1.25) this.run = null;

    if (this.scene.tool === 'ates') this.drawBurner(now);
    this.drawBeakerBack();

    if (active) this.update(now, t);
    else if (!this.run) this.idle(now);

    this.drawContents(now);
    this.drawParticles();
    this.drawBeakerFront();
    if (this.scene.tool === 'elektrik') this.drawElectrodes(now);
    this.drawOverlays(now, t);
  }

  private idle(now: number): void {
    // Kazandaki gaz/sıvı hafifçe dalgalanır; parçacıklar söner
    this.parts = this.parts.filter((p) => p.life < p.max);
    for (const p of this.parts) this.step(p);
    if (this.flash > 0) this.flash *= 0.85;
    if (this.glow > 0) this.glow *= 0.94;
    void now;
  }

  private spawn(p: Omit<Particle, 'life'>): void {
    if (this.parts.length > 700) return;
    this.parts.push({ ...p, life: 0 });
  }

  private update(now: number, t: number): void {
    const run = this.run!;
    const reduced = this.scene.reduced;
    const rate = reduced ? 0.5 : 1;
    for (const e of run.effects) {
      const P = e.params ?? {};
      switch (e.type) {
        case 'kabarcik': {
          const sp = P.speed ?? 2;
          const n = Math.random() < 0.4 * sp * rate ? Math.ceil(sp * rate) : 0;
          for (let i = 0; i < n; i++) {
            if (P.twoSided) {
              const left = Math.random() < 0.66;
              this.spawn({ x: BX + (left ? -55 : 55) + (Math.random() - 0.5) * 16, y: BOTTOM - 30, vx: 0, vy: -1.4 - Math.random(), max: 120, r: 2 + Math.random() * 3, color: '#ffffff', kind: 'bubble' });
            } else {
              const hw = halfWidthAt(BOTTOM - 10) - 14;
              this.spawn({ x: BX + (Math.random() * 2 - 1) * hw, y: BOTTOM - 12, vx: 0, vy: -0.8 - Math.random() * sp * 0.6, max: 140, r: 2 + Math.random() * 4, color: '#ffffff', kind: 'bubble' });
            }
          }
          break;
        }
        case 'kopuk-tasma': {
          const size = P.size ?? 2;
          this.foamColor = P.color ?? '#ffffff';
          this.dissolved = Math.min(1, t / 0.6); // toz (karbonat, maya) tepkimede tükenir
          const target = size === 3 ? 380 : size === 2 ? 190 : 120;
          this.foamLevel = Math.min(target, this.foamLevel + (size === 3 ? 3.2 : 1.6) * rate);
          const n = Math.ceil(3 * size * rate);
          for (let i = 0; i < n; i++) {
            const top = SURFACE - this.foamLevel;
            const hw = halfWidthAt(Math.max(TOP, top)) - 10;
            this.spawn({ x: BX + (Math.random() * 2 - 1) * hw, y: Math.max(top, 20) + Math.random() * 20, vx: (Math.random() - 0.5) * 0.6, vy: -0.3 - Math.random() * 0.4, max: 60, r: 7 + Math.random() * 10, color: P.color ?? '#fff', kind: 'foam' });
          }
          if (SURFACE - this.foamLevel < TOP + 10) {
            for (let i = 0; i < size * rate; i++) {
              const side = Math.random() < 0.5 ? -1 : 1;
              this.spawn({ x: BX + side * (HALF_TOP + 4), y: TOP + 4, vx: side * (0.6 + Math.random()), vy: 0.5, max: 140, r: 7 + Math.random() * 8, color: P.color ?? '#fff', kind: 'foam', outside: true });
            }
          }
          break;
        }
        case 'alev': {
          const size = P.size ?? 2;
          const n = Math.ceil((2 + size * 2) * rate);
          for (let i = 0; i < n; i++) {
            this.spawn({ x: BX + (Math.random() - 0.5) * 30 * size, y: TOP - 2, vx: (Math.random() - 0.5) * 0.8, vy: -1.4 - Math.random() * size, max: 30 + size * 10, r: 6 + Math.random() * 5 * size, color: P.color ?? '#ff922b', kind: 'flame' });
          }
          break;
        }
        case 'patlama': {
          if (Math.random() < 0.5 * rate) this.spawn({ x: BX + (Math.random() - 0.5) * 60, y: TOP + 10, vx: (Math.random() - 0.5), vy: -1 - Math.random(), max: 90, r: 14 + Math.random() * 14, color: '#adb5bd', kind: 'smoke' });
          break;
        }
        case 'renk-degisimi': {
          const k = Math.min(1, t / 0.45);
          this.liquidColor = mix(P.color ?? '#ffffff', P.to ?? '#ffffff', k);
          if (Math.random() < 0.5 * rate) {
            const a = Math.random() * Math.PI * 2;
            this.spawn({ x: BX + Math.cos(a) * 60, y: SURFACE + 50 + Math.sin(a) * 30, vx: -Math.sin(a) * 1.2, vy: Math.cos(a) * 0.6, max: 40, r: 3, color: P.to ?? '#fff', kind: 'drop' });
          }
          break;
        }
        case 'parlak-isik': {
          // tek bir yükseliş ve sönüş (yanıp sönme yok)
          this.glow = (t < 0.35 ? t / 0.35 : Math.max(0, 1 - (t - 0.35) / 0.65)) * (reduced ? 0.4 : 1);
          if (Math.random() < 0.6 * rate) {
            const a = Math.random() * Math.PI * 2;
            this.spawn({ x: BX, y: SURFACE - 30, vx: Math.cos(a) * 4, vy: Math.sin(a) * 4 - 1, max: 30, r: 2, color: P.color ?? '#fff', kind: 'spark' });
          }
          break;
        }
        case 'sis': {
          if (Math.random() < 0.7 * rate) {
            const side = Math.random() < 0.5 ? -1 : 1;
            this.spawn({ x: BX + (Math.random() - 0.5) * 160, y: SURFACE - 10, vx: side * (0.3 + Math.random() * 0.6), vy: -0.6 - Math.random() * 0.4, max: 160, r: 18 + Math.random() * 18, color: '#f1f3f5', kind: 'fog' });
          }
          if (Math.random() < 0.6 * rate) this.spawn({ x: BX + (Math.random() - 0.5) * 120, y: BOTTOM - 20, vx: 0, vy: -2, max: 70, r: 3 + Math.random() * 4, color: '#fff', kind: 'bubble' });
          break;
        }
        case 'fiskiye': {
          const n = t < 0.7 ? Math.ceil(6 * rate) : 0;
          for (let i = 0; i < n; i++) {
            this.spawn({ x: BX + (Math.random() - 0.5) * 14, y: TOP, vx: (Math.random() - 0.5) * 3, vy: -9 - Math.random() * 5, max: 90, r: 3 + Math.random() * 4, color: i % 3 ? '#8a5a2b' : '#f8f0e3', kind: 'drop' });
          }
          break;
        }
        case 'kivilcim': {
          const n = Math.ceil(5 * rate);
          for (let i = 0; i < n; i++) {
            const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4;
            const sp = 3 + Math.random() * 5;
            this.spawn({ x: BX + (Math.random() - 0.5) * 50, y: BOTTOM - 40, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, max: 45, r: 2, color: Math.random() < 0.5 ? '#ffd43b' : '#ff922b', kind: 'spark' });
          }
          break;
        }
        case 'zaman-kaplama': {
          this.coat = Math.min(1, t / 0.8);
          break;
        }
        case 'cozunme': {
          this.dissolved = Math.min(1, t / 0.8);
          if (t < 0.3 && Math.random() < 0.6 * rate) {
            this.spawn({ x: BX + (Math.random() - 0.5) * 80, y: TOP - 20, vx: 0, vy: 1.5 + Math.random(), max: 90, r: 5, color: '#ffffff', kind: 'crystal' });
          }
          break;
        }
        case 'katman': {
          this.oilLevel = Math.min(46, this.oilLevel + 0.4 * rate);
          if (Math.random() < 0.4 * rate) this.spawn({ x: BX + (Math.random() - 0.5) * 160, y: BOTTOM - 20, vx: 0, vy: -1 - Math.random(), max: 120, r: 6 + Math.random() * 6, color: '#e9d544', kind: 'oil' });
          break;
        }
        case 'suda-kayan-metal': {
          const k = P.intensity ?? 1;
          const hw = halfWidthAt(SURFACE) - 24;
          this.metalX += this.metalDir * (1.5 + k * 2.2) * (reduced ? 0.5 : 1);
          if (this.metalX > BX + hw || this.metalX < BX - hw) {
            this.metalDir *= -1;
            this.metalX = Math.max(BX - hw, Math.min(BX + hw, this.metalX));
          }
          for (let i = 0; i < k * 2 * rate; i++) this.spawn({ x: this.metalX + (Math.random() - 0.5) * 20, y: SURFACE, vx: (Math.random() - 0.5) * 2, vy: -1 - Math.random() * 2, max: 25, r: 2 + Math.random() * 2, color: '#ffffff', kind: 'steam' });
          if (P.color && t > 0.15) {
            for (let i = 0; i < k * rate; i++) this.spawn({ x: this.metalX + (Math.random() - 0.5) * 14, y: SURFACE - 10, vx: (Math.random() - 0.5) * 0.6, vy: -1.5 - Math.random() * k, max: 25 + k * 6, r: 5 + Math.random() * 4 * k, color: P.color, kind: 'flame' });
          }
          break;
        }
        case 'buhar': {
          const light = (P.size ?? 2) === 1;
          if (Math.random() < (light ? 0.3 : 0.8) * rate) this.spawn({ x: BX + (Math.random() - 0.5) * 160, y: TOP - 5, vx: (Math.random() - 0.5) * 0.5, vy: -0.8 - Math.random(), max: 120, r: 10 + Math.random() * 14, color: '#f8f9fa', kind: 'steam' });
          if (!light && Math.random() < 0.8 * rate) this.spawn({ x: BX + (Math.random() - 0.5) * 160, y: BOTTOM - 14, vx: 0, vy: -2.5, max: 50, r: 3 + Math.random() * 5, color: '#fff', kind: 'bubble' });
          break;
        }
        case 'hicbir-sey':
          break;
      }
    }
    this.parts = this.parts.filter((p) => p.life < p.max);
    for (const p of this.parts) this.step(p);
    if (this.flash > 0) this.flash *= 0.86;
    if (this.ring > 0) this.ring += 6;
    void now;
  }

  private step(p: Particle): void {
    p.life++;
    switch (p.kind) {
      case 'bubble':
        p.y += p.vy;
        p.x += Math.sin((p.life + p.x) * 0.2) * 0.4;
        if (p.y < SURFACE && this.liquidColor) p.life = p.max;
        if (p.y < TOP) p.life = p.max;
        break;
      case 'foam':
        p.x += p.vx;
        p.y += p.vy;
        if (p.outside) {
          p.vy += 0.15;
          if (p.y > BOTTOM + 20) p.life = p.max;
        }
        break;
      case 'flame':
        p.x += p.vx + Math.sin(p.life * 0.4) * 0.5;
        p.y += p.vy;
        p.r *= 0.965;
        break;
      case 'spark':
      case 'debris':
      case 'drop':
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.kind === 'drop' ? 0.35 : 0.18;
        break;
      case 'smoke':
      case 'steam':
      case 'fog':
        p.x += p.vx;
        p.y += p.vy;
        p.r *= 1.008;
        if (p.kind === 'fog' && p.y < TOP - 10) {
          p.vy = 0.6;
          p.vx *= 1.01;
        }
        break;
      case 'crystal':
        p.y += p.vy;
        if (p.y > SURFACE) {
          p.vy = 0.5;
          p.r *= 0.95;
        }
        break;
      case 'oil':
        p.y += p.vy;
        if (p.y < SURFACE + this.oilLevel - 4) p.life = p.max;
        break;
    }
  }

  private drawBurner(now: number): void {
    const ctx = this.ctx;
    ctx.fillStyle = '#495057';
    ctx.fillRect(BX - 30, BOTTOM + 14, 60, 22);
    ctx.fillStyle = '#343a40';
    ctx.fillRect(BX - 50, BOTTOM + 34, 100, 6);
    const flick = Math.sin(now / 70) * 3;
    const g = ctx.createRadialGradient(BX, BOTTOM + 6, 2, BX, BOTTOM + 6, 24 + flick);
    g.addColorStop(0, 'rgba(255,255,255,.95)');
    g.addColorStop(0.3, 'rgba(77,171,247,.9)');
    g.addColorStop(1, 'rgba(77,171,247,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(BX, BOTTOM + 4, 18, 18 + flick, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  private beakerPath(): void {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(BX - HALF_TOP, TOP);
    ctx.lineTo(BX - HALF_BOTTOM, BOTTOM - 18);
    ctx.quadraticCurveTo(BX - HALF_BOTTOM, BOTTOM, BX - HALF_BOTTOM + 18, BOTTOM);
    ctx.lineTo(BX + HALF_BOTTOM - 18, BOTTOM);
    ctx.quadraticCurveTo(BX + HALF_BOTTOM, BOTTOM, BX + HALF_BOTTOM, BOTTOM - 18);
    ctx.lineTo(BX + HALF_TOP, TOP);
  }

  private drawBeakerBack(): void {
    const ctx = this.ctx;
    this.beakerPath();
    ctx.closePath();
    ctx.fillStyle = 'rgba(180,200,255,.08)';
    ctx.fill();
  }

  private drawContents(now: number): void {
    const ctx = this.ctx;
    const gas = this.scene.inputs.find((x) => x.look.form === 'gaz');
    ctx.save();
    this.beakerPath();
    ctx.closePath();
    ctx.clip();
    if (gas) {
      const g2 = this.scene.inputs.filter((x) => x.look.form === 'gaz');
      ctx.fillStyle = rgba(g2[0].look.color, 0.16);
      ctx.fillRect(0, TOP, CW, BOTTOM - TOP);
      if (g2[1]) {
        ctx.fillStyle = rgba(g2[1].look.color, 0.12);
        ctx.fillRect(BX, TOP, CW, BOTTOM - TOP);
      }
    }
    const liquid = this.liquidColor;
    if (liquid) {
      const wob = this.run || this.scene.inputs.length ? Math.sin(now / 400) * 3 : 0;
      ctx.beginPath();
      ctx.moveTo(0, SURFACE);
      for (let x = 0; x <= CW; x += 20) ctx.lineTo(x, SURFACE + Math.sin(x / 40 + now / 300) * wob);
      ctx.lineTo(CW, CH);
      ctx.lineTo(0, CH);
      ctx.closePath();
      const g = ctx.createLinearGradient(0, SURFACE, 0, BOTTOM);
      g.addColorStop(0, liquid.startsWith('rgb') ? liquid : rgba(liquid, 0.85));
      g.addColorStop(1, liquid.startsWith('rgb') ? liquid : rgba(liquid, 0.95));
      ctx.fillStyle = g;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;
      if (this.oilLevel > 0) {
        ctx.fillStyle = 'rgba(233,213,68,.85)';
        ctx.fillRect(0, SURFACE, CW, this.oilLevel);
      }
    }
    // Katılar ve tozlar
    const solids = this.scene.inputs.filter((x) => x.look.form === 'kati' || x.look.form === 'toz');
    const fx = this.run?.effects ?? this.lastEffects;
    const sliding = fx.some((e) => e.type === 'suda-kayan-metal');
    const consumed = sliding && !this.run;
    const coating = fx.find((e) => e.type === 'zaman-kaplama');
    solids.forEach((s, i) => {
      const x = BX + (solids.length === 1 ? 0 : i === 0 ? -50 : 50);
      if (sliding && i === 0 && liquid) {
        // suda kayan metal topu; tepkime bitince tükenmiştir
        if (consumed) return;
        ctx.fillStyle = '#ced4da';
        ctx.beginPath();
        ctx.arc(this.metalX, SURFACE - 4, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.7)';
        ctx.beginPath();
        ctx.arc(this.metalX - 4, SURFACE - 8, 4, 0, Math.PI * 2);
        ctx.fill();
        return;
      }
      if (s.look.form === 'toz') {
        const amount = 1 - this.dissolved;
        if (amount <= 0.02) return;
        ctx.fillStyle = s.look.color;
        ctx.globalAlpha = amount;
        ctx.beginPath();
        ctx.ellipse(x, BOTTOM - 8, 46 * amount + 8, 12 * amount + 3, 0, Math.PI, 0);
        ctx.fill();
        ctx.globalAlpha = 1;
        return;
      }
      if (coating && (s.id === 'demir-civi' || s.id === 'bakir' || s.id === 'altin')) {
        // metal nesne + kaplama
        ctx.save();
        ctx.translate(x, BOTTOM - 40);
        ctx.rotate(-0.5);
        ctx.fillStyle = s.look.color;
        ctx.fillRect(-60, -7, 120, 14);
        ctx.fillRect(-66, -13, 10, 26);
        ctx.globalAlpha = this.coat * 0.85;
        ctx.fillStyle = coating.params?.color ?? s.look.color;
        ctx.fillRect(-60, -7, 120, 14);
        ctx.fillRect(-66, -13, 10, 26);
        ctx.restore();
        ctx.globalAlpha = 1;
        return;
      }
      ctx.font = '44px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(s.icon, x, BOTTOM - 30);
    });
    ctx.restore();
  }

  private drawParticles(): void {
    const ctx = this.ctx;
    for (const p of this.parts) {
      const a = 1 - p.life / p.max;
      switch (p.kind) {
        case 'bubble':
          ctx.strokeStyle = `rgba(255,255,255,${0.8 * a + 0.2})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.stroke();
          break;
        case 'flame': {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          g.addColorStop(0, `rgba(255,255,230,${a})`);
          g.addColorStop(0.4, rgba(p.color, a * 0.9));
          g.addColorStop(1, rgba(p.color, 0));
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
        case 'foam':
          ctx.fillStyle = p.color.startsWith('#') ? rgba(p.color, 0.95) : p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'smoke':
        case 'steam':
        case 'fog':
          ctx.fillStyle = rgba(p.color, (p.kind === 'fog' ? 0.35 : 0.3) * a);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'crystal':
          ctx.fillStyle = `rgba(255,255,255,${a})`;
          ctx.fillRect(p.x - p.r / 2, p.y - p.r / 2, p.r, p.r);
          break;
        case 'oil':
          ctx.fillStyle = 'rgba(233,213,68,.9)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          break;
        default:
          ctx.fillStyle = p.color.startsWith('#') ? rgba(p.color, a) : p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
      }
    }
    // Köpük sütunu (fil diş macunu ve volkan)
    if (this.foamLevel > 0) {
      const color = this.foamColor;
      const top = Math.max(10, SURFACE - this.foamLevel);
      ctx.fillStyle = rgba(color, 0.92);
      ctx.beginPath();
      const hwTop = Math.min(HALF_TOP, halfWidthAt(Math.max(TOP, top))) - 6;
      ctx.moveTo(BX - halfWidthAt(SURFACE) + 6, SURFACE + 10);
      ctx.lineTo(BX - hwTop, Math.max(top, TOP));
      if (top < TOP) ctx.lineTo(BX - 40, top);
      if (top < TOP) ctx.lineTo(BX + 40, top);
      ctx.lineTo(BX + hwTop, Math.max(top, TOP));
      ctx.lineTo(BX + halfWidthAt(SURFACE) - 6, SURFACE + 10);
      ctx.closePath();
      ctx.fill();
    }
  }

  private drawBeakerFront(): void {
    const ctx = this.ctx;
    this.beakerPath();
    ctx.strokeStyle = 'rgba(210,225,255,.85)';
    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.stroke();
    // ağız kenarı
    ctx.beginPath();
    ctx.moveTo(BX - HALF_TOP - 10, TOP);
    ctx.lineTo(BX + HALF_TOP + 10, TOP);
    ctx.stroke();
    // cam parıltısı
    ctx.strokeStyle = 'rgba(255,255,255,.25)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(BX - HALF_TOP + 22, TOP + 20);
    ctx.lineTo(BX - HALF_BOTTOM + 20, BOTTOM - 40);
    ctx.stroke();
  }

  private drawElectrodes(now: number): void {
    const ctx = this.ctx;
    for (const side of [-1, 1]) {
      const x = BX + side * 55;
      ctx.fillStyle = '#868e96';
      ctx.fillRect(x - 5, TOP - 50, 10, BOTTOM - TOP + 10);
      ctx.fillStyle = side < 0 ? '#1c7ed6' : '#e03131';
      ctx.fillRect(x - 9, TOP - 64, 18, 16);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(side < 0 ? '−' : '+', x, TOP - 52);
    }
    ctx.strokeStyle = `rgba(255,212,59,${0.5 + Math.sin(now / 120) * 0.3})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(BX - 55, TOP - 64);
    ctx.quadraticCurveTo(BX, TOP - 110, BX + 55, TOP - 64);
    ctx.stroke();
    ctx.font = '26px "Segoe UI Emoji", sans-serif';
    ctx.fillText('🔋', BX, TOP - 96);
  }

  private drawOverlays(now: number, t: number): void {
    const ctx = this.ctx;
    if (this.glow > 0.01) {
      const color = this.run?.effects.find((e) => e.type === 'parlak-isik')?.params?.color ?? '#ffffff';
      const g = ctx.createRadialGradient(BX, SURFACE - 20, 10, BX, SURFACE - 20, 260);
      g.addColorStop(0, rgba(color, 0.95 * this.glow));
      g.addColorStop(1, rgba(color, 0));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, CW, CH);
    }
    if (this.ring > 0 && this.ring < 300) {
      ctx.strokeStyle = `rgba(255,255,255,${1 - this.ring / 300})`;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(BX, TOP + 30, this.ring, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (this.flash > 0.02) {
      ctx.fillStyle = `rgba(255,250,230,${this.flash * 0.85})`;
      ctx.fillRect(0, 0, CW, CH);
    }
    const timeFx = this.run?.effects.find((e) => e.type === 'zaman-kaplama');
    if ((timeFx || this.scene.tool === 'zaman') && this.run && t < 1) {
      // dönen saat
      const cx = CW - 60;
      const cy = 60;
      ctx.fillStyle = 'rgba(16,19,47,.85)';
      ctx.beginPath();
      ctx.arc(cx, cy, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();
      const a1 = (now / 60) % (Math.PI * 2);
      const a2 = (now / 700) % (Math.PI * 2);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a1) * 26, cy + Math.sin(a1) * 26);
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a2) * 16, cy + Math.sin(a2) * 16);
      ctx.stroke();
    }
  }
}
