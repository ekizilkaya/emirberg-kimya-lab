/** Ek D — Molekül kataloğu ve "eller" modeli */

/** Molekül Atölyesi paleti: sembol → el sayısı (değerlik) */
export const HANDS: Record<string, number> = {
  H: 1, C: 4, N: 3, O: 2,
  F: 1, Cl: 1, S: 2, Si: 4,
  Na: 1, K: 1, Mg: 2, Ca: 2,
  Al: 3, He: 0, Ne: 0, Ar: 0,
};

export const PALETTE: string[] = ['H', 'C', 'N', 'O', 'F', 'Cl', 'S', 'Si', 'Na', 'K', 'Mg', 'Ca', 'Al', 'He', 'Ne', 'Ar'];

/** Elektron "veren" metaller (alışveriş bağı gösterimi için) */
export const METALS = new Set(['Na', 'K', 'Mg', 'Ca', 'Al']);
export const NOBLE = new Set(['He', 'Ne', 'Ar']);

export type MoleculeLevel = 'kolay' | 'orta' | 'zor';

export interface MoleculeStructure {
  atoms: string[];
  /** [atom indeksi, atom indeksi, bağ derecesi] */
  bonds: [number, number, number][];
}

export interface MoleculeRecipe {
  id: string;
  formulaKey: string;
  formulaDisplay: string;
  nameTr: string;
  atoms: Record<string, number>;
  level: MoleculeLevel;
  bondNote: 'paylasim' | 'alisveris' | 'karisik';
  buildTipTr: string;
  hintTr: string;
  everydayTr: string;
  cautionTr?: string;
  crystal?: boolean;
  structure: MoleculeStructure;
}

const DANGER = 'Gerçeği tehlikelidir; yalnızca sanal laboratuvarda!';

/** Formül anahtarı: semboller alfabetik + adet (ör. C1H4, H2O1) */
export function formulaKeyOf(atoms: Record<string, number>): string {
  return Object.keys(atoms)
    .filter((s) => atoms[s] > 0)
    .sort()
    .map((s) => `${s}${atoms[s]}`)
    .join('');
}

function countAtoms(list: string[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const s of list) out[s] = (out[s] ?? 0) + 1;
  return out;
}

type RecipeInput = Omit<MoleculeRecipe, 'atoms' | 'formulaKey'>;

function recipe(r: RecipeInput): MoleculeRecipe {
  const atoms = countAtoms(r.structure.atoms);
  return { ...r, atoms, formulaKey: formulaKeyOf(atoms) };
}

const S = (atoms: string[], bonds: [number, number, number][]): MoleculeStructure => ({ atoms, bonds });

