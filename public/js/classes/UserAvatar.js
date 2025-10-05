// public/js/classes/UserAvatar.js - Kullanıcı avatar sınıfı

import { CONFIG, USER_TYPES } from '../utils/Config.js';
import { getRandomPosition, clampPosition, createElement, removeElement, addTemporaryClass, logger } from '../utils/Utils.js';

/**
 * Kullanıcı Avatar sınıfı - Her chat kullanıcısının kendi avatarı
 */
export class UserAvatar {
    constructor(userId, username, userType = USER_TYPES.VIEWER) {
        this.userId = userId;
        this.username = username;
        this.userType = userType;
        
        // Position
        this.position = getRandomPosition();
        this.targetPosition = { ...this.position };
        
        // Avatar state
        this.currentEmoji = Math.floor(Math.random() * CONFIG.AVATAR.EMOJIS.length);
        this.isMoving = false;
        this.isAnimating = false;
        
        // Activity tracking
        this.lastActivity = Date.now();
        this.createdAt = Date.now();
        
        // DOM elements
        this.element = null;
        this.label = null;
        this.speechBubble = null;
        
        // Speech bubble timeout
        this.speechBubbleTimeout = null;
        
        // Animation queue
        this.animationQueue = [];
        this.isProcessingQueue = false;
        
        // Create DOM elements
        this.createElement();
        this.createLabel();
        
        logger.avatar(`Created avatar for ${username} (${userType})`);
    }

    /**
     * Avatar DOM elementi oluştur
     */
    createElement() {
        this.element = createElement('div', 'user-avatar');
        
        // PNG resim için background-image kullan
        const characterPath = CONFIG.AVATAR.EMOJIS[this.currentEmoji];
        if (characterPath.endsWith('.png')) {
            this.element.style.backgroundImage = `url(${characterPath})`;
            this.element.style.backgroundSize = 'cover';
            this.element.style.backgroundPosition = 'center';
            this.element.style.backgroundRepeat = 'no-repeat';
            this.element.textContent = ''; // Text'i temizle
        } else {
            this.element.textContent = characterPath; // Emoji için text kullan
        }
        
        this.element.id = `avatar-${this.userId}`;
        
        // Initial position
        this.updateElementPosition();
        
        // Event listeners
        this.element.addEventListener('click', () => {
            this.handleClick();
        });
        
        // Add to DOM
        document.body.appendChild(this.element);
    }

    /**
     * Kullanıcı label'ı oluştur
     */
    createLabel() {
        this.label = createElement('div', `user-label ${this.userType}`);
        this.label.textContent = this.username;
        this.label.id = `label-${this.userId}`;
        
        // Position relative to avatar
        this.updateLabelPosition();
        
        // Add to DOM
        document.body.appendChild(this.label);
    }

    /**
     * Element pozisyonunu güncelle
     */
    updateElementPosition() {
        if (this.element) {
            this.element.style.left = this.position.x + 'px';
            this.element.style.top = this.position.y + 'px';
        }
        this.updateLabelPosition();
    }

    /**
     * Label pozisyonunu güncelle
     */
    updateLabelPosition() {
        if (this.label) {
            this.label.style.left = (this.position.x + 5) + 'px';
            this.label.style.top = (this.position.y - 15) + 'px';
        }
    }

    /**
     * Click event handler
     */
    handleClick() {
        this.jump();
    }

    /**
     * Aktiviteyi güncelle
     */
    updateActivity() {
        this.lastActivity = Date.now();
    }

    /**
     * İnaktif mi kontrol et
     */
    isInactive() {
        return Date.now() - this.lastActivity > CONFIG.AVATAR.INACTIVE_TIMEOUT;
    }

    // MOVEMENT METHODS

    /**
     * Sağa hareket
     */
    async moveRight() {
        return this.moveTo(
            Math.min(CONFIG.SCREEN.WIDTH - CONFIG.AVATAR.SIZE, this.position.x + CONFIG.AVATAR.MOVE_DISTANCE),
            this.position.y
        );
    }

    /**
     * Sola hareket
     */
    async moveLeft() {
        return this.moveTo(
            Math.max(0, this.position.x - CONFIG.AVATAR.MOVE_DISTANCE),
            this.position.y
        );
    }

