// public/js/debug/DebugTool.js - Debug araçları

import { EventEmitter } from '../utils/EventEmitter.js';
import { CONFIG } from '../utils/Config.js';
import { logger, formatUptime, formatNumber } from '../utils/Utils.js';

/**
 * Debug Tool - Geliştiriciler için debug araçları
 */
export class DebugTool extends EventEmitter {
    constructor() {
        super();
        
        this.isEnabled = CONFIG.DEBUG.ENABLED;
        this.logBuffer = [];
        this.maxLogBuffer = 1000;
        
        // Debug panel DOM
        this.panel = null;
        this.isVisible = false;
        
        // Debug data collectors
        this.collectors = new Map();
        
        // Performance monitoring
        this.performanceData = {
            frameCount: 0,
            lastFrameTime: 0,
            fps: 0,
            memoryUsage: 0,
            renderTime: 0
        };
        
        this.initializeCollectors();
        
        if (this.isEnabled) {
            this.createDebugPanel();
            this.startPerformanceMonitoring();
            this.interceptConsole();
        }
        
        logger.info('DebugTool initialized', { enabled: this.isEnabled });
    }

    /**
     * Data collector'ları başlat
     */
    initializeCollectors() {
        // WebSocket collector
        this.collectors.set('websocket', {
            messages: [],
            errors: [],
            reconnects: 0,
            lastMessage: null
        });
        
        // Avatar collector
        this.collectors.set('avatars', {
            count: 0,
            actions: [],
            lastAction: null
        });
        
        // Effects collector
        this.collectors.set('effects', {
            count: 0,
            active: [],
            history: []
        });
        
        // Commands collector
        this.collectors.set('commands', {
            total: 0,
            successful: 0,
            failed: 0,
            history: []
        });
    }

