import { buildFallbackPlatforms } from './MapLibrary.js';

export class GameRenderer {
    constructor({ gameWidth, gameHeight, playerRadius }) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.playerRadius = playerRadius;
        this.fallbackPlatforms = buildFallbackPlatforms(gameHeight);
    }

    setDimensions({ gameWidth, gameHeight }) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.fallbackPlatforms = buildFallbackPlatforms(gameHeight);
    }

    render({ ctx, players, trails, particleSystem, map, isGameRunning, gameDuration, gameStartTime }) {
        if (!ctx) return;

        ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);

        const gradient = ctx.createLinearGradient(0, 0, 0, this.gameHeight);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98FB98');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

        this.drawTrack(ctx, map);
        this.drawTrails(ctx, trails);
        this.drawPlayers(ctx, players);
        particleSystem.draw(ctx);
        this.drawUI(ctx, { isGameRunning, gameDuration, gameStartTime });
    }

    drawTrack(ctx, map) {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(50, this.gameHeight - 50);
        ctx.lineTo(50, this.gameHeight - 100);
        ctx.stroke();

        ctx.fillStyle = '#ff4444';
        ctx.font = '30px Arial';
        ctx.fillText('🏁', 20, this.gameHeight - 60);

        ctx.beginPath();
        ctx.moveTo(this.gameWidth - 50, 50);
        ctx.lineTo(this.gameWidth - 50, 100);
        ctx.stroke();

        ctx.fillStyle = '#44ff44';
        ctx.font = '30px Arial';
        ctx.fillText('🎯', this.gameWidth - 80, 80);

        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, this.gameHeight - 50, this.gameWidth, 50);

        const platforms = Array.isArray(map?.platforms) ? map.platforms : this.fallbackPlatforms;

        ctx.fillStyle = '#654321';
        platforms.forEach(platform => {
            ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
        });
    }

    drawPlayers(ctx, players) {
        players.forEach(player => {
            if (!player.isAlive) return;

            ctx.save();
            ctx.beginPath();
            ctx.arc(player.position.x, player.position.y, this.playerRadius, 0, Math.PI * 2);
            ctx.fillStyle = player.color;
            ctx.shadowColor = 'rgba(0,0,0,0.35)';
            ctx.shadowBlur = 12;
            ctx.fill();

            ctx.shadowBlur = 0;
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'rgba(0,0,0,0.4)';
            ctx.stroke();

            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(255,255,255,0.9)';
            ctx.stroke();
            ctx.restore();

            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(player.position.x - 5, player.position.y - 5, 3, 0, Math.PI * 2);
            ctx.arc(player.position.x + 5, player.position.y - 5, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(player.position.x - 5, player.position.y - 5, 1.5, 0, Math.PI * 2);
            ctx.arc(player.position.x + 5, player.position.y - 5, 1.5, 0, Math.PI * 2);
            ctx.fill();

            const name = player.username;
            ctx.save();
            ctx.font = 'bold 13px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';

            const metrics = ctx.measureText(name);
            const width = metrics.width;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
            ctx.fillRect(
                player.position.x - width / 2 - 6,
                player.position.y - 42,
                width + 12,
                20
            );

            ctx.fillStyle = '#fff';
            ctx.fillText(name, player.position.x, player.position.y - 26);
            ctx.restore();
        });
    }

    drawTrails(ctx, trails) {
        trails.forEach(points => {
            points.forEach((point, index) => {
                const alpha = (index / points.length) * 0.5;
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.beginPath();
                ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
                ctx.fill();
            });
        });
    }

    drawUI(ctx, { isGameRunning, gameDuration, gameStartTime }) {
        if (!isGameRunning) return;

        const elapsed = Date.now() - gameStartTime;
        const timeLeft = Math.max(0, gameDuration - elapsed);
        const seconds = Math.ceil(timeLeft / 1000);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, 100, 30);

        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.fillText(`⏰ ${seconds}s`, 20, 30);
    }
}
