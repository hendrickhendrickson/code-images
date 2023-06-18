import { generateRandomRoomId } from '../game.utils';
import { initGame } from '../game.init.js';
import { dbReadWrite } from '../[roomId]/room.db.js';
import { isDefined } from '../../../utils/assert.utils.js';

export async function POST() {
	const room = generateRandomRoomId();
	const gameState = initGame();

	const dbWriteResult = await dbReadWrite.set(`room_${room}`, gameState);
	const dbPublishResult = await dbReadWrite.publish(`room_${room}`, gameState);
	if (!isDefined(dbWriteResult) || !isDefined(dbPublishResult)) {
		return new Response('could not write or publish to database');
	}

	return new Response(room);
}
