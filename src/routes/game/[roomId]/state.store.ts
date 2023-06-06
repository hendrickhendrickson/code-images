import { derived } from 'svelte/store';
import { playerNameStore } from './playerName.store';
import axios from 'axios';
import type { GameAction } from '../game.interface';
import type { RoomId } from './room.cache';

export function createStateStore(room: RoomId) {
	const stateStore = derived(playerNameStore, async ($playerNameStore) => {
		if ($playerNameStore) {
			const joinActionResult = await axios.post(`/game/${room}/actions`, {
				player: $playerNameStore,
				action: { type: 'PlayerJoin', name: $playerNameStore } satisfies GameAction
			});

			// const subscribeRoomResponse = await axios.get(`/game/${room}`, {
			// 	data: {
			// 		player: $playerNameStore
			// 	}
			// });
		}

		return null;
	});

	return stateStore;
}
