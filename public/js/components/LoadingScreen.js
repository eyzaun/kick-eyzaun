// public/js/components/LoadingScreen.js - Yükleme ekranı yönetimi

import { EventEmitter } from '../utils/EventEmitter.js';
import { CONFIG } from '../utils/Config.js';
import { logger } from '../utils/Utils.js';

/**
 * Loading Screen Manager - Yükleme ekranını yönetir
 */
export class LoadingScreenManager extends EventEmitter {
    constructor() {
        super();
        
        this.element = null;
        this.progressBar = null;
        this.statusText = null;
        this.subStatusText = null;
        this.channelNameElement = null;
        
        this.isVisible = false;
        this.currentProgress = 0;
        this.loadingSteps = [];
        this.currentStepIndex = 0;
        
        this.initializeElements();
        this.setupDefaultSteps();
        
        logger.info('LoadingScreenManager initialized');
    }

    /**
     * DOM elementlerini başlat
     */
    initializeElements() {
        this.element = document.getElementById('loadingScreen');
        
        if (!this.element) {
            this.createLoadingScreen();
        }
        
        // Alt elementleri bul
        this.statusText = this.element.querySelector('.loading-title');
        this.subStatusText = this.element.querySelector('.loading-subtitle');
        this.channelNameElement = this.element.querySelector('#channelName');
        
        // Progress bar oluştur
        this.createProgressBar();
    }

    /**
     * Loading screen oluştur
     */
    createLoadingScreen() {
        this.element = document.createElement('div');
        this.element.id = 'loadingScreen';
        this.element.className = 'loading-screen';
        
        this.element.innerHTML = `
            <div class="spinner"></div>
            <div class="loading-title">EYZAUN MULTI-USER AVATAR SYSTEM</div>
            <div class="loading-subtitle">Her kullanıcı kendi avatarını kontrol ediyor...</div>
            <div class="loading-channel">Kanal: <span id="channelName">eyzaun</span></div>
            <div class="loading-version">Sistem: Multi-Avatar Interactive v4.0.0</div>
            <div class="loading-progress-container"></div>
            <div class="loading-status"></div>
        `;
        
        document.body.appendChild(this.element);
        
        // Alt elementleri tekrar bul
        this.statusText = this.element.querySelector('.loading-title');
        this.subStatusText = this.element.querySelector('.loading-subtitle');
        this.channelNameElement = this.element.querySelector('#channelName');
    }

    /**
     * Progress bar oluştur
     */
    createProgressBar() {
        const container = this.element.querySelector('.loading-progress-container');
        if (!container) return;
        
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'loading-progress-bar';
        this.progressBar.style.cssText = `
            width: 300px;
            height: 4px;
            background: rgba(255,255,255,0.2);
            border-radius: 2px;
            margin: 20px auto;
            overflow: hidden;
        `;
        
        const fill = document.createElement('div');
        fill.className = 'loading-progress-fill';
        fill.style.cssText = `
            height: 100%;
            background: linear-gradient(90deg, #ff69b4, #00ff00);
            border-radius: 2px;
            width: 0%;
            transition: width 0.3s ease;
            animation: gradientShift 2s ease infinite;
        `;
        
        this.progressBar.appendChild(fill);
        container.appendChild(this.progressBar);
    }

    /**
     * Varsayılan yükleme adımlarını ayarla
     */
    setupDefaultSteps() {
        this.loadingSteps = [
            { text: 'Sistem başlatılıyor...', progress: 10, duration: 500 },
            { text: 'WebSocket bağlantısı kuruluyor...', progress: 25, duration: 1000 },
            { text: 'Kanal bilgileri alınıyor...', progress: 40, duration: 800 },
            { text: 'Chat sistemine bağlanılıyor...', progress: 60, duration: 1200 },
            { text: 'Avatar sistemi hazırlanıyor...', progress: 75, duration: 600 },
            { text: 'Efekt sistemi yükleniyor...', progress: 85, duration: 400 },
            { text: 'Son kontroller yapılıyor...', progress: 95, duration: 300 },
            { text: 'Sistem hazır!', progress: 100, duration: 200 }
        ];
    }

    /**
     * Loading screen'i göster
     */
    show() {
        if (this.element) {
            this.element.classList.remove('hidden');
            this.isVisible = true;
            this.emit('shown');
            
            logger.info('Loading screen shown');
        }
    }

    /**
     * Loading screen'i gizle
     */
    hide() {
        if (this.element) {
            this.element.classList.add('hidden');
            this.isVisible = false;
            this.emit('hidden');
            
            logger.info('Loading screen hidden');
        }
    }

