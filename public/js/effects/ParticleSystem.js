// public/js/effects/ParticleSystem.js - Parçacık efekt sistemi

import { CONFIG } from '../utils/Config.js';
import { createElement, removeElement, getRandomFromArray, logger } from '../utils/Utils.js';

/**
 * Parçacık Sistemi - Tüm parçacık efektlerini yönetir
 */
export class ParticleSystem {
    constructor() {
        this.activeParticles = new Set();
        this.particleCount = 0;
        this.maxParticles = 500;
        
        // Get particles container
        this.container = document.getElementById('particlesContainer');
        if (!this.container) {
            this.createContainer();
        }
        
        this.animationTypes = new Map();
        this.initializeAnimationTypes();
        
        logger.effect('ParticleSystem initialized');
    }

    /**
     * Particles container oluştur
     */
    createContainer() {
        this.container = createElement('div');
        this.container.id = 'particlesContainer';
        this.container.className = 'particles-container';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
        `;
        document.body.appendChild(this.container);
    }

    /**
     * Animasyon tiplerini başlat
     */
    initializeAnimationTypes() {
        this.animationTypes.set('float', {
            keyframes: [
                { transform: 'translateY(0) scale(1) rotate(0deg)', opacity: 1 },
                { transform: 'translateY(-250px) scale(0.3) rotate(720deg)', opacity: 0 }
            ],
            options: { duration: 3000, easing: 'ease-out' }
        });

        this.animationTypes.set('fall', {
            keyframes: [
                { transform: 'translateY(-50px) translateX(0)', opacity: 1 },
                { transform: 'translateY(1130px) translateX(200px)', opacity: 0 }
            ],
            options: { duration: 5000, easing: 'linear' }
        });

        this.animationTypes.set('rise', {
            keyframes: [
                { transform: 'translateY(0) scale(1)', opacity: 1 },
                { transform: 'translateY(-200px) scale(1.2)', opacity: 0.8 },
                { transform: 'translateY(-400px) scale(0.5)', opacity: 0 }
            ],
            options: { duration: 3000, easing: 'ease-out' }
        });

        this.animationTypes.set('explode', {
            keyframes: [
                { transform: 'scale(0) rotate(0deg)', opacity: 1 },
                { transform: 'scale(1.5) rotate(180deg)', opacity: 0.8 },
                { transform: 'scale(2) rotate(360deg)', opacity: 0 }
            ],
            options: { duration: 1500, easing: 'ease-out' }
        });

        this.animationTypes.set('spiral', {
            keyframes: [
                { transform: 'rotate(0deg) translateX(0px) rotate(0deg)', opacity: 1 },
                { transform: 'rotate(180deg) translateX(100px) rotate(-180deg)', opacity: 0.8 },
                { transform: 'rotate(360deg) translateX(200px) rotate(-360deg)', opacity: 0 }
            ],
            options: { duration: 4000, easing: 'ease-in-out' }
        });

        this.animationTypes.set('bounce', {
            keyframes: [
                { transform: 'translateY(0) scaleY(1)', opacity: 1 },
                { transform: 'translateY(-100px) scaleY(1.2)', opacity: 0.9 },
                { transform: 'translateY(-50px) scaleY(0.8)', opacity: 0.7 },
                { transform: 'translateY(-150px) scaleY(1)', opacity: 0.5 },
                { transform: 'translateY(-300px) scaleY(0.5)', opacity: 0 }
            ],
            options: { duration: 2000, easing: 'ease-in-out' }
        });
    }

    /**
     * Parçacık oluştur
     */
    create(emoji, count = 10, duration = 3000, animationType = 'float') {
        if (this.particleCount >= this.maxParticles) {
            logger.warn('Max particle limit reached');
            return false;
        }

        const particles = [];
        
        for (let i = 0; i < count; i++) {
            const particle = this.createSingleParticle(emoji, duration, animationType);
            if (particle) {
                particles.push(particle);
                
                // Slight delay between particles
                setTimeout(() => {
                    if (particle.parentNode) {
                        this.animateParticle(particle, animationType, duration);
                    }
                }, i * 50);
            }
        }

        logger.effect(`Created ${particles.length} ${emoji} particles`);
        return particles;
    }

    /**
     * Tek parçacık oluştur
     */
    createSingleParticle(emoji, duration, animationType) {
        if (this.particleCount >= this.maxParticles) {
            return null;
        }

        const particle = createElement('div', 'particle');
        particle.innerHTML = emoji;
        
        // Random position
        const x = Math.random() * window.innerWidth;
        const y = animationType === 'fall' ? -50 : Math.random() * window.innerHeight;
        
        // Random size
        const size = Math.random() * 25 + 15;
        
        particle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            font-size: ${size}px;
            pointer-events: none;
            z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
            user-select: none;
        `;

        // Add particle ID
        const particleId = `particle_${Date.now()}_${Math.random()}`;
        particle.setAttribute('data-particle-id', particleId);

        // Add to container and tracking
        this.container.appendChild(particle);
        this.activeParticles.add(particleId);
        this.particleCount++;

        // Auto cleanup
        setTimeout(() => {
            this.removeParticle(particleId);
        }, duration + 1000);

        return particle;
    }

