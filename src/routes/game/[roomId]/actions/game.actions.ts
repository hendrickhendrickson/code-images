import { deleteElement, scramble } from '../../../../utils/array.utils';
import { assertUnreachable } from '../../../../utils/assert.utils';
import { objectEntries, objectKeys, objectValues } from '../../../../utils/object.utils';
import {
	playerNameMaximumCharacterLength,
	playerNameMinimumCharacterLength
} from '../../game.consts';
import type {
	ActionResult,
	CardMarkAction,
	CardPickAction,
	ClueGiveAction,
	GameAction,
	GameResetAction,
	GameState,
	ImageRegenerateAction,
	PlayerId,
	PlayerJoinAction,
	SpymasterPromoteAction,
	TeamSwitchAction
} from '../../game.interface';
import { generateImageUrl, nextTeam } from '../../game.utils';
import { validateCodename } from '../../codename/codename.validation';
import { initGame } from '../../game.init';
import { timeout } from '../../../../utils/timeout.utils';
import { repeat } from '../../../../utils/function.utils';

export async function handleAction(
	gameState: GameState,
	actor: PlayerId,
	action: GameAction
): Promise<ActionResult> {
	switch (action.type) {
		case 'PlayerJoin':
			return handlePlayerJoin(gameState, actor, action);
		case 'PlayerLeave':
			return handlePlayerLeave(gameState, actor);
		case 'TeamSwitch':
			return handleTeamSwitch(gameState, actor, action);
		case 'SpymasterPromote':
			return handleSpymasterPromote(gameState, actor, action);
		case 'CardMark':
			return handleCardMark(gameState, actor, action);
		case 'CardPick':
			return handleCardPick(gameState, actor, action);
		case 'ClueGive':
			return handleGlueGive(gameState, actor, action);
		case 'RoundSkip':
			return handleRoundSkip(gameState, actor);
		case 'GameReset':
			return handleGameReset(gameState, actor, action);
		case 'TeamsScramble':
			return handleTeamsScramble(gameState, actor);
		case 'ImageRegenerate':
			return handleImageRegenerate(gameState, actor, action);
		default:
			return assertUnreachable(`unknown action type`);
	}
}

export async function handlePlayerJoin(
	gameState: GameState,
	actor: PlayerId,
	action: PlayerJoinAction
): Promise<ActionResult> {
	// action validation
	if (actor in gameState.players) {
		return { success: false, failReason: 'player already in the game' };
	} else if (typeof action.name !== 'string') {
		return { success: false, failReason: 'name not a string' };
	} else if (action.name.length < playerNameMinimumCharacterLength) {
		return {
			success: false,
			failReason: `name not at least ${playerNameMinimumCharacterLength} characters long`
		};
	} else if (action.name.length > playerNameMaximumCharacterLength) {
		return {
			success: false,
			failReason: `name longer than playerNameMaximumCharacterLength characters`
		};
	} else if (Object.values(gameState.players).some((player) => action.name === player.name)) {
		return { success: false, failReason: 'name already taken' };
	}

	// action execution
	const assignedTeam = objectKeys(gameState.teams).reduce((smallestTeam, currentTeam) =>
		objectValues(gameState.teams[currentTeam]).reduce(
			(totalTeamPlayerCount, playerArray) => totalTeamPlayerCount + playerArray.length,
			0
		) <
		objectValues(gameState.teams[smallestTeam]).reduce(
			(totalTeamPlayerCount, playerArray) => totalTeamPlayerCount + playerArray.length,
			0
		)
			? currentTeam
			: smallestTeam
	);

	gameState.players[actor] = {
		id: actor,
		name: action.name,
		team: assignedTeam,
		role: assignedTeam ? 'operative' : null
	};

	if (assignedTeam) {
		gameState.teams[assignedTeam].operatives.push(actor);
	}

	// gameState.history.push({type: ""}) // TODO add history item for player join?

	return { success: true, updatedGameState: gameState };
}

