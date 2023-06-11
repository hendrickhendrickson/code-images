import { type RoomId, subscribeRoom, getGameState, unsubscribeRoom } from './room.cache.js';
import { v4 as uuidV4 } from 'uuid';
export async function GET(requestEvent) {
	requestEvent.request.headers;

	let data;
	try {
		data = await requestEvent.request.json();
	} catch (error) {
		/* empty */
	}

	const subscriberId = data?.player ?? uuidV4();

	const stream = new ReadableStream({
		start(controller) {
			controller.enqueue(JSON.stringify(getGameState(requestEvent.params.roomId as RoomId)));

			subscribeRoom(requestEvent.params.roomId as RoomId, subscriberId, () => {
				controller.enqueue('event: message\ndata:\n\n');
			});
		},
		cancel() {
			unsubscribeRoom(requestEvent.params.roomId as RoomId, subscriberId);
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
