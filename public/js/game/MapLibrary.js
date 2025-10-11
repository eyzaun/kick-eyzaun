export function buildDefaultMaps(gameWidth, gameHeight) {
    const basePlatforms = () => ([
        { x: 150, y: gameHeight - 160, w: 160, h: 24 },
        { x: 360, y: gameHeight - 220, w: 150, h: 24 },
        { x: 580, y: gameHeight - 260, w: 160, h: 24 },
        { x: 800, y: gameHeight - 220, w: 150, h: 24 },
        { x: 1020, y: gameHeight - 180, w: 130, h: 22 },
        { x: 540, y: gameHeight - 360, w: 150, h: 24 },
        { x: 780, y: gameHeight - 400, w: 130, h: 22 },
        { x: 1020, y: gameHeight - 360, w: 120, h: 22 }
    ]);

    return {
        1: {
            name: "🌄 Klasik Parkur",
            description: "Dengeli tırmanış ve erişilebilir bayrak",
            // Yeniden tasarım: Adım adım yükselen, adil boşluklarla ve
            // sağ üstte bayrağa ulaşmayı sağlayan son kısım.
            platforms: [
                // Alt seviye başlangıç adımları
                { x: 100,  y: gameHeight - 140, w: 180, h: 24 },
                { x: 320,  y: gameHeight - 220, w: 160, h: 24 },
                { x: 540,  y: gameHeight - 300, w: 150, h: 24 },
                { x: 760,  y: gameHeight - 380, w: 140, h: 24 },
                { x: 940,  y: gameHeight - 460, w: 140, h: 22 },

                // Üst kısma doğru tırmanış
                { x: 1080, y: gameHeight - 540, w: 130, h: 22 },
                { x: 1120, y: gameHeight - 580, w: 120, h: 22 }, // y ≈ 140

                // Bayrak hizası (y < 100 eşiğine ulaşmayı sağlayan son platform)
                // gameHeight - 620 = 100 -> oyuncu merkezi ~82 ile eşiğin üstüne çıkar
                { x: Math.max(gameWidth - 190, 980), y: gameHeight - 620, w: 160, h: 24 }
            ]
        },
        2: {
            name: "🏔️ Dağlık Yol",
            description: "Dağlık ve zorlu parkur",
            platforms: [
                { x: 130, y: gameHeight - 160, w: 150, h: 24 },
                { x: 310, y: gameHeight - 230, w: 120, h: 22 },
                { x: 470, y: gameHeight - 300, w: 130, h: 24 },
                { x: 640, y: gameHeight - 360, w: 150, h: 24 },
                { x: 820, y: gameHeight - 420, w: 140, h: 24 },
                { x: 990, y: gameHeight - 480, w: 130, h: 24 },
                { x: 1160, y: gameHeight - 520, w: 110, h: 22 },
                { x: 380, y: gameHeight - 420, w: 130, h: 24 },
                { x: 560, y: gameHeight - 500, w: 110, h: 22 },
                { x: 760, y: gameHeight - 560, w: 120, h: 22 },
                { x: 940, y: gameHeight - 600, w: 100, h: 22 }
            ]
        },
        3: {
            name: "🌊 Ada Atlama",
            description: "Ada adaya atlama parkuru",
            platforms: [
                { x: 110, y: gameHeight - 130, w: 120, h: 24 },
                { x: 260, y: gameHeight - 190, w: 90, h: 22 },
                { x: 420, y: gameHeight - 240, w: 110, h: 22 },
                { x: 580, y: gameHeight - 210, w: 120, h: 22 },
                { x: 750, y: gameHeight - 260, w: 110, h: 22 },
                { x: 910, y: gameHeight - 310, w: 100, h: 22 },
                { x: 1070, y: gameHeight - 360, w: 120, h: 22 },
                { x: 1180, y: gameHeight - 410, w: 90, h: 20 },
                { x: 320, y: gameHeight - 350, w: 100, h: 22 },
                { x: 500, y: gameHeight - 420, w: 110, h: 22 },
                { x: 680, y: gameHeight - 470, w: 90, h: 20 },
                { x: 860, y: gameHeight - 520, w: 120, h: 22 }
            ]
        },
        4: {
            name: "🏰 Kale Duvarları",
            description: "Geniş kale duvarları",
            platforms: [
                { x: 160, y: gameHeight - 160, w: 180, h: 28 },
                { x: 380, y: gameHeight - 220, w: 160, h: 26 },
                { x: 600, y: gameHeight - 280, w: 150, h: 24 },
                { x: 820, y: gameHeight - 320, w: 160, h: 26 },
                { x: 1040, y: gameHeight - 260, w: 150, h: 24 },
                { x: 1110, y: gameHeight - 200, w: 140, h: 24 },
                { x: 280, y: gameHeight - 360, w: 140, h: 24 },
                { x: 500, y: gameHeight - 420, w: 160, h: 26 },
                { x: 720, y: gameHeight - 380, w: 130, h: 24 },
                { x: 940, y: gameHeight - 340, w: 150, h: 24 },
                { x: 1160, y: gameHeight - 320, w: 120, h: 22 },
                { x: 360, y: gameHeight - 500, w: 130, h: 22 },
                { x: 580, y: gameHeight - 540, w: 110, h: 22 },
                { x: 820, y: gameHeight - 520, w: 120, h: 22 }
            ]
        },
        5: {
            name: "🌌 Uzay Labirenti",
            description: "Karmaşık uzay labirenti",
            platforms: [
                { x: 140, y: gameHeight - 150, w: 120, h: 22 },
                { x: 320, y: gameHeight - 210, w: 100, h: 20 },
                { x: 500, y: gameHeight - 260, w: 120, h: 22 },
                { x: 680, y: gameHeight - 230, w: 110, h: 22 },
                { x: 860, y: gameHeight - 280, w: 100, h: 20 },
                { x: 1040, y: gameHeight - 240, w: 120, h: 22 },
                { x: 1130, y: gameHeight - 200, w: 120, h: 22 },
                { x: 260, y: gameHeight - 340, w: 110, h: 22 },
                { x: 440, y: gameHeight - 400, w: 90, h: 20 },
                { x: 620, y: gameHeight - 460, w: 110, h: 22 },
                { x: 800, y: gameHeight - 420, w: 100, h: 20 },
                { x: 980, y: gameHeight - 380, w: 110, h: 22 },
                { x: 1160, y: gameHeight - 340, w: 90, h: 20 },
                { x: 360, y: gameHeight - 520, w: 100, h: 20 },
                { x: 540, y: gameHeight - 560, w: 90, h: 20 },
                { x: 720, y: gameHeight - 540, w: 110, h: 22 },
                { x: 900, y: gameHeight - 500, w: 100, h: 20 }
            ]
        },
        6: {
            name: "🟦 Metronom Köprüleri",
            description: "Yatay hareketli platformlarla zamanlama odaklı parkur",
            platforms: [
                // Başlangıç basamakları
                { x: 120, y: gameHeight - 150, w: 160, h: 24 },
                // Yatay hareketli köprüler
                { x: 360, y: gameHeight - 260, w: 140, h: 22, type: 'moving', axis: 'x', range: 80, speed: 1.5, phase: 0 },
                { x: 620, y: gameHeight - 340, w: 140, h: 22, type: 'moving', axis: 'x', range: 100, speed: 1.2, phase: Math.PI / 2 },
                { x: 880, y: gameHeight - 420, w: 140, h: 22, type: 'moving', axis: 'x', range: 120, speed: 1.8, phase: Math.PI },
                // Sabit küçük dinlenme adımı
                { x: 1080, y: gameHeight - 480, w: 110, h: 20 },
                // Hedefe taşıyan son platform
                { x: Math.max(gameWidth - 210, 980), y: gameHeight - 620, w: 180, h: 24 }
            ],
            hazards: [
                // Alt koridor tehlikesi (düşeni cezalandırır)
                { x: 300, y: gameHeight - 40, w: 700, h: 10, type: 'lava' }
            ]
        },
        7: {
            name: "🟩 Asansör Şaftı",
            description: "Dikey asansörler ve kaybolan platformlar",
            platforms: [
                { x: 100, y: gameHeight - 160, w: 160, h: 24 },
                // Dikey asansörler (y ekseninde sinüs hareketi)
                { x: 360, y: gameHeight - 300, w: 140, h: 22, type: 'moving', axis: 'y', range: 140, speed: 1.3, phase: 0 },
                { x: 560, y: gameHeight - 260, w: 130, h: 22, type: 'moving', axis: 'y', range: 160, speed: 1.6, phase: Math.PI / 3 },
                // Kaybolan platformlar (duty cycle %50)
                { x: 760, y: gameHeight - 380, w: 120, h: 20, type: 'toggle', period: 2.2, duty: 0.5, offset: 0 },
                { x: 920, y: gameHeight - 460, w: 120, h: 20, type: 'toggle', period: 2.2, duty: 0.5, offset: 1.1 },
                // Üst siper ve final
                { x: 1080, y: gameHeight - 540, w: 130, h: 22 },
                { x: Math.max(gameWidth - 220, 980), y: gameHeight - 620, w: 170, h: 24 }
            ],
            hazards: [
                { x: 700, y: gameHeight - 50, w: 40, h: 40, type: 'spike' }
            ]
        },
        8: {
            name: "🟥 Lazer Koridoru",
            description: "Lazer tuzakları ve dar geçitler",
            platforms: [
                { x: 120, y: gameHeight - 150, w: 160, h: 24 },
                { x: 340, y: gameHeight - 240, w: 140, h: 22 },
                // Dar geçitte hareketli köprü
                { x: 560, y: gameHeight - 320, w: 120, h: 20, type: 'moving', axis: 'x', range: 90, speed: 2.0, phase: 0 },
                { x: 800, y: gameHeight - 400, w: 120, h: 20 },
                { x: 1000, y: gameHeight - 500, w: 130, h: 22 },
                { x: Math.max(gameWidth - 220, 980), y: gameHeight - 620, w: 170, h: 24 }
            ],
            hazards: [
                // Koridor lazerleri (dikey bariyerler)
                { x: 500, y: gameHeight - 350, w: 6, h: 220, type: 'laser' },
                { x: 740, y: gameHeight - 430, w: 6, h: 220, type: 'laser' },
                // Zemin lavı
                { x: 250, y: gameHeight - 40, w: 900, h: 10, type: 'lava' }
            ]
        },
        9: {
            name: "🟨 Zıplama Fabrikası",
            description: "Zıplama pedleriyle yüksekliğe ulaş",
            platforms: [
                { x: 100, y: gameHeight - 160, w: 160, h: 24 },
                { x: 320, y: gameHeight - 240, w: 140, h: 22, type: 'bounce', bounceMultiplier: 1.2 },
                { x: 520, y: gameHeight - 320, w: 130, h: 22 },
                { x: 700, y: gameHeight - 380, w: 120, h: 20, type: 'bounce', bounceMultiplier: 1.35 },
                { x: 880, y: gameHeight - 460, w: 130, h: 22 },
                { x: 1060, y: gameHeight - 540, w: 130, h: 22 },
                { x: Math.max(gameWidth - 210, 980), y: gameHeight - 620, w: 180, h: 24 }
            ],
            hazards: [
                { x: 600, y: gameHeight - 50, w: 80, h: 10, type: 'lava' }
            ]
        },
        10: {
            name: "🟪 Usta Sınavı",
            description: "Tüm mekaniklerin birleştiği dengeli zorluk",
            platforms: [
                { x: 110, y: gameHeight - 160, w: 160, h: 24 },
                // Hareketli + kaybolan kombinasyon
                { x: 340, y: gameHeight - 240, w: 140, h: 22, type: 'moving', axis: 'x', range: 80, speed: 1.8, phase: 0 },
                { x: 540, y: gameHeight - 300, w: 120, h: 20, type: 'toggle', period: 2.0, duty: 0.55, offset: 0.3 },
                // Dikey asansör
                { x: 720, y: gameHeight - 380, w: 130, h: 22, type: 'moving', axis: 'y', range: 140, speed: 1.5, phase: Math.PI / 4 },
                // Zıplama pedi
                { x: 920, y: gameHeight - 470, w: 120, h: 20, type: 'bounce', bounceMultiplier: 1.4 },
                // Final basamakları
                { x: 1080, y: gameHeight - 540, w: 130, h: 22 },
                { x: Math.max(gameWidth - 220, 980), y: gameHeight - 620, w: 170, h: 24 }
            ],
            hazards: [
                { x: 650, y: gameHeight - 45, w: 300, h: 10, type: 'lava' },
                { x: 860, y: gameHeight - 500, w: 6, h: 180, type: 'laser' }
            ]
        }
    };
}

export function buildFallbackPlatforms(gameHeight) {
    return [
        { x: 150, y: gameHeight - 160, w: 160, h: 24 },
        { x: 360, y: gameHeight - 220, w: 150, h: 24 },
        { x: 580, y: gameHeight - 260, w: 160, h: 24 },
        { x: 800, y: gameHeight - 220, w: 150, h: 24 },
        { x: 1020, y: gameHeight - 180, w: 130, h: 22 },
        { x: 540, y: gameHeight - 360, w: 150, h: 24 },
        { x: 780, y: gameHeight - 400, w: 130, h: 22 },
        { x: 1020, y: gameHeight - 360, w: 120, h: 22 }
    ];
}
