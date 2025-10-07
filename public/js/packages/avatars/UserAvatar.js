// packages/avatars/UserAvatar.js - Moved from classes/UserAvatar.js

import { CONFIG, USER_TYPES } from '../../utils/Config.js';
import { getRandomPosition, clampPosition, createElement, removeElement, addTemporaryClass, logger } from '../../utils/Utils.js';

export class UserAvatar {
    constructor(userId, username, userType = USER_TYPES.VIEWER) {
        this.userId = userId;
        this.username = username;
        this.userType = userType;
        this.position = getRandomPosition();
        this.targetPosition = { ...this.position };
        this.currentEmoji = Math.floor(Math.random() * CONFIG.AVATAR.EMOJIS.length);
        this.isMoving = false;
        this.isAnimating = false;
        this.lastActivity = Date.now();
        this.createdAt = Date.now();
        this.element = null;
        this.label = null;
        this.speechBubble = null;
        this.speechBubbleTimeout = null;
        this.animationQueue = [];
        this.isProcessingQueue = false;
        this.createElement();
        this.createLabel();
        logger.avatar(`Created avatar for ${username} (${userType})`);
    }

    createElement() {
        this.element = createElement('div', 'user-avatar');
        const emoji = CONFIG.AVATAR.EMOJIS[this.currentEmoji];
        this.element.textContent = emoji;
        this.element.style.backgroundImage = '';
        this.element.id = `avatar-${this.userId}`;
        this.updateElementPosition();
        this.element.addEventListener('click', () => { this.handleClick(); });
        document.body.appendChild(this.element);
    }

    createLabel() {
        this.label = createElement('div', `user-label ${this.userType}`);
        this.label.textContent = this.username;
        this.label.id = `label-${this.userId}`;
        this.updateLabelPosition();
        document.body.appendChild(this.label);
    }

    updateElementPosition() {
        if (this.element) {
            this.element.style.left = this.position.x + 'px';
            this.element.style.top = this.position.y + 'px';
        }
        this.updateLabelPosition();
    }

    updateLabelPosition() {
        if (this.label) {
            this.label.style.left = (this.position.x + 5) + 'px';
            this.label.style.top = (this.position.y - 15) + 'px';
        }
    }

    handleClick() { this.jump(); }
    updateActivity() { this.lastActivity = Date.now(); }
    isInactive() { return Date.now() - this.lastActivity > CONFIG.AVATAR.INACTIVE_TIMEOUT; }

    async moveRight() { return this.moveTo(Math.min(CONFIG.SCREEN.WIDTH - CONFIG.AVATAR.SIZE, this.position.x + CONFIG.AVATAR.MOVE_DISTANCE), this.position.y); }
    async moveLeft() { return this.moveTo(Math.max(0, this.position.x - CONFIG.AVATAR.MOVE_DISTANCE), this.position.y); }
    async moveUp() { return this.moveTo(this.position.x, Math.max(0, this.position.y - CONFIG.AVATAR.MOVE_DISTANCE)); }
    async moveDown() { return this.moveTo(this.position.x, Math.min(CONFIG.SCREEN.HEIGHT - CONFIG.AVATAR.SIZE, this.position.y + CONFIG.AVATAR.MOVE_DISTANCE)); }

    async moveTo(x, y) { if (this.isMoving) { return this.queueAnimation('moveTo', [x, y]); } return this.executeMovement(x, y); }

    async executeMovement(x, y) {
        this.isMoving = true;
        this.updateActivity();
        this.position = clampPosition({ x, y });
        this.element.classList.add('moving');
        this.updateElementPosition();
        if (this.speechBubble) {
            this.updateSpeechBubblePosition();
            const positionUpdateInterval = setInterval(() => {
                if (this.speechBubble && this.isMoving) {
                    this.updateSpeechBubblePosition();
                } else {
                    clearInterval(positionUpdateInterval);
                }
            }, 50);
        }
        await new Promise(resolve => setTimeout(resolve, CONFIG.AVATAR.ANIMATION_DURATION));
        this.element.classList.remove('moving');
        this.isMoving = false;
        if (this.speechBubble) this.updateSpeechBubblePosition();
        logger.avatar(`${this.username} moved to ${this.position.x}, ${this.position.y}`);
        return true;
    }

