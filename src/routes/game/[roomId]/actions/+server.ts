import { updateRoom, type RoomId } from '../room.cache.js';
import { handleAction } from './game.actions.js';

export async function POST(requestEvent) {
	requestEvent.request.headers;

	const data = await requestEvent.request.json();

	let actionSuccess: true | string = true;
	await updateRoom(requestEvent.params.roomId as RoomId, async (gameState) => {
		const actionResult = await handleAction(gameState, data.player, data.action);
		if (actionResult.success) {
			actionSuccess = true;
			return actionResult.updatedGameState;
		} else {
			actionSuccess = actionResult.failReason;
			return gameState;
		}
	});

	return new Response(String(actionSuccess));
}
