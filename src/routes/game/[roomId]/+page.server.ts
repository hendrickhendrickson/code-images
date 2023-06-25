import { error } from '@sveltejs/kit';
import { dbGet } from './room.db';
import type { GameState } from '../game.interface';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, depends }) {
	depends('gameState');

	const gameState = await dbGet(`room_${params.roomId}`);

	if (gameState) {
		return {
			room: params.roomId,
			gameState: JSON.parse(gameState) as GameState
		};
	}

	throw error(404, 'Not found');
}
