// public/js/components/Stats.js - İstatistik yönetimi

import { EventEmitter } from '../utils/EventEmitter.js';
import { CONFIG } from '../utils/Config.js';
import { formatUptime, formatNumber, logger } from '../utils/Utils.js';

/**
 * Stats Manager - Sistem istatistiklerini yönetir
 */
export class StatsManager extends EventEmitter {
    constructor() {
        super();
        
        // Core stats
        this.stats = {
            startTime: Date.now(),
            totalMessages: 0,
            totalCommands: 0,
            totalMoves: 0,
            totalUsers: 0,
            totalEffects: 0,
            websocketReconnects: 0,
            errorsCount: 0
        };
        
        // Performance stats
        this.performanceStats = {
            memoryUsage: 0,
            fps: 0,
            frameCount: 0,
            lastFrameTime: 0
        };
        
        // Real-time stats
        this.realtimeStats = {
            messagesPerMinute: 0,
            commandsPerMinute: 0,
            activeUsers: 0,
            peakUsers: 0
        };
        
        // Historical data (last 60 minutes)
        this.history = {
            messages: new Array(60).fill(0),
            commands: new Array(60).fill(0),
            users: new Array(60).fill(0),
            effects: new Array(60).fill(0)
        };
        
        // Update intervals
        this.updateInterval = null;
        this.historyInterval = null;
        this.performanceInterval = null;
        
        // DOM elements
        this.elements = new Map();
        
        this.initializeElements();
        this.startUpdateLoop();
        
        logger.info('StatsManager initialized');
    }

    /**
     * DOM elementlerini başlat
     */
    initializeElements() {
        this.elements.set('totalMessages', document.getElementById('totalMessages'));
        this.elements.set('totalAvatars', document.getElementById('totalAvatars'));
        this.elements.set('totalMoves', document.getElementById('totalMoves'));
        this.elements.set('websocketState', document.getElementById('websocketState'));
        this.elements.set('uptime', document.getElementById('uptime'));
        this.elements.set('activeAvatars', document.getElementById('activeAvatars'));
    }

    /**
     * Update loop'u başlat
     */
    startUpdateLoop() {
        // Main stats update (every second)
        this.updateInterval = setInterval(() => {
            this.updateDisplay();
            this.calculateRealTimeStats();
        }, CONFIG.UI.STATS_UPDATE_INTERVAL);

        // History update (every minute)
        this.historyInterval = setInterval(() => {
            this.updateHistory();
        }, 60000);

        // Performance monitoring (every 5 seconds)
        this.performanceInterval = setInterval(() => {
            this.updatePerformanceStats();
        }, 5000);
    }

    /**
     * İstatistik güncelle
     */
    updateStat(statName, value = 1) {
        if (this.stats.hasOwnProperty(statName)) {
            if (typeof value === 'number') {
                this.stats[statName] += value;
            } else {
                this.stats[statName] = value;
            }
            
            this.emit('statUpdated', { statName, value: this.stats[statName] });
        }
    }

    /**
     * İstatistik değeri belirle
     */
    setStat(statName, value) {
        if (this.stats.hasOwnProperty(statName)) {
            this.stats[statName] = value;
            this.emit('statSet', { statName, value });
        }
    }

    /**
     * İstatistik değerini al
     */
    getStat(statName) {
        return this.stats[statName] || 0;
    }

    /**
     * Mesaj ekle
     */
    addMessage() {
        this.updateStat('totalMessages');
    }

    /**
     * Komut ekle
     */
    addCommand() {
        this.updateStat('totalCommands');
    }

    /**
     * Hareket ekle
     */
    addMove() {
        this.updateStat('totalMoves');
    }

    /**
     * Kullanıcı sayısını güncelle
     */
    updateUserCount(count) {
        this.setStat('totalUsers', count);
        this.realtimeStats.activeUsers = count;
        
        if (count > this.realtimeStats.peakUsers) {
            this.realtimeStats.peakUsers = count;
        }
    }

