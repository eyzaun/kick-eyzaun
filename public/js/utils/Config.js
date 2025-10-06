// public/js/utils/Config.js - Konfigürasyon ayarları

export const CONFIG = {
    // Kick WebSocket ayarları
    KICK: {
        BASE_URL: 'https://kick.com/api',
        PUSHER_APP_KEY: '32cbd69e4b950bf97679',
        PUSHER_CLUSTER: 'us2',
        PROTOCOL_VERSION: 7,
        DEFAULT_CHANNEL: 'eyzaun'
    },

    // WebSocket ayarları
    WEBSOCKET: {
        MAX_RECONNECT_ATTEMPTS: 10,
        RECONNECT_DELAY: 2000,
        HEARTBEAT_INTERVAL: 30000,
        HEARTBEAT_TIMEOUT: 60000,
        MESSAGE_CACHE_SIZE: 100
    },

    // Avatar ayarları
    AVATAR: {
        SIZE: 60,
        MOVE_DISTANCE: 80,
        ANIMATION_DURATION: 300,
    SPEECH_BUBBLE_DURATION: 300000,
        INACTIVE_TIMEOUT: 300000, // 5 minutes
        EMOJIS: [
            // Eğlenceli emoji seti (yalnızca emoji)
            '😀','😎','🥳','🤖','👻','🦄','🐲','🐱','🐶','🦊',
            '🐼','🐵','🐸','🐯','🦄','🐙','🐳','🦋','🐝','🐞',
            '🌟','✨','🔥','⚡','❄️','🌈','🎈','🎲','🎮','🎵',
            '💎','🍀','🍕','🍩','🍓','🍉','🍔','🚀','🛸','⚽',
            '🏀','🏆','🎯','🎁','💡','💥','💫','🌀','🌪️','🌊'
        ],
    },

    // Ekran ayarları
    SCREEN: {
        WIDTH: 1920,
        HEIGHT: 1080,
        SAFE_MARGIN: 100
    },

    // Efekt ayarları
    EFFECTS: {
        PARTICLE_COUNT: {
            SMALL: 8,
            MEDIUM: 15,
            LARGE: 30
        },
        DURATIONS: {
            SHORT: 1500,
            MEDIUM: 3000,
            LONG: 5000,
            EXTRA_LONG: 8000
        },
        COOLDOWNS: {
            MOVEMENT: 1000,
            ANIMATION: 2000,
            BASIC_EFFECT: 3000,
            ADVANCED_EFFECT: 6000,
            SPECIAL_EFFECT: 10000,
            ULTIMATE_EFFECT: 20000
        }
    },

    // UI ayarları
    UI: {
        NOTIFICATION_DURATION: 2000,
        STATS_UPDATE_INTERVAL: 1000,
        CLEANUP_INTERVAL: 60000,
        Z_INDICES: {
            PARTICLES: 9999,
            AVATARS: 9998,
            SPEECH_BUBBLES: 10001,
            UI_COMPONENTS: 10002,
            NOTIFICATIONS: 10003,
            LOADING_SCREEN: 10004
        }
    },

    // Ses ayarları
    AUDIO: {
        ENABLED: true,
        VOLUME: 0.2,
        FREQUENCY: 600,
        TYPE: 'sine',
        DURATION: 0.3
    },

    // Debug ayarları
    DEBUG: {
        ENABLED: false,
        LOG_WEBSOCKET: false,
        LOG_COMMANDS: true,
        LOG_EFFECTS: true,
        LOG_AVATARS: false
    }
};

