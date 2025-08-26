// public/js/utils/EventEmitter.js - Event sistemi

import { logger } from './Utils.js';

/**
 * Basit Event Emitter implementasyonu
 */
export class EventEmitter {
    constructor() {
        this.events = new Map();
        this.maxListeners = 10;
        this.debugMode = false;
    }

    /**
     * Event listener ekle
     */
    on(event, callback) {
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function');
        }

        if (!this.events.has(event)) {
            this.events.set(event, []);
        }

        const listeners = this.events.get(event);
        
        // Max listener kontrolü
        if (listeners.length >= this.maxListeners) {
            logger.warn(`Max listeners (${this.maxListeners}) exceeded for event: ${event}`);
        }

        listeners.push(callback);

        if (this.debugMode) {
            logger.debug(`Listener added for event: ${event} (total: ${listeners.length})`);
        }

        return this;
    }

    /**
     * Tek seferlik event listener ekle
     */
    once(event, callback) {
        const wrapper = (...args) => {
            this.off(event, wrapper);
            callback.apply(this, args);
        };

        return this.on(event, wrapper);
    }

    /**
     * Event listener kaldır
     */
    off(event, callback) {
        if (!this.events.has(event)) {
            return this;
        }

        if (callback) {
            const listeners = this.events.get(event);
            const index = listeners.indexOf(callback);
            
            if (index > -1) {
                listeners.splice(index, 1);
                
                if (this.debugMode) {
                    logger.debug(`Listener removed for event: ${event} (remaining: ${listeners.length})`);
                }
                
                // Eğer listener kalmadıysa event'i tamamen kaldır
                if (listeners.length === 0) {
                    this.events.delete(event);
                }
            }
        } else {
            // Callback verilmemişse tüm listener'ları kaldır
            this.events.delete(event);
            
            if (this.debugMode) {
                logger.debug(`All listeners removed for event: ${event}`);
            }
        }

        return this;
    }

    /**
     * Event emit et
     */
    emit(event, ...args) {
        if (!this.events.has(event)) {
            if (this.debugMode) {
                logger.debug(`No listeners for event: ${event}`);
            }
            return false;
        }

        const listeners = this.events.get(event);
        
        if (this.debugMode) {
            logger.debug(`Emitting event: ${event} to ${listeners.length} listeners`);
        }

        // Listener'ları async çalıştır (hata bir listener'ı etkilemesin)
        listeners.forEach((callback, index) => {
            try {
                // Promise destekli callback'ler için
                const result = callback.apply(this, args);
                if (result && typeof result.catch === 'function') {
                    result.catch(error => {
                        logger.error(`Error in async listener ${index} for event ${event}:`, error);
                    });
                }
            } catch (error) {
                logger.error(`Error in listener ${index} for event ${event}:`, error);
            }
        });

        return true;
    }

    /**
     * Belirli bir event için listener sayısını al
     */
    listenerCount(event) {
        if (!this.events.has(event)) {
            return 0;
        }
        return this.events.get(event).length;
    }

    /**
     * Tüm event isimlerini al
     */
    eventNames() {
        return Array.from(this.events.keys());
    }

    /**
     * Belirli bir event için listener'ları al
     */
    listeners(event) {
        if (!this.events.has(event)) {
            return [];
        }
        return [...this.events.get(event)];
    }

    /**
     * Tüm listener'ları kaldır
     */
    removeAllListeners(event) {
        if (event) {
            this.events.delete(event);
        } else {
            this.events.clear();
        }

        if (this.debugMode) {
            logger.debug(event ? `All listeners removed for event: ${event}` : 'All listeners removed');
        }

        return this;
    }

    /**
     * Max listener sayısını ayarla
     */
    setMaxListeners(n) {
        if (typeof n !== 'number' || n < 0) {
            throw new Error('Max listeners must be a positive number');
        }
        this.maxListeners = n;
        return this;
    }

    /**
     * Debug modunu aç/kapat
     */
    setDebugMode(enabled) {
        this.debugMode = enabled;
        return this;
    }

    /**
     * Event istatistikleri al
     */
    getStats() {
        const stats = {
            eventCount: this.events.size,
            totalListeners: 0,
            events: {}
        };

        this.events.forEach((listeners, event) => {
            stats.totalListeners += listeners.length;
            stats.events[event] = listeners.length;
        });

        return stats;
    }
}

