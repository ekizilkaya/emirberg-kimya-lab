import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

/** Kaplamalar (modal, tur, bildirim) ölçeklenen uygulama kökünün dışına çizilir */
export function Portal({ children }: { children: ReactNode }) {
  return createPortal(<div className="no-print">{children}</div>, document.body);
}