export async function handlePlayerLeave(
	gameState: GameState,
	actor: PlayerId
): Promise<ActionResult> {
	if (!(actor in gameState.players)) {
		return { success: false, failReason: 'player not in the game' };
	}

	const team = gameState.players[actor]?.team;
	if (team) {
		objectValues(gameState.teams[team]).forEach((players) => {
			const index = players.indexOf(actor);
			if (index !== -1) {
				players.splice(index, 1);
			}
		});
	}

	delete gameState.players[actor];

	return { success: true, updatedGameState: gameState };
}

export async function handleTeamSwitch(
	gameState: GameState,
	actor: PlayerId,
	action: TeamSwitchAction
): Promise<ActionResult> {
	// action validation
	if (!(actor in gameState.players)) {
		return { success: false, failReason: 'player not in the game' };
	}

	if (!(action.team in gameState.teams)) {
		return { success: false, failReason: 'teamId does not exist' };
	}

	if (gameState.players[actor].role === 'spymaster') {
		return { success: false, failReason: 'spymaster are not allowed to switch teams' };
	}

	// action execution
	objectKeys(gameState.teams).forEach((team) => {
		objectKeys(gameState.teams[team]).forEach((role) => {
			const index = gameState.teams[team][role].indexOf(actor);
			if (index !== -1) {
				gameState.teams[team][role].splice(index, 1);
			}
		});
	});

	gameState.teams[action.team].operatives.push(actor);
	gameState.players[actor].team = action.team;
	gameState.players[actor].role = 'operative';

	return { success: true, updatedGameState: gameState };
}

export async function handleSpymasterPromote(
	gameState: GameState,
	actor: PlayerId,
	action: SpymasterPromoteAction // TODO USE!!!
): Promise<ActionResult> {
	if (!(actor in gameState.players)) {
		return { success: false, failReason: 'player not in the game' };
	}

	const targets: Array<PlayerId> = [];
	if (action.targets === 'self') {
		targets.push(actor);
	} else if (action.targets === 'random') {
		objectValues(gameState.teams).forEach((roles) => {
			const candidates = [...roles.operatives];
			repeat(gameState.ruleSet.maxSpymasterCount - roles.spymasters.length, () => {
				if (candidates.length > 0) {
					const randomPlayer = candidates.splice(Math.floor(Math.random() * candidates.length), 1);
					targets.push(...randomPlayer);
				}
			});
		});
	} else {
		targets.push(...action.targets);
	}

	targets.forEach((target) => {
		const team = gameState.players[target].team;
		if (!team) {
			return { success: false, failReason: 'player not assigned to a team' };
		}

		if (gameState.players[target].role !== 'operative') {
			return { success: false, failReason: 'player must be operative to become spymaster' };
		}

		if (gameState.teams[team].spymasters.length >= gameState.ruleSet.maxSpymasterCount) {
			return { success: false, failReason: 'team has reached the maximum number of spymasters' };
		}

		deleteElement(gameState.teams[team].operatives, target);

		gameState.teams[team].spymasters.push(target);
		gameState.players[target].role = 'spymaster';
	});

	return { success: true, updatedGameState: gameState };
}

export async function handleCardMark(
	gameState: GameState,
	actor: PlayerId,
	action: CardMarkAction
): Promise<ActionResult> {
	// action validation
	if (!(actor in gameState.players)) {
		return { success: false, failReason: 'player not in the game' };
	}

	if (gameState.players[actor].role !== 'operative') {
		return { success: false, failReason: 'only operatives are allowed to mark' };
	}

	if (gameState.phase !== 'clueGiven') {
		return { success: false, failReason: 'game phase unsuitable for marking' };
	}

	if (!gameState.turn || gameState.turn !== gameState.players[actor].team) {
		return { success: false, failReason: 'it is not actors teams turn' };
	}

	if (!gameState.board[action.card]) {
		return { success: false, failReason: 'unknown card id' };
	}

	if (gameState.board[action.card].revealed) {
		return { success: false, failReason: 'card already revealed' };
	}

	const index = gameState.board[action.card].playerMarks.indexOf(actor);

	if (index !== -1 && action.active) {
		return { success: false, failReason: 'card already marked by actor' };
	}

	if (index === -1 && !action.active) {
		return { success: false, failReason: 'card already not marked by actor' };
	}

	// action execution
	if (index === -1) {
		gameState.board[action.card].playerMarks.push(actor);
	} else {
		deleteElement(gameState.board[action.card].playerMarks, actor);
	}

	return { success: true, updatedGameState: gameState };
}

