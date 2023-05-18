import { ObjectKeys } from '../utils/object/object';
import { playerNameMaximumCharacterLength, playerNameMinimumCharacterLength } from './game.consts';
import type {
	ActionResult,
	GameAction,
	GameState,
	PlayerId,
	PlayerJoinAction,
	TeamSwitchAction
} from './game.interface';

export function handleAction(
	gameState: GameState,
	actor: PlayerId,
	action: GameAction
): ActionResult {
	switch (action.type) {
		case 'PlayerJoin':
			return handlePlayerJoin(gameState, actor, action);
		case 'PlayerLeave':
			return handlePlayerLeave(gameState, actor);
		case 'TeamSwitch':
			return handleTeamSwitch(gameState, actor, action);
		default:
			throw `unknown action type: ${action.type}`;
	}
}

export function handlePlayerJoin(
	gameState: GameState,
	actor: PlayerId,
	action: PlayerJoinAction
): ActionResult {
	if (actor in gameState.players) {
		return { success: false, reason: 'player already in the game' };
	} else if (typeof action.name !== 'string') {
		return { success: false, reason: 'name not a string' };
	} else if (action.name.length < playerNameMinimumCharacterLength) {
		return {
			success: false,
			reason: `name not at least ${playerNameMinimumCharacterLength} characters long`
		};
	} else if (action.name.length > playerNameMaximumCharacterLength) {
		return {
			success: false,
			reason: `name longer than playerNameMaximumCharacterLength characters`
		};
	} else if (Object.values(gameState.players).some((player) => action.name === player.name)) {
		return { success: false, reason: 'name already taken' };
	}

	gameState.players[actor] = {
		id: actor,
		name: action.name
	};
	return { success: true, updatedGameState: gameState };
}

export function handlePlayerLeave(gameState: GameState, actor: PlayerId): ActionResult {
	if (!(actor in gameState.players)) {
		return { success: false, reason: 'player not in the game' };
	}

	delete gameState.players[actor];
	return { success: true, updatedGameState: gameState };
}

export function handleTeamSwitch(
	gameState: GameState,
	actor: PlayerId,
	action: TeamSwitchAction
): ActionResult {
	if (!(actor in gameState.players)) {
		return { success: false, reason: 'player not in the game' };
	}

	if (!(action.team in gameState.operatives)) {
		return { success: false, reason: 'teamId does not exist' };
	}

	ObjectKeys(gameState.operatives).forEach((team) => {
		const index = gameState.operatives[team].indexOf(actor);
		if (index !== -1) {
			gameState.operatives[team].splice(index, 1);
		}
	});
	ObjectKeys(gameState.spymasters).forEach((team) => {
		const index = gameState.spymasters[team].indexOf(actor);
		if (index !== -1) {
			gameState.spymasters[team].splice(index, 1);
		}
	});

	gameState.operatives[action.team].push(actor);
	return { success: true, updatedGameState: gameState };
}
