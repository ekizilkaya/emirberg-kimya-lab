import { familyOf, type FamilyId } from './families';

export type Phase = 'kati' | 'sivi' | 'gaz' | 'bilinmiyor';

export interface NameOrigin {
  kind: 'yer' | 'kisi' | 'gok-cismi';
  textTr: string;
}

export interface ElementData {
  z: number;
  symbol: string;
  nameTr: string;
  nameEn: string;
  family: FamilyId;
  /** 1–18; lantanit/aktinit satırı için null */
  group: number | null;
  period: number;
  /** ızgara sütunu (1–18) */
  tableX: number;
  /** ızgara satırı (1–7, lantanitler 9, aktinitler 10) */
  tableY: number;
  atomicMass: number;
  meltC: number | null;
  boilC: number | null;
  sublimes: boolean;
  radioactive: boolean;
  synthetic: boolean;
  nameOrigin?: NameOrigin;
}

/**
 * [z, sembol, Türkçe ad, İngilizce ad, atom kütlesi, erime °C, kaynama °C]
 * Erime/kaynama değerleri 1 atm içindir. Z ≥ 100 için tahmini değer kullanılmaz (SPEC 14.6).
 * Süblimleşenlerde (C, As) erime null, kaynama = süblimleşme sıcaklığı.
 */
type Row = [number, string, string, string, number, number | null, number | null];

