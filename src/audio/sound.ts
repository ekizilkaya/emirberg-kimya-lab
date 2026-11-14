/**
 * Web Audio API ile sentezlenen kısa ses efektleri (dış dosya yok).
 * Tarayıcı kuralı gereği bağlam ilk kullanıcı etkileşiminde oluşturulur.
 */

export type SoundName =
  | 'click'
  | 'proton'
  | 'neutron'
  | 'electron'
  | 'remove'
  | 'bond'
  | 'unbond'
  | 'discover'
  | 'star'
  | 'badge'
  | 'rank'
  | 'quest'
  | 'fizz'
  | 'pop'
  | 'boom'
  | 'bubble'
  | 'whoosh'
  | 'phase'
  | 'nope'
  | 'card'
  | 'sparkle'
  | 'tick';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = true;
let volume = 0.6;

export function configureSound(opts: { enabled: boolean; volume: number }): void {
  enabled = opts.enabled;
  volume = opts.volume;
  if (master) master.gain.value = volume;
}

function ensure(): AudioContext | null {
  if (!enabled) return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = volume;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  freq: number,
  dur: number,
  opts: { type?: OscillatorType; gain?: number; delay?: number; slideTo?: number } = {},
): void {
  const c = ensure();
  if (!c || !master) return;
  const t0 = c.currentTime + (opts.delay ?? 0);
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = opts.type ?? 'sine';
  osc.frequency.setValueAtTime(freq, t0);
  if (opts.slideTo) osc.frequency.exponentialRampToValueAtTime(opts.slideTo, t0 + dur);
  const peak = opts.gain ?? 0.25;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function noise(dur: number, opts: { gain?: number; delay?: number; filter?: number; q?: number; type?: BiquadFilterType } = {}): void {
  const c = ensure();
  if (!c || !master) return;
  const t0 = c.currentTime + (opts.delay ?? 0);
  const len = Math.max(1, Math.floor(c.sampleRate * dur));
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = opts.type ?? 'bandpass';
  f.frequency.value = opts.filter ?? 2000;
  f.Q.value = opts.q ?? 0.8;
  const g = c.createGain();
  const peak = opts.gain ?? 0.2;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(f).connect(g).connect(master);
  src.start(t0);
  src.stop(t0 + dur + 0.05);
}

export function play(name: SoundName): void {
  if (!enabled) return;
  switch (name) {
    case 'click':
      tone(660, 0.06, { type: 'triangle', gain: 0.12 });
      break;
    case 'tick':
      tone(1200, 0.03, { type: 'square', gain: 0.04 });
      break;
    case 'proton':
      tone(523, 0.12, { type: 'triangle', gain: 0.22 });
      break;
    case 'neutron':
      tone(392, 0.12, { type: 'sine', gain: 0.22 });
      break;
    case 'electron':
      tone(784, 0.1, { type: 'sine', gain: 0.18, slideTo: 1046 });
      break;
    case 'remove':
      tone(440, 0.1, { type: 'triangle', gain: 0.15, slideTo: 260 });
      break;
    case 'bond':
      tone(440, 0.08, { type: 'triangle', gain: 0.18 });
      tone(660, 0.12, { type: 'triangle', gain: 0.18, delay: 0.07 });
      break;
    case 'unbond':
      tone(500, 0.12, { type: 'triangle', gain: 0.14, slideTo: 300 });
      break;
    case 'card':
      tone(880, 0.08, { type: 'sine', gain: 0.12 });
      tone(1320, 0.12, { type: 'sine', gain: 0.1, delay: 0.06 });
      break;
    case 'star':
      tone(988, 0.1, { type: 'triangle', gain: 0.16 });
      tone(1319, 0.18, { type: 'triangle', gain: 0.16, delay: 0.08 });
      break;
    case 'discover':
      [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.18, { type: 'triangle', gain: 0.18, delay: i * 0.09 }));
      break;
    case 'quest':
      [659, 880, 1175].forEach((f, i) => tone(f, 0.16, { type: 'square', gain: 0.07, delay: i * 0.1 }));
      break;
    case 'badge':
      [523, 659, 784, 1046, 1319].forEach((f, i) => tone(f, 0.22, { type: 'triangle', gain: 0.18, delay: i * 0.08 }));
      noise(0.5, { gain: 0.05, filter: 6000, delay: 0.3 });
      break;
    case 'rank':
      [392, 523, 659, 784, 1046].forEach((f, i) => tone(f, 0.3, { type: 'sawtooth', gain: 0.06, delay: i * 0.12 }));
      [523, 659, 784].forEach((f) => tone(f, 0.8, { type: 'triangle', gain: 0.12, delay: 0.65 }));
      break;
    case 'fizz':
      noise(1.2, { gain: 0.12, filter: 5000, q: 0.5, type: 'highpass' });
      break;
    case 'pop':
      tone(180, 0.15, { type: 'sine', gain: 0.4, slideTo: 60 });
      noise(0.12, { gain: 0.25, filter: 1500 });
      break;
    case 'boom':
      tone(90, 0.7, { type: 'sine', gain: 0.5, slideTo: 30 });
      noise(0.9, { gain: 0.35, filter: 400, type: 'lowpass' });
      break;
    case 'bubble':
      for (let i = 0; i < 6; i++) tone(300 + Math.random() * 500, 0.08, { type: 'sine', gain: 0.1, delay: i * 0.12, slideTo: 900 });
      break;
    case 'whoosh':
      noise(0.6, { gain: 0.12, filter: 900, q: 1.5 });
      break;
    case 'phase':
      tone(600, 0.15, { type: 'sine', gain: 0.18, slideTo: 900 });
      tone(900, 0.2, { type: 'sine', gain: 0.12, delay: 0.12 });
      break;
    case 'nope':
      tone(300, 0.12, { type: 'triangle', gain: 0.14 });
      tone(240, 0.16, { type: 'triangle', gain: 0.14, delay: 0.1 });
      break;
    case 'sparkle':
      for (let i = 0; i < 5; i++) tone(1500 + Math.random() * 1500, 0.08, { type: 'sine', gain: 0.06, delay: i * 0.06 });
      break;
  }
}
