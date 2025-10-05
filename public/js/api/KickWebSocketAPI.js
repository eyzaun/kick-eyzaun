// public/js/api/KickWebSocketAPI.js - Kick WebSocket API wrapper

import { EventEmitter } from '../utils/EventEmitter.js';
import { CONFIG, USER_TYPES, BADGE_TYPES } from '../utils/Config.js';
import { logger } from '../utils/Utils.js';

/**
 * Kick WebSocket API sınıfı
 */
export class KickWebSocketAPI extends EventEmitter {
    constructor(channelName = CONFIG.KICK.DEFAULT_CHANNEL) {
        super();
        
        this.channelName = channelName;
        this.chatroomId = null;
        this.channelId = null;
        this.websocket = null;
        this.isConnected = false;
        this.isSubscribed = false;
        
        // Reconnection
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = CONFIG.WEBSOCKET.MAX_RECONNECT_ATTEMPTS;
        this.reconnectDelay = CONFIG.WEBSOCKET.RECONNECT_DELAY;
        
        // Heartbeat
        this.heartbeatInterval = null;
        this.lastPong = Date.now();
        
        // Message cache (duplicate prevention)
        this.messageCache = new Set();
        this.maxCacheSize = CONFIG.WEBSOCKET.MESSAGE_CACHE_SIZE;
        
        // Connection state
        this.connectionState = 'disconnected';
        
        // URLs
        this.baseUrl = CONFIG.KICK.BASE_URL;
        this.wsUrl = this.buildWebSocketUrl();
        
        this.setMaxListeners(20);
    }

    /**
     * WebSocket URL oluştur
     */
    buildWebSocketUrl() {
        const params = new URLSearchParams({
            protocol: CONFIG.KICK.PROTOCOL_VERSION,
            client: 'js',
            version: '7.6.0',
            flash: 'false'
        });

        return `wss://ws-${CONFIG.KICK.PUSHER_CLUSTER}.pusher.com/app/${CONFIG.KICK.PUSHER_APP_KEY}?${params}`;
    }

    /**
     * Ana bağlantı metodu
     */
    async connect() {
        try {
            this.setConnectionState('connecting');
            
            logger.websocket(`Connecting to channel: ${this.channelName}`);
            
            // Kanal bilgilerini al
            await this.fetchChannelInfo();
            
            // WebSocket bağlantısı kur
            await this.connectWebSocket();
            
            return true;
        } catch (error) {
            logger.error(`Failed to connect to ${this.channelName}:`, error);
            this.setConnectionState('error');
            this.scheduleReconnect();
            throw error;
        }
    }