    /**
     * Yukarı hareket
     */
    async moveUp() {
        return this.moveTo(
            this.position.x,
            Math.max(0, this.position.y - CONFIG.AVATAR.MOVE_DISTANCE)
        );
    }

    /**
     * Aşağı hareket
     */
    async moveDown() {
        return this.moveTo(
            this.position.x,
            Math.min(CONFIG.SCREEN.HEIGHT - CONFIG.AVATAR.SIZE, this.position.y + CONFIG.AVATAR.MOVE_DISTANCE)
        );
    }

    /**
     * Belirli bir pozisyona git
     */
    async moveTo(x, y) {
        if (this.isMoving) {
            return this.queueAnimation('moveTo', [x, y]);
        }

        return this.executeMovement(x, y);
    }

    /**
     * Hareket animasyonunu çalıştır
     */
    async executeMovement(x, y) {
        this.isMoving = true;
        this.updateActivity();
        
        // Position güncelle
        this.position = clampPosition({ x, y });
        
        // Visual feedback
        this.element.classList.add('moving');
        
        // Animate to new position
        this.updateElementPosition();
        
        // Update speech bubble position during movement
        if (this.speechBubble) {
            this.updateSpeechBubblePosition();
            
            // Keep updating position during movement
            const positionUpdateInterval = setInterval(() => {
                if (this.speechBubble && this.isMoving) {
                    this.updateSpeechBubblePosition();
                } else {
                    clearInterval(positionUpdateInterval);
                }
            }, 50);
        }
        
        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, CONFIG.AVATAR.ANIMATION_DURATION));
        
        // Clean up
        this.element.classList.remove('moving');
        this.isMoving = false;
        
        // Final position update
        if (this.speechBubble) {
            this.updateSpeechBubblePosition();
        }
        
        logger.avatar(`${this.username} moved to ${this.position.x}, ${this.position.y}`);
        
        return true;
    }

    // ANIMATION METHODS

    /**
     * Dans et
     */
    async dance() {
        if (this.isAnimating) {
            return this.queueAnimation('dance');
        }

        return this.executeAnimation('dancing', 1500);
    }

    /**
     * Zıpla
     */
    async jump() {
        if (this.isAnimating) {
            return this.queueAnimation('jump');
        }

        return this.executeAnimation('jumping', 1000);
    }

    /**
     * Döndür
     */
    async spin() {
        if (this.isAnimating) {
            return this.queueAnimation('spin');
        }

        return this.executeAnimation('spinning', 1000);
    }

    /**
     * Animasyon çalıştır
     */
    async executeAnimation(className, duration) {
        this.isAnimating = true;
        this.updateActivity();
        
        // Add animation class
        this.element.classList.add(className);
        
        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, duration));
        
        // Clean up
        this.element.classList.remove(className);
        this.isAnimating = false;
        
        logger.avatar(`${this.username} performed ${className} animation`);
        
        return true;
    }

    /**
     * Avatar karakterini değiştir (eski davranış - sıradaki karakter)
     */
    async changeAvatar() {
        this.updateActivity();
        
        // Next emoji
        this.currentEmoji = (this.currentEmoji + 1) % CONFIG.AVATAR.EMOJIS.length;
        
        // Enhanced animation
        const originalTransition = this.element.style.transition;
        
        this.element.style.transition = 'all 0.3s ease-in-out';
        this.element.style.transform = 'scale(1.5) rotate(360deg)';
        this.element.style.filter = 'brightness(1.5) drop-shadow(0 0 15px rgba(255,255,255,0.8))';
        
        // Change character after scale up
        setTimeout(() => {
            const characterPath = CONFIG.AVATAR.EMOJIS[this.currentEmoji];
            if (characterPath.endsWith('.png')) {
                this.element.style.backgroundImage = `url(${characterPath})`;
                this.element.style.backgroundSize = 'cover';
                this.element.style.backgroundPosition = 'center';
                this.element.style.backgroundRepeat = 'no-repeat';
                this.element.textContent = ''; // Text'i temizle
            } else {
                this.element.textContent = characterPath; // Emoji için text kullan
                this.element.style.backgroundImage = ''; // Background'ı temizle
            }
        }, 150);
        
        // Scale back down
        setTimeout(() => {
            this.element.style.transform = 'scale(1) rotate(0deg)';
            this.element.style.filter = 'drop-shadow(0 0 8px rgba(255,255,255,0.3))';
            
            setTimeout(() => {
                this.element.style.transition = originalTransition;
            }, 100);
        }, 300);
        
        logger.avatar(`${this.username} changed avatar to ${CONFIG.AVATAR.EMOJIS[this.currentEmoji]}`);
        
        return true;
    }

    /**
     * Belirli bir karaktere geç (özel karakter komutları için)
     */
    async setCharacter(characterIndex) {
        if (characterIndex < 0 || characterIndex >= CONFIG.AVATAR.EMOJIS.length) {
            console.warn(`Invalid character index: ${characterIndex}`);
            return false;
        }

        this.updateActivity();

        // Set specific character
        this.currentEmoji = characterIndex;

        // Enhanced animation
        const originalTransition = this.element.style.transition;

        this.element.style.transition = 'all 0.3s ease-in-out';
        this.element.style.transform = 'scale(1.3) rotate(180deg)';
        this.element.style.filter = 'brightness(1.8) drop-shadow(0 0 20px rgba(255,255,255,0.9))';

        // Change character after scale up
        setTimeout(() => {
            const characterPath = CONFIG.AVATAR.EMOJIS[this.currentEmoji];
            if (characterPath.endsWith('.png')) {
                this.element.style.backgroundImage = `url(${characterPath})`;
                this.element.style.backgroundSize = 'cover';
                this.element.style.backgroundPosition = 'center';
                this.element.style.backgroundRepeat = 'no-repeat';
                this.element.textContent = ''; // Text'i temizle
            } else {
                this.element.textContent = characterPath; // Emoji için text kullan
                this.element.style.backgroundImage = ''; // Background'ı temizle
            }
        }, 150);

        // Scale back down
        setTimeout(() => {
            this.element.style.transform = 'scale(1) rotate(0deg)';
            this.element.style.filter = 'drop-shadow(0 0 8px rgba(255,255,255,0.3))';

            setTimeout(() => {
                this.element.style.transition = originalTransition;
            }, 100);
        }, 300);

        logger.avatar(`${this.username} set character to ${CONFIG.AVATAR.EMOJIS[this.currentEmoji]} (index: ${characterIndex})`);

        return true;
    }

    // SPEECH BUBBLE METHODS

    /**
     * Konuşma balonu göster
     */
    showSpeechBubble(message, isCommand = false, duration = CONFIG.AVATAR.INACTIVE_TIMEOUT) {
        this.updateActivity();
        
        // Clear any existing timeout
        if (this.speechBubbleTimeout) {
            clearTimeout(this.speechBubbleTimeout);
            this.speechBubbleTimeout = null;
        }
        
        // Remove existing bubble immediately if same user
        this.removeSpeechBubble();
        
        // Create new bubble
        this.speechBubble = createElement('div', `speech-bubble ${this.userType}`);
        
        if (isCommand) {
            this.speechBubble.classList.add('command');
        }
        
        this.speechBubble.textContent = message;
        this.speechBubble.id = `bubble-${this.userId}`;
        
        // Position relative to avatar
        this.updateSpeechBubblePosition();
        
        // Add to DOM
        document.body.appendChild(this.speechBubble);
        
        // Store timeout reference
        this.speechBubbleTimeout = setTimeout(() => {
            if (this.speechBubble) {
                this.speechBubble.style.animation = 'bubbleFadeOut 2.5s ease-out forwards';
                setTimeout(() => {
                    this.removeSpeechBubble();
                    this.speechBubbleTimeout = null;
                }, 2500);
            }
        }, duration);
        
        logger.avatar(`${this.username} said: ${message}`);
    }

    /**
     * Konuşma balonunu konumla
     */
    updateSpeechBubblePosition() {
        if (this.speechBubble) {
            // Get actual bubble dimensions after content is set
            const computedStyle = window.getComputedStyle(this.speechBubble);
            const paddingLeft = parseFloat(computedStyle.paddingLeft) || 18;
            const paddingRight = parseFloat(computedStyle.paddingRight) || 18;
            const fontSize = parseFloat(computedStyle.fontSize) || 16;
            
            // Estimate width based on text length and font size
            const textLength = this.speechBubble.textContent.length;
            const estimatedWidth = Math.min(textLength * (fontSize * 0.6) + paddingLeft + paddingRight + 20, 280);
            
            // Center the bubble above the avatar with perfect positioning
            const avatarCenter = this.position.x + (CONFIG.AVATAR.SIZE / 2);
            const bubbleLeft = Math.max(15, Math.min(CONFIG.SCREEN.WIDTH - estimatedWidth - 15, avatarCenter - (estimatedWidth / 2)));
            
            this.speechBubble.style.left = bubbleLeft + 'px';
            this.speechBubble.style.top = (this.position.y - 90) + 'px'; // Higher for better visibility
        }
    }

    /**
     * Konuşma balonunu kaldır
     */
    removeSpeechBubble() {
        if (this.speechBubble) {
            removeElement(this.speechBubble);
            this.speechBubble = null;
        }
        
        // Clear timeout if exists
        if (this.speechBubbleTimeout) {
            clearTimeout(this.speechBubbleTimeout);
            this.speechBubbleTimeout = null;
        }
    }

    // ANIMATION QUEUE SYSTEM

    /**
     * Animasyonu kuyruğa al
     */
    async queueAnimation(methodName, args = []) {
        return new Promise((resolve) => {
            this.animationQueue.push({ methodName, args, resolve });
            this.processAnimationQueue();
        });
    }

    /**
     * Animasyon kuyruğunu işle
     */
    async processAnimationQueue() {
        if (this.isProcessingQueue || this.animationQueue.length === 0) {
            return;
        }

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
            
            // Small delay between animations
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        this.isProcessingQueue = false;
    }

    // UTILITY METHODS

    /**
     * Avatar'ı highlight et
     */
    highlight(duration = 2000) {
        addTemporaryClass(this.element, 'highlighted', duration);
        addTemporaryClass(this.label, 'highlighted', duration);
    }

    /**
     * Avatar'ı gizle
     */
    hide() {
        if (this.element) this.element.style.display = 'none';
        if (this.label) this.label.style.display = 'none';
        if (this.speechBubble) this.speechBubble.style.display = 'none';
    }

    /**
     * Avatar'ı göster
     */
    show() {
        if (this.element) this.element.style.display = 'block';
        if (this.label) this.label.style.display = 'block';
        if (this.speechBubble) this.speechBubble.style.display = 'block';
    }

    /**
     * Avatar bilgilerini al
     */
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

    /**
     * Avatar'ı rastgele pozisyona teleport et
     */
    async teleport() {
        const newPosition = getRandomPosition();
        return this.moveTo(newPosition.x, newPosition.y);
    }

    /**
     * Avatar'ı cleanup et ve DOM'dan kaldır
     */
    destroy() {
        logger.avatar(`Destroying avatar for ${this.username}`);
        
        // Clear animation queue
        this.animationQueue = [];
        
        // Remove speech bubble
        this.removeSpeechBubble();
        
        // Remove DOM elements
        if (this.element) {
            removeElement(this.element);
            this.element = null;
        }
        
        if (this.label) {
            removeElement(this.label);
            this.label = null;
        }
        
        // Clear references
        this.userId = null;
        this.username = null;
        this.position = null;
    }

    /**
     * Avatar durumunu sıfırla
     */
    reset() {
        // Stop all animations
        this.isMoving = false;
        this.isAnimating = false;
        this.animationQueue = [];
        
        // Reset position
        this.position = getRandomPosition();
        this.updateElementPosition();
        
        // Remove speech bubble
        this.removeSpeechBubble();
        
        // Reset classes
        if (this.element) {
            this.element.className = 'user-avatar';
        }
        
        this.updateActivity();
        
        logger.avatar(`Reset avatar for ${this.username}`);
    }
}

export default UserAvatar;