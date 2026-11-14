import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * Pointer Events tabanlı basit sürükle-bırak.
 * Kaynak: <button onPointerDown={(e) => beginDrag(e, payload, ghost)} onClick={...}>
 * Hedef: data-drop="kimlik" özniteliği + useDropTarget("kimlik", handler)
 */

export interface DragPayload {
  kind: 'particle' | 'atom' | 'substance';
  value: string;
}

type DropHandler = (payload: DragPayload, point: { x: number; y: number }, target: HTMLElement) => void;

const handlers = new Map<string, DropHandler>();
type Listener = (s: GhostState | null) => void;
const listeners = new Set<Listener>();

interface GhostState {
  x: number;
  y: number;
  node: ReactNode;
  over: string | null;
}

let ghost: GhostState | null = null;
let suppressClickUntil = 0;

function emitGhost(): void {
  for (const l of listeners) l(ghost);
}

function dropIdAt(x: number, y: number): { id: string; el: HTMLElement } | null {
  const el = document.elementFromPoint(x, y) as HTMLElement | null;
  const target = el?.closest('[data-drop]') as HTMLElement | null;
  if (!target) return null;
  return { id: target.dataset.drop!, el: target };
}

/** Sürükleme gerçekleştiyse ardından gelen click olayını yut */
export function consumeDragClick(): boolean {
  return Date.now() < suppressClickUntil;
}

export function beginDrag(
  e: React.PointerEvent,
  payload: DragPayload,
  node: ReactNode,
  opts: { onDropOutside?: (point: { x: number; y: number }) => void } = {},
): void {
  if (e.button !== 0) return;
  const startX = e.clientX;
  const startY = e.clientY;
  let dragging = false;

  const move = (ev: PointerEvent) => {
    if (!dragging) {
      if (Math.hypot(ev.clientX - startX, ev.clientY - startY) < 6) return;
      dragging = true;
      document.body.style.cursor = 'grabbing';
    }
    const over = dropIdAt(ev.clientX, ev.clientY);
    ghost = { x: ev.clientX, y: ev.clientY, node, over: over?.id ?? null };
    emitGhost();
  };
  const up = (ev: PointerEvent) => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
    window.removeEventListener('pointercancel', cancel);
    document.body.style.cursor = '';
    if (!dragging) return;
    suppressClickUntil = Date.now() + 250;
    ghost = null;
    emitGhost();
    const target = dropIdAt(ev.clientX, ev.clientY);
    const point = { x: ev.clientX, y: ev.clientY };
    if (target && handlers.has(target.id)) handlers.get(target.id)!(payload, point, target.el);
    else opts.onDropOutside?.(point);
  };
  const cancel = () => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
    window.removeEventListener('pointercancel', cancel);
    document.body.style.cursor = '';
    ghost = null;
    emitGhost();
  };
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', cancel);
}

export function useDropTarget(id: string, handler: DropHandler): void {
  useEffect(() => {
    handlers.set(id, handler);
    return () => {
      if (handlers.get(id) === handler) handlers.delete(id);
    };
  }, [id, handler]);
}

/** Hedefin üstünde sürükleme var mı? (vurgulama için) */
export function useDragOver(id: string): boolean {
  const [over, setOver] = useState(false);
  useEffect(() => {
    const l: Listener = (g) => setOver(!!g && g.over === id);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, [id]);
  return over;
}

export function DragLayer() {
  const [g, setG] = useState<GhostState | null>(null);
  useEffect(() => {
    listeners.add(setG);
    return () => {
      listeners.delete(setG);
    };
  }, []);
  if (!g) return null;
  return createPortal(
    <div
      style={{
        position: 'fixed',
        left: g.x,
        top: g.y,
        transform: 'translate(-50%, -50%) scale(1.1)',
        pointerEvents: 'none',
        zIndex: 9999,
        filter: 'drop-shadow(0 6px 12px rgba(0,0,0,.5))',
      }}
    >
      {g.node}
    </div>,
    document.body,
  );
}
