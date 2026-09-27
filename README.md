# Ay Atlası ✦

Tarot ve astroloji için Türkçe, tarayıcıda çalışan bir web uygulaması. Görsel çerçevesi kullanıcının Piksel Defter projesindeki manzara temalarından uyarlanmıştır. Planlayıcı özellikleri bu uygulamada yer almaz.

## Canlı site

https://ssuheyyo.github.io/ay-atlasi/

Siteyi misafir olarak kullanmak için GitHub hesabı, giriş veya bilgisayarınızda açık bir sunucu gerekmez. GitHub Pages üzerinde yayımlanır.

## Bölümler

- Tarot: Gerçek 1909 Rider–Waite–Smith destesinin 78 kart görseli, soru alanı, animasyonlu karıştırma, karmayı durdurma, üç kart seçme ve çevirme.
- Klasik okuma: Kartlar açılınca Türkçe düz kart anlamları gösterilir.
- Yorumcu masası: Kart resimleri ve adları görünür, hazır anlamlar gizlidir.
- Kart Atlası: 78 özgün kartı arama, gruba göre süzme ve ayrıntılı inceleme.
- Günün kartı: Her gün bir kart seçme; kullanıcı adıyla kişisel karşılama.
- Gökyüzü: Seçilen gündeki Güneş, Ay ve gezegen konumları, Ay evresi, güncel açılar, geri hareketler ve doğum haritası varsa yakın transitler.
- Ay takvimi: Yaklaşık Ay evresi, aydınlanma oranı ve Ay burcuyla 30 günlük görünüm.
- Doğum haritası: Tarih, yerel saat, doğum yeri, koordinatlar ve saat dilimiyle gezegenler, yükselen, MC, 12 tam burç evi ve başlıca açılar.
- Astro hesaplar: Güneş, Ay, yükselen, Merkür, Venüs, Mars, Jüpiter, Satürn, MC ve doğum Ay evresi.
- Uyum haritası: İki kişinin seçili gezegenleri arasındaki ana açılar.
- Okumalar: Tarot açılımlarını kişisel notlarla tarayıcıda saklama; JSON yedek alma ve geri yükleme.
- Görünüm: Üç renk paleti, animasyon ve yıldız yoğunluğu ayarları.
- Hesap: E-posta ve şifreyle kayıt, e-posta doğrulaması, giriş, şifre sıfırlama ve doğrulanmış hesaplar için cihazlar arası kayıt eşitleme. Gmail hesabında doğrulama iletisi ulaşmazsa aynı Google hesabını mevcut hesaba bağlama seçeneği bulunur.

## Veri ve hesaplama

Astronomik konumlar tarayıcıda Astronomy Engine ile hesaplanır. Tropikal zodyak ve tam burç ev sistemi kullanılır. Doğum yeri araması Open-Meteo geocoding servisini kullanır; konumu elle girme seçeneği vardır. Astrolojik ve tarot yorumları keşif amaçlıdır.

Misafir kayıtları yalnızca açılan tarayıcının localStorage alanında tutulur. E-posta adresi doğrulanmış hesapların kayıtları Firebase Cloud Firestore'da kullanıcı kimliğine ayrılmış belgelerde saklanır ve kullanılan cihazda ayrıca yerel önbelleği bulunur. Misafir kayıtları kullanıcı açıkça “hesabıma aktar” demedikçe buluta gönderilmez. Şifreler uygulama kayıtlarında veya GitHub deposunda saklanmaz. Tarayıcı verilerini silmeden önce Ayarlar bölümünden yedek almak yine önerilir.

Hesapların çalışması için Firebase Authentication'da e-posta/şifre yöntemi, Cloud Firestore ve `firestore.rules` dosyasındaki güvenlik kuralları etkin olmalıdır. Google ile bağlama seçeneği için Authentication'da Google yöntemi ayrıca açılmalıdır. GitHub Pages alan adı Firebase Authentication yetkili alan adlarına eklenmelidir. `firebase-config.js` içindeki web yapılandırması Firebase projesinin halka açık istemci kimliğidir; veri erişimi güvenlik kurallarıyla sınırlandırılır.

## Görsel kaynaklar

Kart resimleri Pamela Colman Smith'in Arthur Edward Waite yönlendirmesiyle çizdiği, 1909'da yayımlanan özgün Rider–Waite–Smith destesinin taramalarıdır. Dosyalar [TarotCards açık koleksiyonunun 720px dizininden](https://github.com/mixvlad/TarotCards/tree/main/tarot/rider-waite/720px) alınmıştır. Koleksiyonun [kaynak metaverisi](https://github.com/mixvlad/TarotCards/blob/main/tarot/rider-waite/metadata.json) bu taramaları kamu malı olarak tanımlar. Modern yeniden renklendirilmiş sürümler kullanılmamıştır.

Piksel manzara görselleri kullanıcının Piksel Defter projesinden alınmıştır. Astronomy Engine: Don Cross, MIT lisansı; metin ASTRONOMY-LICENSE.txt dosyasındadır.

Cinzel Decorative ve DM Sans yazı tipleri SIL Open Font License kapsamındadır; lisans metinleri `fonts/` dizinindedir.

## Yerel önizleme

Bu klasörde Python ile statik bir sunucu açın: python -m http.server 8765

Ardından http://127.0.0.1:8765/ adresini açın.
