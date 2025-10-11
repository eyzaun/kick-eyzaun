import { buildFallbackPlatforms } from './MapLibrary.js';
import { GAME_CONSTANTS } from './GameConstants.js';
const { GRAVITY, JUMP_FORCE, MOVE_SPEED, FRICTION, DIAGONAL_BOOST_MULTIPLIER } = GAME_CONSTANTS.PHYSICS;
const { GROUND_OFFSET, GOAL } = GAME_CONSTANTS.GAME;

export class PhysicsEngine {
    constructor({
        gameWidth,
        gameHeight,
        playerRadius,
        doubleJumpMultiplier,
        particleSystem,
        onTrailUpdate,
        onPlayerFinished,
        onPlayerEliminated
    }) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.playerRadius = playerRadius;
        this.doubleJumpMultiplier = doubleJumpMultiplier;
        this.particleSystem = particleSystem;
        this.onTrailUpdate = onTrailUpdate;
        this.onPlayerFinished = onPlayerFinished;
        this.onPlayerEliminated = onPlayerEliminated;
        this.fallbackPlatforms = buildFallbackPlatforms(gameHeight);
        this.elapsedTime = 0; // seconds
        this.currentPlatforms = this.fallbackPlatforms;
        this.currentHazards = [];
    }

    updateDimensions({ gameWidth, gameHeight }) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.fallbackPlatforms = buildFallbackPlatforms(gameHeight);
    }

    update(players, selectedMap, deltaTime) {
        // Zamanı ilerlet
        this.elapsedTime += Math.max(0, deltaTime || 0);

        // Dinamik platformları ve tehlikeleri hazırla
        const staticPlatforms = selectedMap?.platforms ?? this.fallbackPlatforms;
        const hazards = Array.isArray(selectedMap?.hazards) ? selectedMap.hazards : [];
        const platforms = this.computeEffectivePlatforms(staticPlatforms, this.elapsedTime);
        this.currentPlatforms = platforms;
        this.currentHazards = hazards;

        players.forEach(player => {
            if (!player.isAlive) return;
            this.integratePlayer(player, platforms, hazards, deltaTime);
        });
    }

    computeEffectivePlatforms(platforms, t) {
        // Hareketli (moving), görünür/görünmez (toggle) ve zıplama (bounce) destekler
        if (!Array.isArray(platforms)) return this.fallbackPlatforms;
        const TWO_PI = Math.PI * 2;
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

    computeEffectivePlatforms(platforms, t) {
        // Hareketli (moving), görünür/görünmez (toggle) ve zıplama (bounce) destekler
        if (!Array.isArray(platforms)) return this.fallbackPlatforms;
        const TWO_PI = Math.PI * 2;
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

    integratePlayer(player, platforms, hazards, deltaTime) {
        const radius = this.playerRadius;
        const horizontalMargin = radius + 7;
    const groundTop = this.gameHeight - GROUND_OFFSET;

        player.jumpBuffer = player.jumpBuffer ?? 0;
        player.jumpCount = player.jumpCount ?? 0;
        player.hasDoubleJumped = player.hasDoubleJumped ?? false;
        player.previousPosition = { x: player.position.x, y: player.position.y };

        const jumpRequested = player.keys.up || player.jumpBuffer > 0;

        if (jumpRequested) {
            if (player.onGround) {
                const wasDiagonalLeft = player.keys.diagonalLeft;
                const wasDiagonalRight = player.keys.diagonalRight;

                player.velocity.y = JUMP_FORCE;
                if (wasDiagonalLeft) {
                    player.velocity.x = Math.max(player.velocity.x - (MOVE_SPEED * DIAGONAL_BOOST_MULTIPLIER) * deltaTime, -MOVE_SPEED);
                } else if (wasDiagonalRight) {
                    player.velocity.x = Math.min(player.velocity.x + (MOVE_SPEED * DIAGONAL_BOOST_MULTIPLIER) * deltaTime, MOVE_SPEED);
                }

                player.onGround = false;
                player.jumpCount = 1;
                player.hasDoubleJumped = false;
                if (player.jumpBuffer > 0) {
                    player.jumpBuffer = Math.max(player.jumpBuffer - 1, 0);
                }
                player.keys.up = false;

                this.particleSystem.createJumpParticles(player.position.x, player.position.y);
            } else if (player.jumpBuffer > 0 && player.jumpCount === 1 && !player.hasDoubleJumped) {
                player.velocity.y = JUMP_FORCE * this.doubleJumpMultiplier;
                player.jumpCount = 2;
                player.hasDoubleJumped = true;
                player.jumpBuffer = Math.max(player.jumpBuffer - 1, 0);
                player.keys.up = false;

                this.particleSystem.createJumpParticles(player.position.x, player.position.y);
            }
        }

        // Eğer karakter hareketli platform üzerinde duruyorsa, pozisyonunu tamamen platforma göre ayarla
        if (player.onGround && player.standingPlatform && player.standingPlatform.type === 'moving') {
            const axis = player.standingPlatform.axis === 'y' ? 'y' : 'x';
            const range = Number(player.standingPlatform.range) || 0;
            const speed = Number(player.standingPlatform.speed) || 1;
            const phase = Number(player.standingPlatform.phase) || 0;
            const currentOffset = Math.sin(speed * this.elapsedTime + phase) * range;

            const platformX = player.standingPlatform.x + (axis === 'x' ? currentOffset : 0);
            const platformY = player.standingPlatform.y + (axis === 'y' ? currentOffset : 0);

            // Karakteri platformun üstüne sabitle
            player.position.x = platformX + player.relativeXOnPlatform;
            player.position.y = platformY - radius;
            player.velocity.x = 0; // Platform üzerinde dururken kendi hızını sıfırla
            player.velocity.y = 0;
        } else {
            // Normal hareket (platform üzerinde değilse)
            if (player.keys.left) {
                player.velocity.x = Math.max(player.velocity.x - MOVE_SPEED * deltaTime, -MOVE_SPEED);
            } else if (player.keys.right) {
                player.velocity.x = Math.min(player.velocity.x + MOVE_SPEED * deltaTime, MOVE_SPEED);
            } else {
                player.velocity.x *= FRICTION;
            }

            if (!player.onGround) {
                player.velocity.y += GRAVITY * deltaTime;
            }

            player.position.x += player.velocity.x * deltaTime;
            player.position.y += player.velocity.y * deltaTime;
        }

        if (player.position.y >= groundTop - radius) {
            player.position.y = groundTop - radius;
            player.velocity.y = Math.min(0, player.velocity.y);
            player.onGround = true;
            player.jumpCount = 0;
            player.hasDoubleJumped = false;
            player.jumpBuffer = 0;
        }

        if (player.position.x < horizontalMargin) {
            player.position.x = horizontalMargin;
            player.velocity.x = Math.max(0, player.velocity.x);
        } else if (player.position.x > this.gameWidth - horizontalMargin) {
            player.position.x = this.gameWidth - horizontalMargin;
            player.velocity.x = Math.min(0, player.velocity.x);
        }

    this.handlePlatformCollisions(player, platforms);
    this.handleHazards(player, hazards);
    this.handleGoalAndBounds(player);

        if (typeof this.onTrailUpdate === 'function') {
            this.onTrailUpdate(player);
        }

        // Pozisyon güncellemesi sonrası previousPosition'ı güncelle
        player.previousPosition = { x: player.position.x, y: player.position.y };
    }

    handlePlatformCollisions(player, platforms) {
        // Eğer karakter hareketli platform üzerinde duruyorsa, çarpışmaları atla (zaten pozisyon platforma göre ayarlandı)
        if (player.onGround && player.standingPlatform && player.standingPlatform.type === 'moving') {
            return;
        }

        const radius = this.playerRadius;
        const previousPosition = player.previousPosition || player.position;
        const previousBottom = previousPosition.y + radius;
        const previousRight = previousPosition.x + radius;
        const previousLeft = previousPosition.x - radius;

        const currentBottom = player.position.y + radius;
        const currentTop = player.position.y - radius;
        const currentRight = player.position.x + radius;
        const currentLeft = player.position.x - radius;

        for (const platform of platforms) {
            const top = platform.y;
            const bottom = platform.y + platform.h;
            const left = platform.x;
            const right = platform.x + platform.w;

            const horizontallyOverlapping = currentRight > left && currentLeft < right;
            const wasHorizontallyOverlapping = previousRight > left && previousLeft < right;
            const verticallyOverlapping = currentBottom > top && currentTop < bottom;

            const landingFromAbove = horizontallyOverlapping &&
                currentBottom >= top &&
                previousBottom <= top + 6 &&
                player.velocity.y >= 0;

            if (landingFromAbove) {
                // Zıplama pedi ise sekme uygula
                if (platform.type === 'bounce') {
                    const mult = Number(platform.bounceMultiplier) || 1.2;
                    player.position.y = top - radius - 1;
                    player.velocity.y = JUMP_FORCE * mult;
                    player.onGround = false;
                    player.jumpCount = 1; // ilk zıplama say
                    player.hasDoubleJumped = false;
                    player.jumpBuffer = 0;
                    this.particleSystem.createJumpParticles(player.position.x, player.position.y);
                    player.standingPlatform = null; // Bounce'da platform bırak
                    player.relativeXOnPlatform = 0;
                } else {
                    player.position.y = top - radius;
                    player.velocity.y = Math.min(0, player.velocity.y);
                    player.onGround = true;
                    player.jumpCount = 0;
                    player.hasDoubleJumped = false;
                    player.jumpBuffer = 0;
                    player.standingPlatform = platform; // Player'a kaydet
                    // Platform üzerindeki göreceli X pozisyonunu platform merkezine göre hesapla
                    const platformCenterX = left + platform.w / 2;
                    player.relativeXOnPlatform = player.position.x - platformCenterX;
                }
                return;
            }

            if (!horizontallyOverlapping || !verticallyOverlapping || !wasHorizontallyOverlapping) {
                continue;
            }

            if (player.velocity.x > 0 && previousRight <= left && currentRight > left) {
                player.position.x = left - radius;
                player.velocity.x = Math.min(0, player.velocity.x);
                return;
            }

            if (player.velocity.x < 0 && previousLeft >= right && currentLeft < right) {
                player.position.x = right + radius;
                player.velocity.x = Math.max(0, player.velocity.x);
                return;
            }
        }

        // Eğer hiçbir platformla çarpışma yoksa ve yerde değilse
        if (player.position.y + radius < this.gameHeight - 50) {
            player.onGround = false;
            player.standingPlatform = null;
            player.relativeXOnPlatform = 0;
        }
    }

    handleHazards(player, hazards) {
        if (!Array.isArray(hazards) || hazards.length === 0 || !player.isAlive) return;

        const radius = this.playerRadius;
        const currentBottom = player.position.y + radius;
        const currentTop = player.position.y - radius;
        const currentRight = player.position.x + radius;
        const currentLeft = player.position.x - radius;

        for (const hz of hazards) {
            const left = hz.x;
            const top = hz.y;
            const right = hz.x + hz.w;
            const bottom = hz.y + hz.h;

            const overlaps = currentRight > left && currentLeft < right && currentBottom > top && currentTop < bottom;
            if (!overlaps) continue;

            // Tüm hazard türleri ölümcül kabul edilir (lava, laser, spike)
            player.isAlive = false;
            if (typeof this.onPlayerEliminated === 'function') {
                this.onPlayerEliminated(player);
            }
            return;
        }
    }

    handleGoalAndBounds(player) {
        if (player.position.x > this.gameWidth - GOAL.OFFSET_X && player.position.y < GOAL.THRESHOLD_Y && player.isAlive) {
            if (typeof this.onPlayerFinished === 'function') {
                this.onPlayerFinished(player);
            }
        }

        if (player.position.y > this.gameHeight + 100 && player.isAlive) {
            player.isAlive = false;
            if (typeof this.onPlayerEliminated === 'function') {
                this.onPlayerEliminated(player);
            }
        }
    }
}
