@echo off
chcp 65001 > nul
cls
color 0A

echo.
echo ███████████████████████████████████████████████████████
echo █                                                     █
echo █   🎮 EYZAUN KICK CHAT EFFECTS - HIZLI KURULUM      █
echo █                                                     █  
echo █   Kanal: eyzaun                                     █
echo █   Project: kick-eyzaun                              █
echo █   URL: kick-eyzaun.web.app                          █
echo █                                                     █
echo ███████████████████████████████████████████████████████
echo.

echo 🎯 Bu script eyzaun kanalı için özel hazırlandı!
echo.

REM Yönetici kontrolü
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ HATA: Bu script yönetici hakları ile çalıştırılmalı!
    echo.
    echo ✅ Çözüm: 
    echo   1. Bu dosyaya sağ tıklayın
    echo   2. "Yönetici olarak çalıştır" seçin
    echo   3. Scripti yeniden başlatın
    echo.
    pause
    exit /b 1
)

echo ✅ Yönetici hakları onaylandı
echo.

REM Node.js kontrolü
echo 📋 Sistem kontrolleri...
where node >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ Node.js bulunamadı!
    echo.
    echo 📥 Node.js kurulumu gerekli:
    echo   1. https://nodejs.org adresine gidin
    echo   2. LTS sürümünü indirin
    echo   3. Kurulumu tamamlayın
    echo   4. Bu scripti yeniden çalıştırın
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js tespit edildi: 
node --version
echo.

REM Proje klasörü oluştur
echo 📁 kick-eyzaun proje klasörü oluşturuluyor...
if not exist "kick-eyzaun" mkdir kick-eyzaun
cd kick-eyzaun

if not exist "public" mkdir public
if not exist "public\sounds" mkdir public\sounds

echo ✅ Klasör yapısı oluşturuldu
echo.

REM Firebase CLI kur
echo 🔥 Firebase CLI kuruluyor...
call npm install -g firebase-tools
if %errorLevel% neq 0 (
    echo ❌ Firebase CLI kurulumu başarısız!
    pause
    exit /b 1
)
echo ✅ Firebase CLI kuruldu
echo.

echo 📝 Eyzaun proje dosyaları oluşturuluyor...

REM firebase.json
(
echo {
echo   "hosting": {
echo     "public": "public",
echo     "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
echo     "rewrites": [{"source": "**", "destination": "/index.html"}],
echo     "headers": [
echo       {
echo         "source": "**/*",
echo         "headers": [
echo           {"key": "Access-Control-Allow-Origin", "value": "*"},
echo           {"key": "Cache-Control", "value": "max-age=3600"}
echo         ]
echo       }
echo     ]
echo   }
echo }
) > firebase.json

REM package.json  
(
echo {
echo   "name": "kick-eyzaun",
echo   "version": "1.0.0",
echo   "description": "Eyzaun Kick Chat Effects",
echo   "scripts": {
echo     "dev": "firebase serve --only hosting",
echo     "deploy": "firebase deploy --only hosting"
echo   },
echo   "author": "Eyzaun"
echo }
) > package.json

REM README.md
(
echo # 🎮 Eyzaun Kick Chat Effects
echo.
echo ## 🔗 Live URL
echo https://kick-eyzaun.web.app?channel=eyzaun
echo.
echo ## 🎯 Komutlar ^(12 adet^)
echo !patlama !yıldırım !kar !ateş !konfeti !kalp !rainbow !shake !dans !zıplama !dönüş !parlak
echo.
echo ## 🎥 OBS Kurulumu
echo Browser Source URL: https://kick-eyzaun.web.app?channel=eyzaun
echo Width: 1920 ^| Height: 1080 ^| FPS: 30
) > README.md

REM Hızlı başlatma scriptleri
(
echo @echo off
echo echo 🚀 Eyzaun Development Server
echo firebase serve --only hosting
echo pause
) > dev.bat

(
echo @echo off
echo echo 📤 Eyzaun Production Deploy  
echo firebase deploy --only hosting
echo echo.
echo echo ✅ Deploy tamamlandı!
echo echo 🔗 https://kick-eyzaun.web.app?channel=eyzaun
echo pause
) > deploy.bat

echo ✅ Tüm dosyalar oluşturuldu
echo.

echo 🎯 ÖNEMLİ: public\index.html dosyasını oluşturun!
echo.
echo 📋 SONRAKI ADIMLAR:
echo.
echo 1. ✅ VS Code ile proje klasörünü açın:
echo    💻 code .
echo.
echo 2. ✅ public\index.html dosyasını oluşturun:
echo    📄 Artifact "public/index.html (Eyzaun Özel)" içeriğini kopyalayın
echo.
echo 3. ✅ Firebase'de proje oluşturun:
echo    🔗 https://console.firebase.google.com/
echo    📝 Project name: kick-eyzaun
echo    📝 Project ID: kick-eyzaun
echo.
echo 4. ✅ Firebase komutları:
echo    💻 firebase login
echo    💻 firebase init hosting
echo    📁 Public directory: public
echo    ✅ Single-page app: Yes  
echo    ❌ Automatic builds: No
echo.
echo 5. ✅ Deploy edin:
echo    💻 firebase deploy --only hosting
echo    💻 VEYA deploy.bat çalıştırın
echo.
echo 6. ✅ OBS'te Browser Source ekleyin:
echo    🔗 https://kick-eyzaun.web.app?channel=eyzaun
echo    📐 1920x1080
echo.
echo 🎮 Test komutları: !patlama !yıldırım !dans !konfeti
echo.

REM Klasörü aç
explorer .

echo 📂 Proje klasörü açıldı!
echo.
echo 🎉 EYZAUN CHAT EFFECTS SİSTEMİ HAZIR!
echo.
echo ⭐ Başarılı kurulum için yukarıdaki adımları takip edin.
echo.
pause