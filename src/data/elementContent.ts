/** Ek B — İlk 36 element için derin içerik; Ek C — ünlü elementler */

export interface DeepContent {
  z: number;
  shells: number[];
  stableMassNumbers: number[];
  whereTr: string;
  factTr: string;
  cautionTr?: string;
  icon: string;
}

export interface FamousContent {
  z: number;
  factTr: string;
  icon: string;
}

const WATER_REACTIVE = 'Suyla şiddetli tepkime verir; sadece özel laboratuvarlarda kullanılır.';

export const DEEP_CONTENT: DeepContent[] = [
  { z: 1, shells: [1], stableMassNumbers: [1, 2], icon: '💧',
    whereTr: "Suyun içinde (H₂O) ve Güneş'in yakıtında.",
    factTr: 'Evrendeki her 10 atomdan yaklaşık 9’u hidrojendir. En hafif element odur.' },
  { z: 2, shells: [2], stableMassNumbers: [3, 4], icon: '🎈',
    whereTr: 'Uçan balonların içinde.',
    factTr: 'İlk kez Dünya’da değil, Güneş’in ışığında fark edildi. Adı Yunanca "Güneş" demek.' },
  { z: 3, shells: [2, 1], stableMassNumbers: [6, 7], icon: '🔋', cautionTr: WATER_REACTIVE,
    whereTr: 'Telefon, tablet ve elektrikli araba pillerinde.',
    factTr: 'En hafif metaldir; o kadar hafiftir ki suda yüzer.' },
  { z: 4, shells: [2, 2], stableMassNumbers: [9], icon: '💚', cautionTr: 'Tozu solunursa zararlıdır.',
    whereTr: 'Zümrüt taşının içinde.',
    factTr: 'Uzaydaki dev James Webb teleskobunun aynaları berilyumdan yapıldı.' },
  { z: 5, shells: [2, 3], stableMassNumbers: [10, 11], icon: '🧪',
    whereTr: 'Isıya dayanıklı cam kaplarda ve deterjanlarda.',
    factTr: 'Dünyadaki bor rezervlerinin çoğu Türkiye’de!' },
  { z: 6, shells: [2, 4], stableMassNumbers: [12, 13], icon: '✏️',
    whereTr: 'Kurşun kalem ucunda, kömürde ve bütün canlılarda.',
    factTr: 'Kalem ucundaki grafit de pırıl pırıl elmas da aynı elementten, karbondan yapılır.' },
  { z: 7, shells: [2, 5], stableMassNumbers: [14, 15], icon: '🥔',
    whereTr: 'Soluduğun havanın yaklaşık %78’i azottur.',
    factTr: 'Cips paketleri hava değil, azot gazıyla şişirilir; böylece cipsler bayatlamaz.' },
  { z: 8, shells: [2, 6], stableMassNumbers: [16, 17, 18], icon: '🫁',
    whereTr: 'Her nefeste içine çektiğin havada ve suda.',
    factTr: 'Vücut ağırlığının yarısından fazlası oksijen atomlarıdır.' },
  { z: 9, shells: [2, 7], stableMassNumbers: [19], icon: '🪥', cautionTr: 'Çok zehirli ve yakıcı bir gaz.',
    whereTr: 'Diş macununda (florür olarak).',
    factTr: 'Tablonun en hırçın elementi: neredeyse her şeyle tepkimeye girer.' },
  { z: 10, shells: [2, 8], stableMassNumbers: [20, 21, 22], icon: '🪧',
    whereTr: 'Işıklı tabelalarda.',
    factTr: 'İçinden elektrik geçince kızıl-turuncu parlar. Adı "yeni" demek.' },
  { z: 11, shells: [2, 8, 1], stableMassNumbers: [23], icon: '🧂', cautionTr: WATER_REACTIVE,
    whereTr: 'Sofra tuzunda (sodyum + klor).',
    factTr: 'Bıçakla kesilecek kadar yumuşak bir metaldir ve suya değince fışırdar.' },
  { z: 12, shells: [2, 8, 2], stableMassNumbers: [24, 25, 26], icon: '🥬',
    whereTr: 'Yeşil yaprakların içinde, fındık ve ıspanakta.',
    factTr: 'Yanarken göz kamaştırıcı beyaz bir ışık saçar; maytaplar bu yüzden parlar.' },
  { z: 13, shells: [2, 8, 3], stableMassNumbers: [27], icon: '🥫',
    whereTr: 'Alüminyum folyoda, içecek kutularında, uçaklarda.',
    factTr: 'Bir zamanlar altından bile değerliydi! Oysa yer kabuğunda en bol bulunan metaldir.' },
  { z: 14, shells: [2, 8, 4], stableMassNumbers: [28, 29, 30], icon: '💻',
    whereTr: 'Kumda, camda ve bilgisayar çiplerinde.',
    factTr: 'Bilgisayarların beyni olan çipler silisyumdan yapılır.' },
  { z: 15, shells: [2, 8, 5], stableMassNumbers: [31], icon: '🔥', cautionTr: 'Beyaz fosfor kendiliğinden tutuşabilir.',
    whereTr: 'Kibrit kutusunun sürtme yüzeyinde, kemiklerinde ve DNA’nda.',
    factTr: '1669’da bir simyacı altın yapmaya çalışırken çişi kaynattı ve fosforu buldu!' },
  { z: 16, shells: [2, 8, 6], stableMassNumbers: [32, 33, 34, 36], icon: '🌋',
    whereTr: 'Yanardağların çevresinde sarı kristaller olarak.',
    factTr: 'Çürük yumurtanın kokusu ve soğan doğrarken gözünü yaşartan şey kükürtlü maddelerdir.' },
  { z: 17, shells: [2, 8, 7], stableMassNumbers: [35, 37], icon: '🏊', cautionTr: 'Zehirli gaz.',
    whereTr: 'Havuz suyunda ve sofra tuzunda.',
    factTr: 'Tek başına zehirli, sarı-yeşil bir gazdır; ama sodyumla birleşince yemeğine attığın tuz olur.' },
  { z: 18, shells: [2, 8, 8], stableMassNumbers: [36, 38, 40], icon: '💡',
    whereTr: 'Havada (yaklaşık %1) ve ampullerin içinde.',
    factTr: 'Adı Yunanca "tembel" demek, çünkü hiçbir şeyle tepkimeye girmez.' },
  { z: 19, shells: [2, 8, 8, 1], stableMassNumbers: [39, 41], icon: '🍌', cautionTr: WATER_REACTIVE,
    whereTr: 'Muzda, patateste ve kaslarında.',
    factTr: 'Sembolü K, çünkü Latince adı "kalium". Suya atılınca lila renkli alevle yanar.' },
  { z: 20, shells: [2, 8, 8, 2], stableMassNumbers: [40, 42, 43, 44, 46, 48], icon: '🦴',
    whereTr: 'Kemiklerinde, dişlerinde, sütte ve yumurta kabuğunda.',
    factTr: 'Vücudunda en çok bulunan metal kalsiyumdur.' },
  { z: 21, shells: [2, 8, 9, 2], stableMassNumbers: [45], icon: '🚲',
    whereTr: 'Hafif ve sağlam bisiklet gövdelerinde, stadyum ışıklarında.',
    factTr: 'Adını İskandinavya’dan alır.' },
  { z: 22, shells: [2, 8, 10, 2], stableMassNumbers: [46, 47, 48, 49, 50], icon: '✈️',
    whereTr: 'Uçaklarda, roketlerde ve vücuda takılan yapay eklemlerde.',
    factTr: 'Çelik kadar sağlam ama ondan çok daha hafif. Beyaz boyaların beyazı da ondan gelir.' },
  { z: 23, shells: [2, 8, 11, 2], stableMassNumbers: [51], icon: '🔧',
    whereTr: 'İngiliz anahtarı gibi sağlam el aletlerinde.',
    factTr: 'Bileşikleri rengârenk olduğu için adını İskandinav güzellik tanrıçası Vanadis’ten aldı.' },
  { z: 24, shells: [2, 8, 13, 1], stableMassNumbers: [50, 52, 53, 54], icon: '🚰',
    whereTr: 'Pırıl pırıl musluklarda ve paslanmaz çelikte.',
    factTr: 'Yakutun kırmızısı da zümrütün yeşili de kromdan gelir.' },
  { z: 25, shells: [2, 8, 13, 2], stableMassNumbers: [55], icon: '🔋',
    whereTr: 'Kalem pillerin içinde ve çelikte.',
    factTr: 'Okyanusların dibinde patates büyüklüğünde mangan yumruları yatar.' },
  { z: 26, shells: [2, 8, 14, 2], stableMassNumbers: [54, 56, 57, 58], icon: '🔩',
    whereTr: 'Çivilerde, köprülerde ve kanında.',
    factTr: 'Kanının kırmızı rengi demirden gelir. Dünya’nın çekirdeği de çoğunlukla demirdir.' },
  { z: 27, shells: [2, 8, 15, 2], stableMassNumbers: [59], icon: '🔵',
    whereTr: 'Masmavi cam ve seramiklerde, şarjlı pillerde.',
    factTr: 'Adı Almanca "kobold" yani "maden cini" sözünden gelir. B12 vitamininin içinde de var.' },
  { z: 28, shells: [2, 8, 16, 2], stableMassNumbers: [58, 60, 61, 62, 64], icon: '🪙',
    whereTr: 'Madenî paralarda ve paslanmaz çelikte.',
    factTr: 'Mıknatısın çektiği birkaç metalden biridir. Uzaydan düşen göktaşlarında bolca bulunur.' },
  { z: 29, shells: [2, 8, 18, 1], stableMassNumbers: [63, 65], icon: '🔌',
    whereTr: 'Elektrik kablolarının içinde.',
    factTr: 'Özgürlük Heykeli bakırdan yapıldı; zamanla hava ve yağmur onu yeşile çevirdi.' },
  { z: 30, shells: [2, 8, 18, 2], stableMassNumbers: [64, 66, 67, 68, 70], icon: '🎺',
    whereTr: 'Paslanmasın diye kaplanan demirlerde, güneş kreminde.',
    factTr: 'Bakırla karışınca pirinç olur; trompet gibi çalgılar pirinçten yapılır.' },
  { z: 31, shells: [2, 8, 18, 3], stableMassNumbers: [69, 71], icon: '🤲',
    whereTr: 'LED lambalarda ve telefon ekranlarında.',
    factTr: 'Avucunun içinde eriyen metal! Erime noktası sadece 29,8 °C.' },
  { z: 32, shells: [2, 8, 18, 4], stableMassNumbers: [70, 72, 73, 74, 76], icon: '🔭',
    whereTr: 'İnternet taşıyan fiber kablolarda, gece görüş kameralarında.',
    factTr: 'Mendeleyev bu elementin var olduğunu, bulunmasından 15 yıl önce tablosundaki boşluktan tahmin etti.' },
  { z: 33, shells: [2, 8, 18, 5], stableMassNumbers: [75], icon: '☠️', cautionTr: 'Zehirli.',
    whereTr: 'Bazı hızlı elektronik çiplerde.',
    factTr: 'Tarihin en ünlü zehirlerinden biridir.' },
  { z: 34, shells: [2, 8, 18, 6], stableMassNumbers: [74, 76, 77, 78, 80, 82], icon: '🌰',
    whereTr: 'Kepek şampuanında ve Brezilya cevizinde.',
    factTr: 'Adını Ay’dan alır (Yunanca "selene").' },
  { z: 35, shells: [2, 8, 18, 7], stableMassNumbers: [79, 81], icon: '🧯', cautionTr: 'Zehirli ve yakıcı sıvı.',
    whereTr: 'Bazı yangın söndürücü maddelerde.',
    factTr: 'Oda sıcaklığında sıvı olan yalnızca iki elementten biri. Adı "pis koku" demek!' },
  { z: 36, shells: [2, 8, 18, 8], stableMassNumbers: [78, 80, 82, 83, 84, 86], icon: '📸',
    whereTr: 'Bazı fotoğraf flaşlarında ve pist ışıklarında.',
    factTr: 'Adı "gizli" demek. Bir zamanlar 1 metrenin uzunluğu kriptonun ışığıyla tanımlanıyordu.' },
];

