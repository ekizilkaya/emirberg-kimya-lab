import { create } from 'zustand';
import { play } from '../audio/sound';
import { getElement } from '../data/elements';
import { getMolecule } from '../data/molecules';
import { getQuest } from '../data/quests';
import { getReaction, type Tool } from '../data/reactions';
import type { BenchAtom, BenchBond } from '../domain/molecule';
import { createSave, fillActiveQuests, processEvent, replaceQuest } from '../domain/progress';
import type { GameEvent, Notification, SaveData } from '../domain/types';
import { tr } from '../i18n/tr';
import { loadSave, writeSave } from './persistence';

export type Mood = 'neutral' | 'surprised' | 'happy' | 'thinking';

export interface MascotLine {
  id: number;
  text: string;
  mood: Mood;
}

export interface Toast {
  id: number;
  text: string;
}

export interface AtomSession {
  p: number;
  n: number;
  e: number;
  target: number | null;
  randomLoaded: boolean;
}

export interface BenchSession {
  atoms: BenchAtom[];
  bonds: BenchBond[];
  pos: Record<string, { x: number; y: number }>;
  nextId: number;
}

export interface CauldronSession {
  inputs: string[];
  tool: Tool | null;
  autoMix: number;
}

export interface TempSession {
  T: number;
  pinned: number | null;
}

interface SayOptions {
  mood?: Mood;
  /** Tek seferlik (ya da sınırlı) öğretici mesaj anahtarı */
  key?: string;
  max?: number;
}

interface Store {
  save: SaveData;
  corruptRecovered: boolean;
  celebrations: Notification[];
  toasts: Toast[];
  mascot: MascotLine | null;
  questPanelOpen: boolean;
  settingsOpen: boolean;
  atom: AtomSession;
  bench: BenchSession;
  cauldron: CauldronSession;
  temp: TempSession;

  emit: (ev: GameEvent) => Notification[];
  updateSave: (fn: (s: SaveData) => SaveData) => void;
  replaceSave: (s: SaveData) => void;
  say: (text: string, opts?: SayOptions) => void;
  hushMascot: () => void;
  toast: (text: string) => void;
  dropToast: (id: number) => void;
  shiftCelebration: () => void;
  setQuestPanel: (open: boolean) => void;
  setSettings: (open: boolean) => void;
  swapQuest: (id: string) => void;
  setAtom: (a: Partial<AtomSession>) => void;
  setBench: (b: Partial<BenchSession>) => void;
  setCauldron: (c: Partial<CauldronSession>) => void;
  setTemp: (t: Partial<TempSession>) => void;
}

const initial = loadSave();
let seq = 1;
let lastSaid = { text: '', at: 0 };

function notificationToast(n: Notification): string | null {
  switch (n.kind) {
    case 'star':
      if (n.star === 'viewed') return null;
      return tr.notify.star(getElement(n.z).nameTr, tr.card.stars[n.star]);
    case 'molecule':
      return tr.notify.molecule(getMolecule(n.id)?.nameTr ?? n.id);
    case 'reaction':
      return tr.notify.reaction(getReaction(n.id)?.titleTr ?? n.id);
    case 'quest':
      return tr.notify.quest(getQuest(n.id)?.titleTr ?? n.id, n.kp);
    default:
      return null;
  }
}

export const useStore = create<Store>((set, get) => ({
  save: fillActiveQuests(initial.save),
  corruptRecovered: initial.corrupt,
  celebrations: [],
  toasts: [],
  mascot: null,
  questPanelOpen: false,
  settingsOpen: false,
  atom: { p: 0, n: 0, e: 0, target: null, randomLoaded: false },
  bench: { atoms: [], bonds: [], pos: {}, nextId: 1 },
  cauldron: { inputs: [], tool: null, autoMix: 0 },
  temp: { T: 25, pinned: null },

  emit: (ev) => {
    const { save, notifications } = processEvent(get().save, ev);
    if (notifications.length === 0 && save === get().save) return [];
    const celebrations = notifications.filter((n) => n.kind === 'badge' || n.kind === 'rank');
    const newToasts: Toast[] = [];
    for (const n of notifications) {
      // Molekül ve tepkime keşifleri kendi atölyesinde gösterilir
      if (n.kind === 'molecule' || n.kind === 'reaction') continue;
      const text = notificationToast(n);
      if (text) newToasts.push({ id: seq++, text });
    }
    if (notifications.some((n) => n.kind === 'quest')) play('quest');
    else if (notifications.some((n) => n.kind === 'star' && n.star !== 'viewed')) play('star');
    set((s) => ({
      save,
      celebrations: [...s.celebrations, ...celebrations],
      toasts: [...s.toasts, ...newToasts].slice(-5),
    }));
    return notifications;
  },

  updateSave: (fn) => set((s) => ({ save: fn(s.save) })),
  replaceSave: (save) => set({ save: fillActiveQuests(save), celebrations: [], toasts: [] }),

  say: (text, opts = {}) => {
    const s = get();
    const now = Date.now();
    if (opts.key) {
      const count = s.save.tipsSeen[opts.key] ?? 0;
      if (count >= (opts.max ?? 1)) return;
      set((st) => ({ save: { ...st.save, tipsSeen: { ...st.save.tipsSeen, [opts.key!]: count + 1 } } }));
    } else if (s.save.settings.mascotQuiet) {
      return;
    }
    if (lastSaid.text === text && now - lastSaid.at < 8000) return;
    lastSaid = { text, at: now };
    set({ mascot: { id: seq++, text, mood: opts.mood ?? 'neutral' } });
  },
  hushMascot: () => set({ mascot: null }),

  toast: (text) => set((s) => ({ toasts: [...s.toasts, { id: seq++, text }].slice(-5) })),
  dropToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  shiftCelebration: () => set((s) => ({ celebrations: s.celebrations.slice(1) })),
  setQuestPanel: (open) =>
    set((s) => ({ questPanelOpen: open, save: open ? fillActiveQuests(s.save) : s.save })),
  setSettings: (open) => set({ settingsOpen: open }),
  swapQuest: (id) => set((s) => ({ save: fillActiveQuests(replaceQuest(s.save, id)) })),

  setAtom: (a) => set((s) => ({ atom: { ...s.atom, ...a } })),
  setBench: (b) => set((s) => ({ bench: { ...s.bench, ...b } })),
  setCauldron: (c) => set((s) => ({ cauldron: { ...s.cauldron, ...c } })),
  setTemp: (t) => set((s) => ({ temp: { ...s.temp, ...t } })),
}));

// Kalıcı ilerleme her değişiklikte (gecikmeli) kaydedilir
useStore.subscribe((state, prev) => {
  if (state.save !== prev.save) writeSave(state.save);
});

export const emit = (ev: GameEvent) => useStore.getState().emit(ev);

export function resetAllProgress(name: string): void {
  useStore.getState().replaceSave(createSave(name));
}
