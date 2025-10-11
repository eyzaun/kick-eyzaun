import { buildFallbackPlatforms } from './MapLibrary.js';
import { GAME_CONSTANTS } from './GameConstants.js';

export class GameRenderer {
    constructor({ gameWidth, gameHeight, playerRadius }) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.playerRadius = playerRadius;
        this.fallbackPlatforms = buildFallbackPlatforms(gameHeight);
        this.elapsedTime = 0; // seconds
    }

    setDimensions({ gameWidth, gameHeight }) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.fallbackPlatforms = buildFallbackPlatforms(gameHeight);
    }

    render({ ctx, players, trails, particleSystem, map, isGameRunning, gameDuration, gameStartTime, deltaTime = 0 }) {
        if (!ctx) return;

        ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);

        // Arka planı şeffaf bırak - yayın için
        // ctx.fillStyle = 'transparent';
        // ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

        // Zamanı ilerlet (dinamik platformlar için)
        this.elapsedTime += Math.max(0, deltaTime || 0);

        this.drawTrack(ctx, map);
        this.drawTrails(ctx, trails);
        this.drawPlayers(ctx, players);
        particleSystem.draw(ctx);
        this.drawUI(ctx, { isGameRunning, gameDuration, gameStartTime });
    }

    drawTrack(ctx, map) {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = GAME_CONSTANTS.RENDER.TRACK.LINE_WIDTH;

        ctx.beginPath();
        ctx.moveTo(GAME_CONSTANTS.RENDER.TRACK.START_X, this.gameHeight - GAME_CONSTANTS.GAME.GROUND_OFFSET);
        ctx.lineTo(GAME_CONSTANTS.RENDER.TRACK.START_X, this.gameHeight - 100);
        ctx.stroke();

        ctx.font = GAME_CONSTANTS.RENDER.ICON_FONT;
        ctx.fillText(GAME_CONSTANTS.RENDER.TRACK.START_FLAG_EMOJI, 20, this.gameHeight - 60);

        ctx.beginPath();
        ctx.moveTo(this.gameWidth - GAME_CONSTANTS.RENDER.TRACK.GOAL_X_OFFSET, 50);
        ctx.lineTo(this.gameWidth - GAME_CONSTANTS.RENDER.TRACK.GOAL_X_OFFSET, 100);
        ctx.stroke();

        ctx.font = GAME_CONSTANTS.RENDER.ICON_FONT;
        ctx.fillText(GAME_CONSTANTS.RENDER.TRACK.GOAL_EMOJI, this.gameWidth - 80, 80);

        ctx.fillStyle = GAME_CONSTANTS.RENDER.TRACK.GROUND_COLOR;
        ctx.fillRect(0, this.gameHeight - GAME_CONSTANTS.GAME.GROUND_OFFSET, this.gameWidth, GAME_CONSTANTS.GAME.GROUND_OFFSET);

        const rawPlatforms = Array.isArray(map?.platforms) ? map.platforms : this.fallbackPlatforms;
        const hazards = Array.isArray(map?.hazards) ? map.hazards : [];

        const platforms = this.computeEffectivePlatforms(rawPlatforms, this.elapsedTime);

        // Dinamik platformları hafifçe farklı renkle belirt
        platforms.forEach(platform => {
            const isDynamic = platform.type === 'moving' || platform.type === 'toggle' || platform.type === 'bounce';
            ctx.fillStyle = isDynamic ? '#7a5234' : GAME_CONSTANTS.RENDER.TRACK.PLATFORM_COLOR;
            ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
        });

        // Tehlikeleri çiz
        hazards.forEach(hz => {
            if (hz.type === 'lava') {
                ctx.fillStyle = '#d33';
                ctx.fillRect(hz.x, hz.y, hz.w, hz.h);
            } else if (hz.type === 'laser') {
                ctx.fillStyle = '#f44';
                ctx.fillRect(hz.x, hz.y, hz.w, hz.h);
            } else if (hz.type === 'spike') {
                ctx.fillStyle = '#aaa';
                ctx.fillRect(hz.x, hz.y, hz.w, hz.h);
            }
        });
    }

    computeEffectivePlatforms(platforms, t) {
        if (!Array.isArray(platforms)) return this.fallbackPlatforms;
        return platforms
            .map(p => {
                const out = { ...p };
                if (p.type === 'moving') {
                    const axis = p.axis === 'y' ? 'y' : 'x';
                    const range = Number(p.range) || 0;
                    const speed = Number(p.speed) || 1;
                    const phase = Number(p.phase) || 0;
                    const offset = Math.sin(speed * t + phase) * range;
                    if (axis === 'x') {
                        out.x = p.x + offset;
                    } else {
                        out.y = p.y + offset;
                    }
                } else if (p.type === 'toggle') {
                    const period = Math.max(0.1, Number(p.period) || 2);
                    const duty = Math.min(0.95, Math.max(0.05, Number(p.duty) || 0.5));
                    const offset = Number(p.offset) || 0;
                    const cycle = ((t + offset) % period + period) % period;
                    const visible = cycle < duty * period;
                    out.visible = visible;
                }
                return out;
            })
            .filter(p => p.type !== 'toggle' || p.visible !== false);
    }

    drawPlayers(ctx, players) {
        players.forEach(player => {
            if (!player.isAlive) return;

            ctx.save();
            ctx.beginPath();
            ctx.arc(player.position.x, player.position.y, this.playerRadius, 0, Math.PI * 2);
            ctx.fillStyle = player.color;
            ctx.shadowColor = 'rgba(0,0,0,0.35)';
            ctx.shadowBlur = GAME_CONSTANTS.RENDER.PLAYER.SHADOW_BLUR;
            ctx.fill();

            ctx.shadowBlur = 0;
            ctx.lineWidth = GAME_CONSTANTS.RENDER.PLAYER.OUTER_STROKE.width;
            ctx.strokeStyle = GAME_CONSTANTS.RENDER.PLAYER.OUTER_STROKE.color;
            ctx.stroke();

            ctx.lineWidth = GAME_CONSTANTS.RENDER.PLAYER.INNER_STROKE.width;
            ctx.strokeStyle = GAME_CONSTANTS.RENDER.PLAYER.INNER_STROKE.color;
            ctx.stroke();
            ctx.restore();

            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(player.position.x - GAME_CONSTANTS.RENDER.PLAYER.EYE_OFFSET, player.position.y - GAME_CONSTANTS.RENDER.PLAYER.EYE_OFFSET, GAME_CONSTANTS.RENDER.PLAYER.EYE_RADIUS, 0, Math.PI * 2);
            ctx.arc(player.position.x + GAME_CONSTANTS.RENDER.PLAYER.EYE_OFFSET, player.position.y - GAME_CONSTANTS.RENDER.PLAYER.EYE_OFFSET, GAME_CONSTANTS.RENDER.PLAYER.EYE_RADIUS, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(player.position.x - GAME_CONSTANTS.RENDER.PLAYER.EYE_OFFSET, player.position.y - GAME_CONSTANTS.RENDER.PLAYER.EYE_OFFSET, GAME_CONSTANTS.RENDER.PLAYER.PUPIL_RADIUS, 0, Math.PI * 2);
            ctx.arc(player.position.x + GAME_CONSTANTS.RENDER.PLAYER.EYE_OFFSET, player.position.y - GAME_CONSTANTS.RENDER.PLAYER.EYE_OFFSET, GAME_CONSTANTS.RENDER.PLAYER.PUPIL_RADIUS, 0, Math.PI * 2);
            ctx.fill();

            const name = player.username;
            ctx.save();
            ctx.font = GAME_CONSTANTS.RENDER.LABEL.FONT;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';

            const metrics = ctx.measureText(name);
            const width = metrics.width;

            ctx.fillStyle = GAME_CONSTANTS.RENDER.LABEL.BACKGROUND;
            ctx.fillRect(
                player.position.x - width / 2 - GAME_CONSTANTS.RENDER.LABEL.PADDING_X,
                player.position.y - (this.playerRadius + GAME_CONSTANTS.RENDER.LABEL.OFFSET_Y),
                width + (GAME_CONSTANTS.RENDER.LABEL.PADDING_X * 2),
                GAME_CONSTANTS.RENDER.LABEL.HEIGHT
            );

            ctx.fillStyle = '#fff';
            ctx.fillText(name, player.position.x, player.position.y - (this.playerRadius + GAME_CONSTANTS.RENDER.LABEL.OFFSET_Y - 16));
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

        ctx.fillStyle = GAME_CONSTANTS.RENDER.UI_TIMER.BOX.bg;
        ctx.fillRect(
            GAME_CONSTANTS.RENDER.UI_TIMER.BOX.x,
            GAME_CONSTANTS.RENDER.UI_TIMER.BOX.y,
            GAME_CONSTANTS.RENDER.UI_TIMER.BOX.w,
            GAME_CONSTANTS.RENDER.UI_TIMER.BOX.h
        );

        ctx.fillStyle = '#fff';
        ctx.font = GAME_CONSTANTS.RENDER.UI_TIMER.FONT;
        ctx.fillText(`⏰ ${seconds}s`, GAME_CONSTANTS.RENDER.UI_TIMER.TEXT_X, GAME_CONSTANTS.RENDER.UI_TIMER.TEXT_Y);
    }
}
