import { STORAGE_BACKUP_KEY, STORAGE_KEY } from '../data/config';
import { createSave, migrateSave } from '../domain/progress';
import type { SaveData } from '../domain/types';

function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export interface LoadResult {
  save: SaveData;
  corrupt: boolean;
  fresh: boolean;
}

/** Bozuk kayıtta çökmez: yedek anahtara taşır ve temiz başlar (SPEC 14.5) */
export function loadSave(): LoadResult {
  const raw = safeGet(STORAGE_KEY);
  if (!raw) return { save: createSave(), corrupt: false, fresh: true };
  try {
    return { save: migrateSave(JSON.parse(raw)), corrupt: false, fresh: false };
  } catch {
    safeSet(STORAGE_BACKUP_KEY, raw);
    return { save: createSave(), corrupt: true, fresh: true };
  }
}

let timer: ReturnType<typeof setTimeout> | null = null;
let pending: SaveData | null = null;

export function writeSave(save: SaveData, immediate = false): void {
  pending = save;
  if (timer) clearTimeout(timer);
  const flush = () => {
    if (pending) safeSet(STORAGE_KEY, JSON.stringify(pending));
    pending = null;
    timer = null;
  };
  if (immediate) flush();
  else timer = setTimeout(flush, 300);
}

export function flushSave(): void {
  if (pending) writeSave(pending, true);
}

export function exportSave(save: SaveData): void {
  const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `emirberg-kimya-lab-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function importSaveFile(file: File): Promise<SaveData> {
  const text = await file.text();
  return migrateSave(JSON.parse(text));
}
