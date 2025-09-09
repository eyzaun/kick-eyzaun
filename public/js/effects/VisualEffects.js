// public/js/effects/VisualEffects.js - Görsel efektler

import { ParticleSystem } from './ParticleSystem.js';
import { SoundEffects } from './SoundEffects.js';
import { CONFIG } from '../utils/Config.js';
import { createElement, removeElement, sleep, logger } from '../utils/Utils.js';

/**
 * Visual Effects sınıfı - Tüm görsel efektleri yönetir
 */
export class VisualEffects {
    constructor() {
        this.particleSystem = new ParticleSystem();
        this.soundEffects = new SoundEffects();
        this.activeEffects = new Set();
        
        logger.effect('VisualEffects initialized');
    }

    // BASIC EFFECTS

    /**
     * Patlama efekti
     */
    async createExplosion() {
        const effectId = 'explosion_' + Date.now();
        this.activeEffects.add(effectId);
        
        try {
            // Main explosion element
            const explosion = createElement('div');
            explosion.innerHTML = '💥';
            explosion.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 80px;
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                pointer-events: none;
                filter: drop-shadow(0 0 20px #ff4444);
            `;

            document.body.appendChild(explosion);

            // Animate explosion
            explosion.animate([
                { fontSize: '80px', opacity: 1, transform: 'translate(-50%, -50%) scale(0.3)' },
                { fontSize: '250px', opacity: 0.9, transform: 'translate(-50%, -50%) scale(2.5)' },
                { fontSize: '400px', opacity: 0, transform: 'translate(-50%, -50%) scale(4)' }
            ], {
                duration: 2500,
                easing: 'ease-out'
            });

            // Add particles
            this.particleSystem.create('🔥', CONFIG.EFFECTS.PARTICLE_COUNT.LARGE, 2500);
            this.particleSystem.create('💥', CONFIG.EFFECTS.PARTICLE_COUNT.SMALL, 2000);

            // Sound effect
            this.soundEffects.playExplosion();

            // Cleanup
            setTimeout(() => {
                removeElement(explosion);
                this.activeEffects.delete(effectId);
            }, 2500);

            return true;

        } catch (error) {
            logger.error('Error creating explosion:', error);
            this.activeEffects.delete(effectId);
            return false;
        }
    }

    /**
     * Şimşek çakması
     */
    async createLightning() {
        const effectId = 'lightning_' + Date.now();
        this.activeEffects.add(effectId);
        
        try {
            const flash = createElement('div');
            flash.className = 'lightning-flash';
            flash.style.animation = 'lightningFlash 1.8s ease-out forwards';
            document.body.appendChild(flash);

            // Sound effect
            this.soundEffects.playLightning();

            setTimeout(() => {
                removeElement(flash);
                this.activeEffects.delete(effectId);
            }, 1800);

            return true;

        } catch (error) {
            logger.error('Error creating lightning:', error);
            this.activeEffects.delete(effectId);
            return false;
        }
    }

    /**
     * Kar yağışı
     */
    async createSnow() {
        const effectId = 'snow_' + Date.now();
        this.activeEffects.add(effectId);
        
        try {
            const snowflakes = ['❄️', '🌨️', '⭐'];
            
            for (let i = 0; i < 60; i++) {
                setTimeout(() => {
                    const snowflake = createElement('div');
                    snowflake.innerHTML = snowflakes[Math.floor(Math.random() * snowflakes.length)];
                    snowflake.className = 'particle';
                    snowflake.style.cssText = `
                        position: absolute;
                        left: ${Math.random() * 100}vw;
                        top: -50px;
                        font-size: ${Math.random() * 20 + 10}px;
                        animation: particleFloat ${Math.random() * 3 + 2}s linear forwards;
                        animation-delay: ${Math.random() * 2}s;
                        z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                        pointer-events: none;
                    `;

                    const container = document.getElementById('particlesContainer');
                    if (container) {
                        container.appendChild(snowflake);

                        setTimeout(() => {
                            removeElement(snowflake);
                        }, 5000);
                    }
                }, i * 50);
            }

            // Sound effect
            this.soundEffects.playWind();

            setTimeout(() => {
                this.activeEffects.delete(effectId);
            }, 5000);

            return true;

        } catch (error) {
            logger.error('Error creating snow:', error);
            this.activeEffects.delete(effectId);
            return false;
        }
    }

    /**
     * Ateş efekti
     */
    async createFire() {
        this.particleSystem.create('🔥', CONFIG.EFFECTS.PARTICLE_COUNT.LARGE, CONFIG.EFFECTS.DURATIONS.MEDIUM);
        this.soundEffects.playFire();
        return true;
    }

    /**
     * Konfeti patlaması
     */
    async createConfetti() {
        const emojis = ['🎉', '🎊', '✨', '🌟', '🎈'];
        
        for (const emoji of emojis) {
            this.particleSystem.create(emoji, CONFIG.EFFECTS.PARTICLE_COUNT.SMALL, CONFIG.EFFECTS.DURATIONS.SHORT);
        }

        this.soundEffects.playCelebration();
        return true;
    }

    /**
     * Kalp yağmuru
     */
    async createHearts() {
        const hearts = ['💖', '💕', '💗', '💝', '💞'];
        
        for (const heart of hearts) {
            this.particleSystem.create(heart, CONFIG.EFFECTS.PARTICLE_COUNT.SMALL, CONFIG.EFFECTS.DURATIONS.SHORT);
        }

        this.soundEffects.playHearts();
        return true;
    }

    /**
     * Gökkuşağı efekti
     */
    async createRainbow() {
        const effectId = 'rainbow_' + Date.now();
        this.activeEffects.add(effectId);
        
        try {
            const rainbow = createElement('div');
            rainbow.innerHTML = '🌈';
            rainbow.style.cssText = `
                position: fixed;
                top: 30%;
                left: 50%;
                transform: translateX(-50%);
                font-size: 100px;
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                pointer-events: none;
                filter: drop-shadow(0 0 20px #ff69b4);
            `;
            document.body.appendChild(rainbow);

            rainbow.animate([
                { transform: 'translateX(-50%) translateY(-100px) scale(0)', opacity: 0 },
                { transform: 'translateX(-50%) translateY(0) scale(1)', opacity: 1 },
                { transform: 'translateX(-50%) translateY(100px) scale(0)', opacity: 0 }
            ], {
                duration: 3500,
                easing: 'ease-in-out'
            });

            this.particleSystem.create('✨', CONFIG.EFFECTS.PARTICLE_COUNT.MEDIUM, 3000);
            this.soundEffects.playMagic();

            setTimeout(() => {
                removeElement(rainbow);
                this.activeEffects.delete(effectId);
            }, 3500);

            return true;

        } catch (error) {
            logger.error('Error creating rainbow:', error);
            this.activeEffects.delete(effectId);
            return false;
        }
    }

    /**
     * Ekran sarsıntısı
     */
    async createShake() {
        document.body.classList.add('screen-shake');
        this.soundEffects.playEarthquake();
        
        setTimeout(() => {
            document.body.classList.remove('screen-shake');
        }, 1000);
        
        return true;
    }

    // ADVANCED EFFECTS

    /**
     * Lazer gösterisi
     */
    async createLazer() {
        const effectId = 'lazer_' + Date.now();
        this.activeEffects.add(effectId);
        
        try {
            const lazer = createElement('div');
            lazer.style.cssText = `
                position: fixed;
                top: 0;
                left: 50%;
                width: 10px;
                height: 100vh;
                background: linear-gradient(180deg, transparent, #ff0080, #00ff80, #0080ff, transparent);
                transform: translateX(-50%);
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                box-shadow: 0 0 20px #ff0080, 0 0 40px #00ff80, 0 0 60px #0080ff;
                animation: lazerSweep 3s ease-in-out;
            `;
            
            document.body.appendChild(lazer);
            this.soundEffects.playLazer();

            setTimeout(() => {
                removeElement(lazer);
                this.activeEffects.delete(effectId);
            }, 3000);

            return true;

        } catch (error) {
            logger.error('Error creating lazer:', error);
            this.activeEffects.delete(effectId);
            return false;
        }
    }

    /**
     * Meteor yağmuru
     */
    async createMeteor() {
        const effectId = 'meteor_' + Date.now();
        this.activeEffects.add(effectId);
        
        try {
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    const meteor = createElement('div');
                    meteor.textContent = '☄️';
                    meteor.style.cssText = `
                        position: fixed;
                        top: -50px;
                        left: ${Math.random() * 100}vw;
                        font-size: ${30 + Math.random() * 40}px;
                        z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                        animation: meteorFall ${2 + Math.random() * 2}s linear forwards;
                        filter: drop-shadow(0 0 10px #ff4400);
                        pointer-events: none;
                    `;
                    
                    document.body.appendChild(meteor);
                    
                    setTimeout(() => {
                        removeElement(meteor);
                    }, 4000);
                }, i * 400);
            }

            this.soundEffects.playMeteor();
            
            setTimeout(() => {
                this.activeEffects.delete(effectId);
            }, 5000);

            return true;

        } catch (error) {
            logger.error('Error creating meteor:', error);
            this.activeEffects.delete(effectId);
            return false;
        }
    }

    /**
     * Matrix efekti
     */
    async createMatrix() {
        const effectId = 'matrix_' + Date.now();
        this.activeEffects.add(effectId);
        
        try {
            const matrixOverlay = createElement('div');
            matrixOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.8);
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                overflow: hidden;
                pointer-events: none;
            `;
            
            document.body.appendChild(matrixOverlay);
            
            const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            
            for (let i = 0; i < 50; i++) {
                const column = createElement('div');
                column.style.cssText = `
                    position: absolute;
                    top: -100px;
                    left: ${Math.random() * 100}vw;
                    color: #00ff00;
                    font-family: 'Courier New', monospace;
                    font-size: 16px;
                    animation: matrixRain ${3 + Math.random() * 3}s linear infinite;
                    text-shadow: 0 0 5px #00ff00;
                `;
                
                let text = '';
                for (let j = 0; j < 20; j++) {
                    text += characters.charAt(Math.floor(Math.random() * characters.length)) + '<br>';
                }
                column.innerHTML = text;
                
                matrixOverlay.appendChild(column);
            }

            this.soundEffects.playMatrix();
            
            setTimeout(() => {
                removeElement(matrixOverlay);
                this.activeEffects.delete(effectId);
            }, 5000);

            return true;

        } catch (error) {
            logger.error('Error creating matrix:', error);
            this.activeEffects.delete(effectId);
            return false;
        }
    }

    /**
     * Portal efekti
     */
    async createPortal() {
        const effectId = 'portal_' + Date.now();
        this.activeEffects.add(effectId);
        
        try {
            const portal = createElement('div');
            portal.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                width: 200px;
                height: 200px;
                border-radius: 50%;
                background: radial-gradient(circle, #8000ff 0%, #4000ff 30%, #0080ff 70%, transparent 100%);
                transform: translate(-50%, -50%);
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                animation: portalSpin 4s linear forwards;
                box-shadow: 0 0 50px #8000ff, 0 0 100px #4000ff;
                pointer-events: none;
            `;
            
            document.body.appendChild(portal);
            this.soundEffects.playPortal();
            
            setTimeout(() => {
                removeElement(portal);
                this.activeEffects.delete(effectId);
            }, 4000);

            return true;

        } catch (error) {
            logger.error('Error creating portal:', error);
            this.activeEffects.delete(effectId);
            return false;
        }
    }

    /**
     * Galaksi efekti
     */
    async createGalaxy() {
        const effectId = 'galaxy_' + Date.now();
        this.activeEffects.add(effectId);
        
        try {
            const galaxy = createElement('div');
            galaxy.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                width: 400px;
                height: 400px;
                border-radius: 50%;
                background: radial-gradient(ellipse at center, #ffffff 0%, #8000ff 25%, #4000ff 50%, #000040 75%, transparent 100%);
                transform: translate(-50%, -50%);
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                animation: galaxySpin 6s ease-in-out forwards;
                box-shadow: 0 0 100px #8000ff;
                pointer-events: none;
            `;
            
            document.body.appendChild(galaxy);
            
            // Add stars
            for (let i = 0; i < 30; i++) {
                const star = createElement('div');
                star.textContent = '⭐';
                star.style.cssText = `
                    position: absolute;
                    top: ${Math.random() * 400}px;
                    left: ${Math.random() * 400}px;
                    font-size: ${10 + Math.random() * 20}px;
                    animation: starTwinkle ${1 + Math.random() * 2}s ease-in-out infinite alternate;
                `;
                galaxy.appendChild(star);
            }

            this.soundEffects.playSpace();
            
            setTimeout(() => {
                removeElement(galaxy);
                this.activeEffects.delete(effectId);
            }, 6000);

            return true;

        } catch (error) {
            logger.error('Error creating galaxy:', error);
            this.activeEffects.delete(effectId);
            return false;
        }
    }

    /**
     * Tsunami dalgası - Yeniden yazılmış gerçekçi versiyon
     */
    async createTsunami() {
        const effectId = 'tsunami_' + Date.now();
        this.activeEffects.add(effectId);

        try {
            // Ana tsunami dalgası - soldan sağa doğru akar
            const mainWave = createElement('div');
            mainWave.style.cssText = `
                position: fixed;
                bottom: 0;
                left: -100vw;
                width: 200vw;
                height: 80vh;
                background: linear-gradient(0deg,
                    rgba(0,102,204,0.95) 0%,
                    rgba(0,153,255,0.9) 20%,
                    rgba(102,204,255,0.8) 40%,
                    rgba(204,229,255,0.6) 60%,
                    rgba(255,255,255,0.3) 80%,
                    transparent 100%);
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                animation: tsunamiFlow 8s ease-in-out forwards;
                opacity: 0.9;
                pointer-events: none;
                border-radius: 50% 50% 0 0;
                box-shadow:
                    0 -10px 30px rgba(0,102,204,0.8),
                    0 -20px 60px rgba(0,153,255,0.6),
                    0 -30px 90px rgba(0,204,255,0.4);
                transform-origin: center bottom;
            `;

            document.body.appendChild(mainWave);

            // İkinci dalga katmanı - daha küçük ve hızlı
            const secondaryWave = createElement('div');
            secondaryWave.style.cssText = `
                position: fixed;
                bottom: 0;
                left: -120vw;
                width: 180vw;
                height: 60vh;
                background: linear-gradient(0deg,
                    rgba(0,51,102,0.8) 0%,
                    rgba(0,102,153,0.7) 30%,
                    rgba(51,153,204,0.6) 50%,
                    rgba(153,204,255,0.4) 70%,
                    transparent 100%);
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES - 1};
                animation: tsunamiFlow 6s ease-in-out 0.5s forwards;
                opacity: 0.7;
                pointer-events: none;
                border-radius: 40% 40% 0 0;
                transform-origin: center bottom;
            `;

            document.body.appendChild(secondaryWave);

            // Üçüncü küçük dalga - en hızlı
            const smallWave = createElement('div');
            smallWave.style.cssText = `
                position: fixed;
                bottom: 0;
                left: -80vw;
                width: 150vw;
                height: 40vh;
                background: linear-gradient(0deg,
                    rgba(0,25,51,0.6) 0%,
                    rgba(0,51,77,0.5) 40%,
                    rgba(25,77,102,0.4) 60%,
                    transparent 100%);
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES - 2};
                animation: tsunamiFlow 4s ease-in-out 1s forwards;
                opacity: 0.5;
                pointer-events: none;
                border-radius: 30% 30% 0 0;
                transform-origin: center bottom;
            `;

            document.body.appendChild(smallWave);

            // Köpük efektleri
            this.createRealisticFoam();

            // Çöpler ve debris
            this.createRealisticDebris();

            // Su sıçramaları
            this.createRealisticSplashes();

            // Ekran sarsıntısı
            this.createRealisticShake();

            // Gelişmiş ses efektleri
            this.playRealisticTsunamiSound();

            // Cleanup
            setTimeout(() => {
                removeElement(mainWave);
                removeElement(secondaryWave);
                removeElement(smallWave);
                this.activeEffects.delete(effectId);
            }, 8000);

            return true;

        } catch (error) {
            logger.error('Error creating tsunami:', error);
            this.activeEffects.delete(effectId);
            return false;
        }
    }

    /**
     * Gerçekçi köpük efektleri
     */
    createRealisticFoam() {
        const foamEmojis = ['🌊', '💧', '🌫️', '💦', '🌊'];

        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const foam = createElement('div');
                foam.textContent = foamEmojis[Math.floor(Math.random() * foamEmojis.length)];
                foam.style.cssText = `
                    position: fixed;
                    bottom: ${Math.random() * 100 + 20}px;
                    left: ${Math.random() * 120 - 20}vw;
                    font-size: ${Math.random() * 25 + 15}px;
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES + 1};
                    animation: realisticFoam ${Math.random() * 2 + 3}s ease-in-out forwards;
                    opacity: ${Math.random() * 0.4 + 0.6};
                    pointer-events: none;
                    filter: blur(${Math.random() * 1.5}px);
                    transform: rotate(${Math.random() * 60 - 30}deg);
                `;

                document.body.appendChild(foam);

                setTimeout(() => {
                    removeElement(foam);
                }, 5000);
            }, i * 150);
        }
    }

    /**
     * Gerçekçi çöpler ve debris
     */
    createRealisticDebris() {
        const debrisItems = [
            '🗑️', '🥤', '🛍️', '📦', '🥫', '🧴', '📱', '👟',
            '📰', '🍾', '🥖', '🛶', '🏊', '🐟', '🐠', '🦈',
            '🌿', '🍂', '🪵', '🪨', '🏠', '🚗', '🛥️', '🏄',
            '📺', '🪑', '🛋️', '🪴', '🎈', '🧸', '📚', '💼'
        ];

        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const debris = createElement('div');
                debris.textContent = debrisItems[Math.floor(Math.random() * debrisItems.length)];
                debris.style.cssText = `
                    position: fixed;
                    bottom: ${Math.random() * 80 + 10}px;
                    left: ${Math.random() * 140 - 20}vw;
                    font-size: ${Math.random() * 20 + 12}px;
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES + 2};
                    animation: realisticDebris ${Math.random() * 3 + 4}s ease-in-out forwards;
                    opacity: ${Math.random() * 0.6 + 0.4};
                    pointer-events: none;
                    transform: rotate(${Math.random() * 720 - 360}deg) scale(${Math.random() * 0.5 + 0.8});
                `;

                document.body.appendChild(debris);

                setTimeout(() => {
                    removeElement(debris);
                }, 7000);
            }, i * 100);
        }
    }

    /**
     * Gerçekçi su sıçramaları
     */
    createRealisticSplashes() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const splash = createElement('div');
                splash.textContent = '💧';
                splash.style.cssText = `
                    position: fixed;
                    bottom: ${Math.random() * 150 + 50}px;
                    left: ${Math.random() * 100}vw;
                    font-size: ${Math.random() * 30 + 15}px;
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES + 3};
                    animation: realisticSplash ${Math.random() * 1.5 + 0.8}s ease-out forwards;
                    opacity: ${Math.random() * 0.5 + 0.5};
                    pointer-events: none;
                    transform: rotate(${Math.random() * 180 - 90}deg);
                `;

                document.body.appendChild(splash);

                setTimeout(() => {
                    removeElement(splash);
                }, 2500);
            }, i * 200);
        }
    }

    /**
     * Gerçekçi ekran sarsıntısı
     */
    createRealisticShake() {
        // Ana sarsıntı - daha gerçekçi
        document.body.style.animation = 'realisticShake 6s ease-in-out';

        // Ek titreşimler - farklı zamanlamalarda
        setTimeout(() => {
            document.body.style.animation = 'realisticShake 3s ease-in-out 0.3s';
        }, 1500);

        setTimeout(() => {
            document.body.style.animation = 'realisticShake 2s ease-in-out 0.2s';
        }, 3000);

        setTimeout(() => {
            document.body.style.animation = '';
        }, 8000);
    }

    /**
     * Gerçekçi tsunami ses efektleri
     */
    playRealisticTsunamiSound() {
        // Ana tsunami sesi
        this.soundEffects.playTsunami();

        // Dalga yaklaşma sesi
        setTimeout(() => {
            if (this.soundEffects.playWaterFlow) {
                this.soundEffects.playWaterFlow();
            }
        }, 1000);

        // Çarpma sesi
        setTimeout(() => {
            if (this.soundEffects.playImpact) {
                this.soundEffects.playImpact();
            }
        }, 2500);

        // Köpük ve sıçrama sesleri
        setTimeout(() => {
            if (this.soundEffects.playWaterSplash) {
                this.soundEffects.playWaterSplash();
            }
        }, 3000);

        // Geri çekilme sesi
        setTimeout(() => {
            if (this.soundEffects.playWaterFlow) {
                this.soundEffects.playWaterFlow();
            }
        }, 5000);
    }

    // SOUND EFFECTS WITH VISUALS

    /**
     * Bass drop efekti
     */
    async createBassDrop() {
        document.body.style.animation = 'screenShake 0.5s ease-in-out 6';
        this.particleSystem.create('🔊', CONFIG.EFFECTS.PARTICLE_COUNT.MEDIUM, 3000);
        this.soundEffects.playBassDrop();
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 3000);
        
        return true;
    }

    /**
     * Davul efekti
     */
    async createDrums() {
        const effectId = 'drums_' + Date.now();
        this.activeEffects.add(effectId);
        
        try {
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    const drumHit = createElement('div');
                    drumHit.textContent = '🥁';
                    drumHit.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        font-size: 60px;
                        z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                        animation: drumPulse 0.3s ease-out forwards;
                        pointer-events: none;
                    `;
                    
                    document.body.appendChild(drumHit);
                    
                    setTimeout(() => {
                        removeElement(drumHit);
                    }, 300);
                }, i * 250);
            }

            this.soundEffects.playDrums();
            
            setTimeout(() => {
                this.activeEffects.delete(effectId);
            }, 2500);

            return true;

        } catch (error) {
            logger.error('Error creating drums:', error);
            this.activeEffects.delete(effectId);
            return false;
        }
    }

    /**
     * Gitar efekti
     */
    async createGuitar() {
        const effectId = 'guitar_' + Date.now();
        this.activeEffects.add(effectId);
        
        try {
            this.particleSystem.create('🎸', CONFIG.EFFECTS.PARTICLE_COUNT.MEDIUM, 3000);
            
            const guitar = createElement('div');
            guitar.textContent = '🎸';
            guitar.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 80px;
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                animation: guitarRiff 2s ease-in-out forwards;
                pointer-events: none;
            `;
            
            document.body.appendChild(guitar);
            this.soundEffects.playGuitar();
            
            setTimeout(() => {
                removeElement(guitar);
                this.activeEffects.delete(effectId);
            }, 2000);

            return true;

        } catch (error) {
            logger.error('Error creating guitar:', error);
            this.activeEffects.delete(effectId);
            return false;
        }
    }

    /**
     * Synthesizer efekti
     */
    async createSynth() {
        const effectId = 'synth_' + Date.now();
        this.activeEffects.add(effectId);
        
        try {
            this.particleSystem.create('🎹', CONFIG.EFFECTS.PARTICLE_COUNT.SMALL, 2500);
            
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const wave = createElement('div');
                    wave.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        width: 100px;
                        height: 100px;
                        border: 3px solid #00ffff;
                        border-radius: 50%;
                        transform: translate(-50%, -50%);
                        z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                        animation: synthWave 1s ease-out forwards;
                        pointer-events: none;
                    `;
                    
                    document.body.appendChild(wave);
                    
                    setTimeout(() => {
                        removeElement(wave);
                    }, 1000);
                }, i * 200);
            }

            this.soundEffects.playSynth();
            
            setTimeout(() => {
                this.activeEffects.delete(effectId);
            }, 2000);

            return true;

        } catch (error) {
            logger.error('Error creating synth:', error);
            this.activeEffects.delete(effectId);
            return false;
        }
    }

    // SPECIAL EFFECTS

    /**
     * Nükleer patlama
     */
    async createNuke() {
        const effectId = 'nuke_' + Date.now();
        this.activeEffects.add(effectId);
        
        try {
            const flash = createElement('div');
            flash.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle, #ffffff 0%, #ffff00 30%, #ff4400 70%, #000000 100%);
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                animation: nukeFlash 3s ease-out forwards;
                pointer-events: none;
            `;
            
            document.body.appendChild(flash);
            
            setTimeout(() => {
                this.particleSystem.create('💥', CONFIG.EFFECTS.PARTICLE_COUNT.LARGE, 5000);
                this.particleSystem.create('☢️', CONFIG.EFFECTS.PARTICLE_COUNT.MEDIUM, 5000);
            }, 1000);

            this.soundEffects.playNuke();
            
            setTimeout(() => {
                removeElement(flash);
                this.activeEffects.delete(effectId);
            }, 3000);

            return true;

        } catch (error) {
            logger.error('Error creating nuke:', error);
            this.activeEffects.delete(effectId);
            return false;
        }
    }

    /**
     * Disco topu
     */
    async createDisco() {
        const effectId = 'disco_' + Date.now();
        this.activeEffects.add(effectId);
        
        try {
            const discoBall = createElement('div');
            discoBall.textContent = '🪩';
            discoBall.style.cssText = `
                position: fixed;
                top: 20%;
                left: 50%;
                transform: translateX(-50%);
                font-size: 80px;
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                animation: discoSpin 4s linear forwards;
                filter: drop-shadow(0 0 20px #ffffff);
                pointer-events: none;
            `;
            
            document.body.appendChild(discoBall);
            
            // Create disco lights
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    const light = createElement('div');
                    light.style.cssText = `
                        position: fixed;
                        top: ${Math.random() * 100}vh;
                        left: ${Math.random() * 100}vw;
                        width: 20px;
                        height: 20px;
                        background: ${['#ff0080', '#00ff80', '#0080ff', '#ff8000'][Math.floor(Math.random() * 4)]};
                        border-radius: 50%;
                        z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                        animation: discoLight 0.5s ease-out forwards;
                        pointer-events: none;
                    `;
                    
                    document.body.appendChild(light);
                    
                    setTimeout(() => {
                        removeElement(light);
                    }, 500);
                }, i * 100);
            }

            this.soundEffects.playDisco();
            
            setTimeout(() => {
                removeElement(discoBall);
                this.activeEffects.delete(effectId);
            }, 4000);

            return true;

        } catch (error) {
            logger.error('Error creating disco:', error);
            this.activeEffects.delete(effectId);
            return false;
        }
    }

    /**
     * UFO efekti
     */
    async createUFO() {
        const effectId = 'ufo_' + Date.now();
        this.activeEffects.add(effectId);
        
        try {
            const ufo = createElement('div');
            ufo.textContent = '🛸';
            ufo.style.cssText = `
                position: fixed;
                top: 30%;
                left: -100px;
                font-size: 60px;
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                animation: ufoFly 5s ease-in-out forwards;
                filter: drop-shadow(0 0 20px #00ff00);
                pointer-events: none;
            `;
            
            document.body.appendChild(ufo);
            
            this.particleSystem.create('👽', CONFIG.EFFECTS.PARTICLE_COUNT.SMALL, 3000);
            this.particleSystem.create('✨', CONFIG.EFFECTS.PARTICLE_COUNT.MEDIUM, 4000);
            this.soundEffects.playUFO();
            
            setTimeout(() => {
                removeElement(ufo);
                this.activeEffects.delete(effectId);
            }, 5000);

            return true;

        } catch (error) {
            logger.error('Error creating UFO:', error);
            this.activeEffects.delete(effectId);
            return false;
        }
    }

    /**
     * Ninja saldırısı
     */
    async createNinja() {
        const effectId = 'ninja_' + Date.now();
        this.activeEffects.add(effectId);
        
        try {
            const ninja = createElement('div');
            ninja.textContent = '🥷';
            ninja.style.cssText = `
                position: fixed;
                top: 50%;
                left: 100vw;
                font-size: 50px;
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                animation: ninjaAttack 2s ease-in-out forwards;
                pointer-events: none;
            `;
            
            document.body.appendChild(ninja);
            
            setTimeout(() => {
                this.particleSystem.create('⚡', CONFIG.EFFECTS.PARTICLE_COUNT.SMALL, 1500);
                this.particleSystem.create('💨', CONFIG.EFFECTS.PARTICLE_COUNT.SMALL, 1500);
            }, 800);

            this.soundEffects.playNinja();
            
            setTimeout(() => {
                removeElement(ninja);
                this.activeEffects.delete(effectId);
            }, 2000);

            return true;

        } catch (error) {
            logger.error('Error creating ninja:', error);
            this.activeEffects.delete(effectId);
            return false;
        }
    }

    /**
     * Aktif efekt sayısı
     */
    getActiveEffectCount() {
        return this.activeEffects.size;
    }

    /**
     * Tüm efektleri durdur
     */
    stopAllEffects() {
        this.activeEffects.forEach(effectId => {
            // Remove effect elements if possible
            const elements = document.querySelectorAll(`[data-effect-id="${effectId}"]`);
            elements.forEach(element => removeElement(element));
        });
        
        this.activeEffects.clear();
        this.particleSystem.clearAll();
        
        logger.effect('All effects stopped');
    }

    /**
     * Cleanup ve kapatma
     */
    destroy() {
        this.stopAllEffects();
        
        if (this.particleSystem) {
            this.particleSystem.destroy();
        }
        
        if (this.soundEffects) {
            this.soundEffects.destroy();
        }
        
        logger.effect('VisualEffects destroyed');
    }
}

export default VisualEffects;