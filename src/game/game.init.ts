import { ObjectEntries } from '../utils/object/object';
import { defaultRuleSet, imagePixelSize } from './game.consts';
import type { GameState, RuleSet } from './game.interface';

export function initGame(ruleSet?: RuleSet): GameState {
	ruleSet = ruleSet ?? defaultRuleSet;
	return {
		ruleSet: ruleSet,
		phase: 'preparation',
		players: {},
		operatives: {}, // TODO
		spymasters: {}, // TODO
		board: initBoard(ruleSet),
		turn: `team_0`,
		history: [{ type: 'GameInit', timestamp: Date.now() }]
	};
}

function initBoard(ruleSet: RuleSet): GameState['board'] {
	const board: GameState['board'] = {};

	const cardAssociations: Array<'innocent' | 'assassin' | `agent_team_${number}`> = [];
	for (let i = 0; i < ruleSet.assassinCardCount; i++) {
		cardAssociations.push('assassin');
	}
	ObjectEntries(ruleSet.pointsGoalByTeam).forEach(([team, points]) => {
		for (let i = 0; i < points; i++) {
			cardAssociations.push(`agent_${team}`);
		}
	});
	for (let i = 0; i < ruleSet.cardCount - cardAssociations.length; i++) {
		cardAssociations.push('innocent');
	}

	for (let index = 0; index < ruleSet.cardCount; index++) {
		board[`card_${index}`] = {
			id: `card_${index}`,
			imageUrl: generateImageUrl(),
			revealed: false,
			playerGuesses: [],
			teamAssociation: cardAssociations[index]
		};
	}
	return board;
}

function generateImageUrl(): string {
	return `https://picsum.photos/seed/${Math.random()}/${imagePixelSize}`;
}
