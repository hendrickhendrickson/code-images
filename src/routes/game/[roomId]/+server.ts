import { dbSubscribe, dbUnsubscribe } from './room.db';

/** @type {import('./$types').RequestHandler} */
export async function GET(requestEvent) {
	const stream = new ReadableStream({
		async start(controller) {
			controller.enqueue('event: message\ndata:\n\n'); // TODO check if necessary

			await dbSubscribe(`room_${requestEvent.params.roomId}`, () => {
				controller.enqueue('event: message\ndata:\n\n');
			});
		},
		async cancel() {
			await dbUnsubscribe(`room_${requestEvent.params.roomId}`);
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