const ROWS: Row[] = [
  [1, 'H', 'Hidrojen', 'Hydrogen', 1.008, -259.2, -252.9],
  [2, 'He', 'Helyum', 'Helium', 4.0026, null, -268.9],
  [3, 'Li', 'Lityum', 'Lithium', 6.94, 180.5, 1342],
  [4, 'Be', 'Berilyum', 'Beryllium', 9.0122, 1287, 2469],
  [5, 'B', 'Bor', 'Boron', 10.81, 2076, 3927],
  [6, 'C', 'Karbon', 'Carbon', 12.011, null, 3642],
  [7, 'N', 'Azot', 'Nitrogen', 14.007, -210, -195.8],
  [8, 'O', 'Oksijen', 'Oxygen', 15.999, -218.8, -183],
  [9, 'F', 'Flor', 'Fluorine', 18.998, -219.7, -188.1],
  [10, 'Ne', 'Neon', 'Neon', 20.18, -248.6, -246.1],
  [11, 'Na', 'Sodyum', 'Sodium', 22.99, 97.8, 882.9],
  [12, 'Mg', 'Magnezyum', 'Magnesium', 24.305, 650, 1090],
  [13, 'Al', 'Alüminyum', 'Aluminium', 26.982, 660.3, 2519],
  [14, 'Si', 'Silisyum', 'Silicon', 28.085, 1414, 3265],
  [15, 'P', 'Fosfor', 'Phosphorus', 30.974, 44.2, 280.5],
  [16, 'S', 'Kükürt', 'Sulfur', 32.06, 115.2, 444.6],
  [17, 'Cl', 'Klor', 'Chlorine', 35.45, -101.5, -34],
  [18, 'Ar', 'Argon', 'Argon', 39.948, -189.3, -185.8],
  [19, 'K', 'Potasyum', 'Potassium', 39.098, 63.5, 759],
  [20, 'Ca', 'Kalsiyum', 'Calcium', 40.078, 842, 1484],
  [21, 'Sc', 'Skandiyum', 'Scandium', 44.956, 1541, 2836],
  [22, 'Ti', 'Titanyum', 'Titanium', 47.867, 1668, 3287],
  [23, 'V', 'Vanadyum', 'Vanadium', 50.942, 1910, 3407],
  [24, 'Cr', 'Krom', 'Chromium', 51.996, 1907, 2671],
  [25, 'Mn', 'Mangan', 'Manganese', 54.938, 1246, 2061],
  [26, 'Fe', 'Demir', 'Iron', 55.845, 1538, 2861],
  [27, 'Co', 'Kobalt', 'Cobalt', 58.933, 1495, 2927],
  [28, 'Ni', 'Nikel', 'Nickel', 58.693, 1455, 2913],
  [29, 'Cu', 'Bakır', 'Copper', 63.546, 1084.6, 2562],
  [30, 'Zn', 'Çinko', 'Zinc', 65.38, 419.5, 907],
  [31, 'Ga', 'Galyum', 'Gallium', 69.723, 29.8, 2229],
  [32, 'Ge', 'Germanyum', 'Germanium', 72.63, 938.3, 2833],
  [33, 'As', 'Arsenik', 'Arsenic', 74.922, null, 615],
  [34, 'Se', 'Selenyum', 'Selenium', 78.971, 221, 685],
  [35, 'Br', 'Brom', 'Bromine', 79.904, -7.2, 58.8],
  [36, 'Kr', 'Kripton', 'Krypton', 83.798, -157.4, -153.4],
  [37, 'Rb', 'Rubidyum', 'Rubidium', 85.468, 39.3, 688],
  [38, 'Sr', 'Stronsiyum', 'Strontium', 87.62, 777, 1377],
  [39, 'Y', 'İtriyum', 'Yttrium', 88.906, 1526, 3336],
  [40, 'Zr', 'Zirkonyum', 'Zirconium', 91.224, 1855, 4409],
  [41, 'Nb', 'Niyobyum', 'Niobium', 92.906, 2477, 4744],
  [42, 'Mo', 'Molibden', 'Molybdenum', 95.95, 2623, 4639],
  [43, 'Tc', 'Teknesyum', 'Technetium', 98, 2157, 4265],
  [44, 'Ru', 'Rutenyum', 'Ruthenium', 101.07, 2334, 4150],
  [45, 'Rh', 'Rodyum', 'Rhodium', 102.91, 1964, 3695],
  [46, 'Pd', 'Paladyum', 'Palladium', 106.42, 1554.9, 2963],
  [47, 'Ag', 'Gümüş', 'Silver', 107.87, 961.8, 2162],
  [48, 'Cd', 'Kadmiyum', 'Cadmium', 112.41, 321.1, 767],
  [49, 'In', 'İndiyum', 'Indium', 114.82, 156.6, 2072],
  [50, 'Sn', 'Kalay', 'Tin', 118.71, 231.9, 2602],
  [51, 'Sb', 'Antimon', 'Antimony', 121.76, 630.6, 1587],
  [52, 'Te', 'Tellür', 'Tellurium', 127.6, 449.5, 988],
  [53, 'I', 'İyot', 'Iodine', 126.9, 113.7, 184.3],
  [54, 'Xe', 'Ksenon', 'Xenon', 131.29, -111.8, -108.1],
  [55, 'Cs', 'Sezyum', 'Caesium', 132.91, 28.4, 671],
  [56, 'Ba', 'Baryum', 'Barium', 137.33, 727, 1845],
  [57, 'La', 'Lantan', 'Lanthanum', 138.91, 920, 3464],
  [58, 'Ce', 'Seryum', 'Cerium', 140.12, 795, 3443],
  [59, 'Pr', 'Praseodim', 'Praseodymium', 140.91, 935, 3520],
  [60, 'Nd', 'Neodim', 'Neodymium', 144.24, 1024, 3074],
  [61, 'Pm', 'Prometyum', 'Promethium', 145, 1042, 3000],
  [62, 'Sm', 'Samaryum', 'Samarium', 150.36, 1072, 1794],
  [63, 'Eu', 'Evropiyum', 'Europium', 151.96, 826, 1529],
  [64, 'Gd', 'Gadolinyum', 'Gadolinium', 157.25, 1312, 3273],
  [65, 'Tb', 'Terbiyum', 'Terbium', 158.93, 1356, 3230],
  [66, 'Dy', 'Disprosyum', 'Dysprosium', 162.5, 1407, 2562],
  [67, 'Ho', 'Holmiyum', 'Holmium', 164.93, 1461, 2720],
  [68, 'Er', 'Erbiyum', 'Erbium', 167.26, 1529, 2868],
  [69, 'Tm', 'Tulyum', 'Thulium', 168.93, 1545, 1950],
  [70, 'Yb', 'İterbiyum', 'Ytterbium', 173.05, 824, 1196],
  [71, 'Lu', 'Lutesyum', 'Lutetium', 174.97, 1652, 3402],
  [72, 'Hf', 'Hafniyum', 'Hafnium', 178.49, 2233, 4603],
  [73, 'Ta', 'Tantal', 'Tantalum', 180.95, 3017, 5458],
  [74, 'W', 'Tungsten', 'Tungsten', 183.84, 3422, 5555],
  [75, 'Re', 'Renyum', 'Rhenium', 186.21, 3186, 5596],
  [76, 'Os', 'Osmiyum', 'Osmium', 190.23, 3033, 5012],
  [77, 'Ir', 'İridyum', 'Iridium', 192.22, 2446, 4428],
  [78, 'Pt', 'Platin', 'Platinum', 195.08, 1768.3, 3825],
  [79, 'Au', 'Altın', 'Gold', 196.97, 1064.2, 2856],
  [80, 'Hg', 'Cıva', 'Mercury', 200.59, -38.8, 356.7],
  [81, 'Tl', 'Talyum', 'Thallium', 204.38, 304, 1473],
  [82, 'Pb', 'Kurşun', 'Lead', 207.2, 327.5, 1749],
  [83, 'Bi', 'Bizmut', 'Bismuth', 208.98, 271.4, 1564],
  [84, 'Po', 'Polonyum', 'Polonium', 209, 254, 962],
  [85, 'At', 'Astatin', 'Astatine', 210, 302, 337],
  [86, 'Rn', 'Radon', 'Radon', 222, -71, -61.7],
  [87, 'Fr', 'Fransiyum', 'Francium', 223, 27, 677],
  [88, 'Ra', 'Radyum', 'Radium', 226, 700, 1737],
  [89, 'Ac', 'Aktinyum', 'Actinium', 227, 1050, 3198],
  [90, 'Th', 'Toryum', 'Thorium', 232.04, 1750, 4788],
  [91, 'Pa', 'Protaktinyum', 'Protactinium', 231.04, 1572, 4027],
  [92, 'U', 'Uranyum', 'Uranium', 238.03, 1135, 4131],
  [93, 'Np', 'Neptünyum', 'Neptunium', 237, 644, 4000],
  [94, 'Pu', 'Plütonyum', 'Plutonium', 244, 639.4, 3228],
  [95, 'Am', 'Amerikyum', 'Americium', 243, 1176, 2011],
  [96, 'Cm', 'Küriyum', 'Curium', 247, 1340, 3110],
  [97, 'Bk', 'Berkelyum', 'Berkelium', 247, 986, null],
  [98, 'Cf', 'Kaliforniyum', 'Californium', 251, 900, null],
  [99, 'Es', 'Aynştaynyum', 'Einsteinium', 252, 860, null],
  [100, 'Fm', 'Fermiyum', 'Fermium', 257, null, null],
  [101, 'Md', 'Mendelevyum', 'Mendelevium', 258, null, null],
  [102, 'No', 'Nobelyum', 'Nobelium', 259, null, null],
  [103, 'Lr', 'Lavrensiyum', 'Lawrencium', 266, null, null],
  [104, 'Rf', 'Rutherfordiyum', 'Rutherfordium', 267, null, null],
  [105, 'Db', 'Dubniyum', 'Dubnium', 268, null, null],
  [106, 'Sg', 'Seaborgiyum', 'Seaborgium', 269, null, null],
  [107, 'Bh', 'Bohriyum', 'Bohrium', 270, null, null],
  [108, 'Hs', 'Hassiyum', 'Hassium', 277, null, null],
  [109, 'Mt', 'Meitneriyum', 'Meitnerium', 278, null, null],
  [110, 'Ds', 'Darmstadtiyum', 'Darmstadtium', 281, null, null],
  [111, 'Rg', 'Röntgenyum', 'Roentgenium', 282, null, null],
  [112, 'Cn', 'Kopernikyum', 'Copernicium', 285, null, null],
  [113, 'Nh', 'Nihonyum', 'Nihonium', 286, null, null],
  [114, 'Fl', 'Flerovyum', 'Flerovium', 289, null, null],
  [115, 'Mc', 'Moskovyum', 'Moscovium', 290, null, null],
  [116, 'Lv', 'Livermoryum', 'Livermorium', 293, null, null],
  [117, 'Ts', 'Tennesin', 'Tennessine', 294, null, null],
  [118, 'Og', 'Oganesson', 'Oganesson', 294, null, null],
];

