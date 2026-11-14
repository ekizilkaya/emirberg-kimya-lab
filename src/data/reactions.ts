/** Ek E.2 — Tepkime kataloğu */

export type Tool = 'ates' | 'elektrik' | 'zaman';
export type ReactionKind = 'kimyasal' | 'fiziksel' | 'tepkime-yok';
export type Safety = 'sanal' | 'evde' | 'notr';

export type EffectType =
  | 'kabarcik'
  | 'kopuk-tasma'
  | 'alev'
  | 'patlama'
  | 'renk-degisimi'
  | 'parlak-isik'
  | 'sis'
  | 'fiskiye'
  | 'kivilcim'
  | 'zaman-kaplama'
  | 'cozunme'
  | 'katman'
  | 'suda-kayan-metal'
  | 'buhar'
  | 'hicbir-sey';

export interface Effect {
  type: EffectType;
  params?: {
    color?: string;
    to?: string;
    speed?: 1 | 2 | 3;
    size?: 1 | 2 | 3;
    intensity?: 1 | 2 | 3;
    twoSided?: boolean;
    label?: string;
  };
}

export interface ReactionEntry {
  id: string;
  inputs: string[];
  tool?: Tool;
  kind: ReactionKind;
  titleTr: string;
  explainTr: string;
  wordEquationTr?: string;
  symbolEquation?: string;
  productMoleculeIds?: string[];
  safety: Safety;
  homeMaterialsTr?: string;
  effects: Effect[];
  hintTr: string;
  tags?: string[];
}

const C = {
  white: '#ffffff',
  yellow: '#ffd43b',
  lilac: '#cc5de8',
  pinkAcid: '#f06595',
  redAcid: '#e03131',
  blueBase: '#20c997',
  greenBase: '#51cf66',
  yellowBase: '#c0eb75',
  purple: '#7b3fa0',
};

const ALKALI_WORD = 'Metal + Su → Metal hidroksit + Hidrojen gazı';
const LAHANA = (asitMi: boolean, renk: string) =>
  `Lahana suyu bir renk dedektifidir: ${asitMi ? 'asit' : 'baz'} görünce ${renk} olur.`;
const ALEV = (element: string, renk: string) => `${element} alevi ${renk} yapar. Havai fişekler renklerini böyle alır!`;
const LAHANA_EV = 'Kırmızı lahanayı sıcak suda bekletip suyunu süz; küçük bardaklara böl.';

