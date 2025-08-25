@echo off
chcp 65001 > nul
cls

echo.
echo ████████████████████████████████████████████████████
echo █                                                  █
echo █    🚀 EYZAUN KICK CHAT EFFECTS - KURULUM         █
echo █                                                  █
echo ████████████████████████████████████████████████████
echo.

REM Yönetici hakları kontrolü
net session >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Yönetici hakları tespit edildi.
) else (
    echo ❌ Bu script yönetici hakları ile çalıştırılmalı!
    echo Sağ tıklayıp "Yönetici olarak çalıştır" seçeneğini kullanın.
    pause
    exit /b 1
)

echo.
echo 📋 Sistem kontrolü yapılıyor...

REM Node.js kontrolü
where node >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Node.js tespit edildi
    node --version
) else (
    echo ❌ Node.js bulunamadı!
    echo https://nodejs.org adresinden Node.js indirip kurun.
    pause
    exit /b 1
)

echo.
echo 🔥 Firebase CLI kuruluyor...
call npm install -g firebase-tools

echo.
echo 📁 kick-eyzaun proje klasörü oluşturuluyor...

REM Ana klasörler
mkdir public 2>nul
mkdir public\sounds 2>nul

echo.
echo 📝 Dosya yapısı oluşturuluyor...

REM firebase.json dosyası oluştur
echo ✅ firebase.json oluşturuluyor...
(
echo {
echo   "hosting": {
echo     "public": "public",
echo     "ignore": [
echo       "firebase.json",
echo       "**/.*",
echo       "**/node_modules/**"
echo     ],
echo     "rewrites": [
echo       {
echo         "source": "**",
echo         "destination": "/index.html"
echo       }
echo     ],
echo     "headers": [
echo       {
echo         "source": "**/*",
echo         "headers": [
echo           {
echo             "key": "Access-Control-Allow-Origin",
echo             "value": "*"
echo           },
echo           {
echo             "key": "Cache-Control",
echo             "value": "max-age=3600"
echo           }
echo         ]
echo       }
echo     ]
echo   }
echo }
) > firebase.json

REM package.json dosyası oluştur
echo ✅ package.json oluşturuluyor...
(
echo {
echo   "name": "kick-eyzaun",
echo   "version": "1.0.0",
echo   "description": "Eyzaun Kick Chat Effects for OBS",
echo   "scripts": {
echo     "dev": "firebase serve --only hosting",
echo     "deploy": "firebase deploy --only hosting"
echo   },
echo   "keywords": ["kick", "eyzaun", "chat", "effects", "obs"],
echo   "author": "Eyzaun"
echo }
) > package.json

REM README.md oluştur
echo ✅ README.md oluşturuluyor...
(
echo # 🎮 Eyzaun Kick Chat Effects
echo.
echo Eyzaun kanalı için özel tasarlanmış chat komut efekt sistemi.
echo.
echo ## 🔗 URL
echo https://kick-eyzaun.web.app?channel=eyzaun
echo.
echo ## 🎯 Komutlar
echo - !patlama - Patlama efekti
echo - !yıldırım - Yıldırım çakması
echo - !kar - Kar yağışı
echo - !ateş - Ateş parçacıkları  
echo - !konfeti - Konfeti şenliği
echo - !kalp - Kalp efekti
echo - !rainbow - Gökkuşağı
echo - !shake - Ekran sarsıntısı
echo - !dans - Dans efekti
echo - !zıplama - Zıplama efekti
echo - !dönüş - Dönüş efekti
echo - !parlak - Parlaklık efekti
echo.
echo ## 🚀 Kullanım
echo 1. npm run dev - Local test
echo 2. npm run deploy - Production deploy
echo.
echo ## 🎥 OBS Kurulumu
echo Browser Source:
echo - URL: https://kick-eyzaun.web.app?channel=eyzaun
echo - Width: 1920
echo - Height: 1080
echo - FPS: 30
) > README.md

REM HTML placeholder dosyası oluştur
echo ✅ HTML placeholder oluşturuluyor...
(
echo ^<!DOCTYPE html^>
echo ^<html^>
echo ^<head^>
echo     ^<title^>Eyzaun Chat Effects^</title^>
echo ^</head^>
echo ^<body^>
echo     ^<h1^>🎮 Eyzaun Kick Chat Effects^</h1^>
echo     ^<p^>HTML dosyasını artifact'tan buraya kopyalayın!^</p^>
echo     ^<p^>Kanal: eyzaun^</p^>
echo ^</body^>
echo ^</html^>
) > public\index.html

REM Başlatma scriptleri oluştur
echo ✅ Yardımcı scriptler oluşturuluyor...
(
echo @echo off
echo echo 🚀 Eyzaun Chat Effects - Development Server
echo echo 🔗 http://localhost:5000?channel=eyzaun
echo echo.
echo firebase serve --only hosting
echo pause
) > start-dev.bat

(
echo @echo off  
echo echo 📤 Eyzaun Chat Effects - Deploy to Production
echo echo 🎯 Target: https://kick-eyzaun.web.app
echo echo.
echo firebase deploy --only hosting
echo echo.
echo echo ✅ Deploy completed!
echo echo 🔗 URL: https://kick-eyzaun.web.app?channel=eyzaun
echo pause
) > deploy.bat

echo.
echo ████████████████████████████████████████████████████
echo █                                                  █
echo █            ✅ KURULUM TAMAMLANDI!                █
echo █                                                  █
echo ████████████████████████████████████████████████████
echo.

echo 📂 Proje klasörü: %CD%
echo 🎯 Kanal: eyzaun
echo 🔗 Firebase ID: kick-eyzaun
echo.

echo 📋 SONRAKI ADIMLAR:
echo.
echo 1. ✅ Firebase Console'da proje oluştur:
echo    🔗 https://console.firebase.google.com/
echo    📝 Proje adı: kick-eyzaun
echo    📝 Project ID: kick-eyzaun
echo.
echo 2. ✅ Firebase login:
echo    💻 firebase login
echo.
echo 3. ✅ Firebase init:
echo    💻 firebase init hosting
echo    📁 Public directory: public
echo    ✅ Single-page app: Yes
echo    ❌ Automatic builds: No
echo.
echo 4. ✅ HTML dosyasını kopyala:
echo    📄 Artifact'tan public\index.html'e kopyala
echo.
echo 5. ✅ Deploy et:
echo    💻 firebase deploy --only hosting
echo.
echo 6. ✅ OBS'te kullan:
echo    🎥 Browser Source URL: https://kick-eyzaun.web.app?channel=eyzaun
echo    📐 Width: 1920, Height: 1080
echo.

echo 🎮 Test komutları:
echo !patlama !yıldırım !kar !ateş !konfeti !kalp !rainbow !shake !dans !zıplama !dönüş !parlak
echo.

REM Explorer ile klasörü aç
echo 📂 Proje klasörü açılıyor...
explorer .

echo.
echo 🎉 Hazır! VS Code ile açmak için: code .
echo.
pause