// download-characters.js - Otomatik karakter PNG indirme scripti

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Unsplash API konfigürasyonu
const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // Buraya kendi API key'inizi koyun
const CHARACTERS_DIR = path.join(__dirname, 'public', 'assets', 'characters');

// Karakter isimleri ve arama anahtar kelimeleri
const CHARACTER_KEYWORDS = {
    // Türk ünlüleri
    'arda-guler': 'arda guler footballer portrait',
    'kerem-akturkoglu': 'kerem akturkoglu footballer portrait',
    'burak-yilmaz': 'burak yilmaz footballer portrait',
    'cenk-tosun': 'cenk tosun footballer portrait',
    'arda-turan': 'arda turan footballer portrait',
    'mesut-ozil': 'mesut ozil footballer portrait',
    'cristiano-ronaldo': 'cristiano ronaldo footballer portrait',
    'lionel-messi': 'lionel messi footballer portrait',
    'neymar': 'neymar footballer portrait',
    'kylian-mbappe': 'kylian mbappe footballer portrait',
    'erling-haaland': 'erling haaland footballer portrait',
    'mohamed-salah': 'mohamed salah footballer portrait',
    'kevin-de-bruyne': 'kevin de bruyne footballer portrait',
    'bruno-fernandes': 'bruno fernandes footballer portrait',
    'harry-kane': 'harry kane footballer portrait',
    'son-heung-min': 'son heung min footballer portrait',
    'ataturk': 'mustafa kemal ataturk portrait',
    'erdogan': 'recep tayyip erdogan portrait',
    'kilincdaroglu': 'kemal kilicdaroglu portrait',
    'bahceli': 'devlet bahceli portrait',

    // Çeşitli karakterler
    'mutlu-yuz': 'happy face cartoon character',
    'robot': 'robot cartoon character',
    'kedi': 'cat cartoon character',
    'unicorn': 'unicorn cartoon character',
    'hayalet': 'ghost cartoon character',
    'buyucu': 'wizard cartoon character',
    'superkahraman': 'superhero cartoon character',
    'astronot': 'astronaut cartoon character',
    'asci': 'chef cartoon character',
    'doktor': 'doctor cartoon character',
    'ressam': 'artist painter cartoon character',
    'muzisyen': 'musician cartoon character',
    'futbolcu': 'footballer cartoon character',
    'basketbolcu': 'basketball player cartoon character',
    'gamer': 'gamer cartoon character',
    'tilki': 'fox cartoon character',
    'kurt': 'wolf cartoon character',
    'aslan': 'lion cartoon character',
    'panda': 'panda cartoon character',
    'kelebek': 'butterfly cartoon character',
    'yunus': 'dolphin cartoon character',
    'baykus': 'owl cartoon character',
    'unicorn2': 'unicorn cartoon character',
    'alien': 'alien cartoon character',
    'palyaco': 'clown cartoon character',
    'cadi': 'witch cartoon character',
    'zombi': 'zombie cartoon character',
    'denizkizi': 'mermaid cartoon character',
    'peri': 'fairy cartoon character',
    'melek': 'angel cartoon character',
    'kafatasi': 'skull cartoon character'
};

/**
 * Unsplash'tan resim indir
 */
async function downloadImage(url, filepath) {
    try {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(filepath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`❌ Resim indirme hatası: ${filepath}`, error.message);
        throw error;
    }
}

/**
 * Unsplash API ile resim ara ve indir
 */