const SUBLIMES = new Set([6, 33]);

/** Ek H — ad kökenleri */
export const NAME_ORIGINS: Record<number, NameOrigin> = {
  // Yer
  12: { kind: 'yer', textTr: "Adını Yunanistan'daki Magnesia bölgesinden alır." },
  21: { kind: 'yer', textTr: "Adını İskandinavya'dan alır." },
  29: { kind: 'yer', textTr: "Adını Kıbrıs'tan alır; Romalılar bakırı oradan getirirdi." },
  31: { kind: 'yer', textTr: "Adını Fransa'nın eski adı Galya'dan alır." },
  32: { kind: 'yer', textTr: "Adını Almanya'dan alır." },
  38: { kind: 'yer', textTr: "Adını İskoçya'daki Strontian köyünden alır." },
  39: { kind: 'yer', textTr: "Adını İsveç'teki Ytterby köyünden alır; bu köy dört elemente ad verdi!" },
  65: { kind: 'yer', textTr: "Adını İsveç'teki Ytterby köyünden alır; bu köy dört elemente ad verdi!" },
  68: { kind: 'yer', textTr: "Adını İsveç'teki Ytterby köyünden alır; bu köy dört elemente ad verdi!" },
  70: { kind: 'yer', textTr: "Adını İsveç'teki Ytterby köyünden alır; bu köy dört elemente ad verdi!" },
  44: { kind: 'yer', textTr: "Adını Rusya'nın Latince adı Ruthenia'dan alır." },
  63: { kind: 'yer', textTr: "Adını Avrupa'dan alır." },
  67: { kind: 'yer', textTr: "Adını Stockholm'ün Latince adı Holmia'dan alır." },
  71: { kind: 'yer', textTr: "Adını Paris'in eski adı Lutetia'dan alır." },
  72: { kind: 'yer', textTr: "Adını Kopenhag'ın eski adı Hafnia'dan alır." },
  75: { kind: 'yer', textTr: 'Adını Ren Nehri’nden alır.' },
  84: { kind: 'yer', textTr: "Adını Polonya'dan alır." },
  87: { kind: 'yer', textTr: "Adını Fransa'dan alır." },
  95: { kind: 'yer', textTr: "Adını Amerika'dan alır." },
  97: { kind: 'yer', textTr: "Adını ABD'deki Berkeley şehrinden alır." },
  98: { kind: 'yer', textTr: "Adını Kaliforniya'dan alır." },
  105: { kind: 'yer', textTr: "Adını Rusya'daki Dubna şehrinden alır." },
  108: { kind: 'yer', textTr: "Adını Almanya'nın Hessen eyaletinden alır." },
  110: { kind: 'yer', textTr: "Adını Almanya'daki Darmstadt şehrinden alır." },
  113: { kind: 'yer', textTr: 'Adını Japonya’dan alır; Japonca "Nihon" Japonya demek.' },
  115: { kind: 'yer', textTr: "Adını Moskova'dan alır." },
  117: { kind: 'yer', textTr: "Adını ABD'deki Tennessee eyaletinden alır." },
  // Kişi
  64: { kind: 'kisi', textTr: 'Adını Finli kimyager Johan Gadolin’den alır.' },
  96: { kind: 'kisi', textTr: 'Adını Marie ve Pierre Curie’den alır.' },
  99: { kind: 'kisi', textTr: 'Adını ünlü fizikçi Albert Einstein’dan alır.' },
  100: { kind: 'kisi', textTr: 'Adını İtalyan fizikçi Enrico Fermi’den alır.' },
  101: { kind: 'kisi', textTr: 'Adını periyodik tablonun mucidi Dimitri Mendeleyev’den alır.' },
  102: { kind: 'kisi', textTr: 'Adını Nobel Ödülü’nün kurucusu Alfred Nobel’den alır.' },
  103: { kind: 'kisi', textTr: 'Adını fizikçi Ernest Lawrence’tan alır.' },
  104: { kind: 'kisi', textTr: 'Adını atom çekirdeğini keşfeden Ernest Rutherford’dan alır.' },
  106: { kind: 'kisi', textTr: 'Adını kimyager Glenn Seaborg’dan alır.' },
  107: { kind: 'kisi', textTr: 'Adını atom modelinin babası Niels Bohr’dan alır.' },
  109: { kind: 'kisi', textTr: 'Adını fizikçi Lise Meitner’den alır.' },
  111: { kind: 'kisi', textTr: 'Adını röntgen ışınlarını bulan Wilhelm Röntgen’den alır.' },
  112: { kind: 'kisi', textTr: 'Adını gökbilimci Nicolaus Copernicus’tan alır.' },
  118: { kind: 'kisi', textTr: 'Adını fizikçi Yuri Oganessian’dan alır.' },
  // Gök cismi
  2: { kind: 'gok-cismi', textTr: 'Adını Güneş’ten alır; Yunanca "helios" Güneş demek.' },
  34: { kind: 'gok-cismi', textTr: 'Adını Ay’dan alır; Yunanca "selene" Ay demek.' },
  52: { kind: 'gok-cismi', textTr: 'Adını Dünya’dan alır; Latince "tellus" Dünya demek.' },
  58: { kind: 'gok-cismi', textTr: 'Adını cüce gezegen Ceres’ten alır.' },
  46: { kind: 'gok-cismi', textTr: 'Adını asteroit Pallas’tan alır.' },
  92: { kind: 'gok-cismi', textTr: 'Adını Uranüs gezegeninden alır.' },
  93: { kind: 'gok-cismi', textTr: 'Adını Neptün gezegeninden alır.' },
  94: { kind: 'gok-cismi', textTr: 'Adını cüce gezegen Plüton’dan alır.' },
};

