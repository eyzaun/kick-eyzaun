// packages/effects/SoundEffects.js - Ses efekt sistemi (moved)

import { CONFIG } from '../../utils/Config.js';
import { logger } from '../../utils/Utils.js';

/**
 * Sound Effects sınıfı - Web Audio API kullanarak ses efektleri
 */
export class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.masterVolume = CONFIG.AUDIO.VOLUME;
        this.enabled = CONFIG.AUDIO.ENABLED;
        this.activeSounds = new Map();
        this.unlocked = false;
        this._notified = false;
        
        // Defer audio context creation until a user gesture (autoplay policy)
        this.initializeAudioContext();
        
        logger.effect('SoundEffects initialized');
    }

    /**
     * Setup unlock handlers for Audio Context (lazy init)
     */
    initializeAudioContext() {
        const unlock = () => this.unlockAudio();
        try {
            // Attach once; different events for desktop/mobile
            document.addEventListener('click', unlock, { once: true });
            document.addEventListener('keydown', unlock, { once: true });
            document.addEventListener('touchstart', unlock, { once: true });
        } catch (error) {
            logger.warn('Unable to attach audio unlock handlers:', error);
        }
    }

    /**
     * Create and resume AudioContext on first user gesture
     */
    unlockAudio() {
        if (this.unlocked) return;
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            const tryResume = () => {
                if (this.audioContext.state === 'suspended') {
                    return this.audioContext.resume().catch(() => {});
                }
            };
            Promise.resolve(tryResume()).finally(() => {
                this.unlocked = (this.audioContext.state === 'running' || this.audioContext.state === 'interrupted');
                logger.effect('Audio context initialized' + (this.unlocked ? ' and resumed' : ''));
            });
        } catch (error) {
            logger.warn('Web Audio API not supported or blocked:', error);
            this.enabled = false;
        }
    }

    /** Ensure audio is allowed before creating nodes */
    ensureReady() {
        if (!this.enabled) return false;
        if (!this.audioContext || !this.unlocked || this.audioContext.state === 'suspended') {
            if (!this._notified) {
                logger.warn('Audio is blocked by the browser until a user gesture. Click the page to enable sound.');
                this._notified = true;
            }
            return false;
        }
        return true;
    }

    /**
     * Basit ton oluştur
     */
    createTone(frequency, duration, type = 'sine', volume = 1) {
        if (!this.ensureReady()) {
            return null;
        }

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            const finalVolume = this.masterVolume * volume;
            gainNode.gain.setValueAtTime(finalVolume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + duration);

            return { oscillator, gainNode };

        } catch (error) {
            logger.error('Error creating tone:', error);
            return null;
        }
    }

    /**
     * Kompleks ses efekti oluştur
     */
    createComplexSound(soundId, soundFunction) {
        if (!this.ensureReady()) {
            return false;
        }

        try {
            // Stop existing sound if playing
            if (this.activeSounds.has(soundId)) {
                this.stopSound(soundId);
            }

            const soundNodes = soundFunction();
            if (soundNodes) {
                this.activeSounds.set(soundId, soundNodes);
                
                // Auto cleanup
                setTimeout(() => {
                    this.stopSound(soundId);
                }, soundNodes.duration || 3000);
            }

            return true;

        } catch (error) {
            logger.error(`Error creating sound ${soundId}:`, error);
            return false;
        }
    }

    /**
     * Sesi durdur
     */
    stopSound(soundId) {
        if (this.activeSounds.has(soundId)) {
            const soundNodes = this.activeSounds.get(soundId);
            
            try {
                if (soundNodes.oscillator) {
                    soundNodes.oscillator.stop();
                }
                if (soundNodes.source) {
                    soundNodes.source.stop();
                }
            } catch (error) {
                // Sound might already be stopped
            }
            
            this.activeSounds.delete(soundId);
        }
    }

    // BASIC SOUND EFFECTS

    /**
     * Basit ses efekti
     */
    playSimple(frequency = 600, duration = 0.3, type = 'sine') {
        return this.createTone(frequency, duration, type);
    }

    /**
     * Başarı sesi
     */
    playSuccess() {
        return this.createComplexSound('success', () => {
            const frequencies = [261.63, 329.63, 392.00]; // C-E-G
            
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    this.createTone(freq, 0.2, 'sine', 0.3);
                }, index * 150);
            });

            return { duration: 800 };
        });
    }

    /**
     * Hata sesi
     */
    playError() {
        return this.createComplexSound('error', () => {
            this.createTone(200, 0.5, 'sawtooth', 0.4);
            return { duration: 500 };
        });
    }

    /**
     * Bildirim sesi
     */
    playNotification() {
        return this.createComplexSound('notification', () => {
            this.createTone(800, 0.1, 'square', 0.2);
            setTimeout(() => {
                this.createTone(1000, 0.1, 'square', 0.2);
            }, 100);

            return { duration: 300 };
        });
    }

    // EFFECT SPECIFIC SOUNDS

    /**
     * Patlama sesi
     */
    playExplosion() {
        return this.createComplexSound('explosion', () => {
            // Low frequency rumble
            const rumble = this.audioContext.createOscillator();
            const rumbleGain = this.audioContext.createGain();
            
            rumble.connect(rumbleGain);
            rumbleGain.connect(this.audioContext.destination);
            
            rumble.frequency.setValueAtTime(60, this.audioContext.currentTime);
            rumble.frequency.exponentialRampToValueAtTime(20, this.audioContext.currentTime + 1);
            rumble.type = 'sawtooth';
            
            rumbleGain.gain.setValueAtTime(this.masterVolume * 0.8, this.audioContext.currentTime);
            rumbleGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1);
            
            rumble.start();
            rumble.stop(this.audioContext.currentTime + 1);

            // High frequency crack
            setTimeout(() => {
                this.createTone(2000, 0.1, 'square', 0.3);
            }, 50);

            return { oscillator: rumble, gainNode: rumbleGain, duration: 1000 };
        });
    }

    /**
     * Yıldırım sesi
     */
    playLightning() {
        return this.createComplexSound('lightning', () => {
            // Thunder rumble
            const thunder = this.audioContext.createOscillator();
            const thunderGain = this.audioContext.createGain();
            
            thunder.connect(thunderGain);
            thunderGain.connect(this.audioContext.destination);
            
            thunder.frequency.setValueAtTime(100, this.audioContext.currentTime);
            thunder.frequency.exponentialRampToValueAtTime(40, this.audioContext.currentTime + 2);
            thunder.type = 'sawtooth';
            
            thunderGain.gain.setValueAtTime(this.masterVolume * 0.6, this.audioContext.currentTime);
            thunderGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2);
            
            thunder.start();
            thunder.stop(this.audioContext.currentTime + 2);

            // Lightning crack
            this.createTone(4000, 0.05, 'square', 0.4);

            return { oscillator: thunder, gainNode: thunderGain, duration: 2000 };
        });
    }

    /**
     * Rüzgar sesi
     */
    playWind() {
        return this.createComplexSound('wind', () => {
            const wind = this.audioContext.createOscillator();
            const windGain = this.audioContext.createGain();
            
            wind.connect(windGain);
            windGain.connect(this.audioContext.destination);
            
            wind.frequency.setValueAtTime(200, this.audioContext.currentTime);
            wind.frequency.setValueAtTime(180, this.audioContext.currentTime + 0.5);
            wind.frequency.setValueAtTime(220, this.audioContext.currentTime + 1);
            wind.type = 'sawtooth';
            
            windGain.gain.setValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime);
            windGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 3);
            
            wind.start();
            wind.stop(this.audioContext.currentTime + 3);

            return { oscillator: wind, gainNode: windGain, duration: 3000 };
        });
    }

    /**
     * Ateş sesi
     */
    playFire() {
        return this.createComplexSound('fire', () => {
            // Crackling sound with noise
            const frequencies = [400, 800, 1200, 1600];
            
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    this.createTone(freq + Math.random() * 200, 0.1, 'sawtooth', 0.1);
                }, index * 100 + Math.random() * 200);
            });

            return { duration: 2000 };
        });
    }

    /**
     * Kutlama sesi
     */
    playCelebration() {
        return this.createComplexSound('celebration', () => {
            // Rising scale
            const scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // C major
            
            scale.forEach((freq, index) => {
                setTimeout(() => {
                    this.createTone(freq, 0.15, 'sine', 0.25);
                }, index * 100);
            });

            return { duration: 1200 };
        });
    }

    /**
     * Kalp sesi
     */
    playHearts() {
        return this.createComplexSound('hearts', () => {
            // Gentle ascending tones
            const frequencies = [523.25, 659.25, 783.99]; // C-E-G octave
            
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    this.createTone(freq, 0.3, 'sine', 0.2);
                }, index * 200);
            });

            return { duration: 800 };
        });
    }

    /**
     * Sihir sesi
     */
    playMagic() {
        return this.createComplexSound('magic', () => {
            // Ethereal ascending sound
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.frequency.setValueAtTime(440, this.audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 1);
            osc.type = 'sine';
            
            gain.gain.setValueAtTime(0, this.audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1);
            
            osc.start();
            osc.stop(this.audioContext.currentTime + 1);

            return { oscillator: osc, gainNode: gain, duration: 1000 };
        });
    }

    /**
     * Deprem sesi
     */
    playEarthquake() {
        return this.createComplexSound('earthquake', () => {
            const rumble = this.audioContext.createOscillator();
            const rumbleGain = this.audioContext.createGain();
            
            rumble.connect(rumbleGain);
            rumbleGain.connect(this.audioContext.destination);
            
            rumble.frequency.setValueAtTime(30, this.audioContext.currentTime);
            rumble.frequency.linearRampToValueAtTime(25, this.audioContext.currentTime + 0.5);
            rumble.frequency.linearRampToValueAtTime(35, this.audioContext.currentTime + 1);
            rumble.type = 'sawtooth';
            
            rumbleGain.gain.setValueAtTime(this.masterVolume * 0.5, this.audioContext.currentTime);
            rumbleGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1);
            
            rumble.start();
            rumble.stop(this.audioContext.currentTime + 1);

            return { oscillator: rumble, gainNode: rumbleGain, duration: 1000 };
        });
    }

    /**
     * Alaycı ses efekti
     */
    playTaunt() {
        return this.createComplexSound('taunt', () => {
            const hits = [
                { delay: 0, freq: 110, duration: 0.45, type: 'square', volume: 0.35 },
                { delay: 140, freq: 180, duration: 0.35, type: 'sawtooth', volume: 0.28 },
                { delay: 320, freq: 85, duration: 0.55, type: 'square', volume: 0.38 },
                { delay: 520, freq: 260, duration: 0.2, type: 'triangle', volume: 0.25 },
                { delay: 720, freq: 140, duration: 0.4, type: 'sawtooth', volume: 0.3 }
            ];

            hits.forEach(hit => {
                setTimeout(() => this.createTone(hit.freq, hit.duration, hit.type, hit.volume), hit.delay);
            });

            setTimeout(() => {
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => this.createTone(70 + i * 30, 0.35, 'square', 0.32), i * 110);
                }
            }, 980);

            setTimeout(() => {
                [420, 360, 300].forEach((freq, index) => {
                    setTimeout(() => this.createTone(freq, 0.18, 'triangle', 0.22), index * 90);
                });
            }, 1500);

            return { duration: 2100 };
        });
    }

    // ADVANCED SOUND EFFECTS

    /**
     * Lazer sesi
     */
    playLazer() {
        return this.createComplexSound('lazer', () => {
            const lazer = this.audioContext.createOscillator();
            const lazerGain = this.audioContext.createGain();
            
            lazer.connect(lazerGain);
            lazerGain.connect(this.audioContext.destination);
            
            lazer.frequency.setValueAtTime(1000, this.audioContext.currentTime);
            lazer.frequency.exponentialRampToValueAtTime(2000, this.audioContext.currentTime + 0.5);
            lazer.frequency.exponentialRampToValueAtTime(500, this.audioContext.currentTime + 1);
            lazer.type = 'sawtooth';
            
            lazerGain.gain.setValueAtTime(this.masterVolume * 0.4, this.audioContext.currentTime);
            lazerGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1);
            
            lazer.start();
            lazer.stop(this.audioContext.currentTime + 1);

            return { oscillator: lazer, gainNode: lazerGain, duration: 1000 };
        });
    }

    /**
     * Meteor sesi
     */
    playMeteor() {
        return this.createComplexSound('meteor', () => {
            // Whoosh sound
            const whoosh = this.audioContext.createOscillator();
            const whooshGain = this.audioContext.createGain();
            
            whoosh.connect(whooshGain);
            whooshGain.connect(this.audioContext.destination);
            
            whoosh.frequency.setValueAtTime(800, this.audioContext.currentTime);
            whoosh.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 2);
            whoosh.type = 'sawtooth';
            
            whooshGain.gain.setValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime);
            whooshGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2);
            
            whoosh.start();
            whoosh.stop(this.audioContext.currentTime + 2);

            return { oscillator: whoosh, gainNode: whooshGain, duration: 2000 };
        });
    }

    /**
     * Matrix sesi
     */
    playMatrix() {
        return this.createComplexSound('matrix', () => {
            // Digital beeping sounds
            const frequencies = [1000, 1200, 800, 1400, 900, 1100];
            
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    this.createTone(freq, 0.1, 'square', 0.1);
                }, index * 200 + Math.random() * 100);
            });

            return { duration: 2000 };
        });
    }

    /**
     * Portal sesi
     */
    playPortal() {
        return this.createComplexSound('portal', () => {
            const portal = this.audioContext.createOscillator();
            const portalGain = this.audioContext.createGain();
            
            portal.connect(portalGain);
            portalGain.connect(this.audioContext.destination);
            
            // Warping frequency effect
            portal.frequency.setValueAtTime(440, this.audioContext.currentTime);
            portal.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 1);
            portal.frequency.exponentialRampToValueAtTime(220, this.audioContext.currentTime + 2);
            portal.type = 'sine';
            
            portalGain.gain.setValueAtTime(this.masterVolume * 0.4, this.audioContext.currentTime);
            portalGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2);
            
            portal.start();
            portal.stop(this.audioContext.currentTime + 2);

            return { oscillator: portal, gainNode: portalGain, duration: 2000 };
        });
    }

    /**
     * Uzay sesi
     */
    playSpace() {
        return this.createComplexSound('space', () => {
            // Ambient space sound
            const space = this.audioContext.createOscillator();
            const spaceGain = this.audioContext.createGain();
            
            space.connect(spaceGain);
            spaceGain.connect(this.audioContext.destination);
            
            space.frequency.setValueAtTime(100, this.audioContext.currentTime);
            space.frequency.linearRampToValueAtTime(120, this.audioContext.currentTime + 2);
            space.frequency.linearRampToValueAtTime(80, this.audioContext.currentTime + 4);
            space.type = 'sine';
            
            spaceGain.gain.setValueAtTime(this.masterVolume * 0.2, this.audioContext.currentTime);
            spaceGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 4);
            
            space.start();
            space.stop(this.audioContext.currentTime + 4);

            return { oscillator: space, gainNode: spaceGain, duration: 4000 };
        });
    }

    /**
     * Tsunami sesi
     */
    playTsunami() {
        return this.createComplexSound('tsunami', () => {
            const wave = this.audioContext.createOscillator();
            const waveGain = this.audioContext.createGain();
            
            wave.connect(waveGain);
            waveGain.connect(this.audioContext.destination);
            
            wave.frequency.setValueAtTime(60, this.audioContext.currentTime);
            wave.frequency.exponentialRampToValueAtTime(40, this.audioContext.currentTime + 3);
            wave.type = 'sine';
            
            waveGain.gain.setValueAtTime(this.masterVolume * 0.6, this.audioContext.currentTime);
            waveGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 3);
            
            wave.start();
            wave.stop(this.audioContext.currentTime + 3);

            return { oscillator: wave, gainNode: waveGain, duration: 3000 };
        });
    }

    /**
     * Su sıçraması sesi
     */
    playWaterSplash() {
        return this.createComplexSound('watersplash', () => {
            // Multiple splash sounds
            const splashes = [800, 600, 1000, 400];
            
            splashes.forEach((freq, index) => {
                setTimeout(() => {
                    this.createTone(freq, 0.1, 'sawtooth', 0.2);
                }, index * 50);
            });

            return { duration: 500 };
        });
    }

    /**
     * Çarpma/impact sesi
     */
    playImpact() {
        return this.createComplexSound('impact', () => {
            // Low frequency impact
            this.createTone(80, 0.3, 'sawtooth', 0.5);
            
            // Higher frequency crack
            setTimeout(() => {
                this.createTone(1200, 0.1, 'square', 0.3);
            }, 100);

            return { duration: 500 };
        });
    }

    /**
     * Su akışı sesi
     */
    playWaterFlow() {
        return this.createComplexSound('waterflow', () => {
            const flow = this.audioContext.createOscillator();
            const flowGain = this.audioContext.createGain();
            
            flow.connect(flowGain);
            flowGain.connect(this.audioContext.destination);
            
            flow.frequency.setValueAtTime(200, this.audioContext.currentTime);
            flow.frequency.linearRampToValueAtTime(180, this.audioContext.currentTime + 2);
            flow.frequency.linearRampToValueAtTime(220, this.audioContext.currentTime + 4);
            flow.type = 'sawtooth';
            
            flowGain.gain.setValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime);
            flowGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 4);
            
            flow.start();
            flow.stop(this.audioContext.currentTime + 4);

            return { oscillator: flow, gainNode: flowGain, duration: 4000 };
        });
    }

    // MUSICAL EFFECTS

    /**
     * Bass drop
     */
    playBassDrop() {
        return this.createComplexSound('bassdrop', () => {
            const bass = this.audioContext.createOscillator();
            const bassGain = this.audioContext.createGain();
            
            bass.connect(bassGain);
            bassGain.connect(this.audioContext.destination);
            
            bass.frequency.setValueAtTime(100, this.audioContext.currentTime);
            bass.frequency.exponentialRampToValueAtTime(30, this.audioContext.currentTime + 1);
            bass.type = 'square';
            
            bassGain.gain.setValueAtTime(this.masterVolume * 0.8, this.audioContext.currentTime);
            bassGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1);
            
            bass.start();
            bass.stop(this.audioContext.currentTime + 1);

            return { oscillator: bass, gainNode: bassGain, duration: 1000 };
        });
    }

    /**
     * Davul sesi
     */
    playDrums() {
        return this.createComplexSound('drums', () => {
            // Kick drum pattern
            const kicks = [0, 0.5, 1, 1.5];
            
            kicks.forEach(time => {
                setTimeout(() => {
                    this.createTone(60, 0.1, 'sine', 0.6);
                    this.createTone(200, 0.05, 'square', 0.3);
                }, time * 1000);
            });

            return { duration: 2000 };
        });
    }

    /**
     * Gitar sesi
     */
    playGuitar() {
        return this.createComplexSound('guitar', () => {
            // Guitar chord
            const chord = [82.41, 110.00, 146.83, 196.00]; // E-A-D-G
            
            chord.forEach((freq, index) => {
                setTimeout(() => {
                    this.createTone(freq, 1.5, 'sawtooth', 0.15);
                }, index * 50);
            });

            return { duration: 1500 };
        });
    }

    /**
     * Synthesizer sesi
     */
    playSynth() {
        return this.createComplexSound('synth', () => {
            const synth = this.audioContext.createOscillator();
            const synthGain = this.audioContext.createGain();
            
            synth.connect(synthGain);
            synthGain.connect(this.audioContext.destination);
            
            synth.frequency.setValueAtTime(440, this.audioContext.currentTime);
            synth.frequency.exponentialRampToValueAtTime(660, this.audioContext.currentTime + 0.5);
            synth.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 1);
            synth.type = 'square';
            
            synthGain.gain.setValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime);
            synthGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1);
            
            synth.start();
            synth.stop(this.audioContext.currentTime + 1);

            return { oscillator: synth, gainNode: synthGain, duration: 1000 };
        });
    }

    // SPECIAL EFFECTS

    /**
     * Nükleer patlama sesi
     */
    playNuke() {
        return this.createComplexSound('nuke', () => {
            // Massive explosion
            const nuke = this.audioContext.createOscillator();
            const nukeGain = this.audioContext.createGain();
            
            nuke.connect(nukeGain);
            nukeGain.connect(this.audioContext.destination);
            
            nuke.frequency.setValueAtTime(40, this.audioContext.currentTime);
            nuke.frequency.exponentialRampToValueAtTime(20, this.audioContext.currentTime + 3);
            nuke.type = 'sawtooth';
            
            nukeGain.gain.setValueAtTime(this.masterVolume * 1.0, this.audioContext.currentTime);
            nukeGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 3);
            
            nuke.start();
            nuke.stop(this.audioContext.currentTime + 3);

            return { oscillator: nuke, gainNode: nukeGain, duration: 3000 };
        });
    }

    /**
     * Disco sesi
     */
    playDisco() {
        return this.createComplexSound('disco', () => {
            // Disco beat
            const beat = [440, 523, 659, 523, 440, 523, 659, 880];
            
            beat.forEach((freq, index) => {
                setTimeout(() => {
                    this.createTone(freq, 0.2, 'square', 0.2);
                }, index * 200);
            });

            return { duration: 2000 };
        });
    }

    /**
     * UFO sesi
     */
    playUFO() {
        return this.createComplexSound('ufo', () => {
            const ufo = this.audioContext.createOscillator();
            const ufoGain = this.audioContext.createGain();
            
            ufo.connect(ufoGain);
            ufoGain.connect(this.audioContext.destination);
            
            // Warbling alien sound
            ufo.frequency.setValueAtTime(300, this.audioContext.currentTime);
            ufo.frequency.linearRampToValueAtTime(600, this.audioContext.currentTime + 0.5);
            ufo.frequency.linearRampToValueAtTime(200, this.audioContext.currentTime + 1);
            ufo.frequency.linearRampToValueAtTime(800, this.audioContext.currentTime + 1.5);
            ufo.frequency.linearRampToValueAtTime(300, this.audioContext.currentTime + 2);
            ufo.type = 'sine';
            
            ufoGain.gain.setValueAtTime(this.masterVolume * 0.4, this.audioContext.currentTime);
            ufoGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2);
            
            ufo.start();
            ufo.stop(this.audioContext.currentTime + 2);

            return { oscillator: ufo, gainNode: ufoGain, duration: 2000 };
        });
    }

    /**
     * Ninja sesi
     */
    playNinja() {
        return this.createComplexSound('ninja', () => {
            // Quick swoosh
            this.createTone(800, 0.1, 'sawtooth', 0.3);
            
            setTimeout(() => {
                this.createTone(400, 0.1, 'sawtooth', 0.2);
            }, 200);

            return { duration: 500 };
        });
    }

    // UTILITY METHODS

    /**
     * Ses seviyesini ayarla
     */
    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        logger.effect(`Volume set to ${this.masterVolume}`);
    }

    /**
     * Sesi aç/kapat
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        
        if (!enabled) {
            this.stopAllSounds();
        }
        
        logger.effect(`Sound effects ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Tüm sesleri durdur
     */
    stopAllSounds() {
        this.activeSounds.forEach((sound, soundId) => {
            this.stopSound(soundId);
        });
        
        logger.effect('All sounds stopped');
    }

    /**
     * Audio Context durumunu al
     */
    getAudioContextState() {
        return this.audioContext ? this.audioContext.state : 'unavailable';
    }

    /**
     * İstatistikler
     */
    getStats() {
        return {
            enabled: this.enabled,
            masterVolume: this.masterVolume,
            activeSounds: this.activeSounds.size,
            audioContextState: this.getAudioContextState(),
            audioContextSupported: !!this.audioContext
        };
    }

    /**
     * Cleanup ve kapatma
     */
    destroy() {
        this.stopAllSounds();
        
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        
        logger.effect('SoundEffects destroyed');
    }
}

export default SoundEffects;