    /**
     * Debug panel oluştur
     */
    createDebugPanel() {
        this.panel = document.createElement('div');
        this.panel.id = 'debugPanel';
        this.panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 400px;
            max-height: 80vh;
            background: rgba(0,0,0,0.95);
            border: 2px solid #00ff00;
            border-radius: 10px;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            z-index: 10005;
            overflow: hidden;
            display: none;
            backdrop-filter: blur(10px);
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            background: #00ff00;
            color: black;
            padding: 8px 12px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        header.innerHTML = `
            <span>🔧 DEBUG PANEL</span>
            <button id="debugClose" style="background: transparent; border: none; color: black; cursor: pointer; font-size: 16px;">×</button>
        `;
        
        // Tabs
        const tabs = document.createElement('div');
        tabs.style.cssText = `
            display: flex;
            background: rgba(0,255,0,0.1);
            border-bottom: 1px solid #00ff00;
        `;
        
        const tabNames = ['Console', 'Network', 'Performance', 'Avatars', 'Effects'];
        tabNames.forEach((tabName, index) => {
            const tab = document.createElement('button');
            tab.textContent = tabName;
            tab.className = 'debug-tab';
            tab.dataset.tab = tabName.toLowerCase();
            tab.style.cssText = `
                flex: 1;
                background: transparent;
                border: none;
                color: #00ff00;
                padding: 8px;
                cursor: pointer;
                font-family: inherit;
                font-size: inherit;
                ${index === 0 ? 'background: rgba(0,255,0,0.2);' : ''}
            `;
            
            tab.addEventListener('click', () => this.switchTab(tabName.toLowerCase()));
            tabs.appendChild(tab);
        });
        
        // Content area
        const content = document.createElement('div');
        content.id = 'debugContent';
        content.style.cssText = `
            height: 400px;
            overflow-y: auto;
            padding: 10px;
        `;
        
        this.panel.appendChild(header);
        this.panel.appendChild(tabs);
        this.panel.appendChild(content);
        
        document.body.appendChild(this.panel);
        
        // Event listeners
        header.querySelector('#debugClose').addEventListener('click', () => this.hide());
        
        // Initialize with console tab
        this.switchTab('console');
        
        // Keyboard shortcut (Ctrl+Shift+D)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                this.toggle();
            }
        });
    }

    /**
     * Tab'ları değiştir
     */
    switchTab(tabName) {
        // Update tab styles
        const tabs = this.panel.querySelectorAll('.debug-tab');
        tabs.forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.style.background = 'rgba(0,255,0,0.2)';
            } else {
                tab.style.background = 'transparent';
            }
        });
        
        // Update content
        const content = this.panel.querySelector('#debugContent');
        content.innerHTML = this.getTabContent(tabName);
        
        // Start auto-refresh for active tab
        this.activeTab = tabName;
        this.refreshActiveTab();
    }

    /**
     * Tab içeriği al
     */
    getTabContent(tabName) {
        switch (tabName) {
            case 'console':
                return this.getConsoleContent();
            case 'network':
                return this.getNetworkContent();
            case 'performance':
                return this.getPerformanceContent();
            case 'avatars':
                return this.getAvatarsContent();
            case 'effects':
                return this.getEffectsContent();
            default:
                return '<div>Tab not found</div>';
        }
    }

    /**
     * Console tab içeriği
     */
    getConsoleContent() {
        const logs = this.logBuffer.slice(-50); // Last 50 logs
        
        let html = `
            <div style="margin-bottom: 10px;">
                <button onclick="debugTool.clearLogs()" style="background: #333; color: #00ff00; border: 1px solid #00ff00; padding: 4px 8px; border-radius: 3px; cursor: pointer;">Clear Logs</button>
                <span style="margin-left: 10px;">Total: ${this.logBuffer.length}</span>
            </div>
        `;
        
        logs.forEach(log => {
            const colorMap = {
                'error': '#ff6666',
                'warn': '#ffaa66',
                'info': '#66aaff',
                'debug': '#aaaaaa',
                'log': '#ffffff'
            };
            
            html += `
                <div style="margin: 2px 0; color: ${colorMap[log.level] || '#ffffff'};">
                    <span style="color: #666;">[${log.timestamp}]</span>
                    <span style="color: ${colorMap[log.level]};">[${log.level.toUpperCase()}]</span>
                    ${log.message}
                </div>
            `;
        });
        
        return html;
    }

    /**
     * Network tab içeriği
     */
    getNetworkContent() {
        const wsData = this.collectors.get('websocket');
        
        return `
            <h4 style="color: #00ff00; margin-bottom: 10px;">WebSocket Status</h4>
            <div>Messages Received: ${wsData.messages.length}</div>
            <div>Errors: ${wsData.errors.length}</div>
            <div>Reconnects: ${wsData.reconnects}</div>
            <div>Last Message: ${wsData.lastMessage || 'None'}</div>
            
            <h4 style="color: #00ff00; margin: 15px 0 10px 0;">Recent Messages</h4>
            ${wsData.messages.slice(-10).map(msg => `
                <div style="background: rgba(0,255,0,0.1); padding: 5px; margin: 3px 0; border-radius: 3px;">
                    <div style="color: #66ff66;">${msg.timestamp}</div>
                    <div style="font-size: 10px; color: #aaaaaa; word-break: break-all;">${JSON.stringify(msg.data).substring(0, 100)}...</div>
                </div>
            `).join('')}
            
            <h4 style="color: #00ff00; margin: 15px 0 10px 0;">Recent Errors</h4>
            ${wsData.errors.slice(-5).map(error => `
                <div style="background: rgba(255,0,0,0.1); padding: 5px; margin: 3px 0; border-radius: 3px; color: #ff6666;">
                    ${error.timestamp}: ${error.message}
                </div>
            `).join('') || '<div>No errors</div>'}
        `;
    }

    /**
     * Performance tab içeriği
     */
    getPerformanceContent() {
        const memory = performance.memory ? {
            used: Math.round(performance.memory.usedJSHeapSize / 1048576),
            total: Math.round(performance.memory.totalJSHeapSize / 1048576),
            limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
        } : null;
        
        return `
            <h4 style="color: #00ff00; margin-bottom: 10px;">Performance Metrics</h4>
            
            <div>FPS: ${this.performanceData.fps}</div>
            <div>Frame Count: ${formatNumber(this.performanceData.frameCount)}</div>
            <div>Render Time: ${this.performanceData.renderTime.toFixed(2)}ms</div>
            
            ${memory ? `
                <h4 style="color: #00ff00; margin: 15px 0 10px 0;">Memory Usage</h4>
                <div>Used: ${memory.used}MB</div>
                <div>Total: ${memory.total}MB</div>
                <div>Limit: ${memory.limit}MB</div>
                <div style="background: #333; height: 10px; border-radius: 5px; margin: 5px 0;">
                    <div style="background: #00ff00; height: 100%; width: ${(memory.used / memory.total * 100)}%; border-radius: 5px;"></div>
                </div>
            ` : '<div>Memory API not available</div>'}
            
            <h4 style="color: #00ff00; margin: 15px 0 10px 0;">System Info</h4>
            <div>User Agent: ${navigator.userAgent.substring(0, 50)}...</div>
            <div>Platform: ${navigator.platform}</div>
            <div>Language: ${navigator.language}</div>
            <div>Online: ${navigator.onLine ? 'Yes' : 'No'}</div>
            <div>Cookies Enabled: ${navigator.cookieEnabled ? 'Yes' : 'No'}</div>
            
            <h4 style="color: #00ff00; margin: 15px 0 10px 0;">Screen Info</h4>
            <div>Screen: ${screen.width}x${screen.height}</div>
            <div>Viewport: ${window.innerWidth}x${window.innerHeight}</div>
            <div>Device Pixel Ratio: ${window.devicePixelRatio}</div>
        `;
    }

    /**
     * Avatars tab içeriği
     */
    getAvatarsContent() {
        const avatarsData = this.collectors.get('avatars');
        
        return `
            <h4 style="color: #00ff00; margin-bottom: 10px;">Avatar System</h4>
            
            <div>Active Avatars: ${avatarsData.count}</div>
            <div>Total Actions: ${avatarsData.actions.length}</div>
            <div>Last Action: ${avatarsData.lastAction || 'None'}</div>
            
            <h4 style="color: #00ff00; margin: 15px 0 10px 0;">Recent Actions</h4>
            ${avatarsData.actions.slice(-10).map(action => `
                <div style="background: rgba(0,255,0,0.1); padding: 5px; margin: 3px 0; border-radius: 3px;">
                    <span style="color: #66ff66;">[${action.timestamp}]</span>
                    <span style="color: #ffaa66;">${action.user}</span>
                    <span style="color: #ffffff;">${action.action}</span>
                </div>
            `).join('') || '<div>No actions recorded</div>'}
            
            <div style="margin-top: 15px;">
                <button onclick="debugTool.dumpAvatarData()" style="background: #333; color: #00ff00; border: 1px solid #00ff00; padding: 4px 8px; border-radius: 3px; cursor: pointer;">
                    Dump Avatar Data
                </button>
            </div>
        `;
    }

    /**
     * Effects tab içeriği
     */
    getEffectsContent() {
        const effectsData = this.collectors.get('effects');
        
        return `
            <h4 style="color: #00ff00; margin-bottom: 10px;">Effects System</h4>
            
            <div>Total Effects: ${effectsData.count}</div>
            <div>Active Effects: ${effectsData.active.length}</div>
            
            <h4 style="color: #00ff00; margin: 15px 0 10px 0;">Active Effects</h4>
            ${effectsData.active.map(effect => `
                <div style="background: rgba(255,105,180,0.1); padding: 5px; margin: 3px 0; border-radius: 3px;">
                    <span style="color: #ff69b4;">${effect.name}</span>
                    <span style="color: #aaaaaa; margin-left: 10px;">Started: ${effect.startTime}</span>
                </div>
            `).join('') || '<div>No active effects</div>'}
            
            <h4 style="color: #00ff00; margin: 15px 0 10px 0;">Effect History</h4>
            ${effectsData.history.slice(-10).map(effect => `
                <div style="background: rgba(0,255,0,0.1); padding: 5px; margin: 3px 0; border-radius: 3px;">
                    <span style="color: #66ff66;">[${effect.timestamp}]</span>
                    <span style="color: #ffaa66;">${effect.user}</span>
                    <span style="color: #ffffff;">${effect.effect}</span>
                </div>
            `).join('') || '<div>No effects recorded</div>'}
        `;
    }

    /**
     * Console'u intercept et
     */
    interceptConsole() {
        const originalMethods = {};
        const levels = ['log', 'info', 'warn', 'error', 'debug'];
        
        levels.forEach(level => {
            originalMethods[level] = console[level];
            console[level] = (...args) => {
                // Call original
                originalMethods[level].apply(console, args);
                
                // Store in buffer
                this.addToLogBuffer(level, args.map(arg => 
                    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
                ).join(' '));
            };
        });
    }

    /**
     * Log buffer'a ekle
     */
    addToLogBuffer(level, message) {
        this.logBuffer.push({
            level,
            message,
            timestamp: new Date().toLocaleTimeString()
        });
        
        // Keep buffer size manageable
        if (this.logBuffer.length > this.maxLogBuffer) {
            this.logBuffer.shift();
        }
        
        // Emit event
        this.emit('logAdded', { level, message });
    }

    /**
     * Performance monitoring başlat
     */
    startPerformanceMonitoring() {
        const updatePerformance = () => {
            const now = performance.now();
            
            if (this.performanceData.lastFrameTime > 0) {
                const delta = now - this.performanceData.lastFrameTime;
                this.performanceData.fps = Math.round(1000 / delta);
                this.performanceData.renderTime = delta;
            }
            
            this.performanceData.lastFrameTime = now;
            this.performanceData.frameCount++;
            
            if (performance.memory) {
                this.performanceData.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1048576);
            }
            
            requestAnimationFrame(updatePerformance);
        };
        
        updatePerformance();
    }

    /**
     * Data collector'a veri ekle
     */
    addToCollector(collectorName, data) {
        const collector = this.collectors.get(collectorName);
        if (!collector) return;
        
        switch (collectorName) {
            case 'websocket':
                if (data.type === 'message') {
                    collector.messages.push({
                        timestamp: new Date().toLocaleTimeString(),
                        data: data.data
                    });
                    collector.lastMessage = new Date().toLocaleTimeString();
                } else if (data.type === 'error') {
                    collector.errors.push({
                        timestamp: new Date().toLocaleTimeString(),
                        message: data.message
                    });
                } else if (data.type === 'reconnect') {
                    collector.reconnects++;
                }
                break;
                
            case 'avatars':
                collector.count = data.count || collector.count;
                if (data.action) {
                    collector.actions.push({
                        timestamp: new Date().toLocaleTimeString(),
                        user: data.user,
                        action: data.action
                    });
                    collector.lastAction = `${data.user}: ${data.action}`;
                }
                break;
                
            case 'effects':
                collector.count = data.count || collector.count;
                if (data.effect) {
                    collector.history.push({
                        timestamp: new Date().toLocaleTimeString(),
                        user: data.user,
                        effect: data.effect
                    });
                }
                if (data.active) {
                    collector.active = data.active;
                }
                break;
        }
        
        // Keep arrays manageable
        Object.keys(collector).forEach(key => {
            if (Array.isArray(collector[key]) && collector[key].length > 100) {
                collector[key] = collector[key].slice(-50);
            }
        });
    }

    /**
     * Aktif tab'ı yenile
     */
    refreshActiveTab() {
        if (!this.isVisible || !this.activeTab) return;
        
        const content = this.panel?.querySelector('#debugContent');
        if (content) {
            content.innerHTML = this.getTabContent(this.activeTab);
        }
        
        // Auto-refresh every 2 seconds
        setTimeout(() => {
            if (this.isVisible) {
                this.refreshActiveTab();
            }
        }, 2000);
    }

    /**
     * Debug panel'i göster
     */
    show() {
        if (this.panel) {
            this.panel.style.display = 'block';
            this.isVisible = true;
            this.refreshActiveTab();
        }
    }

    /**
     * Debug panel'i gizle
     */
    hide() {
        if (this.panel) {
            this.panel.style.display = 'none';
            this.isVisible = false;
        }
    }

    /**
     * Debug panel'i toggle et
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * Log'ları temizle
     */
    clearLogs() {
        this.logBuffer = [];
        this.refreshActiveTab();
    }

    /**
     * Avatar verilerini dışa aktar
     */
    dumpAvatarData() {
        const avatarsData = this.collectors.get('avatars');
        const data = {
            timestamp: new Date().toISOString(),
            avatarsData,
            performanceData: this.performanceData
        };
        
        console.log('Avatar Data Dump:', data);
        
        // Create download
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `avatar-data-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Debug raporu oluştur
     */
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            performance: this.performanceData,
            collectors: Object.fromEntries(this.collectors),
            logs: this.logBuffer.slice(-50),
            system: {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                online: navigator.onLine,
                cookieEnabled: navigator.cookieEnabled,
                screen: `${screen.width}x${screen.height}`,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                devicePixelRatio: window.devicePixelRatio
            },
            memory: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                total: Math.round(performance.memory.totalJSHeapSize / 1048576),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
            } : null
        };
        
        return report;
    }

    /**
     * Debug modunu etkinleştir/devre dışı bırak
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
        
        if (enabled && !this.panel) {
            this.createDebugPanel();
        }
        
        if (this.panel) {
            this.panel.style.display = enabled ? (this.isVisible ? 'block' : 'none') : 'none';
        }
    }

    /**
     * Global debug fonksiyonlarını ayarla
     */
    setupGlobalFunctions() {
        window.debugTool = this;
        window.debug = {
            show: () => this.show(),
            hide: () => this.hide(),
            toggle: () => this.toggle(),
            clear: () => this.clearLogs(),
            report: () => this.generateReport(),
            dump: () => this.dumpAvatarData(),
            enable: () => this.setEnabled(true),
            disable: () => this.setEnabled(false)
        };
    }

    /**
     * Cleanup ve kapatma
     */
    destroy() {
        if (this.panel && this.panel.parentNode) {
            this.panel.parentNode.removeChild(this.panel);
        }
        
        this.panel = null;
        this.isVisible = false;
        this.logBuffer = [];
        this.collectors.clear();
        
        // Remove global functions
        if (window.debugTool === this) {
            delete window.debugTool;
            delete window.debug;
        }
        
        this.removeAllListeners();
        
        logger.info('DebugTool destroyed');
    }
}

export default DebugTool;