// convert-svg-to-png.js - SVG dosyalarını PNG'ye dönüştürme

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHARACTERS_DIR = path.join(__dirname, 'public', 'assets', 'characters');

/**
 * SVG dosyasını PNG'ye dönüştür
 */
async function convertSvgToPng(svgPath, pngPath) {
    try {
        // SVG içeriğini oku
        const svgBuffer = fs.readFileSync(svgPath);

        // Sharp ile PNG'ye dönüştür
        await sharp(svgBuffer)
            .png()
            .resize(60, 60, {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 0 } // Şeffaf arka plan
            })
            .toFile(pngPath);

        console.log(`✅ ${path.basename(svgPath)} → ${path.basename(pngPath)}`);
        return true;
    } catch (error) {
        console.error(`❌ Dönüştürme hatası ${path.basename(svgPath)}:`, error.message);
        return false;
    }
}

/**
 * Tüm SVG dosyalarını PNG'ye dönüştür
 */
async function convertAllSvgs() {
    console.log('🔄 SVG dosyaları PNG\'ye dönüştürülüyor...\n');

    if (!fs.existsSync(CHARACTERS_DIR)) {
        console.log('❌ Characters klasörü bulunamadı!');
        return;
    }

    // SVG dosyalarını bul
    const files = fs.readdirSync(CHARACTERS_DIR);
    const svgFiles = files.filter(file => file.endsWith('.svg'));

    if (svgFiles.length === 0) {
        console.log('❌ Dönüştürülecek SVG dosyası bulunamadı!');
        return;
    }

    console.log(`📋 ${svgFiles.length} SVG dosyası bulundu\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const svgFile of svgFiles) {
        const svgPath = path.join(CHARACTERS_DIR, svgFile);
        const pngPath = path.join(CHARACTERS_DIR, svgFile.replace('.svg', '.png'));

        const success = await convertSvgToPng(svgPath, pngPath);
        if (success) {
            successCount++;
        } else {
            errorCount++;
        }

        // Küçük bir bekleme
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n🎉 Dönüştürme tamamlandı!`);
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Hatalı: ${errorCount}`);
    console.log(`📁 Dosyalar kaydedildi: ${CHARACTERS_DIR}`);
}

/**
 * Sadece eksik PNG dosyaları için SVG'leri dönüştür
 */
async function convertMissingPngs() {
    console.log('🔍 Eksik PNG dosyaları kontrol ediliyor...\n');

    if (!fs.existsSync(CHARACTERS_DIR)) {
        console.log('❌ Characters klasörü bulunamadı!');
        return;
    }

    const files = fs.readdirSync(CHARACTERS_DIR);
    const svgFiles = files.filter(file => file.endsWith('.svg'));

    const missingPngs = [];

    for (const svgFile of svgFiles) {
        const pngFile = svgFile.replace('.svg', '.png');
        const pngPath = path.join(CHARACTERS_DIR, pngFile);

        if (!fs.existsSync(pngPath)) {
            missingPngs.push(svgFile);
        }
    }

    if (missingPngs.length === 0) {
        console.log('✅ Tüm PNG dosyaları mevcut!');
        return;
    }

    console.log(`📋 ${missingPngs.length} eksik PNG dosyası için dönüştürme yapılacak:`);
    missingPngs.forEach(file => console.log(`  - ${file}`));
    console.log('');

    let successCount = 0;
    let errorCount = 0;

    for (const svgFile of missingPngs) {
        const svgPath = path.join(CHARACTERS_DIR, svgFile);
        const pngPath = path.join(CHARACTERS_DIR, svgFile.replace('.svg', '.png'));

        const success = await convertSvgToPng(svgPath, pngPath);
        if (success) {
            successCount++;
        } else {
            errorCount++;
        }

        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n✅ Eksik PNG'ler tamamlandı!`);
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Hatalı: ${errorCount}`);
}

/**
 * SVG dosyalarını temizle (isteğe bağlı)
 */
function cleanupSvgs() {
    console.log('🧹 SVG dosyaları temizleniyor...\n');

    if (!fs.existsSync(CHARACTERS_DIR)) {
        console.log('❌ Characters klasörü bulunamadı!');
        return;
    }

    const files = fs.readdirSync(CHARACTERS_DIR);
    const svgFiles = files.filter(file => file.endsWith('.svg'));

    let deletedCount = 0;

    for (const svgFile of svgFiles) {
        const svgPath = path.join(CHARACTERS_DIR, svgFile);
        const pngPath = path.join(CHARACTERS_DIR, svgFile.replace('.svg', '.png'));

        // PNG varsa SVG'yi sil
        if (fs.existsSync(pngPath)) {
            fs.unlinkSync(svgPath);
            console.log(`🗑️  ${svgFile} silindi`);
            deletedCount++;
        }
    }

    console.log(`\n✅ ${deletedCount} SVG dosyası temizlendi`);
}

// Script çalıştırma
const args = process.argv.slice(2);
const command = args[0] || 'convert';

switch (command) {
    case 'convert':
        convertAllSvgs();
        break;
    case 'missing':
        convertMissingPngs();
        break;
    case 'cleanup':
        cleanupSvgs();
        break;
    case 'all':
        // Tüm işlemleri sırayla yap
        convertAllSvgs().then(() => {
            console.log('\n🧹 SVG temizliği yapılıyor...');
            cleanupSvgs();
        });
        break;
    default:
        console.log('Kullanım:');
        console.log('  node convert-svg-to-png.js convert  - Tüm SVG\'leri PNG\'ye dönüştür');
        console.log('  node convert-svg-to-png.js missing  - Sadece eksik PNG\'leri dönüştür');
        console.log('  node convert-svg-to-png.js cleanup  - SVG dosyalarını temizle');
        console.log('  node convert-svg-to-png.js all      - Dönüştür ve temizle');
        break;
}

export { convertAllSvgs, convertMissingPngs, cleanupSvgs };
