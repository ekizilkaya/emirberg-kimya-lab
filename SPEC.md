# Emirberg Kimya Lab — Ürün ve Teknik Şartname (v1.0)

> **Bu belge kimin için?** Oyunu kodlayacak yazılım asistanı için. Belge tek başına yeterli olacak şekilde yazıldı: ürün kararları, ekran davranışları, oyun kuralları, veri modelleri, hazır Türkçe içerik ve kabul ölçütleri burada. Belirsiz kalan bir nokta olursa önce Bölüm 2'deki tasarım ilkelerine, sonra Bölüm 19'daki varsayımlara bak.

---

## 0. Kararların özeti

| Konu | Karar |
|---|---|
| Oyuncu | Emir, 10 yaşında. Meraklı ama kimyaya **sıfırdan** başlıyor (atom, element kavramlarını bilmiyor). |
| Cihaz | **Yalnızca bilgisayar** (fare + klavye, masaüstü tarayıcı). Dokunmatik/mobil desteği kapsam dışı. |
| Dil | Arayüz ve anlatım **Türkçe**. Element kartlarında İngilizce ad küçük yazıyla ayrıca gösterilir. |
| Oyun tarzı | **Serbest keşif (sandbox)**. Bölüm, can, süre, kaybetme yok. |
| İçerik kapsamı | İlk **36 element derinlemesine** (H–Kr), **118 elementin tamamı** tabloda gezilebilir. |
| Atölyeler | Periyodik Tablo (merkez) + Atom Kurucu + Molekül Atölyesi + Tepkime Kazanı + Sıcaklık Odası. |
| Motivasyon | Keşif Defteri + rozetler + isteğe bağlı "Merak Görevleri". |
| Teknoloji | Vite + React + TypeScript; tamamen istemci tarafı, sunucusuz, çevrimdışı çalışır. |

---

## 1. Ürün özeti

**Emirberg Kimya Lab**, Emir'in kendi sanal laboratuvarıdır. Emir periyodik tabloda gezinir, parçacıklardan atom kurar, atomları birleştirip molekül yapar, maddeleri kazanda karıştırıp ne olduğunu izler ve sıcaklığı değiştirip elementlerin erimesini, kaynamasını seyreder. Bulduğu her şey Keşif Defteri'ne işlenir.

Oyun bir ders değil, bir oyun alanıdır: bilgi, Emir bir şeye dokunduğu anda ve o şeyle ilgili olarak, kısa cümlelerle verilir. Hedef, on beş dakikalık bir oturumun sonunda Emir'in "bir şey daha deneyeyim" demesidir.

**Başarı ölçütü (ürün düzeyinde):** Oyunu bir süre oynadıktan sonra Emir şunları kendi cümleleriyle anlatabilmeli:
- Her şey atomlardan oluşur; atomun içinde proton, nötron, elektron vardır.
- Bir atomun hangi element olduğunu **proton sayısı** belirler.
- Periyodik tablo elementlerin düzenli bir haritasıdır; aynı ailedeki elementler benzer davranır.
- Atomlar birleşip molekül/bileşik oluşturur; su H₂O'dur.
- Bazı maddeler karışınca yepyeni maddeler oluşur (kimyasal tepkime), bazıları sadece şekil değiştirir (fiziksel değişim).
- Maddeler sıcaklığa göre katı, sıvı ya da gaz olur.

---

## 2. Tasarım ilkeleri

Çelişki durumunda üstteki ilke alttakini yener.

1. **Yanlış yok, sadece keşif.** Hiçbir eylem cezalandırılmaz. "Yanlış!" ifadesi, kırmızı çarpı, can, süre, puan kaybı yoktur. Beklenmedik sonuç da bir keşiftir ("Hiçbir şey olmadı — bu da bir sonuç!").
2. **Önce dokun, sonra oku.** Her etkileşim en geç 100 ms içinde görsel/işitsel karşılık verir. Açıklama, eylemden *sonra* ve o eylemle ilgili olarak gelir.
3. **Kısa metin.** Tek seferde en çok 2 cümle, en çok ~140 karakter. Uzun bilgi "Daha fazla" ile açılır. 10 yaş okuma düzeyi; yabancı terim ilk geçtiği yerde gündelik bir benzetmeyle açıklanır.
4. **Gerçek hayata bağla.** Her element, molekül ve tepkime Emir'in tanıdığı bir şeye bağlanır (muz, balon, tuz, telefon pili).
5. **Doğru ama sade.** Bilimsel olarak yanlış bilgi verilmez. Sadeleştirme yapılan yerler Bölüm 18'de listelidir; bunların dışına çıkılmaz.
6. **Güvenlik bilinci.** Tehlikeli deneyler "yalnızca sanal laboratuvarda" etiketiyle, evde yapılabilecekler "bir büyüğünle deneyebilirsin" etiketiyle açıkça ayrılır.
7. **Yönlendirme var, zorlama yok.** Görevler ipucu verir ama hiçbir alan görev tamamlanmadan kilitli değildir.

---

## 3. Öğrenme hedefleri → nerede kazanılır

| Kavram | Atölye | Nasıl |
|---|---|---|
| Atom, proton, nötron, elektron | Tanıtım, Atom Kurucu | Parçacık ekleyip atom kurarak |
| Atom numarası = kimlik | Atom Kurucu | Proton ekledikçe element adının değişmesi |
| Elektron katmanları | Atom Kurucu | Katmanların dolma animasyonu |
| İyon (yüklü atom) | Atom Kurucu | Elektron ekleyip çıkararak yük göstergesi |
| İzotop, kararlı/radyoaktif | Atom Kurucu | Nötron sayısıyla çekirdeğin sallanması |
| Periyodik tablo düzeni, aileler | Periyodik Tablo | Renkli aileler, "gözlükler" |
| Element ↔ günlük hayat | Element kartları | "Nerede bulurum?" alanı |
| Molekül, bağ, formül | Molekül Atölyesi | "Eller" modeliyle bağ kurarak |
| Soy gazlar neden bağ yapmaz | Atom Kurucu + Molekül Atölyesi | Dolu dış katman + "elsiz" atom |
| Kimyasal tepkime / fiziksel değişim | Tepkime Kazanı | Karıştır–izle–oku |
| Asit–baz, indikatör | Tepkime Kazanı | Kırmızı lahana suyu renk deneyleri |
| Aile içi eğilim | Tepkime Kazanı | Li → Na → K → Cs suyla giderek şiddetlenir |
| Katı–sıvı–gaz, erime/kaynama | Sıcaklık Odası | Sıcaklık kaydırıcısı + tanecik kutusu |

---

## 4. Genel yapı ve gezinme

### 4.1 Ekran haritası

```
┌──────────────────────────────────────────────────────────────────────┐
│ Üst çubuk: [Logo] [Maskot balonu / ipucu]   [Görev Panosu] [Unvan+KP] [🔊] [⚙] │
├───────┬──────────────────────────────────────────────────────────────┤
│ Yan   │                                                              │
│ menü  │                Etkin atölyenin sahnesi                       │
│       │                                                              │
│ Tablo │                                                              │
│ Atom  │                                                              │
│ Molekül│                                                             │
│ Kazan │                                                              │
│ Sıcaklık│                                                            │
│ Defter│                                                              │
└───────┴──────────────────────────────────────────────────────────────┘
```

- **Yan menü** (sol, sabit, ~88 px): simge + kısa etiket. Sırasıyla: Periyodik Tablo (ana ekran), Atom Kurucu, Molekül Atölyesi, Tepkime Kazanı, Sıcaklık Odası, Keşif Defteri. Etkin öğe vurgulu. Klavye kısayolu: `1`–`6`.
- **Üst çubuk**: maskot ve konuşma balonu (bağlamsal ipucu), Görev Panosu düğmesi (açılır panel), unvan ve Keşif Puanı (KP), ses aç/kapa, ayarlar.
- Uygulama açıldığında (tanıtım bittiyse) **Periyodik Tablo** gelir.
- Atölyeler arası geçiş durumu korur: Atom Kurucu'da yarım kalan atom, başka atölyeye gidip dönünce yerinde durur (oturum içi; kalıcı kayıt gerekmez).

### 4.2 Atölyeler arası bağlantılar (önemli)

Atölyeler birbirine "derin bağlantı" ile bağlıdır; sandbox'ı tek parça hissettiren şey budur:

- Element kartı → **"Atomunu kur"** (Atom Kurucu, hedef modu) · **"Isıt / soğut"** (Sıcaklık Odası, element sabitlenmiş) · bu elementi içeren keşfedilmiş moleküller ve tepkimeler (ilgili defter kartına gider).
- Atom Kurucu'da bir element kurulunca → "Kartına bak" düğmesi.
- Molekül kartı → içindeki elementlerin kartları.
- Tepkime kartı → ilgili element kartları; ürün bir katalog molekülüyse o molekülün kartı.
- Görev kartı → **"Beni oraya götür"** düğmesi ilgili atölyeyi açar.

### 4.3 Ekran boyutu

- Tasarım hedefi 1440×900; en küçük desteklenen görünüm alanı **1280×720**. 1920×1080'de düzen büyür (sahne ölçeklenir, metin okunaklı kalır).
- 1280×720'den küçük pencerede sahne orantılı küçültülür ve "Pencereyi büyütürsen daha rahat oynarsın" notu gösterilir.
- Ayarlarda **Tam ekran** düğmesi (Fullscreen API).

---

## 5. İlk açılış: tanıtım (≈3 dakika, atlanabilir)

Emir sıfırdan başladığı için ilk açılışta kısa, etkileşimli bir tanıtım oynatılır. Sağ üstte her zaman "Geç" düğmesi vardır.

1. **Karşılama.** Maskot Mol kendini tanıtır: "Merhaba! Ben Mol. Burası senin laboratuvarın." Ad sorulur (metin kutusu, varsayılan değer `Emir`, en çok 16 karakter). Ad, diplomada ve maskot konuşmalarında kullanılır.
2. **Yakınlaşma animasyonu.** Bir bardak su → su damlası → su molekülleri → tek bir atom. Emir fare tekerleğiyle ya da "Yaklaş" düğmesiyle 3 adımda yakınlaşır. Metin: "Her şey, ama her şey, atom denen minicik parçalardan yapılmıştır."
3. **İlk atom.** Atom Kurucu'nun sadeleştirilmiş hâli açılır. Emir bir proton sürükler → "Hidrojen" yazısı belirir. Bir elektron sürükler → elektron çekirdeğin çevresinde dönmeye başlar. Metin: "İşte evrenin en basit atomu: Hidrojen!"
4. **İlk kart.** Hidrojen kartı uçarak tabloya yerleşir; **Çırak Kimyager** rozeti verilir.
5. **Serbest bırakma.** Mol: "Artık laboratuvar senin. Merak ettiğin her şeye dokun!" Görev Panosu ilk 3 görevle açılır ve kısaca gösterilir.

Ayrıca her atölyenin **ilk ziyaretinde** en çok 3 adımlık bir ipucu turu (vurgulanan alan + tek cümle) gösterilir. Turlar ayarlardan yeniden oynatılabilir.

---

## 6. Periyodik Tablo (merkez)

### 6.1 Düzen

- Standart 18 sütunlu düzen; lantanitler (57–71) ve aktinitler (89–103) altta iki ayrı satır. 6. ve 7. periyodun 3. grup hücrelerinde "57–71" ve "89–103" yer tutucuları bulunur; tıklanınca ilgili satır vurgulanır.
- Her hücre: atom numarası (sol üst), sembol (büyük, ortada), Türkçe ad (altta, küçük), keşif durumunu gösteren yıldızlar/işaret.
- Grup (1–18) ve periyot (1–7) numaraları kenarlarda görünür.
- Tablonun altında/sağında **lejant** (aile renkleri + takma adlar) ve **gözlük seçici** bulunur.
- Sağ üstte **arama kutusu**: ad (TR/EN), sembol ya da atom numarasıyla. Eşleşmeyenler soluklaşır. Arama Türkçe'ye duyarlıdır (`İ/i`, `I/ı`; "iyot", "IYOT", "İyot" aynı sonucu verir).
- Sol üst boşlukta (H ile He arasındaki alan) **Günün Elementi** kutusu: her gün, henüz incelenmemiş elementlerden biri (hepsi incelendiyse rastgele biri) öne çıkarılır.

### 6.2 Etkileşim

- **Üzerine gelme:** hücre hafifçe büyür; küçük ipucu balonu: ad, aile, oda sıcaklığındaki hâl.
- **Tıklama / Enter:** element kartı açılır (sağdan kayan panel, tablo arkada görünür kalır).
- **Klavye:** ok tuşlarıyla hücreler arasında gezinme (tablodaki boşluklar atlanır), `Enter` kartı açar, `Esc` kapatır, `/` aramaya odaklanır.
- İlk kez açılan kart için kısa "yeni kart" animasyonu ve ses; defterde kayıt.

### 6.3 Gözlükler (görünüm modları)

Tek seferde bir gözlük etkindir; tabloyu yeniden boyar.

| Gözlük | Ne gösterir |
|---|---|
| **Aileler** (varsayılan) | 10 aile + "henüz bilinmiyor" renkleri |
| **Hâl** | 25 °C'de katı / sıvı / gaz / bilinmiyor |
| **Keşiflerim** | Yıldız sayısına göre parlaklık; incelenmemişler soluk |
| **Vücudumda** | İnsan vücudundaki ana elementler (O, C, H, N, Ca, P, K, S, Na, Cl, Mg) parlak; eser elementler (Fe, Zn, Cu, I, Se, Mn, Co, Mo) yarı parlak; diğerleri soluk |
| **Işıyanlar** | Radyoaktif elementler (43, 61, 84–118) |
| **İnsan yapımı** | Doğada bulunmayan/yalnızca laboratuvarda üretilenler (43, 61, 93–118; kartta "doğada yok denecek kadar az" notu) |

### 6.4 Aileler

Her ailenin resmî adı, çocuk dostu takma adı, rengi ve küçük bir simgesi vardır (renk tek ayırt edici olmamalı).

