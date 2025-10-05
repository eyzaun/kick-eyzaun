// public/js/classes/AvatarManager.js - Avatar yönetici sınıfı

import { UserAvatar } from './UserAvatar.js';
import { EventEmitter } from '../utils/EventEmitter.js';
import { CONFIG, ALL_COMMANDS, USER_TYPES } from '../utils/Config.js';
import { CooldownManager, logger } from '../utils/Utils.js';
import { GameManager } from './GameManager.js';

/**
 * Avatar Manager - Tüm kullanıcı avatarlarını yönetir
 */
export class AvatarManager extends EventEmitter {
    constructor() {
        super();
        
        // Avatar storage
        this.users = new Map();
        
        // Command system
        this.commands = new Map();
        this.cooldownManager = new CooldownManager();
        
        // Stats
        this.stats = {
            totalMessages: 0,
            totalCommands: 0,
            totalMoves: 0,
            startTime: Date.now()
        };
        
        // Cleanup
        this.cleanupInterval = null;
        
        // Initialize
        this.initializeCommands();
        this.startCleanupInterval();
        
        logger.info('AvatarManager initialized');
    }

    /**
     * Komutları başlat
     */
    initializeCommands() {
        // Load all commands from config
        Object.entries(ALL_COMMANDS).forEach(([command, config]) => {
            this.commands.set(command, config);
        });
        
        logger.info(`Loaded ${this.commands.size} commands`);
    }

    /**
     * Cleanup interval başlat
     */
    startCleanupInterval() {
        this.cleanupInterval = setInterval(() => {
            this.cleanupInactiveUsers();
        }, CONFIG.UI.CLEANUP_INTERVAL);
    }

    /**
     * Kullanıcı al veya oluştur
     */
    getOrCreateUser(userId, username, userType = USER_TYPES.VIEWER) {
        if (!this.users.has(userId)) {
            const user = new UserAvatar(userId, username, userType);
            this.users.set(userId, user);
            
            logger.avatar(`Created avatar for ${username} (${userType})`);
            this.emit('userCreated', { userId, username, userType, user });
        }
        
        const user = this.users.get(userId);
        user.updateActivity();
        
        return user;
    }

    /**
     * Kullanıcı var mı kontrol et
     */
    hasUser(userId) {
        return this.users.has(userId);
    }

    /**
     * Kullanıcı al
     */
    getUser(userId) {
        return this.users.get(userId);
    }

    /**
     * Kullanıcıyı kaldır
     */
    removeUser(userId) {
        const user = this.users.get(userId);
        if (user) {
            user.destroy();
            this.users.delete(userId);
            
            logger.avatar(`Removed user: ${user.username}`);
            this.emit('userRemoved', { userId, user });
            
            return true;
        }
        return false;
    }

    /**
     * Chat mesajını işle
     */
    handleMessage(messageData) {
        this.stats.totalMessages++;
        
        const user = this.getOrCreateUser(
            messageData.userId,
            messageData.username,
            messageData.userType
        );

        const messageText = String(messageData.message ?? '');
        const isCommand = messageText.trim().startsWith('!');

        if (!isCommand) {
            user.showSpeechBubble(messageText, false);
        }
        
        this.emit('messageHandled', { messageData, user });
        
        logger.avatar(`Message from ${messageData.username}: ${messageText}`);
    }

