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
     * Ateş efekti - Geliştirilmiş büyük versiyon
     */
    async createFire() {
        const effectId = 'fire_' + Date.now();
        this.activeEffects.add(effectId);

        try {
            // Ana ateş duvarı - tüm ekranı kaplar
            const fireWall = createElement('div');
            fireWall.style.cssText = `
                position: fixed;
                bottom: 0;
                left: -50vw;
                width: 200vw;
                height: 100vh;
                background: linear-gradient(0deg,
                    rgba(255,69,0,0.9) 0%,
                    rgba(255,140,0,0.8) 20%,
                    rgba(255,215,0,0.7) 40%,
                    rgba(255,255,0,0.5) 60%,
                    rgba(255,255,255,0.3) 80%,
                    transparent 100%);
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                animation: fireWall 6s ease-in-out forwards;
                opacity: 0.8;
                pointer-events: none;
                border-radius: 50% 50% 0 0;
                box-shadow:
                    0 -20px 40px rgba(255,69,0,0.8),
                    0 -40px 80px rgba(255,140,0,0.6),
                    0 -60px 120px rgba(255,215,0,0.4);
                transform-origin: center bottom;
            `;

            document.body.appendChild(fireWall);

            // İkinci ateş katmanı
            const secondaryFire = createElement('div');
            secondaryFire.style.cssText = `
                position: fixed;
                bottom: 0;
                left: -40vw;
                width: 180vw;
                height: 80vh;
                background: linear-gradient(0deg,
                    rgba(139,69,19,0.7) 0%,
                    rgba(160,82,45,0.6) 30%,
                    rgba(210,105,30,0.5) 50%,
                    rgba(255,165,0,0.3) 70%,
                    transparent 100%);
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES - 1};
                animation: fireWall 4s ease-in-out 0.5s forwards;
                opacity: 0.6;
                pointer-events: none;
                border-radius: 40% 40% 0 0;
                transform-origin: center bottom;
            `;

            document.body.appendChild(secondaryFire);

            // Büyük ateş küreleri
            this.createFireOrbs();

            // Ateş parçacıkları
            this.createFireParticles();

            // Ekran ısınması efekti
            this.createHeatDistortion();

            // Gelişmiş ateş ses efektleri
            this.playEpicFireSound();

            // Cleanup
            setTimeout(() => {
                removeElement(fireWall);
                removeElement(secondaryFire);
                this.activeEffects.delete(effectId);
            }, 6000);

            return true;

        } catch (error) {
            logger.error('Error creating fire:', error);
            this.activeEffects.delete(effectId);
            return false;
        }
    }

    /**
     * Konfeti patlaması - Geliştirilmiş büyük versiyon
     */
    async createConfetti() {
        const effectId = 'confetti_' + Date.now();
        this.activeEffects.add(effectId);

        try {
            // Ana konfeti patlaması - merkezde büyük bir patlama
            const confettiBurst = createElement('div');
            confettiBurst.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                width: 300px;
                height: 300px;
                border-radius: 50%;
                background: radial-gradient(circle,
                    rgba(255,215,0,0.9) 0%,
                    rgba(255,105,180,0.8) 30%,
                    rgba(0,191,255,0.7) 60%,
                    rgba(255,69,0,0.5) 80%,
                    transparent 100%);
                transform: translate(-50%, -50%);
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                animation: confettiBurst 4s ease-out forwards;
                box-shadow:
                    0 0 50px rgba(255,215,0,0.8),
                    0 0 100px rgba(255,105,180,0.6),
                    0 0 150px rgba(0,191,255,0.4);
                pointer-events: none;
            `;

            document.body.appendChild(confettiBurst);

            // Büyük konfeti parçaları
            this.createLargeConfetti();

            // Renkli patlama halkaları
            this.createConfettiRings();

            // Yıldız yağmuru
            this.createConfettiStars();

            // Ekran titreşimi
            this.createConfettiShake();

            // Epik konfeti ses efektleri
            this.playEpicConfettiSound();

            // Cleanup
            setTimeout(() => {
                removeElement(confettiBurst);
                this.activeEffects.delete(effectId);
            }, 4000);

            return true;

        } catch (error) {
            logger.error('Error creating confetti:', error);
            this.activeEffects.delete(effectId);
            return false;
        }
    }

    /**
     * Kalp yağmuru - Geliştirilmiş büyük versiyon
     */
    async createHearts() {
        const effectId = 'hearts_' + Date.now();
        this.activeEffects.add(effectId);

        try {
            // Ana kalp patlaması
            const heartExplosion = createElement('div');
            heartExplosion.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                width: 400px;
                height: 400px;
                border-radius: 50%;
                background: radial-gradient(circle,
                    rgba(255,20,147,0.9) 0%,
                    rgba(255,105,180,0.8) 25%,
                    rgba(255,182,193,0.6) 50%,
                    rgba(255,218,221,0.4) 75%,
                    transparent 100%);
                transform: translate(-50%, -50%);
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                animation: heartExplosion 5s ease-out forwards;
                box-shadow:
                    0 0 60px rgba(255,20,147,0.8),
                    0 0 120px rgba(255,105,180,0.6),
                    0 0 180px rgba(255,182,193,0.4);
                pointer-events: none;
            `;

            document.body.appendChild(heartExplosion);

            // Büyük yüzen kalpler
            this.createFloatingHearts();

            // Kalp çiçekleri
            this.createHeartFlowers();

            // Pembe yıldızlar
            this.createHeartStars();

            // Romantik titreşim
            this.createRomanticShake();

            // Epik aşk ses efektleri
            this.playEpicLoveSound();

            // Cleanup
            setTimeout(() => {
                removeElement(heartExplosion);
                this.activeEffects.delete(effectId);
            }, 5000);

            return true;

        } catch (error) {
            logger.error('Error creating hearts:', error);
            this.activeEffects.delete(effectId);
            return false;
        }
    }

    /**
     * Gökkuşağı efekti - Geliştirilmiş büyük versiyon
     */
    async createRainbow() {
        const effectId = 'rainbow_' + Date.now();
        this.activeEffects.add(effectId);

        try {
            // Ana gökkuşağı yayı - tüm ekranı kaplar
            const rainbowArc = createElement('div');
            rainbowArc.style.cssText = `
                position: fixed;
                bottom: 0;
                left: 50%;
                width: 300vw;
                height: 200vh;
                background: conic-gradient(
                    from 0deg at 50% 100%,
                    #ff0000 0deg,
                    #ff8000 30deg,
                    #ffff00 60deg,
                    #00ff00 90deg,
                    #0080ff 120deg,
                    #8000ff 150deg,
                    #ff0080 180deg
                );
                transform: translateX(-50%);
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                animation: rainbowArc 8s ease-in-out forwards;
                opacity: 0.8;
                pointer-events: none;
                border-radius: 50% 50% 0 0;
                clip-path: ellipse(100% 50% at 50% 100%);
                box-shadow:
                    0 -20px 40px rgba(255,0,0,0.3),
                    0 -40px 80px rgba(255,165,0,0.3),
                    0 -60px 120px rgba(0,255,0,0.3);
            `;

            document.body.appendChild(rainbowArc);

            // Gökkuşağı yıldızları
            this.createRainbowStars();

            // Renkli bulutlar
            this.createRainbowClouds();

            // Gökkuşağı kuşları
            this.createRainbowBirds();

            // Büyülü titreşim
            this.createMagicShake();

            // Epik büyü ses efektleri
            this.playEpicMagicSound();

            // Cleanup
            setTimeout(() => {
                removeElement(rainbowArc);
                this.activeEffects.delete(effectId);
            }, 8000);

            return true;

        } catch (error) {
            logger.error('Error creating rainbow:', error);
            this.activeEffects.delete(effectId);
            return false;
        }
    }

    /**
     * 🖕🏻 Emoji Patlaması
     */
    async createMiddleFinger() {
        const effectId = 'middle_finger_' + Date.now();
        this.activeEffects.add(effectId);

        const EFFECT_DURATION = 6400;
        let overlay = null;
        let container = null;

        try {
            overlay = createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: radial-gradient(circle at 50% 50%,
                    rgba(255,255,255,0.12) 0%,
                    rgba(255,0,0,0.25) 38%,
                    rgba(0,0,0,0.78) 100%);
                opacity: 0;
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES - 2};
                pointer-events: none;
            `;
            document.body.appendChild(overlay);

            overlay.animate([
                { opacity: 0 },
                { opacity: 0.65 },
                { opacity: 0.5 },
                { opacity: 0 }
            ], {
                duration: EFFECT_DURATION,
                easing: 'ease-out'
            });

            container = createElement('div');
            container.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                transform: translate(-50%, -50%);
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                pointer-events: none;
            `;
            document.body.appendChild(container);

            const aura = createElement('div');
            aura.style.cssText = `
                position: absolute;
                left: -220px;
                top: -220px;
                width: 440px;
                height: 440px;
                border-radius: 50%;
                background: radial-gradient(circle,
                    rgba(255,255,255,0.35) 0%,
                    rgba(255,0,0,0.28) 40%,
                    rgba(0,0,0,0) 78%);
                opacity: 0.25;
                transform: scale(0.6);
                filter: blur(0px);
                mix-blend-mode: screen;
            `;
            container.appendChild(aura);

            aura.animate([
                { transform: 'scale(0.6)', opacity: 0.15, filter: 'blur(0px)' },
                { transform: 'scale(1.2)', opacity: 0.5, filter: 'blur(2px)' },
                { transform: 'scale(0.95)', opacity: 0.3, filter: 'blur(1px)' },
                { transform: 'scale(1.35)', opacity: 0 }
            ], {
                duration: EFFECT_DURATION,
                easing: 'ease-in-out'
            });

            const mainEmoji = createElement('div');
            mainEmoji.textContent = '🖕🏻';
            mainEmoji.style.cssText = `
                position: absolute;
                left: 0;
                top: 0;
                font-size: 280px;
                transform: translate(-50%, -50%) scale(0.15);
                opacity: 0;
                filter: drop-shadow(0 0 24px rgba(255,255,255,0.95))
                        drop-shadow(0 0 58px rgba(255,0,0,0.6));
            `;
            container.appendChild(mainEmoji);

            mainEmoji.animate([
                { transform: 'translate(-50%, -50%) scale(0.15)', opacity: 0 },
                { transform: 'translate(-50%, -50%) scale(1.4)', opacity: 1 },
                { transform: 'translate(-50%, -50%) scale(1.05)', opacity: 0.92 },
                { transform: 'translate(-50%, -50%) scale(1.45)', opacity: 0.78 },
                { transform: 'translate(-50%, -50%) scale(1.85)', opacity: 0 }
            ], {
                duration: EFFECT_DURATION,
                easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)'
            });

            const pulse = createElement('div');
            pulse.style.cssText = `
                position: absolute;
                left: 0;
                top: 0;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: radial-gradient(circle,
                    rgba(255,255,255,0.3) 0%,
                    rgba(255,0,0,0.25) 35%,
                    rgba(0,0,0,0) 70%);
                transform: translate(-50%, -50%) scale(0.2);
                opacity: 0.9;
            `;
            container.appendChild(pulse);

            pulse.animate([
                { transform: 'translate(-50%, -50%) scale(0.4)', opacity: 0.6 },
                { transform: 'translate(-50%, -50%) scale(3.4)', opacity: 0 }
            ], {
                duration: EFFECT_DURATION,
                easing: 'ease-out'
            });

            setTimeout(() => {
                const secondPulse = createElement('div');
                secondPulse.style.cssText = `
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    border: 3px solid rgba(255,255,255,0.4);
                    transform: translate(-50%, -50%) scale(0.2);
                    opacity: 0.8;
                    mix-blend-mode: screen;
                `;
                container.appendChild(secondPulse);
                secondPulse.animate([
                    { transform: 'translate(-50%, -50%) scale(0.45)', opacity: 0.8 },
                    { transform: 'translate(-50%, -50%) scale(3.8)', opacity: 0 }
                ], {
                    duration: EFFECT_DURATION - 1000,
                    easing: 'ease-out'
                });
            }, 600);

            const shockwave = createElement('div');
            shockwave.style.cssText = `
                position: absolute;
                left: 0;
                top: 0;
                width: 120px;
                height: 120px;
                border-radius: 50%;
                border: 3px solid rgba(255,255,255,0.45);
                transform: translate(-50%, -50%) scale(0.35);
                opacity: 0.9;
                mix-blend-mode: screen;
            `;
            container.appendChild(shockwave);

            shockwave.animate([
                { transform: 'translate(-50%, -50%) scale(0.35)', opacity: 0.9 },
                { transform: 'translate(-50%, -50%) scale(2.6)', opacity: 0.45 },
                { transform: 'translate(-50%, -50%) scale(4.3)', opacity: 0 }
            ], {
                duration: EFFECT_DURATION,
                easing: 'ease-out'
            });

            setTimeout(() => {
                const shockwave2 = createElement('div');
                shockwave2.style.cssText = `
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 160px;
                    height: 160px;
                    border-radius: 50%;
                    border: 2px dashed rgba(255,0,0,0.45);
                    transform: translate(-50%, -50%) scale(0.4);
                    opacity: 0.8;
                    mix-blend-mode: screen;
                `;
                container.appendChild(shockwave2);
                shockwave2.animate([
                    { transform: 'translate(-50%, -50%) scale(0.4)', opacity: 0.8 },
                    { transform: 'translate(-50%, -50%) scale(3.1)', opacity: 0.3 },
                    { transform: 'translate(-50%, -50%) scale(4.6)', opacity: 0 }
                ], {
                    duration: EFFECT_DURATION - 1400,
                    easing: 'ease-out'
                });
            }, 900);

            const vortex = createElement('div');
            vortex.style.cssText = `
                position: absolute;
                left: -220px;
                top: -220px;
                width: 440px;
                height: 440px;
                border-radius: 50%;
                border: 4px dotted rgba(255,255,255,0.15);
                opacity: 0.3;
                mix-blend-mode: screen;
            `;
            container.appendChild(vortex);

            vortex.animate([
                { transform: 'rotate(0deg) scale(0.6)', opacity: 0.15 },
                { transform: 'rotate(360deg) scale(1.05)', opacity: 0.45 },
                { transform: 'rotate(720deg) scale(0.95)', opacity: 0.18 }
            ], {
                duration: EFFECT_DURATION,
                easing: 'ease-in-out'
            });

            setTimeout(() => {
                const vortex2 = createElement('div');
                vortex2.style.cssText = `
                    position: absolute;
                    left: -260px;
                    top: -260px;
                    width: 520px;
                    height: 520px;
                    border-radius: 50%;
                    border: 3px solid rgba(255,0,0,0.18);
                    opacity: 0.25;
                    mix-blend-mode: screen;
                `;
                container.appendChild(vortex2);
                vortex2.animate([
                    { transform: 'rotate(0deg) scale(0.7)', opacity: 0.15 },
                    { transform: 'rotate(-360deg) scale(1.1)', opacity: 0.4 },
                    { transform: 'rotate(-640deg) scale(0.9)', opacity: 0.1 }
                ], {
                    duration: EFFECT_DURATION - 1200,
                    easing: 'ease-in-out'
                });
            }, 500);

            const triggerShake = () => {
                document.body.animate([
                    { transform: 'translate(0px, 0px)' },
                    { transform: 'translate(7px, -6px)' },
                    { transform: 'translate(-6px, 5px)' },
                    { transform: 'translate(0px, 0px)' }
                ], {
                    duration: 520,
                    easing: 'ease-in-out'
                });
            };

            triggerShake();
            setTimeout(triggerShake, 1800);
            setTimeout(triggerShake, 3600);
            setTimeout(triggerShake, 5200);

            const spawnSatelliteRing = (count, baseDistance, sizeMultiplier, baseDelay = 0) => {
                for (let i = 0; i < count; i++) {
                    const satellite = createElement('div');
                    satellite.textContent = '🖕🏻';
                    const distance = baseDistance + Math.random() * 90;
                    const baseAngle = (Math.PI * 2 * i) / count;
                    const offsetAngle = baseAngle + (Math.random() * 0.4 - 0.2);
                    const x = Math.cos(offsetAngle) * distance;
                    const y = Math.sin(offsetAngle) * distance;
                    const size = (52 + Math.random() * 48) * sizeMultiplier;
                    const rotation = (Math.random() > 0.5 ? 1 : -1) * (200 + Math.random() * 220);

                    satellite.style.cssText = `
                        position: absolute;
                        left: ${x}px;
                        top: ${y}px;
                        font-size: ${size}px;
                        transform: translate(-50%, -50%) scale(0.2);
                        opacity: 0;
                        filter: drop-shadow(0 0 18px rgba(255,255,255,0.65))
                                drop-shadow(0 0 30px rgba(255,0,0,0.45));
                    `;

                    container.appendChild(satellite);

                    const midTransform = `translate(-50%, -50%) rotate(${rotation / 2}deg) scale(1.12)`;
                    const endTransform = `translate(-50%, -50%) rotate(${rotation}deg) scale(0.88)`;
                    const finalTransform = `translate(-50%, -50%) rotate(${rotation * 1.35}deg) scale(1.3)`;

                    satellite.animate([
                        { transform: 'translate(-50%, -50%) scale(0.2)', opacity: 0 },
                        { transform: midTransform, opacity: 0.98 },
                        { transform: endTransform, opacity: 0.7 },
                        { transform: finalTransform, opacity: 0 }
                    ], {
                        duration: 3200 + Math.random() * 2200,
                        delay: baseDelay + Math.random() * 320,
                        easing: 'ease-in-out'
                    });
                }
            };

            spawnSatelliteRing(16, 170, 1);
            setTimeout(() => spawnSatelliteRing(12, 110, 0.85), 900);
            setTimeout(() => spawnSatelliteRing(20, 240, 1.25, 120), 2400);
            setTimeout(() => spawnSatelliteRing(10, 85, 0.7, 60), 3600);

            const scatterCount = 28;
            for (let i = 0; i < scatterCount; i++) {
                setTimeout(() => {
                    const scatter = createElement('div');
                    scatter.textContent = '🖕🏻';
                    scatter.style.cssText = `
                        position: fixed;
                        left: ${Math.random() * 100}vw;
                        top: ${Math.random() * 100}vh;
                        font-size: ${32 + Math.random() * 36}px;
                        opacity: 0;
                        pointer-events: none;
                        z-index: ${CONFIG.UI.Z_INDICES.PARTICLES - 1};
                        filter: drop-shadow(0 0 12px rgba(255,0,0,0.55));
                    `;

                    document.body.appendChild(scatter);
                    const scatterDuration = 2800 + Math.random() * 1600;

                    scatter.animate([
                        { transform: 'scale(0.25) rotate(-12deg)', opacity: 0 },
                        { transform: 'scale(1.15) rotate(8deg)', opacity: 0.95 },
                        { transform: 'scale(0.8) rotate(0deg)', opacity: 0.1 }
                    ], {
                        duration: scatterDuration,
                        easing: 'ease-out'
                    });

                    setTimeout(() => removeElement(scatter), scatterDuration + 150);
                }, i * 55);
            }

            setTimeout(() => {
                const flash = createElement('div');
                flash.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: radial-gradient(circle,
                        rgba(255,255,255,0.35) 0%,
                        rgba(255,0,0,0.1) 45%,
                        rgba(0,0,0,0) 100%);
                    opacity: 0;
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES - 1};
                    pointer-events: none;
                `;
                document.body.appendChild(flash);
                flash.animate([
                    { opacity: 0 },
                    { opacity: 0.45 },
                    { opacity: 0 }
                ], {
                    duration: 900,
                    easing: 'ease-out'
                });
                setTimeout(() => removeElement(flash), 950);
            }, 2000);

            this.particleSystem.create('🖕🏻', CONFIG.EFFECTS.PARTICLE_COUNT.MEDIUM, EFFECT_DURATION);
            this.particleSystem.create('💢', CONFIG.EFFECTS.PARTICLE_COUNT.SMALL, EFFECT_DURATION);

            this.soundEffects.playTaunt();
            setTimeout(() => this.soundEffects.playTaunt(), 1900);
            setTimeout(() => this.soundEffects.playTaunt(), 3800);

            setTimeout(() => {
                if (container) removeElement(container);
                if (overlay) removeElement(overlay);
                this.activeEffects.delete(effectId);
            }, EFFECT_DURATION);

            return true;

        } catch (error) {
            if (overlay) removeElement(overlay);
            if (container) removeElement(container);
            logger.error('Error creating middle finger effect:', error);
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
     * Meteor yağmuru - Geliştirilmiş büyük versiyon
     */
    async createMeteor() {
        const effectId = 'meteor_' + Date.now();
        this.activeEffects.add(effectId);

        try {
            // Gökyüzü kararma efekti
            const nightSky = createElement('div');
            nightSky.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: radial-gradient(circle at 50% 20%,
                    rgba(0,0,50,0.8) 0%,
                    rgba(0,0,20,0.6) 50%,
                    rgba(0,0,0,0.9) 100%);
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES - 1};
                animation: nightSky 10s ease-in-out forwards;
                pointer-events: none;
            `;

            document.body.appendChild(nightSky);

            // Büyük meteorlar
            this.createLargeMeteors();

            // Meteor parçaları
            this.createMeteorDebris();

            // Yıldızlar
            this.createShootingStars();

            // Gökyüzü titreşimi
            this.createCosmicShake();

            // Epik uzay ses efektleri
            this.playEpicSpaceSound();

            // Cleanup
            setTimeout(() => {
                removeElement(nightSky);
                this.activeEffects.delete(effectId);
            }, 10000);

            return true;

        } catch (error) {
            logger.error('Error creating meteor:', error);
            this.activeEffects.delete(effectId);
            return false;
        }
    }

    /**
     * Matrix efekti - Geliştirilmiş büyük versiyon (4x daha fazla harf, daha uzun süre)
     */
    async createMatrix() {
        const effectId = 'matrix_' + Date.now();
        this.activeEffects.add(effectId);

        try {
            // Ana matrix overlay - daha koyu ve büyük
            const matrixOverlay = createElement('div');
            matrixOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.9);
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                overflow: hidden;
                pointer-events: none;
            `;

            document.body.appendChild(matrixOverlay);

            // Çok daha fazla matrix sütunu (4 katı)
            const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%^&*()_+-=[]{}|;:,.<>?';
            const columnCount = 200; // 4 katı artış

            for (let i = 0; i < columnCount; i++) {
                const column = createElement('div');
                column.style.cssText = `
                    position: absolute;
                    top: -200px;
                    left: ${Math.random() * 100}vw;
                    color: #00ff00;
                    font-family: 'Courier New', monospace;
                    font-size: ${12 + Math.random() * 8}px;
                    animation: matrixRain ${6 + Math.random() * 8}s linear infinite;
                    text-shadow: 0 0 8px #00ff00, 0 0 16px #00ff00;
                    opacity: ${0.6 + Math.random() * 0.4};
                `;

                // Her sütunda çok daha fazla karakter (4 katı)
                let text = '';
                for (let j = 0; j < 80; j++) {
                    text += characters.charAt(Math.floor(Math.random() * characters.length)) + '<br>';
                }
                column.innerHTML = text;

                matrixOverlay.appendChild(column);
            }

            // Matrix hologram efekti
            this.createMatrixHologram();

            // Matrix titreşimi
            this.createMatrixShake();

            // Epik matrix ses efektleri
            this.playEpicMatrixSound();

            // Çok daha uzun süre (15 saniye)
            setTimeout(() => {
                removeElement(matrixOverlay);
                this.activeEffects.delete(effectId);
            }, 15000);

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
     * Davul efekti - Geliştirilmiş büyük versiyon
     */
    async createDrums() {
        const effectId = 'drums_' + Date.now();
        this.activeEffects.add(effectId);

        try {
            // Ana davul vuruşu - büyük ve etkileyici
            const mainDrumHit = createElement('div');
            mainDrumHit.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                width: 300px;
                height: 300px;
                border-radius: 50%;
                background: radial-gradient(circle,
                    rgba(139,69,19,0.9) 0%,
                    rgba(160,82,45,0.8) 30%,
                    rgba(210,105,30,0.6) 60%,
                    rgba(255,140,0,0.4) 80%,
                    transparent 100%);
                transform: translate(-50%, -50%);
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                animation: drumExplosion 3s ease-out forwards;
                box-shadow:
                    0 0 60px rgba(139,69,19,0.8),
                    0 0 120px rgba(160,82,45,0.6),
                    0 0 180px rgba(210,105,30,0.4);
                pointer-events: none;
            `;

            document.body.appendChild(mainDrumHit);

            // Çoklu davul vuruşları
            this.createDrumHits();

            // Müzik notaları
            this.createMusicNotes();

            // Ses dalgaları
            this.createSoundWaves();

            // Güçlü titreşim
            this.createDrumShake();

            // Epik davul ses efektleri
            this.playEpicDrumSound();

            // Cleanup
            setTimeout(() => {
                removeElement(mainDrumHit);
                this.activeEffects.delete(effectId);
            }, 3000);

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
     * Ninja saldırısı - Geliştirilmiş büyük versiyon
     */
    async createNinja() {
        const effectId = 'ninja_' + Date.now();
        this.activeEffects.add(effectId);

        try {
            // Ninja fırtınası - çoklu ninja
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const ninja = createElement('div');
                    ninja.textContent = '🥷';
                    ninja.style.cssText = `
                        position: fixed;
                        top: ${30 + Math.random() * 40}%;
                        left: -100px;
                        font-size: ${60 + Math.random() * 40}px;
                        z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                        animation: ninjaStorm 3s ease-in-out forwards;
                        filter: drop-shadow(0 0 20px #ff0000);
                        pointer-events: none;
                        transform: rotate(${Math.random() * 60 - 30}deg);
                    `;

                    document.body.appendChild(ninja);

                    setTimeout(() => {
                        removeElement(ninja);
                    }, 3000);
                }, i * 300);
            }

            // Ninja yıldızları
            this.createNinjaStars();

            // Duman efekti
            this.createSmokeEffect();

            // Kanat çırpma efekti
            this.createWindEffect();

            // Ninja titreşimi
            this.createNinjaShake();

            // Epik ninja ses efektleri
            this.playEpicNinjaSound();

            // Cleanup
            setTimeout(() => {
                this.activeEffects.delete(effectId);
            }, 4000);

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

    // YARDIMCI METODLAR - GÖRSEL EFEKTLER İÇİN

    /**
     * Ateş küreleri oluştur
     */
    createFireOrbs() {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const orb = createElement('div');
                orb.textContent = '🔥';
                orb.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * 60 + 20}%;
                    left: ${Math.random() * 80 + 10}%;
                    font-size: ${40 + Math.random() * 40}px;
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES + 1};
                    animation: fireOrb ${2 + Math.random() * 2}s ease-in-out forwards;
                    filter: drop-shadow(0 0 15px #ff4500);
                    pointer-events: none;
                    opacity: 0.9;
                `;

                document.body.appendChild(orb);

                setTimeout(() => {
                    removeElement(orb);
                }, 4000);
            }, i * 200);
        }
    }

    /**
     * Ateş parçacıkları oluştur
     */
    createFireParticles() {
        for (let i = 0; i < 25; i++) {
            setTimeout(() => {
                const particle = createElement('div');
                particle.textContent = '✨';
                particle.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * 80 + 10}%;
                    left: ${Math.random() * 90 + 5}%;
                    font-size: ${15 + Math.random() * 20}px;
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES + 2};
                    animation: fireParticle ${1.5 + Math.random() * 2}s ease-out forwards;
                    color: ${['#ff4500', '#ff6347', '#ffd700', '#ffffff'][Math.floor(Math.random() * 4)]};
                    pointer-events: none;
                    opacity: 0.8;
                `;

                document.body.appendChild(particle);

                setTimeout(() => {
                    removeElement(particle);
                }, 3500);
            }, i * 100);
        }
    }

    /**
     * Isı bozulması efekti
     */
    createHeatDistortion() {
        const heat = createElement('div');
        heat.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg,
                rgba(255,69,0,0.1) 0%,
                rgba(255,140,0,0.05) 25%,
                rgba(255,215,0,0.1) 50%,
                rgba(255,255,0,0.05) 75%,
                rgba(255,69,0,0.1) 100%);
            z-index: ${CONFIG.UI.Z_INDICES.PARTICLES - 1};
            animation: heatDistortion 4s ease-in-out forwards;
            pointer-events: none;
            opacity: 0.3;
        `;

        document.body.appendChild(heat);

        setTimeout(() => {
            removeElement(heat);
        }, 4000);
    }

    /**
     * Epik ateş ses efektleri
     */
    playEpicFireSound() {
        // Ana ateş sesi
        this.soundEffects.playFire();

        // Ek ateş efektleri
        setTimeout(() => {
            if (this.soundEffects.playExplosion) {
                this.soundEffects.playExplosion();
            }
        }, 1000);

        setTimeout(() => {
            if (this.soundEffects.playImpact) {
                this.soundEffects.playImpact();
            }
        }, 2000);
    }

    /**
     * Büyük konfeti parçaları
     */
    createLargeConfetti() {
        const colors = ['🎊', '🎉', '✨', '⭐', '🌟'];

        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const confetti = createElement('div');
                confetti.textContent = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    font-size: ${30 + Math.random() * 40}px;
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES + 1};
                    animation: largeConfetti ${3 + Math.random() * 2}s ease-out forwards;
                    pointer-events: none;
                    opacity: 0.9;
                    transform: rotate(${Math.random() * 360}deg);
                `;

                document.body.appendChild(confetti);

                setTimeout(() => {
                    removeElement(confetti);
                }, 5000);
            }, i * 150);
        }
    }

    /**
     * Konfeti halkaları
     */
    createConfettiRings() {
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const ring = createElement('div');
                ring.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    width: ${100 + i * 50}px;
                    height: ${100 + i * 50}px;
                    border: 3px solid ${['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][i]};
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                    animation: confettiRing ${2 + i * 0.3}s ease-out forwards;
                    pointer-events: none;
                    opacity: 0.7;
                `;

                document.body.appendChild(ring);

                setTimeout(() => {
                    removeElement(ring);
                }, 3000);
            }, i * 200);
        }
    }

    /**
     * Konfeti yıldızları
     */
    createConfettiStars() {
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                const star = createElement('div');
                star.textContent = '⭐';
                star.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    font-size: ${25 + Math.random() * 25}px;
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES + 1};
                    animation: confettiStar ${2.5 + Math.random() * 1.5}s ease-out forwards;
                    filter: drop-shadow(0 0 10px #ffd700);
                    pointer-events: none;
                    opacity: 0.8;
                `;

                document.body.appendChild(star);

                setTimeout(() => {
                    removeElement(star);
                }, 4000);
            }, i * 200);
        }
    }

    /**
     * Konfeti titreşimi
     */
    createConfettiShake() {
        document.body.style.animation = 'confettiShake 0.8s ease-in-out';

        setTimeout(() => {
            document.body.style.animation = '';
        }, 800);
    }

    /**
     * Epik konfeti ses efektleri
     */
    playEpicConfettiSound() {
        // Ana konfeti sesi
        this.soundEffects.playConfetti();

        // Ek patlama sesleri
        setTimeout(() => {
            if (this.soundEffects.playExplosion) {
                this.soundEffects.playExplosion();
            }
        }, 500);

        setTimeout(() => {
            if (this.soundEffects.playCelebration) {
                this.soundEffects.playCelebration();
            }
        }, 1000);
    }

    /**
     * Yüzen kalpler
     */
    createFloatingHearts() {
        const heartEmojis = ['💖', '💕', '💗', '💓', '💞'];

        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const heart = createElement('div');
                heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
                heart.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    font-size: ${30 + Math.random() * 30}px;
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES + 1};
                    animation: floatingHeart ${4 + Math.random() * 2}s ease-out forwards;
                    filter: drop-shadow(0 0 15px #ff1493);
                    pointer-events: none;
                    opacity: 0.9;
                `;

                document.body.appendChild(heart);

                setTimeout(() => {
                    removeElement(heart);
                }, 6000);
            }, i * 200);
        }
    }

    /**
     * Kalp çiçekleri
     */
    createHeartFlowers() {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const flower = createElement('div');
                flower.textContent = '🌸';
                flower.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    font-size: ${25 + Math.random() * 25}px;
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES + 1};
                    animation: heartFlower ${3 + Math.random() * 2}s ease-out forwards;
                    filter: drop-shadow(0 0 10px #ff69b4);
                    pointer-events: none;
                    opacity: 0.8;
                `;

                document.body.appendChild(flower);

                setTimeout(() => {
                    removeElement(flower);
                }, 5000);
            }, i * 300);
        }
    }

    /**
     * Kalp yıldızları
     */
    createHeartStars() {
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const star = createElement('div');
                star.textContent = '💫';
                star.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    font-size: ${20 + Math.random() * 20}px;
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES + 1};
                    animation: heartStar ${2.5 + Math.random() * 1.5}s ease-out forwards;
                    filter: drop-shadow(0 0 8px #ffb6c1);
                    pointer-events: none;
                    opacity: 0.7;
                `;

                document.body.appendChild(star);

                setTimeout(() => {
                    removeElement(star);
                }, 4000);
            }, i * 150);
        }
    }

    /**
     * Romantik titreşim
     */
    createRomanticShake() {
        document.body.style.animation = 'romanticShake 1s ease-in-out';

        setTimeout(() => {
            document.body.style.animation = '';
        }, 1000);
    }

    /**
     * Epik aşk ses efektleri
     */
    playEpicLoveSound() {
        // Ana kalp sesi
        this.soundEffects.playHearts();

        // Ek romantik sesler
        setTimeout(() => {
            if (this.soundEffects.playCelebration) {
                this.soundEffects.playCelebration();
            }
        }, 800);

        setTimeout(() => {
            if (this.soundEffects.playMagic) {
                this.soundEffects.playMagic();
            }
        }, 1500);
    }

    /**
     * Gökkuşağı yıldızları
     */
    createRainbowStars() {
        for (let i = 0; i < 18; i++) {
            setTimeout(() => {
                const star = createElement('div');
                star.textContent = '⭐';
                star.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    font-size: ${20 + Math.random() * 25}px;
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES + 1};
                    animation: rainbowStar ${3 + Math.random() * 2}s ease-out forwards;
                    filter: drop-shadow(0 0 12px #ffd700);
                    pointer-events: none;
                    opacity: 0.8;
                `;

                document.body.appendChild(star);

                setTimeout(() => {
                    removeElement(star);
                }, 5000);
            }, i * 150);
        }
    }

    /**
     * Gökkuşağı bulutları
     */
    createRainbowClouds() {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const cloud = createElement('div');
                cloud.textContent = '☁️';
                cloud.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * 80 + 10}%;
                    left: ${Math.random() * 100}%;
                    font-size: ${40 + Math.random() * 30}px;
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                    animation: rainbowCloud ${5 + Math.random() * 3}s ease-out forwards;
                    pointer-events: none;
                    opacity: 0.6;
                `;

                document.body.appendChild(cloud);

                setTimeout(() => {
                    removeElement(cloud);
                }, 8000);
            }, i * 400);
        }
    }

    /**
     * Gökkuşağı kuşları
     */
    createRainbowBirds() {
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                const bird = createElement('div');
                bird.textContent = '🦅';
                bird.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * 60 + 20}%;
                    left: ${Math.random() * 100}%;
                    font-size: ${25 + Math.random() * 20}px;
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES + 1};
                    animation: rainbowBird ${4 + Math.random() * 2}s ease-out forwards;
                    pointer-events: none;
                    opacity: 0.8;
                `;

                document.body.appendChild(bird);

                setTimeout(() => {
                    removeElement(bird);
                }, 6000);
            }, i * 250);
        }
    }

    /**
     * Büyülü titreşim
     */
    createMagicShake() {
        document.body.style.animation = 'magicShake 1.2s ease-in-out';

        setTimeout(() => {
            document.body.style.animation = '';
        }, 1200);
    }

    /**
     * Epik büyü ses efektleri
     */
    playEpicMagicSound() {
        // Ana büyü sesi
        this.soundEffects.playMagic();

        // Ek mistik sesler
        setTimeout(() => {
            if (this.soundEffects.playCelebration) {
                this.soundEffects.playCelebration();
            }
        }, 1000);

        setTimeout(() => {
            if (this.soundEffects.playSpace) {
                this.soundEffects.playSpace();
            }
        }, 2000);
    }

    /**
     * Büyük meteorlar
     */
    createLargeMeteors() {
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const meteor = createElement('div');
                meteor.textContent = '☄️';
                meteor.style.cssText = `
                    position: fixed;
                    top: -100px;
                    left: ${Math.random() * 100}%;
                    font-size: ${60 + Math.random() * 40}px;
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                    animation: largeMeteor ${3 + Math.random() * 2}s ease-in-out forwards;
                    filter: drop-shadow(0 0 25px #ff4500);
                    pointer-events: none;
                    transform: rotate(45deg);
                `;

                document.body.appendChild(meteor);

                setTimeout(() => {
                    removeElement(meteor);
                }, 5000);
            }, i * 500);
        }
    }

    /**
     * Meteor parçaları
     */
    createMeteorDebris() {
        for (let i = 0; i < 25; i++) {
            setTimeout(() => {
                const debris = createElement('div');
                debris.textContent = '✨';
                debris.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    font-size: ${15 + Math.random() * 20}px;
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES + 1};
                    animation: meteorDebris ${2 + Math.random() * 2}s ease-out forwards;
                    color: ${['#ff4500', '#ffd700', '#ffffff', '#ff6347'][Math.floor(Math.random() * 4)]};
                    pointer-events: none;
                    opacity: 0.8;
                `;

                document.body.appendChild(debris);

                setTimeout(() => {
                    removeElement(debris);
                }, 4000);
            }, i * 120);
        }
    }

    /**
     * Şimşek yıldızları
     */
    createShootingStars() {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const star = createElement('div');
                star.textContent = '⭐';
                star.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * 50}%;
                    left: ${Math.random() * 100}%;
                    font-size: ${20 + Math.random() * 20}px;
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES + 1};
                    animation: shootingStar ${2.5 + Math.random() * 1.5}s ease-out forwards;
                    filter: drop-shadow(0 0 15px #87ceeb);
                    pointer-events: none;
                    opacity: 0.9;
                `;

                document.body.appendChild(star);

                setTimeout(() => {
                    removeElement(star);
                }, 4000);
            }, i * 300);
        }
    }

    /**
     * Kozmik titreşim
     */
    createCosmicShake() {
        document.body.style.animation = 'cosmicShake 1s ease-in-out';

        setTimeout(() => {
            document.body.style.animation = '';
        }, 1000);
    }

    /**
     * Epik uzay ses efektleri
     */
    playEpicSpaceSound() {
        // Ana uzay sesi
        this.soundEffects.playSpace();

        // Ek kozmik sesler
        setTimeout(() => {
            if (this.soundEffects.playExplosion) {
                this.soundEffects.playExplosion();
            }
        }, 800);

        setTimeout(() => {
            if (this.soundEffects.playImpact) {
                this.soundEffects.playImpact();
            }
        }, 1500);
    }

    /**
     * Rastgele matrix karakteri
     */
    getRandomMatrixChar() {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%^&*()_+-=[]{}|;:,.<>?';
        return chars.charAt(Math.floor(Math.random() * chars.length));
    }

    /**
     * Matrix hologram efekti
     */
    createMatrixHologram() {
        const hologram = createElement('div');
        hologram.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 400px;
            height: 400px;
            border-radius: 50%;
            background: radial-gradient(circle,
                rgba(0,255,0,0.3) 0%,
                rgba(0,255,0,0.2) 30%,
                rgba(0,255,0,0.1) 60%,
                transparent 100%);
            transform: translate(-50%, -50%);
            z-index: ${CONFIG.UI.Z_INDICES.PARTICLES + 1};
            animation: matrixHologram 12s ease-in-out forwards;
            pointer-events: none;
            box-shadow:
                0 0 50px rgba(0,255,0,0.5),
                0 0 100px rgba(0,255,0,0.3),
                0 0 150px rgba(0,255,0,0.2);
        `;

        document.body.appendChild(hologram);

        setTimeout(() => {
            removeElement(hologram);
        }, 12000);
    }

    /**
     * Matrix titreşimi
     */
    createMatrixShake() {
        document.body.style.animation = 'matrixShake 0.8s ease-in-out';

        setTimeout(() => {
            document.body.style.animation = '';
        }, 800);
    }

    /**
     * Epik matrix ses efektleri
     */
    playEpicMatrixSound() {
        // Ana matrix sesi
        this.soundEffects.playMatrix();

        // Ek dijital sesler
        setTimeout(() => {
            if (this.soundEffects.playSynth) {
                this.soundEffects.playSynth();
            }
        }, 2000);

        setTimeout(() => {
            if (this.soundEffects.playLazer) {
                this.soundEffects.playLazer();
            }
        }, 4000);
    }

    /**
     * Davul vuruşları
     */
    createDrumHits() {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const hit = createElement('div');
                hit.style.cssText = `
                    position: fixed;
                    top: ${40 + Math.random() * 20}%;
                    left: ${40 + Math.random() * 20}%;
                    width: ${50 + Math.random() * 50}px;
                    height: ${50 + Math.random() * 50}px;
                    border-radius: 50%;
                    background: radial-gradient(circle,
                        rgba(255,140,0,0.8) 0%,
                        rgba(210,105,30,0.6) 50%,
                        transparent 100%);
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES + 1};
                    animation: drumHit ${0.8 + Math.random() * 0.4}s ease-out forwards;
                    pointer-events: none;
                    opacity: 0.7;
                `;

                document.body.appendChild(hit);

                setTimeout(() => {
                    removeElement(hit);
                }, 1200);
            }, i * 150);
        }
    }

    /**
     * Müzik notaları
     */
    createMusicNotes() {
        const notes = ['♪', '♫', '♬', '♩', '♭', '♯'];

        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const note = createElement('div');
                note.textContent = notes[Math.floor(Math.random() * notes.length)];
                note.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    font-size: ${25 + Math.random() * 25}px;
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES + 1};
                    animation: musicNote ${3 + Math.random() * 2}s ease-out forwards;
                    color: ${['#ff4500', '#ffd700', '#ff6347', '#ffffff'][Math.floor(Math.random() * 4)]};
                    pointer-events: none;
                    opacity: 0.8;
                `;

                document.body.appendChild(note);

                setTimeout(() => {
                    removeElement(note);
                }, 5000);
            }, i * 150);
        }
    }

    /**
     * Ses dalgaları
     */
    createSoundWaves() {
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const wave = createElement('div');
                wave.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    width: ${100 + i * 30}px;
                    height: ${100 + i * 30}px;
                    border: 2px solid rgba(255,140,0,0.6);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                    animation: soundWave ${1.5 + i * 0.2}s ease-out forwards;
                    pointer-events: none;
                    opacity: 0.5;
                `;

                document.body.appendChild(wave);

                setTimeout(() => {
                    removeElement(wave);
                }, 2500);
            }, i * 200);
        }
    }

    /**
     * Davul titreşimi
     */
    createDrumShake() {
        document.body.style.animation = 'drumShake 0.6s ease-in-out';

        setTimeout(() => {
            document.body.style.animation = '';
        }, 600);
    }

    /**
     * Epik davul ses efektleri
     */
    playEpicDrumSound() {
        // Ana davul sesi
        this.soundEffects.playDrums();

        // Ek vuruş sesleri
        setTimeout(() => {
            if (this.soundEffects.playImpact) {
                this.soundEffects.playImpact();
            }
        }, 300);

        setTimeout(() => {
            if (this.soundEffects.playExplosion) {
                this.soundEffects.playExplosion();
            }
        }, 600);
    }

    /**
     * Ninja yıldızları efekti
     */
    createNinjaStars() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const star = createElement('div');
                star.textContent = '⭐';
                star.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    font-size: ${20 + Math.random() * 30}px;
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                    animation: ninjaStar 2s ease-out forwards;
                    filter: drop-shadow(0 0 10px #ffd700);
                    pointer-events: none;
                    opacity: 0;
                `;

                document.body.appendChild(star);

                setTimeout(() => {
                    removeElement(star);
                }, 2000);
            }, i * 100);
        }
    }

    /**
     * Duman efekti
     */
    createSmokeEffect() {
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const smoke = createElement('div');
                smoke.textContent = '💨';
                smoke.style.cssText = `
                    position: fixed;
                    top: ${40 + Math.random() * 20}%;
                    left: ${Math.random() * 100}%;
                    font-size: ${40 + Math.random() * 30}px;
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                    animation: smokeRise 3s ease-out forwards;
                    pointer-events: none;
                    opacity: 0.7;
                `;

                document.body.appendChild(smoke);

                setTimeout(() => {
                    removeElement(smoke);
                }, 3000);
            }, i * 150);
        }
    }

    /**
     * Rüzgar efekti
     */
    createWindEffect() {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const wind = createElement('div');
                wind.textContent = '🌪️';
                wind.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * 100}%;
                    left: -50px;
                    font-size: ${50 + Math.random() * 30}px;
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                    animation: windBlast 2.5s ease-out forwards;
                    pointer-events: none;
                    opacity: 0.8;
                `;

                document.body.appendChild(wind);

                setTimeout(() => {
                    removeElement(wind);
                }, 2500);
            }, i * 200);
        }
    }

    /**
     * Ninja titreşimi efekti
     */
    createNinjaShake() {
        const shake = createElement('div');
        shake.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
            animation: ninjaShake 0.5s ease-in-out;
            pointer-events: none;
            background: rgba(255, 0, 0, 0.1);
        `;

        document.body.appendChild(shake);

        setTimeout(() => {
            removeElement(shake);
        }, 500);
    }

    /**
     * Epik ninja ses efektleri
     */
    playEpicNinjaSound() {
        // Ninja ses efektlerini sırayla çal
        setTimeout(() => this.soundEffects.playNinja(), 0);
        setTimeout(() => this.soundEffects.playExplosion(), 500);
        setTimeout(() => this.soundEffects.playImpact(), 1000);
    }

    /**
     * Ortak Çöp Efekti - Tüm Valorant karakterleri için dinamik çöp efekti
     */
    async createTrashEffect(command) {
        const character = command.character;
        const effectId = `${character}Trash_` + Date.now();
        this.activeEffects.add(effectId);

        try {
            // VALORANT_TRASH_EFFECTS'tan karakter bilgilerini al
            const { VALORANT_TRASH_EFFECTS } = await import('../utils/Config.js');
            const charData = VALORANT_TRASH_EFFECTS[character];

            if (!charData) {
                logger.error(`Character data not found for: ${character}`);
                return false;
            }

            // Ana çöp kutusu efekti - ekranı dolduran büyük çöp kutusu
            const trashBin = createElement('div');
            trashBin.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                width: 400px;
                height: 400px;
                border-radius: 50%;
                background: radial-gradient(circle,
                    rgba(139,69,19,0.9) 0%,
                    rgba(101,67,33,0.8) 30%,
                    rgba(75,54,33,0.7) 60%,
                    rgba(47,79,79,0.5) 80%,
                    rgba(0,0,0,0.8) 100%);
                transform: translate(-50%, -50%);
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
                animation: trashBinExpand 6s ease-out forwards;
                box-shadow:
                    0 0 80px rgba(139,69,19,0.8),
                    0 0 160px rgba(101,67,33,0.6),
                    0 0 240px rgba(47,79,79,0.4);
                pointer-events: none;
                border: 8px solid #8B4513;
            `;

            document.body.appendChild(trashBin);

            // Çöp kutusu içine karakter adı yazısı
            const trashText = createElement('div');
            trashText.textContent = `${charData.name} ÇÖP`;
            trashText.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 48px;
                font-weight: bold;
                color: #FFD700;
                text-shadow:
                    0 0 10px #FF0000,
                    0 0 20px #FF0000,
                    0 0 30px #FF0000;
                z-index: ${CONFIG.UI.Z_INDICES.PARTICLES + 1};
                animation: trashTextPulse 2s ease-in-out infinite;
                pointer-events: none;
                font-family: 'Arial Black', sans-serif;
            `;

            trashBin.appendChild(trashText);

            // Çöp parçaları - her türlü çöp emoji'si
            this.createTrashDebris();

            // Karakter özel parçaları
            this.createCharacterParts(charData.parts);

            // Karakter özel mesajlar
            this.createCharacterMessages(charData.messages);

            // Karanlık perde efekti
            this.createTrashDarkness();

            // Çöp titreşimi
            this.createTrashShake();

            // Epik çöp ses efektleri
            this.playEpicTrashSound();

            // Cleanup
            setTimeout(() => {
                removeElement(trashBin);
                this.activeEffects.delete(effectId);
            }, 6000);

            return true;

        } catch (error) {
            logger.error(`Error creating ${character} trash effect:`, error);
            this.activeEffects.delete(effectId);
            return false;
        }
    }

    /**
     * Çöp parçaları oluştur
     */
    createTrashDebris() {
        const trashEmojis = [
            '🗑️', '🥤', '📦', '🥫', '🧴', '📱', '👟', '📰',
            '🍾', '🥖', '🛶', '🏊', '🐟', '🐠', '🦈', '🌿',
            '🍂', '🪵', '🪨', '🏠', '🚗', '🛥️', '🏄', '📺',
            '🪑', '🛋️', '🪴', '🎈', '🧸', '📚', '💼', '🔧',
            '⚙️', '🔩', '🛠️', '🔨', '💻', '🖥️', '📱', '⌚'
        ];

        for (let i = 0; i < 40; i++) {
            setTimeout(() => {
                const trash = createElement('div');
                trash.textContent = trashEmojis[Math.floor(Math.random() * trashEmojis.length)];
                trash.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    font-size: ${20 + Math.random() * 30}px;
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES + 2};
                    animation: trashDebris ${3 + Math.random() * 3}s ease-out forwards;
                    opacity: ${0.7 + Math.random() * 0.3};
                    pointer-events: none;
                    transform: rotate(${Math.random() * 720 - 360}deg) scale(${0.5 + Math.random() * 0.8});
                `;

                document.body.appendChild(trash);

                setTimeout(() => {
                    removeElement(trash);
                }, 6000);
            }, i * 80);
        }
    }

    /**
     * Karakter özel parçaları oluştur
     */
    createCharacterParts(parts) {
        for (let i = 0; i < 25; i++) {
            setTimeout(() => {
                const part = createElement('div');
                part.textContent = parts[Math.floor(Math.random() * parts.length)];
                part.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    font-size: ${25 + Math.random() * 25}px;
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES + 3};
                    animation: robotPart ${2.5 + Math.random() * 2.5}s ease-out forwards;
                    opacity: ${0.6 + Math.random() * 0.4};
                    pointer-events: none;
                    filter: grayscale(100%) brightness(0.5);
                    transform: rotate(${Math.random() * 720 - 360}deg) scale(${0.3 + Math.random() * 0.7});
                `;

                document.body.appendChild(part);

                setTimeout(() => {
                    removeElement(part);
                }, 5000);
            }, i * 120);
        }
    }

    /**
     * Karakter özel mesajlar oluştur
     */
    createCharacterMessages(messages) {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const message = createElement('div');
                message.textContent = messages[Math.floor(Math.random() * messages.length)];
                message.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * 80 + 10}%;
                    left: ${Math.random() * 80 + 10}%;
                    font-size: ${24 + Math.random() * 16}px;
                    font-weight: bold;
                    color: #FF0000;
                    text-shadow:
                        0 0 8px #000000,
                        0 0 16px #000000,
                        0 0 24px #000000;
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES + 4};
                    animation: trashMessage ${4 + Math.random() * 2}s ease-out forwards;
                    pointer-events: none;
                    font-family: 'Arial Black', sans-serif;
                    transform: rotate(${Math.random() * 30 - 15}deg);
                    opacity: 0.9;
                `;

                document.body.appendChild(message);

                setTimeout(() => {
                    removeElement(message);
                }, 6000);
            }, i * 400);
        }
    }

    /**
     * Hayalet parçaları oluştur - bozuk Omen parçaları
     */
    createGhostParts() {
        const ghostParts = [
            '👻', '💀', '🦇', '�️', '🌑', '🌙', '⚡', '�',
            '🧿', '🪄', '�', '�️', '🪦', '⚰️', '🧟', '🧙',
            '🧚', '🧛', '🧜', '🧝', '🧞', '🧟‍♂️', '🧟‍♀️', '�'
        ];

        for (let i = 0; i < 25; i++) {
            setTimeout(() => {
                const part = createElement('div');
                part.textContent = ghostParts[Math.floor(Math.random() * ghostParts.length)];
                part.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    font-size: ${25 + Math.random() * 25}px;
                    z-index: ${CONFIG.UI.Z_INDICES.PARTICLES + 3};
                    animation: robotPart ${2.5 + Math.random() * 2.5}s ease-out forwards;
                    opacity: ${0.6 + Math.random() * 0.4};
                    pointer-events: none;
                    filter: grayscale(100%) brightness(0.5);
                    transform: rotate(${Math.random() * 720 - 360}deg) scale(${0.3 + Math.random() * 0.7});
                `;

                document.body.appendChild(part);

                setTimeout(() => {
                    removeElement(part);
                }, 5000);
            }, i * 120);
        }
    }



    /**
     * Karanlık perde efekti
     */
    createTrashDarkness() {
        const darkness = createElement('div');
        darkness.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: radial-gradient(circle at 50% 50%,
                rgba(0,0,0,0.8) 0%,
                rgba(47,79,79,0.6) 30%,
                rgba(139,69,19,0.4) 60%,
                rgba(0,0,0,0.9) 100%);
            z-index: ${CONFIG.UI.Z_INDICES.PARTICLES - 1};
            animation: trashDarkness 6s ease-in-out forwards;
            pointer-events: none;
            opacity: 0.7;
        `;

        document.body.appendChild(darkness);

        setTimeout(() => {
            removeElement(darkness);
        }, 6000);
    }

    /**
     * Çöp titreşimi
     */
    createTrashShake() {
        document.body.style.animation = 'trashShake 0.8s ease-in-out';

        setTimeout(() => {
            document.body.style.animation = '';
        }, 800);
    }

    /**
     * Epik çöp ses efektleri
     */
    playEpicTrashSound() {
        // Ana çöp sesi
        if (this.soundEffects.playImpact) {
            this.soundEffects.playImpact();
        }

        // Ek çöp efektleri
        setTimeout(() => {
            if (this.soundEffects.playExplosion) {
                this.soundEffects.playExplosion();
            }
        }, 500);

        setTimeout(() => {
            if (this.soundEffects.playEarthquake) {
                this.soundEffects.playEarthquake();
            }
        }, 1000);

        setTimeout(() => {
            if (this.soundEffects.playNuke) {
                this.soundEffects.playNuke();
            }
        }, 2000);
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