| Kimlik | Resmî ad | Takma ad | Tek cümle | Üyeler |
|---|---|---|---|---|
| `alkali` | Alkali metaller | Hırçın Çete | Suyla karşılaşınca çılgına dönerler. | Li, Na, K, Rb, Cs, Fr |
| `toprak-alkali` | Toprak alkali metaller | Sağlam Yapıcılar | Kemiklerin, kayaların, kirecin içindeler. | Be, Mg, Ca, Sr, Ba, Ra |
| `gecis` | Geçiş metalleri | Metal Ustaları | Demir, bakır, altın… bildiğin metallerin çoğu. | 21–30, 39–48, 72–80, 104–108 |
| `gecis-sonrasi` | Geçiş sonrası metaller | Yumuşak Metaller | Kolay eriyen, kolay şekil alan metaller. | Al, Ga, In, Sn, Tl, Pb, Bi, Po |
| `yari-metal` | Yarı metaller | İki Arada Kalanlar | Biraz metal, biraz ametal gibi davranırlar. | B, Si, Ge, As, Sb, Te |
| `ametal` | Ametaller | Hayatın Yapı Taşları | Canlıların vücudu en çok bunlardan oluşur. | H, C, N, O, P, S, Se |
| `halojen` | Halojenler | Tuz Yapıcılar | Metallerle birleşip tuz oluştururlar. | F, Cl, Br, I, At |
| `soy-gaz` | Soy gazlar | Kimseye Bulaşmayanlar | Dış katmanları dolu; kimseyle bağ kurmazlar. | He, Ne, Ar, Kr, Xe, Rn |
| `lantanit` | Lantanitler | Nadir Hazineler | Telefonların, mıknatısların gizli malzemeleri. | 57–71 |
| `aktinit` | Aktinitler | Işıyan Devler | Hepsi radyoaktif, çok ağır atomlar. | 89–103 |
| `bilinmeyen` | Özellikleri henüz bilinmiyor | Gizemliler | Yalnızca birkaç atomu üretilebildi. | 109–118 |

### 6.5 Element kartı

İki kart türü vardır.

