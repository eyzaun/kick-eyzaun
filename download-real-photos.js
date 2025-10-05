// download-real-photos.js - Gerçekçi fotoğraflar indirme scripti

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Unsplash API konfigürasyonu - BURAYA KENDİ API KEY'İNİZİ YAZIN
const UNSPLASH_ACCESS_KEY = 'GG6N30MSwRizT3Wyvnxz8DNp5URnY6fy1dtdelRj4mw'; // https://unsplash.com/developers adresinden alın
const CHARACTERS_DIR = path.join(__dirname, 'public', 'assets', 'characters');

// Karakter isimleri ve arama anahtar kelimeleri (gerçekçi fotoğraflar için)
const CHARACTER_SEARCH_TERMS = {
    // Türk ünlüleri - gerçek fotoğraflar
    'arda-guler': 'arda guler footballer portrait professional',
    'kerem-akturkoglu': 'kerem akturkoglu footballer portrait professional',
    'burak-yilmaz': 'burak yilmaz footballer portrait professional',
    'cenk-tosun': 'cenk tosun footballer portrait professional',
    'arda-turan': 'arda turan footballer portrait professional',
    'mesut-ozil': 'mesut ozil footballer portrait professional',
    'cristiano-ronaldo': 'cristiano ronaldo footballer portrait professional',
    'lionel-messi': 'lionel messi footballer portrait professional',
    'neymar': 'neymar footballer portrait professional',
    'kylian-mbappe': 'kylian mbappe footballer portrait professional',
    'erling-haaland': 'erling haaland footballer portrait professional',
    'mohamed-salah': 'mohamed salah footballer portrait professional',
    'kevin-de-bruyne': 'kevin de bruyne footballer portrait professional',
    'bruno-fernandes': 'bruno fernandes footballer portrait professional',
    'harry-kane': 'harry kane footballer portrait professional',
    'son-heung-min': 'son heung min footballer portrait professional',
    'ataturk': 'mustafa kemal ataturk historical portrait',
    'erdogan': 'recep tayyip erdogan political portrait',
    'kilincdaroglu': 'kemal kilicdaroglu political portrait',
    'bahceli': 'devlet bahceli political portrait',

    // Çeşitli karakterler - gerçekçi temalar
    'mutlu-yuz': 'happy person portrait smiling face',
    'robot': 'robot technology portrait',
    'kedi': 'cat animal portrait cute',
    'unicorn': 'unicorn mythical creature fantasy',
    'hayalet': 'ghost halloween spooky portrait',
    'buyucu': 'wizard fantasy character portrait',
    'superkahraman': 'superhero comic character portrait',
    'astronot': 'astronaut space suit portrait',
    'asci': 'chef cooking portrait professional',
    'doktor': 'doctor medical portrait professional',
    'ressam': 'artist painting portrait creative',
    'muzisyen': 'musician playing instrument portrait',
    'futbolcu': 'footballer soccer player portrait',
    'basketbolcu': 'basketball player portrait athletic',
    'gamer': 'gamer gaming portrait',
    'tilki': 'fox animal portrait wild',
    'kurt': 'wolf animal portrait wild',
    'aslan': 'lion animal portrait majestic',
    'panda': 'panda animal portrait cute',
    'kelebek': 'butterfly insect portrait nature',
    'yunus': 'dolphin animal portrait ocean',
    'baykus': 'owl bird portrait nature',
    'unicorn2': 'unicorn mythical creature portrait',
    'alien': 'alien sci-fi character portrait',
    'palyaco': 'clown circus character portrait',
    'cadi': 'witch halloween character portrait',
    'zombi': 'zombie horror character portrait',
    'denizkizi': 'mermaid mythical creature portrait',
    'peri': 'fairy mythical creature portrait',
    'melek': 'angel religious character portrait',
    'kafatasi': 'skull death symbol portrait'
};

/**
 * Unsplash'tan resim indir
 */
