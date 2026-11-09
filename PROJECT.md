# 🦄 Sipicorn — Proje Dokümanı

> *"Every sip makes your unicorn shine."* / *"Her yudum unicorn'unu parlatır."*

Sipicorn, iOS için unicorn temalı, renkli ve eğlenceli bir su takip uygulamasıdır. Piyasadaki onlarca su takip uygulamasından **tasarımı ve karakteriyle** ayrışmayı hedefler.

| | |
|---|---|
| **Çalışma adı** | Sipicorn (değişebilir — App Store'da isim kontrolü yapılacak) |
| **Platform** | iOS 17+ (yalnızca iPhone, dikey) |
| **Dil / UI** | Swift 5.10+ · SwiftUI · SwiftData |
| **Lokalizasyon** | İngilizce (varsayılan) + Türkçe — String Catalog (`Localizable.xcstrings`) |
| **İş modeli** | Faz 1 tamamen ücretsiz. Abonelik, reklam, uygulama içi satın alma yok |
| **Kategori** | Health & Fitness (Kids kategorisi **değil**), yaş derecelendirmesi 4+ |
| **Görünüm** | Yalnızca açık tema (karanlık mod yok — `UIUserInterfaceStyle = Light`) |

---

## 1. Vizyon ve Kitle

**Kitle:** Tatlı, "ponçik", kawaii görselleri seven **yetişkinler ve gençler**. Duolingo, Finch, Bear gibi karakterli, oyunlaştırılmış uygulamaları sevenler. Çocuksu bir estetiği var ama çocuklara yönelik bir ürün değil.

**Ana fikir:** Ekranın ortasında büyük bir unicorn durur. Sen su içtikçe unicorn **alttan yukarıya gökkuşağı renkli bir sıvıyla dolar**. Hedefe ulaşınca parıltı ve konfeti patlar, unicorn sevinir. Hedefine ulaştığın günler **yeni unicorn'lar kazanırsın** ve koleksiyonun büyür.

**Tasarım hedefi:** Apple Design Award seviyesinde zanaat:
- Her etkileşimde akıcı, yaylanan (spring) animasyon
- Anlamlı haptik geri bildirim ve ses
- Dynamic Type, VoiceOver ve Reduce Motion desteği (erişilebilirlik ödül kriterlerinden biri)
- Native iOS hissi: SF Pro Rounded, sistem jestleri, widget'lar

**Ayrıştırıcılar:**
1. Dolan unicorn maskotu (ana ekranın kendisi bir illüstrasyon)
2. Unicorn koleksiyonu (oyunlaştırma)
3. "Gökkuşağı Serisi" (streak)
4. Unicorn dilinde, esprili bildirimler

---

## 2. Tasarım Sistemi — "Cotton Candy Dream"

### 2.1 Stil kararı
**Yumuşak, "şeker/kil" hissi veren 2.5D vektör illüstrasyon.** Düz 2D değil: yumuşak gradyan gölgelendirme, iç parlaklık (highlight) ve hafif dış gölge kullanılır, böylece karakterler "dokunulabilir" görünür. Pastel zemin üzerinde **holografik/iridescent** vurgular yer alır (boynuz, butonlar, ilerleme halkası, kazanım anları).

Neden vektör? Unicorn'ları SwiftUI `Shape` / `Canvas` ile kod olarak çizmek bize şunları sağlar:
- Sıvı seviyesi, renkler ve aksesuarlar **canlı animasyonla** değişebilir (raster görselle yapılamaz)
- Tüm koleksiyon tek bir parametrik karakterden türetilir, böylece **görsel tutarlılık** garanti olur
- Uygulama boyutu küçük kalır ve her ekran çözünürlüğünde net görünür
- Higgsfield kredisi çok az harcanır (bkz. §8)

### 2.2 Renk paleti

| Token | Hex | Kullanım |
|---|---|---|
| `cottonPink` | `#FFB8DE` | Ana vurgu, CTA |
| `lavender` | `#C9B8FF` | İkincil vurgu, kartlar |
| `mint` | `#A6F0D6` | Başarı, hedef tamam |
| `skyBlue` | `#9FD8FF` | Su, sıvı tonları |
| `butter` | `#FFE8A3` | Yıldız, parıltı, seri |
| `peach` | `#FFC7A8` | Uyarı, sıcak vurgu |
| `cream` | `#FFF8FC` | Ana arka plan |
| `plum` | `#3D2357` | Ana metin (WCAG AA kontrastı sağlar) |
| `plumSoft` | `#7A6491` | İkincil metin |

**Gökkuşağı sıvı gradyanı** (alttan üste): `skyBlue → mint → butter → peach → cottonPink → lavender`

**Iridescent gradyan:** `AngularGradient` ile `cottonPink, lavender, skyBlue, mint, butter`. Boynuzda ve ilerleme halkasında yavaşça döner.

### 2.3 Tipografi
- **SF Pro Rounded** (`.fontDesign(.rounded)`), tamamen Dynamic Type uyumlu
- Büyük sayı (içilen miktar): `.system(size: 56, weight: .heavy, design: .rounded)` + `contentTransition(.numericText())`
- Başlıklar `.bold`, gövde metni `.medium`

### 2.4 Şekil ve derinlik
- Köşe yarıçapı: kartlar 28pt, butonlar 22pt, çipler kapsül şeklinde
- "Squishy" butonlar: basınca `scaleEffect(0.94)` + spring, bırakınca hafif zıplama
- Gölge: `plum` rengi, %12 opaklık, y=8, blur=20 (gri değil, renkli gölge)
- Arka plan: krem zemin üzerinde yavaşça süzülen bulanık pastel "bulut" damlaları (MeshGradient, iOS 18'de; iOS 17'de bulanık daireler ile fallback)

### 2.5 Hareket (motion)
- Varsayılan spring: `.spring(response: 0.45, dampingFraction: 0.7)`
- Sıvı yüzeyi: `TimelineView` + sinüs dalgası; ekleme anında dalga genliği artar ve sakinleşir
- Unicorn boşta: göz kırpma, hafif nefes alma (scale 1.0↔1.02), kuyruk sallama
- Hedef tamam: konfeti + yıldız parçacıkları + unicorn zıplaması + `.success` haptik
- **Reduce Motion** açıksa: parçacık ve dalga yok, sadece yumuşak geçişler (crossfade)

### 2.6 Ses ve haptik
- İçecek eklerken: "bloop" sesi + `.impact(.soft)`
- Hedef tamam: kısa parıltılı "ding" + `.notificationOccurred(.success)`
- Yeni unicorn açılınca: arp/harp sesi
- Ayarlardan ses ve haptik ayrı ayrı kapatılabilir; telefonun sessiz moduna uyar (`AVAudioSession.ambient`)

---

## 3. Maskot ve Koleksiyon

### 3.1 Ana maskot — "Sippy"
Tombul, büyük gözlü, yanakları pembe bir unicorn. Gövdesi bir "cam/şeffaf" siluet gibi çizilir, içindeki sıvı seviyesi günlük ilerlemeyi gösterir. Yelesi ve kuyruğu gökkuşağı renklerindedir.

**Ruh halleri** (ilerlemeye ve saate göre):
| Durum | Koşul | İfade |
|---|---|---|
| Uykulu | Gün başı, %0 | Yarı kapalı gözler, "zzz" |
| Susamış | Son içecekten 3+ saat geçti | Dil dışarıda, terli |
| Mutlu | %25–99 | Gülümseme, göz kırpma |
| Coşkulu | %100 | Yıldız gözler, zıplama, parıltı |
| Süper | %120+ | Taç takar 👑 |

### 3.2 Koleksiyon
- Hedefe ulaşılan her gün **bir unicorn yumurtası / kartı** kazanılır; sırayla yeni unicorn'lar açılır
- Toplam **30 unicorn** (Faz 1). Her biri aynı parametrik vücuttan türetilir:
  - `bodyColor`, `maneGradient`, `hornStyle`, `accessory`, `pattern`, `name`, `rarity`
- Örnekler: Bulut 🌥️, Donut 🍩, Uzay 🚀, Çilekli Süt 🍓, Kahve Barista ☕, Yaz Tatili 🏖️, Gece Kuşu 🌙, Kristal 💎, Matcha 🍵, Pamuk Şeker 🍭
- Özel kilometre taşı unicorn'ları: 3, 7, 14, 30 ve 100 günlük seri
- Kazanılan unicorn ana ekranın maskotu olarak seçilebilir
- Kilitli olanlar silüet + "?" olarak görünür

---

## 4. Ekranlar ve Navigasyon

Navigasyon: Özel tasarım **alt tab bar** (3 sekme) + ortada büyük yüzen "+" butonu.

```
[ 📅 Geçmiş ]   [ 🦄 Bugün ]   [ ✨ Koleksiyon ]        ⚙️ (sağ üst)
                     ( + )
```

### 4.1 Onboarding (ilk açılış, 5 adım)
1. **Hoş geldin** — Sippy el sallar, "Hi! I'm Sippy 🦄"
2. **Seni tanıyalım** — Cinsiyet (Kadın / Erkek / Belirtmek istemiyorum), kilo (tekerlek seçici), birim (ml / oz)
3. **Aktivite ve hava** — Düşük / Orta / Yüksek · Serin / Ilıman / Sıcak (büyük ikonlu kartlar)
4. **Hedefin hazır** — Hesaplanan hedef animasyonla sayarak gelir, elle düzenlenebilir
5. **Hatırlatıcılar** — Aralık + uyanma/uyku saatleri → bildirim izni istenir
(İsteğe bağlı: Apple Health bağlantısı adımı)

### 4.2 Bugün (ana ekran)
- Üstte: selamlama + gün adı, sağ üstte seri rozeti 🔥🌈 `7`
- Ortada: büyük, dolan unicorn
- Altında: `1.450 ml` / `2.000 ml hedefin` + yüzde
- **Hızlı ekleme çipleri:** son kullanılan 3 içecek + miktar (tek dokunuşla ekleme)
- Ekleme sonrası alt tarafta "Geri al" toast'ı (5 sn)
- Bugünün içecek listesi (kaydırarak silme, dokunarak düzenleme)

### 4.3 İçecek Ekle (sheet)
- 3 sütunlu, yuvarlak kartlardan oluşan grid; her içecek pastel renkli özel vektör ikon
- Seçince miktar adımı: hazır bardak boyları (150 / 250 / 330 / 500 ml) + kaydırıcı + özel giriş
- "Ekle" → sheet kapanır → unicorn dolma animasyonu

### 4.4 Geçmiş
- Aylık takvim: her gün küçük bir doluluk halkası; hedefe ulaşılan günler gökkuşağı halkalı
- **Seri şeridi:** art arda tamamlanan günler renkli kapsüllerle birleştirilir
- Gün detayı: toplam, hedef %, ilerleme çubuğu, içecek listesi (saat · miktar)
- Haftalık özet grafiği (Swift Charts, 7 günlük çubuklar)
- İstatistik kartları: ortalama, en iyi gün, en uzun seri, toplam litre

### 4.5 Koleksiyon
- 3 sütunlu kart grid; kazanılanlar renkli, kilitliler silüet
- Kart detayı: büyük unicorn, adı, kazanıldığı tarih, kısa esprili açıklama, "Maskot yap" butonu
- Üstte ilerleme: `12 / 30 unicorn`

### 4.6 Ayarlar
- Profil ve hedef (yeniden hesapla / elle düzenle)
- Birim: ml / oz
- Hatırlatıcılar: aralık, uyanma–uyku saatleri, aç/kapa
- Apple Health senkronizasyonu
- Ses / Haptik
- İçecekleri yönet (sırala, gizle)
- Dil: sistem dilini kullanır (iOS ayarlarına yönlendirme)
- Hakkında, gizlilik, uygulamayı puanla

### 4.7 Günün Kartı (paylaşım)
- Günün sonunda / hedef tamamlanınca: "Rainbow Monday!" gibi başlıklı, maskotlu, istatistikli dikey kart
- `ImageRenderer` ile 1080×1920 PNG → `ShareLink` (Instagram Story, WhatsApp vb.)

---

## 5. Özellikler ve İş Kuralları

### 5.1 İçecekler ve hidrasyon katsayıları
Her içeceğin günlük hedefe katkısı katsayıyla çarpılır (ör. 250 ml kahve = 200 ml su sayılır). Arayüzde hem gerçek hacim hem "su değeri" gösterilir.

| İçecek | Katsayı | | İçecek | Katsayı |
|---|---|---|---|---|
| Su | 1.00 | | Süt | 0.90 |
| Maden suyu | 1.00 | | Smoothie | 0.80 |
| Bitki çayı | 1.00 | | Soda / gazlı | 0.85 |
| Çay | 0.90 | | Ayran | 0.90 |
| Kahve | 0.80 | | Limonata | 0.85 |
| Meyve suyu | 0.85 | | Kokteyl (alkolsüz) | 0.80 |
| Spor içeceği | 0.95 | | Çorba | 0.80 |

> **Alkollü içecekler** (bira, şarap, viski): kitle yetişkin olduğu için listede yer alır ancak **katsayı 0'dır** (hedefe sayılmaz) ve küçük bir "hidrate etmez 💧" etiketi taşır. Bunu aynı zamanda bilgilendirici bir özellik olarak sunarız. *(Ayarlardan gizlenebilir.)*

### 5.2 Hedef hesaplama
```
base       = kilo(kg) × 33 ml
activity   = Düşük +0 · Orta +350 · Yüksek +700 ml
weather    = Serin +0 · Ilıman +250 · Sıcak +500 ml
sex        = Erkek +200 ml · diğerleri +0
goal       = round(base + activity + weather + sex, 50 ml'ye)
clamp      = 1.200 – 4.500 ml
```
- Kullanıcı istediği zaman elle değiştirebilir
- Sorumluluk notu: *"Genel bir öneridir, tıbbi tavsiye değildir."*

### 5.3 Hatırlatıcılar
- Aralıklar: 30 dk · 45 dk · 1 sa · 1.5 sa · 2 sa · 3 sa · Kapalı
- Yalnızca uyanma–uyku saatleri arasında planlanır (`UNCalendarNotificationTrigger`, günlük tekrar, 64 bildirim limitine uygun)
- Hedef tamamlandığında günün kalan hatırlatıcıları susturulur
- Bildirim aksiyonları: **"+250 ml ekle"** butonu (uygulamayı açmadan ekleme)
- Unicorn dilinde, dönüşümlü 20+ metin (EN + TR). Örnekler:
  - "Your horn is drying out! 🦄💧" / "Boynuzun kurudu! 🦄💧"
  - "Sippy is thirsty. Are you? 🥺" / "Sippy susadı. Peki ya sen? 🥺"
  - "Rainbows need water to sparkle 🌈" / "Gökkuşağı parlamak için su ister 🌈"

### 5.4 Gökkuşağı Serisi (streak)
- Hedefin ≥ %100'üne ulaşılan her gün seriyi +1 artırır
- Bir gün kaçırılırsa seri sıfırlanır (Faz 2 fikri: haftada 1 "seri koruyucu" 🛡️)
- En uzun seri ayrıca saklanır
- Kilometre taşları (3/7/14/30/100) özel unicorn açar

### 5.5 Apple Health
- `HKQuantityType(.dietaryWater)` **yazma** izni (isteğe bağlı, onboarding veya ayarlardan)
- Health'e kaydedilen değer **su değeri**dir (katsayılı miktar)
- Silme/düzenleme Health'teki örneği de günceller (sample UUID saklanır)

### 5.6 Widget'lar (WidgetKit)
- **Ana ekran (küçük):** mini dolan unicorn + ml + yüzde
- **Ana ekran (orta):** unicorn + ilerleme + 2 hızlı ekleme butonu (iOS 17 interaktif widget, `AppIntent`)
- **Kilit ekranı:** dairesel ilerleme halkası; satır içi "1.4 / 2.0 L"
- Veri paylaşımı: App Group container'daki SwiftData store

### 5.7 Birimler
- Dahili depolama her zaman **ml**; gösterimde ml veya US fl oz (1 oz = 29.5735 ml)
- Bölgeye göre varsayılan: ABD → oz, diğerleri → ml

---

## 6. Teknik Mimari

### 6.1 Yaklaşım
- **SwiftUI + `@Observable`** (Observation framework), MVVM-benzeri hafif yapı
- **SwiftData** ile yerel kalıcılık; hesap, sunucu veya analitik yok (gizlilik etiketi: "Data Not Collected")
- Üçüncü parti bağımlılık **yok** (Faz 1)
- Proje dosyası **XcodeGen** (`project.yml`) ile üretilir → `.xcodeproj` git'e konmaz, birleştirme çakışması olmaz

### 6.2 Klasör yapısı
```
sipicorn/
├── PROJECT.md
├── project.yml                  # XcodeGen tanımı
├── Sipicorn/
│   ├── App/                     # SipicornApp, RootView, AppState
│   ├── DesignSystem/            # Colors, Typography, Gradients, SquishyButton, Card...
│   ├── Mascot/                  # UnicornView (parametrik çizim), LiquidFill, Moods, Particles
│   ├── Features/
│   │   ├── Onboarding/
│   │   ├── Today/
│   │   ├── AddDrink/
│   │   ├── History/
│   │   ├── Collection/
│   │   ├── Settings/
│   │   └── ShareCard/
│   ├── Models/                  # DrinkEntry, UserProfile, UnicornDefinition, DrinkType
│   ├── Services/                # GoalCalculator, StreakService, ReminderService,
│   │                            # HealthService, SoundService, HapticService
│   ├── Resources/
│   │   ├── Assets.xcassets      # App ikonu, renkler, (varsa) Higgsfield görselleri
│   │   ├── Sounds/
│   │   └── Localizable.xcstrings
│   └── Shared/                  # Widget ile paylaşılan kod (model, store)
├── SipicornWidget/              # WidgetKit extension
└── SipicornTests/               # GoalCalculator, Streak, birim dönüşümü testleri
```

### 6.3 Veri modeli (SwiftData)
```swift
@Model final class DrinkEntry {
    var id: UUID
    var date: Date
    var drinkType: String        // DrinkType.rawValue
    var volumeML: Double         // gerçek hacim
    var hydrationML: Double      // katsayılı su değeri
    var healthKitSampleID: UUID?
}

@Model final class UserProfile {
    var sex: String; var weightKG: Double
    var activity: String; var weather: String
    var dailyGoalML: Double; var isGoalCustom: Bool
    var unit: String             // "ml" | "oz"
    var wakeTime: Date; var sleepTime: Date
    var reminderIntervalMin: Int?
    var selectedMascotID: String
    var soundOn: Bool; var hapticsOn: Bool
}

@Model final class DayRecord {   // gün sonu özeti; seri ve takvim için
    var day: Date                // gün başlangıcı
    var goalML: Double           // o günkü hedef (hedef değişse de geçmiş korunur)
    var totalHydrationML: Double
    var unlockedUnicornID: String?
}
```
`DrinkType` ve `UnicornDefinition` kodda sabit enum/struct olarak tutulur (veritabanında değil).

### 6.4 Yetenekler (capabilities)
| Yetenek | Gerekli mi | Not |
|---|---|---|
| App Groups | Widget için | `group.com.<team>.sipicorn` |
| HealthKit | İsteğe bağlı | Yalnızca yazma |
| Push Notifications | **Hayır** | Yalnızca yerel bildirim — sunucu yok |

> **Apple Developer hesabı henüz yok:** Simülatörde her şey çalışır. Ücretsiz "Personal Team" ile kendi iPhone'una da yükleyebilirsin (7 günlük imza), ancak HealthKit gibi bazı yetenekler ücretli hesap gerektirebilir. Bu yüzden Faz 1'de HealthKit ve App Group'u en sona bırakıyoruz. App Store'a göndermeden önce hesap alınacak.

### 6.5 Geliştirme akışı
1. Claude kodu yazar ve GitHub'a (`iskocyalli/sipicornwater`) push'lar
2. Mac'te: `git pull` → `xcodegen` → Xcode'da ▶️ (simülatör: iPhone 16 Pro)
3. Ekran görüntüsü / hata çıktısı Claude'a gönderilir → düzeltme
4. Linux ortamında derleme yapılamadığı için **her faz sonunda Mac'te doğrulama** şart

Mac'te bir kerelik kurulum:
```bash
brew install xcodegen
```

---

## 7. Lokalizasyon
- `Localizable.xcstrings` (String Catalog); kaynak dil **İngilizce**, Türkçe tam çeviri
- Kod içinde metin `String(localized:)` / `Text("key")` ile; sabit string yok
- Sayı ve birim biçimleri `MeasurementFormatter` / `.formatted()` ile yerel ayara göre ("1.450 ml" TR, "1,450 ml" EN)
- Unicorn isimleri her iki dilde ayrı ve esprili yazılır (çeviri değil, uyarlama)
- App Store metinleri ve ekran görüntüleri her iki dilde

---

## 8. Görsel Üretim Planı (Higgsfield)

**Mevcut durum (9 Kasım 2026):** Higgsfield hesabı **ücretsiz plan, 4 kredi**.

**Bütçe sınırı: en fazla 4 kredi** (mevcut bakiye; ek kredi satın alınmadan). Her üretimden önce maliyet kontrol edilir ve kullanıcıya bildirilir.

Bu bakiye bir görsel kütüphanesi için yeterli değil. Bu yüzden strateji:

| Varlık | Kaynak |
|---|---|
| Maskot + 30 unicorn | **SwiftUI vektör çizimi** (parametrik). Animasyon için zaten gerekli |
| İçecek ikonları | SwiftUI vektör (pastel, maskotla aynı stil) |
| Parçacıklar, konfeti, arka plan | SwiftUI `Canvas` / `TimelineView` |
| **Maskot konsept görseli** | **Higgsfield, 1 üretim**: Sippy'nin karakter yönü (moodboard / referans). Vektör çizim buna bakılarak yapılır |
| App ikonu | Önce vektör çizim; kredi kalırsa Higgsfield ile alternatif |
| App Store ekran görüntüleri / tanıtım videosu | Faz 3 — kredi durumuna göre yeniden değerlendirilir |

Kredi biterse ek kredi satın alma kararı tamamen kullanıcıya aittir; uygulama Higgsfield olmadan da eksiksiz tamamlanabilir.

---

## 9. Yol Haritası

### Faz 0 — Kurulum ✅ / ⏳
- [x] Planlama ve `PROJECT.md`
- [x] GitHub reposu (`iskocyalli/sipicornwater`)
- [ ] XcodeGen iskeleti, Mac'te ilk "Hello Sippy" çalıştırma

### Faz 1 — Çekirdek (MVP)
- [ ] Tasarım sistemi (renkler, tipografi, squishy butonlar, kartlar, arka plan)
- [ ] Maskot v1: parametrik unicorn + gökkuşağı sıvı dolumu + dalga animasyonu
- [ ] Veri modeli + SwiftData
- [ ] Onboarding + hedef hesaplama
- [ ] Bugün ekranı + içecek ekleme sheet'i + geri al
- [ ] Ses + haptik
- [ ] EN/TR lokalizasyon altyapısı
- [ ] Birim testleri (hedef, seri, birim dönüşümü)

### Faz 2 — Oyunlaştırma ve Takip
- [ ] Maskot ruh halleri + boşta animasyonları
- [ ] Hedef tamam kutlaması (konfeti, parıltı)
- [ ] Geçmiş: takvim, seri şeridi, gün detayı, haftalık grafik, istatistikler
- [ ] Gökkuşağı Serisi
- [ ] Koleksiyon ekranı + 30 unicorn + açılma animasyonu
- [ ] Hatırlatıcılar (aralık, sessiz saatler, "+250 ml" aksiyonu, esprili metinler)
- [ ] Ayarlar

### Faz 3 — Cila ve Yayın
- [ ] Widget'lar (ana ekran + kilit ekranı, interaktif)
- [ ] Apple Health
- [ ] Günün kartı + paylaşım
- [ ] Erişilebilirlik turu (VoiceOver etiketleri, Dynamic Type, Reduce Motion)
- [ ] App ikonu, launch ekranı
- [ ] App Store: isim kontrolü, ekran görüntüleri (EN/TR), açıklama, gizlilik etiketi
- [ ] Apple Developer hesabı → TestFlight → yayın

### Gelecek fikirler (Faz 4+)
Seri koruyucu · mevsimsel unicorn'lar · Apple Watch · Siri / Kısayollar · iCloud senkronizasyonu · arkadaşlarla meydan okuma · isteğe bağlı premium (özel temalar)

---

## 10. Açık Kararlar
- [ ] Nihai uygulama adı (Sipicorn çalışma adı)
- [ ] Bundle ID (`com.<senin-alan-adın>.sipicorn`)
- [ ] Higgsfield için ek kredi alınacak mı?