function position(z: number): { group: number | null; period: number; x: number; y: number } {
  const main = (group: number, period: number) => ({ group, period, x: group, y: period });
  if (z === 1) return main(1, 1);
  if (z === 2) return main(18, 1);
  if (z <= 4) return main(z - 2, 2);
  if (z <= 10) return main(z + 8, 2);
  if (z <= 12) return main(z - 10, 3);
  if (z <= 18) return main(z, 3);
  if (z <= 36) return main(z - 18, 4);
  if (z <= 54) return main(z - 36, 5);
  if (z <= 56) return main(z - 54, 6);
  if (z <= 71) return { group: null, period: 6, x: z - 54, y: 9 };
  if (z <= 86) return main(z - 68, 6);
  if (z <= 88) return main(z - 86, 7);
  if (z <= 103) return { group: null, period: 7, x: z - 86, y: 10 };
  return main(z - 100, 7);
}

const isRadioactive = (z: number) => z === 43 || z === 61 || z >= 84;
const isSynthetic = (z: number) => z === 43 || z === 61 || z >= 93;

export const ELEMENTS: ElementData[] = ROWS.map(([z, symbol, nameTr, nameEn, atomicMass, meltC, boilC]) => {
  const pos = position(z);
  return {
    z,
    symbol,
    nameTr,
    nameEn,
    family: familyOf(z),
    group: pos.group,
    period: pos.period,
    tableX: pos.x,
    tableY: pos.y,
    atomicMass,
    meltC,
    boilC,
    sublimes: SUBLIMES.has(z),
    radioactive: isRadioactive(z),
    synthetic: isSynthetic(z),
    nameOrigin: NAME_ORIGINS[z],
  };
});

const BY_Z = new Map(ELEMENTS.map((e) => [e.z, e]));
const BY_SYMBOL = new Map(ELEMENTS.map((e) => [e.symbol, e]));

export function getElement(z: number): ElementData {
  const el = BY_Z.get(z);
  if (!el) throw new Error(`Element yok: ${z}`);
  return el;
}

export function findElement(z: number): ElementData | undefined {
  return BY_Z.get(z);
}

export function elementBySymbol(symbol: string): ElementData {
  const el = BY_SYMBOL.get(symbol);
  if (!el) throw new Error(`Sembol yok: ${symbol}`);
  return el;
}

/** Derin içerikli elementlerin üst sınırı (SPEC: ilk 36) */
export const DEEP_MAX_Z = 36;

/** "Vücudumda" gözlüğü */
export const BODY_MAIN = [8, 6, 1, 7, 20, 15, 19, 16, 11, 17, 12];
export const BODY_TRACE = [26, 30, 29, 53, 34, 25, 27, 42];
