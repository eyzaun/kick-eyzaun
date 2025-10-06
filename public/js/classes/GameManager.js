// public/js/classes/GameManager.js - Oyun yönetim sistemi

import { EventEmitter } from '../utils/EventEmitter.js';
import { logger } from '../utils/Utils.js';
import { GameUI } from '../game/GameUI.js';
import { ParticleSystem } from '../game/ParticleSystem.js';
import { CommandProcessor } from '../game/CommandProcessor.js';
import { PhysicsEngine } from '../game/PhysicsEngine.js';
import { GameRenderer } from '../game/GameRenderer.js';
import { buildDefaultMaps } from '../game/MapLibrary.js';
import { GAME_CONSTANTS } from '../game/GameConstants.js';

/**
 * GameManager - Çok oyunculu parkur oyunu sistemi
 */
export class GameManager extends EventEmitter {
    constructor({ ui, particles, commands, renderer, physics } = {}) {
        super();

        // Oyun durumu
        this.isActive = false;
        this.isWaitingForPlayers = false;
        this.isGameRunning = false;

        this.players = new Map(); // userId -> player data
        this.trails = new Map();

        // Zamanlayıcılar
        this.gameStartTime = null;
        this.gameEndTime = null;
    this.gameDuration = GAME_CONSTANTS.GAME.DURATION_MS;
    this.maxPlayers = GAME_CONSTANTS.GAME.MAX_PLAYERS;
    this.minPlayers = GAME_CONSTANTS.GAME.MIN_PLAYERS;

        // Oyun alanı boyutları
    this.gameWidth = GAME_CONSTANTS.GAME.WIDTH;
    this.gameHeight = GAME_CONSTANTS.GAME.HEIGHT;
    this.playerRadius = GAME_CONSTANTS.GAME.PLAYER_RADIUS;
    this.doubleJumpMultiplier = GAME_CONSTANTS.GAME.DOUBLE_JUMP_MULTIPLIER;

        // Oyun döngüsü
        this.gameLoop = null;
        this.lastFrameTime = 0;

        // Yardımcı sınıflar
        this.ui = ui ?? new GameUI();
        this.particleSystem = particles ?? new ParticleSystem();
        this.commandProcessor = commands ?? new CommandProcessor();
        this.renderer = renderer ?? new GameRenderer({
            gameWidth: this.gameWidth,
            gameHeight: this.gameHeight,
            playerRadius: this.playerRadius
        });
        this.physicsEngine = physics ?? new PhysicsEngine({
            gameWidth: this.gameWidth,
            gameHeight: this.gameHeight,
            playerRadius: this.playerRadius,
            doubleJumpMultiplier: this.doubleJumpMultiplier,
            particleSystem: this.particleSystem,
            onTrailUpdate: (player) => this.updatePlayerTrail(player),
            onPlayerFinished: (player) => this.handlePlayerFinished(player),
            onPlayerEliminated: (player) => this.handlePlayerEliminated(player)
        });

        this.ctx = null;

        // Harita sistemi
        this.maps = buildDefaultMaps(this.gameWidth, this.gameHeight);
        this.selectedMap = null;
        this.mapSelectionMode = false;

        logger.game('GameManager initialized with modular architecture');
    }

    /**
     * Oyunu başlat - !oyun komutu
     */
    async startGame() {
        if (this.isActive) {
            return { success: false, message: 'Oyun zaten aktif!' };
        }

        try {
            // Oyun durumunu ayarla
            this.isActive = true;
            this.mapSelectionMode = true;
            this.selectedMap = null;
            this.players.clear();
            this.trails.clear();
            this.particleSystem.reset();

            // UI ve context'i başlat
            this.ui.initialize({
                gameWidth: this.gameWidth,
                gameHeight: this.gameHeight,
                maxPlayers: this.maxPlayers
            });
            const { ctx } = this.ui.getContext();
            this.ctx = ctx;

            // Boyutları güncelle
            this.renderer.setDimensions({ gameWidth: this.gameWidth, gameHeight: this.gameHeight });
            this.physicsEngine.updateDimensions({ gameWidth: this.gameWidth, gameHeight: this.gameHeight });

            // UI'yi güncelle
            this.ui.refreshPlayerList(this.players);
            this.ui.updatePlayerCount(0, this.maxPlayers);
            this.ui.showMapSelection();

            this.emit('gameStarted', { mapSelectionMode: true });
            logger.game('Game started - awaiting map selection');

            return {
                success: true,
                message: '🎮 Oyun açıldı! Harita seçin: !1 !2 !3 !4 !5'
            };
        } catch (error) {
            logger.error('Error starting game:', error);
            this.cancelGame();
            return { success: false, message: 'Oyun başlatılırken hata oluştu!' };
        }
    }

