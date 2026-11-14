import { useEffect, useRef, type ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { play } from '../audio/sound';
import { MascotBar } from '../features/mascot/MascotBar';
import { QuestPanel } from '../features/quests/QuestPanel';
import { SettingsModal } from '../features/settings/SettingsModal';
import { kpOf, rankOf } from '../domain/scoring';
import { tr } from '../i18n/tr';
import { useStore } from '../state/store';
import { Tour } from '../ui/Tour';
import logoUrl from '../assets/emirberg-logo.webp';
import { ScaledRoot } from './ScaledRoot';
import './shell.css';

const NAV = [
  { path: '/tablo', key: 'tablo', icon: '🧮' },
  { path: '/atom', key: 'atom', icon: '⚛️' },
  { path: '/molekul', key: 'molekul', icon: '🔗' },
  { path: '/kazan', key: 'kazan', icon: '⚗️' },
  { path: '/sicaklik', key: 'sicaklik', icon: '🌡️' },
  { path: '/defter', key: 'defter', icon: '📒' },
] as const;

/** Klavye kısayollarının yazı kutularında çalışmaması için */
export function isTyping(e: KeyboardEvent): boolean {
  const t = e.target as HTMLElement | null;
  if (!t) return false;
  return t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable;
}

const greeted = new Set<string>();

export function Shell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const save = useStore((s) => s.save);
  const questOpen = useStore((s) => s.questPanelOpen);
  const setQuestPanel = useStore((s) => s.setQuestPanel);
  const settingsOpen = useStore((s) => s.settingsOpen);
  const setSettings = useStore((s) => s.setSettings);
  const updateSave = useStore((s) => s.updateSave);
  const say = useStore((s) => s.say);
  const kp = kpOf(save);
  const rank = rankOf(kp);
  const workshop = location.pathname.split('/')[1] || 'tablo';
  const welcomed = useRef(false);

  // Kısayollar: 1–6 atölyeler
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e) || e.ctrlKey || e.metaKey || e.altKey) return;
      const idx = Number(e.key) - 1;
      if (idx >= 0 && idx < NAV.length && !e.shiftKey) {
        navigate(NAV[idx].path);
        play('click');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  // Karşılama ve atölye selamı (oturumda bir kez)
  useEffect(() => {
    if (!welcomed.current) {
      welcomed.current = true;
      if (save.toursSeen.length > 0) {
        say(tr.mascot.welcomeBack(save.profile.name), { mood: 'happy' });
        greeted.add(workshop);
        return;
      }
    }
    if (!greeted.has(workshop)) {
      greeted.add(workshop);
      const text = tr.mascot.workshopHello[workshop];
      if (text) setTimeout(() => say(text), 300);
    }
  }, [workshop, say, save.toursSeen.length, save.profile.name]);

  const activeQuests = save.quests.active;
  const openDone = activeQuests.filter((id) => save.quests.done[id]).length;

  return (
    <ScaledRoot>
      <div className="shell">
        <nav className="sidebar" aria-label="Atölyeler">
          <div className="logo" title={tr.appName}>
            <img src={logoUrl} alt={tr.logoAlt} className="logo-img" draggable={false} />
          </div>
          {NAV.map((n, i) => (
            <NavLink
              key={n.path}
              to={n.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title={`${tr.nav[`${n.key}Long` as keyof typeof tr.nav]} (${i + 1})`}
              onClick={() => play('click')}
            >
              <span className="nav-icon">{n.icon}</span>
              <span className="nav-label">{tr.nav[n.key]}</span>
            </NavLink>
          ))}
        </nav>
        <header className="topbar">
          <MascotBar />
          <div className="topbar-right">
            <button
              className={`btn quest-btn ${questOpen ? 'active' : ''}`}
              onClick={() => setQuestPanel(!questOpen)}
              aria-expanded={questOpen}
            >
              🎯 {tr.top.quests}
              {openDone > 0 && <span className="quest-dot">{openDone}</span>}
            </button>
            <div className="rank-chip" title={`${rank.nameTr} · ${kp} ${tr.top.kp}`}>
              <span className="rank-icon">{rank.icon}</span>
              <span className="rank-name">{rank.nameTr}</span>
              <span className="kp">
                {kp} {tr.top.kp}
              </span>
            </div>
            <button
              className="btn btn-icon"
              onClick={() => updateSave((s) => ({ ...s, settings: { ...s.settings, sound: !s.settings.sound } }))}
              aria-label={save.settings.sound ? tr.top.soundOn : tr.top.soundOff}
              title={save.settings.sound ? tr.top.soundOn : tr.top.soundOff}
            >
              {save.settings.sound ? '🔊' : '🔇'}
            </button>
            <button className="btn btn-icon" onClick={() => setSettings(true)} aria-label={tr.top.settings} title={tr.top.settings}>
              ⚙️
            </button>
          </div>
        </header>
        <main className="stage">{children}</main>
        {questOpen && <QuestPanel onClose={() => setQuestPanel(false)} />}
      </div>
      {settingsOpen && <SettingsModal onClose={() => setSettings(false)} />}
      <Tour id={workshop} />
    </ScaledRoot>
  );
}
