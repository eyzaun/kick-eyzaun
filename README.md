# 🎮 Eyzaun Multi-User Avatar Chat System

> **Her kullanıcının kendi avatarını kontrol ettiği interaktif chat sistemi**

[![Firebase](https://img.shields.io/badge/Firebase-Hosting-orange)](https://firebase.google.com/)
[![Kick.com](https://img.shields.io/badge/Platform-Kick.com-green)](https://kick.com/eyzaun)
[![Version](https://img.shields.io/badge/Version-3.0.0-blue)](https://github.com/eyzaun/kick-multi-avatar)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## 🚀 Özellikler

### ⭐ Ana Özellikler
- **Multi-User Avatar System**: Her kullanıcının kendi avatarı
- **Real-Time Chat Integration**: Kick.com WebSocket API
- **Individual User Control**: Her kullanıcı sadece kendi avatarını kontrol eder
- **🎮 Parkour Game**: Çok oyunculu parkur oyunu sistemi
- **50+ Visual Effects**: Patlama, yıldırım, kar, ateş ve daha fazlası
- **Advanced Animations**: Dans, zıplama, döndürme animasyonları
- **OBS Ready**: 1920x1080 overlay desteği
- **Debug Tools**: Kapsamlı debugging araçları
- **Performance Monitoring**: Real-time performans takibi

### � Parkour Game System

#### Oyun Özellikleri
- **Multi-Player Support**: Birden fazla oyuncu aynı anda oynayabilir
- **Dynamic Screen Division**: Oyuncu sayısına göre ekran bölünür
- **Real-Time Controls**: Chat komutları ile oyun kontrolü
- **Physics Engine**: Gerçekçi yerçekimi ve çarpışma sistemi
- **Obstacle Generation**: Rastgele engeller ve coin'ler
- **Score System**: Puan kazanma ve leaderboard
- **Game States**: Başlatma, oynama, bitirme durumları

#### Oyun Mekaniği
- **Hareket**: !sol, !sag, !yukari komutları ile kontrol
- **Zıplama**: !yukari komutu ile zıplama
- **Engeller**: Çarpışmadan kaçınma
- **Coin'ler**: Puan toplama
- **Çoklu Oyuncu**: Her oyuncu kendi alanında oynar

#### Oyun Komutları
```
!oyun     - Oyunu başlat (moderatör)
!ben      - Oyuna katıl
!kapat    - Oyunu kapat (moderatör)
!sol      - Sola hareket
!sag      - Sağa hareket
!yukari   - Zıpla
```

## 📁 Proje Yapısı
```
!sağ     - Sağa git
!sol     - Sola git  
!yukarı  - Yukarı git
!aşağı   - Aşağı git
```

#### 💃 Animasyon Komutları
```
!dans      - Dans et
!zıpla     - Zıpla
!döndür    - Dön
!karakter  - Avatar değiştir
```

#### 🎬 Temel Efektler
```
!patlama   - Mega patlama
!yıldırım  - Şimşek çakması
!kar       - Kar yağışı
!ateş      - Ateş çemberi
!konfeti   - Konfeti patlaması
!kalp      - Kalp yağmuru
!rainbow   - Gökkuşağı
!shake     - Ekran sarsıntısı
```

#### ⚡ Gelişmiş Efektler
```
!lazer     - Lazer gösterisi
!meteor    - Meteor yağmuru
!matrix    - Matrix efekti
!portal    - Portal açma
!galaksi   - Galaksi döndürme
!tsunami   - Tsunami dalgası
```

#### 🎵 Ses Efektleri
```
!bas       - Bass drop
!davul     - Davul çalma
!gitar     - Gitar riffi
!synth     - Synthesizer
```

#### � Oyun Komutları
```
!oyun     - Parkur oyununu başlat
!ben      - Oyuna katıl
!kapat    - Oyunu kapat
!sol      - Oyunda sola hareket
!sag      - Oyunda sağa hareket
!yukari   - Oyunda zıpla
```

## 📁 Proje Yapısı

```
kick-eyzaun/
├── public/
│   ├── index.html                    # Ana sayfa
│   ├── debug.html                    # Debug aracı
│   ├── css/
│   │   ├── main.css                  # Temel stiller
│   │   ├── animations.css            # Animasyonlar
│   │   ├── components.css            # Bileşen stilleri
│   │   └── particles.css             # Parçacık efektleri
│   ├── js/
│   │   ├── main.js                   # Ana uygulama
│   │   ├── api/
│   │   │   └── KickWebSocketAPI.js   # WebSocket API
│   │   ├── classes/
│   │   │   ├── UserAvatar.js         # Kullanıcı avatar sınıfı
│   │   │   ├── AvatarManager.js      # Avatar yöneticisi
│   │   │   └── GameManager.js        # 🎮 Parkur oyun yöneticisi
│   │   ├── effects/
│   │   │   ├── VisualEffects.js      # Görsel efektler
│   │   │   ├── ParticleSystem.js     # Parçacık sistemi
│   │   │   └── SoundEffects.js       # Ses efektleri
│   │   ├── utils/
│   │   │   ├── Config.js             # Konfigürasyon
│   │   │   ├── Utils.js              # Yardımcı fonksiyonlar
│   │   │   └── EventEmitter.js       # Event sistemi
│   │   ├── components/
│   │   │   ├── UI.js                 # Kullanıcı arayüzü
│   │   │   ├── Stats.js              # İstatistikler
│   │   │   └── LoadingScreen.js      # Yükleme ekranı
│   │   └── debug/
│   │       └── DebugTool.js          # Debug araçları
│   └── sounds/                       # Ses dosyaları (opsiyonel)
├── firebase.json                     # Firebase konfigürasyonu
├── package.json                      # NPM paketi
└── README.md                         # Bu dosya
```

## 🛠️ Kurulum

### Ön Gereksinimler
- Node.js 16.0.0+
- Firebase CLI
- Modern web browser

### Adım Adım Kurulum

1. **Projeyi klonla**
```bash
git clone https://github.com/eyzaun/kick-multi-avatar.git
cd kick-multi-avatar
```

2. **Firebase CLI kur**
```bash
npm install -g firebase-tools
```

3. **Firebase'e giriş yap**
```bash
firebase login
```

4. **Firebase projesini başlat**
```bash
firebase init hosting
```
- Public directory: `public`
- Single-page app: `Yes`
- Automatic builds: `No`

5. **Local test**
```bash
npm run dev
# veya
firebase serve --only hosting
```

6. **Production deploy**
```bash
npm run deploy
# veya
firebase deploy --only hosting
```

## 🎥 OBS Kurulumu

### Browser Source Ayarları
```
URL: https://kick-eyzaun.web.app?channel=eyzaun
Width: 1920
Height: 1080
FPS: 30
Custom CSS: (boş bırak)
```

### Önerilen OBS Ayarları
- **Kaynak Türü**: Browser Source
- **Görünürlük**: Her zaman görünür
- **Etkileşim**: Devre dışı
- **Ses**: Sistem sesini kullan
- **Yenileme**: Otomatik

## ⚙️ Konfigürasyon

### Kanal Değiştirme
URL parametresi ile kanal değiştirme:
```
https://kick-eyzaun.web.app?channel=KANAL_ADI
```

### Config Dosyası (js/utils/Config.js)
```javascript
export const CONFIG = {
    KICK: {
        DEFAULT_CHANNEL: 'eyzaun',
        PUSHER_APP_KEY: '32cbd69e4b950bf97679',
        PUSHER_CLUSTER: 'us2'
    },
    AVATAR: {
        SIZE: 60,
        MOVE_DISTANCE: 80,
        EMOJIS: ['🎮', '🦸', '🤖', '👽', ...]
    },
    EFFECTS: {
        COOLDOWNS: {
            MOVEMENT: 1000,
            ANIMATION: 2000,
            BASIC_EFFECT: 3000
        }
    }
};
```

## 🔧 Debug Araçları

### Klavye Kısayolları
- `Ctrl+Shift+D` - Debug paneli aç/kapat
- `Ctrl+Shift+S` - İstatistikleri console'a yazdır
- `Ctrl+Shift+R` - Bağlantıyı yenile
- `Ctrl+Shift+H` - UI'yi gizle/göster

### Debug Panel
- **Console Tab**: Log mesajları
- **Network Tab**: WebSocket durumu
- **Performance Tab**: Sistem performansı
- **Avatars Tab**: Avatar sistemi
- **Effects Tab**: Efekt sistemi

### Console Komutları
```javascript
// Debug paneli
debug.show()
debug.hide()

// İstatistikler
debug.report()

// Avatar verilerini dışa aktar
debug.dump()
```

## 📊 API Referansı

### Kick WebSocket API
- **Endpoint**: `wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679`
- **Protocol**: Pusher Protocol v7
- **Events**: `App\\Events\\ChatMessageEvent`

### Avatar Sınıfı
```javascript
const avatar = new UserAvatar(userId, username, userType);

// Hareket
await avatar.moveRight();
await avatar.moveLeft();
await avatar.moveUp();
await avatar.moveDown();

// Animasyonlar
await avatar.dance();
await avatar.jump();
await avatar.spin();
await avatar.changeAvatar();
```

### Efekt Sistemi
```javascript
const effects = new VisualEffects();

// Temel efektler
await effects.createExplosion();
await effects.createLightning();
await effects.createSnow();

// Gelişmiş efektler
await effects.createMatrix();
await effects.createPortal();
await effects.createGalaxy();
```

## 🚀 Performance

### Optimize Edilmiş Özellikler
- **Efficient DOM Manipulation**: Virtual DOM patterns
- **Smart Cleanup**: Inactive user removal
- **Memory Management**: Garbage collection optimization
- **Frame Rate Control**: 60 FPS target
- **WebSocket Optimization**: Connection pooling

### Performance Metrics
- **Memory Usage**: ~50-100MB normal kullanımda
- **FPS**: 60 FPS target, 30+ FPS minimum
- **Network**: ~1-5KB/s WebSocket traffic
- **CPU**: %5-15 normal kullanımda

## 🔒 Güvenlik

### Güvenlik Önlemleri
- **Rate Limiting**: Komut spam koruması
- **Input Validation**: Tüm girdi doğrulaması
- **XSS Protection**: Content Security Policy
- **CORS**: Uygun CORS ayarları

### Özel Güvenlik
- Kullanıcılar sadece kendi avatarını kontrol edebilir
- Global efektlerin cooldown koruması
- WebSocket message validation

## 📈 Analytics

### Takip Edilen Metrikler
- Toplam mesaj sayısı
- Komut kullanım oranları
- Aktif kullanıcı sayısı
- Efekt kullanım istatistikleri
- Performance metrics

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit yapın (`git commit -m 'Add some AmazingFeature'`)
4. Push yapın (`git push origin feature/AmazingFeature`)
5. Pull Request açın

### Geliştirme Ortamı
```bash
# Development server
npm run dev

# Production build
npm run build

# Deploy
npm run deploy
```

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim

- **Kanal**: [kick.com/eyzaun](https://kick.com/eyzaun)
- **Website**: [kick-eyzaun.web.app](https://kick-eyzaun.web.app)
- **Email**: support@eyzaun.com
- **Discord**: [Discord Sunucusu](https://discord.gg/eyzaun)

## 🙏 Teşekkürler

- **Kick.com** - Platform desteği
- **Firebase** - Hosting hizmeti
- **Web Audio API** - Ses efektleri
- **WebSocket API** - Real-time communication
- **Community** - Feedback ve test

## 📋 Changelog

### v3.0.0 (Current)
- ✅ Multi-user avatar system
- ✅ Individual user control
- ✅ 🎮 Parkour game system with multi-player support
- ✅ Screen division for multiple players
- ✅ Real-time game controls via chat commands
- ✅ 50+ effects and animations
- ✅ Advanced debug tools
- ✅ Performance monitoring
- ✅ Modular architecture

### v2.0.0
- ✅ Basic avatar system
- ✅ Chat integration
- ✅ Simple effects

### v1.0.0
- ✅ Initial release
- ✅ Basic chat overlay

---

**🎮 Developed with ❤️ for the Eyzaun Community**