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
            name: "🟦 Yavaş Köprüler",
            description: "Yavaş hareket eden platformlarla rahat parkur",
            platforms: [
                // Başlangıç
                { x: 100, y: gameHeight - 150, w: 180, h: 24 },
                // İlk hareketli platform (yavaş ve geniş)
                { x: 350, y: gameHeight - 220, w: 160, h: 24, type: 'moving', axis: 'x', range: 60, speed: 0.6, phase: 0 },
                // Dinlenme platformu
                { x: 600, y: gameHeight - 300, w: 150, h: 24 },
                // İkinci hareketli platform (daha yavaş)
                { x: 820, y: gameHeight - 380, w: 160, h: 24, type: 'moving', axis: 'x', range: 50, speed: 0.5, phase: Math.PI },
                // Son basamaklar
                { x: 1040, y: gameHeight - 480, w: 140, h: 24 },
                { x: Math.max(gameWidth - 200, 980), y: gameHeight - 580, w: 180, h: 24 }
            ],
            hazards: []
        },
        7: {
            name: "🟩 Yumuşak Asansörler",
            description: "Yavaş dikey hareketli platformlar",
            platforms: [
                { x: 100, y: gameHeight - 160, w: 180, h: 24 },
                // Yavaş dikey asansör (büyük platform)
                { x: 340, y: gameHeight - 280, w: 160, h: 24, type: 'moving', axis: 'y', range: 100, speed: 0.7, phase: 0 },
                // Sabit ara platform
                { x: 580, y: gameHeight - 360, w: 150, h: 24 },
                // İkinci yavaş asansör
                { x: 800, y: gameHeight - 440, w: 160, h: 24, type: 'moving', axis: 'y', range: 80, speed: 0.6, phase: Math.PI / 2 },
                // Final
                { x: 1040, y: gameHeight - 540, w: 140, h: 24 },
                { x: Math.max(gameWidth - 200, 980), y: gameHeight - 600, w: 180, h: 24 }
            ],
            hazards: []
        },
        8: {
            name: "🟥 Kolay Yol",
            description: "Geniş platformlar ve az engel",
            platforms: [
                { x: 120, y: gameHeight - 150, w: 180, h: 24 },
                { x: 360, y: gameHeight - 230, w: 160, h: 24 },
                // Tek hareketli platform (çok yavaş)
                { x: 600, y: gameHeight - 310, w: 180, h: 24, type: 'moving', axis: 'x', range: 40, speed: 0.4, phase: 0 },
                { x: 840, y: gameHeight - 390, w: 160, h: 24 },
                { x: 1060, y: gameHeight - 490, w: 150, h: 24 },
                { x: Math.max(gameWidth - 200, 980), y: gameHeight - 590, w: 180, h: 24 }
            ],
            hazards: []
        },
        9: {
            name: "🟨 Zıpla ve Çık",
            description: "Zıplama pedleri ve geniş platformlar",
            platforms: [
                { x: 100, y: gameHeight - 160, w: 180, h: 24 },
                // Zıplama pedi (düşük güç)
                { x: 340, y: gameHeight - 240, w: 160, h: 24, type: 'bounce', bounceMultiplier: 1.15 },
                // Sabit platformlar
                { x: 580, y: gameHeight - 320, w: 150, h: 24 },
                // İkinci zıplama pedi
                { x: 800, y: gameHeight - 400, w: 160, h: 24, type: 'bounce', bounceMultiplier: 1.2 },
                { x: 1020, y: gameHeight - 500, w: 150, h: 24 },
                { x: Math.max(gameWidth - 200, 980), y: gameHeight - 600, w: 180, h: 24 }
            ],
            hazards: []
        },
        10: {
            name: "🟪 Karışık Parkur",
            description: "Tüm özellikler ama kolay tempo",
            platforms: [
                { x: 110, y: gameHeight - 160, w: 180, h: 24 },
                // Yavaş hareketli
                { x: 350, y: gameHeight - 240, w: 160, h: 24, type: 'moving', axis: 'x', range: 50, speed: 0.5, phase: 0 },
                // Sabit platform
                { x: 590, y: gameHeight - 320, w: 150, h: 24 },
                // Yavaş dikey asansör
                { x: 810, y: gameHeight - 400, w: 150, h: 24, type: 'moving', axis: 'y', range: 60, speed: 0.6, phase: Math.PI / 3 },
                // Zıplama pedi
                { x: 1000, y: gameHeight - 490, w: 140, h: 24, type: 'bounce', bounceMultiplier: 1.15 },
                // Final
                { x: Math.max(gameWidth - 200, 980), y: gameHeight - 600, w: 180, h: 24 }
            ],
            hazards: []
        },
        11: {
            name: "❄️ Buz Pateni",
            description: "Buzlu platformlarda kayarak dengede kal",
            platforms: [
                { x: 100, y: gameHeight - 150, w: 180, h: 24 },
                // Buzlu platformlar (düşük sürtünme - kayar)
                { x: 340, y: gameHeight - 220, w: 160, h: 24, type: 'ice', friction: 0.95 },
                { x: 580, y: gameHeight - 300, w: 140, h: 24, type: 'ice', friction: 0.96 },
                // Normal dinlenme
                { x: 780, y: gameHeight - 380, w: 130, h: 24 },
                // Uzun buz yolu
                { x: 920, y: gameHeight - 460, w: 200, h: 24, type: 'ice', friction: 0.97 },
                { x: 1100, y: gameHeight - 540, w: 140, h: 24 },
                { x: Math.max(gameWidth - 200, 980), y: gameHeight - 600, w: 180, h: 24 }
            ],
            hazards: [
                { x: 500, y: gameHeight - 50, w: 120, h: 10, type: 'lava' }
            ]
        },
        12: {
            name: "⚡ Hız Tüneli",
            description: "Hız artırıcı platformlarla uç",
            platforms: [
                { x: 110, y: gameHeight - 160, w: 180, h: 24 },
                // Hız artırıcı platform (x yönünde boost)
                { x: 350, y: gameHeight - 240, w: 140, h: 24, type: 'speed', speedBoost: 1.8, direction: 'right' },
                { x: 620, y: gameHeight - 320, w: 150, h: 24 },
                // Dikey hız artırıcı (yukarı fırlatır)
                { x: 830, y: gameHeight - 400, w: 140, h: 24, type: 'speed', speedBoost: 2.0, direction: 'up' },
                { x: 1000, y: gameHeight - 520, w: 130, h: 24 },
                { x: Math.max(gameWidth - 200, 980), y: gameHeight - 600, w: 180, h: 24 }
            ],
            hazards: [
                { x: 700, y: gameHeight - 350, w: 6, h: 200, type: 'laser' }
            ]
        },
        13: {
            name: "🌙 Ay Yürüyüşü",
            description: "Düşük yerçekiminde yavaş hareket et",
            platforms: [
                { x: 100, y: gameHeight - 150, w: 180, h: 24 },
                { x: 340, y: gameHeight - 240, w: 150, h: 24, type: 'moving', axis: 'x', range: 60, speed: 0.7, phase: 0 },
                // Düşük yerçekimi bölgesi (tüm alan etkilenir)
                { x: 540, y: gameHeight - 340, w: 200, h: 24, type: 'gravity', gravityMultiplier: 0.4 },
                { x: 800, y: gameHeight - 440, w: 140, h: 24, type: 'gravity', gravityMultiplier: 0.45 },
                { x: 1000, y: gameHeight - 520, w: 130, h: 24 },
                { x: Math.max(gameWidth - 200, 980), y: gameHeight - 600, w: 180, h: 24 }
            ],
            hazards: [
                { x: 650, y: gameHeight - 60, w: 80, h: 10, type: 'lava' }
            ]
        },
        14: {
            name: "🌪️ Fırtına Vadisi",
            description: "Rüzgar seni itecek, dikkatli ol",
            platforms: [
                { x: 100, y: gameHeight - 150, w: 180, h: 24 },
                // Sağa iten rüzgar platformu
                { x: 340, y: gameHeight - 230, w: 140, h: 24, type: 'wind', windForce: 300, windDirection: 'right' },
                { x: 580, y: gameHeight - 310, w: 130, h: 24 },
                // Sola iten rüzgar
                { x: 780, y: gameHeight - 390, w: 140, h: 24, type: 'wind', windForce: 250, windDirection: 'left' },
                // Yukarı iten rüzgar (uçurur)
                { x: 960, y: gameHeight - 470, w: 130, h: 24, type: 'wind', windForce: 200, windDirection: 'up' },
                { x: 1100, y: gameHeight - 550, w: 130, h: 24 },
                { x: Math.max(gameWidth - 200, 980), y: gameHeight - 600, w: 180, h: 24 }
            ],
            hazards: [
                { x: 450, y: gameHeight - 50, w: 100, h: 10, type: 'lava' },
                { x: 850, y: gameHeight - 420, w: 6, h: 180, type: 'laser' }
            ]
        },
        15: {
            name: "🎡 Döner Dünyanın Sonu",
            description: "Dönen platformlarda son imtihan",
            platforms: [
                { x: 110, y: gameHeight - 160, w: 180, h: 24 },
                // Dönen platform (saat yönünde)
                { x: 360, y: gameHeight - 250, w: 140, h: 24, type: 'rotate', rotateSpeed: 0.8, rotateRadius: 80, phase: 0 },
                // Buz + hız kombinasyonu
                { x: 620, y: gameHeight - 340, w: 150, h: 24, type: 'ice', friction: 0.95 },
                // Ters dönen platform
                { x: 840, y: gameHeight - 430, w: 130, h: 24, type: 'rotate', rotateSpeed: -1.0, rotateRadius: 70, phase: Math.PI },
                // Düşük yerçekimi + rüzgar
                { x: 1020, y: gameHeight - 520, w: 140, h: 24, type: 'gravity', gravityMultiplier: 0.5 },
                { x: Math.max(gameWidth - 200, 980), y: gameHeight - 600, w: 180, h: 24 }
            ],
            hazards: [
                { x: 400, y: gameHeight - 50, w: 600, h: 10, type: 'lava' },
                { x: 750, y: gameHeight - 370, w: 6, h: 180, type: 'laser' },
                { x: 950, y: gameHeight - 460, w: 40, h: 40, type: 'spike' }
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
