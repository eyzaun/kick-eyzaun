// public/js/components/UI.js - Kullanıcı arayüzü bileşenleri

import { EventEmitter } from '../utils/EventEmitter.js';
import { CONFIG } from '../utils/Config.js';
import { createElement, removeElement, logger } from '../utils/Utils.js';

/**
 * UI Manager - Tüm kullanıcı arayüzü bileşenlerini yönetir
 */
export class UIManager extends EventEmitter {
    constructor() {
        super();
        
        this.elements = new Map();
        this.notifications = new Set();
        this.modals = new Set();
        
        // Command categories for rotation
        this.commandCategories = [
            {
                title: "🚶 Hareket",
                commands: [
                    "!sağ - Sağa git",
                    "!sol - Sola git",
                    "!yukarı - Yukarı git",
                    "!aşağı - Aşağı git"
                ]
            },
            {
                title: "💃 Animasyon",
                commands: [
                    "!dans - Dans et",
                    "!zıpla - Zıpla",
                    "!döndür - Dön",
                    "!karakter - Karakter değiştir"
                ]
            },
            {
                title: "🎬 Temel Efektler",
                commands: [
                    "!patlama - Mega patlama",
                    "!yıldırım - Şimşek çakması",
                    "!kar - Kar yağışı",
                    "!ateş - Ateş çemberi",
                    "!konfeti - Konfeti patlaması",
                    "!kalp - Kalp yağmuru",
                    "!rainbow - Gökkuşağı",
                    "!shake - Ekran sarsıntısı"
                ]
            },
            {
                title: "⚡ Gelişmiş Efektler",
                commands: [
                    "!lazer - Lazer gösterisi",
                    "!meteor - Meteor yağmuru",
                    "!matrix - Matrix efekti",
                    "!portal - Portal açma",
                    "!galaksi - Galaksi döndürme",
                    "!tsunami - Tsunami dalgası"
                ]
            },
            {
                title: "🎵 Ses Efektleri",
                commands: [
                    "!bas - Bass drop",
                    "!davul - Davul çalma",
                    "!gitar - Gitar riffi",
                    "!synth - Synthesizer"
                ]
            },
            {
                title: "🎮 OYUN KOMUTLARI",
                commands: [
                    "!oyun - Parkur oyununu başlat",
                    "!ben - Oyuna katıl",
                    "!kapat - Oyunu kapat",
                    "!sol - Oyunda sola hareket",
                    "!sag - Oyunda sağa hareket",
                    "!yukari - Oyunda zıpla"
                ]
            }
        ];
        
        this.currentCategoryIndex = 0;
        this.rotationInterval = null;
        
        this.initializeElements();
        
        logger.info('UIManager initialized');
    }

    /**
     * UI elementlerini başlat
     */
    initializeElements() {
        // Brand header
        this.elements.set('brandHeader', document.querySelector('.brand-header'));
        
        // Connection status
        this.elements.set('connectionStatus', document.getElementById('connectionStatus'));
        
        // User count
        this.elements.set('userCountDisplay', document.getElementById('userCountDisplay'));
        this.elements.set('activeAvatars', document.getElementById('activeAvatars'));
        
        // Commands help
        this.elements.set('commandsHelp', document.querySelector('.commands-help'));
        
        // Stats display
        this.elements.set('statsDisplay', document.getElementById('statsDisplay'));
        
        // Loading screen
        this.elements.set('loadingScreen', document.getElementById('loadingScreen'));

        // Command rotation elements
        this.categoryTitle = document.getElementById('categoryTitle');
        this.commandList = document.getElementById('commandList');
        
        // Start command rotation
        this.startCommandRotation();
    }

    /**
     * Komut kategorilerini döndürmeye başla
     */
    startCommandRotation() {
        // İlk kategoriyi göster
        this.updateCommandDisplay();
        
        // 5 saniyede bir değiştir
        this.rotationInterval = setInterval(() => {
            this.currentCategoryIndex = (this.currentCategoryIndex + 1) % this.commandCategories.length;
            this.updateCommandDisplay();
        }, 5000); // 5 saniye
    }

