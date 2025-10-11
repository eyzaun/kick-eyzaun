// public/js/main.js - Ana uygulama giriş noktası

// Core imports
import { CONFIG } from './utils/Config.js';
import { getChannelFromURL, logger } from './utils/Utils.js';

// API imports
import { KickWebSocketAPI } from './api/KickWebSocketAPI.js';

// Manager imports
import { AvatarManager } from './classes/AvatarManager.js';

// UI Component imports
import { UIManager } from './components/UI.js';
import { StatsManager } from './components/Stats.js';
import { LoadingScreenManager } from './components/LoadingScreen.js';

// Debug import
import { DebugTool } from './debug/DebugTool.js';

// Game import
import { GameManager } from './classes/GameManager.js';

/**
 * Ana Uygulama Sınıfı - Tüm sistemleri koordine eder
 */
class EyzaunMultiUserAvatarApp {
    constructor() {
        // Application state
        this.isInitialized = false;
        this.isConnected = false;
        this.channelName = getChannelFromURL();
        
        // Core systems
        this.kickAPI = null;
        this.avatarManager = null;
        this.uiManager = null;
        this.statsManager = null;
        this.loadingScreen = null;
        this.debugTool = null;
        this.gameManager = null;
        
        // Initialization time
        this.initTime = Date.now();
        
        logger.info('EyzaunMultiUserAvatarApp starting...');
    }

    /**
     * Uygulamayı başlat
     */
    async initialize() {
        try {
            logger.info(`Initializing application for channel: ${this.channelName}`);
            
            // Show loading screen
            await this.initializeLoadingScreen();
            this.loadingScreen.show();
            await this.loadingScreen.executeStep(0); // System starting
            
            // Initialize debug tool first (for error tracking)
            await this.initializeDebugTool();
            await this.loadingScreen.executeStep(1); // Debug initialized
            
            // Initialize managers
            await this.initializeManagers();
            await this.loadingScreen.executeStep(2); // Managers ready
            
            // Initialize WebSocket API
            await this.initializeKickAPI();
            await this.loadingScreen.executeStep(3); // API ready
            
            // Connect to Kick
            await this.connectToKick();
            await this.loadingScreen.executeStep(4); // Connected
            
            // Setup event listeners
            this.setupEventListeners();
            await this.loadingScreen.executeStep(5); // Events setup
            
            // Final setup
            await this.finalizeSetup();
            await this.loadingScreen.executeStep(6); // Finalizing
            
            // Hide unnecessary UI elements
            this.hideUnnecessaryUI();
            
            // Complete initialization
            await this.loadingScreen.executeStep(7); // Complete
            
            // Hide loading screen
            setTimeout(() => {
                this.loadingScreen.showSuccess();
            }, 500);
            
            this.isInitialized = true;
            
            logger.info('Application initialized successfully', {
                channel: this.channelName,
                initTime: Date.now() - this.initTime
            });

            // Expose unified reset hook for dashboard button
            window.__resetAllStatsHook__ = () => {
                try {
                    this.statsManager?.resetStats();
                    this.avatarManager?.resetStats();
                    logger.info('Stats reset via dashboard hook');
                } catch (err) {
                    logger.error('Failed to reset stats via dashboard hook:', err);
                }
            };
            
        } catch (error) {
            await this.handleInitializationError(error);
        }
    }

    /**
     * Loading screen'i başlat
     */
    async initializeLoadingScreen() {
        this.loadingScreen = new LoadingScreenManager();
        this.loadingScreen.setChannelName(this.channelName);
        
        // Custom loading steps
        const steps = [
            { text: 'Sistem başlatılıyor...', progress: 10, duration: 300 },
            { text: 'Debug araçları hazırlanıyor...', progress: 20, duration: 200 },
            { text: 'Yöneticiler başlatılıyor...', progress: 35, duration: 400 },
            { text: 'Kick API hazırlanıyor...', progress: 50, duration: 300 },
            { text: 'Kick\'e bağlanılıyor...', progress: 70, duration: 1000 },
            { text: 'Event sistemi kuruluyor...', progress: 85, duration: 200 },
            { text: 'Son ayarlar yapılıyor...', progress: 95, duration: 200 },
            { text: 'Sistem hazır!', progress: 100, duration: 200 }
        ];
        
        this.loadingScreen.setCustomSteps(steps);
    }