export async function handleCardPick(
	gameState: GameState,
	actor: PlayerId,
	action: CardPickAction
): Promise<ActionResult> {
	// action validation
	if (!(actor in gameState.players)) {
		return { success: false, failReason: 'player not in the game' };
	}

	if (gameState.players[actor].role !== 'operative') {
		return { success: false, failReason: 'only operatives are allowed to pick cards' };
	}

	if (gameState.phase !== 'clueGiven') {
		return { success: false, failReason: 'game phase unsuitable for picking cards' };
	}

	if (!gameState.turn || gameState.turn !== gameState.players[actor].team) {
		return { success: false, failReason: 'it is not actors teams turn' };
	}

	if (!gameState.board[action.card]) {
		return { success: false, failReason: 'unknown card id' };
	}

	if (gameState.board[action.card].revealed) {
		return { success: false, failReason: 'card already revealed' };
	}

	// action execution
	gameState.board[action.card].revealed = true;
	gameState.board[action.card].playerMarks = [];
	gameState.history.push({ type: 'CardPick', actor, card: action.card, timestamp: Date.now() });
	const cardTeamAssociation = gameState.board[action.card].teamAssociation;
	if (cardTeamAssociation === 'assassin') {
		gameState.phase = 'finished';
		objectValues(gameState.board).forEach((card) => (card.playerMarks = []));
		await timeout(1);
		gameState.history.push({
			type: 'GameFinished',
			winningTeams: objectKeys(gameState.teams).filter((team) => team !== gameState.turn),
			timestamp: Date.now()
		});
	} else if (cardTeamAssociation === 'innocent') {
		gameState.phase = 'cluePending';
		gameState.turn = nextTeam(gameState.turn, gameState.ruleSet.teamCount);
		objectValues(gameState.board).forEach((card) => (card.playerMarks = []));
	} else {
		if (
			objectValues(gameState.board).filter(
				(card) => !card.revealed && card.teamAssociation === cardTeamAssociation
			).length <= 0
		) {
			gameState.phase = 'finished';
			objectValues(gameState.board).forEach((card) => (card.playerMarks = []));
			await timeout(1);
			gameState.history.push({
				type: 'GameFinished',
				winningTeams: [cardTeamAssociation],
				timestamp: Date.now()
			});
		} else if (cardTeamAssociation !== gameState.turn) {
			gameState.phase = 'cluePending';
			gameState.turn = nextTeam(gameState.turn, gameState.ruleSet.teamCount);
			objectValues(gameState.board).forEach((card) => (card.playerMarks = []));
		}
	}

	return { success: true, updatedGameState: gameState };
}