async function downloadImage(url, filepath) {
    try {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream',
            headers: {
                'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
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
async function searchAndDownloadCharacter(characterName, searchTerms) {
    const filepath = path.join(CHARACTERS_DIR, `${characterName}.png`);

    try {
        console.log(`🔍 ${characterName} için resim aranıyor: "${searchTerms}"`);

        // Unsplash API ile arama
        const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerms)}&per_page=5&orientation=portrait`;
        const response = await axios.get(searchUrl, {
            headers: {
                'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
        });

        if (response.data.results.length === 0) {
            console.log(`❌ ${characterName} için resim bulunamadı`);
            return false;
        }

        // Rastgele bir resim seç
        const randomIndex = Math.floor(Math.random() * Math.min(5, response.data.results.length));
        const imageUrl = response.data.results[randomIndex].urls.regular;

        console.log(`📥 ${characterName}.png indiriliyor...`);
        await downloadImage(imageUrl, filepath);
        console.log(`✅ ${characterName}.png başarıyla indirildi`);

        return true;

    } catch (error) {
        console.error(`❌ ${characterName} indirme hatası:`, error.message);
        return false;
    }
}

/**
 * Belirli karakterler için resim indir
 */
async function downloadSpecificCharacters(characterNames) {
    console.log(`🎯 Belirtilen ${characterNames.length} karakter için gerçek fotoğraflar indiriliyor...\n`);

    if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'BURAYA_UNSPLASH_API_KEY_YAZIN') {
        console.log('❌ Önce Unsplash API key\'inizi ayarlayın!');
        console.log('📝 https://unsplash.com/developers adresinden API key alın');
        console.log('🔧 Bu dosyadaki UNSPLASH_ACCESS_KEY değişkenini güncelleyin\n');
        return;
    }

    // Characters klasörünü oluştur
    if (!fs.existsSync(CHARACTERS_DIR)) {
        fs.mkdirSync(CHARACTERS_DIR, { recursive: true });
    }

    let successCount = 0;
    let errorCount = 0;

    for (const characterName of characterNames) {
        const searchTerms = CHARACTER_SEARCH_TERMS[characterName];

        if (!searchTerms) {
            console.log(`⚠️  ${characterName} için arama terimi bulunamadı`);
            errorCount++;
            continue;
        }

        try {
            const success = await searchAndDownloadCharacter(characterName, searchTerms);
            if (success) {
                successCount++;
            } else {
                errorCount++;
            }
        } catch (error) {
            console.error(`❌ ${characterName} hatası:`, error.message);
            errorCount++;
        }

        // Rate limiting için bekleme (Unsplash API limitleri için)
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log(`\n🎉 İndirme tamamlandı!`);
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Hatalı: ${errorCount}`);
    console.log(`📁 Dosyalar kaydedildi: ${CHARACTERS_DIR}`);
}

/**
 * Tüm karakterler için resim indir
 */
async function downloadAllCharacters() {
    const allCharacters = Object.keys(CHARACTER_SEARCH_TERMS);
    await downloadSpecificCharacters(allCharacters);
}

/**
 * Sadece eksik karakterler için resim indir
 */
async function downloadMissingCharacters() {
    console.log('🔍 Eksik karakterler kontrol ediliyor...\n');

    if (!fs.existsSync(CHARACTERS_DIR)) {
        console.log('❌ Characters klasörü bulunamadı!');
        return;
    }

    const existingFiles = fs.readdirSync(CHARACTERS_DIR);
    const existingPngs = existingFiles.filter(file => file.endsWith('.png')).map(file => file.replace('.png', ''));

    const missingCharacters = Object.keys(CHARACTER_SEARCH_TERMS).filter(characterName =>
        !existingPngs.includes(characterName)
    );

    if (missingCharacters.length === 0) {
        console.log('✅ Tüm karakterlerin fotoğrafları mevcut!');
        return;
    }

    console.log(`📋 ${missingCharacters.length} eksik karakter bulundu:`);
    missingCharacters.forEach(name => console.log(`  - ${name}`));
    console.log('');

    await downloadSpecificCharacters(missingCharacters);
}

/**
 * Belirli kategoriler için resim indir
 */
async function downloadCategoryCharacters(category) {
    const categories = {
        'futbolcular': [
            'arda-guler', 'kerem-akturkoglu', 'burak-yilmaz', 'cenk-tosun', 'arda-turan',
            'mesut-ozil', 'cristiano-ronaldo', 'lionel-messi', 'neymar', 'kylian-mbappe',
            'erling-haaland', 'mohamed-salah', 'kevin-de-bruyne', 'bruno-fernandes',
            'harry-kane', 'son-heung-min'
        ],
        'siyasetciler': ['ataturk', 'erdogan', 'kilincdaroglu', 'bahceli'],
        'hayvanlar': ['kedi', 'tilki', 'kurt', 'aslan', 'panda', 'kelebek', 'yunus', 'baykus'],
        'fantezi': ['unicorn', 'unicorn2', 'hayalet', 'buyucu', 'superkahraman', 'alien', 'palyaco', 'cadi', 'zombi', 'denizkizi', 'peri', 'melek'],
        'meslekler': ['astronot', 'asci', 'doktor', 'ressam', 'muzisyen', 'futbolcu', 'basketbolcu', 'gamer']
    };

    if (!categories[category]) {
        console.log(`❌ Geçersiz kategori: ${category}`);
        console.log(`📋 Geçerli kategoriler: ${Object.keys(categories).join(', ')}`);
        return;
    }

    console.log(`📂 ${category} kategorisi için fotoğraflar indiriliyor...`);
    await downloadSpecificCharacters(categories[category]);
}

// Script çalıştırma
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case 'all':
        downloadAllCharacters();
        break;
    case 'missing':
        downloadMissingCharacters();
        break;
    case 'futbolcular':
    case 'siyasetciler':
    case 'hayvanlar':
    case 'fantezi':
    case 'meslekler':
        downloadCategoryCharacters(command);
        break;
    default:
        console.log('Kullanım:');
        console.log('  node download-real-photos.js all         - Tüm karakterler için gerçek fotoğraflar indir');
        console.log('  node download-real-photos.js missing     - Sadece eksik karakterler için indir');
        console.log('  node download-real-photos.js futbolcular - Sadece futbolcular için indir');
        console.log('  node download-real-photos.js siyasetciler- Sadece siyasetçiler için indir');
        console.log('  node download-real-photos.js hayvanlar   - Sadece hayvanlar için indir');
        console.log('  node download-real-photos.js fantezi     - Sadece fantezi karakterler için indir');
        console.log('  node download-real-photos.js meslekler   - Sadece meslekler için indir');
        console.log('');
        console.log('⚠️  ÖNCE: Bu dosyadaki UNSPLASH_ACCESS_KEY değişkenini kendi API key\'inizle güncelleyin!');
        console.log('🔗 API Key almak için: https://unsplash.com/developers');
        break;
}

export { downloadAllCharacters, downloadMissingCharacters, downloadSpecificCharacters };
