import type { CardId, PlayerId, TeamId } from './game.interface';

export function indexOfId(id: PlayerId | TeamId | CardId): number {
	return +id.split('_')[1];
}

export function typeOfId(id: PlayerId | TeamId | CardId): 'player' | 'team' | 'card' {
	return id.split('_')[0] as 'player' | 'team' | 'card';
}

export function nextTeam(team: TeamId, teamCount: number): TeamId {
	const teamIndex = indexOfId(team);
	return teamIndex === teamCount - 1 ? 'team_0' : `team_${teamIndex + 1}`;
}
