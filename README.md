# Ay Atlası ✧

Piksel Defter'in pastel ve piksel manzaralı arayüzünden uyarlanmış, Türkçe tarot, astroloji ve planlayıcı web uygulaması.

## Neler var?

- **Planlayıcı:** Günlük sayfa, haftalık ve aylık takvim, görevler, alışkanlıklar, notlar, odak sayacı, çizim alanı ve üç manzara teması. Kaynak uygulamanın düzeni korunmuştur.
- **Tarot:** 78 kartlık deste; soru alanı; animasyonlu karıştırma; “karmayı durdur”; üç kart seçimi; açılma animasyonu; geçmiş/şimdi/olasılık dizilimi. Klasik modda düz kart anlamları görünür. Yorumcu masasında hazır anlamlar gizlidir. Okumalar deftere kaydedilebilir.
- **Güncel gökyüzü:** Seçilen günün Güneş, Ay ve sekiz gezegen konumu, Ay evresi ve aydınlık yüzdesi; kişisel harita varsa yakın transit açıları.
- **Doğum haritası:** Yerel doğum tarihi, saati, yer koordinatı ve saat dilimiyle hesaplanan Güneş, Ay, gezegenler, yükselen, MC ve 12 tam burç evi. Venüs, yükselen, Ay, Mars, MC ve doğum Ay evresi için hızlı hesaplayıcılar.
- **Yedek:** JSON dışa/içe aktarma; eski Piksel Defter yedeklerindeki planlayıcı verilerini içe alma.

## Yerelde açma

Bu sürüm statik dosyalardan oluşur; kurulum veya uygulama sunucusu gerekmez. Bu klasörde bir statik sunucu açın:

```bash
python -m http.server 8765
```

Ardından `http://127.0.0.1:8765/` adresine gidin. `file://` yerine HTTP kullanılması tarayıcı depolaması ve şehir aramasının tutarlı çalışması için önerilir.

## GitHub Pages ile ücretsiz yayın

1. GitHub'da herkese açık yeni bir depo oluşturun.
2. Bu klasördeki dosyaları **deponun köküne** yükleyin. `index.html`, `app.js`, `mystic.js`, `storage.js`, `style.css`, `astronomy.browser.min.js`, `icon.svg` ve üç `landscape-*.png` dosyasının hepsi gereklidir.
3. Depo **Settings → Pages → Build and deployment** bölümünde **Deploy from a branch**, dal olarak `main`, klasör olarak `/(root)` seçin.
4. GitHub'ın verdiği `https://KULLANICI.github.io/DEPO/` adresini açın.

Statik site için 7/24 çalışan kendi bilgisayarınız gerekmez. GitHub Pages kesintisiz erişim hedefler ama mutlak çalışma garantisi vermez. Sunucu tarafı kayıt, kullanıcı hesabı veya cihazlar arası eşitleme bu ücretsiz statik yapıda yoktur. Veriler **yalnızca açtığınız tarayıcının localStorage alanında** saklanır; tarayıcı verileri temizlenirse yedek alınmamış kayıtlar kaybolur. GitHub deposu kişisel kayıtları tutmaz. Şehir arama kutusuna yazılan yer adı Open-Meteo geocoding API'sine gönderilir; koordinatları elle girerek bu aramayı kullanmayabilirsiniz.

## Astroloji hesaplarının kapsamı

Astronomik gezegen boylamları MIT lisanslı [Astronomy Engine](https://github.com/cosinekitty/astronomy) 2.1.19 ile tarayıcıda hesaplanır. Batı astrolojisi için **tropikal zodyak** ve **tam burç ev sistemi** kullanılır. Yükselen, yerel yıldız zamanından doğu ufkunun ekliptikle kesişimiyle hesaplanır. Yerel doğum saati IANA saat dilimiyle UTC'ye çevrilir. Eski tarihli saat dilimi kayıtları, yaz saati geçişleri ve bilinmeyen doğum saati özellikle yükselen/ev sonuçlarını etkileyebilir. Yorumlar keşif amaçlıdır, astronomik hesapların kendisiyle karıştırılmamalıdır.

## Kaynaklar ve haklar

- Arayüz düzeni ve manzara görselleri kullanıcının Piksel Defter projesinden alınmıştır.
- Astronomy Engine: Don Cross, MIT lisansı; lisans metni `ASTRONOMY-LICENSE.txt` dosyasında.
- Şehir araması: [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api).
