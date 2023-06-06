import { type RoomId, subscribeRoom, getGameState } from './room.cache.js';

export async function GET(requestEvent) {
	requestEvent.request.headers;

	// const data = await requestEvent.request.json();

	const stream = new ReadableStream({
		start(controller) {
			controller.enqueue(JSON.stringify(getGameState(requestEvent.params.roomId as RoomId)));

			subscribeRoom(requestEvent.params.roomId as RoomId, 'player_420', (gameState) => {
				controller.enqueue('event: message\ndata:\n\n');
			});
		},
		cancel() {
			console.log('ReadableStream cancelled');
		}
	});
	const response = new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});

	return response;
}
