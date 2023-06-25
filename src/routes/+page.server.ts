import { isDefined } from "../utils/assert.utils";
import { dbPublish, dbSet } from "./game/[roomId]/room.db";
import { initGame } from "./game/game.init";
import { generateRandomRoomId } from "./game/game.utils";

export const actions = {
    default: async () => {
        const roomId = generateRandomRoomId();
        const gameState = initGame();

        const dbSetResult = await dbSet(`room_${roomId}`, JSON.stringify(gameState));
        const dbPublishResult = await dbPublish(`room_${roomId}`, JSON.stringify(gameState));


	    if (!isDefined(dbSetResult) || !isDefined(dbPublishResult)) {
            console.error("Could not write or publish to database");

            return { error: "Failed to create room", roomId: null };
        }

        return { error: null, roomId };
    },
}
