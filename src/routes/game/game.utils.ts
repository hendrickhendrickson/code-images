import { objectMap } from '../../utils/object.utils';
import type { CardId, ClientGameState, GameState, TeamId } from './game.interface';
import { faker } from '@faker-js/faker';
import { detailImagePixelSize } from './game.consts';

export function indexOfId(id: TeamId | CardId): number {
	return +id.split('_')[1];
}

export function nextTeam(team: TeamId, teamCount: number): TeamId {
	const teamIndex = indexOfId(team);
	return teamIndex === teamCount - 1 ? 'team_0' : `team_${teamIndex + 1}`;
}

export function obfuscateGameState(gameState: GameState): ClientGameState {
	return {
		...gameState,
		board: objectMap(gameState.board, ([_, card]) => ({
			...card,
			teamAssociation: card.revealed ? card.teamAssociation : 'unknown'
		}))
	};
}

function teamNameByIndex(index: number): string {
	if (index === 0) return 'Red';
	if (index === 1) return 'Blue';
	return `No-Name`;
}

export function teamName(team: TeamId): string {
	return `${teamNameByIndex(indexOfId(team))} Team`;
}

export function generateRandomRoomId(): string {
	return `${faker.word.adjective()}-${faker.word.adjective()}-${faker.word.noun()}`;
}

export function generateImageUrl(): string {
	return faker.image.urlPicsumPhotos({ width: detailImagePixelSize, height: detailImagePixelSize });
}