    /**
     * Komut display'ini güncelle
     */
    updateCommandDisplay() {
        const category = this.commandCategories[this.currentCategoryIndex];
        
        if (this.categoryTitle && this.commandList) {
            this.categoryTitle.textContent = category.title;
            this.commandList.innerHTML = category.commands.map(cmd => `<li>${cmd}</li>`).join('');
        }
    }

    /**
     * Element al
     */
    getElement(name) {
        return this.elements.get(name);
    }

    /**
     * Bağlantı durumunu güncelle
     */
    updateConnectionStatus(status, isConnected = false) {
        const element = this.getElement('connectionStatus');
        if (!element) return;
        
        element.textContent = status;
        
        if (isConnected) {
            element.style.borderColor = '#00ff00';
            element.style.boxShadow = '0 0 15px rgba(0,255,0,0.3)';
        } else {
            element.style.borderColor = '#ff0000';
            element.style.boxShadow = '0 0 15px rgba(255,0,0,0.3)';
        }
        
        this.emit('connectionStatusUpdated', { status, isConnected });
    }

    /**
     * Kullanıcı sayısını güncelle
     */
    updateUserCount(count) {
        const activeAvatarsElement = this.getElement('activeAvatars');
        if (activeAvatarsElement) {
            activeAvatarsElement.textContent = count;
        }
        
        this.emit('userCountUpdated', { count });
    }

    /**
     * Kanal adını güncelle
     */
    updateChannelName(channelName) {
        const channelElement = document.getElementById('channelName');
        if (channelElement) {
            channelElement.textContent = channelName;
        }
        
        // Update page title
        document.title = `Eyzaun Multi-User Avatar Chat - ${channelName}`;
        
        this.emit('channelNameUpdated', { channelName });
    }

    /**
     * Loading screen'i göster/gizle
     */
    toggleLoadingScreen(show = false) {
        const element = this.getElement('loadingScreen');
        if (!element) return;
        
        if (show) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
        
        this.emit('loadingScreenToggled', { show });
    }

    /**
     * Mini notification göster
     */
    showNotification(message, type = 'info', duration = CONFIG.UI.NOTIFICATION_DURATION) {
        const notification = createElement('div', 'mini-effect-notification');
        
        if (type === 'success') {
            notification.style.background = 'linear-gradient(45deg, #00ff00, #00bfff)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(45deg, #ff0000, #ff6600)';
        } else if (type === 'warning') {
            notification.style.background = 'linear-gradient(45deg, #ffaa00, #ff6600)';
        }
        
        notification.textContent = message;
        notification.id = `notification_${Date.now()}`;
        
        document.body.appendChild(notification);
        this.notifications.add(notification);

        setTimeout(() => {
            this.removeNotification(notification);
        }, duration);
        
        this.emit('notificationShown', { message, type, duration });
        
        return notification;
    }

    /**
     * Notification kaldır
     */
    removeNotification(notification) {
        if (this.notifications.has(notification)) {
            removeElement(notification);
            this.notifications.delete(notification);
        }
    }

    /**
     * Tüm notification'ları temizle
     */
    clearNotifications() {
        this.notifications.forEach(notification => {
            removeElement(notification);
        });
        this.notifications.clear();
    }