async function searchAndDownloadCharacter(characterName, keywords) {
    const filepath = path.join(CHARACTERS_DIR, `${characterName}.png`);

    // Eğer dosya zaten varsa atla
    if (fs.existsSync(filepath)) {
        console.log(`⏭️  ${characterName}.png zaten mevcut, atlanıyor`);
        return;
    }

    try {
        console.log(`🔍 ${characterName} için resim aranıyor: ${keywords}`);

        // Unsplash API ile arama
        const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keywords)}&per_page=1&orientation=portrait`;
        const response = await axios.get(searchUrl, {
            headers: {
                'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
        });

        if (response.data.results.length === 0) {
            console.log(`❌ ${characterName} için resim bulunamadı`);
            return;
        }

        const imageUrl = response.data.results[0].urls.regular;
        console.log(`📥 ${characterName}.png indiriliyor...`);

        await downloadImage(imageUrl, filepath);
        console.log(`✅ ${characterName}.png başarıyla indirildi`);

        // Kısa bekleme Unsplash rate limit için
        await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
        console.error(`❌ ${characterName} indirme hatası:`, error.message);
    }
}

/**
 * Basit placeholder karakter oluştur (fallback)
 */
function createPlaceholderCharacter(characterName) {
    const filepath = path.join(CHARACTERS_DIR, `${characterName}.png`);

    if (fs.existsSync(filepath)) {
        return;
    }

    // Basit SVG placeholder oluştur
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const svg = `<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="25" fill="${randomColor}" stroke="#333" stroke-width="2"/>
        <circle cx="22" cy="25" r="3" fill="#333"/>
        <circle cx="38" cy="25" r="3" fill="#333"/>
        <path d="M 20 40 Q 30 45 40 40" stroke="#333" stroke-width="2" fill="none"/>
    </svg>`;

    // SVG'yi base64'e dönüştür ve basit PNG olarak kaydet
    const base64Data = Buffer.from(svg).toString('base64');
    const dataUrl = `data:image/svg+xml;base64,${base64Data}`;

    console.log(`🎨 ${characterName}.png için placeholder oluşturuluyor...`);
    // Not: Gerçek PNG dönüştürme için sharp veya benzeri kütüphane gerekli
    // Şimdilik basit text dosyası oluştur
    fs.writeFileSync(filepath.replace('.png', '.svg'), svg);
    console.log(`✅ ${characterName}.svg placeholder oluşturuldu`);
}

/**
 * Ana indirme fonksiyonu
 */
async function downloadAllCharacters() {
    console.log('🚀 Karakter PNG indirme işlemi başlatılıyor...\n');

    // Characters klasörünü oluştur
    if (!fs.existsSync(CHARACTERS_DIR)) {
        fs.mkdirSync(CHARACTERS_DIR, { recursive: true });
    }

    const characterNames = Object.keys(CHARACTER_KEYWORDS);
    console.log(`📋 Toplam ${characterNames.length} karakter işlenecek\n`);

    for (const characterName of characterNames) {
        const keywords = CHARACTER_KEYWORDS[characterName];

        try {
            if (UNSPLASH_ACCESS_KEY && UNSPLASH_ACCESS_KEY !== 'YOUR_UNSPLASH_ACCESS_KEY') {
                await searchAndDownloadCharacter(characterName, keywords);
            } else {
                console.log('⚠️  Unsplash API key bulunamadı, placeholder kullanılıyor');
                createPlaceholderCharacter(characterName);
            }
        } catch (error) {
            console.log(`⚠️  ${characterName} için hata, placeholder kullanılıyor`);
            createPlaceholderCharacter(characterName);
        }

        // Rate limiting için bekleme
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n🎉 Karakter indirme işlemi tamamlandı!');
    console.log(`📁 Dosyalar kaydedildi: ${CHARACTERS_DIR}`);
}

/**
 * Sadece eksik karakterleri indir
 */
async function downloadMissingCharacters() {
    console.log('🔍 Eksik karakterler kontrol ediliyor...\n');

    const missingCharacters = [];

    for (const characterName of Object.keys(CHARACTER_KEYWORDS)) {
        const filepath = path.join(CHARACTERS_DIR, `${characterName}.png`);
        if (!fs.existsSync(filepath)) {
            missingCharacters.push(characterName);
        }
    }

    if (missingCharacters.length === 0) {
        console.log('✅ Tüm karakterler mevcut!');
        return;
    }

    console.log(`📋 ${missingCharacters.length} eksik karakter bulundu:`);
    missingCharacters.forEach(name => console.log(`  - ${name}`));
    console.log('');

    // Eksik karakterleri indir
    for (const characterName of missingCharacters) {
        const keywords = CHARACTER_KEYWORDS[characterName];

        try {
            if (UNSPLASH_ACCESS_KEY && UNSPLASH_ACCESS_KEY !== 'YOUR_UNSPLASH_ACCESS_KEY') {
                await searchAndDownloadCharacter(characterName, keywords);
            } else {
                createPlaceholderCharacter(characterName);
            }
        } catch (error) {
            createPlaceholderCharacter(characterName);
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n✅ Eksik karakterler tamamlandı!');
}

// Script çalıştırma
const args = process.argv.slice(2);
const command = args[0] || 'all';

switch (command) {
    case 'all':
        downloadAllCharacters();
        break;
    case 'missing':
        downloadMissingCharacters();
        break;
    default:
        console.log('Kullanım:');
        console.log('  node download-characters.js all     - Tüm karakterleri indir');
        console.log('  node download-characters.js missing - Sadece eksik karakterleri indir');
        break;
}

export { downloadAllCharacters, downloadMissingCharacters };
