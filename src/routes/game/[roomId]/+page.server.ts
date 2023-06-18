import { error } from '@sveltejs/kit';
import { dbReadWrite } from './room.db';
import type { GameState } from '../game.interface';

export async function load({ params, depends }) {
	depends('gameState');

	const gameState = await dbReadWrite.get<GameState>(`room_${params.roomId}`);

	if (gameState) {
		return {
			room: params.roomId,
			gameState
		};
	}

	throw error(404, 'Not found');
}
