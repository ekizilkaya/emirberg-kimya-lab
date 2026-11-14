import { useEffect } from 'react';
import { useStore } from '../state/store';
import './ui.css';

function ToastItem({ id, text }: { id: number; text: string }) {
  const drop = useStore((s) => s.dropToast);
  useEffect(() => {
    const t = setTimeout(() => drop(id), 3800);
    return () => clearTimeout(t);
  }, [id, drop]);
  return (
    <button className="toast panel" onClick={() => drop(id)}>
      {text}
    </button>
  );
}

export function Toasts() {
  const toasts = useStore((s) => s.toasts);
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} id={t.id} text={t.text} />
      ))}
    </div>
  );
}
