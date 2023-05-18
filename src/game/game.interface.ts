export type GameState = {
	ruleSet: RuleSet;
	phase: 'preparation' | 'cluePending' | 'clueGiven' | 'finished';
	players: Record<PlayerId, Player>;
	operatives: Record<TeamId, Array<PlayerId>>;
	spymasters: Record<TeamId, Array<PlayerId>>;
	board: Record<CardId, CardState>;
	turn: TeamId | null;
	history: Array<HistoryEntry>;
};

export type RuleSet = {
	teamCount: number;
	maxSpymasterCount: number;
	cardCount: number;
	assassinCardCount: number;
	pointsGoalByTeam: Record<TeamId, number>;
};

export type PlayerId = `player_${number}`;

export type Player = {
	id: PlayerId;
	name: string;
};

export type TeamId = `team_${number}`;

export type CardId = `card_${number}`;

export type CardState = {
	id: CardId;
	imageUrl: string;
	teamAssociation: 'innocent' | 'assassin' | `agent_${TeamId}`;
	revealed: boolean;
	playerGuesses: Array<PlayerId>;
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
	codeName: string;
	codeNumber: number;
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
			reason: string;
	  };

export type GameAction =
	| PlayerJoinAction
	| PlayerLeaveAction
	| TeamSwitchAction
	| SpymasterBecomeAction
	| CardPickAction
	| RoundSkipAction
	| ClueGiveAction;

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

export type SpymasterBecomeAction = {
	type: 'SpymasterBecome';
};

export type CardGuessAction = {
	type: 'CardGuess';
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