    /**
     * Kanal bilgilerini API'dan al
     */
    async fetchChannelInfo() {
        try {
            logger.websocket(`Fetching channel info for: ${this.channelName}`);
            
            const response = await fetch(`${this.baseUrl}/v1/channels/${this.channelName}`, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            if (!response.ok) {
                throw new Error(`Channel ${this.channelName} not found (${response.status})`);
            }

            const channelData = await response.json();
            
            this.channelId = channelData.id;
            this.chatroomId = channelData.chatroom?.id;

            if (!this.chatroomId) {
                throw new Error(`No chatroom found for channel ${this.channelName}`);
            }

            logger.websocket(`Channel ID: ${this.channelId}, Chatroom ID: ${this.chatroomId}`);
            
            this.emit('channelInfoReceived', {
                channelId: this.channelId,
                chatroomId: this.chatroomId,
                channelData: channelData
            });
            
            return true;
            
        } catch (error) {
            logger.error(`Failed to get channel info:`, error);
            throw error;
        }
    }

    /**
     * WebSocket bağlantısı kur
     */
    async connectWebSocket() {
        return new Promise((resolve, reject) => {
            try {
                logger.websocket(`Connecting to WebSocket: ${this.wsUrl}`);
                
                this.websocket = new WebSocket(this.wsUrl);
                
                this.websocket.onopen = () => {
                    logger.websocket(`WebSocket connected successfully`);
                    this.setConnectionState('connected');
                    this.isConnected = true;
                    this.reconnectAttempts = 0;
                    
                    this.emit('connected');
                    resolve();
                };

                this.websocket.onmessage = (event) => {
                    this.handleWebSocketMessage(event.data);
                };

                this.websocket.onclose = (event) => {
                    logger.warn(`WebSocket closed: ${event.code} - ${event.reason}`);
                    this.setConnectionState('disconnected');
                    this.isConnected = false;
                    this.isSubscribed = false;
                    this.stopHeartbeat();
                    
                    this.emit('disconnected', { code: event.code, reason: event.reason });
                    
                    // Normal kapatma değilse yeniden bağlan
                    if (event.code !== 1000) {
                        this.scheduleReconnect();
                    }
                };

                this.websocket.onerror = (error) => {
                    logger.error(`WebSocket error:`, error);
                    this.setConnectionState('error');
                    reject(error);
                };

                // Timeout
                setTimeout(() => {
                    if (this.websocket.readyState !== WebSocket.OPEN) {
                        this.websocket.close();
                        reject(new Error('WebSocket connection timeout'));
                    }
                }, 10000);

            } catch (error) {
                logger.error(`Failed to create WebSocket connection:`, error);
                reject(error);
            }
        });
    }

    /**
     * Chatroom'a subscribe ol
     */
    subscribeToChatroom() {
        if (!this.websocket || !this.chatroomId) {
            logger.error(`Cannot subscribe: WebSocket or chatroom ID missing`);
            return;
        }

        const subscribeFormats = [
            `chatrooms.${this.chatroomId}.v2`,
            `chatrooms.${this.chatroomId}`,
        ];
        
        subscribeFormats.forEach(format => {
            const subscribeMessage = {
                event: 'pusher:subscribe',
                data: {
                    channel: format
                }
            };

            logger.websocket(`Subscribing to: ${format}`);
            this.websocket.send(JSON.stringify(subscribeMessage));
        });
    }

    /**
     * WebSocket mesajlarını işle
     */
    handleWebSocketMessage(data) {
        try {
            const message = JSON.parse(data);
            
            logger.websocket(`Received message:`, message);
            
            switch (message.event) {
                case 'pusher:connection_established':
                    this.handleConnectionEstablished(message);
                    break;

                case 'pusher:subscription_succeeded':
                case 'pusher_internal:subscription_succeeded':
                    this.handleSubscriptionSucceeded(message);
                    break;

                case 'pusher:ping':
                    this.handlePing();
                    break;

                case 'pusher:pong':
                    this.handlePong();
                    break;

                case 'App\\Events\\ChatMessageEvent':
                    this.handleChatMessage(message);
                    break;

                case 'pusher:error':
                    this.handlePusherError(message);
                    break;

                default:
                    this.emit('rawMessage', message);
                    break;
            }

        } catch (error) {
            logger.error(`Failed to parse WebSocket message:`, error, data);
        }
    }

    /**
     * Pusher connection established
     */
    handleConnectionEstablished(message) {
        logger.websocket(`Pusher connection established`);
        this.emit('pusherConnected', message.data);
        this.subscribeToChatroom();
        this.startHeartbeat();
    }

    /**
     * Subscription succeeded
     */
    handleSubscriptionSucceeded(message) {
        logger.websocket(`Subscription succeeded for channel:`, message.channel);
        this.isSubscribed = true;
        this.setConnectionState('subscribed');
        this.emit('subscribed', { channel: message.channel });
    }

    /**
     * Ping mesajını işle
     */
    handlePing() {
        const pongMessage = {
            event: 'pusher:pong',
            data: {}
        };
        this.websocket.send(JSON.stringify(pongMessage));
        logger.websocket(`Ping received, pong sent`);
    }

    /**
     * Pong mesajını işle
     */
    handlePong() {
        this.lastPong = Date.now();
        logger.websocket(`Pong received`);
    }

    /**
     * Chat mesajını işle
     */
    handleChatMessage(pusherMessage) {
        try {
            const messageData = typeof pusherMessage.data === 'string' 
                ? JSON.parse(pusherMessage.data) 
                : pusherMessage.data;

            // Duplicate check
            const messageId = messageData.id;
            if (this.messageCache.has(messageId)) {
                return;
            }

            // Cache management
            this.messageCache.add(messageId);
            if (this.messageCache.size > this.maxCacheSize) {
                const firstItem = this.messageCache.values().next().value;
                this.messageCache.delete(firstItem);
            }

            // Parse chat message
            const chatMessage = this.parseChatMessage(messageData);
            
            if (chatMessage && chatMessage.message && chatMessage.message.trim()) {
                logger.websocket(`Chat message from ${chatMessage.username}: ${chatMessage.message}`);
                
                this.emit('message', chatMessage);

                // Command detection
                if (chatMessage.message.startsWith('!')) {
                    this.handleCommand(chatMessage);
                }
            }

        } catch (error) {
            logger.error(`Failed to handle chat message:`, error, pusherMessage);
        }
    }

    /**
     * Chat mesajını parse et
     */
    parseChatMessage(messageData) {
        try {
            return {
                id: messageData.id,
                username: messageData.sender?.username || 'Unknown',
                message: messageData.content || '',
                timestamp: new Date(messageData.created_at),
                userId: messageData.sender?.id || 0,
                userColor: messageData.sender?.identity?.color || '#ffffff',
                badges: messageData.sender?.identity?.badges || [],
                chatroomId: messageData.chatroom_id,
                userType: this.getUserType(messageData.sender?.identity?.badges || []),
                raw: messageData
            };
        } catch (error) {
            logger.error(`Error parsing chat message:`, error, messageData);
            return null;
        }
    }

    /**
     * Kullanıcı tipini badge'lerden belirle
     */
    getUserType(badges) {
        if (badges.some(badge => badge.type === BADGE_TYPES.BROADCASTER)) {
            return USER_TYPES.BROADCASTER;
        }
        if (badges.some(badge => badge.type === BADGE_TYPES.MODERATOR)) {
            return USER_TYPES.MODERATOR;
        }
        if (badges.some(badge => badge.type === BADGE_TYPES.VIP)) {
            return USER_TYPES.VIP;
        }
        return USER_TYPES.VIEWER;
    }

    /**
     * Komut işle
     */
    handleCommand(chatMessage) {
        const parts = chatMessage.message.trim().split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        const commandData = {
            command: command,
            args: args,
            user: chatMessage.username,
            userId: chatMessage.userId,
            userType: chatMessage.userType,
            fullMessage: chatMessage.message,
            timestamp: chatMessage.timestamp,
            userColor: chatMessage.userColor,
            badges: chatMessage.badges,
            raw: chatMessage.raw
        };

        logger.command(`Command detected: ${command} by ${chatMessage.username}`);
        this.emit('command', commandData);
    }

    /**
     * Pusher error işle
     */
    handlePusherError(message) {
        logger.error(`Pusher error:`, message.data);
        this.emit('pusherError', message.data);
    }

    /**
     * Heartbeat başlat
     */
    startHeartbeat() {
        this.stopHeartbeat();
        
        this.heartbeatInterval = setInterval(() => {
            if (this.websocket && this.isConnected) {
                // Pong timeout kontrolü
                if (Date.now() - this.lastPong > CONFIG.WEBSOCKET.HEARTBEAT_TIMEOUT) {
                    logger.warn(`Heartbeat timeout, reconnecting...`);
                    this.websocket.close();
                    return;
                }

                // Ping gönder
                const pingMessage = {
                    event: 'pusher:ping',
                    data: {}
                };
                
                this.websocket.send(JSON.stringify(pingMessage));
                logger.websocket(`Heartbeat ping sent`);
            }
        }, CONFIG.WEBSOCKET.HEARTBEAT_INTERVAL);
    }

    /**
     * Heartbeat durdur
     */
    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    /**
     * Yeniden bağlanmayı planla
     */
    scheduleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            logger.error(`Max reconnection attempts reached (${this.maxReconnectAttempts})`);
            this.setConnectionState('failed');
            this.emit('connectionFailed', new Error('Max reconnection attempts reached'));
            return;
        }

        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        
        logger.websocket(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);
        this.setConnectionState('reconnecting');
        