    /**
     * Oyunu kapat - !kapat komutu
     */
    async stopGame() {
        if (!this.isActive) {
            return { success: false, message: 'Aktif oyun yok!' };
        }

        try {
            this.endGame();
            return { success: true, message: '🎮 Oyun kapatıldı!' };

        } catch (error) {
            logger.error('Error stopping game:', error);
            return { success: false, message: 'Oyun kapatılırken hata oluştu!' };
        }
    }

    /**
     * Oyunu erken bitir - !bitir komutu
     */
    async forceEndGame() {
        if (!this.isGameRunning) {
            return { success: false, message: 'Bitirilecek aktif oyun yok!' };
        }

        try {
            if (this.gameEndTimer) {
                clearTimeout(this.gameEndTimer);
                this.gameEndTimer = null;
            }

            if (this.gameStartTime) {
                this.gameStartTime = Date.now() - this.gameDuration;
            }

            this.endGame();
            return { success: true, message: '⏱️ Oyun süre dolmuş gibi bitirildi!' };
        } catch (error) {
            logger.error('Error forcing game end:', error);
            return { success: false, message: 'Oyun bitirilirken hata oluştu!' };
        }
    }

    /**
     * Harita seç
     */
    async selectMap(mapId) {
        if (!this.mapSelectionMode || !this.maps[mapId]) {
            return { success: false, message: 'Geçersiz harita seçimi!' };
        }

        this.selectedMap = this.maps[mapId];
        this.mapSelectionMode = false;
        this.isWaitingForPlayers = true;
        this.players.clear();
        this.trails.clear();
        this.particleSystem.reset();

        // UI'yi güncelle
        this.ui.refreshPlayerList(this.players);
        this.ui.updatePlayerCount(0, this.maxPlayers);
        this.ui.showMapSelected(this.selectedMap.name);

        this.emit('mapSelected', { mapId, mapData: this.selectedMap });
        logger.game(`Map ${mapId} selected: ${this.selectedMap.name}`);

        return {
            success: true,
            message: `🗺️ ${this.selectedMap.name} haritası seçildi! Katılmak için !ben yazın.`
        };
    }

    /**
     * Oyuna katıl - !ben komutu
     */
    async joinGame(userId, username, userType) {
        if (!this.isWaitingForPlayers) {
            return { success: false, message: 'Şu anda oyun katılımı açık değil!' };
        }

        if (this.players.has(userId)) {
            return { success: false, message: 'Zaten oyuna katıldınız!' };
        }

        if (this.players.size >= this.maxPlayers) {
            return { success: false, message: `Oyun dolu! (${this.maxPlayers}/${this.maxPlayers})` };
        }

        try {
            // Oyuncu verisini oluştur
            const playerData = this.createPlayerData(userId, username, userType);
            this.players.set(userId, playerData);
            this.trails.set(userId, []);

            // UI'yi güncelle
            this.ui.refreshPlayerList(this.players);
            this.ui.updatePlayerCount(this.players.size, this.maxPlayers);
            this.ui.showLobbyStatus(this.players.size, this.maxPlayers);

            // Katılma efekti
            this.particleSystem.createJoinParticles(playerData.position.x, playerData.position.y, playerData.color);

            this.emit('playerJoined', { playerData });
            logger.game(`${username} joined the game`);

            return {
                success: true,
                message: `${username} oyuna katıldı! (${this.players.size}/${this.maxPlayers})`
            };
        } catch (error) {
            logger.error('Error joining game:', error);
            return { success: false, message: 'Oyuna katılırken hata oluştu!' };
        }
    }

    /**
     * Oyunu manuel başlat - !başla komutu
     */
    async manualStart() {
        if (!this.isWaitingForPlayers) {
            return { success: false, message: 'Şu anda oyun başlatılabilir durumda değil!' };
        }

        if (this.players.size < this.minPlayers) {
            return { success: false, message: `En az ${this.minPlayers} oyuncu gerekli! (${this.players.size}/${this.minPlayers})` };
        }

        try {
            await this.beginGame();
            return { success: true, message: '🚀 Oyun başlatıldı!' };

        } catch (error) {
            logger.error('Error manually starting game:', error);
            return { success: false, message: 'Oyun başlatılırken hata oluştu!' };
        }
    }

