import { createClient, type RedisClientType } from 'redis';

let client: RedisClientType | null = null;
async function getClient() {
	if (!client) {
		client = createClient({
			url: import.meta.env.VITE_REDIS_URL ?? process.env.REDIS_URL //.replace('redis:', 'rediss:')
		});

		client.on('error', (err) => console.log('Redis Client Error', err));

		await client.connect();
	}
	return client;
}

let subscriber: RedisClientType | null = null;
async function getSubscriber() {
	if (!subscriber) {
		subscriber = (await getClient()).duplicate();

		subscriber.on('error', (err) => console.log('Redis subscriber Error', err));

		await subscriber.connect();
	}
	return subscriber;
}

// GET
export async function dbGet(key: string): Promise<string | null> {
	const client = await getClient();

	return (await client.get(key)) as string | null;
}

// SET
export async function dbSet(key: string, value: string): Promise<string | null> {
	const client = await getClient();

	return await client.set(key, value);
}

// SUBSCRIBE
export async function dbSubscribe(
	channel: string,
	listener: (message: string, channel: string) => void
): Promise<void> {
	const subscriber = await getSubscriber();

	void (await subscriber.subscribe(channel, listener));
}

// UNSUBSCRIBE
export async function dbUnsubscribe(channel: string): Promise<void> {
	const subscriber = await getSubscriber();

	void (await subscriber.unsubscribe(channel));
}

// PUBLISH
export async function dbPublish(channel: string, value: string): Promise<number> {
	const client = await getClient();

	return await client.publish(channel, value);
}
