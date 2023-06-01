import type { GameState } from '../game.interface';
import { faker } from '@faker-js/faker';

export type RoomId = `${string}-${string}-${string}`;
export type Room = {
	id: RoomId;
	state: GameState;
};

const roomCache: Record<RoomId, Room> = {};

export function createRoom(state: GameState) {
	let roomId = generateRandomRoomId();
	while (roomCache[roomId]) {
		roomId = generateRandomRoomId();
	}

	roomCache[roomId] = {
		id: roomId,
		state
	};

	return roomId;
}

export async function updateRoom(
	roomId: RoomId,
	updateFunc: (state: GameState) => GameState
): Promise<void> {
	roomCache[roomId].state = updateFunc(roomCache[roomId].state);
	return Promise.resolve();
}

function generateRandomRoomId(): RoomId {
	return `${faker.word.adjective()}-${faker.word.adjective()}-${faker.word.noun()}`;
}

export async function getGameState(room: string): Promise<GameState | null> {
	return room in roomCache ? roomCache[room as RoomId].state ?? null : null;
}