/**
 * Async Event Emitter - Promise destekli
 */
export class AsyncEventEmitter extends EventEmitter {
    
    /**
     * Async event emit et - tüm listener'ların bitmesini bekle
     */
    async emitAsync(event, ...args) {
        if (!this.events.has(event)) {
            return false;
        }

        const listeners = this.events.get(event);
        
        if (this.debugMode) {
            logger.debug(`Emitting async event: ${event} to ${listeners.length} listeners`);
        }

        // Tüm listener'ları paralel olarak çalıştır
        const promises = listeners.map(async (callback, index) => {
            try {
                return await callback.apply(this, args);
            } catch (error) {
                logger.error(`Error in async listener ${index} for event ${event}:`, error);
                throw error;
            }
        });

        try {
            const results = await Promise.allSettled(promises);
            
            // Hata olan listener'ları logla
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    logger.error(`Async listener ${index} failed for event ${event}:`, result.reason);
                }
            });

            return true;
        } catch (error) {
            logger.error(`Error in async emit for event ${event}:`, error);
            return false;
        }
    }
}

/**
 * Global event emitter instance
 */
export const globalEvents = new EventEmitter();

/**
 * Event middleware sistemi
 */
export class EventMiddleware {
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
        this.middlewares = [];
    }

    /**
     * Middleware ekle
     */
    use(middleware) {
        if (typeof middleware !== 'function') {
            throw new Error('Middleware must be a function');
        }
        this.middlewares.push(middleware);
        return this;
    }

    /**
     * Event emit et (middleware'ler üzerinden)
     */
    async emit(event, ...args) {
        let eventData = {
            event,
            args,
            stopped: false,
            preventDefault: () => { eventData.stopped = true; }
        };

        // Middleware'leri sırayla çalıştır
        for (const middleware of this.middlewares) {
            try {
                await middleware(eventData);
                if (eventData.stopped) {
                    logger.debug(`Event ${event} prevented by middleware`);
                    return false;
                }
            } catch (error) {
                logger.error(`Middleware error for event ${event}:`, error);
            }
        }

        // Middleware'ler geçtiyse normal emit yap
        return this.eventEmitter.emit(eventData.event, ...eventData.args);
    }
}

/**
 * Event throttling/debouncing yardımcıları
 */
export class ThrottledEventEmitter extends EventEmitter {
    constructor() {
        super();
        this.throttledEvents = new Map();
        this.debouncedEvents = new Map();
    }

    /**
     * Throttled event emit
     */
    throttledEmit(event, delay = 100, ...args) {
        const key = `throttled_${event}`;
        
        if (!this.throttledEvents.has(key)) {
            this.emit(event, ...args);
            this.throttledEvents.set(key, true);
            
            setTimeout(() => {
                this.throttledEvents.delete(key);
            }, delay);
        }
    }

    /**
     * Debounced event emit
     */
    debouncedEmit(event, delay = 100, ...args) {
        const key = `debounced_${event}`;
        
        // Önceki timeout'u iptal et
        if (this.debouncedEvents.has(key)) {
            clearTimeout(this.debouncedEvents.get(key));
        }

        // Yeni timeout ayarla
        const timeoutId = setTimeout(() => {
            this.emit(event, ...args);
            this.debouncedEvents.delete(key);
        }, delay);

        this.debouncedEvents.set(key, timeoutId);
    }
}

/**
 * Event namespace sistemi
 */
export class NamespacedEventEmitter extends EventEmitter {
    
    /**
     * Namespace ile event emit et
     */
    emitNamespaced(namespace, event, ...args) {
        const namespacedEvent = `${namespace}:${event}`;
        
        // Hem namespace'li hem de genel event emit et
        this.emit(namespacedEvent, ...args);
        this.emit(event, ...args);
    }

    /**
     * Namespace ile listener ekle
     */
    onNamespaced(namespace, event, callback) {
        const namespacedEvent = `${namespace}:${event}`;
        return this.on(namespacedEvent, callback);
    }

    /**
     * Namespace'deki tüm event'leri temizle
     */
    clearNamespace(namespace) {
        const eventsToRemove = this.eventNames().filter(event => 
            event.startsWith(`${namespace}:`)
        );
        
        eventsToRemove.forEach(event => {
            this.removeAllListeners(event);
        });
    }
}

export default EventEmitter;