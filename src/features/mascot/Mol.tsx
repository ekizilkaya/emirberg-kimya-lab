import type { Mood } from '../../state/store';

/** Mol: deney gözlüklü, anteni deney tüpü olan küçük laboratuvar robotu (özgün çizim) */
export function Mol({ mood = 'neutral', size = 56 }: { mood?: Mood; size?: number }) {
  const mouth = {
    neutral: <path d="M26 44 q6 3 12 0" stroke="#0b0e2a" strokeWidth="2.5" fill="none" strokeLinecap="round" />,
    happy: <path d="M24 42 q8 9 16 0 z" fill="#0b0e2a" />,
    surprised: <circle cx="32" cy="44" r="3.6" fill="#0b0e2a" />,
    thinking: <path d="M27 45 h10" stroke="#0b0e2a" strokeWidth="2.5" strokeLinecap="round" />,
  }[mood];
  const eyeY = mood === 'thinking' ? 31 : 32;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      {/* deney tüpü anten */}
      <rect x="29" y="2" width="6" height="12" rx="3" fill="#e7f5ff" stroke="#74c0fc" strokeWidth="1.5" />
      <rect x="29.8" y="8" width="4.4" height="5.5" rx="2" fill="#63e6be" />
      <circle cx="32" cy="5" r="1.2" fill="#fff" className="mol-bubble" />
      {/* gövde */}
      <rect x="10" y="14" width="44" height="40" rx="18" fill="#4dabf7" stroke="#a5d8ff" strokeWidth="2" />
      <rect x="14" y="18" width="36" height="32" rx="14" fill="#d0ebff" />
      {/* gözlük */}
      <rect x="15" y="25" width="15" height="13" rx="6" fill="#fff" stroke="#364fc7" strokeWidth="2.5" />
      <rect x="34" y="25" width="15" height="13" rx="6" fill="#fff" stroke="#364fc7" strokeWidth="2.5" />
      <path d="M30 30 h4" stroke="#364fc7" strokeWidth="2.5" />
      {mood === 'surprised' ? (
        <>
          <circle cx="22.5" cy={eyeY} r="3.6" fill="#0b0e2a" />
          <circle cx="41.5" cy={eyeY} r="3.6" fill="#0b0e2a" />
        </>
      ) : mood === 'happy' ? (
        <>
          <path d="M19 33 q3.5 -4 7 0" stroke="#0b0e2a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M38 33 q3.5 -4 7 0" stroke="#0b0e2a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx={mood === 'thinking' ? 24 : 22.5} cy={eyeY} r="2.6" fill="#0b0e2a" />
          <circle cx={mood === 'thinking' ? 43 : 41.5} cy={eyeY} r="2.6" fill="#0b0e2a" />
        </>
      )}
      {mouth}
      {/* yanaklar ve ayaklar */}
      <circle cx="17" cy="44" r="2.5" fill="#ffa8a8" opacity="0.8" />
      <circle cx="47" cy="44" r="2.5" fill="#ffa8a8" opacity="0.8" />
      <rect x="18" y="53" width="9" height="7" rx="3" fill="#364fc7" />
      <rect x="37" y="53" width="9" height="7" rx="3" fill="#364fc7" />
    </svg>
  );
}