    /**
     * Parçacığı animasyonla
     */
    animateParticle(particle, animationType = 'float', duration = 3000) {
        const animation = this.animationTypes.get(animationType);
        
        if (!animation) {
            logger.warn(`Unknown animation type: ${animationType}`);
            return;
        }

        try {
            const animationOptions = {
                ...animation.options,
                duration: duration
            };

            const webAnimation = particle.animate(animation.keyframes, animationOptions);
            
            webAnimation.addEventListener('finish', () => {
                const particleId = particle.getAttribute('data-particle-id');
                if (particleId) {
                    this.removeParticle(particleId);
                }
            });

        } catch (error) {
            logger.error('Error animating particle:', error);
        }
    }

    /**
     * Belirli konumda parçacık oluştur
     */
    createAt(emoji, x, y, count = 5, animationType = 'explode') {
        const particles = [];
        
        for (let i = 0; i < count; i++) {
            const particle = createElement('div', 'particle');
            particle.innerHTML = emoji;
            
            // Random offset from position
            const offsetX = (Math.random() - 0.5) * 100;
            const offsetY = (Math.random() - 0.5) * 100;
            
            particle.style.cssText = `
                position: absolute;
                left: ${x + offsetX}px;
                top: ${y + offsetY}px;
                font-size: ${Math.random() * 20 + 15}px;
                pointer-events: none;
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
            `;

            const particleId = `particle_${Date.now()}_${i}`;
            particle.setAttribute('data-particle-id', particleId);

            this.container.appendChild(particle);
            this.activeParticles.add(particleId);
            this.particleCount++;

            this.animateParticle(particle, animationType, 2000);
            particles.push(particle);
        }

        return particles;
    }

    /**
     * Parçacık zinciri oluştur (bir parçacık bittiğinde diğeri başlar)
     */
    createChain(emojis, count = 5, duration = 2000) {
        if (!Array.isArray(emojis) || emojis.length === 0) {
            return false;
        }

        let currentIndex = 0;
        
        const createNext = () => {
            if (currentIndex >= emojis.length) {
                return;
            }

            const emoji = emojis[currentIndex];
            this.create(emoji, count, duration);

            currentIndex++;
            
            if (currentIndex < emojis.length) {
                setTimeout(createNext, duration / 2);
            }
        };

        createNext();
        return true;
    }

