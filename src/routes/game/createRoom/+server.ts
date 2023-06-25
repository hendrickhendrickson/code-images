import { generateRandomRoomId } from '../game.utils';
import { initGame } from '../game.init.js';
import { isDefined } from '../../../utils/assert.utils.js';
import { dbPublish, dbSet } from '../[roomId]/room.db';

/** @type {import('./$types').RequestHandler} */
export async function POST() {
	const room = generateRandomRoomId();
	const gameState = initGame();

	const dbSetResult = await dbSet(`room_${room}`, JSON.stringify(gameState));
	const dbPublishResult = await dbPublish(`room_${room}`, JSON.stringify(gameState));
	if (!isDefined(dbSetResult) || !isDefined(dbPublishResult)) {
		return new Response('could not write or publish to database');
	}

	return new Response(room);
}
