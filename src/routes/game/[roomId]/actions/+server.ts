import type { GameState } from '../../game.interface.js';
import { handleAction } from './game.actions.js';
import { dbReadWrite } from '../room.db.js';
import { isDefined } from '../../../../utils/assert.utils.js';

export async function POST(requestEvent) {
	requestEvent.request.headers;

	const data = await requestEvent.request.json();

	let actionSuccess: true | string = true;
	const gameState = await dbReadWrite.get<GameState>(`room_${requestEvent.params.roomId}`);
	if (gameState) {
		const actionResult = await handleAction(gameState, data.player, data.action);
		if (actionResult.success) {
			const dbWriteResult = await dbReadWrite.set(
				`room_${requestEvent.params.roomId}`,
				actionResult.updatedGameState
			);
			const dbPublishResult = await dbReadWrite.publish(
				`room_${requestEvent.params.roomId}`,
				actionResult.updatedGameState
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
