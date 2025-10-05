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
            // TÜRKİYE'DEN ÜNLÜ İSİMLER (20 karakter)
            'assets/characters/arda-guler.png', // Arda Güler
            'assets/characters/kerem-akturkoglu.png', // Kerem Aktürkoğlu
            'assets/characters/burak-yilmaz.png', // Burak Yılmaz
            'assets/characters/cenk-tosun.png', // Cenk Tosun
            'assets/characters/arda-turan.png', // Arda Turan
            'assets/characters/mesut-ozil.png', // Mesut Özil
            'assets/characters/cristiano-ronaldo.png', // Cristiano Ronaldo
            'assets/characters/lionel-messi.png', // Lionel Messi
            'assets/characters/neymar.png', // Neymar
            'assets/characters/kylian-mbappe.png', // Kylian Mbappe
            'assets/characters/erling-haaland.png', // Erling Haaland
            'assets/characters/mohamed-salah.png', // Mohamed Salah
            'assets/characters/kevin-de-bruyne.png', // Kevin De Bruyne
            'assets/characters/bruno-fernandes.png', // Bruno Fernandes
            'assets/characters/harry-kane.png', // Harry Kane
            'assets/characters/son-heung-min.png', // Son Heung-min
            'assets/characters/ataturk.png', // Atatürk
            'assets/characters/erdogan.png', // Erdoğan
            'assets/characters/kilincdaroglu.png', // Kılıçdaroğlu
            'assets/characters/bahceli.png', // Bahçeli

            // ÇEŞİTLİ KARAKTERLER (30 karakter)
            'assets/characters/mutlu-yuz.png', // Mutlu yüz
            'assets/characters/robot.png', // Robot
            'assets/characters/kedi.png', // Kedi
            'assets/characters/unicorn.png', // Unicorn
            'assets/characters/hayalet.png', // Hayalet
            'assets/characters/buyucu.png', // Büyücü
            'assets/characters/superkahraman.png', // Süper kahraman
            'assets/characters/astronot.png', // Astronot
            'assets/characters/asci.png', // Aşçı
            'assets/characters/doktor.png', // Doktor
            'assets/characters/ressam.png', // Ressam
            'assets/characters/muzisyen.png', // Müzisyen
            'assets/characters/futbolcu.png', // Futbolcu
            'assets/characters/basketbolcu.png', // Basketbolcu
            'assets/characters/gamer.png', // Gamer
            'assets/characters/tilki.png', // Tilki
            'assets/characters/kurt.png', // Kurt
            'assets/characters/aslan.png', // Aslan
            'assets/characters/panda.png', // Panda
            'assets/characters/kelebek.png', // Kelebek
            'assets/characters/yunus.png', // Yunus
            'assets/characters/baykus.png', // Baykuş
            'assets/characters/unicorn2.png', // Unicorn
            'assets/characters/alien.png', // Alien
            'assets/characters/palyaco.png', // Palyaço
            'assets/characters/cadi.png', // Cadı
            'assets/characters/zombi.png', // Zombi
            'assets/characters/denizkizi.png', // Denizkızı
            'assets/characters/peri.png', // Peri
            'assets/characters/melek.png', // Melek
            'assets/characters/kafatasi.png'  // Kafatası
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
            character: 'brimstone'
        },
        '!phoenixçöp': {
            name: 'Phoenix Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'phoenix'
        },
        '!sageçöp': {
            name: 'Sage Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'sage'
        },
        '!sovaçöp': {
            name: 'Sova Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'sova'
        },
        '!viperçöp': {
            name: 'Viper Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'viper'
        },
        '!cypherçöp': {
            name: 'Cypher Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'cypher'
        },
        '!reynaçöp': {
            name: 'Reyna Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'reyna'
        },
        '!killjoyçöp': {
            name: 'Killjoy Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'killjoy'
        },
        '!breachçöp': {
            name: 'Breach Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'breach'
        },
        '!omençöp': {
            name: 'Omen Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'omen'
        },
        '!jettçöp': {
            name: 'Jett Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'jett'
        },
        '!razeçöp': {
            name: 'Raze Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'raze'
        },
        '!skyecöp': {
            name: 'Skye Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'skye'
        },
        '!yoruçöp': {
            name: 'Yoru Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'yoru'
        },
        '!astrançöp': {
            name: 'Astra Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'astra'
        },
        '!kayoçöp': {
            name: 'Kayo Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'kayo'
        },
        '!chamberçöp': {
            name: 'Chamber Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'chamber'
        },
        '!neonçöp': {
            name: 'Neon Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'neon'
        },
        '!fadeçöp': {
            name: 'Fade Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'fade'
        },
        '!harborçöp': {
            name: 'Harbor Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'harbor'
        },
        '!gekkoçöp': {
            name: 'Gekko Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'gekko'
        },
        '!deadlockçöp': {
            name: 'Deadlock Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'deadlock'
        },
        '!isoçöp': {
            name: 'Iso Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'iso'
        },
        '!cloveçöp': {
            name: 'Clove Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'clove'
        },
        '!vyseçöp': {
            name: 'Vyse Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'vyse'
        },
        '!tejocöp': {
            name: 'Tejo Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'tejo'
        },
        '!waylayçöp': {
            name: 'Waylay Çöp Efekti',
            cooldown: CONFIG.EFFECTS.COOLDOWNS.ADVANCED_EFFECT,
            action: 'createTrashEffect',
            type: 'global',
            character: 'waylay'
        }
    }
};