    /**
     * Debug tool'u başlat
     */
    async initializeDebugTool() {
        this.debugTool = new DebugTool();
        this.debugTool.setupGlobalFunctions();
        
        // Add initialization log
        this.debugTool.addToLogBuffer('info', `Application initializing for channel: ${this.channelName}`);
        
        logger.info('Debug tool initialized');
    }

    /**
     * Yöneticileri başlat
     */
    async initializeManagers() {
        // UI Manager
        this.uiManager = new UIManager();
        this.uiManager.updateChannelName(this.channelName);
        
        // Stats Manager
        this.statsManager = new StatsManager();
        
        // Avatar Manager
        this.avatarManager = new AvatarManager();
        
        // Game Manager
        this.gameManager = new GameManager();
        
        logger.info('Managers initialized');
    }

    /**
     * Kick API'yi başlat
     */
    async initializeKickAPI() {
        this.kickAPI = new KickWebSocketAPI(this.channelName);
        
        // Debug integration
        if (this.debugTool) {
            this.kickAPI.on('rawMessage', (message) => {
                this.debugTool.addToCollector('websocket', {
                    type: 'message',
                    data: message
                });
            });
        }
        
        logger.info('Kick API initialized');
    }

    /**
     * Kick'e bağlan
     */
    async connectToKick() {
        try {
            await this.kickAPI.connect();
            this.isConnected = true;
            
            this.uiManager.updateConnectionStatus('MULTI-AVATAR SYSTEM ACTIVE', true);
            
        } catch (error) {
            this.isConnected = false;
            this.uiManager.updateConnectionStatus('Bağlantı başarısız', false);
            
            if (this.debugTool) {
                this.debugTool.addToCollector('websocket', {
                    type: 'error',
                    message: error.message
                });
            }
            
            throw error;
        }
    }