    /**
     * Modal dialog oluştur
     */
    createModal(title, content, buttons = []) {
        const modalOverlay = createElement('div', 'modal-overlay');
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: ${CONFIG.UI.Z_INDICES.LOADING_SCREEN + 1};
            backdrop-filter: blur(5px);
        `;

        const modal = createElement('div', 'modal');
        modal.style.cssText = `
            background: rgba(0,0,0,0.95);
            border: 2px solid #ff69b4;
            border-radius: 20px;
            padding: 30px;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            color: white;
            font-family: Arial, sans-serif;
        `;

        // Title
        if (title) {
            const titleElement = createElement('h2');
            titleElement.textContent = title;
            titleElement.style.cssText = `
                color: #ff69b4;
                margin-bottom: 20px;
                text-align: center;
                font-size: 18px;
            `;
            modal.appendChild(titleElement);
        }

        // Content
        if (typeof content === 'string') {
            const contentElement = createElement('div');
            contentElement.innerHTML = content;
            contentElement.style.cssText = `
                margin-bottom: 20px;
                line-height: 1.4;
                font-size: 14px;
            `;
            modal.appendChild(contentElement);
        } else if (content instanceof HTMLElement) {
            modal.appendChild(content);
        }

        // Buttons
        if (buttons.length > 0) {
            const buttonContainer = createElement('div');
            buttonContainer.style.cssText = `
                display: flex;
                justify-content: center;
                gap: 10px;
                margin-top: 20px;
            `;

            buttons.forEach(buttonConfig => {
                const button = createElement('button');
                button.textContent = buttonConfig.text;
                button.style.cssText = `
                    background: #333;
                    color: ${buttonConfig.color || '#00ff00'};
                    border: 1px solid ${buttonConfig.color || '#00ff00'};
                    padding: 8px 16px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-family: inherit;
                    font-size: 12px;
                `;

                button.addEventListener('click', () => {
                    if (buttonConfig.callback) {
                        buttonConfig.callback();
                    }
                    this.closeModal(modalOverlay);
                });

                buttonContainer.appendChild(button);
            });

            modal.appendChild(buttonContainer);
        }

        // Close on overlay click
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                this.closeModal(modalOverlay);
            }
        });

        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                this.closeModal(modalOverlay);
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        modalOverlay.appendChild(modal);
        document.body.appendChild(modalOverlay);
        this.modals.add(modalOverlay);

        this.emit('modalOpened', { title, content, buttons });

        return modalOverlay;
    }

    /**
     * Modal'ı kapat
     */
    closeModal(modal) {
        if (this.modals.has(modal)) {
            removeElement(modal);
            this.modals.delete(modal);
            this.emit('modalClosed', { modal });
        }
    }

    /**
     * Tüm modal'ları kapat
     */
    closeAllModals() {
        this.modals.forEach(modal => {
            removeElement(modal);
        });
        this.modals.clear();
    }

    /**
     * Tooltip göster
     */
    showTooltip(element, text, position = 'top') {
        const tooltip = createElement('div', 'tooltip-popup');
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 12px;
            white-space: nowrap;
            z-index: ${CONFIG.UI.Z_INDICES.NOTIFICATIONS};
            pointer-events: none;
            border: 1px solid #ff69b4;
        `;

        document.body.appendChild(tooltip);

        const elementRect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        let x, y;

        switch (position) {
            case 'top':
                x = elementRect.left + (elementRect.width - tooltipRect.width) / 2;
                y = elementRect.top - tooltipRect.height - 8;
                break;
            case 'bottom':
                x = elementRect.left + (elementRect.width - tooltipRect.width) / 2;
                y = elementRect.bottom + 8;
                break;
            case 'left':
                x = elementRect.left - tooltipRect.width - 8;
                y = elementRect.top + (elementRect.height - tooltipRect.height) / 2;
                break;
            case 'right':
                x = elementRect.right + 8;
                y = elementRect.top + (elementRect.height - tooltipRect.height) / 2;
                break;
            default:
                x = elementRect.left;
                y = elementRect.top - tooltipRect.height - 8;
        }

        tooltip.style.left = Math.max(5, Math.min(window.innerWidth - tooltipRect.width - 5, x)) + 'px';
        tooltip.style.top = Math.max(5, Math.min(window.innerHeight - tooltipRect.height - 5, y)) + 'px';

        return tooltip;
    }

