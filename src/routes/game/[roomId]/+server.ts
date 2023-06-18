import { createClient } from 'redis';

export async function GET(requestEvent) {
	const client = createClient({
		url: (import.meta.env.VITE_KV_URL ?? process.env.KV_URL).replace('redis:', 'rediss:')
	});

	client.on('error', (err) => console.log('Redis Client Error', err));

	await client.connect();

	const stream = new ReadableStream({
		async start(controller) {
			controller.enqueue('event: message\ndata:\n\n'); // TODO check necessary

			await client.subscribe(`room_${requestEvent.params.roomId}`, () => {
				controller.enqueue('event: message\ndata:\n\n');
			});
		},
		async cancel() {
			await client.unsubscribe();
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