**Derin kart (1–36):**
- Başlık: sembol (büyük), Türkçe ad, altında küçük İngilizce ad (ör. *Hydrogen*), atom numarası.
- Aile rozeti (takma adla), 25 °C'deki hâl, yaklaşık atom kütlesi (tam sayıya ya da 1 ondalığa yuvarlanmış).
- **Mini atom modeli:** elektron katmanlarını gösteren dönen küçük çizim (Atom Kurucu'daki çizimin küçüğü).
- **Nerede bulurum?** (Ek B'den) + ilgili büyük emoji/simge.
- **İlginç bilgi** (Ek B'den).
- Varsa **Dikkat!** notu (zehirli, yanıcı vb.).
- **Yıldızlar (3):** ⭐ İncelendi · ⭐ Atomu kuruldu · ⭐ Kullanıldı (bkz. 11.1). Kazanılmamış yıldızın üzerine gelince nasıl kazanılacağı yazar.
- Eylem düğmeleri: **Atomunu kur**, **Isıt / soğut**.
- "Bulduğun bağlantılar": bu elementi içeren keşfedilmiş molekül ve tepkimelerin küçük kartları.

**Kısa kart (37–118):**
- Başlık, aile, hâl, kütle; "ışıyan" ve "insan yapımı" etiketleri (varsa).
- Ek C'deki **ünlü elementler** altın çerçeveli kart olarak gösterilir ve Ek C'deki bilgiyi içerir.
- Diğerleri için veriden üretilen tek cümle (ör. "Rutenyum, Metal Ustaları ailesinden bir metaldir.") ve varsa ad kökeni (Ek H).
- Tek yıldız: ⭐ İncelendi. Eylem düğmesi: **Isıt / soğut** (erime/kaynama verisi varsa).
- Kısa not: "Bu atom çok büyük; Atom Kurucu şimdilik 36 protona kadar çalışıyor."

---

## 7. Atom Kurucu

### 7.1 Sahne

- **Orta:** atom. Ortada çekirdek (protonlar kırmızı "+", nötronlar gri kürecikler; üst üste kümelenir), çevresinde eşmerkezli halkalar olarak elektron katmanları; elektronlar (mavi "−") halkalar üzerinde yavaşça döner.
- **Alt:** üç parçacık kabı — **Proton**, **Nötron**, **Elektron**. Her kabın üstünde o anki sayı ve `−` / `+` düğmeleri.
- **Sağ panel (canlı gösterge):**
  - Element: ad + sembol (proton sayısından). 0 protonda: "Henüz bir element değil — proton ekle!"
  - İzotop adı: "Karbon-12" (ad + kütle numarası).
  - Kütle numarası: proton + nötron.
  - **Yük:** terazi benzeri gösterge. `Nötr` / `+2 yüklü iyon` / `−1 yüklü iyon`.
  - **Çekirdek durumu:** `Kararlı` (sakin) / `Kararsız — radyoaktif` (çekirdek titrer, hafif ışıma).
  - Hedef modundaysa: hedef kontrol listesi.
- **Üst:** `Sıfırla`, `Rastgele element` (1–36 arası rastgele bir nötr kararlı atom yükler; yıldız kazandırmaz), `Kartına bak`.

### 7.2 Etkileşim

- Kaptan sahneye **sürükle-bırak** ile 1 parçacık eklenir. Kaba **tıklama** da 1 ekler; **Shift+tıklama** 5 ekler.
- Çıkarma: parçacığı sahneden dışarı sürükle, ya da `−` düğmesi (Shift ile 5), ya da parçacığa sağ tık.
- Klavye: `P`, `N`, `E` ekler; `Shift+P/N/E` çıkarır; `R` sıfırlar.
- Sınırlar: proton 0–36, nötron 0–60, elektron 0–40. Sınıra gelince kap hafifçe sallanır, Mol: "Bu kap şimdilik bu kadar alıyor!"
- Protonlar ve nötronlar çekirdeğe, elektronlar otomatik olarak doğru katmana yerleşir (animasyonlu). Çok parçacıklı çekirdekte tek tek kürecik çizmek yerine kümelenmiş, performanslı bir çizim kullanılabilir; sayılar her zaman kaplardan okunur.

### 7.3 Kurallar (saf fonksiyonlar; birim testi zorunlu)

**Element:** `Z = proton sayısı`. `Z = 0` → element yok.

**Yük:** `yük = proton − elektron`.

**Kararlılık:** `(Z, A = proton + nötron)` çifti Ek B'deki kararlı izotop listesindeyse `kararlı`, değilse `kararsız`. Bozunma simüle edilmez; yalnızca görsel titreme ve etiket.

**Nötron ipucu:** Çekirdek kararsızsa Mol yön verir: A, en yakın kararlı A'dan küçükse "Çekirdek sallanıyor… biraz daha nötron lazım.", büyükse "Nötron fazla geldi, birkaçını çıkar."

**Elektron katmanları (Bohr modeli, sadeleştirilmiş):**
1. `Z` protonlu nötr atomun katman dizilimi Ek B'deki tablodan alınır (ör. Fe: 2, 8, 14, 2).
2. Elektron sayısı `Z`'den **azsa**: eksik elektronlar en dış katmandan başlayarak çıkarılır; katman boşalırsa bir içtekine geçilir.
3. Elektron sayısı `Z`'den **fazlaysa**: fazla elektronlar en dış katmana eklenir; en dış katman dolunca (1. katman için 2, diğerleri için 8) yeni katman açılır.
4. `Z = 0` iken elektron varsa: elektron sayısı kadar protonu olan nötr atomun dizilimi kullanılır (36 ile sınırlanır).

**"Atomu kuruldu" koşulu (2. yıldız):** `proton = Z`, `elektron = Z` (nötr) ve çekirdek kararlı. Koşul sağlandığında kutlama animasyonu, ses, "Karbon atomunu kurdun!" ve defter kaydı. `Rastgele element` ile yüklenen atom, en az bir parçacığı değiştirilip yeniden tamamlanmadıkça yıldız vermez.

### 7.4 Öğretici anlar (Mol'ün tek seferlik balonları)

| Tetikleyici | Mesaj |
|---|---|
| İlk proton | "Proton sayısı atomun kimlik numarasıdır. 1 proton = Hidrojen!" |
| Proton sayısı değişti | "Bir proton daha ekledin, artık bambaşka bir element: {ad}!" |
| İlk nötron | "Nötronlar çekirdeği bir arada tutan yapıştırıcı gibidir." |
| İlk kez 1. katman doldu | "İlk katman doldu! En içteki katman sadece 2 elektron alır." |
| İlk kez yüklü atom | "Proton ve elektron sayısı eşit değil. Artık bu bir iyon — yani yüklü bir atom!" |
| İlk kez soy gaz dizilimi | "Dış katman tıka basa dolu. Böyle atomlar kimseyle bağ kurmak istemez." |
| İlk kararsız çekirdek | "Çekirdek sallanıyor! Böyle atomlara radyoaktif denir; zamanla değişirler." |
| Aynı elementin 2. izotopu | "Aynı element, farklı nötron sayısı: bunlara izotop denir. İkiz gibiler ama kiloları farklı!" |

**Özel izotop mesajları:** H-3 "Trityum: hidrojenin radyoaktif kardeşi." · C-14 "Karbon-14! Bilim insanları fosillerin yaşını bununla ölçer." · K-40 "Potasyum-40: muzların içinde çok az bulunur ve azıcık radyoaktiftir. Merak etme, tamamen zararsız!"

### 7.5 Hedef modu

Element kartından ya da görevden gelindiğinde sahne boş açılır ve sağ panelde hedef kartı görünür: "Hedef: Karbon atomu" + kontrol listesi (☐ 6 proton ☐ nötr ☐ kararlı çekirdek). Nötron sayısı *söylenmez*; Emir çekirdeği sakinleştirerek bulur. `İpucu` düğmesi doğrudan sayıyı söyler. Hedef modundan çıkmak serbesttir.

---

## 8. Molekül Atölyesi

### 8.1 "Eller" modeli

Her atomun başka atomlarla tutuşabileceği belli sayıda **eli** vardır (değerlik). Bağ = iki atomun el ele tutuşması. Bir molekül, **bütün eller dolu** olduğunda tamamlanır.

**Atom paleti ve el sayıları:**

| Atom | El | Atom | El | Atom | El | Atom | El |
|---|---|---|---|---|---|---|---|
| H | 1 | C | 4 | N | 3 | O | 2 |
| F | 1 | Cl | 1 | S | 2 | Si | 4 |
| Na | 1 | K | 1 | Mg | 2 | Ca | 2 |
| Al | 3 | He | 0 | Ne | 0 | Ar | 0 |

Palette her atom kendi aile renginde bir top olarak, sembolü ve boşta kalan elleri (küçük kollar/noktalar) ile çizilir.

### 8.2 Etkileşim

- Paletten tezgâha **sürükle** → atom eklenir (en çok 16 atom).
- Bir atomdan diğerine **sürükle** (ya da sırayla iki atoma tıkla) → aralarında **tekli bağ** kurulur. İki atomun da boş eli olmalıdır.
- Var olan bağa **tıkla** → bağ derecesi artar (tekli → çiftli → üçlü), iki tarafta da boş el varsa. Sınırdayken tıklamak bağı tekliye döndürür. Bağa **sağ tık** → bağı siler.
- Atomlar tezgâhta serbestçe sürüklenir; bağlar esneyerek takip eder (basit yay düzeni yeterli; fizik motoru gerekmez).
- Atomu çöp kutusuna sürükle ya da seçip `Delete` → atom ve bağları silinir. `Temizle` düğmesi tezgâhı boşaltır.
- **Soy gaz** (He, Ne, Ar) bağlanmaya çalışılırsa atom ellerini cebine sokma animasyonu yapar; Mol: "Soy gazların boşta eli yok. Dış katmanları dolu olduğu için kimseyle bağ kurmazlar."
- Boş eli kalmayan atoma bağ denenirse hafif "dolu" animasyonu; Mol: "{ad} atomunun bütün elleri dolu."

### 8.3 Bağ türü gösterimi

- **Ametal–ametal:** çubuk bağ (tekli/çiftli/üçlü çizgi). İlk kurulduğunda: "Bu iki atom elektronlarını *paylaşıyor*."
- **Metal (Na, K, Mg, Ca, Al) – ametal:** kısa bir elektron geçiş animasyonu (elektron metalden ametale atlar), atomların üzerinde küçük `+` / `−` işaretleri. İlk kurulduğunda: "{metal} elektronunu {ametal} atomuna *verdi*. Biri artı, biri eksi oldu ve mıknatıs gibi birbirlerini çekiyorlar!"

### 8.4 Tanıma kuralı (saf fonksiyon; birim testi zorunlu)

Tezgâhtaki her **bağlı grup** ayrı değerlendirilir. Bir grup:
1. Bağlıysa (tek parça) **ve** içindeki tüm atomların tüm elleri doluysa → **tamamlanmış** sayılır.
2. Tamamlanmış grubun **formül anahtarı** (element sembolleri alfabetik sırada + adetler, ör. `C1H4`, `H2O1`) Ek D kataloğunda aranır.
3. Eşleşirse → **keşif!** Molekül parlar, adı ve formülü belirir, kısa bilgi kartı açılır, deftere eklenir. Daha önce keşfedildiyse yalnızca adı gösterilir.
4. Eşleşmezse → Mol: "Bütün eller dolu, güzel bir yapı! Ama defterimde böyle bir madde yok. Başka bir şey dene!" (Varlığı ya da yokluğu hakkında iddiada bulunulmaz.)

Tek başına duran soy gaz atomu "tamamlanmış" sayılmaz; yalnızca 8.2'deki mesajı tetikler.

### 8.5 Yardımcılar

- **Tarif Defteri (yan panel):** Ek D kataloğu, üç zorluk sekmesinde. Keşfedilmemişler gölge + günlük hayat ipucu ile görünür (ör. "??? — Nefes verirken çıkardığın gaz"). `İpucu` düğmesi önce formülü, ikinci basışta atom listesini gösterir.
- Tamamlanmamış yapıda boşta kalan eller hafifçe yanıp söner (nerede eksik olduğunu gösterir).
- Formül sayacı: tezgâhtaki seçili grubun anlık formülü (ör. `C H₃ …`).

---

## 9. Tepkime Kazanı

### 9.1 Sahne

- **Orta:** büyük cam kazan/beher, altında tezgâh.
- **Sol: malzeme rafı**, üç bölüm (sekme): **Elementler**, **Mutfaktan**, **Laboratuvar**. Her madde simge + ad ile (Ek E.1).
- **Sağ: araçlar**: 🔥 **Ateş**, 🔋 **Elektrik**, ⏩ **Zaman** (hızlı ileri sar). En çok biri seçilir; yeniden tıklayınca bırakılır.
- **Alt:** büyük **Karıştır!** düğmesi, `Kazanı boşalt` düğmesi.
- **Sonuç kartı** (tepkimeden sonra alttan kayar).

### 9.2 Akış

1. Emir raftan kazana **1 ya da 2 madde** sürükler (tıklama da ekler). Üçüncü madde eklenmeye çalışılırsa: "Kazan iki maddeyle çalışıyor. Önce boşalt!"
2. İsterse bir **araç** seçer.
3. **Karıştır!** → (maddeler + araç) birleşimi Ek E.2 tablosunda aranır. Madde sırası önemsizdir.
4. **Eşleşme varsa:** ilgili animasyon (2–6 sn) oynar, ardından sonuç kartı gelir.
5. **Eşleşme yoksa:** kısa nötr animasyon (hafif çalkalanma) + "Hiçbir şey olmadı. Bu da bir sonuç! Başka bir şey dene." Bu genel durum deftere yazılmaz.
6. Kazan otomatik boşalmaz; Emir sonucu izleyip `Kazanı boşalt` der ya da yeni maddeye tıklayınca boşalır.

### 9.3 Sonuç kartı

- Başlık (ör. "Mutfak Volkanı").
- Ne oldu? — 1–2 cümle.
- Tür rozeti: **Kimyasal tepkime** (yeni madde oluştu) / **Fiziksel değişim** (madde aynı, hâli ya da görünüşü değişti) / **Tepkime yok**.
- Oluşanlar: ürün adları; varsa basit sözel denklem (ör. "Sodyum + Su → Sodyum hidroksit + Hidrojen"). Sembollü denklem "Daha fazla" altında.
- **Güvenlik etiketi:**
  - ⚠️ **Sadece sanal laboratuvarda!** — "Gerçekte çok tehlikeli; bunu bilim insanları özel korumayla yapar."
  - 🏠 **Bir büyüğünle deneyebilirsin** — gereken basit malzemeler listelenir.
  - (etiket yok) — nötr.
- İlk keşifte "Deftere eklendi" + KP.

### 9.4 Animasyon yapı taşları

Her tepkime, parametreli sınırlı bir efekt kümesinden biriyle tanımlanır (her tepkimeye özel animasyon yazılmaz):

`kabarcik(hız)` · `kopuk-tasma(renk)` · `alev(renk, boy)` · `patlama(boy)` · `renk-degisimi(renk1, renk2)` · `parlak-isik(renk)` · `sis` · `fiskiye` · `kivilcim` · `zaman-kaplama(renk)` (hızlandırılmış paslanma/kaplanma) · `cozunme` · `katman` (karışmayan sıvılar) · `suda-kayan-metal(şiddet, alevRengi)` · `buhar` · `hicbir-sey`.

Kurallar: patlama ve parlak ışık efektleri saniyede 3'ten fazla yanıp sönme içermez; "Hareketi azalt" ayarında sarsıntı ve parlama kapatılır, efekt sadeleşir. Kanvas (2D) tabanlı parçacık sistemi önerilir.

---

## 10. Sıcaklık Odası

### 10.1 Sahne

- **Üst/orta:** periyodik tablonun küçük hâli; hücreler o anki sıcaklıktaki **hâle göre** boyanır: katı (gri-mavi), sıvı (turkuaz), gaz (sarı-turuncu), bilinmiyor (çizgili gri). Hâl ayrıca hücre köşesinde küçük simgeyle belirtilir.
- **Alt:** büyük **sıcaklık kaydırıcısı**, −273 °C … 6000 °C. Ölçek doğrusal değildir (düşük sıcaklıklara daha fazla yer; parçalı ya da logaritmik eşleme). Anlık değer büyük rakamla gösterilir. Ok tuşları ±1 °C, `Shift`+ok ±50 °C.
- **Hazır sıcaklık düğmeleri:** Uzay boşluğu (−270) · Sıvı azot (−196) · Dondurucu (−18) · Oda (25) · Vücudun (37) · Kaynar su (100) · Fırın (250) · Lav (1200) · Demir ocağı (1600) · Ampul teli (2500) · Güneş'in yüzeyi (5500).
- **Sayaç:** "Katı: … · Sıvı: 2 · Gaz: 11 · Bilinmiyor: …" biçiminde; bütün değerler veriden hesaplanır.
- **Sağ: tanecik kutusu.** Tabloda bir elemente tıklanınca o element "sabitlenir"; kutuda tanecikleri canlandırılır:
  - Katı: düzenli dizilmiş, yerinde titreşen tanecikler.
  - Sıvı: birbirine yakın ama kayarak yer değiştiren tanecikler.
  - Gaz: kutunun her yanında hızla uçuşan, duvarlardan seken tanecikler.
  - Titreşim/hareket hızı sıcaklıkla artar. Kutunun altında elementin erime ve kaynama noktaları küçük bir çizgi üzerinde işaretlidir; kaydırıcı bu noktaları geçince geçiş animasyonu ("Eridi!", "Kaynadı!", "Dondu!", "Yoğuştu!") ve ses.

### 10.2 Kurallar (saf fonksiyon; birim testi zorunlu)

Veride her element için `meltC`, `boilC` (°C, bilinmiyorsa `null`) ve `sublimes` (boolean) bulunur. Basınç 1 atm kabul edilir.

```
phaseAt(el, T):
  meltC ve boilC ikisi de null      → 'bilinmiyor'
  sublimes                          → T < boilC ? 'kati' : 'gaz'      (ör. C, As)
  meltC null, boilC var (yalnız He) → T < boilC ? 'sivi' : 'gaz'
  T < meltC                         → 'kati'
  boilC null                        → 'bilinmiyor'
  T < boilC                         → 'sivi'
  aksi hâlde                        → 'gaz'
```

Özel mesajlar: Helyum −273 °C'de bile sıvı kalır → "Helyum normal basınçta asla donmaz. Evrenin en inatçı elementi!" · Karbon/arsenik → "Bu element erimeden doğrudan gaza dönüşür. Buna süblimleşme denir."

**Veri doğrulama testleri (zorunlu):** 25 °C'de sıvı olanlar tam olarak **Br ve Hg**; gaz olanlar tam olarak **H, He, N, O, F, Ne, Cl, Ar, Kr, Xe, Rn**. 37 °C'de Ga ve Cs sıvıdır. 3400 °C'de katı kalanlar yalnızca **W ve C**'dir. 6000 °C'de hiçbir element katı ya da sıvı değildir.

**Hâl değişimi olayı:** Bir element sabitlenmişken kaydırıcı onun erime ya da kaynama noktasını geçerse `temp:phaseChange` olayı yayınlanır (3. yıldız ve görevler için).

---

## 11. İlerleme: Defter, yıldızlar, rozetler, görevler

### 11.1 Element yıldızları

- **1–36:** üç yıldız.
  1. **İncelendi** — kartı açıldı.
  2. **Atomu kuruldu** — Atom Kurucu'da nötr ve kararlı atomu kuruldu (7.3).
  3. **Kullanıldı** — şunlardan biri: elementi içeren bir katalog molekülü keşfedildi · elementle ilişkili bir tepkime keşfedildi (maddelerin `elements` alanı üzerinden) · Sıcaklık Odası'nda hâl değişimi izlendi.
- **37–118:** tek yıldız (İncelendi).

### 11.2 Keşif Defteri

Sekmeler:
- **Elementler:** 118'lik ızgara; yıldızlarla. Üstte "İlk 36: 41/108 yıldız · Tüm kartlar: 52/118".
- **Moleküller:** Ek D kataloğu; keşfedilmemişler gölge + ipucu. Karta tıklayınca molekül çizimi, formül, günlük hayat bilgisi, "Atölyede aç" düğmesi.
- **Tepkimeler:** Ek E.2 kataloğu; keşfedilmemişler "???" + ipucu (ör. "Mutfaktan iki malzeme…"). Karta tıklayınca sonuç kartı ve `Tekrar izle` düğmesi (Tepkime Kazanı'nı aynı girdilerle açar).
- **Rozetler:** Ek G; kazanılmamışlar gri siluet + nasıl kazanılacağı.
- **Diplomam:** unvan, ad, istatistikler; `Yazdır` düğmesi (bkz. 11.5).

### 11.3 Merak Görevleri

- Görev Panosu üst çubuktan açılır; aynı anda **3 etkin görev kartı** gösterir.
- Her kart: başlık, tek cümlelik merak sorusu, ödül KP'si, `İpucu` ve `Beni oraya götür` düğmeleri, `Başka görev ver` (kartı havuzdaki başka bir görevle değiştirir; ceza yok).
- Görevler etkin olmasa da koşulları sağlandığında **tamamlanmış** sayılır (Emir kendi kendine keşfettiyse ödülünü alır).
- Görev seçimi: üç zorluk kademesi (`başlangıç`, `orta`, `ileri`). Yeni kart çekilirken önce tamamlanmamış en düşük kademeden ve mümkünse farklı atölyelerden seçilir. Böylece ilk görevler doğal bir giriş yolu oluşturur.
- Görev listesi: Ek F.

### 11.4 Rozetler

Koşulu sağlanınca ekran ortasında kısa kutlama (konfeti, ses, rozet büyür), sonra deftere uçar. Liste: Ek G.

### 11.5 Keşif Puanı (KP) ve unvanlar

| Kazanım | KP |
|---|---|
| Element yıldızı (her biri) | 1 |
| Yeni molekül | 5 |
| Yeni tepkime | 3 |
| Görev | 5 (ileri kademe 8) |
| Rozet | 10 |

| Unvan | Gerekli KP |
|---|---|
| Çırak | 0 |
| Kalfa | 60 |
| Usta | 180 |
| Profesör | 380 |
| Baş Kimyager | 650 |

Eşikler tek bir yapılandırma dosyasında tutulur (ayarlanabilir). KP hiçbir zaman azalmaz. Unvan atlamada kısa tören animasyonu.

**Diploma:** "Baş Kimyager" unvanına ulaşınca tam sayfa, yazdırılabilir diploma (`window.print`, A4 yatay için baskı stili): ad, tarih, "Emirberg Kimya Lab Baş Kimyageri", özet istatistikler. Daha düşük unvanlarda da o unvanın sertifikası yazdırılabilir.

---

## 12. Maskot ve metin dili

### 12.1 Mol

- **Mol**, meraklı küçük bir laboratuvar robotudur (adı kimyadaki "mol" biriminden gelir; bu ayrıntı ileri bir görevde açıklanabilir). Özgün, basit bir SVG karakter: yuvarlak gövde, deney gözlüğü, anten yerine küçük bir deney tüpü.
- Üst çubukta durur; konuşma balonu bağlamsal ipuçları verir. Balon 6 sn sonra kendiliğinden kapanır, tıklanınca hemen kapanır. Aynı ipucu art arda tekrarlanmaz.
- İfadeler: nötr, şaşkın, sevinçli, düşünceli (4 yüz yeterli).
- Ayarlarda "Mol daha az konuşsun" seçeneği (yalnızca ilk kez öğretici mesajlar).

### 12.2 Üslup kuralları (tüm oyun metinleri için)

- "Sen" diye hitap; sıcak, meraklı, hafif esprili. Bebekçe değil.
- En çok 2 cümle, ~140 karakter. Ünlem az ve yerinde.
- Olumsuz yargı yok: "Yanlış", "Hata", "Başaramadın" kullanılmaz. Yerine: "Hmm, bak ne oldu…", "Bir şey daha dene."
- Terim ilk geçtiğinde benzetmeyle: 
  - atom → "LEGO parçası gibi minicik yapı taşı"
  - proton sayısı → "kimlik numarası"
  - elektron katmanı → "sinema salonundaki koltuk sıraları; önce ön sıra dolar"
  - bağ → "el ele tutuşmak"
  - soy gaz → "elleri cebinde"
  - iyon → "yüklü atom"
  - radyoaktif → "çekirdeği yerinde duramayan atom"
- Türkçe yazım: Türk Dil Kurumu yazımına uyulur; birimlerde ondalık ayırıcı virgül ("29,8 °C"), binlik ayırıcı nokta.
- Tüm metinler tek bir dil dosyasında/dizininde tutulur (bkz. 14.2); bileşen içine gömülü metin olmaz.

---

## 13. Görsel ve ses tasarımı

### 13.1 Görsel yön

- Tema: **gece laboratuvarı** — koyu lacivert zemin üzerinde canlı, hafif parlayan renkli öğeler. Yuvarlak köşeler, kalın çizgiler, bol boşluk. "Çizgi film bilim laboratuvarı" hissi; gerçekçi/fotoğrafik değil.
- Yazı tipi: yuvarlak hatlı, Türkçe karakterleri (ç, ğ, ı, İ, ö, ş, ü) tam destekleyen açık lisanslı bir aile (ör. **Baloo 2** başlıklar, **Nunito** gövde). Yazı tipleri projeye gömülür (ör. `@fontsource`); çalışma anında dış ağ isteği yapılmaz.
- En küçük gövde yazısı 16 px; tablo hücresindeki element adı en az 11 px (hücre içi istisna).
- Aile renkleri (koyu zeminde, koyu metinle okunaklı başlangıç önerisi; kontrast testinden geçirilip ayarlanabilir):

| Aile | Renk | Aile | Renk |
|---|---|---|---|
| alkali | `#FF6B6B` | ametal | `#4DABF7` |
| toprak-alkali | `#FFA94D` | halojen | `#748FFC` |
| gecis | `#FFD43B` | soy-gaz | `#DA77F2` |
| gecis-sonrasi | `#A9E34B` | lantanit | `#F783AC` |
| yari-metal | `#63E6BE` | aktinit | `#C9A27E` |
| bilinmeyen | `#ADB5BD` | | |

- Görseller: SVG + CSS + kanvas ile üretilir; günlük hayat simgeleri için emoji ya da açık lisanslı simge seti kullanılabilir. Telifli görsel, marka logosu, gerçek ürün adı kullanılmaz.
- Animasyon: arayüz geçişleri 150–300 ms; kutlamalar en çok 2 sn ve tıklamayla geçilebilir.

### 13.2 Ses

- Kısa ses efektleri: parçacık ekleme (üç parçacığa üç ayrı ton), bağ kurma, keşif, rozet, tepkime sesleri (fışırtı, pop, patlama, köpürme), hâl değişimi, düğme tıklaması.
- Sesler Web Audio API ile sentezlenir ya da CC0 lisanslı paketlerden alınır; kullanılan her dış varlık `CREDITS.md` dosyasına lisansıyla yazılır.
- Arka plan müziği **yok** (v1). Sesli anlatım **yok** (v1).
- Üst çubukta tek tıkla sessize alma; ayarlarda ses düzeyi. Varsayılan: açık, orta düzey. Tarayıcı kuralı gereği ses ilk kullanıcı etkileşiminden sonra başlar.

---

## 14. Teknik mimari

### 14.1 Yığın

| Katman | Seçim | Not |
|---|---|---|
| Derleme | Vite | `base: './'` (herhangi bir alt dizinden/statik sunucudan çalışsın) |
| Arayüz | React 18+ ve TypeScript (`strict: true`) | İşlev bileşenleri + hook'lar |
| Durum | Zustand (+ `persist`) | Tek kalıcı "ilerleme" deposu; atölyelerin geçici durumu ayrı dilimlerde |
| Yönlendirme | React Router (`HashRouter`) | Statik barındırmada sorunsuz derin bağlantı |
| Stil | Tailwind CSS + CSS değişkenleri (tema belirteçleri) | Eşdeğer bir çözüm kabul edilir; tutarlı olunmalı |
| Animasyon | Motion (Framer Motion) arayüz için; SVG atom/molekül; Canvas 2D parçacık efektleri | |
| Sürükle-bırak | Pointer Events tabanlı özel hook ya da `dnd-kit` | Yalnız fare hedeflenir |
| Test | Vitest (+ React Testing Library); isteğe bağlı Playwright duman testi | |
| Kalite | ESLint + Prettier | |

Sunucu, hesap, veritabanı, analitik, reklam, dış API **yoktur**. Uygulama derlendikten sonra ağ bağlantısı olmadan çalışır.

### 14.2 Dizin yapısı (öneri)

```
src/
  app/                 # App, yönlendirme, kabuk düzeni (yan menü, üst çubuk)
  features/
    onboarding/
    periodic-table/
    atom-builder/
    molecule-workshop/
    reaction-cauldron/
    temperature-room/
    notebook/          # defter, rozetler, diploma
    quests/
    mascot/
  domain/              # SAF mantık (React'siz): atom.ts, shells.ts, phase.ts,
                       # molecule.ts, reactions.ts, conditions.ts, progress.ts
  data/                # elements.ts, elementContent.ts, molecules.ts,
                       # substances.ts, reactions.ts, quests.ts, badges.ts, config.ts
  state/               # store.ts, persistence.ts, events.ts
  ui/                  # ortak bileşenler (Button, Card, Panel, Tooltip…)
  audio/
  i18n/tr.ts           # tüm arayüz metinleri
```

Temel kural: **oyun kuralları `domain/` altında saf fonksiyonlardır** ve arayüzden bağımsız test edilir. **İçerik `data/` altında bildirimsel veridir**; yeni molekül, tepkime, görev ya da rozet eklemek için bileşen koduna dokunmak gerekmemelidir.

### 14.3 Veri modelleri

```ts
type FamilyId = 'alkali' | 'toprak-alkali' | 'gecis' | 'gecis-sonrasi' | 'yari-metal'
              | 'ametal' | 'halojen' | 'soy-gaz' | 'lantanit' | 'aktinit' | 'bilinmeyen';
type Phase = 'kati' | 'sivi' | 'gaz' | 'bilinmiyor';

interface ElementData {
  z: number;                 // 1–118
  symbol: string;
  nameTr: string;            // Ek A
  nameEn: string;            // Ek A
  family: FamilyId;          // Bölüm 6.4
  group: number | null;      // 1–18; lantanit/aktinit için null
  period: number;            // 1–7
  tableX: number;            // ızgara sütunu (1–18)
  tableY: number;            // ızgara satırı (1–7, lantanit 9, aktinit 10)
  atomicMass: number;
  meltC: number | null;
  boilC: number | null;
  sublimes: boolean;
  radioactive: boolean;
  synthetic: boolean;
  nameOrigin?: { kind: 'yer' | 'kisi' | 'gok-cismi'; textTr: string };  // Ek H
}

interface DeepContent {      // yalnız 1–36 (Ek B)
  z: number;
  shells: number[];
  stableMassNumbers: number[];
  whereTr: string;           // "Nerede bulurum?"
  factTr: string;            // "İlginç bilgi"
  cautionTr?: string;        // "Dikkat!"
  icon: string;              // emoji ya da simge anahtarı
}

interface FamousContent { z: number; factTr: string; icon: string; }   // Ek C

interface MoleculeRecipe {   // Ek D
  id: string;
  formulaKey: string;        // "C1H4"
  formulaDisplay: string;    // "CH₄"
  nameTr: string;
  atoms: Record<string, number>;
  level: 'kolay' | 'orta' | 'zor';
  bondNote: 'paylasim' | 'alisveris' | 'karisik';
  hintTr: string;            // keşiften önce görünen ipucu
  everydayTr: string;        // keşiften sonra görünen bilgi
  cautionTr?: string;
}

interface Substance {        // Ek E.1
  id: string;
  nameTr: string;
  shelf: 'element' | 'mutfak' | 'laboratuvar';
  elements: number[];        // ilişkili atom numaraları (3. yıldız için)
  icon: string;
  look: { color: string; form: 'kati' | 'sivi' | 'gaz' | 'toz' };
}

type Tool = 'ates' | 'elektrik' | 'zaman';

interface ReactionEntry {    // Ek E.2
  id: string;
  inputs: string[];          // 1–2 Substance id (sırasız)
  tool?: Tool;
  kind: 'kimyasal' | 'fiziksel' | 'tepkime-yok';
  titleTr: string;
  explainTr: string;
  wordEquationTr?: string;
  symbolEquation?: string;
  productMoleculeIds?: string[];
  safety: 'sanal' | 'evde' | 'notr';
  homeMaterialsTr?: string;
  effects: { type: string; params?: Record<string, unknown> }[]; // Bölüm 9.4; sırayla ya da birlikte oynar (çoğunda tek öğe)
  hintTr: string;
  tags?: string[];           // 'alev-testi', 'indikator', 'alkali-su' …
}
```

Tepkime arama anahtarı: `[...inputs].sort().join('+') + '|' + (tool ?? '-')`. Derleme/test aşamasında anahtarların benzersiz olduğu doğrulanır.

### 14.4 Olaylar, koşullar, görevler, rozetler

Atölyeler ilerlemeyi doğrudan değiştirmez; **alan olayları** yayınlar. Tek bir ilerleme hizmeti olayları dinler, depoyu günceller, görev ve rozet koşullarını yeniden değerlendirir.

Olaylar (en az): `element:viewed {z}` · `atom:changed {p, n, e}` · `atom:built {z, a}` · `atom:ion {z, charge}` · `atom:unstable {z, a}` · `bond:created {order, kind}` · `molecule:nobleGasAttempt` · `molecule:found {id}` · `reaction:found {id}` · `temp:set {celsius}` · `temp:phaseChange {z, from, to}` · `lens:used {id}` · `tutorial:done`.

Görev ve rozet koşulları **bildirimsel** tanımlanır ve kalıcı ilerleme üzerinden değerlendirilir:

```ts
type Condition =
  | { type: 'elementViewed'; z: number }
  | { type: 'elementsViewedCount'; min: number; filter?: { family?: FamilyId; zMax?: number; famous?: boolean; originKind?: string } }
  | { type: 'atomBuilt'; z: number; massNumber?: number }
  | { type: 'atomsBuiltCount'; min: number; zMax?: number }
  | { type: 'isotopeBuilt'; z: number; massNumber: number }       // kararsız olanlar dâhil
  | { type: 'distinctIsotopesOfSameElement'; min: number }
  | { type: 'unstableBuiltCount'; min: number }
  | { type: 'ionBuilt'; z?: number; charge?: number }
  | { type: 'ionsBuiltCount'; min: number }
  | { type: 'nobleShellBuilt' }
  | { type: 'moleculeFound'; id: string }
  | { type: 'moleculesFoundCount'; min: number }
  | { type: 'bondOrdersUsed'; orders: number[] }
  | { type: 'nobleGasAttempt' }
  | { type: 'reactionFound'; id: string }
  | { type: 'reactionsFoundCount'; min: number; filter?: { kind?: string; safety?: string; tag?: string } }
  | { type: 'phaseChangeSeen'; z: number; to?: Phase }
  | { type: 'phaseChangesCount'; min: number }
  | { type: 'tempReached'; atMost?: number; atLeast?: number }
  | { type: 'elementStarsCount'; min: number; zMax: number }
  | { type: 'questsDoneCount'; min: number }
  | { type: 'rankReached'; rank: string }
  | { type: 'tutorialDone' }
  | { type: 'all'; of: Condition[] }
  | { type: 'any'; of: Condition[] };
```

Bu liste başlangıç noktasıdır; Ek F ve Ek G'deki her maddeyi ifade edebildiği sürece genişletilebilir. Koşul değerlendirici saf fonksiyondur ve her koşul türü için birim testi vardır.

### 14.5 Kalıcılık

- `localStorage`, tek anahtar: `emirberg-kimya-lab:save`. Biçim sürümlüdür (`version: 1`) ve ileriye dönük göç (migration) işlevi içerir.
- Kaydedilenler: profil (ad, oluşturma tarihi), element durumları, kurulan izotop ve iyonlar, keşfedilen moleküller ve tepkimeler (ilk keşif tarihiyle), izlenen hâl değişimleri, erişilen en düşük/en yüksek sıcaklık, kullanılan bağ dereceleri, görev durumu ve etkin 3 görev, rozetler, KP, ayarlar, tamamlanan tanıtım ve turlar.
- Kayıt her ilerleme değişikliğinde (kısa gecikmeyle birleştirilerek) yapılır. Bozuk/okunamayan kayıtta uygulama çökmez; kaydı yedek anahtara taşıyıp temiz başlar ve bunu ayarlarda bildirir.
- **Büyükler Köşesi** (ayarlar içinde; düğmeye 3 sn basılı tutarak açılır): ilerlemeyi JSON olarak dışa aktar / içe aktar, ilerlemeyi sıfırla (çift onaylı), oyuncu adını değiştir.

### 14.6 Element verisinin kaynağı

- 118 elementin sayısal verisi (kütle, erime/kaynama, grup/periyot) açık bir veri kümesinden alınır (ör. PubChem Periodic Table verisi ya da eşdeğeri); kullanılan kaynağın **lisansı kontrol edilir** ve `CREDITS.md` dosyasına yazılır. Veri derleme zamanında projeye gömülür.
- Adlar (Ek A), aileler (6.4), katman dizilimleri ve kararlı izotoplar (Ek B) **bu belgeden** alınır; veri kümesiyle çelişirse bu belge geçerlidir, çelişki `NOTLAR.md` dosyasında raporlanır.
- Kelvin değerleri °C'ye çevrilirken yuvarlama: 1 ondalık.
- **Tahmini değerler kullanılmaz:** atom numarası 100 ve üzeri elementlerde `meltC` ve `boilC` her zaman `null` yazılır (veri kümesinde kuramsal tahmin bulunsa bile). Aksi hâlde örneğin Kopernikyum 25 °C'de "sıvı" görünür ve 10.2'deki doğrulama testleri bozulur.

### 14.7 Performans ve tarayıcı

- Hedef tarayıcılar: Windows üzerinde güncel Chrome ve Edge; Firefox'ta da çalışmalı.
- Orta sınıf dizüstünde 60 fps hedefi; tepkime efektlerinde en az 30 fps.
- İlk yükleme paketi (sıkıştırılmış) ~1,5 MB'ı aşmamalı; atölyeler tembel yüklenebilir.
- Sekme arka plandayken animasyon döngüleri durur.

### 14.8 Çalıştırma ve teslim

- `npm install`, `npm run dev`, `npm run build`, `npm run preview`, `npm test` komutları çalışır.
- `README.md`: kurulum, komutlar, içerik ekleme rehberi (yeni molekül/tepkime/görev nasıl eklenir).
- Windows için kök dizinde **`Baslat.bat`**: gerekirse derler, yerel önizleme sunucusunu başlatır ve varsayılan tarayıcıda açar (Emir çift tıklayarak oynayabilsin).
- Çıktı (`dist/`) herhangi bir statik barındırmaya (ör. GitHub Pages, Netlify) olduğu gibi yüklenebilir.

---

## 15. Erişilebilirlik, güvenlik, gizlilik

- **Renk tek ayırt edici değildir:** aileler simge/desenle, hâller simgeyle de ayrılır.
- Tüm işlevler klavyeyle de kullanılabilir (sürükle-bırak eylemlerinin tıklama/klavye karşılığı vardır); görünür odak halkası.
- `prefers-reduced-motion` izlenir; ayrıca ayarlarda **Hareketi azalt**.
- `<html lang="tr">`; büyük/küçük harf dönüşümlerinde `toLocaleUpperCase('tr-TR')` / `toLocaleLowerCase('tr-TR')`.
- Metin/zemin kontrastı en az 4,5:1.
- **Gizlilik:** kişisel veri toplanmaz; ad yalnızca yerel kayıtta durur. Dış bağlantı, reklam, satın alma, sohbet, izleme yoktur.
- **Güvenlik mesajı:** tehlikeli deneylerin gerçek hayatta denenmesini özendiren ifade kullanılmaz; ölçü/miktar/tarif verilmez. Evde yapılabilir deneyler yalnızca mutfak malzemeleriyle ve "bir büyüğünle" notuyla sunulur.

---

## 16. Test ve kabul ölçütleri

### 16.1 Zorunlu birim testleri (`domain/`)

- `identifyElement(p)`; `charge(p, e)`; `isStable(z, a)`; `neutronHint(z, a)`.
- `shellsFor(z, e)` — en az şu örnekler: H(1,1)→[1]; He→[2]; Na→[2,8,1]; Na⁺(11,10)→[2,8]; Cl⁻(17,18)→[2,8,8]; O²⁻(8,10)→[2,8]; Ca→[2,8,8,2]; Cr→[2,8,13,1]; Fe→[2,8,14,2]; Fe²⁺(26,24)→[2,8,14]; Cu→[2,8,18,1]; Kr→[2,8,18,8].
- `phaseAt(el, T)` — 10.2'deki veri doğrulama örneklerinin tümü.
- Molekül tanıma: Ek D'deki her tarif için doğru kurulmuş bir yapı eşleşir; eli boşta kalan yapı eşleşmez; bağlı olmayan iki grup ayrı değerlendirilir; H₂O ile H₂O₂ karışmaz.
- Tepkime arama: sıra bağımsızlığı; araç farkı (ör. `demir-civi + su` araçsız → genel "bir şey olmadı", `zaman` ile → paslanma); bilinmeyen birleşim → genel sonuç.
- Koşul değerlendirici: her koşul türü.
- KP ve unvan hesabı.

### 16.2 Veri bütünlüğü testleri

- 118 element; `z` 1–118 kesintisiz; sembol ve ad benzersiz; `tableX/tableY` çakışmasız.
- Ek A adlarının tamamı veriyle birebir aynı.
- Her derin içerikte: `sum(shells) === z`; `stableMassNumbers` boş değil ve hepsi `≥ z`.
- Her molekül tarifinde: atomların el sayıları toplamı çift; `formulaKey` benzersiz; kullanılan atomlar palettedir.
- Her tepkimede: girdiler madde listesinde var; arama anahtarı benzersiz; `productMoleculeIds` katalogda var.
- Her görev ve rozet koşulu geçerli kimliklere başvurur; her görev **ulaşılabilir** (koşulu sağlayan bir içerik var).
- Tüm oyun metinleri 12.2'deki uzunluk sınırına uyar (otomatik kontrol: balon metinleri ≤ 160 karakter).

### 16.3 Uçtan uca kabul senaryoları

1. **İlk açılış:** Temiz kayıtla tanıtım oynar; ad girilir; Hidrojen kurulur; "Çırak Kimyager" rozeti gelir; tablo açılır; sayfa yenilenince tanıtım tekrarlanmaz, ilerleme durur.
2. **Kart → atom:** Karbon kartı açılır (1. yıldız) → "Atomunu kur" → 6p, 6n, 6e → kutlama, 2. yıldız. 6p, 8n, 6e yapılınca çekirdek titrer ve C-14 mesajı çıkar.
3. **Molekül:** 2 H + 1 O bağlanır → "Su" keşfi; deftere eklenir; H ve O 3. yıldızı alır. He bağlanmaya çalışılınca soy gaz mesajı çıkar.
4. **Tepkime:** sirke + karbonat → köpük taşması, "kimyasal", 🏠 etiketi. sodyum + su → ⚠️ etiketi. bakır + tuz ruhu → "tepkime yok" kartı (deftere yazılır). su + helyum → genel "hiçbir şey olmadı" (deftere yazılmaz).
5. **Sıcaklık:** 25 °C'de sayaç 2 sıvı, 11 gaz gösterir. Galyum sabitlenip 37 °C'ye çıkılınca "Eridi!" ve tanecik kutusu sıvıya geçer.
6. **Görev:** Etkin olmayan bir görevin koşulu sağlanınca da tamamlanır. "Başka görev ver" kartı değiştirir.
7. **Kalıcılık:** Dışa aktar → sıfırla → içe aktar; tüm ilerleme geri gelir.
8. **Çevrimdışı:** Derlenmiş sürüm ağ bağlantısı kapalıyken eksiksiz çalışır; ağ sekmesinde dış istek yoktur.
9. **Klavye:** Fare kullanmadan tabloda gezilir, kart açılır, Atom Kurucu'da P/N/E ile atom kurulur.

---

## 17. Yapım aşamaları

Her aşama kendi başına çalışır durumda teslim edilir; testler geçer.

| Aşama | İçerik | Bitti sayılır |
|---|---|---|
| **M0 — İskelet** | Proje kurulumu, kabuk düzeni, yönlendirme, tema belirteçleri, yazı tipleri, depo + kalıcılık, olay yolu, veri dosyaları (118 element + Ek A/B) ve veri bütünlüğü testleri | Boş atölyeler arasında gezilir; veri testleri yeşil |
| **M1 — Periyodik Tablo** | Tablo, kartlar (derin/kısa/ünlü), arama, gözlükler, klavye, 1. yıldız, Günün Elementi | Senaryo 9'un tablo kısmı; 118 kart açılır |
| **M2 — Atom Kurucu** | Sahne, kurallar, hedef modu, öğretici anlar, 2. yıldız | Senaryo 2 |
| **M3 — Defter + ilerleme** | Keşif Defteri, KP/unvan, görev panosu ve koşul motoru, rozetler, tanıtım, Mol | Senaryo 1, 6 |
| **M4 — Molekül Atölyesi** | Tezgâh, eller modeli, tanıma, Tarif Defteri | Senaryo 3 |
| **M5 — Sıcaklık Odası** | Kaydırıcı, hâl boyama, tanecik kutusu, hâl değişimi olayları | Senaryo 5 |
| **M6 — Tepkime Kazanı** | Raf, araçlar, efekt motoru, Ek E'nin tamamı | Senaryo 4 |
| **M7 — Cila** | Ses, diploma, Büyükler Köşesi, ipucu turları, hareketi azalt, performans, `Baslat.bat`, README, CREDITS | Senaryo 7, 8; tüm kabul ölçütleri |

---

## 18. Bilimsel sadeleştirmeler (bilinçli; dışına çıkılmaz)

1. **Atom modeli:** Bohr'un katman modeli kullanılır (orbitaller yok). Kartlarda bir kez: "Gerçek atomlar daha karmaşıktır; bilim insanları bu basit modeli anlamayı kolaylaştırmak için kullanır."
2. **Katman dizilimi:** 7.3'teki kurala göre; geçiş metali iyonlarında yaklaşık doğrudur.
3. **Kararlılık:** ikili (kararlı/kararsız). Yarı ömür, bozunma türü anlatılmaz. Çok uzun ömürlü birkaç izotop (ör. Ca-48) kararlı sayılır.
4. **Eller modeli:** her atomun tek, sabit değerliği vardır. Bu yüzden CO, O₃, SO₂ gibi moleküller katalogda yoktur.
5. **İyonik bileşikler** (NaCl, CaCO₃, Al₂O₃…) ve ağ yapılı katılar (SiO₂) tek bir "formül birimi" olarak kurulur. Kartlarında: "Gerçekte bu atomlar milyarlarcası bir arada, düzenli bir kristal oluşturur."
6. **Molekül tanıma formüle göredir;** aynı formüllü farklı yapılar (izomerler) ayırt edilmez.
7. **Tepkimeler** seçilmiş bir katalogdur; katalogda olmayan birleşimler için "tepkime olmaz" *denmez*, yalnızca "hiçbir şey olmadı / defterimde yok" denir. Miktar, derişim, denkleştirme oyuncudan istenmez.
8. **Ateş aracı** havadaki oksijeni örtük olarak içerir.
9. **Sıcaklık Odası** 1 atm basınç varsayar; erime/kaynama noktası bilinmeyen elementler "bilinmiyor" görünür.
10. **Aile sınıflaması** 6.4'teki tabloya göredir (109–118 "bilinmeyen").

---

## 19. Kapsam dışı ve varsayımlar

**Kapsam dışı (v1):** mobil/dokunmatik düzen · çoklu oyuncu profili · hesap/bulut kaydı · İngilizce arayüz · sesli anlatım ve müzik · 3B molekül görünümü · mol kavramı ve hesaplamalar, denklem denkleştirme · 37+ protonlu atom kurma · zamanlı yarışma/quiz modları · mağaza, ödül parası, avatar.

**Varsayımlar (kullanıcıya sorulmadan alınan, kolay değiştirilebilir kararlar):**
- Maskotun adı **Mol**; karakter özgün ve basit bir robot.
- Ses efektleri var, müzik ve seslendirme yok.
- Tek oyuncu profili; ad varsayılanı "Emir".
- Görsel tema koyu ("gece laboratuvarı").
- KP eşikleri ve görev ödülleri deneme sonrası ayarlanabilir.

---

# EKLER

## Ek A — 118 elementin adları

Biçim: `Z Sembol — Türkçe (İngilizce)`

1 H — Hidrojen (Hydrogen) · 2 He — Helyum (Helium) · 3 Li — Lityum (Lithium) · 4 Be — Berilyum (Beryllium) · 5 B — Bor (Boron) · 6 C — Karbon (Carbon) · 7 N — Azot (Nitrogen) · 8 O — Oksijen (Oxygen) · 9 F — Flor (Fluorine) · 10 Ne — Neon (Neon)

11 Na — Sodyum (Sodium) · 12 Mg — Magnezyum (Magnesium) · 13 Al — Alüminyum (Aluminium) · 14 Si — Silisyum (Silicon) · 15 P — Fosfor (Phosphorus) · 16 S — Kükürt (Sulfur) · 17 Cl — Klor (Chlorine) · 18 Ar — Argon (Argon) · 19 K — Potasyum (Potassium) · 20 Ca — Kalsiyum (Calcium)

21 Sc — Skandiyum (Scandium) · 22 Ti — Titanyum (Titanium) · 23 V — Vanadyum (Vanadium) · 24 Cr — Krom (Chromium) · 25 Mn — Mangan (Manganese) · 26 Fe — Demir (Iron) · 27 Co — Kobalt (Cobalt) · 28 Ni — Nikel (Nickel) · 29 Cu — Bakır (Copper) · 30 Zn — Çinko (Zinc)

31 Ga — Galyum (Gallium) · 32 Ge — Germanyum (Germanium) · 33 As — Arsenik (Arsenic) · 34 Se — Selenyum (Selenium) · 35 Br — Brom (Bromine) · 36 Kr — Kripton (Krypton) · 37 Rb — Rubidyum (Rubidium) · 38 Sr — Stronsiyum (Strontium) · 39 Y — İtriyum (Yttrium) · 40 Zr — Zirkonyum (Zirconium)

41 Nb — Niyobyum (Niobium) · 42 Mo — Molibden (Molybdenum) · 43 Tc — Teknesyum (Technetium) · 44 Ru — Rutenyum (Ruthenium) · 45 Rh — Rodyum (Rhodium) · 46 Pd — Paladyum (Palladium) · 47 Ag — Gümüş (Silver) · 48 Cd — Kadmiyum (Cadmium) · 49 In — İndiyum (Indium) · 50 Sn — Kalay (Tin)

51 Sb — Antimon (Antimony) · 52 Te — Tellür (Tellurium) · 53 I — İyot (Iodine) · 54 Xe — Ksenon (Xenon) · 55 Cs — Sezyum (Caesium) · 56 Ba — Baryum (Barium) · 57 La — Lantan (Lanthanum) · 58 Ce — Seryum (Cerium) · 59 Pr — Praseodim (Praseodymium) · 60 Nd — Neodim (Neodymium)

61 Pm — Prometyum (Promethium) · 62 Sm — Samaryum (Samarium) · 63 Eu — Evropiyum (Europium) · 64 Gd — Gadolinyum (Gadolinium) · 65 Tb — Terbiyum (Terbium) · 66 Dy — Disprosyum (Dysprosium) · 67 Ho — Holmiyum (Holmium) · 68 Er — Erbiyum (Erbium) · 69 Tm — Tulyum (Thulium) · 70 Yb — İterbiyum (Ytterbium)

71 Lu — Lutesyum (Lutetium) · 72 Hf — Hafniyum (Hafnium) · 73 Ta — Tantal (Tantalum) · 74 W — Tungsten (Tungsten) · 75 Re — Renyum (Rhenium) · 76 Os — Osmiyum (Osmium) · 77 Ir — İridyum (Iridium) · 78 Pt — Platin (Platinum) · 79 Au — Altın (Gold) · 80 Hg — Cıva (Mercury)

81 Tl — Talyum (Thallium) · 82 Pb — Kurşun (Lead) · 83 Bi — Bizmut (Bismuth) · 84 Po — Polonyum (Polonium) · 85 At — Astatin (Astatine) · 86 Rn — Radon (Radon) · 87 Fr — Fransiyum (Francium) · 88 Ra — Radyum (Radium) · 89 Ac — Aktinyum (Actinium) · 90 Th — Toryum (Thorium)

91 Pa — Protaktinyum (Protactinium) · 92 U — Uranyum (Uranium) · 93 Np — Neptünyum (Neptunium) · 94 Pu — Plütonyum (Plutonium) · 95 Am — Amerikyum (Americium) · 96 Cm — Küriyum (Curium) · 97 Bk — Berkelyum (Berkelium) · 98 Cf — Kaliforniyum (Californium) · 99 Es — Aynştaynyum (Einsteinium) · 100 Fm — Fermiyum (Fermium)

101 Md — Mendelevyum (Mendelevium) · 102 No — Nobelyum (Nobelium) · 103 Lr — Lavrensiyum (Lawrencium) · 104 Rf — Rutherfordiyum (Rutherfordium) · 105 Db — Dubniyum (Dubnium) · 106 Sg — Seaborgiyum (Seaborgium) · 107 Bh — Bohriyum (Bohrium) · 108 Hs — Hassiyum (Hassium) · 109 Mt — Meitneriyum (Meitnerium) · 110 Ds — Darmstadtiyum (Darmstadtium)

111 Rg — Röntgenyum (Roentgenium) · 112 Cn — Kopernikyum (Copernicium) · 113 Nh — Nihonyum (Nihonium) · 114 Fl — Flerovyum (Flerovium) · 115 Mc — Moskovyum (Moscovium) · 116 Lv — Livermoryum (Livermorium) · 117 Ts — Tennesin (Tennessine) · 118 Og — Oganesson (Oganesson)

Not: 74 W için kartta "diğer adı: Volfram" bilgisi verilir (sembolün nereden geldiğini açıklar).

---

## Ek B — İlk 36 element: derin içerik

`Katmanlar` = nötr atomun elektron dizilimi. `Kararlı A` = kararlı sayılan izotopların kütle numaraları.

| Z | Sem. | Katmanlar | Kararlı A | Nerede bulurum? | İlginç bilgi |
|---|---|---|---|---|---|
| 1 | H | 1 | 1, 2 | Suyun içinde (H₂O) ve Güneş'in yakıtında. | Evrendeki her 10 atomdan yaklaşık 9'u hidrojendir. En hafif element odur. |
| 2 | He | 2 | 3, 4 | Uçan balonların içinde. | İlk kez Dünya'da değil, Güneş'in ışığında fark edildi. Adı Yunanca "Güneş" demek. |
| 3 | Li | 2, 1 | 6, 7 | Telefon, tablet ve elektrikli araba pillerinde. | En hafif metaldir; o kadar hafiftir ki suda yüzer. |
| 4 | Be | 2, 2 | 9 | Zümrüt taşının içinde. | Uzaydaki dev James Webb teleskobunun aynaları berilyumdan yapıldı. |
| 5 | B | 2, 3 | 10, 11 | Isıya dayanıklı cam kaplarda ve deterjanlarda. | Dünyadaki bor rezervlerinin çoğu Türkiye'de! |
| 6 | C | 2, 4 | 12, 13 | Kurşun kalem ucunda, kömürde ve bütün canlılarda. | Kalem ucundaki grafit de pırıl pırıl elmas da aynı elementten, karbondan yapılır. |
| 7 | N | 2, 5 | 14, 15 | Soluduğun havanın yaklaşık %78'i azottur. | Cips paketleri hava değil, azot gazıyla şişirilir; böylece cipsler bayatlamaz. |
| 8 | O | 2, 6 | 16, 17, 18 | Her nefeste içine çektiğin havada ve suda. | Vücut ağırlığının yarısından fazlası oksijen atomlarıdır. |
| 9 | F | 2, 7 | 19 | Diş macununda (florür olarak). | Tablonun en hırçın elementi: neredeyse her şeyle tepkimeye girer. |
| 10 | Ne | 2, 8 | 20, 21, 22 | Işıklı tabelalarda. | İçinden elektrik geçince kızıl-turuncu parlar. Adı "yeni" demek. |
| 11 | Na | 2, 8, 1 | 23 | Sofra tuzunda (sodyum + klor). | Bıçakla kesilecek kadar yumuşak bir metaldir ve suya değince fışırdar. |
| 12 | Mg | 2, 8, 2 | 24, 25, 26 | Yeşil yaprakların içinde, fındık ve ıspanakta. | Yanarken göz kamaştırıcı beyaz bir ışık saçar; maytaplar bu yüzden parlar. |
| 13 | Al | 2, 8, 3 | 27 | Alüminyum folyoda, içecek kutularında, uçaklarda. | Bir zamanlar altından bile değerliydi! Oysa yer kabuğunda en bol bulunan metaldir. |
| 14 | Si | 2, 8, 4 | 28, 29, 30 | Kumda, camda ve bilgisayar çiplerinde. | Bilgisayarların beyni olan çipler silisyumdan yapılır. |
| 15 | P | 2, 8, 5 | 31 | Kibrit kutusunun sürtme yüzeyinde, kemiklerinde ve DNA'nda. | 1669'da bir simyacı altın yapmaya çalışırken çişi kaynattı ve fosforu buldu! |
| 16 | S | 2, 8, 6 | 32, 33, 34, 36 | Yanardağların çevresinde sarı kristaller olarak. | Çürük yumurtanın kokusu ve soğan doğrarken gözünü yaşartan şey kükürtlü maddelerdir. |
| 17 | Cl | 2, 8, 7 | 35, 37 | Havuz suyunda ve sofra tuzunda. | Tek başına zehirli, sarı-yeşil bir gazdır; ama sodyumla birleşince yemeğine attığın tuz olur. |
| 18 | Ar | 2, 8, 8 | 36, 38, 40 | Havada (yaklaşık %1) ve ampullerin içinde. | Adı Yunanca "tembel" demek, çünkü hiçbir şeyle tepkimeye girmez. |
| 19 | K | 2, 8, 8, 1 | 39, 41 | Muzda, patateste ve kaslarında. | Sembolü K, çünkü Latince adı "kalium". Suya atılınca lila renkli alevle yanar. |
| 20 | Ca | 2, 8, 8, 2 | 40, 42, 43, 44, 46, 48 | Kemiklerinde, dişlerinde, sütte ve yumurta kabuğunda. | Vücudunda en çok bulunan metal kalsiyumdur. |
| 21 | Sc | 2, 8, 9, 2 | 45 | Hafif ve sağlam bisiklet gövdelerinde, stadyum ışıklarında. | Adını İskandinavya'dan alır. |
| 22 | Ti | 2, 8, 10, 2 | 46, 47, 48, 49, 50 | Uçaklarda, roketlerde ve vücuda takılan yapay eklemlerde. | Çelik kadar sağlam ama ondan çok daha hafif. Beyaz boyaların beyazı da ondan gelir. |
| 23 | V | 2, 8, 11, 2 | 51 | İngiliz anahtarı gibi sağlam el aletlerinde. | Bileşikleri rengârenk olduğu için adını İskandinav güzellik tanrıçası Vanadis'ten aldı. |
| 24 | Cr | 2, 8, 13, 1 | 50, 52, 53, 54 | Pırıl pırıl musluklarda ve paslanmaz çelikte. | Yakutun kırmızısı da zümrütün yeşili de kromdan gelir. |
| 25 | Mn | 2, 8, 13, 2 | 55 | Kalem pillerin içinde ve çelikte. | Okyanusların dibinde patates büyüklüğünde mangan yumruları yatar. |
| 26 | Fe | 2, 8, 14, 2 | 54, 56, 57, 58 | Çivilerde, köprülerde ve kanında. | Kanının kırmızı rengi demirden gelir. Dünya'nın çekirdeği de çoğunlukla demirdir. |
| 27 | Co | 2, 8, 15, 2 | 59 | Masmavi cam ve seramiklerde, şarjlı pillerde. | Adı Almanca "kobold" yani "maden cini" sözünden gelir. B12 vitamininin içinde de var. |
| 28 | Ni | 2, 8, 16, 2 | 58, 60, 61, 62, 64 | Madenî paralarda ve paslanmaz çelikte. | Mıknatısın çektiği birkaç metalden biridir. Uzaydan düşen göktaşlarında bolca bulunur. |
| 29 | Cu | 2, 8, 18, 1 | 63, 65 | Elektrik kablolarının içinde. | Özgürlük Heykeli bakırdan yapıldı; zamanla hava ve yağmur onu yeşile çevirdi. |
| 30 | Zn | 2, 8, 18, 2 | 64, 66, 67, 68, 70 | Paslanmasın diye kaplanan demirlerde, güneş kreminde. | Bakırla karışınca pirinç olur; trompet gibi çalgılar pirinçten yapılır. |
| 31 | Ga | 2, 8, 18, 3 | 69, 71 | LED lambalarda ve telefon ekranlarında. | Avucunun içinde eriyen metal! Erime noktası sadece 29,8 °C. |
| 32 | Ge | 2, 8, 18, 4 | 70, 72, 73, 74, 76 | İnternet taşıyan fiber kablolarda, gece görüş kameralarında. | Mendeleyev bu elementin var olduğunu, bulunmasından 15 yıl önce tablosundaki boşluktan tahmin etti. |
| 33 | As | 2, 8, 18, 5 | 75 | Bazı hızlı elektronik çiplerde. | Tarihin en ünlü zehirlerinden biridir. |
| 34 | Se | 2, 8, 18, 6 | 74, 76, 77, 78, 80, 82 | Kepek şampuanında ve Brezilya cevizinde. | Adını Ay'dan alır (Yunanca "selene"). |
| 35 | Br | 2, 8, 18, 7 | 79, 81 | Bazı yangın söndürücü maddelerde. | Oda sıcaklığında sıvı olan yalnızca iki elementten biri. Adı "pis koku" demek! |
| 36 | Kr | 2, 8, 18, 8 | 78, 80, 82, 83, 84, 86 | Bazı fotoğraf flaşlarında ve pist ışıklarında. | Adı "gizli" demek. Bir zamanlar 1 metrenin uzunluğu kriptonun ışığıyla tanımlanıyordu. |

**"Dikkat!" notları:** F — "Çok zehirli ve yakıcı bir gaz." · Na, K, Li — "Suyla şiddetli tepkime verir; sadece özel laboratuvarlarda kullanılır." · Cl — "Zehirli gaz." · P — "Beyaz fosfor kendiliğinden tutuşabilir." · As — "Zehirli." · Br — "Zehirli ve yakıcı sıvı." · Be — "Tozu solunursa zararlıdır."

Kodlayan asistan, bu tablodaki olguları güvenilir bir kaynakla (ör. IUPAC, Royal Society of Chemistry, PubChem) karşılaştırır; farklılık bulursa içeriği kendiliğinden değiştirmez, `NOTLAR.md` dosyasında bildirir.

---

## Ek C — Ünlü elementler (37–118 arası altın çerçeveli kartlar)

| Z | Element | Bilgi |
|---|---|---|
| 38 | Stronsiyum | Havai fişeklerin parlak kırmızı rengi stronsiyumdan gelir. |
| 43 | Teknesyum | İnsanların laboratuvarda ürettiği ilk element. Adı "yapay" demek. |
| 47 | Gümüş | Bütün metaller içinde elektriği ve ısıyı en iyi ileten odur. Aynaların arkası da gümüşle parlatılır. |
| 50 | Kalay | Bakırla karışınca bronz (tunç) olur; insanlık tarihindeki Tunç Çağı adını bundan alır. |
| 53 | İyot | Sağlıklı büyümen için gerekli; bu yüzden sofra tuzuna iyot eklenir. Isınınca mor bir buhar çıkarır. |
| 54 | Ksenon | Bazı uzay araçlarının iyon motorları ksenon gazı püskürterek ilerler. |
| 55 | Sezyum | Dünyanın en hassas saatleri sezyum atomlarıyla çalışır. "1 saniye" sezyumla tanımlanır! |
| 56 | Baryum | Havai fişeklerin yeşil rengi baryumdan gelir. |
| 60 | Neodim | Dünyanın en güçlü mıknatısları neodimden yapılır; kulaklıklarının içinde bile var. |
| 74 | Tungsten | Erimesi en zor metal: ancak 3422 °C'de erir. Diğer adı Volfram; sembolü bu yüzden W. |
| 78 | Platin | Altından bile daha nadir. Arabaların egzozundaki zararlı gazları temizlemeye yardım eder. |
| 79 | Altın | Asla paslanmaz. Tarih boyunca çıkarılan bütün altın, yaklaşık 4 olimpik havuzu ancak doldurur. |
| 80 | Cıva | Oda sıcaklığında sıvı olan tek metal. Zehirlidir; eski termometrelerde kullanılırdı. |
| 82 | Kurşun | Çok ağırdır; röntgen çekilirken seni koruyan önlüğün içinde kurşun vardır. Bu arada kurşun kalemde kurşun yoktur, karbon vardır! |
| 84 | Polonyum | Marie Curie keşfetti ve ona vatanı Polonya'nın adını verdi. |
| 86 | Radon | Radyoaktif bir soy gaz. Toprağın derinliklerinden kendiliğinden sızar. |
| 88 | Radyum | Marie ve Pierre Curie buldu. O kadar radyoaktiftir ki karanlıkta hafifçe parlar. |
| 92 | Uranyum | Nükleer santrallerin yakıtı. Adını Uranüs gezegeninden alır. |
| 94 | Plütonyum | Voyager gibi uzay araçları, onlarca yıldır plütonyumlu nükleer pillerle çalışıyor. |
| 99 | Aynştaynyum | Adını ünlü fizikçi Albert Einstein'dan alır. |
| 101 | Mendelevyum | Adını periyodik tablonun mucidi Dimitri Mendeleyev'den alır. |
| 118 | Oganesson | Tablonun şimdilik son elementi. Bugüne kadar yalnızca birkaç atomu üretilebildi. |

---

## Ek D — Molekül kataloğu (27 tarif)

`Bağ`: P = paylaşım (ametal–ametal), A = alışveriş (metal–ametal), K = karışık.

### Kolay

| id | Formül | Ad | Kurulum ipucu | Bağ | Keşif öncesi ipucu | Keşif sonrası bilgi |
|---|---|---|---|---|---|---|
| `h2` | H₂ | Hidrojen gazı | H–H | P | En basit molekül: iki ikiz atom. | Evrendeki en hafif gaz. Roket yakıtı olarak kullanılır. |
| `o2` | O₂ | Oksijen gazı | O=O (çift bağ) | P | Nefes alırken içine çektiğin gaz. | İki oksijen atomu iki elle tutuşur: buna çift bağ denir. |
| `n2` | N₂ | Azot gazı | N≡N (üçlü bağ) | P | Havanın en büyük kısmı. | Üçlü bağ çok sağlamdır; bu yüzden azot gazı pek tepkimeye girmez. |
| `cl2` | Cl₂ | Klor gazı | Cl–Cl | P | Sarı-yeşil, keskin kokulu gaz. | Çok azı havuz ve içme sularını mikroplardan arındırır. |
| `hcl` | HCl | Hidrojen klorür | H–Cl | P | Midendeki asit. | Suda çözününce tuz ruhu olur. Miden yemekleri bununla sindirir. |
| `nacl` | NaCl | Sofra tuzu | Na–Cl | A | Yemeklere tat veren beyaz kristal. | Hırçın bir metal ile zehirli bir gaz birleşince yenebilen tuz oluyor! |
| `kcl` | KCl | Potasyum klorür | K–Cl | A | Tuzun kuzeni. | "Diyet tuzu" olarak ve bitki gübrelerinde kullanılır. |
| `naf` | NaF | Sodyum florür | Na–F | A | Dişlerinin dostu. | Diş macunundaki florür budur; dişlerini çürüklere karşı güçlendirir. |
| `mgo` | MgO | Magnezyum oksit | Mg=O | A | Magnezyum yanınca kalan beyaz toz. | Ateşe çok dayanıklıdır; fırın tuğlalarında kullanılır. |
| `cao` | CaO | Sönmemiş kireç | Ca=O | A | Çimento ve harcın atası. | Binlerce yıldır duvar örmek için kullanılıyor. |
| `h2o` | H₂O | Su | H–O–H | P | Onsuz yaşayamazsın. | Vücudunun yarısından fazlası sudur. |
| `co2` | CO₂ | Karbondioksit | O=C=O | P | Nefes verirken çıkardığın gaz. | Gazozdaki baloncuklar da karbondioksittir. Bitkiler onu soluyarak büyür. |
| `h2s` | H₂S | Hidrojen sülfür | H–S–H | P | Dünyanın en kötü kokularından biri. | Çürük yumurta kokusu! |
| `sio2` | SiO₂ | Silisyum dioksit | O=Si=O | P | Kumsalda ayağının altında. | Kumun, kuvarsın ve camın ana maddesi. |

### Orta

| id | Formül | Ad | Kurulum ipucu | Bağ | Keşif öncesi ipucu | Keşif sonrası bilgi |
|---|---|---|---|---|---|---|
| `nh3` | NH₃ | Amonyak | N'ye 3 H | P | Keskin kokulu temizlikçi. | Cam temizleyicilerde ve bitki gübrelerinde bulunur. |
| `h2o2` | H₂O₂ | Hidrojen peroksit | H–O–O–H | P | Suya çok benzer ama bir fazlası var. | "Oksijenli su" diye bilinir; yaraları temizlemekte kullanılır. |
| `ch4` | CH₄ | Metan | C'ye 4 H | P | Ocakta yanan gaz. | Doğal gazın ana maddesi. İnekler de geğirirken metan çıkarır! |
| `c2h2` | C₂H₂ | Asetilen | H–C≡C–H | P | İçinde üçlü bağ olan yakıt. | Metal kaynağı yapan ustaların çok sıcak alevi asetilenle yanar. |
| `naoh` | NaOH | Sodyum hidroksit | Na–O–H | K | Sabun yapımının gizli malzemesi. | "Sud kostik" de denir. Yağla birleşince sabun olur. |
| `cacl2` | CaCl₂ | Kalsiyum klorür | Cl–Ca–Cl | A | Kışın yollara serpilir. | Buzu eritir; kışın yollar kaymasın diye kullanılır. |
| `al2o3` | Al₂O₃ | Alüminyum oksit | O=Al–O–Al=O | A | Değerli taşların ana maddesi. | Yakut ve safir aslında alüminyum oksittir; rengi içindeki azıcık başka atomlardan gelir. |
| `c2h4` | C₂H₄ | Etilen | H₂C=CH₂ | P | Meyveleri olgunlaştıran gaz. | Muzlar bu gazla sararır. Plastik poşetler de etilenden yapılır. |
| `caco3` | CaCO₃ | Kalsiyum karbonat | C'ye bir O çift bağ, iki O tekli; o iki O Ca'ya bağlı | K | Yumurtanın zırhı. | Yumurta kabuğu, deniz kabuğu, mermer ve tebeşir hep bu maddedir. |
| `nahco3` | NaHCO₃ | Karbonat (yemek sodası) | Na–O–C(=O)–O–H | K | Kekleri kabartan beyaz toz. | Sirkeyle buluşunca köpürür. Kazanda dene! |

### Zor

| id | Formül | Ad | Kurulum ipucu | Bağ | Keşif öncesi ipucu | Keşif sonrası bilgi |
|---|---|---|---|---|---|---|
| `c2h4o2` | C₂H₄O₂ | Asetik asit | CH₃–C(=O)–O–H | P | Salatana ekşilik verir. | Sirkeyi ekşi yapan madde budur. |
| `c2h6o` | C₂H₆O | Etanol | CH₃–CH₂–O–H | P | Kolonyanın içinde. | Kolonya ve el dezenfektanındaki alkol. Mikropları öldürür. |
| `c3h8` | C₃H₈ | Propan | Üç C yan yana, kalan eller H | P | Kamp ocağının yakıtı. | Mutfak tüplerinde sıkıştırılmış hâlde bulunur. |

**"Dikkat!" notları:** `cl2`, `h2s`, `nh3`, `hcl`, `naoh` — "Gerçeği tehlikelidir; yalnızca sanal laboratuvarda!"

**Kristal notu** (5. sadeleştirme) şu kartlarda gösterilir: `nacl`, `kcl`, `naf`, `mgo`, `cao`, `cacl2`, `al2o3`, `caco3`, `nahco3`, `naoh`, `sio2`.

---

## Ek E — Tepkime Kazanı içeriği

### E.1 Maddeler (38)

**Elementler rafı (16):** `lityum` Lityum · `sodyum` Sodyum · `potasyum` Potasyum · `sezyum` Sezyum · `magnezyum` Magnezyum şeridi · `cinko` Çinko · `demir-civi` Demir çivi · `celik-yunu` Çelik yünü · `bakir` Bakır · `altin` Altın · `komur` Kömür (karbon) · `hidrojen` Hidrojen gazı · `helyum` Helyum gazı · `oksijen` Oksijen gazı · `metan` Metan gazı · `klor` Klor gazı

**Mutfaktan rafı (14):** `su` Su · `sirke` Sirke · `limon-suyu` Limon suyu · `karbonat` Karbonat · `yumurta-kabugu` Yumurta kabuğu · `sofra-tuzu` Sofra tuzu · `zeytinyagi` Zeytinyağı · `lahana-suyu` Kırmızı lahana suyu · `sabunlu-su` Sabunlu su · `oksijenli-su` Oksijenli su · `maya` Maya · `kola` Kola · `naneli-seker` Naneli şeker · `kuru-buz` Kuru buz

**Laboratuvar rafı (8):** `tuz-ruhu` Tuz ruhu (asit) · `sud-kostik` Sud kostik (baz) · `bakir-sulfat` Bakır sülfat (göztaşı) · `lityum-tuzu` Lityum tuzu · `potasyum-tuzu` Potasyum tuzu · `kalsiyum-tuzu` Kalsiyum tuzu · `stronsiyum-tuzu` Stronsiyum tuzu · `baryum-tuzu` Baryum tuzu

Gazlar kazana renkli balon ya da tüp olarak gelir. Her maddenin `elements` alanı ilgili atom numaralarını içerir (ör. `sofra-tuzu` → [11, 17], `su` → [1, 8]).

### E.2 Tepkimeler (45)

Tür: K = kimyasal, F = fiziksel, Y = tepkime yok. Güvenlik: ⚠️ sanal · 🏠 evde, büyükle · — nötr.

**Hırçın Çete suda** (etiket: `alkali-su`)

| id | Girdiler | Araç | Tür | Başlık | Ne olur? | Efekt | Güv. |
|---|---|---|---|---|---|---|---|
| `r01` | lityum + su | — | K | Sakin Fışırtı | Lityum suda yüzer ve fışırdayarak hidrojen gazı çıkarır. | suda-kayan-metal(1) | ⚠️ |
| `r02` | sodyum + su | — | K | Suda Dans Eden Metal | Sodyum eriyip top olur, suyun üstünde vızır vızır koşar; bazen sarı alev alır. | suda-kayan-metal(2, sarı) | ⚠️ |
| `r03` | potasyum + su | — | K | Lila Alev | Potasyum suya değer değmez lila renkli alevle tutuşur. | suda-kayan-metal(3, lila) | ⚠️ |
| `r04` | sezyum + su | — | K | BUM! | Sezyum suya değdiği anda patlar. Ailede aşağı indikçe hırçınlık artıyor! | patlama(büyük) | ⚠️ |

Sözel denklem (hepsi için): "Metal + Su → Metal hidroksit + Hidrojen gazı". `r02` sembollü: 2Na + 2H₂O → 2NaOH + H₂.

**Mutfak deneyleri**

| id | Girdiler | Araç | Tür | Başlık | Ne olur? | Efekt | Güv. |
|---|---|---|---|---|---|---|---|
| `r05` | sirke + karbonat | — | K | Mutfak Volkanı | Köpükler taşıyor! Asit ile karbonat buluşunca karbondioksit gazı çıkar. | kopuk-tasma(beyaz) | 🏠 |
| `r06` | limon-suyu + karbonat | — | K | Limonlu Köpük | Limon da bir asit; karbonatla aynı köpüklü gazı çıkarır. | kopuk-tasma(sarımsı) | 🏠 |
| `r07` | sirke + yumurta-kabugu | — | K | Eriyen Zırh | Kabuğun üstünde minik kabarcıklar belirir. Sirke kabuğu yavaş yavaş çözer. | kabarcik(yavaş) | 🏠 |
| `r08` | oksijenli-su + maya | — | K | Fil Diş Macunu | Maya, oksijenli suyu hızla suya ve oksijen gazına ayırır; köpük fışkırır! | kopuk-tasma(dev) | 🏠 |
| `r09` | kola + naneli-seker | — | F | Kola Fıskiyesi | Şekerin pütürlü yüzeyi koladaki gazı bir anda dışarı çıkarır. Yeni madde oluşmadı. | fiskiye | 🏠 |
| `r10` | kuru-buz + su | — | F | Cadı Kazanı | Kuru buz, donmuş karbondioksittir. Suda hızla gaza dönüşür ve sis yapar. | sis | ⚠️ |
| `r11` | sofra-tuzu + su | — | F | Kaybolan Tuz | Tuz suda çözündü ama yok olmadı; su artık tuzlu. | cozunme | 🏠 |
| `r12` | zeytinyagi + su | — | F | Küs Sıvılar | Yağ ile su karışmaz. Yağ daha hafif olduğu için üstte kalır. | katman | 🏠 |

**Renk değiştiren iksir** (etiket: `indikator`) — Kırmızı lahana suyu, asitlerde pembe-kırmızı, bazlarda mavi-yeşil olur.

| id | Girdiler | Tür | Başlık | Sonuç rengi | Güv. |
|---|---|---|---|---|---|
| `r13` | lahana-suyu + sirke | K | Pembe İksir | mor → pembe (asit) | 🏠 |
| `r14` | lahana-suyu + limon-suyu | K | Kırmızı İksir | mor → pembe-kırmızı (asit) | 🏠 |
| `r15` | lahana-suyu + karbonat | K | Mavi İksir | mor → mavi-yeşil (baz) | 🏠 |
| `r16` | lahana-suyu + sabunlu-su | K | Yeşil İksir | mor → yeşil (baz) | 🏠 |
| `r17` | lahana-suyu + tuz-ruhu | K | Kıpkırmızı İksir | mor → kırmızı (güçlü asit) | ⚠️ |
| `r18` | lahana-suyu + sud-kostik | K | Sarı İksir | mor → sarı-yeşil (güçlü baz) | ⚠️ |

Açıklama kalıbı: "Lahana suyu bir renk dedektifidir: {asit/baz} görünce {renk} olur."

**Ateşle**

| id | Girdiler | Araç | Tür | Başlık | Ne olur? | Efekt | Güv. |
|---|---|---|---|---|---|---|---|
| `r19` | hidrojen | ateş | K | Pop! | Hidrojen "pop" diye patlayarak yanar ve su buharı oluşur. | patlama(küçük) | ⚠️ |
| `r20` | helyum | ateş | Y | Sakin Balon | Hiçbir şey olmadı. Helyum bir soy gaz; yanmaz. Balonlarda bu yüzden helyum kullanılır. | hicbir-sey | — |
| `r21` | oksijen | ateş | Y | Alevin Dostu | Alev büyüdü ve parladı ama oksijenin kendisi yanmaz; o, başka şeylerin yanmasını sağlar. | alev(parlak, büyük) | — |
| `r22` | metan | ateş | K | Mavi Alev | Metan mavi alevle yanar; karbondioksit ve su buharı oluşur. Ocaktaki alev budur. | alev(mavi) | ⚠️ |
| `r23` | magnezyum | ateş | K | Göz Kamaştıran Işık | Magnezyum bembeyaz bir ışıkla yanar; geriye beyaz bir toz kalır. | parlak-isik(beyaz) | ⚠️ |
| `r24` | komur | ateş | K | Kor | Kömür kızararak yanar. Karbon, havadaki oksijenle birleşip karbondioksit olur. | alev(turuncu, kısık) | — |
| `r25` | celik-yunu | ateş | K | Kıvılcım Yağmuru | İncecik demir teller kıvılcımlar saçarak yanar. Demir de yanabiliyormuş! | kivilcim | ⚠️ |
| `r26` | su | ateş | F | Fokur Fokur | Su kaynadı ve buhar oldu. Hâlâ su; sadece gaz hâline geçti. | buhar | — |
| `r27` | hidrojen + oksijen | ateş | K | Büyük Pop | İki gaz birleşti, gürültüyle patladı ve… su oluştu! | patlama(büyük) | ⚠️ |

`r19`, `r27` → ürün molekül: `h2o`. `r22`, `r24` → `co2`. `r23` → `mgo`.

**Alev renkleri** (etiket: `alev-testi`) — Araç: ateş. Tür: K. Güvenlik: ⚠️. Efekt: `alev(renk)`. Açıklama kalıbı: "{Element} alevi {renk} yapar. Havai fişekler renklerini böyle alır!"

| id | Girdi | Başlık | Alev rengi |
|---|---|---|---|
| `r28` | lityum-tuzu | Kırmızı Alev | koyu kırmızı |
| `r29` | sofra-tuzu | Sarı Alev | parlak sarı |
| `r30` | potasyum-tuzu | Lila Alev | lila |
| `r31` | kalsiyum-tuzu | Turuncu Alev | turuncu-kırmızı |
| `r32` | stronsiyum-tuzu | Kıpkırmızı Alev | parlak kırmızı |
| `r33` | baryum-tuzu | Yeşil Alev | açık yeşil |
| `r34` | bakir-sulfat | Turkuaz Alev | mavi-yeşil |

**Asitler, bazlar, metaller**

| id | Girdiler | Araç | Tür | Başlık | Ne olur? | Efekt | Güv. |
|---|---|---|---|---|---|---|---|
| `r35` | tuz-ruhu + sud-kostik | — | K | Barışma | Bir asit ile bir baz birbirini etkisiz hâle getirdi. Geriye tuzlu su kaldı ve kazan ısındı! | renk-degisimi + buhar(hafif) | ⚠️ |
| `r36` | cinko + tuz-ruhu | — | K | Kabarcık Fabrikası | Çinko asitte çözünürken hidrojen kabarcıkları çıkarır. | kabarcik(orta) | ⚠️ |
| `r37` | magnezyum + tuz-ruhu | — | K | Hızlı Kabarcıklar | Magnezyum çinkodan da hızlı! Köpüre köpüre çözünür. | kabarcik(hızlı) | ⚠️ |
| `r38` | bakir + tuz-ruhu | — | Y | Umursamaz Bakır | Hiçbir şey olmadı. Her metal asitle tepkimeye girmez. | hicbir-sey | — |
| `r39` | altin + tuz-ruhu | — | Y | Soylu Metal | Altın kılını bile kıpırdatmadı. Bu yüzden binlerce yıl pırıl pırıl kalır. | hicbir-sey | — |
| `r40` | demir-civi + bakir-sulfat | — | K | Bakır Kaplama | Çivi bakır rengine döndü! Demir, çözeltideki bakırın yerine geçti. | zaman-kaplama(bakır) + renk-degisimi(mavi, soluk yeşil) | ⚠️ |
| `r44` | sodyum + klor | — | K | Zehirden Tuza | Hırçın bir metal ile zehirli bir gaz parlak bir ışıkla birleşti ve sofra tuzu oldu! | parlak-isik(sarı) | ⚠️ |

`r35`, `r44` → ürün molekül: `nacl` (`r35` ayrıca `h2o`).

**Zaman ve elektrik**

| id | Girdiler | Araç | Tür | Başlık | Ne olur? | Efekt | Güv. |
|---|---|---|---|---|---|---|---|
| `r41` | demir-civi + su | zaman | K | Pas | Günler geçti… Demir, su ve havadaki oksijenle birleşip kızıl-kahve pasa dönüştü. | zaman-kaplama(pas) | 🏠 |
| `r42` | bakir + su | zaman | K | Yeşil Örtü | Yıllar geçti… Bakırın üstü yeşil bir tabakayla kaplandı. Özgürlük Heykeli bu yüzden yeşil! | zaman-kaplama(yeşil) | — |
| `r43` | altin + su | zaman | Y | Sonsuza Dek Parlak | Yüzyıllar geçti, altın hiç değişmedi. Altın paslanmaz. | hicbir-sey(zaman) | — |
| `r45` | su | elektrik | K | Suyu Parçala | Elektrik, suyu yapı taşlarına ayırdı: bir yanda hidrojen, diğer yanda oksijen kabarcıkları. | kabarcik(çift taraflı) | ⚠️ |

`r45` → ürün molekül: `h2`, `o2`. Görsel ayrıntı: hidrojen tarafında iki kat fazla kabarcık (H₂O'da iki H, bir O olduğu için).

**Evde deneme malzeme notları (`homeMaterialsTr`):** `r05` "Bir bardak, 2 kaşık karbonat, yarım bardak sirke, altına bir tepsi." · `r08` "Eczaneden %3'lük oksijenli su, kuru maya, biraz bulaşık deterjanı; lavaboda ya da tepside." · `r09` "Açık havada, büyük şişe kola ve naneli şekerler." · `r13`–`r16` "Kırmızı lahanayı sıcak suda bekletip suyunu süz; küçük bardaklara böl." · `r41` "Bir çiviyi ıslak pamuğun içinde birkaç gün beklet."

---

## Ek F — Merak Görevleri (54)

Kademe: B = başlangıç, O = orta, İ = ileri.

### Atom Kurucu

| id | Kad. | Başlık | Merak sorusu | Koşul |
|---|---|---|---|---|
| `qa01` | B | İlk Atomun | Evrenin en basit atomunu kurabilir misin? | Hidrojen kuruldu |
| `qa02` | B | Balon Gazı | Uçan balonları dolduran gazın atomu nasıl? | Helyum kuruldu |
| `qa03` | B | Kimlik Numarası 6 | 6 protonlu atom hangi element çıkacak? | Karbon kuruldu |
| `qa04` | B | Yüklü Atom | Elektron sayısı protondan farklı olursa ne olur? | Herhangi bir iyon kuruldu |
| `qa05` | O | Tuzun Yarısı | Sodyum bir elektronunu kaybederse? | Na, yük +1 |
| `qa06` | O | Dolu Katman | Dış katmanı tıka basa dolu bir atom kur. | Soy gaz dizilimli nötr atom (He, Ne, Ar ya da Kr) kuruldu |
| `qa07` | O | İkiz Ama Farklı | Aynı elementin iki farklı ağırlıkta atomu olur mu? | Aynı elementin 2 farklı izotopu kuruldu |
| `qa08` | O | Sallanan Çekirdek | Çekirdeği yerinde duramayan bir atom yap. | Kararsız bir çekirdek kuruldu |
| `qa09` | İ | Fosil Saati | Dinozor kemiklerinin yaşını ölçen atomu kur. | C-14 (6p, 8n) |
| `qa10` | O | İlk 10 | İlk 10 elementin hepsini kur. | Z 1–10 kuruldu |
| `qa11` | İ | Ağır Sıklet | Kanına rengini veren metalin atomunu kur. | Demir kuruldu |
| `qa12` | İ | Muzdaki Sır | Muzun içindeki azıcık radyoaktif atomu kur. | K-40 (19p, 21n) |

### Molekül Atölyesi

| id | Kad. | Başlık | Merak sorusu | Koşul |
|---|---|---|---|---|
| `qm01` | B | El Ele | İki hidrojen atomunu tutuştur. | `h2` |
| `qm02` | B | Hayat Suyu | Suyu atomlarından yapabilir misin? | `h2o` |
| `qm03` | B | Çift Bağ | İki oksijen birbirine kaç elle tutunur? | `o2` |
| `qm04` | B | Nefesinden Çıkan | Nefes verirken çıkardığın gazı kur. | `co2` |
| `qm05` | O | Üçlü Güç | Üç elle birden tutuşan atomlar bul. | `n2` |
| `qm06` | B | Mutfak Tuzu | Tuzu yapmak için hangi iki atom gerek? | `nacl` |
| `qm07` | O | Ocak Gazı | Bir karbona dört hidrojen tak. | `ch4` |
| `qm08` | B | Elleri Cebinde | Helyumu başka bir atoma bağlamayı dene. | Soy gaz bağlama denemesi |
| `qm09` | O | Çürük Yumurta | Dünyanın en kötü kokusunu kur (sanal, kokmaz!). | `h2s` |
| `qm10` | O | Diş Dostu | Diş macunundaki maddeyi yap. | `naf` |
| `qm11` | İ | Yakutun Sırrı | Değerli taşların ana maddesini kur. | `al2o3` |
| `qm12` | İ | Sirke Ustası | 8 atomlu sirke molekülünü kur. | `c2h4o2` |
| `qm13` | İ | Yumurtanın Zırhı | Yumurta kabuğunun maddesini kur. | `caco3` |
| `qm14` | O | On Molekül | Defterine 10 molekül ekle. | 10 molekül |

### Tepkime Kazanı

| id | Kad. | Başlık | Merak sorusu | Koşul |
|---|---|---|---|---|
| `qt01` | B | Mutfak Volkanı | Mutfaktan iki malzemeyle köpük taşır. | `r05` |
| `qt02` | B | Suda Dans Eden Metal | Sodyumu suya atarsan ne olur? | `r02` |
| `qt03` | O | Kim Daha Hırçın? | Lityum, sodyum ve potasyumu suyla dene. Fark var mı? | `r01`, `r02`, `r03` |
| `qt04` | B | Pop! | Hidrojene ateş yaklaştır. | `r19` |
| `qt05` | B | Sakin Balon | Peki ya helyuma ateş yaklaştırırsan? | `r20` |
| `qt06` | O | Havai Fişek Ustası | 4 farklı alev rengi bul. | `alev-testi` etiketli 4 tepkime |
| `qt07` | O | Renk Değiştiren İksir | Lahana suyunu hem pembe hem mavi-yeşil yap. | (`r13` ya da `r14` ya da `r17`) ve (`r15` ya da `r16` ya da `r18`) |
| `qt08` | O | Zehirden Tuza | Bir metal ile zehirli bir gazdan tuz yap. | `r44` |
| `qt09` | O | Zaman Makinesi | Zamanı ileri sarıp demiri paslandır. | `r41` |
| `qt10` | İ | Suyu Parçala | Suyu yapı taşlarına ayırabilir misin? | `r45` |
| `qt11` | İ | Barışma | Bir asit ile bir bazı karıştır. | `r35` |
| `qt12` | O | Fil Diş Macunu | Dev bir köpük fışkırt. | `r08` |
| `qt13` | O | Hiçbir Şey Olmadı! | Hiç tepkime vermeyen 3 deney bul. | Türü "tepkime yok" olan 3 kayıt |
| `qt14` | İ | Kimyasal mı, Fiziksel mi? | Yeni madde oluşmayan 2 değişim bul. | Türü "fiziksel" olan 2 kayıt |

### Sıcaklık Odası

| id | Kad. | Başlık | Merak sorusu | Koşul |
|---|---|---|---|---|
| `qs01` | B | Sıvı İkili | Oda sıcaklığında sıvı olan iki elementi bul. | Br ve Hg kartları incelendi |
| `qs02` | B | Avuçta Eriyen Metal | Vücut sıcaklığında eriyen metali erit. | Ga: katı → sıvı izlendi |
| `qs03` | O | Buz Gibi Hava | Azotu sıvı yapacak kadar soğut. | N: gaz → sıvı izlendi |
| `qs04` | İ | Son Kale | En son eriyen metal hangisi? Onu erit. | W: katı → sıvı izlendi |
| `qs05` | O | Her Şey Gaz | Sıcaklığı sonuna kadar aç. | Sıcaklık ≥ 6000 °C |
| `qs06` | O | İnatçı Helyum | Helyumu dondurmayı dene. | Helyum sabitliyken sıcaklık ≤ −272 °C |
| `qs07` | O | Demirci | Demiri eritecek kadar ısıt. | Fe: katı → sıvı izlendi |

### Periyodik Tablo

| id | Kad. | Başlık | Merak sorusu | Koşul |
|---|---|---|---|---|
| `qp01` | B | Aile Toplantısı | "Kimseye Bulaşmayanlar" ailesinin 6 üyesini de incele. | Soy gazların 6'sı incelendi |
| `qp02` | B | Vücudumdaki Elementler | "Vücudumda" gözlüğünü tak; parlayan 5 elementi incele. | Gözlük kullanıldı + ana vücut elementlerinden 5'i incelendi |
| `qp03` | O | İsim Dedektifi | Adını bir yerden ya da ülkeden alan 3 element bul. | Ad kökeni "yer" olan 3 kart incelendi |
| `qp04` | B | Türkiye'nin Hazinesi | Dünyadaki rezervinin çoğu Türkiye'de olan element hangisi? | Bor incelendi |
| `qp05` | O | Mendeleyev'in Tahmini | Bulunmadan önce tahmin edilen elementi bul. | Germanyum incelendi |
| `qp06` | O | Ünlüler Geçidi | 10 altın çerçeveli kart topla. | 10 ünlü kart incelendi |
| `qp07` | B | Kurşun Kalem Yalanı | Kurşun kalemin ucunda gerçekte ne var? | Kurşun ve Karbon incelendi |

**İpucu metinleri:** Her görev için `İpucu` düğmesinin göstereceği tek cümlelik yönlendirme, kodlayan asistan tarafından 12.2 üslubuyla yazılır (ör. `qa09`: "Karbonun 6 protonu var. Nötronu 8 yapmayı dene.").

---

## Ek G — Rozetler (22)

| id | Rozet | Koşul |
|---|---|---|
| `b01` | Çırak Kimyager | Tanıtım tamamlandı (ya da geçildi ve ilk atom kuruldu) |
| `b02` | Atom Mimarı | 10 farklı elementin atomu kuruldu |
| `b03` | Atom Ustası | 36 elementin hepsinin atomu kuruldu |
| `b04` | İyon Avcısı | 5 farklı iyon kuruldu |
| `b05` | İzotop Dedektifi | 3 farklı kararsız (radyoaktif) çekirdek kuruldu |
| `b06` | Molekül Çırağı | 5 molekül keşfedildi |
| `b07` | Molekül Ustası | 15 molekül keşfedildi |
| `b08` | Molekül Profesörü | 27 molekülün hepsi keşfedildi |
| `b09` | Bağ Ustası | Tekli, çiftli ve üçlü bağ kuruldu |
| `b10` | Çılgın Kimyager | 10 tepkime keşfedildi |
| `b11` | Kazan Ustası | 30 tepkime keşfedildi |
| `b12` | Gökkuşağı Alevi | 7 alev renginin hepsi bulundu |
| `b13` | Ev Bilimcisi | "Evde denenebilir" 5 deney keşfedildi |
| `b14` | Meraklı Kedi | "Tepkime yok" türünden 4 kayıt bulundu |
| `b15` | Buz ve Ateş | Sıcaklık hem −273 °C'ye hem 6000 °C'ye getirildi |
| `b16` | Hâl Ustası | 10 farklı elementin hâl değişimi izlendi |
| `b17` | Aile Dostu | Herhangi bir ailenin tüm üyeleri incelendi |
| `b18` | Büyük Aile | 10 ailenin her birinden en az bir element incelendi |
| `b19` | İlk 20 Şampiyonu | İlk 20 elementin hepsi 3 yıldız |
| `b20` | Koleksiyoncu | 118 kartın hepsi incelendi |
| `b21` | Görev Avcısı | 25 görev tamamlandı |
| `b22` | Baş Kimyager | "Baş Kimyager" unvanına ulaşıldı (diploma açılır) |

---

## Ek H — Ad kökenleri (seçilmiş)

Kısa kartlarda ve `qp03` görevinde kullanılır. Her biri için tek cümlelik `textTr` kodlayan asistan tarafından yazılır ve doğrulanır (ör. "Adını Fransa'dan alır.").

- **Yer:** Mg (Magnesia bölgesi) · Sc (İskandinavya) · Cu (Kıbrıs) · Ga (Fransa'nın eski adı Galya) · Ge (Almanya) · Sr (İskoçya'daki Strontian köyü) · Y, Tb, Er, Yb (İsveç'teki Ytterby köyü — dört elemente ad veren köy!) · Ru (Rusya) · Eu (Avrupa) · Ho (Stockholm) · Lu (Paris'in eski adı) · Hf (Kopenhag'ın eski adı) · Re (Ren Nehri) · Po (Polonya) · Fr (Fransa) · Am (Amerika) · Bk (Berkeley) · Cf (Kaliforniya) · Db (Dubna) · Hs (Almanya'nın Hessen eyaleti) · Ds (Darmstadt) · Nh (Japonya) · Mc (Moskova) · Ts (Tennessee)
- **Kişi:** Gd (Johan Gadolin) · Cm (Marie ve Pierre Curie) · Es (Albert Einstein) · Fm (Enrico Fermi) · Md (Dimitri Mendeleyev) · No (Alfred Nobel) · Lr (Ernest Lawrence) · Rf (Ernest Rutherford) · Sg (Glenn Seaborg) · Bh (Niels Bohr) · Mt (Lise Meitner) · Rg (Wilhelm Röntgen) · Cn (Nicolaus Copernicus) · Og (Yuri Oganessian)
- **Gök cismi:** He (Güneş) · Se (Ay) · Te (Dünya) · Ce (cüce gezegen Ceres) · Pd (asteroit Pallas) · U (Uranüs) · Np (Neptün) · Pu (Plüton)

---

*Belge sonu.*
