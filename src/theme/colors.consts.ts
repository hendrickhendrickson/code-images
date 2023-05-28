import type { ClientGameState, TeamId } from '../routes/game/game.interface';

export function teamColor(team: TeamId): string {
	switch (team) {
		case `team_0`:
			return '#f04123';
		case `team_1`:
			return '#0c48c9';
		default:
			return '#bb6611'; // TODO get some colors
	}
}

export function cardColor( // TODO refactor type
	teamAssociation: ClientGameState['board'][keyof ClientGameState['board']]['teamAssociation']
): string | null {
	if (teamAssociation === 'assassin') {
		return '#030303';
	} else if (teamAssociation === 'innocent') {
		return '#cccccc';
	} else if (teamAssociation === 'unknown') {
		return null;
	} else {
		return teamColor(teamAssociation);
	}
}
