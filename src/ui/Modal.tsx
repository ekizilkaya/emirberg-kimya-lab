import { useEffect, type ReactNode } from 'react';
import { tr } from '../i18n/tr';
import { Portal } from './Portal';
import './ui.css';

export function Modal({
  title,
  onClose,
  children,
  width = 560,
  className = '',
}: {
  title?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  width?: number;
  className?: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <Portal>
      <div className="modal-backdrop" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
        <div className={`modal panel pop-in ${className}`} style={{ width }} role="dialog" aria-modal="true">
          <div className="modal-head">
            {title && <h2>{title}</h2>}
            <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label={tr.common.close}>
              ✕
            </button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </Portal>
  );
}
