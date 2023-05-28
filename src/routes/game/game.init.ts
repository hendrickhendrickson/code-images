import { array, scramble } from '../../utils/array.utils';
import { objectEntries, objectFromEntries } from '../../utils/object.utils';
import { defaultRuleSet, imagePixelSize, roles } from './game.consts';
import type { GameState, RuleSet, TeamId } from './game.interface';

export function initGame(ruleSet?: RuleSet): GameState {
	ruleSet = ruleSet ?? defaultRuleSet;
	return {
		ruleSet,
		phase: 'cluePending',
		players: {},
		teams: objectFromEntries(
			array(ruleSet.teamCount, (index) => [
				`team_${index}`,
				objectFromEntries(roles.map((role) => [`${role}s`, []]))
			])
		),
		board: initBoard(ruleSet),
		turn: `team_0`,
		currentClue: null,
		history: [{ type: 'GameInit', timestamp: Date.now() }]
	};
}

function initBoard(ruleSet: RuleSet): GameState['board'] {
	const board: GameState['board'] = {};

	const cardAssociations: Array<'innocent' | 'assassin' | TeamId> = [];
	for (let i = 0; i < ruleSet.assassinCardCount; i++) {
		cardAssociations.push('assassin');
	}
	objectEntries(ruleSet.pointsGoalByTeam).forEach(([team, points]) => {
		for (let i = 0; i < points; i++) {
			cardAssociations.push(team);
		}
	});
	while (cardAssociations.length < ruleSet.cardCount) {
		cardAssociations.push('innocent');
	}
	scramble(cardAssociations);

	for (let index = 0; index < ruleSet.cardCount; index++) {
		board[`card_${index}`] = {
			id: `card_${index}`,
			imageUrl: generateImageUrl(),
			revealed: false,
			playerMarks: [],
			teamAssociation: cardAssociations[index]
		};
	}
	return board;
}

function generateImageUrl(): string {
	return `https://picsum.photos/seed/${Math.random()}/${imagePixelSize}`;
}