export const REACTIONS: ReactionEntry[] = [
  // ---------- Hırçın Çete suda ----------
  { id: 'r01', inputs: ['lityum', 'su'], kind: 'kimyasal', titleTr: 'Sakin Fışırtı',
    explainTr: 'Lityum suda yüzer ve fışırdayarak hidrojen gazı çıkarır.',
    wordEquationTr: 'Lityum + Su → Lityum hidroksit + Hidrojen gazı', symbolEquation: '2Li + 2H₂O → 2LiOH + H₂',
    productMoleculeIds: ['h2'], safety: 'sanal', effects: [{ type: 'suda-kayan-metal', params: { intensity: 1 } }],
    hintTr: 'Hırçın Çete’nin en hafif üyesini suya at.', tags: ['alkali-su'] },
  { id: 'r02', inputs: ['sodyum', 'su'], kind: 'kimyasal', titleTr: 'Suda Dans Eden Metal',
    explainTr: 'Sodyum eriyip top olur, suyun üstünde vızır vızır koşar; bazen sarı alev alır.',
    wordEquationTr: 'Sodyum + Su → Sodyum hidroksit + Hidrojen gazı', symbolEquation: '2Na + 2H₂O → 2NaOH + H₂',
    productMoleculeIds: ['naoh', 'h2'], safety: 'sanal',
    effects: [{ type: 'suda-kayan-metal', params: { intensity: 2, color: C.yellow } }],
    hintTr: 'Tuzun içindeki metal suyla karşılaşırsa?', tags: ['alkali-su'] },
  { id: 'r03', inputs: ['potasyum', 'su'], kind: 'kimyasal', titleTr: 'Lila Alev',
    explainTr: 'Potasyum suya değer değmez lila renkli alevle tutuşur.',
    wordEquationTr: 'Potasyum + Su → Potasyum hidroksit + Hidrojen gazı', symbolEquation: '2K + 2H₂O → 2KOH + H₂',
    productMoleculeIds: ['h2'], safety: 'sanal',
    effects: [{ type: 'suda-kayan-metal', params: { intensity: 3, color: C.lilac } }],
    hintTr: 'Muzdaki metal suya düşerse ne olur?', tags: ['alkali-su'] },
  { id: 'r04', inputs: ['sezyum', 'su'], kind: 'kimyasal', titleTr: 'BUM!',
    explainTr: 'Sezyum suya değdiği anda patlar. Ailede aşağı indikçe hırçınlık artıyor!',
    wordEquationTr: ALKALI_WORD, symbolEquation: '2Cs + 2H₂O → 2CsOH + H₂',
    productMoleculeIds: ['h2'], safety: 'sanal', effects: [{ type: 'patlama', params: { size: 3 } }],
    hintTr: 'Hırçın Çete’nin en hırçınını suyla tanıştır.', tags: ['alkali-su'] },
  // ---------- Mutfak deneyleri ----------
  { id: 'r05', inputs: ['sirke', 'karbonat'], kind: 'kimyasal', titleTr: 'Mutfak Volkanı',
    explainTr: 'Köpükler taşıyor! Asit ile karbonat buluşunca karbondioksit gazı çıkar.',
    wordEquationTr: 'Sirke + Karbonat → Karbondioksit + Su + Sodyum asetat',
    symbolEquation: 'CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂', productMoleculeIds: ['co2', 'h2o'],
    safety: 'evde', homeMaterialsTr: 'Bir bardak, 2 kaşık karbonat, yarım bardak sirke, altına bir tepsi.',
    effects: [{ type: 'kopuk-tasma', params: { color: C.white, size: 2 } }],
    hintTr: 'Mutfaktan ekşi bir sıvı ile beyaz bir toz…' },
  { id: 'r06', inputs: ['limon-suyu', 'karbonat'], kind: 'kimyasal', titleTr: 'Limonlu Köpük',
    explainTr: 'Limon da bir asit; karbonatla aynı köpüklü gazı çıkarır.',
    wordEquationTr: 'Limon suyu + Karbonat → Karbondioksit + Su + Tuz', productMoleculeIds: ['co2', 'h2o'],
    safety: 'evde', homeMaterialsTr: 'Bir bardak limon suyu ve bir kaşık karbonat.',
    effects: [{ type: 'kopuk-tasma', params: { color: '#fff3bf', size: 1 } }],
    hintTr: 'Sarı ve ekşi bir meyve de köpük yapabilir mi?' },
  { id: 'r07', inputs: ['sirke', 'yumurta-kabugu'], kind: 'kimyasal', titleTr: 'Eriyen Zırh',
    explainTr: 'Kabuğun üstünde minik kabarcıklar belirir. Sirke kabuğu yavaş yavaş çözer.',
    wordEquationTr: 'Sirke + Kalsiyum karbonat → Karbondioksit + Su + Kalsiyum asetat',
    productMoleculeIds: ['co2'], safety: 'evde',
    homeMaterialsTr: 'Bir çiğ yumurtayı bir bardak sirkenin içinde bir gün beklet.',
    effects: [{ type: 'kabarcik', params: { speed: 1 } }],
    hintTr: 'Yumurtanın zırhını ekşi bir sıvıya koy.' },
  { id: 'r08', inputs: ['oksijenli-su', 'maya'], kind: 'kimyasal', titleTr: 'Fil Diş Macunu',
    explainTr: 'Maya, oksijenli suyu hızla suya ve oksijen gazına ayırır; köpük fışkırır!',
    wordEquationTr: 'Hidrojen peroksit → Su + Oksijen gazı', symbolEquation: '2H₂O₂ → 2H₂O + O₂',
    productMoleculeIds: ['h2o', 'o2'], safety: 'evde',
    homeMaterialsTr: 'Eczaneden %3’lük oksijenli su, kuru maya, biraz bulaşık deterjanı; lavaboda ya da tepside.',
    effects: [{ type: 'kopuk-tasma', params: { color: '#ffe066', size: 3 } }],
    hintTr: 'Ekmek kabartan şey ile yara temizleyen sıvıyı buluştur.' },
  { id: 'r09', inputs: ['kola', 'naneli-seker'], kind: 'fiziksel', titleTr: 'Kola Fıskiyesi',
    explainTr: 'Şekerin pütürlü yüzeyi koladaki gazı bir anda dışarı çıkarır. Yeni madde oluşmadı.',
    safety: 'evde', homeMaterialsTr: 'Açık havada, büyük şişe kola ve naneli şekerler.',
    effects: [{ type: 'fiskiye' }], hintTr: 'Gazlı bir içecek ile bir şekerleme…' },
  { id: 'r10', inputs: ['kuru-buz', 'su'], kind: 'fiziksel', titleTr: 'Cadı Kazanı',
    explainTr: 'Kuru buz, donmuş karbondioksittir. Suda hızla gaza dönüşür ve sis yapar.',
    safety: 'sanal', effects: [{ type: 'sis' }], hintTr: 'Çok soğuk bir buzu suya at.' },
  { id: 'r11', inputs: ['sofra-tuzu', 'su'], kind: 'fiziksel', titleTr: 'Kaybolan Tuz',
    explainTr: 'Tuz suda çözündü ama yok olmadı; su artık tuzlu.',
    safety: 'evde', homeMaterialsTr: 'Bir bardak su ve bir kaşık tuz; karıştır ve izle.',
    effects: [{ type: 'cozunme' }], hintTr: 'Yemeklere attığın beyaz kristali suya koy.' },
  { id: 'r12', inputs: ['zeytinyagi', 'su'], kind: 'fiziksel', titleTr: 'Küs Sıvılar',
    explainTr: 'Yağ ile su karışmaz. Yağ daha hafif olduğu için üstte kalır.',
    safety: 'evde', homeMaterialsTr: 'Şeffaf bir bardakta biraz su ve birkaç kaşık zeytinyağı.',
    effects: [{ type: 'katman' }], hintTr: 'Salata yağı ile suyu karıştırmayı dene.' },
  // ---------- Renk değiştiren iksir ----------
  { id: 'r13', inputs: ['lahana-suyu', 'sirke'], kind: 'kimyasal', titleTr: 'Pembe İksir',
    explainTr: LAHANA(true, 'pembe'), safety: 'evde', homeMaterialsTr: LAHANA_EV,
    effects: [{ type: 'renk-degisimi', params: { color: C.purple, to: C.pinkAcid } }],
    hintTr: 'Mor iksire ekşi bir şey ekle.', tags: ['indikator'] },
  { id: 'r14', inputs: ['lahana-suyu', 'limon-suyu'], kind: 'kimyasal', titleTr: 'Kırmızı İksir',
    explainTr: LAHANA(true, 'pembe-kırmızı'), safety: 'evde', homeMaterialsTr: LAHANA_EV,
    effects: [{ type: 'renk-degisimi', params: { color: C.purple, to: '#f03e3e' } }],
    hintTr: 'Mor iksire sarı ve ekşi bir meyve suyu ekle.', tags: ['indikator'] },
  { id: 'r15', inputs: ['lahana-suyu', 'karbonat'], kind: 'kimyasal', titleTr: 'Mavi İksir',
    explainTr: LAHANA(false, 'mavi-yeşil'), safety: 'evde', homeMaterialsTr: LAHANA_EV,
    effects: [{ type: 'renk-degisimi', params: { color: C.purple, to: C.blueBase } }],
    hintTr: 'Mor iksire kek kabartan tozu ekle.', tags: ['indikator'] },
  { id: 'r16', inputs: ['lahana-suyu', 'sabunlu-su'], kind: 'kimyasal', titleTr: 'Yeşil İksir',
    explainTr: LAHANA(false, 'yeşil'), safety: 'evde', homeMaterialsTr: LAHANA_EV,
    effects: [{ type: 'renk-degisimi', params: { color: C.purple, to: C.greenBase } }],
    hintTr: 'Mor iksire köpüklü temizlik suyu ekle.', tags: ['indikator'] },
  { id: 'r17', inputs: ['lahana-suyu', 'tuz-ruhu'], kind: 'kimyasal', titleTr: 'Kıpkırmızı İksir',
    explainTr: LAHANA(true, 'kıpkırmızı'), safety: 'sanal',
    effects: [{ type: 'renk-degisimi', params: { color: C.purple, to: C.redAcid } }],
    hintTr: 'Mor iksire çok güçlü bir asit ekle.', tags: ['indikator'] },
  { id: 'r18', inputs: ['lahana-suyu', 'sud-kostik'], kind: 'kimyasal', titleTr: 'Sarı İksir',
    explainTr: LAHANA(false, 'sarı-yeşil'), safety: 'sanal',
    effects: [{ type: 'renk-degisimi', params: { color: C.purple, to: C.yellowBase } }],
    hintTr: 'Mor iksire çok güçlü bir baz ekle.', tags: ['indikator'] },
  // ---------- Ateşle ----------
  { id: 'r19', inputs: ['hidrojen'], tool: 'ates', kind: 'kimyasal', titleTr: 'Pop!',
    explainTr: 'Hidrojen "pop" diye patlayarak yanar ve su buharı oluşur.',
    wordEquationTr: 'Hidrojen + Oksijen → Su', symbolEquation: '2H₂ + O₂ → 2H₂O', productMoleculeIds: ['h2o'],
    safety: 'sanal', effects: [{ type: 'patlama', params: { size: 1 } }], hintTr: 'En hafif gaza ateş yaklaştır.' },
  { id: 'r20', inputs: ['helyum'], tool: 'ates', kind: 'tepkime-yok', titleTr: 'Sakin Balon',
    explainTr: 'Hiçbir şey olmadı. Helyum bir soy gaz; yanmaz. Balonlarda bu yüzden helyum kullanılır.',
    safety: 'notr', effects: [{ type: 'hicbir-sey' }], hintTr: 'Balon gazına ateş yaklaştır.' },
  { id: 'r21', inputs: ['oksijen'], tool: 'ates', kind: 'tepkime-yok', titleTr: 'Alevin Dostu',
    explainTr: 'Alev büyüdü ve parladı ama oksijenin kendisi yanmaz; o, başka şeylerin yanmasını sağlar.',
    safety: 'notr', effects: [{ type: 'alev', params: { color: '#ffec99', size: 3 } }],
    hintTr: 'Soluduğun gaza ateş yaklaştır.' },
  { id: 'r22', inputs: ['metan'], tool: 'ates', kind: 'kimyasal', titleTr: 'Mavi Alev',
    explainTr: 'Metan mavi alevle yanar; karbondioksit ve su buharı oluşur. Ocaktaki alev budur.',
    wordEquationTr: 'Metan + Oksijen → Karbondioksit + Su', symbolEquation: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
    productMoleculeIds: ['co2', 'h2o'], safety: 'sanal',
    effects: [{ type: 'alev', params: { color: '#4dabf7', size: 2 } }], hintTr: 'Ocak gazını yak.' },
  { id: 'r23', inputs: ['magnezyum'], tool: 'ates', kind: 'kimyasal', titleTr: 'Göz Kamaştıran Işık',
    explainTr: 'Magnezyum bembeyaz bir ışıkla yanar; geriye beyaz bir toz kalır.',
    wordEquationTr: 'Magnezyum + Oksijen → Magnezyum oksit', symbolEquation: '2Mg + O₂ → 2MgO',
    productMoleculeIds: ['mgo'], safety: 'sanal', effects: [{ type: 'parlak-isik', params: { color: '#ffffff' } }],
    hintTr: 'Maytapları parlatan metal şeridi yak.' },
  { id: 'r24', inputs: ['komur'], tool: 'ates', kind: 'kimyasal', titleTr: 'Kor',
    explainTr: 'Kömür kızararak yanar. Karbon, havadaki oksijenle birleşip karbondioksit olur.',
    wordEquationTr: 'Karbon + Oksijen → Karbondioksit', symbolEquation: 'C + O₂ → CO₂', productMoleculeIds: ['co2'],
    safety: 'notr', effects: [{ type: 'alev', params: { color: '#ff922b', size: 1 } }],
    hintTr: 'Mangalda yanan kara taşı ateşe ver.' },
  { id: 'r25', inputs: ['celik-yunu'], tool: 'ates', kind: 'kimyasal', titleTr: 'Kıvılcım Yağmuru',
    explainTr: 'İncecik demir teller kıvılcımlar saçarak yanar. Demir de yanabiliyormuş!',
    wordEquationTr: 'Demir + Oksijen → Demir oksit', safety: 'sanal', effects: [{ type: 'kivilcim' }],
    hintTr: 'İncecik demir tellerden yapılmış yünü ateşe tut.' },
  { id: 'r26', inputs: ['su'], tool: 'ates', kind: 'fiziksel', titleTr: 'Fokur Fokur',
    explainTr: 'Su kaynadı ve buhar oldu. Hâlâ su; sadece gaz hâline geçti.', safety: 'notr',
    effects: [{ type: 'buhar' }], hintTr: 'Suyu ateşte ısıt.' },
  { id: 'r27', inputs: ['hidrojen', 'oksijen'], tool: 'ates', kind: 'kimyasal', titleTr: 'Büyük Pop',
    explainTr: 'İki gaz birleşti, gürültüyle patladı ve… su oluştu!', wordEquationTr: 'Hidrojen + Oksijen → Su',
    symbolEquation: '2H₂ + O₂ → 2H₂O', productMoleculeIds: ['h2o'], safety: 'sanal',
    effects: [{ type: 'patlama', params: { size: 2 } }], hintTr: 'Suyun iki gazını birlikte ateşe ver.' },
  // ---------- Alev renkleri ----------
  { id: 'r28', inputs: ['lityum-tuzu'], tool: 'ates', kind: 'kimyasal', titleTr: 'Kırmızı Alev',
    explainTr: ALEV('Lityum', 'koyu kırmızı'), safety: 'sanal',
    effects: [{ type: 'alev', params: { color: '#c92a2a', size: 2 } }], hintTr: 'Lityum tuzunu ateşe serp.',
    tags: ['alev-testi'] },
  { id: 'r29', inputs: ['sofra-tuzu'], tool: 'ates', kind: 'kimyasal', titleTr: 'Sarı Alev',
    explainTr: ALEV('Sodyum', 'parlak sarı'), safety: 'sanal',
    effects: [{ type: 'alev', params: { color: '#fcc419', size: 2 } }], hintTr: 'Sofra tuzunu ateşe serp.',
    tags: ['alev-testi'] },
  { id: 'r30', inputs: ['potasyum-tuzu'], tool: 'ates', kind: 'kimyasal', titleTr: 'Lila Alev',
    explainTr: ALEV('Potasyum', 'lila'), safety: 'sanal',
    effects: [{ type: 'alev', params: { color: '#cc5de8', size: 2 } }], hintTr: 'Potasyum tuzunu ateşe serp.',
    tags: ['alev-testi'] },
  { id: 'r31', inputs: ['kalsiyum-tuzu'], tool: 'ates', kind: 'kimyasal', titleTr: 'Turuncu Alev',
    explainTr: ALEV('Kalsiyum', 'turuncu-kırmızı'), safety: 'sanal',
    effects: [{ type: 'alev', params: { color: '#fd7e14', size: 2 } }], hintTr: 'Kalsiyum tuzunu ateşe serp.',
    tags: ['alev-testi'] },
  { id: 'r32', inputs: ['stronsiyum-tuzu'], tool: 'ates', kind: 'kimyasal', titleTr: 'Kıpkırmızı Alev',
    explainTr: ALEV('Stronsiyum', 'parlak kırmızı'), safety: 'sanal',
    effects: [{ type: 'alev', params: { color: '#ff1744', size: 2 } }], hintTr: 'Stronsiyum tuzunu ateşe serp.',
    tags: ['alev-testi'] },
  { id: 'r33', inputs: ['baryum-tuzu'], tool: 'ates', kind: 'kimyasal', titleTr: 'Yeşil Alev',
    explainTr: ALEV('Baryum', 'açık yeşil'), safety: 'sanal',
    effects: [{ type: 'alev', params: { color: '#8ce99a', size: 2 } }], hintTr: 'Baryum tuzunu ateşe serp.',
    tags: ['alev-testi'] },
  { id: 'r34', inputs: ['bakir-sulfat'], tool: 'ates', kind: 'kimyasal', titleTr: 'Turkuaz Alev',
    explainTr: ALEV('Bakır', 'mavi-yeşil'), safety: 'sanal',
    effects: [{ type: 'alev', params: { color: '#22b8cf', size: 2 } }], hintTr: 'Mavi göztaşını ateşe serp.',
    tags: ['alev-testi'] },
  // ---------- Asitler, bazlar, metaller ----------
  { id: 'r35', inputs: ['tuz-ruhu', 'sud-kostik'], kind: 'kimyasal', titleTr: 'Barışma',
    explainTr: 'Bir asit ile bir baz birbirini etkisiz hâle getirdi. Geriye tuzlu su kaldı ve kazan ısındı!',
    wordEquationTr: 'Tuz ruhu + Sud kostik → Sofra tuzu + Su', symbolEquation: 'HCl + NaOH → NaCl + H₂O',
    productMoleculeIds: ['nacl', 'h2o'], safety: 'sanal',
    effects: [{ type: 'renk-degisimi', params: { color: '#e6f7e6', to: '#dbe9ff' } }, { type: 'buhar', params: { size: 1 } }],
    hintTr: 'Laboratuvar rafındaki asit ile bazı karıştır.' },
  { id: 'r36', inputs: ['cinko', 'tuz-ruhu'], kind: 'kimyasal', titleTr: 'Kabarcık Fabrikası',
    explainTr: 'Çinko asitte çözünürken hidrojen kabarcıkları çıkarır.',
    wordEquationTr: 'Çinko + Tuz ruhu → Çinko klorür + Hidrojen gazı', symbolEquation: 'Zn + 2HCl → ZnCl₂ + H₂',
    productMoleculeIds: ['h2'], safety: 'sanal', effects: [{ type: 'kabarcik', params: { speed: 2 } }],
    hintTr: 'Gri bir metali asidin içine at.' },
  { id: 'r37', inputs: ['magnezyum', 'tuz-ruhu'], kind: 'kimyasal', titleTr: 'Hızlı Kabarcıklar',
    explainTr: 'Magnezyum çinkodan da hızlı! Köpüre köpüre çözünür.',
    wordEquationTr: 'Magnezyum + Tuz ruhu → Magnezyum klorür + Hidrojen gazı',
    symbolEquation: 'Mg + 2HCl → MgCl₂ + H₂', productMoleculeIds: ['h2'], safety: 'sanal',
    effects: [{ type: 'kabarcik', params: { speed: 3 } }], hintTr: 'Parlak metal şeridi asidin içine at.' },
  { id: 'r38', inputs: ['bakir', 'tuz-ruhu'], kind: 'tepkime-yok', titleTr: 'Umursamaz Bakır',
    explainTr: 'Hiçbir şey olmadı. Her metal asitle tepkimeye girmez.', safety: 'notr',
    effects: [{ type: 'hicbir-sey' }], hintTr: 'Turuncu kablo metalini aside koy.' },
  { id: 'r39', inputs: ['altin', 'tuz-ruhu'], kind: 'tepkime-yok', titleTr: 'Soylu Metal',
    explainTr: 'Altın kılını bile kıpırdatmadı. Bu yüzden binlerce yıl pırıl pırıl kalır.', safety: 'notr',
    effects: [{ type: 'hicbir-sey' }], hintTr: 'En değerli metali aside koy.' },
  { id: 'r40', inputs: ['demir-civi', 'bakir-sulfat'], kind: 'kimyasal', titleTr: 'Bakır Kaplama',
    explainTr: 'Çivi bakır rengine döndü! Demir, çözeltideki bakırın yerine geçti.',
    wordEquationTr: 'Demir + Bakır sülfat → Demir sülfat + Bakır', symbolEquation: 'Fe + CuSO₄ → FeSO₄ + Cu',
    safety: 'sanal',
    effects: [
      { type: 'zaman-kaplama', params: { color: '#d9844a' } },
      { type: 'renk-degisimi', params: { color: '#2f80ed', to: '#b2f2bb' } },
    ],
    hintTr: 'Bir çiviyi mavi göztaşı çözeltisine daldır.' },
  { id: 'r44', inputs: ['sodyum', 'klor'], kind: 'kimyasal', titleTr: 'Zehirden Tuza',
    explainTr: 'Hırçın bir metal ile zehirli bir gaz parlak bir ışıkla birleşti ve sofra tuzu oldu!',
    wordEquationTr: 'Sodyum + Klor → Sofra tuzu', symbolEquation: '2Na + Cl₂ → 2NaCl', productMoleculeIds: ['nacl'],
    safety: 'sanal', effects: [{ type: 'parlak-isik', params: { color: '#ffe066' } }],
    hintTr: 'Tuzun iki yarısını, metal ve gaz hâlinde buluştur.' },
  // ---------- Zaman ve elektrik ----------
  { id: 'r41', inputs: ['demir-civi', 'su'], tool: 'zaman', kind: 'kimyasal', titleTr: 'Pas',
    explainTr: 'Günler geçti… Demir, su ve havadaki oksijenle birleşip kızıl-kahve pasa dönüştü.',
    wordEquationTr: 'Demir + Oksijen + Su → Pas (demir oksit)', safety: 'evde',
    homeMaterialsTr: 'Bir çiviyi ıslak pamuğun içinde birkaç gün beklet.',
    effects: [{ type: 'zaman-kaplama', params: { color: '#a0522d', label: 'gun' } }],
    hintTr: 'Bir çiviyi suya koy ve zamanı ileri sar.' },
  { id: 'r42', inputs: ['bakir', 'su'], tool: 'zaman', kind: 'kimyasal', titleTr: 'Yeşil Örtü',
    explainTr: 'Yıllar geçti… Bakırın üstü yeşil bir tabakayla kaplandı. Özgürlük Heykeli bu yüzden yeşil!',
    safety: 'notr', effects: [{ type: 'zaman-kaplama', params: { color: '#5fb49c', label: 'yil' } }],
    hintTr: 'Bakırı suya koy ve yıllarca bekle.' },
  { id: 'r43', inputs: ['altin', 'su'], tool: 'zaman', kind: 'tepkime-yok', titleTr: 'Sonsuza Dek Parlak',
    explainTr: 'Yüzyıllar geçti, altın hiç değişmedi. Altın paslanmaz.', safety: 'notr',
    effects: [{ type: 'zaman-kaplama', params: { color: '#f2c94c', label: 'yuzyil' } }],
    hintTr: 'Altını suya koy ve yüzyıllarca bekle.' },
  { id: 'r45', inputs: ['su'], tool: 'elektrik', kind: 'kimyasal', titleTr: 'Suyu Parçala',
    explainTr: 'Elektrik, suyu yapı taşlarına ayırdı: bir yanda hidrojen, diğer yanda oksijen kabarcıkları.',
    wordEquationTr: 'Su → Hidrojen gazı + Oksijen gazı', symbolEquation: '2H₂O → 2H₂ + O₂',
    productMoleculeIds: ['h2', 'o2'], safety: 'sanal',
    effects: [{ type: 'kabarcik', params: { speed: 2, twoSided: true } }],
    hintTr: 'Suya elektrik ver.' },
];

const BY_ID = new Map(REACTIONS.map((r) => [r.id, r]));

export function getReaction(id: string): ReactionEntry | undefined {
  return BY_ID.get(id);
}
