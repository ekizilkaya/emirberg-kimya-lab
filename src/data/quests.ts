/** Ek F — Merak Görevleri */
import type { Condition, WorkshopId } from '../domain/types';
import { BODY_MAIN } from './elements';

export type QuestTier = 'baslangic' | 'orta' | 'ileri';

export interface Quest {
  id: string;
  tier: QuestTier;
  workshop: WorkshopId;
  titleTr: string;
  questionTr: string;
  hintTr: string;
  condition: Condition;
  /** "Beni oraya götür" için yol (hash route + sorgu) */
  link: string;
}

const B: QuestTier = 'baslangic';
const O: QuestTier = 'orta';
const I: QuestTier = 'ileri';

const q = (
  id: string,
  tier: QuestTier,
  workshop: WorkshopId,
  titleTr: string,
  questionTr: string,
  hintTr: string,
  condition: Condition,
  link?: string,
): Quest => ({ id, tier, workshop, titleTr, questionTr, hintTr, condition, link: link ?? `/${workshop}` });

const reaction = (id: string): Condition => ({ type: 'reactionFound', id });
const molecule = (id: string): Condition => ({ type: 'moleculeFound', id });
const viewed = (z: number): Condition => ({ type: 'elementViewed', z });

export const QUESTS: Quest[] = [
  // ---------- Atom Kurucu ----------
  q('qa01', B, 'atom', 'İlk Atomun', 'Evrenin en basit atomunu kurabilir misin?',
    'Tek bir proton ve tek bir elektron yeter.', { type: 'atomBuilt', z: 1 }, '/atom?hedef=1'),
  q('qa02', B, 'atom', 'Balon Gazı', 'Uçan balonları dolduran gazın atomu nasıl?',
    'Helyumun 2 protonu var. Çekirdek sallanırsa nötron ekle.', { type: 'atomBuilt', z: 2 }, '/atom?hedef=2'),
  q('qa03', B, 'atom', 'Kimlik Numarası 6', '6 protonlu atom hangi element çıkacak?',
    '6 proton, 6 elektron koy; çekirdek sakinleşene kadar nötron ekle.', { type: 'atomBuilt', z: 6 }, '/atom?hedef=6'),
  q('qa04', B, 'atom', 'Yüklü Atom', 'Elektron sayısı protondan farklı olursa ne olur?',
    'Bir atom kur, sonra bir elektron ekle ya da çıkar.', { type: 'ionBuilt' }),
  q('qa05', O, 'atom', 'Tuzun Yarısı', 'Sodyum bir elektronunu kaybederse?',
    'Sodyumu kur (11 proton), sonra elektronlardan birini çıkar.', { type: 'ionBuilt', z: 11, charge: 1 }),
  q('qa06', O, 'atom', 'Dolu Katman', 'Dış katmanı tıka basa dolu bir atom kur.',
    'Kimseye Bulaşmayanlar ailesinden birini dene: Helyum, Neon ya da Argon.', { type: 'nobleShellBuilt' }),
  q('qa07', O, 'atom', 'İkiz Ama Farklı', 'Aynı elementin iki farklı ağırlıkta atomu olur mu?',
    'Bir atom kur, biraz bekle; sonra sadece nötron sayısını değiştir.', { type: 'distinctIsotopesOfSameElement', min: 2 }),
  q('qa08', O, 'atom', 'Sallanan Çekirdek', 'Çekirdeği yerinde duramayan bir atom yap.',
    'Çekirdeğe çok fazla ya da çok az nötron koy ve bekle.', { type: 'unstableBuiltCount', min: 1 }),
  q('qa09', I, 'atom', 'Fosil Saati', 'Dinozor kemiklerinin yaşını ölçen atomu kur.',
    'Karbonun 6 protonu var. Nötronu 8 yapmayı dene.', { type: 'isotopeBuilt', z: 6, massNumber: 14 }),
  q('qa10', O, 'atom', 'İlk 10', 'İlk 10 elementin hepsini kur.',
    'Hidrojenden Neon’a kadar sırayla git; her birinde çekirdeği sakinleştir.',
    { type: 'all', of: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((z) => ({ type: 'atomBuilt', z }) as Condition) }),
  q('qa11', I, 'atom', 'Ağır Sıklet', 'Kanına rengini veren metalin atomunu kur.',
    'Demirin 26 protonu var. Shift ile beşer beşer ekleyebilirsin.', { type: 'atomBuilt', z: 26 }, '/atom?hedef=26'),
  q('qa12', I, 'atom', 'Muzdaki Sır', 'Muzun içindeki azıcık radyoaktif atomu kur.',
    'Potasyum: 19 proton ve 21 nötron.', { type: 'isotopeBuilt', z: 19, massNumber: 40 }),
  // ---------- Molekül Atölyesi ----------
  q('qm01', B, 'molekul', 'El Ele', 'İki hidrojen atomunu tutuştur.',
    'İki H atomunu tezgâha koy ve birini diğerinin üstüne bırak.', molecule('h2')),
  q('qm02', B, 'molekul', 'Hayat Suyu', 'Suyu atomlarından yapabilir misin?',
    'Bir oksijenin iki eli var; her eline bir hidrojen ver.', molecule('h2o')),
  q('qm03', B, 'molekul', 'Çift Bağ', 'İki oksijen birbirine kaç elle tutunur?',
    'İki O’yu bağla, sonra bağın üstüne bir kez daha tıkla.', molecule('o2')),
  q('qm04', B, 'molekul', 'Nefesinden Çıkan', 'Nefes verirken çıkardığın gazı kur.',
    'Ortada bir C, iki yanında birer O; ikisi de çift bağ.', molecule('co2')),
  q('qm05', O, 'molekul', 'Üçlü Güç', 'Üç elle birden tutuşan atomlar bul.',
    'İki N atomunu bağla ve bağa iki kez tıkla.', molecule('n2')),
  q('qm06', B, 'molekul', 'Mutfak Tuzu', 'Tuzu yapmak için hangi iki atom gerek?',
    'Bir sodyum (Na) ve bir klor (Cl).', molecule('nacl')),
  q('qm07', O, 'molekul', 'Ocak Gazı', 'Bir karbona dört hidrojen tak.',
    'Karbonun dört eli var; hepsine birer H.', molecule('ch4')),
  q('qm08', B, 'molekul', 'Elleri Cebinde', 'Helyumu başka bir atoma bağlamayı dene.',
    'Tezgâha bir He ve bir H koy, sonra onları bağlamaya çalış.', { type: 'nobleGasAttempt' }),
  q('qm09', O, 'molekul', 'Çürük Yumurta', 'Dünyanın en kötü kokusunu kur (sanal, kokmaz!).',
    'Suya benzer, ama oksijen yerine kükürt (S) var.', molecule('h2s')),
  q('qm10', O, 'molekul', 'Diş Dostu', 'Diş macunundaki maddeyi yap.',
    'Bir sodyum ve bir flor.', molecule('naf')),
  q('qm11', I, 'molekul', 'Yakutun Sırrı', 'Değerli taşların ana maddesini kur.',
    '2 Al ve 3 O: O=Al–O–Al=O.', molecule('al2o3')),
  q('qm12', I, 'molekul', 'Sirke Ustası', '8 atomlu sirke molekülünü kur.',
    'CH₃–C(=O)–O–H: 2 C, 2 O, 4 H.', molecule('c2h4o2')),
  q('qm13', I, 'molekul', 'Yumurtanın Zırhı', 'Yumurta kabuğunun maddesini kur.',
    'Bir C’ye üç O; ikisi tekli bağla Ca’ya tutunur.', molecule('caco3')),
  q('qm14', O, 'molekul', 'On Molekül', 'Defterine 10 molekül ekle.',
    'Tarif Defteri’ndeki ipuçlarına bak.', { type: 'moleculesFoundCount', min: 10 }),
  // ---------- Tepkime Kazanı ----------
  q('qt01', B, 'kazan', 'Mutfak Volkanı', 'Mutfaktan iki malzemeyle köpük taşır.',
    'Sirke ve karbonatı kazana koy.', reaction('r05')),
  q('qt02', B, 'kazan', 'Suda Dans Eden Metal', 'Sodyumu suya atarsan ne olur?',
    'Elementler rafından sodyumu, Mutfaktan suyu al.', reaction('r02')),
  q('qt03', O, 'kazan', 'Kim Daha Hırçın?', 'Lityum, sodyum ve potasyumu suyla dene. Fark var mı?',
    'Her birini ayrı ayrı suyla karıştır.', { type: 'all', of: [reaction('r01'), reaction('r02'), reaction('r03')] }),
  q('qt04', B, 'kazan', 'Pop!', 'Hidrojene ateş yaklaştır.',
    'Hidrojen balonunu kazana koy ve Ateş aracını seç.', reaction('r19')),
  q('qt05', B, 'kazan', 'Sakin Balon', 'Peki ya helyuma ateş yaklaştırırsan?',
    'Helyum balonu + Ateş aracı.', reaction('r20')),
  q('qt06', O, 'kazan', 'Havai Fişek Ustası', '4 farklı alev rengi bul.',
    'Laboratuvar rafındaki tuzları tek tek Ateş aracıyla dene.',
    { type: 'reactionsFoundCount', min: 4, filter: { tag: 'alev-testi' } }),
  q('qt07', O, 'kazan', 'Renk Değiştiren İksir', 'Lahana suyunu hem pembe hem mavi-yeşil yap.',
    'Bir kez ekşi bir şeyle, bir kez de karbonat ya da sabunla dene.',
    { type: 'all', of: [
      { type: 'any', of: [reaction('r13'), reaction('r14'), reaction('r17')] },
      { type: 'any', of: [reaction('r15'), reaction('r16'), reaction('r18')] },
    ] }),
  q('qt08', O, 'kazan', 'Zehirden Tuza', 'Bir metal ile zehirli bir gazdan tuz yap.',
    'Sodyum ile klor gazını karıştır.', reaction('r44')),
  q('qt09', O, 'kazan', 'Zaman Makinesi', 'Zamanı ileri sarıp demiri paslandır.',
    'Demir çivi + su, sonra Zaman aracı.', reaction('r41')),
  q('qt10', I, 'kazan', 'Suyu Parçala', 'Suyu yapı taşlarına ayırabilir misin?',
    'Kazana sadece su koy ve Elektrik aracını seç.', reaction('r45')),
  q('qt11', I, 'kazan', 'Barışma', 'Bir asit ile bir bazı karıştır.',
    'Tuz ruhu ile sud kostik.', reaction('r35')),
  q('qt12', O, 'kazan', 'Fil Diş Macunu', 'Dev bir köpük fışkırt.',
    'Oksijenli su ile maya.', reaction('r08')),
  q('qt13', O, 'kazan', 'Hiçbir Şey Olmadı!', 'Hiç tepkime vermeyen 3 deney bul.',
    'Soy gazlar ve soylu metaller pek tepki vermez: helyum, altın, bakır…',
    { type: 'reactionsFoundCount', min: 3, filter: { kind: 'tepkime-yok' } }),
  q('qt14', I, 'kazan', 'Kimyasal mı, Fiziksel mi?', 'Yeni madde oluşmayan 2 değişim bul.',
    'Tuzu suda çöz ya da suyu kaynat.', { type: 'reactionsFoundCount', min: 2, filter: { kind: 'fiziksel' } }),
  // ---------- Sıcaklık Odası ----------
  q('qs01', B, 'tablo', 'Sıvı İkili', 'Oda sıcaklığında sıvı olan iki elementi bul.',
    'Tabloda "Hâl" gözlüğünü tak; turkuaz olan iki kareye tıkla.',
    { type: 'all', of: [viewed(35), viewed(80)] }),
  q('qs02', B, 'sicaklik', 'Avuçta Eriyen Metal', 'Vücut sıcaklığında eriyen metali erit.',
    'Galyumu seç ve "Vücudun" düğmesine bas.', { type: 'phaseChangeSeen', z: 31, from: 'kati', to: 'sivi' },
    '/sicaklik?z=31'),
  q('qs03', O, 'sicaklik', 'Buz Gibi Hava', 'Azotu sıvı yapacak kadar soğut.',
    'Azotu seç ve "Sıvı azot" düğmesini dene.', { type: 'phaseChangeSeen', z: 7, from: 'gaz', to: 'sivi' },
    '/sicaklik?z=7'),
  q('qs04', I, 'sicaklik', 'Son Kale', 'En son eriyen metal hangisi? Onu erit.',
    'Tungsten (W) 3422 °C’de erir.', { type: 'phaseChangeSeen', z: 74, from: 'kati', to: 'sivi' }),
  q('qs05', O, 'sicaklik', 'Her Şey Gaz', 'Sıcaklığı sonuna kadar aç.',
    'Kaydırıcıyı en sağa çek.', { type: 'tempReached', atLeast: 6000 }),
  q('qs06', O, 'sicaklik', 'İnatçı Helyum', 'Helyumu dondurmayı dene.',
    'Helyumu seç ve kaydırıcıyı en sola çek.', { type: 'pinnedTempReached', z: 2, atMost: -272 }, '/sicaklik?z=2'),
  q('qs07', O, 'sicaklik', 'Demirci', 'Demiri eritecek kadar ısıt.',
    'Demiri seç ve "Demir ocağı" düğmesine bas.', { type: 'phaseChangeSeen', z: 26, from: 'kati', to: 'sivi' },
    '/sicaklik?z=26'),
  // ---------- Periyodik Tablo ----------
  q('qp01', B, 'tablo', 'Aile Toplantısı', '"Kimseye Bulaşmayanlar" ailesinin 6 üyesini de incele.',
    'Tablonun en sağ sütunu.', { type: 'elementsViewedCount', min: 6, filter: { family: 'soy-gaz' } }),
  q('qp02', B, 'tablo', 'Vücudumdaki Elementler', '"Vücudumda" gözlüğünü tak; parlayan 5 elementi incele.',
    'Gözlük seçiciden "Vücudumda"yı seç, parlayanlara tıkla.',
    { type: 'all', of: [
      { type: 'lensUsed', id: 'vucut' },
      { type: 'elementsViewedCount', min: 5, filter: { zIn: BODY_MAIN } },
    ] }),
  q('qp03', O, 'tablo', 'İsim Dedektifi', 'Adını bir yerden ya da ülkeden alan 3 element bul.',
    'Galyum, Germanyum, Fransiyum… Kartlardaki ad kökenine bak.',
    { type: 'elementsViewedCount', min: 3, filter: { originKind: 'yer' } }),
  q('qp04', B, 'tablo', 'Türkiye’nin Hazinesi', 'Dünyadaki rezervinin çoğu Türkiye’de olan element hangisi?',
    '5 numaralı elemente bak.', viewed(5)),
  q('qp05', O, 'tablo', 'Mendeleyev’in Tahmini', 'Bulunmadan önce tahmin edilen elementi bul.',
    'Adı bir ülkeden gelir ve 32 numaradır.', viewed(32)),
  q('qp06', O, 'tablo', 'Ünlüler Geçidi', '10 altın çerçeveli kart topla.',
    'Altın, gümüş, cıva, uranyum… Altın çerçeveli kartlar 37’den sonra başlar.',
    { type: 'elementsViewedCount', min: 10, filter: { famous: true } }),
  q('qp07', B, 'tablo', 'Kurşun Kalem Yalanı', 'Kurşun kalemin ucunda gerçekte ne var?',
    'Kurşun (Pb) ve Karbon (C) kartlarını aç.', { type: 'all', of: [viewed(82), viewed(6)] }),
];

export function getQuest(id: string): Quest | undefined {
  return QUESTS.find((x) => x.id === id);
}