    /**
     * Efekt ekle
     */
    addEffect() {
        this.updateStat('totalEffects');
    }

    /**
     * WebSocket reconnect ekle
     */
    addReconnect() {
        this.updateStat('websocketReconnects');
    }

    /**
     * Hata ekle
     */
    addError() {
        this.updateStat('errorsCount');
    }

    /**
     * WebSocket durumunu güncelle
     */
    updateWebSocketState(state) {
        const element = this.elements.get('websocketState');
        if (element) {
            const oldState = element.textContent;
            element.textContent = state;
            element.style.color = state === 'Connected' ?
                '#00ff00' : state === 'Connecting' ?
                '#ffaa00' : '#ff0000';

            // Debug: WebSocket durumu değişimini logla
            console.log(`📊 WebSocket State Updated: ${oldState} -> ${state}`, {
                element: element,
                timestamp: new Date().toISOString(),
                color: element.style.color
            });
        }
    }    /**
     * Display'i güncelle
     */
    updateDisplay() {
        // Basic stats
        this.updateElement('totalMessages', formatNumber(this.stats.totalMessages));
        this.updateElement('totalAvatars', formatNumber(this.stats.totalUsers));
        this.updateElement('totalMoves', formatNumber(this.stats.totalMoves));
        this.updateElement('activeAvatars', formatNumber(this.realtimeStats.activeUsers));
        
        // Uptime
        const uptime = formatUptime(Date.now() - this.stats.startTime);
        this.updateElement('uptime', uptime);
    }

    /**
     * Element içeriğini güncelle
     */
    updateElement(elementName, value) {
        const element = this.elements.get(elementName);
        if (element && element.textContent !== value.toString()) {
            element.textContent = value;
            
            // Flash effect on change
            element.style.color = '#ffff00';
            setTimeout(() => {
                element.style.color = '#00ff00';
            }, 200);
        }
    }

    /**
     * Gerçek zamanlı istatistikleri hesapla
     */
    calculateRealTimeStats() {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        
        // Messages per minute calculation would need message timestamps
        // For now, we'll use approximation based on total messages
        const totalTime = (now - this.stats.startTime) / 1000 / 60; // minutes
        
        if (totalTime > 0) {
            this.realtimeStats.messagesPerMinute = Math.round(this.stats.totalMessages / totalTime);
            this.realtimeStats.commandsPerMinute = Math.round(this.stats.totalCommands / totalTime);
        }
    }

    /**
     * Geçmiş verilerini güncelle
     */
    updateHistory() {
        // Shift arrays and add current values
        this.history.messages.shift();
        this.history.messages.push(this.stats.totalMessages);
        
        this.history.commands.shift();
        this.history.commands.push(this.stats.totalCommands);
        
        this.history.users.shift();
        this.history.users.push(this.realtimeStats.activeUsers);
        
        this.history.effects.shift();
        this.history.effects.push(this.stats.totalEffects);
        
        this.emit('historyUpdated', { history: this.history });
    }

    /**
     * Performance istatistiklerini güncelle
     */
    updatePerformanceStats() {
        // Memory usage
        if (performance.memory) {
            this.performanceStats.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1048576); // MB
        }
        
        // FPS calculation
        const now = performance.now();
        if (this.performanceStats.lastFrameTime > 0) {
            const delta = now - this.performanceStats.lastFrameTime;
            this.performanceStats.fps = Math.round(1000 / delta);
        }
        this.performanceStats.lastFrameTime = now;
        this.performanceStats.frameCount++;
        