    /**
     * Progress'i güncelle
     */
    setProgress(percentage, animated = true) {
        this.currentProgress = Math.max(0, Math.min(100, percentage));
        
        const fill = this.progressBar?.querySelector('.loading-progress-fill');
        if (fill) {
            if (animated) {
                fill.style.transition = 'width 0.3s ease';
            } else {
                fill.style.transition = 'none';
            }
            fill.style.width = this.currentProgress + '%';
        }
        
        this.emit('progressUpdated', { progress: this.currentProgress });
    }

    /**
     * Durum metnini güncelle
     */
    setStatus(text) {
        if (this.statusText) {
            this.statusText.textContent = text;
        }
        
        this.emit('statusUpdated', { status: text });
    }

    /**
     * Alt durum metnini güncelle
     */
    setSubStatus(text) {
        if (this.subStatusText) {
            this.subStatusText.textContent = text;
        }
        
        this.emit('subStatusUpdated', { subStatus: text });
    }

    /**
     * Kanal adını güncelle
     */
    setChannelName(channelName) {
        if (this.channelNameElement) {
            this.channelNameElement.textContent = channelName;
        }
        
        this.emit('channelNameUpdated', { channelName });
    }

    /**
     * Yükleme adımını çalıştır
     */
    async executeStep(stepIndex) {
        if (stepIndex >= this.loadingSteps.length) {
            return false;
        }
        
        const step = this.loadingSteps[stepIndex];
        this.currentStepIndex = stepIndex;
        
        // Update UI
        this.setSubStatus(step.text);
        this.setProgress(step.progress);
        
        this.emit('stepStarted', { stepIndex, step });
        
        // Wait for step duration
        await new Promise(resolve => setTimeout(resolve, step.duration));
        
        this.emit('stepCompleted', { stepIndex, step });
        
        return true;
    }

    /**
     * Tüm yükleme adımlarını sırayla çalıştır
     */
    async executeAllSteps() {
        this.emit('loadingStarted');
        
        for (let i = 0; i < this.loadingSteps.length; i++) {
            const success = await this.executeStep(i);
            if (!success) break;
        }
        
        this.emit('loadingCompleted');
    }

    /**
     * Özel yükleme sırası ayarla
     */
    setCustomSteps(steps) {
        this.loadingSteps = steps.map(step => ({
            text: step.text || 'Yükleniyor...',
            progress: step.progress || 0,
            duration: step.duration || 1000
        }));
        
        this.currentStepIndex = 0;
        this.emit('stepsUpdated', { steps: this.loadingSteps });
    }

    /**
     * Hızlı yükleme modu
     */
    async fastLoad() {
        this.show();
        
        const quickSteps = [
            { text: 'Sistem başlatılıyor...', progress: 30, duration: 200 },
            { text: 'Bağlantı kuruluyor...', progress: 70, duration: 300 },
            { text: 'Hazırlanıyor...', progress: 100, duration: 200 }
        ];
        
        this.setCustomSteps(quickSteps);
        await this.executeAllSteps();
        
        setTimeout(() => {
            this.hide();
        }, 500);
    }

    /**
     * Detaylı yükleme modu
     */
    async detailedLoad() {
        this.show();
        await this.executeAllSteps();
        
        setTimeout(() => {
            this.hide();
        }, 1000);
    }

    /**
     * Hata durumu göster
     */
    showError(errorMessage, details = '') {
        this.show();
        
        // Update styling for error
        if (this.element) {
            this.element.style.background = 'linear-gradient(135deg, #1a1a1a, #2a1a1a, #1a1a1a)';
        }
        
        this.setStatus('BAĞLANTI HATASI');
        this.setSubStatus(errorMessage);
        
        // Add retry button
        this.addRetryButton();
        
        this.emit('errorShown', { error: errorMessage, details });
        
        logger.error('Loading screen error:', errorMessage);
    }

    /**
     * Retry butonu ekle
     */
    addRetryButton() {
        // Remove existing retry button
        const existingButton = this.element.querySelector('.retry-button');
        if (existingButton) {
            existingButton.remove();
        }
        
        const retryButton = document.createElement('button');
        retryButton.textContent = 'Tekrar Dene';
        retryButton.className = 'retry-button';
        retryButton.style.cssText = `
            background: #ff69b4;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 20px;
            transition: all 0.3s ease;
        `;
        
        retryButton.addEventListener('click', () => {
            this.emit('retryRequested');
        });
        
        retryButton.addEventListener('mouseenter', () => {
            retryButton.style.background = '#ff85c1';
            retryButton.style.transform = 'translateY(-2px)';
        });
        
        retryButton.addEventListener('mouseleave', () => {
            retryButton.style.background = '#ff69b4';
            retryButton.style.transform = 'translateY(0)';
        });
        
        this.element.appendChild(retryButton);
    }

