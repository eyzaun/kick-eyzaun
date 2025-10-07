// packages/avatars/AvatarManager.js - Moved from classes/AvatarManager.js

import { UserAvatar } from './UserAvatar.js';
import { EventEmitter } from '../../utils/EventEmitter.js';
import { CONFIG, ALL_COMMANDS, USER_TYPES } from '../../utils/Config.js';
import { CooldownManager, logger } from '../../utils/Utils.js';
import { StatsTracker } from '../../utils/StatsTracker.js';

export class AvatarManager extends EventEmitter {
    constructor() {
        super();
        this.users = new Map();
        this.commands = new Map();
        this.cooldownManager = new CooldownManager();
        this.stats = new StatsTracker();
        this.visualEffects = null;
        this.cleanupInterval = null;
        this.initializeCommands();
        this.startCleanupInterval();
        logger.info('AvatarManager initialized');
    }

    initializeCommands() {
        Object.entries(ALL_COMMANDS).forEach(([command, config]) => {
            this.commands.set(command, config);
        });
        logger.info(`Loaded ${this.commands.size} commands`);
    }

    startCleanupInterval() {
        this.cleanupInterval = setInterval(() => {
            this.cleanupInactiveUsers();
        }, CONFIG.UI.CLEANUP_INTERVAL);
    }

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

    hasUser(userId) { return this.users.has(userId); }
    getUser(userId) { return this.users.get(userId); }

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

    handleMessage(messageData) {
        this.stats.incMessages();
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

    async handleCommand(commandData) {
        this.stats.incCommands();
        const { command, userId, user: username } = commandData;
        if (!this.commands.has(command)) {
            logger.command(`Unknown command: ${command} by ${username}`);
            return false;
        }
        const commandConfig = this.commands.get(command);
        const cooldownKey = this.getCooldownKey(userId, command, commandConfig.type);
        if (this.cooldownManager.isOnCooldown(cooldownKey)) {
            const remainingTime = this.cooldownManager.getRemainingTime(cooldownKey);
            logger.command(`Command ${command} by ${username} on cooldown (${remainingTime}ms remaining)`);
            return false;
        }
        this.cooldownManager.setCooldown(cooldownKey, commandConfig.cooldown);
        try {
            let result = false;
            if (commandConfig.type === 'movement' || commandConfig.type === 'animation') {
                result = await this.executeUserAction(commandData, commandConfig);
            } else if (commandConfig.type === 'global') {
                result = await this.executeGlobalEffect(commandData, commandConfig);
            }
            if (result) {
                this.stats.incMoves();
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

    async executeUserAction(commandData, commandConfig) {
        const { userId, user: username, userType } = commandData;
        const userAvatar = this.getOrCreateUser(userId, username, userType);
        if (userAvatar && typeof userAvatar[commandConfig.action] === 'function') {
            let result;
            if (commandConfig.action === 'setCharacter' && commandConfig.characterIndex !== undefined) {
                result = await userAvatar[commandConfig.action](commandConfig.characterIndex);
            } else {
                result = await userAvatar[commandConfig.action]();
            }
            this.showMiniNotification(`${username}: ${commandConfig.name}`);
            return result;
        }
        return false;
    }

    async executeGlobalEffect(commandData, commandConfig) {
        const { user: username } = commandData;
        try {
            if (!this.visualEffects) {
                const { VisualEffects } = await import('../effects/VisualEffects.js');
                this.visualEffects = new VisualEffects();
            }
            if (typeof this.visualEffects[commandConfig.action] === 'function') {
                let result;
                if (commandConfig.action === 'createTrashEffect' && commandConfig.character) {
                    const { character, title, titleColor, messageColor, messages, parts, durationMs, uniqueMessages } = commandConfig;
                    result = await this.visualEffects[commandConfig.action]({ character, title, titleColor, messageColor, messages, parts, durationMs, uniqueMessages });
                } else {
                    result = await this.visualEffects[commandConfig.action]();
                }
                this.showMiniNotification(`${username} used ${commandConfig.name}`);
                return result;
            }
        } catch (error) {
            logger.error(`Error loading visual effects:`, error);
        }
        return false;
    }

    getCooldownKey(userId, command, type) {
        if (type === 'global') return `global_${command}`;
        return `${userId}_${command}`;
    }

    showMiniNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'mini-effect-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => { notification.remove(); }, CONFIG.UI.NOTIFICATION_DURATION);
    }

    cleanupInactiveUsers() {
        const inactiveUsers = [];
        this.users.forEach((user, userId) => {
            if (user.isInactive()) inactiveUsers.push({ userId, user });
        });
        inactiveUsers.forEach(({ userId, user }) => {
            logger.avatar(`Removing inactive user: ${user.username}`);
            this.removeUser(userId);
        });
        if (inactiveUsers.length > 0) this.emit('inactiveUsersCleanup', { count: inactiveUsers.length });
        this.updateUserCount();
    }

    updateUserCount() {
        const activeCount = this.users.size;
        const activeAvatarsElement = document.getElementById('activeAvatars');
        if (activeAvatarsElement) activeAvatarsElement.textContent = activeCount;
        const totalAvatarsElement = document.getElementById('totalAvatars');
        if (totalAvatarsElement) totalAvatarsElement.textContent = activeCount;
        this.emit('userCountUpdated', { activeCount });
    }

    getAllUsers() { return Array.from(this.users.values()); }
    getActiveUserCount() { return this.users.size; }
    getUsersByType(userType) { return this.getAllUsers().filter(u => u.userType === userType); }
    getUserCountByType(userType) { return this.getUsersByType(userType).length; }

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

    resetStats() {
        if (this.stats && typeof this.stats.reset === 'function') {
            this.stats.reset();
            this.emit('statsReset', { timestamp: Date.now() });
            logger.info('AvatarManager stats reset');
        }
    }

    getStats() {
        const snapshot = this.stats.getSnapshot();
        return {
            ...snapshot,
            activeUsers: this.getActiveUserCount(),
            avatarStats: this.getAvatarStats(),
            uptime: Date.now() - snapshot.startTime,
            commandsAvailable: this.commands.size,
            activeCooldowns: this.cooldownManager.cooldowns?.size || 0
        };
    }

    exportUserData() {
        const userData = [];
        this.users.forEach((user) => {
            userData.push({
                ...user.getInfo(),
                isInactive: user.isInactive()
            });
        });
        return { users: userData, stats: this.getStats(), timestamp: new Date().toISOString() };
    }

    debugUsers() {
        console.group('Active Users');
        this.users.forEach((user) => {
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

    resetAllUsers() {
        this.users.forEach(user => { user.reset(); });
        logger.info('Reset all users');
        this.emit('allUsersReset');
    }

    async teleportAllUsers() {
        const promises = [];
        this.users.forEach(user => { promises.push(user.teleport()); });
        await Promise.allSettled(promises);
        logger.info('Teleported all users');
        this.emit('allUsersTeleported');
    }

    getRandomUser() {
        const users = this.getAllUsers();
        if (users.length === 0) return null;
        return users[Math.floor(Math.random() * users.length)];
    }

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

    destroy() {
        logger.info('Destroying AvatarManager');
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        this.users.forEach((user) => { user.destroy(); });
        this.users.clear();
        this.commands.clear();
        this.cooldownManager.clear();
        this.removeAllListeners();
        this.emit('destroyed');
    }
}

export default AvatarManager;