    /**
     * Komut işle
     */
    async handleCommand(commandData) {
        this.stats.totalCommands++;
        
        const { command, userId, user: username, userType } = commandData;
        
        // Check if command exists
        if (!this.commands.has(command)) {
            logger.command(`Unknown command: ${command} by ${username}`);
            return false;
        }

        const commandConfig = this.commands.get(command);
        
        // Check cooldown
        const cooldownKey = this.getCooldownKey(userId, command, commandConfig.type);
        if (this.cooldownManager.isOnCooldown(cooldownKey)) {
            const remainingTime = this.cooldownManager.getRemainingTime(cooldownKey);
            logger.command(`Command ${command} by ${username} on cooldown (${remainingTime}ms remaining)`);
            return false;
        }

        // Set cooldown
        this.cooldownManager.setCooldown(cooldownKey, commandConfig.cooldown);

        try {
            let result = false;
            
            if (commandConfig.type === 'movement' || commandConfig.type === 'animation') {
                // User-specific action
                result = await this.executeUserAction(commandData, commandConfig);
            } else if (commandConfig.type === 'global') {
                // Global effect
                result = await this.executeGlobalEffect(commandData, commandConfig);
            }
            
            if (result) {
                this.stats.totalMoves++;
                this.emit('commandExecuted', { commandData, commandConfig, result });
                
                logger.command(`Executed command: ${command} by ${username}`);
            }
            
            return result;
            
        } catch (error) {
            logger.error(`Error executing command ${command}:`, error);
            this.emit('commandError', { commandData, commandConfig, error });
            return false;
        }
    }

    /**
     * Kullanıcı aksiyonu çalıştır
     */
    async executeUserAction(commandData, commandConfig) {
        const { userId, user: username, userType } = commandData;

        const userAvatar = this.getOrCreateUser(userId, username, userType);

        if (userAvatar && typeof userAvatar[commandConfig.action] === 'function') {
            // Özel karakter komutları için characterIndex parametresini geç
            let result;
            if (commandConfig.action === 'setCharacter' && commandConfig.characterIndex !== undefined) {
                result = await userAvatar[commandConfig.action](commandConfig.characterIndex);
            } else {
                result = await userAvatar[commandConfig.action]();
            }

            // Show notification
            this.showMiniNotification(`${username}: ${commandConfig.name}`);

            return result;
        }

        return false;
    }

    /**
     * Global efekt çalıştır
     */
    async executeGlobalEffect(commandData, commandConfig) {
        const { user: username } = commandData;

        // Import and execute effect
        try {
            const { VisualEffects } = await import('../effects/VisualEffects.js');
            const visualEffects = new VisualEffects();

            if (typeof visualEffects[commandConfig.action] === 'function') {
                // Özel karakter komutları için character parametresini geç
                let result;
                if (commandConfig.action === 'createTrashEffect' && commandConfig.character) {
                    result = await visualEffects[commandConfig.action]({ character: commandConfig.character });
                } else {
                    result = await visualEffects[commandConfig.action]();
                }

                // Show notification
                this.showMiniNotification(`${username} used ${commandConfig.name}`);

                return result;
            }
        } catch (error) {
            logger.error(`Error loading visual effects:`, error);
        }

        return false;
    }

    /**
     * Cooldown key oluştur
     */
    getCooldownKey(userId, command, type) {
        // Global effects için kullanıcı fark etmiyor
        if (type === 'global') {
            return `global_${command}`;
        }
        
        // User-specific actions için kullanıcı bazlı cooldown
        return `${userId}_${command}`;
    }

