import { lazy, Suspense, useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { configureSound } from '../audio/sound';
import { Onboarding } from '../features/onboarding/Onboarding';
import { PeriodicTablePage } from '../features/periodic-table/PeriodicTablePage';
import { useStore } from '../state/store';
import { Celebration } from '../ui/Celebration';
import { DragLayer } from '../ui/drag';
import { Portal } from '../ui/Portal';
import { Toasts } from '../ui/Toasts';
import { DiplomaPrint } from '../features/notebook/Diploma';
import { Shell } from './Shell';

const AtomBuilder = lazy(() => import('../features/atom-builder/AtomBuilder'));
const MoleculeWorkshop = lazy(() => import('../features/molecule-workshop/MoleculeWorkshop'));
const ReactionCauldron = lazy(() => import('../features/reaction-cauldron/ReactionCauldron'));
const TemperatureRoom = lazy(() => import('../features/temperature-room/TemperatureRoom'));
const Notebook = lazy(() => import('../features/notebook/Notebook'));

function useGlobalSettings() {
  const settings = useStore((s) => s.save.settings);
  useEffect(() => {
    configureSound({ enabled: settings.sound, volume: settings.volume });
  }, [settings.sound, settings.volume]);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const apply = () => {
      const reduced = settings.reducedMotion || !!mq?.matches;
      document.documentElement.dataset.reducedMotion = String(reduced);
    };
    apply();
    mq?.addEventListener?.('change', apply);
    return () => mq?.removeEventListener?.('change', apply);
  }, [settings.reducedMotion]);
}

export function App() {
  useGlobalSettings();
  const tutorial = useStore((s) => s.save.tutorial);

  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {tutorial === 'none' ? (
        <Onboarding />
      ) : (
        <Shell>
          <Suspense fallback={<div className="page-loading">…</div>}>
            <Routes>
              <Route path="/" element={<Navigate to="/tablo" replace />} />
              <Route path="/tablo" element={<PeriodicTablePage />} />
              <Route path="/atom" element={<AtomBuilder />} />
              <Route path="/molekul" element={<MoleculeWorkshop />} />
              <Route path="/kazan" element={<ReactionCauldron />} />
              <Route path="/sicaklik" element={<TemperatureRoom />} />
              <Route path="/defter" element={<Notebook />} />
              <Route path="*" element={<Navigate to="/tablo" replace />} />
            </Routes>
          </Suspense>
        </Shell>
      )}
      <Portal>
        <Toasts />
        <Celebration />
      </Portal>
      <DragLayer />
      <DiplomaPrint />
    </HashRouter>
  );
}
