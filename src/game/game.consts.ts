import type { RuleSet } from './game.interface';

export const imagePixelSize = 160;

export const defaultRuleSet: Readonly<RuleSet> = {
	teamCount: 2,
	maxSpymasterCount: 1,
	cardCount: 25,
	assassinCardCount: 1,
	pointsGoalByTeam: { team_0: 8, team_1: 7 },
	autoJoinTeam: true
};

export const playerNameMinimumCharacterLength = 3;
export const playerNameMaximumCharacterLength = 24;
