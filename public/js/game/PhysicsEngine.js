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
    }

    updateDimensions({ gameWidth, gameHeight }) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.fallbackPlatforms = buildFallbackPlatforms(gameHeight);
    }

    update(players, selectedMap, deltaTime) {
        const platforms = selectedMap?.platforms ?? this.fallbackPlatforms;

        players.forEach(player => {
            if (!player.isAlive) return;
            this.integratePlayer(player, platforms, deltaTime);
        });
    }

    integratePlayer(player, platforms, deltaTime) {
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
        this.handleGoalAndBounds(player);

        if (typeof this.onTrailUpdate === 'function') {
            this.onTrailUpdate(player);
        }
    }

    handlePlatformCollisions(player, platforms) {
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
                player.position.y = top - radius;
                player.velocity.y = Math.min(0, player.velocity.y);
                player.onGround = true;
                player.jumpCount = 0;
                player.hasDoubleJumped = false;
                player.jumpBuffer = 0;
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

        if (player.position.y + radius < this.gameHeight - 50) {
            player.onGround = false;
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