    /**
     * Başarı durumu göster
     */
    showSuccess(message = 'Sistem başarıyla yüklendi!') {
        // Update styling for success
        if (this.element) {
            this.element.style.background = 'linear-gradient(135deg, #1a2a1a, #2a3a2a, #1a2a1a)';
        }
        
        this.setStatus('BAŞARILI');
        this.setSubStatus(message);
        this.setProgress(100);
        
        // Add success icon
        this.addSuccessIcon();
        
        this.emit('successShown', { message });
        
        // Auto hide after delay
        setTimeout(() => {
            this.hide();
        }, 2000);
    }

    /**
     * Başarı ikonu ekle
     */
    addSuccessIcon() {
        const existingIcon = this.element.querySelector('.success-icon');
        if (existingIcon) return;
        
        const successIcon = document.createElement('div');
        successIcon.textContent = '✅';
        successIcon.className = 'success-icon';
        successIcon.style.cssText = `
            font-size: 48px;
            margin: 20px auto;
            text-align: center;
            animation: bounceIn 0.5s ease-out;
        `;
        
        // Add bounce animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bounceIn {
                0% { transform: scale(0); opacity: 0; }
                50% { transform: scale(1.2); opacity: 0.8; }
                100% { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        const spinner = this.element.querySelector('.spinner');
        if (spinner) {
            spinner.style.display = 'none';
        }
        
        this.element.insertBefore(successIcon, this.statusText);
    }

    /**
     * Yükleme durumunu al
     */
    getStatus() {
        return {
            isVisible: this.isVisible,
            currentProgress: this.currentProgress,
            currentStep: this.currentStepIndex,
            totalSteps: this.loadingSteps.length,
            currentStepText: this.loadingSteps[this.currentStepIndex]?.text || 'N/A'
        };
    }

    /**
     * Loading animasyonunu durdur
     */
    stopAnimation() {
        const spinner = this.element?.querySelector('.spinner');
        if (spinner) {
            spinner.style.animation = 'none';
        }
    }

    /**
     * Loading animasyonunu başlat
     */
    startAnimation() {
        const spinner = this.element?.querySelector('.spinner');
        if (spinner) {
            spinner.style.animation = 'spin 1.5s linear infinite';
        }
    }

    /**
     * Tema değiştir
     */
    setTheme(theme) {
        if (!this.element) return;
        
        const themes = {
            default: 'linear-gradient(135deg, #1a1a1a, #2a2a2a, #1a1a1a)',
            success: 'linear-gradient(135deg, #1a2a1a, #2a3a2a, #1a2a1a)',
            error: 'linear-gradient(135deg, #2a1a1a, #3a2a2a, #2a1a1a)',
            warning: 'linear-gradient(135deg, #2a2a1a, #3a3a2a, #2a2a1a)'
        };
        
        this.element.style.background = themes[theme] || themes.default;
        
        this.emit('themeChanged', { theme });
    }

    /**
     * Debug bilgisi göster
     */
    showDebugInfo(info) {
        const existingDebug = this.element.querySelector('.debug-info');
        if (existingDebug) {
            existingDebug.remove();
        }
        
        const debugInfo = document.createElement('div');
        debugInfo.className = 'debug-info';
        debugInfo.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: #00ff00;
            padding: 10px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-size: 10px;
            border: 1px solid #00ff00;
        `;
        
        debugInfo.innerHTML = Object.entries(info)
            .map(([key, value]) => `${key}: ${value}`)
            .join('<br>');
        
        this.element.appendChild(debugInfo);
    }

    /**
     * Gerçek zamanlı ilerleme simülatörü
     */
    simulateProgress(targetProgress, duration = 1000) {
        const startProgress = this.currentProgress;
        const progressDiff = targetProgress - startProgress;
        const startTime = Date.now();
        
        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentProgress = startProgress + (progressDiff * progress);
            this.setProgress(currentProgress, false);
            
            if (progress < 1) {
                requestAnimationFrame(updateProgress);
            }
        };
        
        updateProgress();
    }

    /**
     * Cleanup ve kapatma
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        
        this.element = null;
        this.progressBar = null;
        this.statusText = null;
        this.subStatusText = null;
        this.channelNameElement = null;
        
        this.loadingSteps = [];
        this.currentStepIndex = 0;
        
        this.removeAllListeners();
        
        logger.info('LoadingScreenManager destroyed');
    }
}

export default LoadingScreenManager;