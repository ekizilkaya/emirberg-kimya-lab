export type FamilyId =
  | 'alkali'
  | 'toprak-alkali'
  | 'gecis'
  | 'gecis-sonrasi'
  | 'yari-metal'
  | 'ametal'
  | 'halojen'
  | 'soy-gaz'
  | 'lantanit'
  | 'aktinit'
  | 'bilinmeyen';

export interface Family {
  id: FamilyId;
  nameTr: string;
  nickTr: string;
  descTr: string;
  color: string;
  /** Rengin yanında ikinci ayırt edici: küçük simge */
  icon: string;
}

export const FAMILIES: Record<FamilyId, Family> = {
  alkali: {
    id: 'alkali',
    nameTr: 'Alkali metaller',
    nickTr: 'Hırçın Çete',
    descTr: 'Suyla karşılaşınca çılgına dönerler.',
    color: '#FF6B6B',
    icon: '💥',
  },
  'toprak-alkali': {
    id: 'toprak-alkali',
    nameTr: 'Toprak alkali metaller',
    nickTr: 'Sağlam Yapıcılar',
    descTr: 'Kemiklerin, kayaların, kirecin içindeler.',
    color: '#FFA94D',
    icon: '🦴',
  },
  gecis: {
    id: 'gecis',
    nameTr: 'Geçiş metalleri',
    nickTr: 'Metal Ustaları',
    descTr: 'Demir, bakır, altın… bildiğin metallerin çoğu.',
    color: '#FFD43B',
    icon: '🔧',
  },
  'gecis-sonrasi': {
    id: 'gecis-sonrasi',
    nameTr: 'Geçiş sonrası metaller',
    nickTr: 'Yumuşak Metaller',
    descTr: 'Kolay eriyen, kolay şekil alan metaller.',
    color: '#A9E34B',
    icon: '🥄',
  },
  'yari-metal': {
    id: 'yari-metal',
    nameTr: 'Yarı metaller',
    nickTr: 'İki Arada Kalanlar',
    descTr: 'Biraz metal, biraz ametal gibi davranırlar.',
    color: '#63E6BE',
    icon: '🌗',
  },
  ametal: {
    id: 'ametal',
    nameTr: 'Ametaller',
    nickTr: 'Hayatın Yapı Taşları',
    descTr: 'Canlıların vücudu en çok bunlardan oluşur.',
    color: '#4DABF7',
    icon: '🌱',
  },
  halojen: {
    id: 'halojen',
    nameTr: 'Halojenler',
    nickTr: 'Tuz Yapıcılar',
    descTr: 'Metallerle birleşip tuz oluştururlar.',
    color: '#748FFC',
    icon: '🧂',
  },
  'soy-gaz': {
    id: 'soy-gaz',
    nameTr: 'Soy gazlar',
    nickTr: 'Kimseye Bulaşmayanlar',
    descTr: 'Dış katmanları dolu; kimseyle bağ kurmazlar.',
    color: '#DA77F2',
    icon: '😎',
  },
  lantanit: {
    id: 'lantanit',
    nameTr: 'Lantanitler',
    nickTr: 'Nadir Hazineler',
    descTr: 'Telefonların, mıknatısların gizli malzemeleri.',
    color: '#F783AC',
    icon: '🧲',
  },
  aktinit: {
    id: 'aktinit',
    nameTr: 'Aktinitler',
    nickTr: 'Işıyan Devler',
    descTr: 'Hepsi radyoaktif, çok ağır atomlar.',
    color: '#C9A27E',
    icon: '☢️',
  },
  bilinmeyen: {
    id: 'bilinmeyen',
    nameTr: 'Özellikleri henüz bilinmiyor',
    nickTr: 'Gizemliler',
    descTr: 'Yalnızca birkaç atomu üretilebildi.',
    color: '#ADB5BD',
    icon: '❓',
  },
};

export const FAMILY_ORDER: FamilyId[] = [
  'alkali',
  'toprak-alkali',
  'gecis',
  'gecis-sonrasi',
  'yari-metal',
  'ametal',
  'halojen',
  'soy-gaz',
  'lantanit',
  'aktinit',
  'bilinmeyen',
];

/** "Büyük Aile" rozeti için sayılan 10 gerçek aile (bilinmeyen hariç) */
export const REAL_FAMILIES: FamilyId[] = FAMILY_ORDER.filter((f) => f !== 'bilinmeyen');

const inRange = (z: number, a: number, b: number) => z >= a && z <= b;

export function familyOf(z: number): FamilyId {
  if ([3, 11, 19, 37, 55, 87].includes(z)) return 'alkali';
  if ([4, 12, 20, 38, 56, 88].includes(z)) return 'toprak-alkali';
  if ([2, 10, 18, 36, 54, 86].includes(z)) return 'soy-gaz';
  if ([9, 17, 35, 53, 85].includes(z)) return 'halojen';
  if ([1, 6, 7, 8, 15, 16, 34].includes(z)) return 'ametal';
  if ([5, 14, 32, 33, 51, 52].includes(z)) return 'yari-metal';
  if ([13, 31, 49, 50, 81, 82, 83, 84].includes(z)) return 'gecis-sonrasi';
  if (inRange(z, 57, 71)) return 'lantanit';
  if (inRange(z, 89, 103)) return 'aktinit';
  if (inRange(z, 109, 118)) return 'bilinmeyen';
  if (inRange(z, 21, 30) || inRange(z, 39, 48) || inRange(z, 72, 80) || inRange(z, 104, 108)) return 'gecis';
  throw new Error(`Aile bulunamadı: ${z}`);
}