    /**
     * Circular burst effect
     */
    createBurst(emoji, x, y, particleCount = 12) {
        const particles = [];
        const angleStep = (2 * Math.PI) / particleCount;

        for (let i = 0; i < particleCount; i++) {
            const angle = i * angleStep;
            const distance = 100 + Math.random() * 100;
            
            const targetX = x + Math.cos(angle) * distance;
            const targetY = y + Math.sin(angle) * distance;

            const particle = createElement('div', 'particle');
            particle.innerHTML = emoji;
            particle.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                font-size: ${Math.random() * 20 + 10}px;
                pointer-events: none;
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
            `;

            const particleId = `burst_${Date.now()}_${i}`;
            particle.setAttribute('data-particle-id', particleId);

            this.container.appendChild(particle);
            this.activeParticles.add(particleId);
            this.particleCount++;

            // Animate to target position
            particle.animate([
                { left: `${x}px`, top: `${y}px`, opacity: 1, transform: 'scale(0.5)' },
                { left: `${targetX}px`, top: `${targetY}px`, opacity: 0, transform: 'scale(1.5)' }
            ], {
                duration: 1500,
                easing: 'ease-out'
            }).addEventListener('finish', () => {
                this.removeParticle(particleId);
            });

            particles.push(particle);
        }

        return particles;
    }

    /**
     * Text particle effect
     */
    createTextParticles(text, x, y, options = {}) {
        const chars = text.split('');
        const particles = [];

        const defaultOptions = {
            fontSize: 20,
            color: '#ffffff',
            animationType: 'rise',
            duration: 3000,
            spacing: 30
        };

        const opts = { ...defaultOptions, ...options };

        chars.forEach((char, index) => {
            if (char.trim()) {
                const particle = createElement('div', 'particle text-particle');
                particle.textContent = char;
                
                const charX = x + (index * opts.spacing);
                const charY = y;

                particle.style.cssText = `
                    position: absolute;
                    left: ${charX}px;
                    top: ${charY}px;
                    font-size: ${opts.fontSize}px;
                    color: ${opts.color};
                    font-weight: bold;
                    pointer-events: none;
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                    text-shadow: 0 0 10px ${opts.color};
                `;

                const particleId = `text_${Date.now()}_${index}`;
                particle.setAttribute('data-particle-id', particleId);

                this.container.appendChild(particle);
                this.activeParticles.add(particleId);
                this.particleCount++;

                // Delayed animation for wave effect
                setTimeout(() => {
                    this.animateParticle(particle, opts.animationType, opts.duration);
                }, index * 100);

                particles.push(particle);
            }
        });

        return particles;
    }

    /**
     * Parçacığı kaldır
     */
    removeParticle(particleId) {
        if (!this.activeParticles.has(particleId)) {
            return false;
        }

        const particle = this.container.querySelector(`[data-particle-id="${particleId}"]`);
        if (particle) {
            removeElement(particle);
        }

        this.activeParticles.delete(particleId);
        this.particleCount = Math.max(0, this.particleCount - 1);

        return true;
    }

    /**
     * Belirli emoji tipindeki tüm parçacıkları kaldır
     */
    removeParticlesByEmoji(emoji) {
        const particles = this.container.querySelectorAll('.particle');
        let removedCount = 0;

        particles.forEach(particle => {
            if (particle.innerHTML === emoji) {
                const particleId = particle.getAttribute('data-particle-id');
                if (particleId) {
                    this.removeParticle(particleId);
                    removedCount++;
                }
            }
        });

        logger.effect(`Removed ${removedCount} ${emoji} particles`);
        return removedCount;
    }

    /**
     * Tüm parçacıkları temizle
     */
    clearAll() {
        this.activeParticles.forEach(particleId => {
            const particle = this.container.querySelector(`[data-particle-id="${particleId}"]`);
            if (particle) {
                removeElement(particle);
            }
        });

        this.activeParticles.clear();
        this.particleCount = 0;

        logger.effect('All particles cleared');
    }

    /**
     * Parçacık istatistikleri
     */
    getStats() {
        return {
            activeParticles: this.activeParticles.size,
            particleCount: this.particleCount,
            maxParticles: this.maxParticles,
            containerExists: !!this.container,
            animationTypes: Array.from(this.animationTypes.keys())
        };
    }

    /**
     * Performance optimizasyonu
     */
    optimizePerformance() {
        // Remove particles that are outside viewport
        const particles = this.container.querySelectorAll('.particle');
        let removedCount = 0;

        particles.forEach(particle => {
            const rect = particle.getBoundingClientRect();
            const isOutside = (
                rect.bottom < -100 ||
                rect.top > window.innerHeight + 100 ||
                rect.right < -100 ||
                rect.left > window.innerWidth + 100
            );

            if (isOutside) {
                const particleId = particle.getAttribute('data-particle-id');
                if (particleId) {
                    this.removeParticle(particleId);
                    removedCount++;
                }
            }
        });

        if (removedCount > 0) {
            logger.effect(`Optimized: removed ${removedCount} particles outside viewport`);
        }

        return removedCount;
    }

    /**
     * Max particle limit ayarla
     */
    setMaxParticles(limit) {
        this.maxParticles = Math.max(0, limit);
        
        // If current count exceeds new limit, remove oldest particles
        if (this.particleCount > this.maxParticles) {
            const excess = this.particleCount - this.maxParticles;
            const particles = Array.from(this.container.querySelectorAll('.particle'));
            
            particles.slice(0, excess).forEach(particle => {
                const particleId = particle.getAttribute('data-particle-id');
                if (particleId) {
                    this.removeParticle(particleId);
                }
            });
        }
    }

    /**
     * Rastgele parçacık efekti
     */
    createRandom(count = 10, duration = 3000) {
        const emojis = ['✨', '🌟', '⭐', '💫', '🔥', '❄️', '🌈', '💎'];
        const animations = Array.from(this.animationTypes.keys());
        
        for (let i = 0; i < count; i++) {
            const emoji = getRandomFromArray(emojis);
            const animation = getRandomFromArray(animations);
            
            this.create(emoji, 1, duration, animation);
        }
        
        return true;
    }

    /**
     * Container'ı temizle ve yeniden oluştur
     */
    reset() {
        this.clearAll();
        
        if (this.container && this.container.parentNode) {
            removeElement(this.container);
        }
        
        this.createContainer();
        logger.effect('ParticleSystem reset');
    }

    /**
     * Cleanup ve kapatma
     */
    destroy() {
        this.clearAll();
        
        if (this.container && this.container.parentNode) {
            removeElement(this.container);
        }
        
        this.activeParticles.clear();
        this.animationTypes.clear();
        this.particleCount = 0;
        
        logger.effect('ParticleSystem destroyed');
    }
}

export default ParticleSystem;