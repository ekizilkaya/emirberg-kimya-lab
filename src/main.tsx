import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Yalnız Latin + Latin-ext alt kümeleri (ç, ğ, ı, İ, ö, ş, ü) — çevrimdışı, projeye gömülü
import '@fontsource/baloo-2/latin-600.css';
import '@fontsource/baloo-2/latin-ext-600.css';
import '@fontsource/baloo-2/latin-700.css';
import '@fontsource/baloo-2/latin-ext-700.css';
import '@fontsource/nunito/latin-400.css';
import '@fontsource/nunito/latin-ext-400.css';
import '@fontsource/nunito/latin-700.css';
import '@fontsource/nunito/latin-ext-700.css';
import '@fontsource/nunito/latin-800.css';
import '@fontsource/nunito/latin-ext-800.css';
import './styles/global.css';
import { App } from './app/App';
import { flushSave } from './state/persistence';

window.addEventListener('beforeunload', flushSave);
window.addEventListener('pagehide', flushSave);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
