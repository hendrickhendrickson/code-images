import { createRoom, type RoomId } from '../[roomId]/room.cache.js';
import { initGame } from '../game.init.js';

export async function POST(requestEvent) {
	const gameState = initGame();

	return new Response(createRoom(gameState));
}