    async dance() { if (this.isAnimating) return this.queueAnimation('dance'); return this.executeAnimation('dancing', 1500); }
    async jump() { if (this.isAnimating) return this.queueAnimation('jump'); return this.executeAnimation('jumping', 1000); }
    async spin() { if (this.isAnimating) return this.queueAnimation('spin'); return this.executeAnimation('spinning', 1000); }

    async executeAnimation(className, duration) {
        this.isAnimating = true;
        this.updateActivity();
        this.element.classList.add(className);
        await new Promise(resolve => setTimeout(resolve, duration));
        this.element.classList.remove(className);
        this.isAnimating = false;
        logger.avatar(`${this.username} performed ${className} animation`);
        return true;
    }

    async changeAvatar() {
        this.updateActivity();
        this.currentEmoji = (this.currentEmoji + 1) % CONFIG.AVATAR.EMOJIS.length;
        const originalTransition = this.element.style.transition;
        this.element.style.transition = 'all 0.3s ease-in-out';
        this.element.style.transform = 'scale(1.5) rotate(360deg)';
        this.element.style.filter = 'brightness(1.5) drop-shadow(0 0 15px rgba(255,255,255,0.8))';
        setTimeout(() => {
            const emoji = CONFIG.AVATAR.EMOJIS[this.currentEmoji];
            this.element.textContent = emoji;
            this.element.style.backgroundImage = '';
        }, 150);
        setTimeout(() => {
            this.element.style.transform = 'scale(1) rotate(0deg)';
            this.element.style.filter = 'drop-shadow(0 0 8px rgba(255,255,255,0.3))';
            setTimeout(() => { this.element.style.transition = originalTransition; }, 100);
        }, 300);
        logger.avatar(`${this.username} changed avatar to ${CONFIG.AVATAR.EMOJIS[this.currentEmoji]}`);
        return true;
    }

    async setCharacter(characterIndex) {
        if (characterIndex < 0 || characterIndex >= CONFIG.AVATAR.EMOJIS.length) {
            console.warn(`Invalid character index: ${characterIndex}`);
            return false;
        }
        this.updateActivity();
        this.currentEmoji = characterIndex;
        const originalTransition = this.element.style.transition;
        this.element.style.transition = 'all 0.3s ease-in-out';
        this.element.style.transform = 'scale(1.3) rotate(180deg)';
        this.element.style.filter = 'brightness(1.8) drop-shadow(0 0 20px rgba(255,255,255,0.9))';
        setTimeout(() => {
            const emoji = CONFIG.AVATAR.EMOJIS[this.currentEmoji];
            this.element.textContent = emoji;
            this.element.style.backgroundImage = '';
        }, 150);
        setTimeout(() => {
            this.element.style.transform = 'scale(1) rotate(0deg)';
            this.element.style.filter = 'drop-shadow(0 0 8px rgba(255,255,255,0.3))';
            setTimeout(() => { this.element.style.transition = originalTransition; }, 100);
        }, 300);
        logger.avatar(`${this.username} set character to ${CONFIG.AVATAR.EMOJIS[this.currentEmoji]} (index: ${characterIndex})`);
        return true;
    }

    showSpeechBubble(message, isCommand = false, duration = CONFIG.AVATAR.INACTIVE_TIMEOUT) {
        this.updateActivity();
        if (this.speechBubbleTimeout) {
            clearTimeout(this.speechBubbleTimeout);
            this.speechBubbleTimeout = null;
        }
        this.removeSpeechBubble();
        this.speechBubble = createElement('div', `speech-bubble ${this.userType}`);
        if (isCommand) this.speechBubble.classList.add('command');
        this.speechBubble.textContent = message;
        this.speechBubble.id = `bubble-${this.userId}`;
        this.updateSpeechBubblePosition();
        document.body.appendChild(this.speechBubble);
        this.speechBubbleTimeout = setTimeout(() => {
            if (this.speechBubble) {
                this.speechBubble.style.animation = 'bubbleFadeOut 2.5s ease-out forwards';
                setTimeout(() => { this.removeSpeechBubble(); this.speechBubbleTimeout = null; }, 2500);
            }
        }, duration);
        logger.avatar(`${this.username} said: ${message}`);
    }