    /**
     * Mini notification göster
     */
    showMiniNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'mini-effect-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, CONFIG.UI.NOTIFICATION_DURATION);
    }

    /**
     * İnaktif kullanıcıları temizle
     */
    cleanupInactiveUsers() {
        const inactiveUsers = [];
        
        this.users.forEach((user, userId) => {
            if (user.isInactive()) {
                inactiveUsers.push({ userId, user });
            }
        });
        
        inactiveUsers.forEach(({ userId, user }) => {
            logger.avatar(`Removing inactive user: ${user.username}`);
            this.removeUser(userId);
        });
        
        if (inactiveUsers.length > 0) {
            this.emit('inactiveUsersCleanup', { count: inactiveUsers.length });
        }
        
        this.updateUserCount();
    }

    /**
     * Kullanıcı sayısını güncelle
     */
    updateUserCount() {
        const activeCount = this.users.size;
        
        const activeAvatarsElement = document.getElementById('activeAvatars');
        if (activeAvatarsElement) {
            activeAvatarsElement.textContent = activeCount;
        }
        
        const totalAvatarsElement = document.getElementById('totalAvatars');
        if (totalAvatarsElement) {
            totalAvatarsElement.textContent = activeCount;
        }
        
        this.emit('userCountUpdated', { activeCount });
    }

    /**
     * Tüm kullanıcıları al
     */
    getAllUsers() {
        return Array.from(this.users.values());
    }

    /**
     * Aktif kullanıcı sayısı
     */
    getActiveUserCount() {
        return this.users.size;
    }

    /**
     * Kullanıcı türüne göre filtrele
     */
    getUsersByType(userType) {
        return this.getAllUsers().filter(user => user.userType === userType);
    }

    /**
     * Belirli bir kullanıcı türü sayısı
     */
    getUserCountByType(userType) {
        return this.getUsersByType(userType).length;
    }

    /**
     * Avatar istatistikleri
     */
    getAvatarStats() {
        const users = this.getAllUsers();
        
        return {
            total: users.length,
            broadcasters: this.getUserCountByType(USER_TYPES.BROADCASTER),
            moderators: this.getUserCountByType(USER_TYPES.MODERATOR),
            vips: this.getUserCountByType(USER_TYPES.VIP),
            viewers: this.getUserCountByType(USER_TYPES.VIEWER),
            moving: users.filter(u => u.isMoving).length,
            animating: users.filter(u => u.isAnimating).length
        };
    }

    /**
     * Sistem istatistikleri
     */
    getStats() {
        return {
            ...this.stats,
            activeUsers: this.getActiveUserCount(),
            avatarStats: this.getAvatarStats(),
            uptime: Date.now() - this.stats.startTime,
            commandsAvailable: this.commands.size,
            activeCooldowns: this.cooldownManager.cooldowns?.size || 0
        };
    }

    /**
     * Kullanıcı bilgilerini export et
     */
    exportUserData() {
        const userData = [];
        
        this.users.forEach((user, userId) => {
            userData.push({
                ...user.getInfo(),
                isInactive: user.isInactive()
            });
        });
        
        return {
            users: userData,
            stats: this.getStats(),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Debug için kullanıcı listesi
     */
    debugUsers() {
        console.group('Active Users');
        
        this.users.forEach((user, userId) => {
            console.log(`${user.username} (${user.userType}):`, {
                position: user.position,
                lastActivity: new Date(user.lastActivity).toLocaleTimeString(),
                isMoving: user.isMoving,
                isAnimating: user.isAnimating,
                queueLength: user.animationQueue?.length || 0
            });
        });
        
        console.groupEnd();
        
        return this.exportUserData();
    }

    /**
     * Tüm kullanıcıları sıfırla
     */
    resetAllUsers() {
        this.users.forEach(user => {
            user.reset();
        });
        
        logger.info('Reset all users');
        this.emit('allUsersReset');
    }

    /**
     * Tüm kullanıcıları teleport et
     */
    async teleportAllUsers() {
        const promises = [];
        
        this.users.forEach(user => {
            promises.push(user.teleport());
        });
        
        await Promise.allSettled(promises);
        
        logger.info('Teleported all users');
        this.emit('allUsersTeleported');
    }

    /**
     * Rastgele kullanıcı seç
     */
    getRandomUser() {
        const users = this.getAllUsers();
        if (users.length === 0) return null;
        
        return users[Math.floor(Math.random() * users.length)];
    }

    /**
     * En aktif kullanıcı
     */
    getMostActiveUser() {
        let mostActive = null;
        let latestActivity = 0;
        
        this.users.forEach(user => {
            if (user.lastActivity > latestActivity) {
                latestActivity = user.lastActivity;
                mostActive = user;
            }
        });
        
        return mostActive;
    }

    /**
     * Cleanup ve kapatma
     */
    destroy() {
        logger.info('Destroying AvatarManager');
        
        // Stop cleanup interval
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        
        // Remove all users
        this.users.forEach((user, userId) => {
            user.destroy();
        });
        
        this.users.clear();
        this.commands.clear();
        this.cooldownManager.clear();
        
        // Clear event listeners
        this.removeAllListeners();
        
        this.emit('destroyed');
    }
}

export default AvatarManager;