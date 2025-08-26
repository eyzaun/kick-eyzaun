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
        SPEECH_BUBBLE_DURATION: 4000,
        INACTIVE_TIMEOUT: 300000, // 5 minutes
        EMOJIS: [
            '🎮', '🦸', '🤖', '👽', '🐉', '🦄', '⚡', '🔥', 
            '💎', '🌟', '🎯', '🚀', '🦊', '🐺', '🦁', '🐯', 
            '🐻', '🐼', '🦝', '🦘', '🦋', '🐸', '🦆', '🐧', '🦀'
        ]
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
        }
    }
};

// Tüm komutları birleştir
export const ALL_COMMANDS = {
    ...COMMANDS.MOVEMENT,
    ...COMMANDS.ANIMATIONS,
    ...COMMANDS.BASIC_EFFECTS,
    ...COMMANDS.ADVANCED_EFFECTS,
    ...COMMANDS.SOUND_EFFECTS,
    ...COMMANDS.SPECIAL_EFFECTS
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