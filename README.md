# Spor Takip

Kişisel, mobil öncelikli antrenman takip uygulaması. Vite + React + TypeScript + Tailwind CSS.
Backend yok, veriler tarayıcıda (localStorage) tutulur. PWA'dır: ana ekrana eklenir ve internetsiz çalışır (videolar hariç).

## Komutlar

```bash
npm install        # ilk kurulum
npm run dev        # geliştirme sunucusu (http://localhost:5173, aynı Wi-Fi'deki telefondan da açılır)
npm run build      # tip kontrolü + üretim derlemesi → dist/
npm run preview    # dist/ klasörünü yerelde sunar
npm run icons      # public/ içindeki ikonları yeniden üretir
```

## Programı düzenlemek

Tüm antrenman programı `src/data/program.ts` içinde. Dosyanın başında alanların açıklaması var.
Önemli: kayıtlı geçmişi olan bir hareketin `id`'sini değiştirme, eski kayıtlar o id'ye bağlı.
Güvenlik kuralları `src/data/rules.ts` içinde.

## Klasör yapısı

```
src/
  data/        program.ts (antrenman programı), rules.ts (kurallar)
  lib/         storage (localStorage + yedek doğrulama), youtube, stats, format, feedback (titreşim/ses)
  store/       AppDataContext: tüm durum ve aksiyonlar, her değişiklikte otomatik kayıt
  hooks/       useHashRoute, useRestTimer, useNow, useWakeLock
  components/  Layout, WorkoutCard, ExerciseCard, SetRow, VideoModal, RestTimerBar, RulesModal, ProgressChart
  pages/       Home, Workout, History, SessionDetail, Progress, Settings
```

## Yayınlama (ücretsiz)

Yönlendirme hash tabanlı (`#/gecmis` gibi) olduğu için hiçbir sunucu ayarı gerekmez.

### Seçenek 1: Netlify Drop (en kolayı, hesap + sürükle-bırak)

1. `npm run build`
2. https://app.netlify.com/drop adresini aç, giriş yap / ücretsiz hesap aç.
3. Proje içindeki `dist` klasörünü sayfaya sürükle. Birkaç saniyede `https://xxx.netlify.app` adresi verilir.
4. Site ayarlarından (Site configuration → Change site name) adı `spor-takip-adin` gibi değiştirebilirsin.
5. Güncellemek için: tekrar `npm run build`, sonra sitenin **Deploys** sekmesine yeni `dist` klasörünü sürükle.

### Seçenek 2: Vercel + GitHub (her `git push`'ta otomatik yayın)

1. GitHub'da boş bir depo aç, sonra projede:
   ```bash
   git init
   git add .
   git commit -m "ilk sürüm"
   git branch -M main
   git remote add origin https://github.com/KULLANICI/spor-takip.git
   git push -u origin main
   ```
2. https://vercel.com → GitHub ile giriş → **Add New… → Project** → depoyu seç.
3. Framework "Vite" olarak otomatik algılanır (Build: `npm run build`, Output: `dist`). **Deploy**.
4. Sonraki her `git push` otomatik olarak yayına çıkar.

### Seçenek 3: Sadece GitHub (GitHub Pages)

Adres: `https://KULLANICI.github.io/DEPO-ADI/`. Alt yol derleme sırasında depo adından otomatik bulunur
(`vite.config.ts`), yayını `.github/workflows/deploy.yml` yapar.

1. GitHub'da **Public** bir depo aç (ücretsiz planda Pages yalnızca herkese açık depolarda çalışır;
   kodun görünür olur ama antrenman verilerin görünmez, onlar telefonunda durur).
2. **Add file → Upload files** ile proje klasörünün içeriğini sürükle; `node_modules` ve `dist` **hariç**.
   `.github` klasörünün de yüklendiğinden emin ol. → **Commit changes**
3. **Settings → Pages → Build and deployment → Source: GitHub Actions**
4. **Actions** sekmesinde iş yeşil tik alınca site yayında (1-2 dk).
5. Güncellemek için değişen dosyaları aynı şekilde yükle; her yüklemede otomatik yeniden yayınlanır.

## Telefona kurmak

**Android (Chrome):** Site adresini aç → sağ üstteki ⋮ menüsü → **Uygulamayı yükle** (veya **Ana ekrana ekle**) → Yükle.

**iPhone (Safari):** Site adresini Safari'de aç → alttaki **Paylaş** (kare + ok) → **Ana Ekrana Ekle** → Ekle.

Ana ekrandaki ikondan açınca adres çubuğu olmadan tam ekran açılır. Bir kez açıldıktan sonra internetsiz de çalışır.

## Verilerin güvenliği

- Veriler yalnızca o cihazdaki o tarayıcıda durur. iPhone'da ana ekran uygulamasının verisi Safari'den **ayrıdır**:
  hep ana ekrandaki ikondan aç.
- Site adresi değişirse (ör. Netlify'dan Vercel'e geçiş) veriler yeni adrese taşınmaz:
  eski adreste **Ayarlar → JSON olarak dışa aktar**, yenisinde **JSON içe aktar**.
- Düzenli olarak dışa aktarıp yedeği Drive / iCloud'a koy.