export const FAMOUS_CONTENT: FamousContent[] = [
  { z: 38, icon: '🎆', factTr: 'Havai fişeklerin parlak kırmızı rengi stronsiyumdan gelir.' },
  { z: 43, icon: '🏭', factTr: 'İnsanların laboratuvarda ürettiği ilk element. Adı "yapay" demek.' },
  { z: 47, icon: '🥈', factTr: 'Bütün metaller içinde elektriği ve ısıyı en iyi ileten odur. Aynaların arkası da gümüşle parlatılır.' },
  { z: 50, icon: '🛡️', factTr: 'Bakırla karışınca bronz (tunç) olur; insanlık tarihindeki Tunç Çağı adını bundan alır.' },
  { z: 53, icon: '🧂', factTr: 'Sağlıklı büyümen için gerekli; bu yüzden sofra tuzuna iyot eklenir. Isınınca mor bir buhar çıkarır.' },
  { z: 54, icon: '🚀', factTr: 'Bazı uzay araçlarının iyon motorları ksenon gazı püskürterek ilerler.' },
  { z: 55, icon: '⏱️', factTr: 'Dünyanın en hassas saatleri sezyum atomlarıyla çalışır. "1 saniye" sezyumla tanımlanır!' },
  { z: 56, icon: '🎇', factTr: 'Havai fişeklerin yeşil rengi baryumdan gelir.' },
  { z: 60, icon: '🧲', factTr: 'Dünyanın en güçlü mıknatısları neodimden yapılır; kulaklıklarının içinde bile var.' },
  { z: 74, icon: '💡', factTr: 'Erimesi en zor metal: ancak 3422 °C’de erir. Diğer adı Volfram; sembolü bu yüzden W.' },
  { z: 78, icon: '🚗', factTr: 'Altından bile daha nadir. Arabaların egzozundaki zararlı gazları temizlemeye yardım eder.' },
  { z: 79, icon: '🥇', factTr: 'Asla paslanmaz. Tarih boyunca çıkarılan bütün altın, yaklaşık 4 olimpik havuzu ancak doldurur.' },
  { z: 80, icon: '🌡️', factTr: 'Oda sıcaklığında sıvı olan tek metal. Zehirlidir; eski termometrelerde kullanılırdı.' },
  { z: 82, icon: '🦺', factTr: 'Çok ağırdır; röntgen çekilirken seni koruyan önlüğün içinde kurşun vardır. Bu arada kurşun kalemde kurşun yoktur, karbon vardır!' },
  { z: 84, icon: '🇵🇱', factTr: 'Marie Curie keşfetti ve ona vatanı Polonya’nın adını verdi.' },
  { z: 86, icon: '🌫️', factTr: 'Radyoaktif bir soy gaz. Toprağın derinliklerinden kendiliğinden sızar.' },
  { z: 88, icon: '✨', factTr: 'Marie ve Pierre Curie buldu. O kadar radyoaktiftir ki karanlıkta hafifçe parlar.' },
  { z: 92, icon: '⚛️', factTr: 'Nükleer santrallerin yakıtı. Adını Uranüs gezegeninden alır.' },
  { z: 94, icon: '🛰️', factTr: 'Voyager gibi uzay araçları, onlarca yıldır plütonyumlu nükleer pillerle çalışıyor.' },
  { z: 99, icon: '🧠', factTr: 'Adını ünlü fizikçi Albert Einstein’dan alır.' },
  { z: 101, icon: '📋', factTr: 'Adını periyodik tablonun mucidi Dimitri Mendeleyev’den alır.' },
  { z: 118, icon: '🔚', factTr: 'Tablonun şimdilik son elementi. Bugüne kadar yalnızca birkaç atomu üretilebildi.' },
];

const DEEP_BY_Z = new Map(DEEP_CONTENT.map((d) => [d.z, d]));
const FAMOUS_BY_Z = new Map(FAMOUS_CONTENT.map((d) => [d.z, d]));

export function getDeep(z: number): DeepContent | undefined {
  return DEEP_BY_Z.get(z);
}

export function getFamous(z: number): FamousContent | undefined {
  return FAMOUS_BY_Z.get(z);
}

export const FAMOUS_ZS = FAMOUS_CONTENT.map((f) => f.z);
