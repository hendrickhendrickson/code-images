export type GameState = {
    board: Array<CardState>,
    //history: Array<>
}

export type CardState = {
    imageUrl: string,
    teamAssociation:  "innocent" | "assasin" | `agent_${TeamId}`,
    revealed: boolean
    playerGuesses: Array<PlayerId>,
}

export type TeamId = `team_${number}`

export type PlayerId = string

export type ClientGameState = {
    board: Array<ClientCardState>
    points: Record<TeamId, {scored: number, remaining: number, goal: number}>
}

export type ClientCardState = {
    imageUrl: string,
    revealState: "unrevealed" | "innocent" | "assasin" | `agent_${TeamId}`,
    playerGuesses: Array<PlayerId>,
}
