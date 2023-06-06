import { objectValues } from '../../../utils/object.utils';
import type { GameState, PlayerId } from '../game.interface';
import { faker } from '@faker-js/faker';

export type RoomId = `${string}-${string}-${string}`;
export type Room = {
	id: RoomId;
	state: GameState;
	subscribers: Record<PlayerId, (gameState: GameState) => void>;
};

export const roomCache: Record<RoomId, Room> = {};

export function createRoom(state: GameState) {
	let roomId = generateRandomRoomId();
	while (roomCache[roomId]) {
		roomId = generateRandomRoomId();
	}

	roomCache[roomId] = {
		id: roomId,
		state,
		subscribers: {}
	};

	return roomId;
}

export async function updateRoom(
	roomId: RoomId,
	updateFunc: (state: GameState) => Promise<GameState>
): Promise<void> {
	const updatedGameState = await updateFunc(roomCache[roomId].state);
	roomCache[roomId].state = updatedGameState;
	objectValues(roomCache[roomId].subscribers).forEach((callback) => callback(updatedGameState));
}

function generateRandomRoomId(): RoomId {
	return `${faker.word.adjective()}-${faker.word.adjective()}-${faker.word.noun()}`;
}

export async function getGameState(room: string): Promise<GameState | null> {
	return room in roomCache ? roomCache[room as RoomId].state ?? null : null;
}

export function subscribeRoom(
	room: RoomId,
	subscriber: PlayerId,
	callback: (gameState: GameState) => void
) {
	if (roomCache[room]) {
		roomCache[room].subscribers[subscriber] = callback;
	}
}
