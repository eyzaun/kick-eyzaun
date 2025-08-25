# 🎮 Eyzaun Kick Chat Effects

Eyzaun kanalı için özel tasarlanmış Kick chat komut efekt sistemi. OBS Browser Source ile canlı yayında chat komutlarına görsel efektler ekler.

## 🔗 Demo
[https://kick-eyzaun.web.app?channel=eyzaun](https://kick-eyzaun.web.app?channel=eyzaun)

## 🚀 Özellikler
- Kick chat komutlarına özel animasyon ve efektler
- OBS ile tam uyumlu overlay
- Kolay kurulum ve deploy (Firebase Hosting)
- Komut listesi:  
  `!patlama`, `!yıldırım`, `!kar`, `!ateş`, `!konfeti`, `!kalp`, `!rainbow`, `!shake`, `!dans`, `!zıplama`, `!dönüş`, `!parlak`

## 📦 Proje Yapısı
```
kick-eyzaun/
├── setup.bat
├── firebase.json
├── package.json
├── README.md
├── start-dev.bat
├── deploy.bat
└── public/
    ├── index.html
    └── sounds/
```

## ⚡ Kurulum ve Geliştirme

1. **Proje dosyalarını klonla:**
   ```sh
   git clone https://github.com/eyzaun/kick-eyzaun.git
   cd kick-eyzaun
   ```

2. **Kurulum scriptini çalıştır:**
   - `setup.bat` dosyasını yönetici olarak çalıştır.

3. **Firebase ayarları:**
   - Firebase Console'da yeni bir proje oluştur.
   - `firebase login`
   - `firebase init hosting` (public klasörü: `public`)

4. **Geliştirme sunucusu:**
   ```sh
   npm run dev
   ```
   veya  
   `start-dev.bat` ile başlat.

5. **Deploy:**
   ```sh
   npm run deploy
   ```
   veya  
   `deploy.bat` ile deploy et.

## 🎥 OBS Ayarları
- Browser Source URL: `https://kick-eyzaun.web.app?channel=eyzaun`
- Width: 1920
- Height: 1080
- FPS: 30

## 📝 Katkı ve Lisans
- Katkı sağlamak için PR gönderebilirsin.
- MIT Lisansı.
