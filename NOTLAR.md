# Uygulama notları

SPEC.md'den sapmalar, spec'in boş bıraktığı yerlerde alınan kararlar ve doğrulanması önerilen noktalar.

## Veri doğrulaması (SPEC 14.6 ve Ek B)

- **Erime/kaynama noktaları ve atom kütleleri** yayımlanmış başvuru değerlerinden (IUPAC, PubChem, RSC) elle girildi; geliştirme sırasında canlı bir veri kümesi indirilmedi. SPEC 10.2'deki bütün doğrulama testleri geçiyor (25 °C'de yalnız Br ve Hg sıvı, 11 gaz; 37 °C'de Ga ve Cs sıvı; 3400 °C'de yalnız W ve C katı; 6000 °C'de katı/sıvı yok).
- Bazı değerlerde kaynaklar arasında küçük farklar vardır; seçilenler: Ga kaynama 2229 °C (RSC), W kaynama 5555 °C (RSC), Ba kaynama 1845 °C. Fr (27 °C / 677 °C), At (302 / 337 °C), Pa, Np, Am ve Cm için yaygın kullanılan tahmini değerler girildi. Bk, Cf ve Es için yalnız erime noktası var, kaynama `null`.
- **Ek B olguları** benim bilgimle karşılaştırıldı, canlı bir kaynakla değil. Çelişki bulmadım. Bir büyüğün hızlıca göz atmasını önerdiğim, en "iddialı" cümleler:
  - Bor: "Dünyadaki bor rezervlerinin çoğu Türkiye'de" (yaygın kaynaklarda ~%70 civarı verilir).
  - Altın (Ek C): "çıkarılan bütün altın ~4 olimpik havuz" (yaklaşık 210 bin ton ÷ 19,3 g/cm³ ≈ 11 bin m³ ≈ 4,4 havuz).
  - Germanyum: Mendeleyev'in tahmini (1871) ile keşif (1886) arası 15 yıl.
  - Kripton: metrenin 1960–1983 arasında Kr-86 ışığıyla tanımlanması.
- Ek B'deki 36 elementin katman dizilimleri ve kararlı izotop listeleri birebir kullanıldı; veri testleri her derin içerikte katman toplamının Z'ye eşit olduğunu ve en az bir kararlı izotopun Atom Kurucu sınırları içinde kurulabildiğini doğruluyor.

## Spec'in açık bıraktığı yerlerde alınan kararlar

1. **İzotop / iyon / kararsız çekirdek kaydı:** Parçacıklar tek tek eklenirken ara durumların (ör. 6 proton 0 nötron) "kuruldu" sayılmaması için atom 0,9 saniye değişmeden kalınca "yerleşmiş" sayılır ve ancak o zaman kaydedilir. Hiç elektronu olmayan çıplak çekirdek iyon sayılmaz; aksi hâlde "Yüklü Atom" görevi istemeden tamamlanıyordu.
2. **"Atomu kuruldu" (2. yıldız)** ise anında verilir (kutlama gecikmesin diye).
3. **Tepkime araması:** Araç seçiliyken araçlı eşleşme yoksa araçsız tepkimeye düşülür (ör. sirke + karbonat + zaman yine köpürür). Tersi yapılmaz: demir çivi + su araçsız hâlâ "hiçbir şey olmadı" (spec testindeki gibi).
4. **"Tepkime yok" kayıtları** (bakır + tuz ruhu vb.) deftere yazılır ve +3 KP verir; katalog dışı birleşimler yazılmaz.
5. **KP** her seferinde kayıttan hesaplanır (yıldız, molekül, tepkime, görev, rozet). Kümeler yalnız büyüdüğü için KP hiç azalmaz.
6. **Koşul türleri** spec 14.4 listesine şunlar eklendi: `pinnedTempReached` (İnatçı Helyum), `lensUsed`, `anyFamilyComplete`, `familiesTouched` ve `elementsViewedCount` için `zIn` filtresi.
7. **qs01 (Sıvı İkili)** Sıcaklık Odası grubunda listelenmişti ama koşulu tabloda kart incelemek olduğu için "Beni oraya götür" tabloyu açar.
8. **Görev Panosu**, tanıtımdan sonra tablonun ipucu turu bitince açılır (ikisi aynı anda açılınca üst üste biniyordu).
9. **Molekül Atölyesi'nde bağ kurma:** Atomu başka bir atomun üstüne bırakmak, boştaki bir "elden" diğer atoma sürüklemek ya da iki atoma sırayla tıklamak bağ kurar. Zaten bağlı iki atomu tekrar üst üste bırakmak bağ derecesini artırır.
10. **Alışveriş (iyonik) bağı:** Atomların köşesinde yük rozeti gösterilir (ör. Mg²⁺/O²⁻, CaCO₃'te Ca²⁺ ve iki O⁻).
11. **Hâl değişimi:** Kaydırıcı bir anda katıdan gaza atlarsa (süblimleşmeyen element) önce erime, sonra kaynama olayı yayınlanır; böylece Galyum'u hızla ısıtmak da "eridi" sayılır.
12. **Atom çizimi** az katmanlı atomlarda otomatik yakınlaşır (hidrojen küçücük kalmasın diye).

## Teknik sapmalar

- **Stil:** Tailwind yerine CSS değişkenli (tema belirteçli) düz CSS dosyaları kullanıldı; spec "eşdeğer bir çözüm kabul edilir" diyor.
- **Animasyon:** Motion (Framer Motion) eklenmedi. Arayüz geçişleri CSS, elektron dönüşü SVG `animateTransform`, tepkime ve tanecik efektleri Canvas 2D ile yapıldı. Paket küçük kaldı: ana JS ~105 KB (gzip), her atölye tembel yükleniyor.
- **Sürükle-bırak:** `dnd-kit` yerine Pointer Events tabanlı küçük bir katman yazıldı (`src/ui/drag.tsx`). Her sürükle-bırak eyleminin tıklama ve klavye karşılığı var.
- **Ölçekleme:** 1280×720'den küçük pencerede bütün uygulama orantılı küçültülür; modal, tur ve bildirimler ölçeklenmeyen bir katmana (portal) çizilir.
- **Test:** Birim + veri bütünlüğü testlerine ek olarak jsdom üzerinde React Testing Library ile 3 duman testi var. Playwright eklenmedi; uçtan uca senaryolar elle, Chrome'da denendi.

## Elle denenen senaryolar (Chrome, 1568×711)

Tanıtım (ad, yakınlaşma, sürükle-bırakla hidrojen, kart, "Çırak Kimyager"), tablo turu, Karbon kartı → "Atomunu kur" hedef modu → klavyeyle C-12 → 2 nötron ekleyince C-14 mesajı ve "Fosil Saati" görevi; H₂O ve NaCl kurma (iyonik bağ rozetleri, keşif kartı, "Molekül Çırağı" rozeti); He bağlamaya çalışma ("Elleri Cebinde"); sirke + karbonat ve sodyum + su tepkimeleri; Galyum'u 37 °C'de eritme; 5500 °C; Defter ve sertifika. Konsolda hata görülmedi.

Denenmeyenler: yazdırma çıktısının kâğıttaki görünümü, Firefox, ses düzeyinin gerçek hoparlörde dengesi.
