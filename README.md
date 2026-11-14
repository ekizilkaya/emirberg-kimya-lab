# Emirberg Kimya Lab

10 yaşındaki Emir için tarayıcıda çalışan, serbest keşif (sandbox) tarzı bir kimya laboratuvarı oyunu. Ürün kararları ve tüm içerik [SPEC.md](SPEC.md) dosyasındadır.

## Oynamak

**En kolay yol (Windows):** `Baslat.bat` dosyasına çift tıkla. İlk seferde paketleri kurar ve oyunu derler, sonra varsayılan tarayıcıda açar. Bunun için bilgisayarda [Node.js LTS](https://nodejs.org) kurulu olmalıdır.

Oyun tamamen çevrimdışı çalışır; hesap, reklam ya da dış bağlantı yoktur. İlerleme yalnızca o tarayıcının yerel deposunda (`localStorage`) tutulur.

## Komutlar

| Komut | Ne yapar |
|---|---|
| `npm install` | Paketleri kurar |
| `npm run dev` | Geliştirme sunucusu (anında yenileme) |
| `npm run build` | Tip kontrolü + üretim derlemesi (`dist/`) |
| `npm run preview` | Derlenmiş sürümü yerelde sunar |
| `npm test` | Birim, veri bütünlüğü ve duman testleri (Vitest) |
| `npm run lint` | ESLint |

`dist/` klasörü herhangi bir statik barındırmaya (GitHub Pages, Netlify…) olduğu gibi yüklenebilir; yönlendirme `HashRouter` ile yapıldığı için sunucu ayarı gerekmez.

## GitHub Pages'e yayınlama (ücretsiz hesap)

Ücretsiz GitHub hesabında Pages yalnızca **herkese açık (public)** depolarda çalışır; yani kaynak kod ve logo görseli GitHub'da herkese görünür olur.

1. GitHub'da `emirberg-kimya-lab` adında **public** bir depo oluştur ve projeyi gönder:
   ```bash
   git init
   git add .
   git commit -m "Emirberg Kimya Lab"
   git branch -M main
   git remote add origin https://github.com/<kullanici-adin>/emirberg-kimya-lab.git
   git push -u origin main
   ```
2. Depoda **Settings → Pages → Build and deployment → Source: GitHub Actions** seç.
3. `.github/workflows/deploy.yml` her `main` gönderiminde testleri çalıştırır, derler ve yayınlar. İlk yayın birkaç dakika sürer; adres `https://<kullanici-adin>.github.io/emirberg-kimya-lab/` olur.

**Kendi alan adınla (Cloudflare DNS):**
- (Önerilir) GitHub → profil **Settings → Pages → Add a domain** ile `emrekizilkaya.com`'u doğrula; verdiği TXT kaydını Cloudflare DNS'e ekle. Bu, alan adının başkası tarafından ele geçirilmesini önler.
- Cloudflare DNS'e `CNAME kimya → <kullanici-adin>.github.io` kaydı ekle ve **Proxy status: DNS only** (gri bulut) yap. Turuncu bulut açıkken GitHub HTTPS sertifikasını çıkaramayabilir.
- Depoda **Settings → Pages → Custom domain** alanına `kimya.emrekizilkaya.com` yaz, kaydet; sertifika hazır olunca **Enforce HTTPS** kutusunu işaretle. Actions ile yayınlarken depoya `CNAME` dosyası koymak gerekmez.

GitHub Pages özel HTTP başlığı (`_headers`) desteklemez. Bu yüzden aynı güvenlik kuralı (CSP) derleme sırasında `index.html`'e `<meta>` etiketi olarak da eklenir (`vite.config.ts` → `cspMeta`); site yine hiçbir dış adrese bağlanamaz.

## Cloudflare Pages'e yayınlama

Oyun tamamen statiktir: sunucuda kod çalışmaz, veritabanı yoktur. İlerleme yalnızca oyuncunun tarayıcısındaki `localStorage`'da tutulur ve hiçbir yere gönderilmez. `public/_headers` dosyasındaki CSP, sayfanın başka bir adrese bağlanmasını tarayıcı düzeyinde de engeller.

**İlk kez (bir kerelik):**

```bash
npx wrangler login                                   # tarayıcıda Cloudflare hesabına izin ver
npx wrangler pages project create emirberg-kimya-lab --production-branch main
npm run deploy                                       # derler ve dist/ klasörünü yükler
```

Sonra Cloudflare panelinde: **Workers & Pages → emirberg-kimya-lab → Custom domains → Set up a custom domain** → ör. `kimya.emrekizilkaya.com`. Alan adı zaten Cloudflare'de olduğu için DNS kaydı kendiliğinden eklenir ve HTTPS sertifikası birkaç dakikada hazır olur.

**Sonraki güncellemeler:** yalnızca `npm run deploy`.

Notlar:
- `localStorage` alan adına bağlıdır: yerelde (`Baslat.bat`) yapılan ilerleme siteye kendiliğinden geçmez. Taşımak için Ayarlar → Büyükler Köşesi → dışa aktar / içe aktar.
- Alt alan adını sonradan değiştirirsen eski adresteki ilerleme yeni adreste görünmez; değiştirmeden önce dışa aktar.
- Tamamen iz bırakmamak için Pages projesinde **Web Analytics**'i kapalı bırak (varsayılan olarak kapalıdır).

## Atölyeler

| Kısayol | Atölye | Ne yapılır |
|---|---|---|
| `1` | Periyodik Tablo | 118 element, 6 gözlük, arama (`/`), ok tuşlarıyla gezinme, element kartları |
| `2` | Atom Kurucu | Proton/nötron/elektron sürükle ya da `P` `N` `E` (Shift ile çıkar, `R` sıfırla) |
| `3` | Molekül Atölyesi | "Eller" modeliyle bağ kur; 27 tarif |
| `4` | Tepkime Kazanı | 38 madde, 3 araç (ateş, elektrik, zaman), 45 tepkime |
| `5` | Sıcaklık Odası | −273…6000 °C; hâle göre boyanan tablo ve tanecik kutusu |
| `6` | Keşif Defteri | Yıldızlar, moleküller, tepkimeler, rozetler, yazdırılabilir diploma |

Ayarlar → **Büyükler Köşesi** (düğmeye 3 saniye basılı tut): ilerlemeyi dışa/içe aktar, sıfırla, oyuncu adını değiştir.

## Kod yapısı

```
src/
  app/        Kabuk: yönlendirme, yan menü, üst çubuk, ölçekleme
  features/   Atölyeler (periodic-table, atom-builder, molecule-workshop,
              reaction-cauldron, temperature-room, notebook, quests,
              onboarding, mascot, settings)
  domain/     SAF oyun kuralları (React'siz, birim testli)
  data/       Bildirimsel içerik (elementler, moleküller, tepkimeler, görevler, rozetler)
  state/      Zustand deposu ve localStorage kalıcılığı
  audio/      Web Audio ile sentezlenen ses efektleri
  ui/         Ortak bileşenler (modal, sürükle-bırak, tur, kutlama)
  i18n/tr.ts  Bütün arayüz metinleri
```

Temel kural: oyun kuralları `domain/` altında saf fonksiyonlardır; içerik `data/` altında bildirimsel veridir. Atölyeler ilerlemeyi doğrudan değiştirmez, `emit()` ile olay yayınlar; `domain/progress.ts` olayı işler, yıldız/görev/rozet/unvanları hesaplar.

## İçerik ekleme rehberi

Bileşen koduna dokunmadan yeni içerik eklenebilir. Her eklemeden sonra `npm test` çalıştır; veri bütünlüğü testleri hatalı kimlikleri, çakışan anahtarları ve ulaşılamayan görevleri yakalar.

**Yeni molekül** — `src/data/molecules.ts` içindeki `MOLECULES` dizisine bir `recipe({...})` ekle. `structure` alanına atomları ve bağları yaz (`[atomIndeksi, atomIndeksi, bağDerecesi]`). Formül anahtarı ve atom sayıları yapıdan otomatik üretilir. Testler, her atomun el sayısının bağ dereceleri toplamına eşit olduğunu ve molekülün tanındığını doğrular. Yalnızca paletteki atomlar (`PALETTE`) kullanılabilir.

**Yeni madde** — `src/data/substances.ts` içinde `SUBSTANCES` dizisine `sub(...)` ekle. `elements` alanı, tepkime keşfinde hangi elementlerin 3. yıldızı alacağını belirler.

**Yeni tepkime** — `src/data/reactions.ts` içindeki `REACTIONS` dizisine bir kayıt ekle. `inputs` (1–2 madde kimliği, sırasız) + isteğe bağlı `tool` benzersiz olmalıdır. `effects` alanında `EffectType` listesindeki yapı taşlarından birini ya da birkaçını kullan; yeni animasyon yazmak gerekmez.

**Yeni görev** — `src/data/quests.ts` içinde `q(...)` ile ekle. Koşullar `src/domain/types.ts` içindeki `Condition` türleriyle bildirimsel yazılır (`all` / `any` ile birleştirilebilir). `link`, "Beni oraya götür" düğmesinin açacağı yoldur (ör. `/atom?hedef=8`, `/sicaklik?z=26`, `/molekul?tarif=h2o`).

**Yeni rozet** — `src/data/badges.ts` içinde `BADGES` dizisine ekle.

**Puan ve unvan eşikleri** — `src/data/config.ts`.

**Arayüz metinleri** — `src/i18n/tr.ts`. Mol'ün balon metinleri en çok 2 cümle, ~140 karakter olmalı.

## Derin bağlantılar

`#/tablo?z=6` (kart açık) · `#/atom?hedef=6` (hedef modu) · `#/molekul?tarif=h2o` (atomlar tezgâhta) · `#/sicaklik?z=31` (element sabit) · `#/defter?sekme=tepkimeler&id=r05`

Lisans ve kaynaklar: [CREDITS.md](CREDITS.md). Uygulama sırasında alınan kararlar ve doğrulanması önerilen noktalar: [NOTLAR.md](NOTLAR.md).