// Tüm komutları ayrı export et
// (Bu kısım SPECIAL_CHARACTER_COMMANDS'tan sonra güncellenecek)

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

// Özel karakter komutları (görünür listede yok ama çalışır)
export const SPECIAL_CHARACTER_COMMANDS = {
    // Türk ünlüleri
    '!arda': {
        name: 'Arda Güler',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 0
    },
    '!kerem': {
        name: 'Kerem Aktürkoğlu',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 1
    },
    '!burak': {
        name: 'Burak Yılmaz',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 2
    },
    '!cenk': {
        name: 'Cenk Tosun',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 3
    },
    '!arda-turan': {
        name: 'Arda Turan',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 4
    },
    '!mesut': {
        name: 'Mesut Özil',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 5
    },
    '!ronaldo': {
        name: 'Cristiano Ronaldo',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 6
    },
    '!messi': {
        name: 'Lionel Messi',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 7
    },
    '!neymar': {
        name: 'Neymar',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 8
    },
    '!mbappe': {
        name: 'Kylian Mbappe',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 9
    },
    '!haaland': {
        name: 'Erling Haaland',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 10
    },
    '!salah': {
        name: 'Mohamed Salah',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 11
    },
    '!de-bruyne': {
        name: 'Kevin De Bruyne',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 12
    },
    '!bruno': {
        name: 'Bruno Fernandes',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 13
    },
    '!kane': {
        name: 'Harry Kane',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 14
    },
    '!son': {
        name: 'Son Heung-min',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 15
    },
    '!ataturk': {
        name: 'Atatürk',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 16
    },
    '!erdogan': {
        name: 'Erdoğan',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 17
    },
    '!kilincdaroglu': {
        name: 'Kılıçdaroğlu',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 18
    },
    '!bahceli': {
        name: 'Bahçeli',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 19
    },

    // Çeşitli karakterler
    '!mutlu': {
        name: 'Mutlu Yüz',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 20
    },
    '!robot': {
        name: 'Robot',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 21
    },
    '!kedi': {
        name: 'Kedi',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 22
    },
    '!unicorn': {
        name: 'Unicorn',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 23
    },
    '!hayalet': {
        name: 'Hayalet',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 24
    },
    '!buyucu': {
        name: 'Büyücü',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 25
    },
    '!superkahraman': {
        name: 'Süper Kahraman',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 26
    },
    '!astronot': {
        name: 'Astronot',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 27
    },
    '!asci': {
        name: 'Aşçı',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 28
    },
    '!doktor': {
        name: 'Doktor',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 29
    },
    '!ressam': {
        name: 'Ressam',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 30
    },
    '!muzisyen': {
        name: 'Müzisyen',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 31
    },
    '!futbolcu': {
        name: 'Futbolcu',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 32
    },
    '!basketbolcu': {
        name: 'Basketbolcu',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 33
    },
    '!gamer': {
        name: 'Gamer',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 34
    },
    '!tilki': {
        name: 'Tilki',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 35
    },
    '!kurt': {
        name: 'Kurt',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 36
    },
    '!aslan': {
        name: 'Aslan',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 37
    },
    '!panda': {
        name: 'Panda',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 38
    },
    '!kelebek': {
        name: 'Kelebek',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 39
    },
    '!yunus': {
        name: 'Yunus',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 40
    },
    '!baykus': {
        name: 'Baykuş',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 41
    },
    '!alien': {
        name: 'Alien',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 42
    },
    '!palyaco': {
        name: 'Palyaço',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 43
    },
    '!cadi': {
        name: 'Cadı',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 44
    },
    '!zombi': {
        name: 'Zombi',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 45
    },
    '!denizkizi': {
        name: 'Denizkızı',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 46
    },
    '!peri': {
        name: 'Peri',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 47
    },
    '!melek': {
        name: 'Melek',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 48
    },
    '!kafatasi': {
        name: 'Kafatası',
        cooldown: CONFIG.EFFECTS.COOLDOWNS.BASIC_EFFECT,
        action: 'setCharacter',
        type: 'character',
        characterIndex: 49
    }
};