// Komut konfigürasyonu
export const COMMANDS = {
    // Hareket komutları
    MOVEMENT: {
        '!sağ': {
            name: 'Sağa Hareket',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.MOVEMENT,
            action: 'moveRight',
            type: 'movement'
        },
        '!sol': {
            name: 'Sola Hareket',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.MOVEMENT,
            action: 'moveLeft',
            type: 'movement'
        },
        '!yukarı': {
            name: 'Yukarı Hareket',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.MOVEMENT,
            action: 'moveUp',
            type: 'movement'
        },
        '!aşağı': {
            name: 'Aşağı Hareket',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.MOVEMENT,
            action: 'moveDown',
            type: 'movement'
        }
    },

    // Animasyon komutları
    ANIMATIONS: {
        '!dans': {
            name: 'Dans',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ANIMATION,
            action: 'dance',
            type: 'animation'
        },
        '!zıpla': {
            name: 'Zıplama',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ANIMATION,
            action: 'jump',
            type: 'animation'
        },
        '!döndür': {
            name: 'Dönme',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ANIMATION,
            action: 'spin',
            type: 'animation'
        },
        '!karakter': {
            name: 'Karakter Değiştir',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
            action: 'changeAvatar',
            type: 'animation'
        }
    },

    // Temel efektler
    BASIC_EFFECTS: {
        '!patlama': {
            name: 'Patlama Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
            action: 'createExplosion',
            type: 'global'
        },
        '!yıldırım': {
            name: 'Şimşek Çakması',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
            action: 'createLightning',
            type: 'global'
        },
        '!kar': {
            name: 'Kar Yağışı',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createSnow',
            type: 'global'
        },
        '!ateş': {
            name: 'Ateş Çemberi',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
            action: 'createFire',
            type: 'global'
        },
        '!konfeti': {
            name: 'Konfeti Patlaması',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createConfetti',
            type: 'global'
        },
        '!kalp': {
            name: 'Kalp Yağmuru',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
            action: 'createHearts',
            type: 'global'
        },
        '!rainbow': {
            name: 'Gökkuşağı',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createRainbow',
            type: 'global'
        },
        '!baş': {
            name: 'Baş Emoji Patlaması',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
            action: 'createMiddleFinger',
            type: 'global'
        },
        '!shake': {
            name: 'Ekran Sarsıntısı',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createShake',
            type: 'global'
        }
    },

    // Gelişmiş efektler
    ADVANCED_EFFECTS: {
        '!lazer': {
            name: 'Lazer Gösterisi',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createLazer',
            type: 'global'
        },
        '!meteor': {
            name: 'Meteor Yağmuru',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.SPECIAL_EFFECT,
            action: 'createMeteor',
            type: 'global'
        },
        '!matrix': {
            name: 'Matrix Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.SPECIAL_EFFECT,
            action: 'createMatrix',
            type: 'global'
        },
        '!portal': {
            name: 'Portal Açma',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.SPECIAL_EFFECT,
            action: 'createPortal',
            type: 'global'
        },
        '!galaksi': {
            name: 'Galaksi Döndürme',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.SPECIAL_EFFECT,
            action: 'createGalaxy',
            type: 'global'
        },
        '!tsunami': {
            name: 'Tsunami Dalgası',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ULTIMATE_EFFECT,
            action: 'createTsunami',
            type: 'global'
        }
    },

    // Ses efektleri
    SOUND_EFFECTS: {
        '!bas': {
            name: 'Bass Drop',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.SPECIAL_EFFECT,
            action: 'createBassDrop',
            type: 'global'
        },
        '!davul': {
            name: 'Davul Çalma',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
            action: 'createDrums',
            type: 'global'
        },
        '!gitar': {
            name: 'Gitar Riffi',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createGuitar',
            type: 'global'
        },
        '!synth': {
            name: 'Synthesizer',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
            action: 'createSynth',
            type: 'global'
        }
    },

    // Özel efektler
    SPECIAL_EFFECTS: {
        '!nuke': {
            name: 'Nükleer Patlama',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ULTIMATE_EFFECT,
            action: 'createNuke',
            type: 'global'
        },
        '!disco': {
            name: 'Disco Topu',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createDisco',
            type: 'global'
        },
        '!ufo': {
            name: 'UFO Çağırma',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.SPECIAL_EFFECT,
            action: 'createUFO',
            type: 'global'
        },
        '!ninja': {
            name: 'Ninja Saldırısı',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createNinja',
            type: 'global'
        },

        // VALORANT ÇÖP EFEKTLERİ
        '!brimstoneçöp': {
            name: 'Brimstone Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'brimstone',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!brimstone': {
            name: 'Brimstone Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'brimstone',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!phoenixçöp': {
            name: 'Phoenix Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'phoenix',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!phoenix': {
            name: 'Phoenix Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'phoenix',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!sageçöp': {
            name: 'Sage Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'sage',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!sage': {
            name: 'Sage Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'sage',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!sovaçöp': {
            name: 'Sova Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'sova',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!sova': {
            name: 'Sova Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'sova',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!viperçöp': {
            name: 'Viper Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'viper',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!viper': {
            name: 'Viper Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'viper',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!cypherçöp': {
            name: 'Cypher Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'cypher',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!cypher': {
            name: 'Cypher Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'cypher',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!reynaçöp': {
            name: 'Reyna Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'reyna',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!reyna': {
            name: 'Reyna Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'reyna',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!killjoyçöp': {
            name: 'Killjoy Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'killjoy',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!killjoy': {
            name: 'Killjoy Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'killjoy',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!breachçöp': {
            name: 'Breach Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'breach',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!breach': {
            name: 'Breach Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'breach',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!omençöp': {
            name: 'Omen Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'omen',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!omen': {
            name: 'Omen Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'omen',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!jettçöp': {
            name: 'Jett Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'jett',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!jett': {
            name: 'Jett Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'jett',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!razeçöp': {
            name: 'Raze Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'raze',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!raze': {
            name: 'Raze Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'raze',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!skyeçöp': {
            name: 'Skye Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'skye',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!skye': {
            name: 'Skye Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'skye',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!yoruçöp': {
            name: 'Yoru Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'yoru',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!yoru': {
            name: 'Yoru Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'yoru',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!astraçöp': {
            name: 'Astra Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'astra',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!astra': {
            name: 'Astra Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'astra',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!kayoçöp': {
            name: 'Kayo Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'kayo',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!kayo': {
            name: 'Kayo Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'kayo',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!chamberçöp': {
            name: 'Chamber Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'chamber',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!chamber': {
            name: 'Chamber Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'chamber',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!neonçöp': {
            name: 'Neon Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'neon',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!neon': {
            name: 'Neon Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'neon',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!fadeçöp': {
            name: 'Fade Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'fade',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!fade': {
            name: 'Fade Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'fade',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!harborçöp': {
            name: 'Harbor Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'harbor',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!harbor': {
            name: 'Harbor Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'harbor',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!gekkoçöp': {
            name: 'Gekko Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'gekko',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!gekko': {
            name: 'Gekko Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'gekko',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!deadlockçöp': {
            name: 'Deadlock Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'deadlock',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!deadlock': {
            name: 'Deadlock Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'deadlock',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!isoçöp': {
            name: 'Iso Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'iso',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!iso': {
            name: 'Iso Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'iso',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!cloveçöp': {
            name: 'Clove Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'clove',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!clove': {
            name: 'Clove Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'clove',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!vyseçöp': {
            name: 'Vyse Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'vyse',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!vyse': {
            name: 'Vyse Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'vyse',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!tejoçöp': {
            name: 'Tejo Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'tejo',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!tejo': {
            name: 'Tejo Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'tejo',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!waylayçöp': {
            name: 'Waylay Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'waylay',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!waylay': {
            name: 'Waylay Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'waylay',
            durationMs: 20000,
            uniqueMessages: true
        },
        '!veto': {
            name: 'Veto Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'veto',
            durationMs: 20000,
            uniqueMessages: true
        }
    }
};

// Tüm komutları ayrı export et

// Hareket komutları
export const MOVEMENT_COMMANDS = COMMANDS.MOVEMENT;

// Efekt komutları (animasyonlar + temel/gelişmiş/ses efektleri)
export const EFFECT_COMMANDS = {
    ...COMMANDS.ANIMATIONS,
    ...COMMANDS.BASIC_EFFECTS,
    ...COMMANDS.ADVANCED_EFFECTS,
    ...COMMANDS.SOUND_EFFECTS
};

// Özel efektler (VALORANT çöp efektleri dahil)
export const SPECIAL_EFFECTS = COMMANDS.SPECIAL_EFFECTS;

// OYUN KOMUTLARI
export const GAME_COMMANDS = {
    '!oyun': {
        name: 'Oyunu Başlat',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.SPECIAL_EFFECT,
        action: 'startGame',
        type: 'global'
    },
    '!başla': {
        name: 'Oyunu Başlat',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.SPECIAL_EFFECT,
        action: 'startGame',
        type: 'global'
    },
    '!kapat': {
        name: 'Oyunu Kapat',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'stopGame',
        type: 'global'
    },
    '!bitir': {
        name: 'Oyunu Bitir',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'forceEndGame',
        type: 'global'
    },
    '!ben': {
        name: 'Oyuna Katıl',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.MOVEMENT,
        action: 'joinGame',
        type: 'user'
    }
};

// VALORANT KARAKTERLERİ İÇİN ÇÖP EFEKTİ AYARLARI
export const VALORANT_TRASH_EFFECTS = {
    brimstone: {
        name: 'BRIMSTONE',
        title: 'BRIMSTONE ÇÖPLÜĞÜ!',
        titleColor: '#FF4500',
        messageColor: '#FFA500',
        messages: [
            "Molly atıyor kendisi yanıyor.",
            "Smoke attığı yere düşman push atıyor zaten.",
            "Stim beacon koyuyor kimse kullanmıyor.",
            "Ulti çağırırken düşman kaçıyor, boş yere harcanıyor.",
            "Haritayı açması defuse süresinden uzun.",
            "Yaşlı abi taktik veriyor, round kaybediliyor."
        ],
        parts: ['🔥','�','�️','�']
    },
    phoenix: {
        name: 'PHOENIX',
        title: 'PHOENIX KÖMÜRÜ!',
        titleColor: '#FF6B00',
        messageColor: '#FFD700',
        messages: [
            "Flash atıyor takım kör, düşman değil.",
            "Wall çekiyor düşmana kapı açıyor.",
            "Molly kendine, heal düşmana.",
            "Ulti popunu harcıyor 0 kill'e.",
            "Her şeyi tutuşturuyor ama düşmanı değil.",
            "Ateş topu kendisi gibi, işe yaramaz."
        ],
        parts: ['🔥','�','💥','�']
    },
    sage: {
        name: 'SAGE',
        title: 'SAGE SAÇMALIĞI!',
        titleColor: '#00FF88',
        messageColor: '#7FFFD4',
        messages: [
            "Wall düşmana boost, kendine engel.",
            "Heal kendine, takım ölüyor.",
            "Slow orb attığı yere kimse gelmiyor.",
            "Res ult harcanıyor en kötü oyuncuya.",
            "İyileştirici değil hastalık gibi.",
            "Bilge kadın ama aptal hareketler."
        ],
        parts: ['🧊','','�','🧘']
    },
    sova: {
        name: 'SOVA',
        title: 'SOVA ŞAŞKINI!',
        titleColor: '#4169E1',
        messageColor: '#87CEEB',
        messages: [
            "Dart atıyor duvardan dönüyor kendini gösteriyor.",
            "Shock dart hesabı yanlış, kendine geliyor.",
            "Drone kullanırken vurulup ölüyor.",
            "Ulti 3 ok, 3'ü de hava.",
            "Keşif uzmanı ama kendini keşfettiriyor.",
            "Avcı değil av olmuş."
        ],
        parts: ['🏹','🦅','⚡','']
    },
    viper: {
        name: 'VIPER',
        title: 'VIPER ZEHİRİ!',
        titleColor: '#00FF00',
        messageColor: '#32CD32',
        messages: [
            "Toxin attığı yerde takım oynayamıyor.",
            "Wall çekiyor görüş sıfır, düşman geçiyor.",
            "Orb atmayı unutuyor, boş duruyor.",
            "Molly gecikiyor, düşman defuse bitiyor.",
            "Zehir uzmani ama takıma zehir oluyor.",
            "Her şeyi toxic kendisi gibi."
        ],
        parts: ['☣️','�','💚','']
    },
    cypher: {
        name: 'CYPHER',
        title: 'CYPHER ÇÖPLÜĞÜ!',
        titleColor: '#FFFFFF',
        messageColor: '#C0C0C0',
        messages: [
            "Trap koyuyor en saçma yerlere, kimse basmıyor.",
            "Cage atıyor düşman içinden rahat geçiyor.",
            "Kamera izlerken arkadan vurulup ölüyor.",
            "Ulti atıyor zaten bilinen yerleri gösteriyor.",
            "İstihbarat uzmanı ama hiçbir şey bilmiyor.",
            "Casusmuş ama ilk ölen o."
        ],
        parts: ['📷','🎩','�','🕵️']
    },
    reyna: {
        name: 'REYNA',
        title: 'REYNA FAKİRİ!',
        titleColor: '#8B008B',
        messageColor: '#DA70D6',
        messages: [
            "Leer atıyor duvara, düşman görüyor.",
            "Dismiss basıyor düşmanın yanına gidiyor.",
            "Devour yaparken vurulup ölüyor.",
            "Ulti açıyor panik modunda spray ediyor.",
            "Kill alamayınca çöp oluyor zaten.",
            "Vampir değil böcek gibi eziiliyor."
        ],
        parts: ['�️','�','�','�']
    },
    killjoy: {
        name: 'KILLJOY',
        title: 'KILLJOY BOZUKLUĞU!',
        titleColor: '#FFD700',
        messageColor: '#FFFF00',
        messages: [
            "Turret koyuyor düşman arkadan geliyor.",
            "Nanoswarm patlatıyor boş yere, düşman yok.",
            "Alarmbot en saçma yerde, hiçbir işe yaramıyor.",
            "Lockdown ulti düşman kaçıyor, boşa.",
            "Dahi kız ama zekalı oyun yok.",
            "Botları akıllı ama kendisi değil."
        ],
        parts: ['🤖','⚙️','','🔧']
    },
    breach: {
        name: 'BREACH',
        title: 'BREACH BOZUKLUĞU!',
        titleColor: '#FF8C00',
        messageColor: '#FFA500',
        messages: [
            "Flash atıyor takım kör, düşman hazır.",
            "Aftershock çakıyor kimse yok orada.",
            "Fault line yanlış yöne, işe yaramıyor.",
            "Ulti atıyor düşman zaten kaçmış.",
            "Duvar delen adam ama kafası delmemiş.",
            "Şok dalgaları beynine ulaşmamış."
        ],
        parts: ['�','','⚡','🔨']
    },
    omen: {
        name: 'OMEN',
        title: 'OMEN GÖLGE ÇÖPÜ!',
        titleColor: '#4B0082',
        messageColor: '#9370DB',
        messages: [
            "TP atıyor ses bombası gibi duyuruyor.",
            "Paranoya takımı vuruyor daha çok.",
            "Smoke atması defuse süresinden uzun.",
            "Ulti deneyişi bedava kill düşmana.",
            "Gölge değil hedef tahtası.",
            "Karanlıktan gelmiyor, direkt ışığa."
        ],
        parts: ['👻','🌑','💀','🌫️']
    },
    jett: {
        name: 'JETT',
        title: 'JETT ÇÖP RÜZGARI!',
        titleColor: '#00BFFF',
        messageColor: '#87CEEB',
        messages: [
            "Dash var ama ilk ölen yine o.",
            "Op alıyor 0 kill yapıyor.",
            "Updraft atıp uçan kaz gibi vurluyor.",
            "Cloud kendine, düşman net görüyor.",
            "5 bıçak ultisi, 5'i de hava.",
            "Hızlı ölüm garantisi."
        ],
        parts: ['💨','️','☁️','⚡']
    },
    raze: {
        name: 'RAZE',
        title: 'RAZE PATLAMA ÇÖPÜ!',
        titleColor: '#FF1493',
        messageColor: '#FF69B4',
        messages: [
            "Nade atıyor takıma, düşman sağlam.",
            "Boom bot salıyor kendi peşinden koşuyor.",
            "Satchel kendini uçuruyor düşmanın kucağına.",
            "Ulti roket kendinden dönüyor bazen.",
            "Patlayıcı uzmanı ama patlamış kafası.",
            "Hasar kendine takıma, düşman rahat."
        ],
        parts: ['💥','🧨','�','💣']
    },
    skye: {
        name: 'SKYE',
        title: 'SKYE DOĞA ÇÖPÜ!',
        titleColor: '#32CD32',
        messageColor: '#90EE90',
        messages: [
            "Flash köpeği takımı ısırıyor.",
            "Heal poolu koyuyor kimse gelmiyor.",
            "Trailblazer gönderirken vurulup ölüyor.",
            "Ulti atıyor düşman yok bile.",
            "Avustralyalı ama her şey ters gidiyor.",
            "Doğanın gücü değil acizliği."
        ],
        parts: ['�','🌿','🐺','�']
    },
    yoru: {
        name: 'YORU',
        title: 'YORU YALANCIĞI!',
        titleColor: '#0000FF',
        messageColor: '#6495ED',
        messages: [
            "Clone gönderip 2 saniye sonra belli oluyor.",
            "Gatecrash atıp düşmanın yanına ışınlanıyor.",
            "Flash en kötü açıdan atıyor, işe yaramıyor.",
            "Ulti'de görünmez değil sadece şeffaf.",
            "Japon ninja değil palyaço.",
            "Aldatıcı ama kendini aldatıyor."
        ],
        parts: ['👤','�','⚡','']
    },
    astra: {
        name: 'ASTRA',
        title: 'ASTRA KOZMİK ÇÖPÜ!',
        titleColor: '#9400D3',
        messageColor: '#BA55D3',
        messages: [
            "Yıldız koyuyor yanlış yerlere.",
            "Smok çekerken takım 4v5 oynuyor.",
            "Stun atıyor düşman geçmiş bile.",
            "Ulti duvarı hiçbir işe yaramıyor.",
            "Kozmos gücü var ama beyin yok.",
            "Yıldızlar gibi uzakta kalmış oyundan."
        ],
        parts: ['⭐','🌟','🌌','🪐']
    },
    kayo: {
        name: 'KAY/O',
        title: 'KAY/O ROBOT ÇÖPÜ!',
        titleColor: '#708090',
        messageColor: '#A9A9A9',
        messages: [
            "Molly atıyor boş köşeye.",
            "Flash kendini etkiliyor gibi oynuyor.",
            "Knife atıyor suppres olmuyor kimse.",
            "Ulti açıp ilk ölüyor, res yok.",
            "Robot ama yapay zeka seviyesi düşük.",
            "Bastır yeteneği var ama bastırılamaz aptallığı."
        ],
        parts: ['🤖','⚡','�','�']
    },
    chamber: {
        name: 'CHAMBER',
        title: 'CHAMBER ÇÖPLÜĞÜ!',
        titleColor: '#FFD700',
        messageColor: '#DAA520',
        messages: [
            "Trap koyuyor en saçma yerlere.",
            "TP noktası düşmanın tam yanında.",
            "Headhunter alıyor bacak vuruyor.",
            "Ulti sniperı kaçırıyor hep.",
            "Fransız ama marifet yok.",
            "Zengin ama yoksul oyun."
        ],
        parts: ['�','�','🔫','��']
    },
    neon: {
        name: 'NEON',
        title: 'NEON ŞİMŞEK ÇÖPÜ!',
        titleColor: '#00FFFF',
        messageColor: '#00CED1',
        messages: [
            "Koşuyor düşmana direkt gidiyor.",
            "Stun atıyor kendine yakın, etkisiz.",
            "Duvar çekiyor düşman rahat geçiyor.",
            "Ulti açıp spray ediyor, sıfır kill.",
            "Elektrik hızı var beyin yok.",
            "Filipinli şimşek ama tek çakan kafası."
        ],
        parts: ['⚡','�','�','⚡']
    },
    fade: {
        name: 'FADE',
        title: 'FADE KABUS ÇÖPÜ!',
        titleColor: '#1C1C1C',
        messageColor: '#696969',
        messages: [
            "Prowler gönderiyor yanlış tarafa.",
            "Seize orb boş yere harcanıyor.",
            "Haunt göz düşman görmüyor bile.",
            "Ulti atıyor takım etkileniyor daha çok.",
            "Kabus uzmanı ama takımın kabusu.",
            "Türk ajan ama milli olmamış."
        ],
        parts: ['�️','🌑','💀','��']
    },
    harbor: {
        name: 'HARBOR',
        title: 'HARBOR SU ÇÖPÜ!',
        titleColor: '#00CED1',
        messageColor: '#48D1CC',
        messages: [
            "Cove koyuyor düşman duvara vuruyor.",
            "Cascade duvarı anlamsız yerlerde.",
            "High tide çekiyor görüş engeli sadece.",
            "Ulti alanı hiçbir işe yaramıyor.",
            "Hint su bükücü ama beyni kurmuş.",
            "Okyanus değil gölet gibi etkisi."
        ],
        parts: ['🌊','💧','�','��']
    },
    gekko: {
        name: 'GEKKO',
        title: 'GEKKO YARATIK ÇÖPÜ!',
        titleColor: '#98FB98',
        messageColor: '#00FA9A',
        messages: [
            "Dizzy atıyor düşman dönmüş bile.",
            "Wingman defuse verip gidiyor yanından.",
            "Mosh pit anlamsız yere patlatıyor.",
            "Thrash ulti düşman kaçıyor kolay.",
            "Meksikalı ama organizasyon yok.",
            "Yaratıkları bile utanıyor ondan."
        ],
        parts: ['🦎','�','�','🇲🇽']
    },
    deadlock: {
        name: 'DEADLOCK',
        title: 'DEADLOCK KAPAN ÇÖPÜ!',
        titleColor: '#FFFFFF',
        messageColor: '#D3D3D3',
        messages: [
            "Sensor ağı yanlış yerde.",
            "Barrier mesh düşmana yardım ediyor.",
            "GravNet atıyor kimse yok orada.",
            "Ulti cocoon düşman kurtarıyor arkadaşını.",
            "Norveçli kapan ustası ama tek tuzak kendisi.",
            "Kilitlemiş ama kafasını."
        ],
        parts: ['🕸️','⚙️','🔒','🇳🇴']
    },
    iso: {
        name: 'ISO',
        title: 'ISO İZOLE ÇÖPÜ!',
        titleColor: '#9370DB',
        messageColor: '#BA55D3',
        messages: [
            "Double tap shield boşa harcıyor.",
            "Undercut düşman geçmiş bile.",
            "Contingency duvarı işe yaramıyor.",
            "Ulti düellosu kaybediyor hep.",
            "Çinli savaşçı ama barışçıl oyun.",
            "İzole değil sadece yalnız ve işe yaramaz."
        ],
        parts: ['�️','�','⚡','🇨🇳']
    },
    clove: {
        name: 'CLOVE',
        title: 'CLOVE ÖLÜMSÜZ ÇÖPÜ!',
        titleColor: '#FF1493',
        messageColor: '#FF69B4',
        messages: [
            "Smoke attığı yere push geliyor.",
            "Meddle kullanırken vurulup ölüyor.",
            "Pick-me-up alıyor tekrar ölüyor.",
            "Ulti zaten kayıp rounda harcıyor.",
            "İskoç ölümsüzü ama devamlı ölüyor.",
            "Non-binary ama oyunu binary: 0 ya da 0."
        ],
        parts: ['🦋','�','☠️','🏴']
    },
    vyse: {
        name: 'VYSE',
        title: 'VYSE METAL ÇÖPÜ!',
        titleColor: '#C0C0C0',
        messageColor: '#A9A9A9',
        messages: [
            "Arc Rose bitki koysam daha iyi.",
            "Shear duvarı düşman geçiyor rahat.",
            "Razorvine düşman fark etmiyor bile.",
            "Steel Garden ulti zaten kaybetmiş round.",
            "Metali büken kadın ama mental çökmüş.",
            "Trap uzmanı ama en büyük tuzak kendisi."
        ],
        parts: ['🌹','⚙️','�','�']
    },
    tejo: {
        name: 'TEJO',
        title: 'TEJO HATA MESAJI!',
        titleColor: '#FF0000',
        messageColor: '#FF6347',
        messages: [
            "Yeni karakter ama eski hata.",
            "Yetenekleri ne işe yarıyor belli değil.",
            "Kullanımı zor oynanışı daha zor.",
            "Takıma yük olmaktan başka bir şey değil.",
            "Daha tanımadan bıktık.",
            "Çöp bile daha kullanışlı."
        ],
        parts: ['❌','⚠️','�','']
    },
    waylay: {
        name: 'WAYLAY',
        title: 'WAYLAY HAYALET!',
        titleColor: '#808080',
        messageColor: '#A9A9A9',
        messages: [
            "Kim bu karakter belli değil.",
            "Oyuna geldiğinde zaten silinmiş olacak.",
            "Yetenekleri test aşamasında kalmış.",
            "Pick edeni görmedik daha.",
            "Hayalet gibi görünmez çünkü yok.",
            "Valorant'ın hata mesajı."
        ],
        parts: ['👻','❓','🌫️','💭']
    }
    ,
    veto: {
        name: 'VETO',
        title: 'VETO REDDEDİLDİ!',
        titleColor: '#8B0000',
        messageColor: '#DC143C',
        messages: [
            "Bu karakter mi yoksa bug mı belli değil.",
            "Seç tuşu çalışmıyor zaten.",
            "Yetenek açıklaması bile yok.",
            "Oyunda olup olmadığı tartışmalı.",
            "Adı veto çünkü herkes red ediyor.",
            "Karakterden çok konsept art."
        ],
        parts: ['🚫','❌','🛑','⛔']
    }
};

// Tüm komutları güncellenmiş hali ile export et
export const ALL_COMMANDS = {
    ...MOVEMENT_COMMANDS,
    ...EFFECT_COMMANDS,
    ...SPECIAL_EFFECTS,
    ...GAME_COMMANDS
};

// Kullanıcı türleri
export const USER_TYPES = {
    BROADCASTER: 'broadcaster',
    MODERATOR: 'moderator',
    VIP: 'vip',
    VIEWER: 'viewer'
};

// Badge türleri
export const BADGE_TYPES = {
    BROADCASTER: 'broadcaster',
    MODERATOR: 'moderator',
    VIP: 'vip',
    SUBSCRIBER: 'subscriber',
    FOUNDER: 'founder'
};

export default CONFIG;