export const MOLECULES: MoleculeRecipe[] = [
  // ---------- Kolay ----------
  recipe({ id: 'h2', formulaDisplay: 'H₂', nameTr: 'Hidrojen gazı', level: 'kolay', bondNote: 'paylasim',
    buildTipTr: 'H–H', hintTr: 'En basit molekül: iki ikiz atom.',
    everydayTr: 'Evrendeki en hafif gaz. Roket yakıtı olarak kullanılır.',
    structure: S(['H', 'H'], [[0, 1, 1]]) }),
  recipe({ id: 'o2', formulaDisplay: 'O₂', nameTr: 'Oksijen gazı', level: 'kolay', bondNote: 'paylasim',
    buildTipTr: 'O=O (çift bağ)', hintTr: 'Nefes alırken içine çektiğin gaz.',
    everydayTr: 'İki oksijen atomu iki elle tutuşur: buna çift bağ denir.',
    structure: S(['O', 'O'], [[0, 1, 2]]) }),
  recipe({ id: 'n2', formulaDisplay: 'N₂', nameTr: 'Azot gazı', level: 'kolay', bondNote: 'paylasim',
    buildTipTr: 'N≡N (üçlü bağ)', hintTr: 'Havanın en büyük kısmı.',
    everydayTr: 'Üçlü bağ çok sağlamdır; bu yüzden azot gazı pek tepkimeye girmez.',
    structure: S(['N', 'N'], [[0, 1, 3]]) }),
  recipe({ id: 'cl2', formulaDisplay: 'Cl₂', nameTr: 'Klor gazı', level: 'kolay', bondNote: 'paylasim',
    buildTipTr: 'Cl–Cl', hintTr: 'Sarı-yeşil, keskin kokulu gaz.',
    everydayTr: 'Çok azı havuz ve içme sularını mikroplardan arındırır.', cautionTr: DANGER,
    structure: S(['Cl', 'Cl'], [[0, 1, 1]]) }),
  recipe({ id: 'hcl', formulaDisplay: 'HCl', nameTr: 'Hidrojen klorür', level: 'kolay', bondNote: 'paylasim',
    buildTipTr: 'H–Cl', hintTr: 'Midendeki asit.',
    everydayTr: 'Suda çözününce tuz ruhu olur. Miden yemekleri bununla sindirir.', cautionTr: DANGER,
    structure: S(['H', 'Cl'], [[0, 1, 1]]) }),
  recipe({ id: 'nacl', formulaDisplay: 'NaCl', nameTr: 'Sofra tuzu', level: 'kolay', bondNote: 'alisveris',
    buildTipTr: 'Na–Cl', hintTr: 'Yemeklere tat veren beyaz kristal.',
    everydayTr: 'Hırçın bir metal ile zehirli bir gaz birleşince yenebilen tuz oluyor!', crystal: true,
    structure: S(['Na', 'Cl'], [[0, 1, 1]]) }),
  recipe({ id: 'kcl', formulaDisplay: 'KCl', nameTr: 'Potasyum klorür', level: 'kolay', bondNote: 'alisveris',
    buildTipTr: 'K–Cl', hintTr: 'Tuzun kuzeni.',
    everydayTr: '"Diyet tuzu" olarak ve bitki gübrelerinde kullanılır.', crystal: true,
    structure: S(['K', 'Cl'], [[0, 1, 1]]) }),
  recipe({ id: 'naf', formulaDisplay: 'NaF', nameTr: 'Sodyum florür', level: 'kolay', bondNote: 'alisveris',
    buildTipTr: 'Na–F', hintTr: 'Dişlerinin dostu.',
    everydayTr: 'Diş macunundaki florür budur; dişlerini çürüklere karşı güçlendirir.', crystal: true,
    structure: S(['Na', 'F'], [[0, 1, 1]]) }),
  recipe({ id: 'mgo', formulaDisplay: 'MgO', nameTr: 'Magnezyum oksit', level: 'kolay', bondNote: 'alisveris',
    buildTipTr: 'Mg=O', hintTr: 'Magnezyum yanınca kalan beyaz toz.',
    everydayTr: 'Ateşe çok dayanıklıdır; fırın tuğlalarında kullanılır.', crystal: true,
    structure: S(['Mg', 'O'], [[0, 1, 2]]) }),
  recipe({ id: 'cao', formulaDisplay: 'CaO', nameTr: 'Sönmemiş kireç', level: 'kolay', bondNote: 'alisveris',
    buildTipTr: 'Ca=O', hintTr: 'Çimento ve harcın atası.',
    everydayTr: 'Binlerce yıldır duvar örmek için kullanılıyor.', crystal: true,
    structure: S(['Ca', 'O'], [[0, 1, 2]]) }),
  recipe({ id: 'h2o', formulaDisplay: 'H₂O', nameTr: 'Su', level: 'kolay', bondNote: 'paylasim',
    buildTipTr: 'H–O–H', hintTr: 'Onsuz yaşayamazsın.',
    everydayTr: 'Vücudunun yarısından fazlası sudur.',
    structure: S(['O', 'H', 'H'], [[0, 1, 1], [0, 2, 1]]) }),
  recipe({ id: 'co2', formulaDisplay: 'CO₂', nameTr: 'Karbondioksit', level: 'kolay', bondNote: 'paylasim',
    buildTipTr: 'O=C=O', hintTr: 'Nefes verirken çıkardığın gaz.',
    everydayTr: 'Gazozdaki baloncuklar da karbondioksittir. Bitkiler onu soluyarak büyür.',
    structure: S(['C', 'O', 'O'], [[0, 1, 2], [0, 2, 2]]) }),
  recipe({ id: 'h2s', formulaDisplay: 'H₂S', nameTr: 'Hidrojen sülfür', level: 'kolay', bondNote: 'paylasim',
    buildTipTr: 'H–S–H', hintTr: 'Dünyanın en kötü kokularından biri.',
    everydayTr: 'Çürük yumurta kokusu!', cautionTr: DANGER,
    structure: S(['S', 'H', 'H'], [[0, 1, 1], [0, 2, 1]]) }),
  recipe({ id: 'sio2', formulaDisplay: 'SiO₂', nameTr: 'Silisyum dioksit', level: 'kolay', bondNote: 'paylasim',
    buildTipTr: 'O=Si=O', hintTr: 'Kumsalda ayağının altında.',
    everydayTr: 'Kumun, kuvarsın ve camın ana maddesi.', crystal: true,
    structure: S(['Si', 'O', 'O'], [[0, 1, 2], [0, 2, 2]]) }),
  // ---------- Orta ----------
  recipe({ id: 'nh3', formulaDisplay: 'NH₃', nameTr: 'Amonyak', level: 'orta', bondNote: 'paylasim',
    buildTipTr: "N'ye 3 H", hintTr: 'Keskin kokulu temizlikçi.',
    everydayTr: 'Cam temizleyicilerde ve bitki gübrelerinde bulunur.', cautionTr: DANGER,
    structure: S(['N', 'H', 'H', 'H'], [[0, 1, 1], [0, 2, 1], [0, 3, 1]]) }),
  recipe({ id: 'h2o2', formulaDisplay: 'H₂O₂', nameTr: 'Hidrojen peroksit', level: 'orta', bondNote: 'paylasim',
    buildTipTr: 'H–O–O–H', hintTr: 'Suya çok benzer ama bir fazlası var.',
    everydayTr: '"Oksijenli su" diye bilinir; yaraları temizlemekte kullanılır.',
    structure: S(['O', 'O', 'H', 'H'], [[0, 1, 1], [0, 2, 1], [1, 3, 1]]) }),
  recipe({ id: 'ch4', formulaDisplay: 'CH₄', nameTr: 'Metan', level: 'orta', bondNote: 'paylasim',
    buildTipTr: "C'ye 4 H", hintTr: 'Ocakta yanan gaz.',
    everydayTr: 'Doğal gazın ana maddesi. İnekler de geğirirken metan çıkarır!',
    structure: S(['C', 'H', 'H', 'H', 'H'], [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]]) }),
  recipe({ id: 'c2h2', formulaDisplay: 'C₂H₂', nameTr: 'Asetilen', level: 'orta', bondNote: 'paylasim',
    buildTipTr: 'H–C≡C–H', hintTr: 'İçinde üçlü bağ olan yakıt.',
    everydayTr: 'Metal kaynağı yapan ustaların çok sıcak alevi asetilenle yanar.',
    structure: S(['C', 'C', 'H', 'H'], [[0, 1, 3], [0, 2, 1], [1, 3, 1]]) }),
  recipe({ id: 'naoh', formulaDisplay: 'NaOH', nameTr: 'Sodyum hidroksit', level: 'orta', bondNote: 'karisik',
    buildTipTr: 'Na–O–H', hintTr: 'Sabun yapımının gizli malzemesi.',
    everydayTr: '"Sud kostik" de denir. Yağla birleşince sabun olur.', cautionTr: DANGER, crystal: true,
    structure: S(['Na', 'O', 'H'], [[0, 1, 1], [1, 2, 1]]) }),
  recipe({ id: 'cacl2', formulaDisplay: 'CaCl₂', nameTr: 'Kalsiyum klorür', level: 'orta', bondNote: 'alisveris',
    buildTipTr: 'Cl–Ca–Cl', hintTr: 'Kışın yollara serpilir.',
    everydayTr: 'Buzu eritir; kışın yollar kaymasın diye kullanılır.', crystal: true,
    structure: S(['Ca', 'Cl', 'Cl'], [[0, 1, 1], [0, 2, 1]]) }),
  recipe({ id: 'al2o3', formulaDisplay: 'Al₂O₃', nameTr: 'Alüminyum oksit', level: 'orta', bondNote: 'alisveris',
    buildTipTr: 'O=Al–O–Al=O', hintTr: 'Değerli taşların ana maddesi.',
    everydayTr: 'Yakut ve safir aslında alüminyum oksittir; rengi içindeki azıcık başka atomlardan gelir.', crystal: true,
    structure: S(['Al', 'Al', 'O', 'O', 'O'], [[0, 2, 2], [0, 3, 1], [1, 3, 1], [1, 4, 2]]) }),
  recipe({ id: 'c2h4', formulaDisplay: 'C₂H₄', nameTr: 'Etilen', level: 'orta', bondNote: 'paylasim',
    buildTipTr: 'H₂C=CH₂', hintTr: 'Meyveleri olgunlaştıran gaz.',
    everydayTr: 'Muzlar bu gazla sararır. Plastik poşetler de etilenden yapılır.',
    structure: S(['C', 'C', 'H', 'H', 'H', 'H'], [[0, 1, 2], [0, 2, 1], [0, 3, 1], [1, 4, 1], [1, 5, 1]]) }),
  recipe({ id: 'caco3', formulaDisplay: 'CaCO₃', nameTr: 'Kalsiyum karbonat', level: 'orta', bondNote: 'karisik',
    buildTipTr: "C'ye bir O çift bağ, iki O tekli; o iki O Ca'ya bağlı", hintTr: 'Yumurtanın zırhı.',
    everydayTr: 'Yumurta kabuğu, deniz kabuğu, mermer ve tebeşir hep bu maddedir.', crystal: true,
    structure: S(['Ca', 'C', 'O', 'O', 'O'], [[1, 2, 2], [1, 3, 1], [1, 4, 1], [0, 3, 1], [0, 4, 1]]) }),
  recipe({ id: 'nahco3', formulaDisplay: 'NaHCO₃', nameTr: 'Karbonat (yemek sodası)', level: 'orta', bondNote: 'karisik',
    buildTipTr: 'Na–O–C(=O)–O–H', hintTr: 'Kekleri kabartan beyaz toz.',
    everydayTr: 'Sirkeyle buluşunca köpürür. Kazanda dene!', crystal: true,
    structure: S(['Na', 'H', 'C', 'O', 'O', 'O'], [[0, 3, 1], [3, 2, 1], [2, 4, 2], [2, 5, 1], [5, 1, 1]]) }),
  // ---------- Zor ----------
  recipe({ id: 'c2h4o2', formulaDisplay: 'C₂H₄O₂', nameTr: 'Asetik asit', level: 'zor', bondNote: 'paylasim',
    buildTipTr: 'CH₃–C(=O)–O–H', hintTr: 'Salatana ekşilik verir.',
    everydayTr: 'Sirkeyi ekşi yapan madde budur.',
    structure: S(['C', 'C', 'O', 'O', 'H', 'H', 'H', 'H'],
      [[0, 4, 1], [0, 5, 1], [0, 6, 1], [0, 1, 1], [1, 2, 2], [1, 3, 1], [3, 7, 1]]) }),
  recipe({ id: 'c2h6o', formulaDisplay: 'C₂H₆O', nameTr: 'Etanol', level: 'zor', bondNote: 'paylasim',
    buildTipTr: 'CH₃–CH₂–O–H', hintTr: 'Kolonyanın içinde.',
    everydayTr: 'Kolonya ve el dezenfektanındaki alkol. Mikropları öldürür.',
    structure: S(['C', 'C', 'O', 'H', 'H', 'H', 'H', 'H', 'H'],
      [[0, 3, 1], [0, 4, 1], [0, 5, 1], [0, 1, 1], [1, 6, 1], [1, 7, 1], [1, 2, 1], [2, 8, 1]]) }),
  recipe({ id: 'c3h8', formulaDisplay: 'C₃H₈', nameTr: 'Propan', level: 'zor', bondNote: 'paylasim',
    buildTipTr: 'Üç C yan yana, kalan eller H', hintTr: 'Kamp ocağının yakıtı.',
    everydayTr: 'Mutfak tüplerinde sıkıştırılmış hâlde bulunur.',
    structure: S(['C', 'C', 'C', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
      [[0, 1, 1], [1, 2, 1], [0, 3, 1], [0, 4, 1], [0, 5, 1], [1, 6, 1], [1, 7, 1], [2, 8, 1], [2, 9, 1], [2, 10, 1]]) }),
];

const BY_ID = new Map(MOLECULES.map((m) => [m.id, m]));
const BY_KEY = new Map(MOLECULES.map((m) => [m.formulaKey, m]));

export function getMolecule(id: string): MoleculeRecipe | undefined {
  return BY_ID.get(id);
}

export function moleculeByFormulaKey(key: string): MoleculeRecipe | undefined {
  return BY_KEY.get(key);
}
