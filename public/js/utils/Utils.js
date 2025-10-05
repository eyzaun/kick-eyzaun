// public/js/utils/Utils.js - Yardımcı fonksiyonlar

import { CONFIG } from './Config.js';

/**
 * URL'den kanal adını al
 */
export function getChannelFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const channelParam = urlParams.get('channel');
    return channelParam || CONFIG.KICK.DEFAULT_CHANNEL;
}

/**
 * Rastgele pozisyon oluştur
 */
export function getRandomPosition() {
    const safeMargin = CONFIG.SCREEN.SAFE_MARGIN;
    const avatarSize = CONFIG.AVATAR.SIZE;
    
    return {
        x: safeMargin + Math.random() * (CONFIG.SCREEN.WIDTH - 2 * safeMargin - avatarSize),
        y: safeMargin + Math.random() * (CONFIG.SCREEN.HEIGHT - 2 * safeMargin - avatarSize)
    };
}

/**
 * Pozisyonu ekran sınırları içinde tut
 */
export function clampPosition(position) {
    const avatarSize = CONFIG.AVATAR.SIZE;
    
    return {
        x: Math.max(0, Math.min(CONFIG.SCREEN.WIDTH - avatarSize, position.x)),
        y: Math.max(0, Math.min(CONFIG.SCREEN.HEIGHT - avatarSize, position.y))
    };
}

/**
 * DOM elementi oluştur
 */
export function createElement(tag, className = '', textContent = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
}

/**
 * Element'i güvenli şekilde kaldır
 */
export function removeElement(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}

/**
 * Async setTimeout
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Debounce fonksiyonu
 */
export function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

/**
 * Throttle fonksiyonu
 */
export function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Rastgele dizi elementi seç
 */
export function getRandomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Rastgele renk oluştur
 */
export function getRandomColor() {
    const colors = [
        '#ff69b4', '#00ff00', '#00bfff', '#ff4400', 
        '#ffff00', '#ff0080', '#00ff80', '#8000ff'
    ];
    return getRandomFromArray(colors);
}

/**
 * Hex rengini RGB'ye çevir
 */
export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * İki nokta arası mesafe hesapla
 */
export function getDistance(pos1, pos2) {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Açı hesapla (radyan)
 */
export function getAngle(pos1, pos2) {
    return Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x);
}

/**
 * Derece -> Radyan
 */
export function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Radyan -> Derece
 */
export function radToDeg(radians) {
    return radians * (180 / Math.PI);
}

/**
 * Animasyon frame'i için requestAnimationFrame wrapper
 */
export function nextFrame() {
    return new Promise(resolve => requestAnimationFrame(resolve));
}

/**
 * CSS style uygulamak için yardımcı
 */
export function setStyles(element, styles) {
    Object.entries(styles).forEach(([property, value]) => {
        element.style[property] = value;
    });
}

/**
 * Class toggle yardımcısı
 */
export function toggleClass(element, className, condition) {
    if (condition) {
        element.classList.add(className);
    } else {
        element.classList.remove(className);
    }
}

/**
 * Local storage wrapper (güvenli)
 */
export const storage = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn('Storage get error:', error);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn('Storage set error:', error);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn('Storage remove error:', error);
            return false;
        }
    }
};

/**
 * Console log wrapper (debug modunda)
 */
export const logger = {
    debug(...args) {
        if (CONFIG.DEBUG.ENABLED) {
            console.log('[DEBUG]', ...args);
        }
    },

    info(...args) {
        console.log('[INFO]', ...args);
    },

    warn(...args) {
        console.warn('[WARN]', ...args);
    },

    error(...args) {
        console.error('[ERROR]', ...args);
    },

    websocket(...args) {
        if (CONFIG.DEBUG.LOG_WEBSOCKET) {
            console.log('[WS]', ...args);
        }
    },

    command(...args) {
        if (CONFIG.DEBUG.LOG_COMMANDS) {
            console.log('[CMD]', ...args);
        }
    },

    effect(...args) {
        if (CONFIG.DEBUG.LOG_EFFECTS) {
            console.log('[FX]', ...args);
        }
    },

    avatar(...args) {
        if (CONFIG.DEBUG.LOG_AVATARS) {
            console.log('[AVATAR]', ...args);
        }
    },

    game(...args) {
        if (CONFIG.DEBUG.LOG_EFFECTS) { // Use same config as effects for now
            console.log('[GAME]', ...args);
        }
    }
};
export class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
    }

    start(name) {
        this.metrics.set(name, performance.now());
    }

    end(name) {
        const startTime = this.metrics.get(name);
        if (startTime) {
            const duration = performance.now() - startTime;
            this.metrics.delete(name);
            logger.debug(`Performance: ${name} took ${duration.toFixed(2)}ms`);
            return duration;
        }
        return 0;
    }

    memory() {
        if (performance.memory) {
            return {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                total: Math.round(performance.memory.totalJSHeapSize / 1048576),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
            };
        }
        return null;
    }
}

/**
 * Zaman formatları
 */
export function formatUptime(ms) {
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Sayı formatları
 */
export function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

/**
 * CSS animasyon yardımcıları
 */
export function addTemporaryClass(element, className, duration = 1000) {
    element.classList.add(className);
    setTimeout(() => {
        element.classList.remove(className);
    }, duration);
}

/**
 * Event delegation helper
 */
export function delegate(container, selector, event, handler) {
    container.addEventListener(event, (e) => {
        const target = e.target.closest(selector);
        if (target && container.contains(target)) {
            handler.call(target, e);
        }
    });
}

/**
 * URL validation
 */
export function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

/**
 * Cooldown yönetimi
 */
export class CooldownManager {
    constructor() {
        this.cooldowns = new Map();
    }

    isOnCooldown(key) {
        const cooldown = this.cooldowns.get(key);
        if (!cooldown) return false;
        return Date.now() < cooldown;
    }

    setCooldown(key, duration) {
        this.cooldowns.set(key, Date.now() + duration);
        
        // Cleanup expired cooldowns
        setTimeout(() => {
            if (this.cooldowns.get(key) <= Date.now()) {
                this.cooldowns.delete(key);
            }
        }, duration + 1000);
    }

    getRemainingTime(key) {
        const cooldown = this.cooldowns.get(key);
        if (!cooldown) return 0;
        return Math.max(0, cooldown - Date.now());
    }

    clear() {
        this.cooldowns.clear();
    }
}

/**
 * Animation helper
 */
export function animate(element, keyframes, options = {}) {
    const animation = element.animate(keyframes, {
        duration: 1000,
        easing: 'ease',
        fill: 'forwards',
        ...options
    });

    return new Promise((resolve) => {
        animation.addEventListener('finish', resolve);
    });
}

export default {
    getChannelFromURL,
    getRandomPosition,
    clampPosition,
    createElement,
    removeElement,
    sleep,
    debounce,
    throttle,
    getRandomFromArray,
    getRandomColor,
    hexToRgb,
    getDistance,
    getAngle,
    degToRad,
    radToDeg,
    nextFrame,
    setStyles,
    toggleClass,
    storage,
    logger,
    PerformanceMonitor,
    formatUptime,
    formatNumber,
    addTemporaryClass,
    delegate,
    isValidUrl,
    CooldownManager,
    animate
};