    /**
     * Oyunu başlat
     */
    async beginGame() {
        if (!this.isWaitingForPlayers || this.players.size < this.minPlayers) {
            return;
        }

        try {
            this.isWaitingForPlayers = false;
            this.isGameRunning = true;
            this.gameStartTime = Date.now();

            // Oyuncuları başlangıç durumuna getir
            this.players.forEach(player => {
                player.position = { x: 80, y: this.gameHeight - 80 };
                player.velocity = { x: 0, y: 0 };
                player.previousPosition = { x: 80, y: this.gameHeight - 80 };
                player.isAlive = true;
                player.onGround = true;
                player.trail = [];
                player.finishedAt = null;
                player.jumpBuffer = 0;
                player.jumpCount = 0;
                player.hasDoubleJumped = false;
                this.trails.set(player.userId, []);
            });

            this.particleSystem.reset();

            // Timer'ı temizle
            if (this.autoStartTimer) {
                clearTimeout(this.autoStartTimer);
                this.autoStartTimer = null;
            }

            // Başlatma mesajı göster
            this.ui.showGameStart();

            // Oyun döngüsünü başlat
            this.startGameLoop();

            // Oyun bitiş timer'ı
            this.gameEndTimer = setTimeout(() => {
                this.endGame();
            }, this.gameDuration);

            this.emit('gameBegun', {
                playerCount: this.players.size,
                duration: this.gameDuration
            });

            logger.game(`Game begun with ${this.players.size} players`);

        } catch (error) {
            logger.error('Error beginning game:', error);
            this.cancelGame();
        }
    }

    /**
     * Oyunu bitir
     */
    async endGame() {
        if (!this.isActive) {
            return;
        }

        try {
            this.isActive = false;
            this.isWaitingForPlayers = false;
            this.isGameRunning = false;
            this.gameEndTime = Date.now();

            // Oyun döngüsünü durdur
            this.stopGameLoop();

            // Timer'ları temizle
            if (this.gameEndTimer) {
                clearTimeout(this.gameEndTimer);
                this.gameEndTimer = null;
            }

            const finalScores = this.getFinalScores();
            this.ui.showGameResults(finalScores);

            // Temizlik
            setTimeout(() => {
                this.cleanup();
            }, 5000); // 5 saniye sonra temizle

            this.emit('gameEnded', {
                duration: this.gameEndTime - this.gameStartTime,
                finalScores
            });

            logger.game('Game ended');
        } catch (error) {
            logger.error('Error ending game:', error);
            this.cleanup();
        }
    }

    /**
     * Oyunu iptal et
     */
    cancelGame() {
        this.isActive = false;
        this.isWaitingForPlayers = false;
        this.isGameRunning = false;

        // Timer'ları temizle
        if (this.autoStartTimer) {
            clearTimeout(this.autoStartTimer);
            this.autoStartTimer = null;
        }

        if (this.gameEndTimer) {
            clearTimeout(this.gameEndTimer);
            this.gameEndTimer = null;
        }

        this.ui.showCancelMessage();
        this.cleanup();

        this.emit('gameCancelled');
        logger.game('Game cancelled');
    }

    /**
     * Oyuncu hareketini işle
     */
    handlePlayerInput(userId, command) {
        if (!this.isGameRunning || !this.players.has(userId)) {
            return;
        }

        const player = this.players.get(userId);
        if (!player.isAlive) {
            return;
        }

        this.commandProcessor.handle(player, command);
    }

    /**
     * Oyun döngüsünü başlat
     */
    startGameLoop() {
        this.lastFrameTime = performance.now();

        const loop = (currentTime) => {
            if (!this.isGameRunning) {
                return;
            }

            const deltaTime = (currentTime - this.lastFrameTime) / 1000;
            this.lastFrameTime = currentTime;

            // Fizik güncellemesi
            this.physicsEngine.update(this.players, this.selectedMap, deltaTime);

            // Partikülleri güncelle
            this.particleSystem.update(deltaTime);

            // Rendering
            this.renderer.render({
                ctx: this.ctx,
                players: this.players,
                trails: this.trails,
                particleSystem: this.particleSystem,
                map: this.selectedMap,
                isGameRunning: this.isGameRunning,
                gameDuration: this.gameDuration,
                gameStartTime: this.gameStartTime
            });

            // UI güncellemesi
            this.updateGameUI();
            this.gameLoop = requestAnimationFrame(loop);
        };

        this.gameLoop = requestAnimationFrame(loop);
    }

