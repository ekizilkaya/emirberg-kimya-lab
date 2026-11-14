# Kaynaklar ve lisanslar

## Yazı tipleri

Projeye `@fontsource` paketleriyle gömülüdür; çalışma anında dış ağ isteği yapılmaz.

| Yazı tipi | Kullanım | Lisans |
|---|---|---|
| Baloo 2 (Ek Type) | Başlıklar | SIL Open Font License 1.1 |
| Nunito (Vernon Adams ve katkıda bulunanlar) | Gövde metni | SIL Open Font License 1.1 |

## Sesler

Bütün ses efektleri `src/audio/sound.ts` içinde Web Audio API ile çalışma anında sentezlenir. Dış ses dosyası kullanılmamıştır.

## Görseller

- Maskot Mol, atom/molekül çizimleri, kazan ve tanecik animasyonları bu proje için SVG ve Canvas 2D ile çizilmiştir.
- Simgeler işletim sisteminin emoji yazı tipinden gelir; ayrı görsel dosyası yoktur.
- Telifli görsel, marka logosu ya da gerçek ürün adı kullanılmamıştır.

## Bilimsel veriler

- Element adları (Türkçe ve İngilizce), aileler, katman dizilimleri ve kararlı izotop listeleri SPEC.md'deki Ek A ve Ek B'den alınmıştır.
- Atom kütleleri ile erime ve kaynama noktaları, IUPAC standart atom kütleleri ile PubChem ve Royal Society of Chemistry periyodik tablolarında yayımlanan değerlere dayanarak elle girilmiştir. PubChem verileri ABD hükümeti çalışması olarak kamu malıdır. Değerler canlı bir veri kümesinden otomatik indirilmemiştir; ayrıntı için NOTLAR.md'ye bakın.
- Atom numarası 100 ve üzeri elementler için kuramsal tahminler kullanılmamış, erime/kaynama "bilinmiyor" bırakılmıştır.

## Yazılım

React, React Router, Zustand, Vite, Vitest, Testing Library, ESLint ve Prettier; her biri kendi açık kaynak lisansıyla (MIT) `node_modules` içinde dağıtılır.