    updateSpeechBubblePosition() {
        if (this.speechBubble) {
            const computedStyle = window.getComputedStyle(this.speechBubble);
            const paddingLeft = parseFloat(computedStyle.paddingLeft) || 18;
            const paddingRight = parseFloat(computedStyle.paddingRight) || 18;
            const fontSize = parseFloat(computedStyle.fontSize) || 16;
            const textLength = this.speechBubble.textContent.length;
            const estimatedWidth = Math.min(textLength * (fontSize * 0.6) + paddingLeft + paddingRight + 20, 280);
            const avatarCenter = this.position.x + (CONFIG.AVATAR.SIZE / 2);
            const bubbleLeft = Math.max(15, Math.min(CONFIG.SCREEN.WIDTH - estimatedWidth - 15, avatarCenter - (estimatedWidth / 2)));
            this.speechBubble.style.left = bubbleLeft + 'px';
            this.speechBubble.style.top = (this.position.y - 90) + 'px';
        }
    }

    removeSpeechBubble() {
        if (this.speechBubble) {
            removeElement(this.speechBubble);
            this.speechBubble = null;
        }
        if (this.speechBubbleTimeout) {
            clearTimeout(this.speechBubbleTimeout);
            this.speechBubbleTimeout = null;
        }
    }

    async queueAnimation(methodName, args = []) {
        return new Promise((resolve) => {
            this.animationQueue.push({ methodName, args, resolve });
            this.processAnimationQueue();
        });
    }

    async processAnimationQueue() {
        if (this.isProcessingQueue || this.animationQueue.length === 0) return;
        this.isProcessingQueue = true;
        while (this.animationQueue.length > 0) {
            const { methodName, args, resolve } = this.animationQueue.shift();
            try {
                const result = await this[methodName](...args);
                resolve(result);
            } catch (error) {
                logger.error(`Error processing queued animation ${methodName}:`, error);
                resolve(false);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        this.isProcessingQueue = false;
    }

    highlight(duration = 2000) { addTemporaryClass(this.element, 'highlighted', duration); addTemporaryClass(this.label, 'highlighted', duration); }
    hide() { if (this.element) this.element.style.display = 'none'; if (this.label) this.label.style.display = 'none'; if (this.speechBubble) this.speechBubble.style.display = 'none'; }
    show() { if (this.element) this.element.style.display = 'block'; if (this.label) this.label.style.display = 'block'; if (this.speechBubble) this.speechBubble.style.display = 'block'; }

    getInfo() {
        return {
            userId: this.userId,
            username: this.username,
            userType: this.userType,
            position: { ...this.position },
            currentEmoji: CONFIG.AVATAR.EMOJIS[this.currentEmoji],
            isMoving: this.isMoving,
            isAnimating: this.isAnimating,
            lastActivity: this.lastActivity,
            createdAt: this.createdAt,
            queueLength: this.animationQueue.length
        };
    }

    async teleport() { const newPosition = getRandomPosition(); return this.moveTo(newPosition.x, newPosition.y); }

    destroy() {
        logger.avatar(`Destroying avatar for ${this.username}`);
        this.animationQueue = [];
        this.removeSpeechBubble();
        if (this.element) { removeElement(this.element); this.element = null; }
        if (this.label) { removeElement(this.label); this.label = null; }
        this.userId = null; this.username = null; this.position = null;
    }

    reset() {
        this.isMoving = false; this.isAnimating = false; this.animationQueue = [];
        this.position = getRandomPosition(); this.updateElementPosition();
        this.removeSpeechBubble();
        if (this.element) { this.element.className = 'user-avatar'; }
        this.updateActivity();
        logger.avatar(`Reset avatar for ${this.username}`);
    }
}

export default UserAvatar;