    /**
     * Oyun döngüsünü durdur
     */
    stopGameLoop() {
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
            this.gameLoop = null;
        }
    }

    /**
     * Oyun UI'sini güncelle
     */
    updateGameUI() {
        if (!this.isActive) {
            return;
        }

        if (this.gameStartTime) {
            const timeLeft = Math.max(0, this.gameDuration - (Date.now() - this.gameStartTime));
            this.ui.updateTimer(timeLeft);
        }

        this.ui.updateScores(this.players);
        this.ui.updatePlayerCount(this.players.size, this.maxPlayers);
    }

    /**
     * Oyuncu trail'ini güncelle
     */
    updatePlayerTrail(player) {
        if (!this.trails.has(player.userId)) {
            this.trails.set(player.userId, []);
        }

    const trail = this.trails.get(player.userId);
        trail.push({ x: player.position.x, y: player.position.y });

        // Trail uzunluğunu sınırla
        if (trail.length > 20) {
            trail.shift();
        }
    }

    /**
     * Oyuncu hedefe ulaştığında işlemler
     */
    handlePlayerFinished(player) {
        if (!player.isAlive) {
            return;
        }

        player.score += 100;
        player.isAlive = false;
        player.finishedAt = Date.now();

        // Kazanma partikülleri oluştur
        this.particleSystem.createWinParticles(player.position.x, player.position.y);
        this.ui.updateScores(this.players);

        this.emit('playerFinished', { player });
        logger.game(`${player.username} reached the goal!`);
    }

    /**
     * Oyuncu elendiğinde işlemler
     */
    handlePlayerEliminated(player) {
        this.emit('playerEliminated', { player, reason: 'fell' });
        logger.game(`${player.username} was eliminated`);
        this.ui.updateScores(this.players);
    }

    /**
     * Yeni oyuncu verisi oluştur
     */
    createPlayerData(userId, username, userType) {
        return this.buildPlayer(userId, username, userType);
    }

    /**
     * Oyuncu rengini al
     */
    getPlayerColor(index) {
        return GAME_CONSTANTS.COLORS[index % GAME_CONSTANTS.COLORS.length];
    }

    /**
     * Yeni oyuncu objesi oluştur (KISS/DRY)
     */
    buildPlayer(userId, username, userType) {
        const startX = 100;
        const startY = this.gameHeight - 100;
        return {
            userId,
            username,
            userType,
            joinedAt: Date.now(),
            score: 0,
            position: { x: startX, y: startY },
            previousPosition: { x: startX, y: startY },
            velocity: { x: 0, y: 0 },
            isAlive: true,
            onGround: true,
            keys: { left: false, right: false, up: false, down: false, diagonalLeft: false, diagonalRight: false },
            color: this.getPlayerColor(this.players.size),
            trail: [],
            commandQueue: [],
            lastCommandTime: 0,
            jumpBuffer: 0,
            jumpCount: 0,
            hasDoubleJumped: false
        };
    }

    /**
     * Oyun kaynaklarını temizle
     */
    cleanup() {
        this.stopGameLoop();

        if (this.gameEndTimer) {
            clearTimeout(this.gameEndTimer);
            this.gameEndTimer = null;
        }

        if (this.autoStartTimer) {
            clearTimeout(this.autoStartTimer);
            this.autoStartTimer = null;
        }

        this.players.clear();
        this.trails.clear();
        this.particleSystem.reset();

        this.isActive = false;
        this.isWaitingForPlayers = false;
        this.isGameRunning = false;
        this.mapSelectionMode = false;
        this.selectedMap = null;

        this.gameStartTime = null;
        this.gameEndTime = null;

        this.ui.destroy();
        this.ctx = null;
    }

    /**
     * Final skorlarını sırala
     */
    getFinalScores() {
        return Array.from(this.players.values())
            .map(player => ({
                userId: player.userId,
                username: player.username,
                score: player.score,
                finishedAt: player.finishedAt ?? Infinity,
                joinedAt: player.joinedAt ?? 0
            }))
            .sort((a, b) => {
                if (b.score !== a.score) {
                    return b.score - a.score;
                }
                if (a.finishedAt !== b.finishedAt) {
                    return a.finishedAt - b.finishedAt;
                }
                return a.joinedAt - b.joinedAt;
            });
    }
}
