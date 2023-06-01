import { error } from '@sveltejs/kit';
import { getGameState } from './room.cache';
import { obfuscateGameState } from '../game.utils';

export async function load({ params }) {
	const gameState = await getGameState(params.roomId);

	if (gameState) {
		return { gameState: obfuscateGameState(gameState) };
	}

	throw error(404, 'Not found');
}