        setTimeout(() => {
            if (!this.isConnected) {
                logger.websocket(`Reconnect attempt ${this.reconnectAttempts}`);
                this.connect().catch(error => {
                    logger.error(`Reconnect attempt ${this.reconnectAttempts} failed:`, error);
                });
            }
        }, delay);
    }

    /**
     * Bağlantı durumunu güncelle
     */
    setConnectionState(state) {
        if (this.connectionState !== state) {
            const previousState = this.connectionState;
            this.connectionState = state;

            logger.websocket(`Connection state changed: ${previousState} -> ${state}`);
            console.log(`🔄 Connection State Update:`, {
                from: previousState,
                to: state,
                isConnected: this.isConnected,
                isSubscribed: this.isSubscribed,
                websocketState: this.websocket ? this.websocket.readyState : 'NO_WEBSOCKET',
                timestamp: new Date().toISOString()
            });

            this.emit('connectionStateChanged', { previous: previousState, current: state });
        }
    }

    /**
     * Bağlantıyı kapat
     */
    disconnect() {
        logger.websocket(`Disconnecting WebSocket`);
        
        this.stopHeartbeat();
        
        if (this.websocket) {
            this.websocket.close(1000, 'Normal closure');
        }
        
        this.isConnected = false;
        this.isSubscribed = false;
        this.messageCache.clear();
        this.setConnectionState('disconnected');
        
        this.emit('disconnected', { code: 1000, reason: 'Normal closure' });
    }

    /**
     * Test mesajı gönder
     */
    sendTestMessage(message) {
        if (this.websocket && this.isConnected) {
            this.websocket.send(JSON.stringify(message));
            logger.websocket(`Test message sent:`, message);
            return true;
        }
        return false;
    }

    /**
     * Bağlantı durumu al
     */
    getConnectionInfo() {
        return {
            channelName: this.channelName,
            channelId: this.channelId,
            chatroomId: this.chatroomId,
            isConnected: this.isConnected,
            isSubscribed: this.isSubscribed,
            connectionState: this.connectionState,
            reconnectAttempts: this.reconnectAttempts,
            lastPong: this.lastPong,
            cacheSize: this.messageCache.size
        };
    }

    /**
     * İstatistikler al
     */
    getStats() {
        const wsState = this.websocket ? this.websocket.readyState : WebSocket.CLOSED;
        const wsStates = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
        
        return {
            ...this.getConnectionInfo(),
            websocketState: wsStates[wsState],
            eventListenerCount: this.getStats ? Object.keys(this.getStats()).length : 0,
            uptime: Date.now() - this.lastPong
        };
    }
}

export default KickWebSocketAPI;