        this.emit('performanceUpdated', { performance: this.performanceStats });
    }

    /**
     * Detaylı istatistikleri al
     */
    getDetailedStats() {
        const now = Date.now();
        const uptime = now - this.stats.startTime;
        
        return {
            // Core stats
            ...this.stats,
            
            // Calculated stats
            uptime: uptime,
            uptimeFormatted: formatUptime(uptime),
            averageMessagesPerMinute: this.realtimeStats.messagesPerMinute,
            averageCommandsPerMinute: this.realtimeStats.commandsPerMinute,
            
            // Real-time stats
            ...this.realtimeStats,
            
            // Performance stats
            ...this.performanceStats,
            
            // Ratios and percentages
            commandToMessageRatio: this.stats.totalMessages > 0 ? 
                (this.stats.totalCommands / this.stats.totalMessages * 100).toFixed(1) + '%' : '0%',
            
            moveToCommandRatio: this.stats.totalCommands > 0 ? 
                (this.stats.totalMoves / this.stats.totalCommands * 100).toFixed(1) + '%' : '0%',
            
            // System info
            timestamp: now,
            sessionDuration: uptime
        };
    }

    /**
     * İstatistikleri JSON olarak export et
     */
    exportStats() {
        return {
            stats: this.getDetailedStats(),
            history: this.history,
            exportTime: new Date().toISOString(),
            version: '3.0.0'
        };
    }

    /**
     * CSV format'ında export et
     */
    exportCSV() {
        const stats = this.getDetailedStats();
        
        const headers = Object.keys(stats);
        const values = Object.values(stats);
        
        let csv = headers.join(',') + '\n';
        csv += values.join(',') + '\n';
        
        return csv;
    }

    /**
     * İstatistikleri console'a yazdır
     */
    printStats() {
        const stats = this.getDetailedStats();
        
        console.group('📊 System Statistics');
        console.log('⏱️  Uptime:', stats.uptimeFormatted);
        console.log('💬 Total Messages:', formatNumber(stats.totalMessages));
        console.log('⚡ Total Commands:', formatNumber(stats.totalCommands));
        console.log('🏃 Total Moves:', formatNumber(stats.totalMoves));
        console.log('👥 Active Users:', stats.activeUsers);
        console.log('📈 Peak Users:', stats.peakUsers);
        console.log('🎨 Total Effects:', formatNumber(stats.totalEffects));
        console.log('🔄 WebSocket Reconnects:', stats.websocketReconnects);
        console.log('❌ Errors:', stats.errorsCount);
        console.log('📊 Command Rate:', stats.commandToMessageRatio);
        console.log('🎯 Move Rate:', stats.moveToCommandRatio);
        console.log('💾 Memory Usage:', stats.memoryUsage + ' MB');
        console.log('🖼️  FPS:', stats.fps);
        console.groupEnd();
        
        return stats;
    }

    /**
     * İstatistikleri sıfırla
     */
    resetStats() {
        const currentTime = Date.now();
        
        this.stats = {
            startTime: currentTime,
            totalMessages: 0,
            totalCommands: 0,
            totalMoves: 0,
            totalUsers: 0,
            totalEffects: 0,
            websocketReconnects: 0,
            errorsCount: 0
        };
        
        this.realtimeStats = {
            messagesPerMinute: 0,
            commandsPerMinute: 0,
            activeUsers: 0,
            peakUsers: 0
        };
        
        // Clear history
        this.history = {
            messages: new Array(60).fill(0),
            commands: new Array(60).fill(0),
            users: new Array(60).fill(0),
            effects: new Array(60).fill(0)
        };
        
        this.emit('statsReset', { timestamp: currentTime });
        
        logger.info('Statistics reset');
    }

    /**
     * Top istatistiklerini al
     */
    getTopStats(limit = 10) {
        const stats = this.getDetailedStats();
        
        const sortedStats = Object.entries(stats)
            .filter(([key, value]) => typeof value === 'number' && value > 0)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit);
        
        return sortedStats.reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});
    }

    /**
     * Performans uyarıları kontrol et
     */
    checkPerformanceWarnings() {
        const warnings = [];
        
        if (this.performanceStats.memoryUsage > 100) {
            warnings.push(`High memory usage: ${this.performanceStats.memoryUsage}MB`);
        }
        
        if (this.performanceStats.fps < 30) {
            warnings.push(`Low FPS: ${this.performanceStats.fps}`);
        }
        
        if (this.stats.errorsCount > 10) {
            warnings.push(`High error count: ${this.stats.errorsCount}`);
        }
        
        if (this.stats.websocketReconnects > 5) {
            warnings.push(`Frequent reconnects: ${this.stats.websocketReconnects}`);
        }
        
        if (warnings.length > 0) {
            this.emit('performanceWarnings', { warnings });
        }
        
        return warnings;
    }

    /**
     * Stats dashboard HTML oluştur
     */
    generateDashboardHTML() {
        const stats = this.getDetailedStats();
        
        return `
            <div class="stats-dashboard">
                <h3>📊 Live Statistics Dashboard</h3>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <h4>💬 Messages</h4>
                        <div class="stat-value">${formatNumber(stats.totalMessages)}</div>
                        <div class="stat-rate">${stats.averageMessagesPerMinute}/min</div>
                    </div>
                    
                    <div class="stat-card">
                        <h4>⚡ Commands</h4>
                        <div class="stat-value">${formatNumber(stats.totalCommands)}</div>
                        <div class="stat-rate">${stats.commandToMessageRatio}</div>
                    </div>
                    
                    <div class="stat-card">
                        <h4>👥 Users</h4>
                        <div class="stat-value">${stats.activeUsers}</div>
                        <div class="stat-rate">Peak: ${stats.peakUsers}</div>
                    </div>
                    
                    <div class="stat-card">
                        <h4>🎨 Effects</h4>
                        <div class="stat-value">${formatNumber(stats.totalEffects)}</div>
                    </div>
                    
                    <div class="stat-card">
                        <h4>⏱️ Uptime</h4>
                        <div class="stat-value">${stats.uptimeFormatted}</div>
                    </div>
                    
                    <div class="stat-card">
                        <h4>💾 Memory</h4>
                        <div class="stat-value">${stats.memoryUsage}MB</div>
                        <div class="stat-rate">${stats.fps} FPS</div>
                    </div>
                </div>
                
                <div class="stats-actions">
                    <button onclick="statsManager.printStats()">Print Stats</button>
                    <button onclick="(window.__resetAllStatsHook__ ? window.__resetAllStatsHook__() : statsManager.resetStats())">Reset Stats</button>
                    <button onclick="statsManager.exportStats()">Export JSON</button>
                </div>
            </div>
        `;
    }

    /**
     * Benchmark çalıştır
     */
    runBenchmark(duration = 5000) {
        const startTime = performance.now();
        let operations = 0;
        
        const benchmark = () => {
            if (performance.now() - startTime < duration) {
                // Simple operation for benchmarking
                Math.random() * Math.random();
                operations++;
                requestAnimationFrame(benchmark);
            } else {
                const endTime = performance.now();
                const opsPerSecond = Math.round(operations / (duration / 1000));
                
                logger.info(`Benchmark completed: ${formatNumber(opsPerSecond)} ops/sec`);
                
                this.emit('benchmarkCompleted', {
                    duration,
                    operations,
                    opsPerSecond,
                    startTime,
                    endTime
                });
            }
        };
        
        benchmark();
    }

    /**
     * Cleanup ve kapatma
     */
    destroy() {
        // Stop intervals
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        if (this.historyInterval) {
            clearInterval(this.historyInterval);
            this.historyInterval = null;
        }
        
        if (this.performanceInterval) {
            clearInterval(this.performanceInterval);
            this.performanceInterval = null;
        }
        
        // Clear data
        this.elements.clear();
        
        // Remove event listeners
        this.removeAllListeners();
        
        logger.info('StatsManager destroyed');
    }
}

export default StatsManager;