import { createElement, removeElement, logger } from '../utils/Utils.js';

export class GameUI {
    constructor() {
        this.container = null;
        this.uiElement = null;
        this.canvas = null;
        this.ctx = null;
        this.timerElement = null;
    }

    initialize({ gameWidth, gameHeight, maxPlayers }) {
        if (this.container) {
            removeElement(this.container);
        }

        this.container = createElement('div');
        this.container.id = 'gameContainer';
        this.container.className = 'game-container';
        this.container.innerHTML = `
            <div class="game-header">
                <h2>🎮 PARKUR OYUNU</h2>
                <div class="game-info">
                    <span class="game-timer">⏰ 180s</span>
                    <span class="player-count">👥 0/${maxPlayers}</span>
                </div>
            </div>
            <div class="game-canvas-container">
                <canvas id="gameCanvas" width="${gameWidth}" height="${gameHeight}"></canvas>
            </div>
            <div class="game-ui" id="gameUI">
                <div class="game-status">🎮 Oyun açıldı! Katılmak için !ben yazın</div>
                <div class="game-controls">
                    <div class="control-hint">🎯 Hedefe ulaşmak için engelleri aşın!</div>
                    <div class="control-keys">
                        <span>⬅️ !a (sol)</span>
                        <span>➡️ !d (sağ)</span>
                        <span>⬆️ !w (zıpla)</span>
                        <span>↖️ !q (sol çarpraz)</span>
                        <span>↗️ !e (sağ çarpraz)</span>
                    </div>
                    <div class="control-sequence">
                        <small>🔥 Kombinasyon: !dwd (sağ+zıpla+sağ) gibi 2-5 komut ardarda!</small>
                    </div>
                </div>
                <div class="player-list" id="playerList"></div>
            </div>
        `;

        document.body.appendChild(this.container);

        this.canvas = this.container.querySelector('#gameCanvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.uiElement = this.container.querySelector('#gameUI');
        this.timerElement = this.container.querySelector('.game-timer');

        if (!this.canvas || !this.ctx) {
            logger.error('Game canvas could not be initialized', {
                hasCanvas: Boolean(this.canvas),
                hasContext: Boolean(this.ctx)
            });
        }

        if (this.canvas) {
            this.canvas.style.border = '3px solid #333';
            this.canvas.style.borderRadius = '10px';
            this.canvas.style.background = 'linear-gradient(135deg, #87CEEB 0%, #98FB98 100%)';
            this.canvas.style.boxShadow = '0 0 20px rgba(0,0,0,0.3)';
        }
    }

    getContext() {
        return { canvas: this.canvas, ctx: this.ctx };
    }

    destroy() {
        if (this.container) {
            removeElement(this.container);
        }
        this.container = null;
        this.uiElement = null;
        this.canvas = null;
        this.ctx = null;
        this.timerElement = null;
    }

    updatePlayerCount(current, max) {
        if (!this.container) return;
        const countElement = this.container.querySelector('.player-count');
        if (countElement) {
            countElement.textContent = `👥 ${current}/${max}`;
        }
    }

    refreshPlayerList(players) {
        if (!this.uiElement) return;
        const playerList = this.uiElement.querySelector('#playerList');
        if (!playerList) return;

        playerList.innerHTML = '';
        players.forEach(player => {
            const item = createElement('div');
            item.className = 'player-item';
            item.innerHTML = `
                <span class="player-color" style="color: ${player.color};">●</span>
                <span class="player-name">${player.username}</span>
                <span class="player-score" data-userid="${player.userId}">${player.score}</span>
            `;
            playerList.appendChild(item);
        });
    }

    updateScores(players) {
        if (!this.uiElement) return;
        players.forEach(player => {
            const scoreElement = this.uiElement.querySelector(`.player-score[data-userid="${player.userId}"]`);
            if (scoreElement) {
                scoreElement.textContent = `${player.username}: ${player.score}`;
            }
        });
    }

    updateTimer(timeLeftMs) {
        if (!this.timerElement) return;
        const seconds = Math.ceil(timeLeftMs / 1000);
        this.timerElement.textContent = `⏰ ${seconds}s`;
    }

    showLobbyStatus(currentPlayers, maxPlayers) {
        if (!this.uiElement) return;
        const statusElement = this.uiElement.querySelector('.game-status');
        if (!statusElement) return;

        const joinLine = currentPlayers === 0
            ? '🎮 Oyun açıldı! Katılmak için <strong>!ben</strong> yazın'
            : `🎮 Oyun açıldı! <strong>${currentPlayers}</strong> oyuncu hazır.`;

        statusElement.innerHTML = `${joinLine}<br><small>Başlatmak için <strong>!başla</strong> yazın</small>`;
    }

    showMapSelection() {
        this.setStatus(`
            🗺️ <strong>Harita Seçin:</strong><br>
            !1 - 🌄 Klasik Parkur<br>
            !2 - 🏔️ Dağlık Yol<br>
            !3 - 🌊 Ada Atlama<br>
            !4 - 🏰 Kale Duvarları<br>
            !5 - 🌌 Uzay Labirenti<br>
            <small>Harita seçtikten sonra !ben ile katılın, !başla ile başlatın</small>
        `);
    }

    showMapSelected(mapName) {
        this.setStatus(`
            ✅ <strong>${mapName}</strong> seçildi!<br>
            🎮 Katılmak için <strong>!ben</strong> yazın<br>
            🚀 Başlatmak için <strong>!başla</strong> yazın
        `);
    }

    showGameStart() {
        this.setStatus(`
            🚀 <strong>Oyun başladı!</strong><br>
            🎯 Hedefe ulaşmak için engelleri aşın!<br>
            <small>Hareket: !a !d !w !q !e | Kombinasyon: !dwd gibi</small>
        `);
    }

    showCancelMessage() {
        this.setStatus(`
            ❌ <strong>Oyun iptal edildi!</strong><br>
            🎮 Yeni oyun için <strong>!oyun</strong> yazın
        `);
    }

    showGameResults(results) {
        if (!Array.isArray(results) || results.length === 0) {
            this.setStatus(`
                🏁 <strong>Oyun sona erdi!</strong><br>
                <small>Katılan oyuncu yoktu.</small>
            `);
            return;
        }

        const [winner, ...others] = results;
        const leaderboard = [winner, ...others.slice(0, 4)]
            .map((player, index) => `${index + 1}. ${player.username} • ${player.score} puan`)
            .join('<br>');

        this.setStatus(`
            🏆 <strong>Oyun bitti!</strong><br>
            👑 Kazanan: <strong>${winner.username}</strong><br>
            <small>${leaderboard}</small>
        `);
    }

    setStatus(html) {
        if (!this.uiElement) return;
        const statusElement = this.uiElement.querySelector('.game-status');
        if (statusElement) {
            statusElement.innerHTML = html;
        }
    }
}
