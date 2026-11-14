/** Ek E.1 — Tepkime Kazanı maddeleri */

export type Shelf = 'element' | 'mutfak' | 'laboratuvar';
export type SubstanceForm = 'kati' | 'sivi' | 'gaz' | 'toz';

export interface Substance {
  id: string;
  nameTr: string;
  shelf: Shelf;
  /** ilişkili atom numaraları (3. yıldız için) */
  elements: number[];
  icon: string;
  /** Element rafında gösterilen sembol */
  symbol?: string;
  look: { color: string; form: SubstanceForm };
}

const sub = (
  id: string,
  nameTr: string,
  shelf: Shelf,
  elements: number[],
  icon: string,
  color: string,
  form: SubstanceForm,
  symbol?: string,
): Substance => ({ id, nameTr, shelf, elements, icon, symbol, look: { color, form } });

export const SUBSTANCES: Substance[] = [
  // Elementler rafı
  sub('lityum', 'Lityum', 'element', [3], '⚪', '#c9c9d4', 'kati', 'Li'),
  sub('sodyum', 'Sodyum', 'element', [11], '⚪', '#d8d8e0', 'kati', 'Na'),
  sub('potasyum', 'Potasyum', 'element', [19], '⚪', '#cfcfda', 'kati', 'K'),
  sub('sezyum', 'Sezyum', 'element', [55], '🟡', '#e9d58a', 'kati', 'Cs'),
  sub('magnezyum', 'Magnezyum şeridi', 'element', [12], '🎗️', '#e3e3ea', 'kati', 'Mg'),
  sub('cinko', 'Çinko', 'element', [30], '🔘', '#b9c2c9', 'kati', 'Zn'),
  sub('demir-civi', 'Demir çivi', 'element', [26], '🔩', '#8d939b', 'kati', 'Fe'),
  sub('celik-yunu', 'Çelik yünü', 'element', [26], '🧽', '#a3a8ad', 'kati', 'Fe'),
  sub('bakir', 'Bakır', 'element', [29], '🟠', '#d9844a', 'kati', 'Cu'),
  sub('altin', 'Altın', 'element', [79], '🥇', '#f2c94c', 'kati', 'Au'),
  sub('komur', 'Kömür (karbon)', 'element', [6], '⚫', '#2b2b2b', 'kati', 'C'),
  sub('hidrojen', 'Hidrojen gazı', 'element', [1], '🎈', '#ff8787', 'gaz', 'H₂'),
  sub('helyum', 'Helyum gazı', 'element', [2], '🎈', '#e599f7', 'gaz', 'He'),
  sub('oksijen', 'Oksijen gazı', 'element', [8], '🎈', '#74c0fc', 'gaz', 'O₂'),
  sub('metan', 'Metan gazı', 'element', [6, 1], '🎈', '#ffd43b', 'gaz', 'CH₄'),
  sub('klor', 'Klor gazı', 'element', [17], '🎈', '#c0eb75', 'gaz', 'Cl₂'),
  // Mutfaktan rafı
  sub('su', 'Su', 'mutfak', [1, 8], '💧', '#5dade2', 'sivi'),
  sub('sirke', 'Sirke', 'mutfak', [6, 1, 8], '🍶', '#f3e6b8', 'sivi'),
  sub('limon-suyu', 'Limon suyu', 'mutfak', [6, 1, 8], '🍋', '#fff08a', 'sivi'),
  sub('karbonat', 'Karbonat', 'mutfak', [11, 1, 6, 8], '🥄', '#ffffff', 'toz'),
  sub('yumurta-kabugu', 'Yumurta kabuğu', 'mutfak', [20, 6, 8], '🥚', '#f8efe0', 'kati'),
  sub('sofra-tuzu', 'Sofra tuzu', 'mutfak', [11, 17], '🧂', '#ffffff', 'toz'),
  sub('zeytinyagi', 'Zeytinyağı', 'mutfak', [6, 1, 8], '🫒', '#c9b43a', 'sivi'),
  sub('lahana-suyu', 'Kırmızı lahana suyu', 'mutfak', [1, 8], '🥬', '#7b3fa0', 'sivi'),
  sub('sabunlu-su', 'Sabunlu su', 'mutfak', [11, 6, 1, 8], '🧼', '#d6ecff', 'sivi'),
  sub('oksijenli-su', 'Oksijenli su', 'mutfak', [1, 8], '🧴', '#eaf6ff', 'sivi'),
  sub('maya', 'Maya', 'mutfak', [6], '🍞', '#d9b778', 'toz'),
  sub('kola', 'Kola', 'mutfak', [6, 1, 8], '🥤', '#4a2511', 'sivi'),
  sub('naneli-seker', 'Naneli şeker', 'mutfak', [6, 1, 8], '🍬', '#ffffff', 'kati'),
  sub('kuru-buz', 'Kuru buz', 'mutfak', [6, 8], '🧊', '#e7f5ff', 'kati'),
  // Laboratuvar rafı
  sub('tuz-ruhu', 'Tuz ruhu (asit)', 'laboratuvar', [1, 17], '⚗️', '#e6f7e6', 'sivi'),
  sub('sud-kostik', 'Sud kostik (baz)', 'laboratuvar', [11, 8, 1], '🧪', '#eef0ff', 'sivi'),
  sub('bakir-sulfat', 'Bakır sülfat (göztaşı)', 'laboratuvar', [29, 16, 8], '💎', '#2f80ed', 'toz'),
  sub('lityum-tuzu', 'Lityum tuzu', 'laboratuvar', [3, 17], '🧂', '#ffe3e3', 'toz'),
  sub('potasyum-tuzu', 'Potasyum tuzu', 'laboratuvar', [19, 17], '🧂', '#f3e5ff', 'toz'),
  sub('kalsiyum-tuzu', 'Kalsiyum tuzu', 'laboratuvar', [20, 17], '🧂', '#ffe8cc', 'toz'),
  sub('stronsiyum-tuzu', 'Stronsiyum tuzu', 'laboratuvar', [38, 17], '🧂', '#ffd6d6', 'toz'),
  sub('baryum-tuzu', 'Baryum tuzu', 'laboratuvar', [56, 17], '🧂', '#e3fcd9', 'toz'),
];

const BY_ID = new Map(SUBSTANCES.map((s) => [s.id, s]));

export function getSubstance(id: string): Substance {
  const s = BY_ID.get(id);
  if (!s) throw new Error(`Madde yok: ${id}`);
  return s;
}

export function findSubstance(id: string): Substance | undefined {
  return BY_ID.get(id);
}
