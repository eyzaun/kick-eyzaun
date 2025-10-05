// add-your-own-photos.js - Kendi fotoğraflarınızı ekleme rehberi

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHARACTERS_DIR = path.join(__dirname, 'public', 'assets', 'characters');

/**
 * Mevcut karakter listesini göster
 */
function showCharacterList() {
    console.log('📋 MEVCUT KARAKTER LİSTESİ:');
    console.log('='.repeat(50));

    const characters = [
        // Türk ünlüleri
        'arda-guler.png', 'kerem-akturkoglu.png', 'burak-yilmaz.png', 'cenk-tosun.png',
        'arda-turan.png', 'mesut-ozil.png', 'cristiano-ronaldo.png', 'lionel-messi.png',
        'neymar.png', 'kylian-mbappe.png', 'erling-haaland.png', 'mohamed-salah.png',
        'kevin-de-bruyne.png', 'bruno-fernandes.png', 'harry-kane.png', 'son-heung-min.png',
        'ataturk.png', 'erdogan.png', 'kilincdaroglu.png', 'bahceli.png',

        // Çeşitli karakterler
        'mutlu-yuz.png', 'robot.png', 'kedi.png', 'unicorn.png', 'hayalet.png',
        'buyucu.png', 'superkahraman.png', 'astronot.png', 'asci.png', 'doktor.png',
        'ressam.png', 'muzisyen.png', 'futbolcu.png', 'basketbolcu.png', 'gamer.png',
        'tilki.png', 'kurt.png', 'aslan.png', 'panda.png', 'kelebek.png',
        'yunus.png', 'baykus.png', 'unicorn2.png', 'alien.png', 'palyaco.png',
        'cadi.png', 'zombi.png', 'denizkizi.png', 'peri.png', 'melek.png', 'kafatasi.png'
    ];

    characters.forEach((character, index) => {
        const num = (index + 1).toString().padStart(2, '0');
        console.log(`${num}. ${character}`);
    });

    console.log('');
    console.log('📁 Fotoğrafları buraya koyun:', CHARACTERS_DIR);
}

/**
 * Eksik fotoğrafları kontrol et
 */
function checkMissingPhotos() {
    console.log('🔍 EKSİK FOTOĞRAF KONTROLÜ:');
    console.log('='.repeat(50));

    if (!fs.existsSync(CHARACTERS_DIR)) {
        console.log('❌ Characters klasörü bulunamadı!');
        return;
    }

    const existingFiles = fs.readdirSync(CHARACTERS_DIR);
    const existingPngs = existingFiles.filter(file => file.endsWith('.png'));

    const requiredCharacters = [
        'arda-guler', 'kerem-akturkoglu', 'burak-yilmaz', 'cenk-tosun', 'arda-turan',
        'mesut-ozil', 'cristiano-ronaldo', 'lionel-messi', 'neymar', 'kylian-mbappe',
        'erling-haaland', 'mohamed-salah', 'kevin-de-bruyne', 'bruno-fernandes',
        'harry-kane', 'son-heung-min', 'ataturk', 'erdogan', 'kilincdaroglu', 'bahceli',
        'mutlu-yuz', 'robot', 'kedi', 'unicorn', 'hayalet', 'buyucu', 'superkahraman',
        'astronot', 'asci', 'doktor', 'ressam', 'muzisyen', 'futbolcu', 'basketbolcu',
        'gamer', 'tilki', 'kurt', 'aslan', 'panda', 'kelebek', 'yunus', 'baykus',
        'unicorn2', 'alien', 'palyaco', 'cadi', 'zombi', 'denizkizi', 'peri',
        'melek', 'kafatasi'
    ];

    const missingCharacters = requiredCharacters.filter(characterName =>
        !existingPngs.includes(`${characterName}.png`)
    );

    if (missingCharacters.length === 0) {
        console.log('✅ Tüm karakter fotoğrafları mevcut!');
        return;
    }

    console.log(`❌ ${missingCharacters.length} adet eksik fotoğraf:`);
    console.log('');

    missingCharacters.forEach((character, index) => {
        const num = (index + 1).toString().padStart(2, '0');
        console.log(`${num}. ${character}.png - EKSİK`);
    });

    console.log('');
    console.log('💡 İpucu: Bu fotoğrafları characters klasörüne ekleyin');
}

/**
 * Fotoğraf ekleme rehberi göster
 */
function showPhotoGuide() {
    console.log('📸 KENDİ FOTOĞRAFLARINIZI EKLEME REHBERİ:');
    console.log('='.repeat(60));
    console.log('');
    console.log('1️⃣ FOTOĞRAF HAZIRLAMA:');
    console.log('   • 60x60 piksel boyutunda PNG formatı');
    console.log('   • Şeffaf arka plan (mümkünse)');
    console.log('   • Yüksek kaliteli, net görüntüler');
    console.log('');
    console.log('2️⃣ DOSYA İSİMLERİ:');
    console.log('   • Kesinlikle Config.js\'teki isimlerle aynı olmalı');
    console.log('   • Örnek: arda-guler.png, lionel-messi.png');
    console.log('');
    console.log('3️⃣ YERLEŞTİRME:');
    console.log(`   📁 Klasör: ${CHARACTERS_DIR}`);
    console.log('   📂 Tüm PNG dosyalarını bu klasöre koyun');
    console.log('');
    console.log('4️⃣ TEST ETME:');
    console.log('   • Sistemi yeniden başlatın');
    console.log('   • !arda, !messi gibi komutları test edin');
    console.log('   • !karakter ile rastgele geçişi test edin');
    console.log('');
    console.log('5️⃣ ÖRNEK KOMUTLAR:');
    console.log('   • !arda - Arda Güler\'e geç');
    console.log('   • !messi - Messi\'ye geç');
    console.log('   • !kedi - Kedi karakterine geç');
    console.log('   • !unicorn - Unicorn\'a geç');
    console.log('');
    console.log('🔄 DEĞIŞIKLIKLERDEN SONRA:');
    console.log('   • firebase deploy --only hosting');
    console.log('   • Sistemi yeniden deploy edin');
    console.log('');
}

// Script çalıştırma
const args = process.argv.slice(2);
const command = args[0] || 'guide';

switch (command) {
    case 'list':
        showCharacterList();
        break;
    case 'check':
        checkMissingPhotos();
        break;
    case 'guide':
        showPhotoGuide();
        break;
    case 'all':
        showPhotoGuide();
        console.log('');
        showCharacterList();
        console.log('');
        checkMissingPhotos();
        break;
    default:
        console.log('Kullanım:');
        console.log('  node add-your-own-photos.js guide  - Fotoğraf ekleme rehberi');
        console.log('  node add-your-own-photos.js list   - Tüm karakter listesi');
        console.log('  node add-your-own-photos.js check  - Eksik fotoğrafları kontrol et');
        console.log('  node add-your-own-photos.js all    - Tüm bilgileri göster');
        break;
}

export { showCharacterList, checkMissingPhotos, showPhotoGuide };
