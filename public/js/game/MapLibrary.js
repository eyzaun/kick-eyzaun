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
            description: "Klasik platform parkuru",
            platforms: [
                { x: 140, y: gameHeight - 140, w: 150, h: 24 },
                { x: 320, y: gameHeight - 200, w: 140, h: 24 },
                { x: 520, y: gameHeight - 250, w: 160, h: 24 },
                { x: 720, y: gameHeight - 220, w: 140, h: 22 },
                { x: 920, y: gameHeight - 180, w: 130, h: 22 },
                { x: 1080, y: gameHeight - 220, w: 120, h: 22 },
                { x: 260, y: gameHeight - 320, w: 130, h: 22 },
                { x: 480, y: gameHeight - 360, w: 150, h: 24 },
                { x: 720, y: gameHeight - 400, w: 130, h: 22 },
                { x: 960, y: gameHeight - 360, w: 120, h: 22 },
                { x: 1140, y: gameHeight - 320, w: 110, h: 20 }
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