export async function handleGlueGive(
	gameState: GameState,
	actor: PlayerId,
	action: ClueGiveAction
): Promise<ActionResult> {
	// action validation
	if (!(actor in gameState.players)) {
		return { success: false, failReason: 'player not in the game' };
	}

	if (gameState.players[actor].role !== 'spymaster') {
		return { success: false, failReason: 'only spymasters can give clues' };
	}

	if (!gameState.turn || gameState.turn !== gameState.players[actor].team) {
		return { success: false, failReason: 'it is not actors turn' };
	}

	if (gameState.phase !== 'cluePending') {
		return { success: false, failReason: 'game phase unsuitable for giving clue' };
	}

	if (!Number.isSafeInteger(action.clue.codenumber)) {
		return { success: false, failReason: 'codenumber not an integer' };
	}

	if (action.clue.codenumber < 0) {
		return { success: false, failReason: 'negative codenumbers are not allowed' };
	}

	if (
		action.clue.codenumber >
		objectValues(gameState.board).filter(
			(card) => !card.revealed && card.teamAssociation === gameState.players[actor].team
		).length
	) {
		return {
			success: false,
			failReason: 'the maximum codenumber is the number of remaining cards'
		};
	}

	const codenameValidation = await validateCodename(
		action.clue.codename,
		gameState.ruleSet.codenameValidation
	);
	if (codenameValidation === false) {
		return { success: false, failReason: 'codename not allowed' };
	}

	// action execution
	gameState.currentClue = action.clue;
	gameState.phase = 'clueGiven';

	gameState.history.push({ type: 'ClueGive', actor, clue: action.clue, timestamp: Date.now() });

	return { success: true, updatedGameState: gameState };
}

export async function handleRoundSkip(
	gameState: GameState,
	actor: PlayerId
): Promise<ActionResult> {
	// action validation
	if (!(actor in gameState.players)) {
		return { success: false, failReason: 'player not in the game' };
	}

	if (gameState.players[actor].role !== 'operative') {
		return { success: false, failReason: 'only operatives are allowed to skip rounds' };
	}

	if (gameState.phase !== 'clueGiven') {
		return { success: false, failReason: 'game phase unsuitable for round skipping' };
	}

	if (!gameState.turn || gameState.turn !== gameState.players[actor].team) {
		return { success: false, failReason: 'it is not actors teams turn' };
	}

	// action execution
	gameState.phase = 'cluePending';
	gameState.turn = nextTeam(gameState.turn, gameState.ruleSet.teamCount);
	objectValues(gameState.board).forEach((card) => (card.playerMarks = []));

	gameState.history.push({ type: 'RoundSkip', actor, timestamp: Date.now() });

	return { success: true, updatedGameState: gameState };
}

export async function handleGameReset(
	gameState: GameState,
	actor: PlayerId,
	action: GameResetAction
): Promise<ActionResult> {
	// action validation
	if (!(actor in gameState.players)) {
		return { success: false, failReason: 'player not in the game' };
	}

	// action execution
	const newGameState = initGame();
	newGameState.ruleSet = gameState.ruleSet;
	newGameState.players = gameState.players;
	newGameState.teams = gameState.teams;

	if (!action.keepSpymasters) {
		objectValues(newGameState.teams).forEach((roles) => {
			roles.operatives.push(...roles.spymasters.splice(0, roles.spymasters.length));
		});
	}

	return { success: true, updatedGameState: newGameState };
}

export async function handleTeamsScramble(
	gameState: GameState,
	actor: PlayerId
): Promise<ActionResult> {
	// action validation
	if (!(actor in gameState.players)) {
		return { success: false, failReason: 'player not in the game' };
	}

	// action execution
	let operatives: Array<PlayerId> = [];
	objectValues(gameState.teams).forEach((roles) => {
		operatives.push(...roles.operatives.splice(0, roles.operatives.length));
	});

	operatives = scramble(operatives);

	operatives.forEach((operative, index) => {
		const team = `team_${index % gameState.ruleSet.teamCount}` as const;
		gameState.teams[team].operatives.push(operative);
		gameState.players[operative].team = team;
	});

	return { success: true, updatedGameState: gameState };
}

export async function handleImageRegenerate(
	gameState: GameState,
	actor: PlayerId,
	action: ImageRegenerateAction
): Promise<ActionResult> {
	// action validation
	if (!(actor in gameState.players)) {
		return { success: false, failReason: 'player not in the game' };
	}

	// action execution
	action.cards.forEach((card) => {
		if (gameState.board[card]) {
			gameState.board[card].imageUrl = generateImageUrl();
		}
	});

	return { success: true, updatedGameState: gameState };
}
