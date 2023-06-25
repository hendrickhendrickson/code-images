import { isDefined } from "../utils/assert.utils";
import { dbReadWrite } from "./game/[roomId]/room.db";
import { initGame } from "./game/game.init";
import { generateRandomRoomId } from "./game/game.utils";

export const actions = {
    default: async () => {
        const roomId = generateRandomRoomId();
        const gameState = initGame();

        const dbWriteResult = await dbReadWrite.set(`room_${roomId}`, gameState);
        const dbPublishResult = await dbReadWrite.publish(`room_${roomId}`, gameState);


	    if (!isDefined(dbWriteResult) || !isDefined(dbPublishResult)) {
            console.error("Could not write or publish to database");

            return { error: "Failed to create room", roomId: null };
        }

        return { error: null, roomId };
    },
}
