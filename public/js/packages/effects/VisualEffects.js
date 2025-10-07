// packages/effects/VisualEffects.js - Re-export from original location during migration
// public/js/packages/effects/VisualEffects.js - Görsel efektler (moved from public/js/effects/VisualEffects.js)

import { ParticleSystem } from './ParticleSystem.js';
import { SoundEffects } from './SoundEffects.js';
import { CONFIG } from '../../utils/Config.js';
import { createElement, removeElement, sleep, logger } from '../../utils/Utils.js';

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

	// TOP-LEVEL WRAPPERS FOR CONFIG COMMANDS

	/**
	 * Konfeti patlaması (!konfeti)
	 */
	async createConfetti() {
		const effectId = 'confetti_' + Date.now();
		this.activeEffects.add(effectId);
		try {
			// Visuals
			this.createLargeConfetti();
			this.createConfettiRings();
			this.createConfettiStars();
			this.createConfettiShake();

			// Sounds (use existing ones)
			this.playEpicConfettiSound();

			setTimeout(() => this.activeEffects.delete(effectId), 5000);
			return true;
		} catch (error) {
			logger.error('Error creating confetti:', error);
			this.activeEffects.delete(effectId);
			return false;
		}
	}

	/**
	 * Kalp yağmuru (!kalp)
	 */
	async createHearts() {
		const effectId = 'hearts_' + Date.now();
		this.activeEffects.add(effectId);
		try {
			this.createFloatingHearts();
			this.createHeartFlowers();
			this.createHeartStars();
			this.createRomanticShake();
			this.playEpicLoveSound();
			setTimeout(() => this.activeEffects.delete(effectId), 6000);
			return true;
		} catch (error) {
			logger.error('Error creating hearts:', error);
			this.activeEffects.delete(effectId);
			return false;
		}
	}

	/**
	 * Gökkuşağı şovu (!rainbow)
	 */
	async createRainbow() {
		const effectId = 'rainbow_' + Date.now();
		this.activeEffects.add(effectId);
		try {
			this.createRainbowStars();
			this.createRainbowClouds();
			this.createRainbowBirds();
			this.createMagicShake();
			this.playEpicMagicSound();
			setTimeout(() => this.activeEffects.delete(effectId), 6000);
			return true;
		} catch (error) {
			logger.error('Error creating rainbow:', error);
			this.activeEffects.delete(effectId);
			return false;
		}
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
				left: -60vw;
				width: 220vw;
				height: 90vh;
				background: linear-gradient(0deg,
					rgba(255,69,0,0.6) 0%,
					rgba(255,140,0,0.5) 30%,
					rgba(255,215,0,0.4) 60%,
					transparent 100%);
				z-index: ${CONFIG.UI.Z_INDICES.PARTICLES - 1};
				animation: fireWall 5s ease-in-out 0.3s forwards;
				opacity: 0.6;
				pointer-events: none;
				border-radius: 40% 40% 0 0;
				transform-origin: center bottom;
			`;

			document.body.appendChild(secondaryFire);

			// Üçüncü küçük ateş katmanı
			const smallFire = createElement('div');
			smallFire.style.cssText = `
				position: fixed;
				bottom: 0;
				left: -40vw;
				width: 180vw;
				height: 70vh;
				background: linear-gradient(0deg,
					rgba(255,69,0,0.4) 0%,
					rgba(255,140,0,0.3) 40%,
					transparent 100%);
				z-index: ${CONFIG.UI.Z_INDICES.PARTICLES - 2};
				animation: fireWall 4s ease-in-out 0.6s forwards;
				opacity: 0.5;
				pointer-events: none;
				border-radius: 30% 30% 0 0;
				transform-origin: center bottom;
			`;

			document.body.appendChild(smallFire);

			// Ateş parçacıkları, orbs ve ısı bozulması
			this.createFireParticles();
			this.createFireOrbs();
			this.createHeatDistortion();

			// Güçlü titreşim
			document.body.style.animation = 'screenShake 1s ease-in-out 3';

			// Ses efektleri
			this.playEpicFireSound();

			// Cleanup
			setTimeout(() => {
				removeElement(fireWall);
				removeElement(secondaryFire);
				removeElement(smallFire);
				document.body.style.animation = '';
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
	 * Ormanda yağmur ve gök gürültüsü
	 */
	async createThunderstorm() {
		const effectId = 'thunderstorm_' + Date.now();
		this.activeEffects.add(effectId);

		try {
			// Cloud layer
			const clouds = createElement('div');
			clouds.style.cssText = `
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: linear-gradient(0deg, rgba(0,0,0,0.4), rgba(0,0,0,0.8));
				z-index: ${CONFIG.UI.Z_INDICES.PARTICLES - 1};
				animation: cloudDrift 10s ease-in-out forwards;
				pointer-events: none;
			`;

			document.body.appendChild(clouds);

			// Rain particles
			for (let i = 0; i < 120; i++) {
				setTimeout(() => {
					const drop = createElement('div');
					drop.textContent = '💧';
					drop.style.cssText = `
						position: fixed;
						left: ${Math.random() * 100}vw;
						top: -50px;
						font-size: ${Math.random() * 10 + 8}px;
						z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
						animation: raindrop ${Math.random() * 2 + 2}s linear forwards;
						pointer-events: none;
						opacity: ${0.5 + Math.random() * 0.5};
					`;

					document.body.appendChild(drop);

					setTimeout(() => removeElement(drop), 4000);
				}, i * 30);
			}

			// Lightning flashes
			for (let i = 0; i < 3; i++) {
				setTimeout(() => {
					const flash = createElement('div');
					flash.className = 'lightning-flash';
					flash.style.animation = 'lightningFlash 1s ease-out forwards';
					document.body.appendChild(flash);
					setTimeout(() => removeElement(flash), 1000);
				}, i * 1500);
			}

			// Sound
			this.soundEffects.playThunderstorm();

			// Cleanup
			setTimeout(() => {
				removeElement(clouds);
				this.activeEffects.delete(effectId);
			}, 10000);

			return true;

		} catch (error) {
			logger.error('Error creating thunderstorm:', error);
			this.activeEffects.delete(effectId);
			return false;
		}
	}

	/**
	 * Orta parmak efekti
	 */
	async createMiddleFinger() {
		const effectId = 'middleFinger_' + Date.now();
		this.activeEffects.add(effectId);

		try {
			const finger = createElement('div');
			finger.textContent = '🖕';
			finger.style.cssText = `
				position: fixed;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				font-size: 120px;
				z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
				animation: middleFinger 2s ease-in-out forwards;
				pointer-events: none;
			`;

			document.body.appendChild(finger);

			this.soundEffects.playImpact();

			setTimeout(() => {
				removeElement(finger);
				this.activeEffects.delete(effectId);
			}, 2000);

			return true;

		} catch (error) {
			logger.error('Error creating middle finger:', error);
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
			// Lazer çizgileri
			for (let i = 0; i < 8; i++) {
				setTimeout(() => {
					const lazer = createElement('div');
					lazer.style.cssText = `
						position: fixed;
						top: ${Math.random() * 100}vh;
						left: -100px;
						width: 100px;
						height: 6px;
						background: linear-gradient(90deg, transparent, #ff0044, transparent);
						z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
						animation: lazerBeam 2s ease-out forwards;
						filter: drop-shadow(0 0 10px #ff0044);
						pointer-events: none;
					`;

					document.body.appendChild(lazer);
					setTimeout(() => removeElement(lazer), 2000);
				}, i * 150);
			}

			// Ses
			this.soundEffects.playLazer();

			setTimeout(() => {
				this.activeEffects.delete(effectId);
			}, 2000);

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
			// Büyük meteorlar
			this.createLargeMeteors();

			// Parçalar
			this.createMeteorDebris();

			// Ekran titreşimi
			this.createCosmicShake();

			// Ses
			this.playEpicSpaceSound();

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
	 * Matrix efekti - Geliştirilmiş büyük versiyon (4x daha fazla harf, daha uzun süre)
	 */
	async createMatrix() {
		const effectId = 'matrix_' + Date.now();
		this.activeEffects.add(effectId);

		try {
			// Matrix hologramı
			this.createMatrixHologram();

			// Yağmur karakterleri
			const columns = Math.floor(window.innerWidth / 20);
			const drops = new Array(columns).fill(0);
			const container = createElement('div');
			container.style.cssText = `
				position: fixed;
				top: 0;
				left: 0;
				width: 100vw;
				height: 100vh;
				z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
				pointer-events: none;
				color: #0f0;
				font-family: 'Courier New', monospace;
				font-size: 16px;
				text-shadow: 0 0 5px #0f0;
			`;

			document.body.appendChild(container);

			const interval = setInterval(() => {
				container.innerHTML = '';
				for (let i = 0; i < columns; i++) {
					const char = this.getRandomMatrixChar();
					const x = i * 20;
					const y = drops[i] * 20;
					const span = createElement('span');
					span.textContent = char;
					span.style.cssText = `
						position: absolute;
						left: ${x}px;
						top: ${y}px;
					`;
					container.appendChild(span);
					if (Math.random() > 0.975) drops[i] = 0;
					drops[i]++;
					if (y > window.innerHeight) drops[i] = 0;
				}
			}, 50);

			// Ses
			this.playEpicMatrixSound();

			setTimeout(() => {
				clearInterval(interval);
				removeElement(container);
				this.activeEffects.delete(effectId);
			}, 12000);

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
				width: 300px;
				height: 300px;
				border-radius: 50%;
				background: radial-gradient(circle, rgba(0, 162, 255, 0.8), rgba(0, 0, 0, 0.8));
				transform: translate(-50%, -50%);
				z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
				animation: portalOpen 2.5s ease-out forwards;
				pointer-events: none;
				box-shadow: 0 0 30px rgba(0, 162, 255, 0.7), 0 0 60px rgba(0, 162, 255, 0.5);
			`;

			document.body.appendChild(portal);

			// Particles
			for (let i = 0; i < 40; i++) {
				setTimeout(() => {
					const particle = createElement('div');
					particle.textContent = '✨';
					particle.style.cssText = `
						position: fixed;
						top: ${50 + (Math.random() * 30 - 15)}%;
						left: ${50 + (Math.random() * 30 - 15)}%;
						font-size: ${10 + Math.random() * 20}px;
						z-index: ${CONFIG.UI.Z_INDICES.PARTICLES + 1};
						animation: portalParticle ${2 + Math.random() * 2}s ease-out forwards;
						filter: drop-shadow(0 0 10px #00a2ff);
						pointer-events: none;
						opacity: 0.9;
					`;
					document.body.appendChild(particle);
					setTimeout(() => removeElement(particle), 4000);
				}, i * 60);
			}

			this.soundEffects.playPortal();

			setTimeout(() => {
				removeElement(portal);
				this.activeEffects.delete(effectId);
			}, 2500);

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
			// Galaxy background
			const galaxy = createElement('div');
			galaxy.style.cssText = `
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: radial-gradient(circle at 50% 50%, rgba(0,0,0,0.8), rgba(0,0,50,0.9));
				z-index: ${CONFIG.UI.Z_INDICES.PARTICLES - 1};
				animation: galaxyDrift 8s ease-in-out forwards;
				pointer-events: none;
			`;

			document.body.appendChild(galaxy);

			// Stars and planets
			for (let i = 0; i < 80; i++) {
				setTimeout(() => {
					const star = createElement('div');
					star.textContent = Math.random() > 0.9 ? '🪐' : '⭐';
					star.style.cssText = `
						position: fixed;
						top: ${Math.random() * 100}vh;
						left: ${Math.random() * 100}vw;
						font-size: ${Math.random() * 20 + 10}px;
						z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
						animation: galaxyStar ${Math.random() * 2 + 2}s ease-in-out forwards;
						pointer-events: none;
						opacity: ${0.6 + Math.random() * 0.4};
					`;
					document.body.appendChild(star);
					setTimeout(() => removeElement(star), 4000);
				}, i * 60);
			}

			// Sound
			this.soundEffects.playSpace();

			setTimeout(() => {
				removeElement(galaxy);
				this.activeEffects.delete(effectId);
			}, 8000);

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
					bottom: 0;
					left: ${Math.random() * 100}vw;
					font-size: ${20 + Math.random() * 20}px;
					z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
					animation: foamDrift ${2 + Math.random() * 2}s ease-out forwards;
					pointer-events: none;
					opacity: ${0.5 + Math.random() * 0.4};
				`;
				document.body.appendChild(foam);
				setTimeout(() => removeElement(foam), 4000);
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
					top: ${Math.random() * 100}vh;
					left: ${Math.random() * 100}vw;
					font-size: ${Math.random() * 20 + 10}px;
					z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
					animation: debrisFloat ${Math.random() * 2 + 2}s ease-out forwards;
					pointer-events: none;
					opacity: ${0.5 + Math.random() * 0.4};
				`;
				document.body.appendChild(debris);
				setTimeout(() => removeElement(debris), 4000);
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
				splash.textContent = '💦';
				splash.style.cssText = `
					position: fixed;
					bottom: 0;
					left: ${Math.random() * 100}vw;
					font-size: ${15 + Math.random() * 15}px;
					z-index: ${CONFIG.UI.Z_INDICES.PARTICLES + 1};
					animation: splashUp ${1.5 + Math.random() * 1}s ease-out forwards;
					pointer-events: none;
					opacity: ${0.6 + Math.random() * 0.4};
				`;
				document.body.appendChild(splash);
				setTimeout(() => removeElement(splash), 2500);
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
					const synth = createElement('div');
					synth.textContent = '🎹';
					synth.style.cssText = `
						position: fixed;
						top: ${Math.random() * 100}vh;
						left: ${Math.random() * 100}vw;
						font-size: ${20 + Math.random() * 20}px;
						z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
						animation: synthWave ${1.5 + Math.random() * 1}s ease-out forwards;
						pointer-events: none;
						opacity: ${0.6 + Math.random() * 0.4};
					`;
					document.body.appendChild(synth);
					setTimeout(() => removeElement(synth), 2500);
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
						width: 8px;
						height: 8px;
						border-radius: 50%;
						background: ${['#ff00ff', '#00ffff', '#ffff00', '#ff0000', '#00ff00'][Math.floor(Math.random() * 5)]};
						z-index: ${CONFIG.UI.Z_INDICES.PARTICLES - 1};
						animation: discoLight ${Math.random() * 2 + 2}s ease-in-out forwards;
						filter: blur(2px);
						pointer-events: none;
						opacity: ${0.6 + Math.random() * 0.4};
					`;
					document.body.appendChild(light);
					setTimeout(() => removeElement(light), 4000);
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
						top: ${Math.random() * 100}vh;
						left: -50px;
						font-size: ${30 + Math.random() * 30}px;
						z-index: ${CONFIG.UI.Z_INDICES.PARTICLES};
						animation: ninjaRun 3s ease-in-out forwards;
						pointer-events: none;
					`;

					document.body.appendChild(ninja);

					setTimeout(() => removeElement(ninja), 3000);
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
		// Ana konfeti sesi (use available sounds)
		this.soundEffects.playCelebration();

		// Ek patlama sesleri
		setTimeout(() => {
			if (this.soundEffects.playExplosion) {
				this.soundEffects.playExplosion();
			}
		}, 500);

		setTimeout(() => {
			if (this.soundEffects.playMagic) {
				this.soundEffects.playMagic();
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
		const overrides = command || {};
		// Allow per-command duration override; default longer for readability
		const durationMs = typeof overrides.durationMs === 'number' && overrides.durationMs > 0
			? overrides.durationMs
			: 20000; // 20s default
		const effectId = `${character}Trash_` + Date.now();
		this.activeEffects.add(effectId);

		try {
			// VALORANT_TRASH_EFFECTS'tan karakter bilgilerini al
			const { VALORANT_TRASH_EFFECTS } = await import('../../utils/Config.js');
			const charData = VALORANT_TRASH_EFFECTS[character] || {};

			if (!charData) {
				logger.error(`Character data not found for: ${character}`);
				return false;
			}

			// Başlık metni: Config'te override varsa onu kullan
			const titleText = (typeof overrides.title === 'string' && overrides.title.trim().length > 0)
				? overrides.title
				: (typeof charData.title === 'string' && charData.title.trim().length > 0)
					? charData.title
					: `${charData.name || character?.toUpperCase()} ÇÖP`;

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
				animation: trashBinExpand ${durationMs}ms ease-out forwards;
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
			trashText.textContent = titleText;
			trashText.style.cssText = `
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				font-size: 48px;
				font-weight: bold;
				color: ${overrides.titleColor || charData.titleColor || '#FFD700'};
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
			this.createTrashDebris(durationMs);

			// Karakter özel parçaları
			this.createCharacterParts(overrides.parts || charData.parts || [], durationMs);

			// Karakter özel mesajlar (renk override destekler, tekrar yok)
			this.createCharacterMessages(
				overrides.messages || charData.messages || [],
				{
					color: overrides.messageColor || charData.messageColor,
					unique: overrides.uniqueMessages !== false, // default true
					durationMs
				}
			);

			// Karanlık perde efekti
			this.createTrashDarkness(durationMs);

			// Çöp titreşimi
			this.createTrashShake();

			// Epik çöp ses efektleri
			this.playEpicTrashSound();

			// Cleanup
			setTimeout(() => {
				removeElement(trashBin);
				this.activeEffects.delete(effectId);
			}, durationMs);

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
	createTrashDebris(durationMs = 20000) {
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
					animation: trashDebris ${Math.round(durationMs * (0.5 + Math.random() * 0.4))}ms ease-out forwards;
					opacity: ${0.7 + Math.random() * 0.3};
					pointer-events: none;
					transform: rotate(${Math.random() * 720 - 360}deg) scale(${0.5 + Math.random() * 0.8});
				`;

				document.body.appendChild(trash);

				setTimeout(() => {
					removeElement(trash);
				}, durationMs);
			}, i * 80);
		}
	}

	/**
	 * Karakter özel parçaları oluştur
	 */
	createCharacterParts(parts, durationMs = 20000) {
		if (!Array.isArray(parts) || parts.length === 0) return;
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
					animation: robotPart ${Math.round(durationMs * (0.5 + Math.random() * 0.3))}ms ease-out forwards;
					opacity: ${0.6 + Math.random() * 0.4};
					pointer-events: none;
					filter: grayscale(100%) brightness(0.5);
					transform: rotate(${Math.random() * 720 - 360}deg) scale(${0.3 + Math.random() * 0.7});
				`;

				document.body.appendChild(part);

				setTimeout(() => {
					removeElement(part);
				}, durationMs);
			}, i * 120);
		}
	}

	/**
	 * Karakter özel mesajlar oluştur
	 */
	createCharacterMessages(messages, { color, unique = true, durationMs = 20000 } = {}) {
		if (!Array.isArray(messages) || messages.length === 0) return;

		// Deduplicate and optionally enforce unique usage per effect
		const uniqueMessages = Array.from(new Set(messages.map(m => String(m).trim()))).filter(Boolean);
		const items = unique ? uniqueMessages : uniqueMessages.concat(uniqueMessages);

		// Shuffle
		for (let i = items.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[items[i], items[j]] = [items[j], items[i]];
		}

		const count = unique ? items.length : Math.min(items.length, 8);
		const delayStep = 800; // spread out for readability

		for (let i = 0; i < count; i++) {
			setTimeout(() => {
				const message = createElement('div');
				message.textContent = items[i];
				message.style.cssText = `
					position: fixed;
					top: ${Math.random() * 80 + 10}%;
					left: ${Math.random() * 80 + 10}%;
					font-size: ${24 + Math.random() * 16}px;
					font-weight: bold;
					color: ${color || '#FF0000'};
					text-shadow:
						0 0 8px #000000,
						0 0 16px #000000,
						0 0 24px #000000;
					z-index: ${CONFIG.UI.Z_INDICES.PARTICLES + 4};
					animation: trashMessage ${Math.round(durationMs * (0.7 + Math.random() * 0.2))}ms ease-out forwards;
					pointer-events: none;
					font-family: 'Arial Black', sans-serif;
					transform: rotate(${Math.random() * 30 - 15}deg);
					opacity: 0.95;
				`;

				document.body.appendChild(message);

				setTimeout(() => {
					removeElement(message);
				}, durationMs);
			}, i * delayStep);
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
	createTrashDarkness(durationMs = 20000) {
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
			animation: trashDarkness ${durationMs}ms ease-in-out forwards;
			pointer-events: none;
			opacity: 0.7;
		`;

		document.body.appendChild(darkness);

		setTimeout(() => {
			removeElement(darkness);
		}, durationMs);
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
