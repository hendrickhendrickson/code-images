import { error } from '@sveltejs/kit';
import { dbGet } from './room.db';

export async function load({ params, depends }) {
	depends('gameState');

	const gameState = await dbGet(`room_${params.roomId}`);

	if (gameState) {
		return {
			room: params.roomId,
			gameState: JSON.parse(gameState)
		};
	}

	throw error(404, 'Not found');
}