    /**
     * Progress bar oluştur
     */
    createProgressBar(container, options = {}) {
        const defaults = {
            width: '100%',
            height: '8px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            progressColor: 'linear-gradient(90deg, #ff69b4, #00ff00)',
            borderRadius: '4px',
            animated: true
        };

        const opts = { ...defaults, ...options };

        const progressBar = createElement('div', 'progress-bar');
        progressBar.style.cssText = `
            width: ${opts.width};
            height: ${opts.height};
            background: ${opts.backgroundColor};
            border-radius: ${opts.borderRadius};
            overflow: hidden;
            position: relative;
        `;

        const progressFill = createElement('div', 'progress-fill');
        progressFill.style.cssText = `
            height: 100%;
            background: ${opts.progressColor};
            border-radius: ${opts.borderRadius};
            width: 0%;
            transition: width 0.3s ease;
            ${opts.animated ? 'animation: gradientShift 2s ease infinite;' : ''}
        `;

        progressBar.appendChild(progressFill);

        if (container instanceof HTMLElement) {
            container.appendChild(progressBar);
        }

        return {
            element: progressBar,
            setProgress: (percentage) => {
                progressFill.style.width = Math.max(0, Math.min(100, percentage)) + '%';
            },
            destroy: () => {
                removeElement(progressBar);
            }
        };
    }

    /**
     * Context menu oluştur
     */
    createContextMenu(x, y, items) {
        // Remove existing context menu
        this.removeContextMenu();

        const contextMenu = createElement('div', 'context-menu');
        contextMenu.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            background: rgba(0,0,0,0.95);
            border: 2px solid #ff69b4;
            border-radius: 8px;
            padding: 5px 0;
            min-width: 150px;
            z-index: ${CONFIG.UI.Z_INDICES.NOTIFICATIONS + 1};
            backdrop-filter: blur(10px);
        `;

        items.forEach((item, index) => {
            if (item.separator) {
                const separator = createElement('div');
                separator.style.cssText = `
                    height: 1px;
                    background: rgba(255,255,255,0.2);
                    margin: 5px 10px;
                `;
                contextMenu.appendChild(separator);
            } else {
                const menuItem = createElement('div', 'context-menu-item');
                menuItem.textContent = item.text;
                menuItem.style.cssText = `
                    padding: 8px 15px;
                    color: white;
                    cursor: pointer;
                    font-size: 12px;
                    ${item.disabled ? 'opacity: 0.5; cursor: not-allowed;' : ''}
                `;

                if (!item.disabled) {
                    menuItem.addEventListener('mouseenter', () => {
                        menuItem.style.background = 'rgba(255,105,180,0.3)';
                    });

                    menuItem.addEventListener('mouseleave', () => {
                        menuItem.style.background = 'transparent';
                    });

                    menuItem.addEventListener('click', () => {
                        if (item.callback) {
                            item.callback();
                        }
                        this.removeContextMenu();
                    });
                }

                contextMenu.appendChild(menuItem);
            }
        });

        document.body.appendChild(contextMenu);

        // Close on outside click
        const handleOutsideClick = (e) => {
            if (!contextMenu.contains(e.target)) {
                this.removeContextMenu();
                document.removeEventListener('click', handleOutsideClick);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
        }, 0);

        // Adjust position if outside viewport
        const rect = contextMenu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            contextMenu.style.left = (x - rect.width) + 'px';
        }
        if (rect.bottom > window.innerHeight) {
            contextMenu.style.top = (y - rect.height) + 'px';
        }

        this.currentContextMenu = contextMenu;
        return contextMenu;
    }

    /**
     * Context menu kaldır
     */
    removeContextMenu() {
        if (this.currentContextMenu) {
            removeElement(this.currentContextMenu);
            this.currentContextMenu = null;
        }
    }

    /**
     * Floating action button oluştur
     */
    createFloatingActionButton(options = {}) {
        const defaults = {
            position: 'bottom-right',
            icon: '⚙️',
            tooltip: 'Settings',
            color: '#ff69b4'
        };

        const opts = { ...defaults, ...options };

        const fab = createElement('div', 'floating-action-button');
        fab.innerHTML = opts.icon;
        
        const positions = {
            'bottom-right': { bottom: '20px', right: '20px' },
            'bottom-left': { bottom: '20px', left: '20px' },
            'top-right': { top: '20px', right: '20px' },
            'top-left': { top: '20px', left: '20px' }
        };

        const pos = positions[opts.position] || positions['bottom-right'];

        fab.style.cssText = `
            position: fixed;
            ${Object.entries(pos).map(([key, value]) => `${key}: ${value}`).join('; ')};
            width: 56px;
            height: 56px;
            background: ${opts.color};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            z-index: ${CONFIG.UI.Z_INDICES.UI_COMPONENTS};
            user-select: none;
        `;

        fab.addEventListener('mouseenter', () => {
            fab.style.transform = 'scale(1.1)';
            fab.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
        });

        fab.addEventListener('mouseleave', () => {
            fab.style.transform = 'scale(1)';
            fab.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        });

        if (opts.tooltip) {
            fab.addEventListener('mouseenter', () => {
                this.showTooltip(fab, opts.tooltip, 'left');
            });

            fab.addEventListener('mouseleave', () => {
                const tooltip = document.querySelector('.tooltip-popup');
                if (tooltip) removeElement(tooltip);
            });
        }

        if (opts.onClick) {
            fab.addEventListener('click', opts.onClick);
        }

        document.body.appendChild(fab);
        return fab;
    }

    /**
     * Snackbar mesaj göster
     */
    showSnackbar(message, action = null, duration = 4000) {
        const snackbar = createElement('div', 'snackbar');
        snackbar.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 14px;
            z-index: ${CONFIG.UI.Z_INDICES.NOTIFICATIONS};
            display: flex;
            align-items: center;
            gap: 15px;
            border: 1px solid #ff69b4;
            backdrop-filter: blur(10px);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;

        const messageElement = createElement('span');
        messageElement.textContent = message;
        snackbar.appendChild(messageElement);

        if (action) {
            const actionButton = createElement('button');
            actionButton.textContent = action.text;
            actionButton.style.cssText = `
                background: transparent;
                color: #00ff00;
                border: 1px solid #00ff00;
                padding: 4px 12px;
                border-radius: 15px;
                cursor: pointer;
                font-size: 12px;
                font-family: inherit;
            `;

            actionButton.addEventListener('click', () => {
                if (action.callback) action.callback();
                this.removeSnackbar(snackbar);
            });

            snackbar.appendChild(actionButton);
        }

        document.body.appendChild(snackbar);

        // Animate in
        requestAnimationFrame(() => {
            snackbar.style.transform = 'translateX(-50%) translateY(0)';
        });

        // Auto remove
        setTimeout(() => {
            this.removeSnackbar(snackbar);
        }, duration);

        return snackbar;
    }

    /**
     * Snackbar kaldır
     */
    removeSnackbar(snackbar) {
        snackbar.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => {
            removeElement(snackbar);
        }, 300);
    }

    /**
     * UI elementlerini gizle/göster
     */
    toggleUIVisibility(visible = true) {
        const elements = ['brandHeader', 'connectionStatus', 'userCountDisplay', 'commandsHelp', 'statsDisplay'];
        
        elements.forEach(elementName => {
            const element = this.getElement(elementName);
            if (element) {
                element.style.display = visible ? 'block' : 'none';
            }
        });

        this.emit('uiVisibilityToggled', { visible });
    }

    /**
     * UI istatistikleri
     */
    getStats() {
        return {
            activeNotifications: this.notifications.size,
            activeModals: this.modals.size,
            elementsTracked: this.elements.size,
            contextMenuActive: !!this.currentContextMenu
        };
    }

    /**
     * Cleanup ve kapatma
     */
    destroy() {
        // Clear rotation interval
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
            this.rotationInterval = null;
        }
        
        // Clear notifications
        this.clearNotifications();

        // Close modals
        this.closeAllModals();

        // Remove context menu
        this.removeContextMenu();

        // Clear elements
        this.elements.clear();

        // Remove event listeners
        this.removeAllListeners();

        logger.info('UIManager destroyed');
    }
}

export default UIManager;