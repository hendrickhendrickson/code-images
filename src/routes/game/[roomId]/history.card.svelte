<script lang="ts">
	import Card, { Content as CardContent } from '@smui/card';
	import List, { Item, Text } from '@smui/list';
	import { cardColor } from '../../../theme/colors.consts';
	import { cardName, teamName } from '../game.utils';
	import type { ClientGameState } from '../game.interface';

	export let clientGameState: ClientGameState;
	export let showTimestamp = false;
</script>

{#if clientGameState.history.length > 0}
	<div class="card-display">
		<div class="card-container">
			<Card>
				<CardContent component={List}>
					{#each clientGameState.history.sort((a, b) => b.timestamp - a.timestamp) as historyEntry}
						{#if historyEntry.type === 'ClueGive'}
							<Item>
								<Text>
									{#if showTimestamp}
										<span>{new Date(historyEntry.timestamp).toLocaleTimeString('de-DE') + ' '}</span
										>
									{/if}
									<span
										style={`color: ${cardColor(clientGameState.players[historyEntry.actor].team)}`}
										>{historyEntry.actor}
									</span>
									gave the clue
									<span
										style={`color: ${cardColor(clientGameState.players[historyEntry.actor].team)}`}
										>{`${historyEntry.clue.codename} ${historyEntry.clue.codenumber}`}</span
									></Text
								>
							</Item>
						{:else if historyEntry.type === 'CardPick'}
							<Item>
								<Text
									>{#if showTimestamp}<span
											>{new Date(historyEntry.timestamp).toLocaleTimeString('de-DE') + ' '}</span
										>{/if}<span
										style={`color: ${cardColor(clientGameState.players[historyEntry.actor].team)}`}
										>{historyEntry.actor}
									</span>
									picked
									<span
										style={`color: ${cardColor(
											clientGameState.board[historyEntry.card].teamAssociation
										)}`}
										>{cardName(historyEntry.card)}
									</span></Text
								>
							</Item>
						{:else if historyEntry.type === 'RoundSkip'}
							<Item>
								<Text
									>{#if showTimestamp}<span
											>{new Date(historyEntry.timestamp).toLocaleTimeString('de-DE') + ' '}</span
										>{/if}<span
										style={`color: ${cardColor(clientGameState.players[historyEntry.actor].team)}`}
										>{historyEntry.actor}
									</span> skipped the round</Text
								>
							</Item>
						{:else if historyEntry.type === 'GameFinished'}
							<Item>
								<Text
									>{#if showTimestamp}<span
											>{new Date(historyEntry.timestamp).toLocaleTimeString('de-DE') + ' '}</span
										>{/if}
									{#each historyEntry.winningTeams as team}
										<span style={`color: ${cardColor(team)}`}>{teamName(team)}</span>
									{/each}
									won the game
								</Text>
							</Item>
						{/if}
					{/each}
				</CardContent>
			</Card>
		</div>
	</div>
{/if}

<style>
</style>
