import { GAME_CONSTANTS } from './GameConstants.js';
const { SINGLE_KEYS, TIMEOUT_MS, IMPULSE_MULTIPLIER, BASE_IMPULSE, MAX_HORIZONTAL_SPEED, SEQUENCE_DELAY_MS } = GAME_CONSTANTS.COMMANDS;

export class CommandProcessor {
	handle(player, command) {
		if (!command.startsWith('!')) {
			return false;
		}

		const normalized = command.slice(1);

		if (normalized.length > 1 && normalized.length <= 5) {
			const sequence = normalized.split('');
			const isValidSequence = sequence.every(char => SINGLE_KEYS.includes(char));

			if (isValidSequence && sequence.length >= 2) {
				this.executeSequence(player, sequence);
				return true;
			}
		}

		this.executeSingle(player, normalized);
		return true;
	}

	executeSingle(player, command) {
		switch (command) {
			case 'a':
			case 'sol':
				player.keys.left = true;
				setTimeout(() => player.keys.left = false, TIMEOUT_MS);
				break;
			case 'd':
			case 'sag':
			case 'sağ':
				player.keys.right = true;
				setTimeout(() => player.keys.right = false, TIMEOUT_MS);
				break;
			case 'w':
			case 'yukarı':
			case 'yukari':
				player.jumpBuffer = Math.min((player.jumpBuffer || 0) + 1, 2);
				player.keys.up = true;
				setTimeout(() => player.keys.up = false, TIMEOUT_MS);
				break;
			case 'q':
				this.applyDiagonalMove(player, 'left');
				break;
			case 'e':
				this.applyDiagonalMove(player, 'right');
				break;
			case 'asagi':
			case 'aşağı':
				player.keys.down = true;
				setTimeout(() => player.keys.down = false, TIMEOUT_MS);
				break;
		}
	}

	executeSequence(player, sequence) {
		sequence.forEach((cmd, index) => {
			setTimeout(() => {
				if (!player.isAlive) return;
				this.executeSingle(player, cmd);
			}, index * SEQUENCE_DELAY_MS);
		});
	}

	applyDiagonalMove(player, direction) {
		const diagonalKey = direction === 'left' ? 'diagonalLeft' : 'diagonalRight';
		const lateralKey = direction === 'left' ? 'left' : 'right';
		const horizontalImpulse = (direction === 'left' ? -BASE_IMPULSE : BASE_IMPULSE) * IMPULSE_MULTIPLIER;

		player.keys[diagonalKey] = true;
		player.keys[lateralKey] = true;
		player.keys.up = true;

		player.velocity.x = Math.max(
			Math.min(player.velocity.x + horizontalImpulse, MAX_HORIZONTAL_SPEED),
			-MAX_HORIZONTAL_SPEED
		);

		setTimeout(() => player.keys[diagonalKey] = false, TIMEOUT_MS);
		setTimeout(() => player.keys[lateralKey] = false, TIMEOUT_MS);
		setTimeout(() => player.keys.up = false, TIMEOUT_MS);
	}
}

export default CommandProcessor;
