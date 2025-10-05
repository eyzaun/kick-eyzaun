// create-placeholders.js - Hızlı placeholder karakter oluşturma

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHARACTERS_DIR = path.join(__dirname, 'public', 'assets', 'characters');

// Renk paleti
const COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
];

// SVG şablonları
const TEMPLATES = {
    circle: (color) => `<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="25" fill="${color}" stroke="#333" stroke-width="2"/>
        <circle cx="22" cy="25" r="3" fill="#333"/>
        <circle cx="38" cy="25" r="3" fill="#333"/>
        <path d="M 20 40 Q 30 45 40 40" stroke="#333" stroke-width="2" fill="none"/>
    </svg>`,

    square: (color) => `<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="50" height="50" fill="${color}" stroke="#333" stroke-width="2" rx="8"/>
        <circle cx="22" cy="25" r="3" fill="#333"/>
        <circle cx="38" cy="25" r="3" fill="#333"/>
        <path d="M 20 40 Q 30 45 40 40" stroke="#333" stroke-width="2" fill="none"/>
    </svg>`,

    triangle: (color) => `<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
        <polygon points="30,5 55,50 5,50" fill="${color}" stroke="#333" stroke-width="2"/>
        <circle cx="22" cy="25" r="2" fill="#333"/>
        <circle cx="38" cy="25" r="2" fill="#333"/>
        <path d="M 20 40 Q 30 42 40 40" stroke="#333" stroke-width="1.5" fill="none"/>
    </svg>`,

    star: (color) => `<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
        <polygon points="30,5 35,20 50,20 40,30 45,45 30,35 15,45 20,30 10,20 25,20"
                 fill="${color}" stroke="#333" stroke-width="2"/>
    </svg>`
};

/**
 * Rastgele template seç
 */
function getRandomTemplate() {
    const templates = Object.values(TEMPLATES);
    return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Rastgele renk seç
 */
function getRandomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
}

/**
 * Placeholder karakter oluştur
 */
function createPlaceholderCharacter(characterName) {
    const filepath = path.join(CHARACTERS_DIR, `${characterName}.png`);

    // Eğer PNG varsa atla
    if (fs.existsSync(filepath)) {
        console.log(`⏭️  ${characterName}.png zaten mevcut`);
        return;
    }

    // Rastgele renk ve şekil seç
    const color = getRandomColor();
    const template = getRandomTemplate();
    const svg = template(color);

    // SVG olarak kaydet (şimdilik)
    const svgPath = filepath.replace('.png', '.svg');
    fs.writeFileSync(svgPath, svg);

    console.log(`✅ ${characterName}.svg oluşturuldu (${color})`);
}

/**
 * Tüm karakterleri oluştur
 */
function createAllPlaceholders() {
    console.log('🎨 Placeholder karakterler oluşturuluyor...\n');

    // Characters klasörünü oluştur
    if (!fs.existsSync(CHARACTERS_DIR)) {
        fs.mkdirSync(CHARACTERS_DIR, { recursive: true });
    }

    // Config.js'teki karakter listesi
    const characters = [
        // Türk ünlüleri
        'arda-guler', 'kerem-akturkoglu', 'burak-yilmaz', 'cenk-tosun', 'arda-turan',
        'mesut-ozil', 'cristiano-ronaldo', 'lionel-messi', 'neymar', 'kylian-mbappe',
        'erling-haaland', 'mohamed-salah', 'kevin-de-bruyne', 'bruno-fernandes',
        'harry-kane', 'son-heung-min', 'ataturk', 'erdogan', 'kilincdaroglu', 'bahceli',

        // Çeşitli karakterler
        'mutlu-yuz', 'robot', 'kedi', 'unicorn', 'hayalet', 'buyucu', 'superkahraman',
        'astronot', 'asci', 'doktor', 'ressam', 'muzisyen', 'futbolcu', 'basketbolcu',
        'gamer', 'tilki', 'kurt', 'aslan', 'panda', 'kelebek', 'yunus', 'baykus',
        'unicorn2', 'alien', 'palyaco', 'cadi', 'zombi', 'denizkizi', 'peri',
        'melek', 'kafatasi'
    ];

    console.log(`📋 ${characters.length} karakter için placeholder oluşturulacak\n`);

    characters.forEach(characterName => {
        createPlaceholderCharacter(characterName);
    });

    console.log('\n🎉 Tüm placeholder karakterler oluşturuldu!');
    console.log(`📁 Dosyalar kaydedildi: ${CHARACTERS_DIR}`);
    console.log('\n💡 İpucu: Bu SVG dosyalarını PNG\'ye dönüştürmek için online converter kullanabilirsiniz');
}

/**
 * Sadece eksik karakterleri oluştur
 */
function createMissingPlaceholders() {
    console.log('🔍 Eksik karakterler kontrol ediliyor...\n');

    const characters = [
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

    const missingCharacters = characters.filter(characterName => {
        const filepath = path.join(CHARACTERS_DIR, `${characterName}.png`);
        return !fs.existsSync(filepath);
    });

    if (missingCharacters.length === 0) {
        console.log('✅ Tüm karakterler mevcut!');
        return;
    }

    console.log(`📋 ${missingCharacters.length} eksik karakter bulundu:`);
    missingCharacters.forEach(name => console.log(`  - ${name}`));
    console.log('');

    missingCharacters.forEach(characterName => {
        createPlaceholderCharacter(characterName);
    });

    console.log('\n✅ Eksik karakterler tamamlandı!');
}

// Script çalıştırma
const args = process.argv.slice(2);
const command = args[0] || 'all';

switch (command) {
    case 'all':
        createAllPlaceholders();
        break;
    case 'missing':
        createMissingPlaceholders();
        break;
    default:
        console.log('Kullanım:');
        console.log('  node create-placeholders.js all     - Tüm karakterleri oluştur');
        console.log('  node create-placeholders.js missing - Sadece eksik karakterleri oluştur');
        break;
}

export { createAllPlaceholders, createMissingPlaceholders };
