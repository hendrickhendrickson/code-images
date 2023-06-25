import type { roles } from './game.consts';

export type GameState = {
	ruleSet: RuleSet;
	phase: 'cluePending' | 'clueGiven' | 'finished';
	players: Record<PlayerId, Player>;
	teams: Record<TeamId, Record<`${Role}s`, Array<PlayerId>>>;
	board: Record<CardId, CardState>;
	turn: TeamId | null;
	currentClue: Clue | null;
	history: Array<HistoryEntry>;
};

export type RuleSet = {
	teamCount: number;
	maxSpymasterCount: number;
	cardCount: number;
	assassinCardCount: number;
	pointsGoalByTeam: Record<TeamId, number>;
	codenameValidation: null | CodenameValidationLocal;
};

export type CodenameValidationLocal = 'EN' | 'DE';

export type PlayerId = string; //`player_${string}`;

export type Player = {
	id: PlayerId;
	name: string;
	team: TeamId;
	role: Role | null;
};

export type Role = (typeof roles)[number];

export type TeamId = `team_${number}`;

export type CardId = `card_${number}`;

export type CardState = {
	id: CardId;
	imageUrl: string;
	teamAssociation: 'innocent' | 'assassin' | TeamId;
	revealed: boolean;
	playerMarks: Array<PlayerId>;
};

export type HistoryEntry = { timestamp: number } & (
	| GameInit
	| ClueGive
	| CardPick
	| RoundSkip
	| GameFinished
);

export type GameInit = {
	type: 'GameInit';
};

export type ClueGive = {
	type: 'ClueGive';
	actor: PlayerId;
	clue: Clue;
};

export type Clue = {
	codename: string;
	codenumber: number;
};

export type CardPick = {
	type: 'CardPick';
	actor: PlayerId;
	card: CardId;
};

export type RoundSkip = {
	type: 'RoundSkip';
	actor: PlayerId;
};

export type GameFinished = {
	type: 'GameFinished';
	winningTeams: Array<TeamId>;
};

export type ClientGameState = Omit<GameState, 'board'> & {
	board: Record<
		CardId,
		Omit<CardState, 'teamAssociation'> & {
			teamAssociation: 'unknown' | CardState['teamAssociation'];
		}
	>;
};

export type ActionResult =
	| {
			success: true;
			updatedGameState: GameState;
	  }
	| {
			success: false;
			failReason: string;
	  };

export type GameAction =
	| PlayerJoinAction
	| PlayerLeaveAction
	| TeamSwitchAction
	| SpymasterPromoteAction
	| CardMarkAction
	| CardPickAction
	| ClueGiveAction
	| RoundSkipAction
	| GameResetAction;

export type PlayerJoinAction = {
	type: 'PlayerJoin';
	name: string;
};

export type PlayerLeaveAction = {
	type: 'PlayerLeave';
};

export type TeamSwitchAction = {
	type: 'TeamSwitch';
	team: TeamId;
};

export type SpymasterPromoteAction = {
	type: 'SpymasterPromote';
};

export type CardMarkAction = {
	type: 'CardMark';
	card: CardId;
	active: boolean;
};

export type CardPickAction = {
	type: 'CardPick';
	card: CardId;
};

export type ClueGiveAction = {
	type: 'ClueGive';
	clue: Clue;
};

export type RoundSkipAction = {
	type: 'RoundSkip';
};

export type GameResetAction = {
	type: 'GameReset';
};
