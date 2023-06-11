import { error } from '@sveltejs/kit';
import type { RoomId } from './room.cache';
import { roomCache } from './room.cache';

export async function load({ params, depends }) {
	// const gameState = await getGameState(params.roomId);

	depends('gameState');
	if (params.roomId in roomCache && roomCache[params.roomId as RoomId]) {
		return {
			room: params.roomId,
			gameState: roomCache[params.roomId as RoomId].state
		};
	}

	throw error(404, 'Not found');
}