    /**
     * Event listener'ları ayarla
     */
    setupEventListeners() {
        // Kick API Events
        this.kickAPI.on('connected', () => {
            logger.info('Connected to Kick WebSocket');
            this.uiManager.updateConnectionStatus('Bağlı - Kanal dinleniyor', true);
        });

        this.kickAPI.on('disconnected', (data) => {
            logger.warn('Disconnected from Kick WebSocket', data);
            this.isConnected = false;
            this.uiManager.updateConnectionStatus('Bağlantı kesildi', false);
            
            if (this.debugTool) {
                this.debugTool.addToCollector('websocket', {
                    type: 'reconnect'
                });
                this.statsManager.addReconnect();
            }
        });

        this.kickAPI.on('subscribed', (data) => {
            logger.info('Subscribed to channel', data);
            this.uiManager.updateConnectionStatus('MULTI-AVATAR SYSTEM ACTIVE', true);
            this.statsManager.updateWebSocketState('Connected');
        });

        this.kickAPI.on('message', (message) => {
            this.handleChatMessage(message);
        });

        this.kickAPI.on('command', (command) => {
            this.handleCommand(command);
        });

        this.kickAPI.on('connectionStateChanged', (data) => {
            this.statsManager.updateWebSocketState(
                data.current.charAt(0).toUpperCase() + data.current.slice(1)
            );

            // Debug: Bağlantı durumu değişimini logla
            logger.info(`WebSocket state changed: ${data.previous} -> ${data.current}`);
            console.log(`🔌 WebSocket State: ${data.current}`, {
                isConnected: this.kickAPI.isConnected,
                isSubscribed: this.kickAPI.isSubscribed,
                connectionInfo: this.kickAPI.getConnectionInfo()
            });
        });

        // Avatar Manager Events
        this.avatarManager.on('userCreated', (data) => {
            this.statsManager.updateUserCount(this.avatarManager.getActiveUserCount());
            
            if (this.debugTool) {
                this.debugTool.addToCollector('avatars', {
                    count: this.avatarManager.getActiveUserCount(),
                    action: 'User created',
                    user: data.username
                });
            }
        });

        this.avatarManager.on('userRemoved', (data) => {
            this.statsManager.updateUserCount(this.avatarManager.getActiveUserCount());
        });

        this.avatarManager.on('commandExecuted', (data) => {
            this.statsManager.addEffect();
            
            if (this.debugTool) {
                this.debugTool.addToCollector('effects', {
                    effect: data.commandConfig.name,
                    user: data.commandData.user
                });
            }
        });

        // UI Manager Events
        this.uiManager.on('retryRequested', () => {
            this.handleRetryConnection();
        });

        // Loading Screen Events
        this.loadingScreen.on('retryRequested', () => {
            this.handleRetryConnection();
        });

        // Global error handling
        window.addEventListener('error', (event) => {
            logger.error('Global error:', event.error);
            this.statsManager.addError();
            
            if (this.debugTool) {
                this.debugTool.addToLogBuffer('error', `${event.error.name}: ${event.error.message}`);
            }
        });

        window.addEventListener('unhandledrejection', (event) => {
            logger.error('Unhandled promise rejection:', event.reason);
            this.statsManager.addError();
            
            if (this.debugTool) {
                this.debugTool.addToLogBuffer('error', `Unhandled Promise: ${event.reason}`);
            }
        });

        // Visibility change handling
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                logger.info('App hidden - reducing activity');
            } else {
                logger.info('App visible - resuming normal activity');
                
                // Refresh connection if needed
                if (this.kickAPI && !this.kickAPI.isConnected) {
                    this.handleRetryConnection();
                }
            }
        });

        logger.info('Event listeners setup complete');
    }

    /**
     * Son ayarları yap
     */
    async finalizeSetup() {
        // Performance monitoring
        this.startPerformanceMonitoring();
        
        // Setup periodic tasks
        this.setupPeriodicTasks();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Console welcome message
        this.showWelcomeMessage();
        
        logger.info('Final setup completed');
    }

    /**
     * Gereksiz UI elementlerini gizle
     */
    hideUnnecessaryUI() {
        // Sol paneldeki istatistikleri gizle
        const statsDisplay = this.uiManager.getElement('statsDisplay');
        if (statsDisplay) {
            statsDisplay.style.display = 'none';
        }
        
        // Kullanıcı sayısını gizle
        const userCountDisplay = this.uiManager.getElement('userCountDisplay');
        if (userCountDisplay) {
            userCountDisplay.style.display = 'none';
        }
        
        // Bağlantı durumunu gizle
        const connectionStatus = this.uiManager.getElement('connectionStatus');
        if (connectionStatus) {
            connectionStatus.style.display = 'none';
        }
        
        logger.info('Unnecessary UI elements hidden');
    }

    /**
     * Chat mesajını işle
     */
    handleChatMessage(message) {
        this.statsManager.addMessage();
        this.avatarManager.handleMessage(message);
        
        logger.debug(`Message from ${message.username}: ${message.message}`);
    }

    /**
     * Komut işle
     */
    async handleCommand(command) {
        this.statsManager.addCommand();
        
        const { command: cmd, userId, user: username, userType } = command;
        const normalizedCmd = this.normalizeCommand(cmd);
        
        // Önce oyun komutlarını kontrol et
        if (normalizedCmd === '!oyun') {
            const result = await this.gameManager.startGame();
            return result.success;
        }
        
        if (normalizedCmd === '!basla') {
            const result = await this.gameManager.manualStart();
            return result.success;
        }
        
        if (normalizedCmd === '!kapat') {
            const result = await this.gameManager.stopGame();
            return result.success;
        }
        
        if (normalizedCmd === '!bitir') {
            const result = await this.gameManager.forceEndGame();
            return result.success;
        }

        if (normalizedCmd === '!ben') {
            const result = await this.gameManager.joinGame(userId, username, userType);
            return result.success;
        }
        
        // Harita seçimi komutları (Map 1-15)
        if (['!1','!2','!3','!4','!5','!6','!7','!8','!9','!10','!11','!12','!13','!14','!15'].includes(normalizedCmd)) {
            const mapId = normalizedCmd.slice(1); // ! işaretini kaldır
            const result = await this.gameManager.selectMap(mapId);
            return result.success;
        }
        
        // Oyun sırasında hareket komutlarını oyun manager'a yönlendir
        const gameCommandPattern = /^!(a|d|w|q|e){1,5}$/;
        if (this.gameManager.isGameRunning && (gameCommandPattern.test(normalizedCmd) || ['!sol', '!sag', '!yukari', '!asagi'].includes(normalizedCmd))) {
            this.gameManager.handlePlayerInput(userId, normalizedCmd);
            return true;
        }
        
        const success = await this.avatarManager.handleCommand(command);
        
        if (success) {
            this.statsManager.addMove();
        }
        
        if (this.debugTool) {
            this.debugTool.addToCollector('avatars', {
                action: `Command: ${cmd}`,
                user: username
            });
        }
        
        logger.command(`Command ${cmd} by ${username}: ${success ? 'SUCCESS' : 'FAILED'}`);
        
        return success;
    }

    /**
     * Komut metnini normalize et (Türkçe karakterleri sadeleştir)
     */
    normalizeCommand(commandText = '') {
        return String(commandText || '')
            .toLowerCase()
            .replace(/[ç]/g, 'c')
            .replace(/[ğ]/g, 'g')
            .replace(/[ı]/g, 'i')
            .replace(/[ö]/g, 'o')
            .replace(/[ş]/g, 's')
            .replace(/[ü]/g, 'u');
    }

    /**
     * Bağlantı yeniden denemesi
     */
    async handleRetryConnection() {
        logger.info('Retrying connection...');
        
        this.loadingScreen.setSubStatus('Yeniden bağlanılıyor...');
        this.loadingScreen.show();
        
        try {
            if (this.kickAPI) {
                this.kickAPI.disconnect();
            }
            
            // Reinitialize API
            await this.initializeKickAPI();
            this.setupEventListeners();
            
            // Reconnect
            await this.connectToKick();
            
            this.loadingScreen.showSuccess('Bağlantı yeniden kuruldu!');
            
        } catch (error) {
            this.loadingScreen.showError('Bağlantı başarısız', error.message);
            
            setTimeout(() => {
                this.handleRetryConnection();
            }, 5000);
        }
    }

    /**
     * Başlatma hatası işle
     */
    async handleInitializationError(error) {
        logger.error('Initialization failed:', error);
        
        this.loadingScreen.showError(
            'Sistem başlatılamadı',
            error.message
        );
        
        if (this.debugTool) {
            this.debugTool.addToLogBuffer('error', `Initialization failed: ${error.message}`);
        }
        
        // Setup retry
        this.loadingScreen.on('retryRequested', () => {
            window.location.reload();
        });
    }

    /**
     * Performance monitoring başlat
     */
    startPerformanceMonitoring() {
        // Monitor frame rate
        let lastFrameTime = performance.now();
        let frameCount = 0;
        
        const monitorFrame = (currentTime) => {
            frameCount++;
            
            if (currentTime - lastFrameTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastFrameTime));
                
                if (this.debugTool) {
                    this.debugTool.performanceData.fps = fps;
                    this.debugTool.performanceData.frameCount = frameCount;
                }
                
                lastFrameTime = currentTime;
                frameCount = 0;
            }
            
            requestAnimationFrame(monitorFrame);
        };
        
        requestAnimationFrame(monitorFrame);
    }

    /**
     * Periyodik görevleri ayarla
     */
    setupPeriodicTasks() {
        // Connection health check
        setInterval(() => {
            if (this.kickAPI && this.kickAPI.isConnected) {
                const connectionInfo = this.kickAPI.getConnectionInfo();
                
                // Check if connection is stale
                if (Date.now() - connectionInfo.lastPong > 120000) { // 2 minutes
                    logger.warn('Connection seems stale, attempting reconnect');
                    this.handleRetryConnection();
                }
            }
        }, 60000); // Check every minute

        // Memory cleanup
        setInterval(() => {
            if (performance.memory) {
                const memoryUsage = performance.memory.usedJSHeapSize / 1048576; // MB
                
                if (memoryUsage > 150) { // Over 150MB
                    logger.warn(`High memory usage: ${memoryUsage.toFixed(2)}MB`);
                    
                    // Trigger garbage collection if available
                    if (window.gc) {
                        window.gc();
                    }
                }
            }
        }, 300000); // Check every 5 minutes
    }

    /**
     * Klavye kısayollarını ayarla
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+D - Debug panel
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                if (this.debugTool) {
                    this.debugTool.toggle();
                }
            }
            
            // Ctrl+Shift+S - Stats
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                if (this.statsManager) {
                    this.statsManager.printStats();
                }
            }
            
            // Ctrl+Shift+R - Reconnect
            if (e.ctrlKey && e.shiftKey && e.key === 'R') {
                this.handleRetryConnection();
            }
            
            // Ctrl+Shift+H - Hide/Show UI
            if (e.ctrlKey && e.shiftKey && e.key === 'H') {
                this.uiManager.toggleUIVisibility();
            }

            // Ctrl+Shift+M - Reset Stats (UI + AvatarManager)
            if (e.ctrlKey && e.shiftKey && e.key === 'M') {
                try {
                    this.statsManager?.resetStats();
                    this.avatarManager?.resetStats();
                    logger.info('Stats reset via keyboard shortcut (Ctrl+Shift+M)');
                } catch (err) {
                    logger.error('Failed to reset stats via shortcut:', err);
                }
            }
        });
    }

    /**
     * Hoşgeldin mesajı göster
     */
    showWelcomeMessage() {
        console.log(`
╔══════════════════════════════════════════════════╗
║         🎮 EYZAUN MULTI-USER AVATAR CHAT         ║
║              Interactive System v3.0             ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  Kanal: ${this.channelName.padEnd(40)} ║
║  Durum: ${'AKTIF'.padEnd(40)} ║
║  Özellik: Her kullanıcı kendi avatarını kontrol ║
║          ediyor ve komutlarla etkileşim kurabiliyor ║
║                                                  ║
║  🎯 Komutlar:                                   ║
║     !sağ !sol !yukarı !aşağı - Hareket         ║
║     !dans !zıpla !döndür - Animasyon           ║
║     !patlama !yıldırım !kar - Efektler         ║
║                                                  ║
║  ⌨️  Kısayollar:                                ║
║     Ctrl+Shift+D - Debug Panel                 ║
║     Ctrl+Shift+S - İstatistikler               ║
║     Ctrl+Shift+R - Yeniden Bağlan              ║
║                                                  ║
╚══════════════════════════════════════════════════╝
        `);
        
        logger.info('Welcome message displayed');
    }

    /**
     * Uygulama durumunu al
     */
    getApplicationStatus() {
        return {
            isInitialized: this.isInitialized,
            isConnected: this.isConnected,
            channelName: this.channelName,
            initTime: this.initTime,
            uptime: Date.now() - this.initTime,
            stats: this.statsManager?.getDetailedStats(),
            connection: this.kickAPI?.getConnectionInfo(),
            avatars: this.avatarManager?.getStats(),
            performance: this.debugTool?.performanceData
        };
    }

    /**
     * Uygulamayı yeniden başlat
     */
    restart() {
        logger.info('Restarting application...');
        this.destroy();
        window.location.reload();
    }

    /**
     * Cleanup ve kapatma
     */
    destroy() {
        logger.info('Destroying application...');
        
        try {
            // Disconnect from Kick
            if (this.kickAPI) {
                this.kickAPI.disconnect();
                this.kickAPI.destroy();
            }
            
            // Destroy managers
            if (this.avatarManager) {
                this.avatarManager.destroy();
            }
            
            if (this.uiManager) {
                this.uiManager.destroy();
            }
            
            if (this.statsManager) {
                this.statsManager.destroy();
            }
            
            if (this.loadingScreen) {
                this.loadingScreen.destroy();
            }
            
            if (this.debugTool) {
                this.debugTool.destroy();
            }
            
            // Clear references
            this.kickAPI = null;
            this.avatarManager = null;
            this.uiManager = null;
            this.statsManager = null;
            this.loadingScreen = null;
            this.debugTool = null;
            
            this.isInitialized = false;
            this.isConnected = false;
            
        } catch (error) {
            logger.error('Error during cleanup:', error);
        }
    }
}

// Global instance
let app = null;

/**
 * Uygulamayı başlat
 */
async function startApplication() {
    try {
        // Prevent multiple initialization
        if (app && app.isInitialized) {
            logger.warn('Application already initialized');
            return;
        }
        
        app = new EyzaunMultiUserAvatarApp();
        await app.initialize();
        
        // Global access
        window.EyzaunApp = app;
        
    } catch (error) {
        logger.error('Failed to start application:', error);
        
        // Show basic error message
        document.body.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #1a1a1a; color: white; font-family: Arial;">
                <div style="text-align: center;">
                    <h1>🚫 Sistem Başlatılamadı</h1>
                    <p>Hata: ${error.message}</p>
                    <button onclick="window.location.reload()" style="background: #ff69b4; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 20px;">
                        Yeniden Dene
                    </button>
                </div>
            </div>
        `;
    }
}

// Start when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApplication);
} else {
    startApplication();
}

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (app) {
        app.destroy();
    }
});

// Export for module access
export { EyzaunMultiUserAvatarApp, startApplication };