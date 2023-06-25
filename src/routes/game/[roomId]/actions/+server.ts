import { handleAction } from './game.actions.js';
import { isDefined } from '../../../../utils/assert.utils.js';
import { dbGet, dbSet, dbPublish } from '../room.db.js';

/** @type {import('./$types').RequestHandler} */
export async function POST(requestEvent) {
	requestEvent.request.headers;

	const data = await requestEvent.request.json();

	let actionSuccess: true | string = true;
	const gameState = await dbGet(`room_${requestEvent.params.roomId}`);
	if (gameState) {
		const actionResult = await handleAction(JSON.parse(gameState), data.player, data.action);
		if (actionResult.success) {
			const dbWriteResult = await dbSet(
				`room_${requestEvent.params.roomId}`,
				JSON.stringify(actionResult.updatedGameState)
			);
			const dbPublishResult = await dbPublish(
				`room_${requestEvent.params.roomId}`,
				JSON.stringify(actionResult.updatedGameState)
			);
			if (!isDefined(dbWriteResult) || !isDefined(dbPublishResult)) {
				actionSuccess = 'could not write or publish to database';
			}
		} else {
			actionSuccess = actionResult.failReason;
		}
	}

	return new Response(String(actionSuccess));
}