// VALORANT KARAKTERLERİ İÇİN ÇÖP EFEKTİ AYARLARI
export const VALORANT_TRASH_EFFECTS = {
    brimstone: {
        name: 'BRIMSTONE',
        messages: [
            'ÇÖP ORB', 'BOZUK BRIMSTONE', 'ÇÖP TOPÇUSU', 'BRIMSTONE ÇÖP',
            'ORB ARTIĞI', 'İNCENDİARY ÇÖP', 'BRIMSTONE BOZUK', 'ÇÖP ORB',
            'TOPÇU HURDASI', 'BRIMSTONE ARTIK', 'ÇÖP İNCENDİARY', 'BOZUK TOPÇU'
        ],
        parts: ['💥', '🔥', '💣', '🎯', '🚀', '⚡', '💥', '🔥', '💣', '🎯', '🚀', '⚡']
    },
    phoenix: {
        name: 'PHOENIX',
        messages: [
            'ÇÖP KUŞU', 'BOZUK PHOENIX', 'ÇÖP ATEŞİ', 'PHOENIX ÇÖP',
            'KUŞ ARTIĞI', 'FIRE ÇÖP', 'PHOENIX BOZUK', 'ÇÖP KUŞU',
            'ATEŞ HURDASI', 'PHOENIX ARTIK', 'ÇÖP FIRE', 'BOZUK KUŞ'
        ],
        parts: ['🔥', '🐦', '💥', '🌟', '⚡', '🔥', '🐦', '💥', '🌟', '⚡', '🔥', '🐦']
    },
    sage: {
        name: 'SAGE',
        messages: [
            'ÇÖP İYİLEŞTİRİCİ', 'BOZUK SAGE', 'ÇÖP BARIŞÇI', 'SAGE ÇÖP',
            'IYİLEŞTİRİCİ ARTIĞI', 'HEALING ÇÖP', 'SAGE BOZUK', 'ÇÖP BARIŞÇI',
            'BARIŞÇI HURDASI', 'SAGE ARTIK', 'ÇÖP HEALING', 'BOZUK İYİLEŞTİRİCİ'
        ],
        parts: ['💚', '🌿', '✨', '🕊️', '💚', '🌿', '✨', '🕊️', '💚', '🌿', '✨', '🕊️']
    },
    sova: {
        name: 'SOVA',
        messages: [
            'ÇÖP OKÇU', 'BOZUK SOVA', 'ÇÖP İZCİ', 'SOVA ÇÖP',
            'OKÇU ARTIĞI', 'RECON ÇÖP', 'SOVA BOZUK', 'ÇÖP İZCİ',
            'IZCİ HURDASI', 'SOVA ARTIK', 'ÇÖP RECON', 'BOZUK OKÇU'
        ],
        parts: ['🏹', '🎯', '🦅', '⚡', '🏹', '🎯', '🦅', '⚡', '🏹', '🎯', '🦅', '⚡']
    },
    viper: {
        name: 'VIPER',
        messages: [
            'ÇÖP ZEHİRLİ', 'BOZUK VIPER', 'ÇÖP KİMYAGER', 'VIPER ÇÖP',
            'ZEHİRLİ ARTIĞI', 'POISON ÇÖP', 'VIPER BOZUK', 'ÇÖP KİMYAGER',
            'KİMYAGER HURDASI', 'VIPER ARTIK', 'ÇÖP POISON', 'BOZUK ZEHİRLİ'
        ],
        parts: ['🧪', '☠️', '💚', '🦂', '🧪', '☠️', '💚', '🦂', '🧪', '☠️', '💚', '🦂']
    },
    cypher: {
        name: 'CYPHER',
        messages: [
            'ÇÖP KAMERA', 'BOZUK CYPHER', 'ÇÖP GİZLİ', 'CYPHER ÇÖP',
            'KAMERA ARTIĞI', 'SPY ÇÖP', 'CYPHER BOZUK', 'ÇÖP GİZLİ',
            'GİZLİ HURDASI', 'CYPHER ARTIK', 'ÇÖP SPY', 'BOZUK KAMERA'
        ],
        parts: ['📷', '👁️', '🕵️', '⚡', '📷', '👁️', '🕵️', '⚡', '📷', '👁️', '🕵️', '⚡']
    },
    reyna: {
        name: 'REYNA',
        messages: [
            'ÇÖP VAMPIRE', 'BOZUK REYNA', 'ÇÖP RADİANT', 'REYNA ÇÖP',
            'VAMPIRE ARTIĞI', 'EMPRESS ÇÖP', 'REYNA BOZUK', 'ÇÖP RADİANT',
            'RADİANT HURDASI', 'REYNA ARTIK', 'ÇÖP EMPRESS', 'BOZUK VAMPIRE'
        ],
        parts: ['🧛', '👑', '💎', '⚡', '🧛', '👑', '💎', '⚡', '🧛', '👑', '💎', '⚡']
    },
    killjoy: {
        name: 'KILLJOY',
        messages: [
            'ÇÖP ROBOT', 'BOZUK KILLJOY', 'ÇÖP MÜHENDİS', 'KILLJOY ÇÖP',
            'ROBOT ARTIĞI', 'TURRET ÇÖP', 'KILLJOY BOZUK', 'ÇÖP MÜHENDİS',
            'MÜHENDİS HURDASI', 'KILLJOY ARTIK', 'ÇÖP TURRET', 'BOZUK ROBOT'
        ],
        parts: ['🤖', '⚙️', '🔧', '💣', '🤖', '⚙️', '🔧', '💣', '🤖', '⚙️', '🔧', '💣']
    },
    breach: {
        name: 'BREACH',
        messages: [
            'ÇÖP PATLAYICI', 'BOZUK BREACH', 'ÇÖP ŞOK', 'BREACH ÇÖP',
            'PATLAYICI ARTIĞI', 'FLASH ÇÖP', 'BREACH BOZUK', 'ÇÖP ŞOK',
            'ŞOK HURDASI', 'BREACH ARTIK', 'ÇÖP FLASH', 'BOZUK PATLAYICI'
        ],
        parts: ['💥', '⚡', '🔨', '💣', '💥', '⚡', '🔨', '💣', '💥', '⚡', '🔨', '💣']
    },
    omen: {
        name: 'OMEN',
        messages: [
            'ÇÖP HAYALET', 'BOZUK OMEN', 'ÇÖP GÖLGE', 'OMEN ÇÖP',
            'HAYALET ARTIĞI', 'SHROUD ÇÖP', 'OMEN BOZUK', 'ÇÖP GÖLGE',
            'GÖLGE HURDASI', 'OMEN ARTIK', 'ÇÖP SHROUD', 'BOZUK HAYALET'
        ],
        parts: ['👻', '💀', '🦇', '🕸️', '👻', '💀', '🦇', '🕸️', '👻', '💀', '🦇', '🕸️']
    },
    jett: {
        name: 'JETT',
        messages: [
            'ÇÖP RÜZGAR', 'BOZUK JETT', 'ÇÖP DÜŞMAN', 'JETT ÇÖP',
            'RÜZGAR ARTIĞI', 'DUELIST ÇÖP', 'JETT BOZUK', 'ÇÖP DÜŞMAN',
            'DÜŞMAN HURDASI', 'JETT ARTIK', 'ÇÖP DUELIST', 'BOZUK RÜZGAR'
        ],
        parts: ['💨', '🌀', '⚡', '🌪️', '💨', '🌀', '⚡', '🌪️', '💨', '🌀', '⚡', '🌪️']
    },
    raze: {
        name: 'RAZE',
        messages: [
            'ÇÖP PATLAYICI', 'BOZUK RAZE', 'ÇÖP GRENADE', 'RAZE ÇÖP',
            'PATLAYICI ARTIĞI', 'SHOWSTOPPER ÇÖP', 'RAZE BOZUK', 'ÇÖP GRENADE',
            'GRENADE HURDASI', 'RAZE ARTIK', 'ÇÖP SHOWSTOPPER', 'BOZUK PATLAYICI'
        ],
        parts: ['💣', '🎆', '🔥', '💥', '💣', '🎆', '🔥', '💥', '💣', '🎆', '🔥', '💥']
    },
    skye: {
        name: 'SKYE',
        messages: [
            'ÇÖP HAYVAN', 'BOZUK SKYE', 'ÇÖP İZCİ', 'SKYE ÇÖP',
            'HAYVAN ARTIĞI', 'GUIDE ÇÖP', 'SKYE BOZUK', 'ÇÖP İZCİ',
            'IZCİ HURDASI', 'SKYE ARTIK', 'ÇÖP GUIDE', 'BOZUK HAYVAN'
        ],
        parts: ['🐺', '🦅', '🌿', '🦊', '🐺', '🦅', '🌿', '🦊', '🐺', '🦅', '🌿', '🦊']
    },
    yoru: {
        name: 'YORU',
        messages: [
            'ÇÖP GÖLGE', 'BOZUK YORU', 'ÇÖP HAYALET', 'YORU ÇÖP',
            'GÖLGE ARTIĞI', 'DIMENSION ÇÖP', 'YORU BOZUK', 'ÇÖP HAYALET',
            'HAYALET HURDASI', 'YORU ARTIK', 'ÇÖP DIMENSION', 'BOZUK GÖLGE'
        ],
        parts: ['👤', '🌀', '⚡', '🌑', '👤', '🌀', '⚡', '🌑', '👤', '🌀', '⚡', '🌑']
    },
    astra: {
        name: 'ASTRA',
        messages: [
            'ÇÖP YILDIZ', 'BOZUK ASTRA', 'ÇÖP KOZMİK', 'ASTRA ÇÖP',
            'YILDIZ ARTIĞI', 'COSMIC ÇÖP', 'ASTRA BOZUK', 'ÇÖP KOZMİK',
            'KOZMİK HURDASI', 'ASTRA ARTIK', 'ÇÖP COSMIC', 'BOZUK YILDIZ'
        ],
        parts: ['⭐', '🌟', '🌌', '🪐', '⭐', '🌟', '🌌', '🪐', '⭐', '🌟', '🌌', '🪐']
    },
    kayo: {
        name: 'KAY/O',
        messages: [
            'ÇÖP ROBOT', 'BOZUK KAYO', 'ÇÖP YENİDEN', 'KAYO ÇÖP',
            'ROBOT ARTIĞI', 'INITIATOR ÇÖP', 'KAYO BOZUK', 'ÇÖP YENİDEN',
            'YENİDEN HURDASI', 'KAYO ARTIK', 'ÇÖP INITIATOR', 'BOZUK ROBOT'
        ],
        parts: ['🤖', '⚙️', '🔧', '💻', '🤖', '⚙️', '🔧', '💻', '🤖', '⚙️', '🔧', '💻']
    },
    chamber: {
        name: 'CHAMBER',
        messages: [
            'ÇÖP SİLAH', 'BOZUK CHAMBER', 'ÇÖP AVCI', 'CHAMBER ÇÖP',
            'SİLAH ARTIĞI', 'SENTINEL ÇÖP', 'CHAMBER BOZUK', 'ÇÖP AVCI',
            'AVCI HURDASI', 'CHAMBER ARTIK', 'ÇÖP SENTINEL', 'BOZUK SİLAH'
        ],
        parts: ['🔫', '🎯', '⚡', '💎', '🔫', '🎯', '⚡', '💎', '🔫', '🎯', '⚡', '💎']
    },
    neon: {
        name: 'NEON',
        messages: [
            'ÇÖP ELEKTRİK', 'BOZUK NEON', 'ÇÖP HIZLI', 'NEON ÇÖP',
            'ELEKTRİK ARTIĞI', 'SPEED ÇÖP', 'NEON BOZUK', 'ÇÖP HIZLI',
            'HIZLI HURDASI', 'NEON ARTIK', 'ÇÖP SPEED', 'BOZUK ELEKTRİK'
        ],
        parts: ['⚡', '💨', '🔋', '🌟', '⚡', '💨', '🔋', '🌟', '⚡', '💨', '🔋', '🌟']
    },
    fade: {
        name: 'FADE',
        messages: [
            'ÇÖP KORKU', 'BOZUK FADE', 'ÇÖP GÖLGE', 'FADE ÇÖP',
            'KORKU ARTIĞI', 'NIGHTMARE ÇÖP', 'FADE BOZUK', 'ÇÖP GÖLGE',
            'GÖLGE HURDASI', 'FADE ARTIK', 'ÇÖP NIGHTMARE', 'BOZUK KORKU'
        ],
        parts: ['👹', '🕸️', '🌑', '💀', '👹', '🕸️', '🌑', '💀', '👹', '🕸️', '🌑', '💀']
    },
    harbor: {
        name: 'HARBOR',
        messages: [
            'ÇÖP SU', 'BOZUK HARBOR', 'ÇÖP DALGA', 'HARBOR ÇÖP',
            'SU ARTIĞI', 'WATER ÇÖP', 'HARBOR BOZUK', 'ÇÖP DALGA',
            'DALGA HURDASI', 'HARBOR ARTIK', 'ÇÖP WATER', 'BOZUK SU'
        ],
        parts: ['🌊', '💧', '🌊', '💧', '🌊', '💧', '🌊', '💧', '🌊', '💧', '🌊', '💧']
    },
    gekko: {
        name: 'GEKKO',
        messages: [
            'ÇÖP HAYVAN', 'BOZUK GEKKO', 'ÇÖP YENİDEN', 'GEKKO ÇÖP',
            'HAYVAN ARTIĞI', 'INITIATOR ÇÖP', 'GEKKO BOZUK', 'ÇÖP YENİDEN',
            'YENİDEN HURDASI', 'GEKKO ARTIK', 'ÇÖP INITIATOR', 'BOZUK HAYVAN'
        ],
        parts: ['🦎', '🐸', '🦎', '🐸', '🦎', '🐸', '🦎', '🐸', '🦎', '🐸', '🦎', '🐸']
    },
    deadlock: {
        name: 'DEADLOCK',
        messages: [
            'ÇÖP TUZAK', 'BOZUK DEADLOCK', 'ÇÖP SENTINEL', 'DEADLOCK ÇÖP',
            'TUZAK ARTIĞI', 'TRAP ÇÖP', 'DEADLOCK BOZUK', 'ÇÖP SENTINEL',
            'SENTINEL HURDASI', 'DEADLOCK ARTIK', 'ÇÖP TRAP', 'BOZUK TUZAK'
        ],
        parts: ['🪤', '⚡', '🪤', '⚡', '🪤', '⚡', '🪤', '⚡', '🪤', '⚡', '🪤', '⚡']
    },
    iso: {
        name: 'ISO',
        messages: [
            'ÇÖP ENERJİ', 'BOZUK ISO', 'ÇÖP DUELIST', 'ISO ÇÖP',
            'ENERJİ ARTIĞI', 'ENERGY ÇÖP', 'ISO BOZUK', 'ÇÖP DUELIST',
            'DUELIST HURDASI', 'ISO ARTIK', 'ÇÖP ENERGY', 'BOZUK ENERJİ'
        ],
        parts: ['⚡', '💎', '⚡', '💎', '⚡', '💎', '⚡', '💎', '⚡', '💎', '⚡', '💎']
    },
    clove: {
        name: 'CLOVE',
        messages: [
            'ÇÖP BULUT', 'BOZUK CLOVE', 'ÇÖP ZEHİR', 'CLOVE ÇÖP',
            'BULUT ARTIĞI', 'CLOUD ÇÖP', 'CLOVE BOZUK', 'ÇÖP ZEHİR',
            'ZEHİR HURDASI', 'CLOVE ARTIK', 'ÇÖP CLOUD', 'BOZUK BULUT'
        ],
        parts: ['☁️', '💨', '☁️', '💨', '☁️', '💨', '☁️', '💨', '☁️', '💨', '☁️', '💨']
    },
    vyse: {
        name: 'VYSE',
        messages: [
            'ÇÖP METAL', 'BOZUK VYSE', 'ÇÖP SENTINEL', 'VYSE ÇÖP',
            'METAL ARTIĞI', 'STEEL ÇÖP', 'VYSE BOZUK', 'ÇÖP SENTINEL',
            'SENTINEL HURDASI', 'VYSE ARTIK', 'ÇÖP STEEL', 'BOZUK METAL'
        ],
        parts: ['⚙️', '🔧', '⚙️', '🔧', '⚙️', '🔧', '⚙️', '🔧', '⚙️', '🔧', '⚙️', '🔧']
    },
    tejo: {
        name: 'TEJO',
        messages: [
            'ÇÖP ATEŞ', 'BOZUK TEJO', 'ÇÖP PATLAMA', 'TEJO ÇÖP',
            'ATEŞ ARTIĞI', 'BLAST ÇÖP', 'TEJO BOZUK', 'ÇÖP PATLAMA',
            'PATLAMA HURDASI', 'TEJO ARTIK', 'ÇÖP BLAST', 'BOZUK ATEŞ'
        ],
        parts: ['🔥', '💥', '🔥', '💥', '🔥', '💥', '🔥', '💥', '🔥', '💥', '🔥', '💥']
    },
    waylay: {
        name: 'WAYLAY',
        messages: [
            'ÇÖP TUZAK', 'BOZUK WAYLAY', 'ÇÖP SENTINEL', 'WAYLAY ÇÖP',
            'TUZAK ARTIĞI', 'TRAP ÇÖP', 'WAYLAY BOZUK', 'ÇÖP SENTINEL',
            'SENTINEL HURDASI', 'WAYLAY ARTIK', 'ÇÖP TRAP', 'BOZUK TUZAK'
        ],
        parts: ['🪤', '⚡', '🪤', '⚡', '🪤', '⚡', '🪤', '⚡', '🪤', '⚡', '🪤', '⚡']
    }
};

// Tüm komutları güncellenmiş hali ile export et
export const ALL_COMMANDS = {
    ...MOVEMENT_COMMANDS,
    ...EFFECT_COMMANDS,
    ...SPECIAL_EFFECTS,
    ...GAME_COMMANDS,
    ...SPECIAL_CHARACTER_COMMANDS
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

