// public/js/packages/game/GameConstants.js - Oyun sabitleri ve ayarlar (DRY)

export const GAME_CONSTANTS = {
	GAME: {
		DURATION_MS: 180000, // 3 dakika
		MAX_PLAYERS: 8,
		MIN_PLAYERS: 1,
		WIDTH: 1280,
		HEIGHT: 720,
		PLAYER_RADIUS: 18,
		DOUBLE_JUMP_MULTIPLIER: 0.5,
		GROUND_OFFSET: 50,
		GOAL: { OFFSET_X: 80, THRESHOLD_Y: 100 }
	},
	PHYSICS: {
		GRAVITY: 500,
		JUMP_FORCE: -350,
		MOVE_SPEED: 1200,
		FRICTION: 0.85,
		DIAGONAL_BOOST_MULTIPLIER: 0.7
	},
	COMMANDS: {
		SINGLE_KEYS: ['a', 'd', 'w', 'q', 'e'],
		TIMEOUT_MS: 200,
		SEQUENCE_DELAY_MS: 300,
		IMPULSE_MULTIPLIER: 0.45,
		BASE_IMPULSE: 200,
		MAX_HORIZONTAL_SPEED: 500
	},
	COLORS: [
		'#ff4444', '#44ff44', '#4444ff', '#ffff44',
		'#ff44ff', '#44ffff', '#ff8844', '#8844ff'
	],
	RENDER: {
		TRACK: {
			START_X: 50,
			START_FLAG_EMOJI: '🏁',
			GOAL_X_OFFSET: 50,
			GOAL_EMOJI: '🎯',
			LINE_WIDTH: 3,
			GROUND_COLOR: '#8B4513',
			PLATFORM_COLOR: '#654321'
		},
		SKY_GRADIENT: ['#87CEEB', '#98FB98'],
		PLAYER: {
			EYE_OFFSET: 5,
			EYE_RADIUS: 3,
			PUPIL_RADIUS: 1.5,
			OUTER_STROKE: { width: 4, color: 'rgba(0,0,0,0.4)' },
			INNER_STROKE: { width: 2, color: 'rgba(255,255,255,0.9)' },
			SHADOW_BLUR: 12
		},
		LABEL: {
			FONT: 'bold 13px Arial',
			PADDING_X: 6,
			HEIGHT: 20,
			OFFSET_Y: 26,
			BACKGROUND: 'rgba(0, 0, 0, 0.65)'
		},
		ICON_FONT: '30px Arial',
		UI_TIMER: {
			BOX: { x: 10, y: 10, w: 100, h: 30, bg: 'rgba(0, 0, 0, 0.7)' },
			FONT: '16px Arial',
			TEXT_X: 20,
			TEXT_Y: 30
		}
	}
};

export default GAME_CONSTANTS;
