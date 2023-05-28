import type { RuleSet } from './game.interface';

export const roles = ['operative', 'spymaster'] as const;

export const defaultRuleSet: Readonly<RuleSet> = {
	teamCount: 2,
	maxSpymasterCount: 1,
	cardCount: 25,
	assassinCardCount: 1,
	pointsGoalByTeam: { team_0: 8, team_1: 7 },
	autoJoinTeam: true,
	codenameValidation: 'DE'
};

export const playerNameMinimumCharacterLength = 3;
export const playerNameMaximumCharacterLength = 24;

export const imagePixelSize = 160; // TODO should this be in here?
