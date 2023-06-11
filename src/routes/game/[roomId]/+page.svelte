<script lang="ts">
	import CodeImageCard from './image.card.svelte';
	import LoginModal from '../login/login.modal.svelte';
	import Textfield from '@smui/textfield';
	import TextFieldIcon from '@smui/textfield/icon';
	import Select, { Option } from '@smui/select';
	import Fab, { Icon as FabIcon } from '@smui/fab';
	import { objectEntries, objectKeys, objectValues } from '../../../utils/object.utils';
	import { cardColor, teamColor } from '../../../theme/colors.consts';
	import TeamCard from './team.card.svelte';
	import Drawer, { Content as DrawerContent } from '@smui/drawer';
	import { onMount } from 'svelte';
	import { log } from '../../../utils/log.utils';
	import axios from 'axios';
	import type { GameAction, PlayerId } from '../game.interface';
	import { invalidate } from '$app/navigation';
	import Snackbar, { Label, Actions } from '@smui/snackbar';
	import IconButton from '@smui/icon-button';
	import Button from '@smui/button';
	import { playerNameStore } from './playerName.store';
	import { obfuscateGameState, teamName } from '../game.utils';
	import Card, { Content as CardContent } from '@smui/card';
	import List, { Item, Text } from '@smui/list';

	let codename = '';
	let codenumber = '0';

	export let data;

	$: team = (() => {
		if ($playerNameStore && data) {
			return data.gameState.players[$playerNameStore as PlayerId]?.team ?? null;
		}
		return null;
	})();

	$: role = (() => {
		if ($playerNameStore && data) {
			return data.gameState.players[$playerNameStore as PlayerId]?.role ?? null;
		}
		return null;
	})();

	$: clientGameState = role === 'spymaster' ? data.gameState : obfuscateGameState(data.gameState);

	async function subscribe() {
		const sse = new EventSource(`/game/${data.room}`);
		sse.onopen = () => {
			const playerName = $playerNameStore;
			if (playerName) {
				act({
					type: 'PlayerJoin',
					name: playerName
				});
			} else {
				playerNameStore.subscribe((playerName) =>
					act({
						type: 'PlayerJoin',
						name: `${playerName}`
					})
				);
			}
		};
		sse.onerror = (err) => log(err);
		sse.onmessage = () => {
			log('GAMESTATE UPDATE');
			invalidate('gameState');
		};

		return () => sse.close();
	}

	async function act(action: GameAction) {
		const playerName = $playerNameStore;
		if (playerName) {
			const response = await axios.post(`/game/${data.room}/actions`, {
				player: playerName,
				action
			});
			if (response.data !== true) {
				snack(`Error: ${String(response.data)}`);
			}
		} else {
			snack(`Error: not logged in`);
		}
	}

	let snackbarError: Snackbar;
	let snackbarText = '';

	function snack(message: string) {
		snackbarText = message;
		snackbarError.open();
	}

	onMount(subscribe);
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<Snackbar bind:this={snackbarError} labelText={snackbarText} class="demo-error">
	<Label />
	<Actions>
		<IconButton class="material-icons" title="Dismiss">close</IconButton>
	</Actions>
</Snackbar>

<div style="text-align: center;">
	<LoginModal />
</div>
<div class="drawer-container">
	<Drawer>
		<DrawerContent>
			<TeamCard
				teamName={teamName('team_0')}
				points={objectValues(clientGameState.board).filter(
					(card) => card.revealed && card.teamAssociation === 'team_0'
				).length}
				pointsGoal={clientGameState.ruleSet.pointsGoalByTeam['team_0']}
				teamColor={cardColor('team_0')}
				operatives={objectValues(clientGameState.teams['team_0'].operatives)}
				spymasters={objectValues(clientGameState.teams['team_0'].spymasters)}
				player={$playerNameStore ?? ''}
			/>

			{#if team === 'team_0' && role === 'operative' && objectKeys(clientGameState.teams['team_0'].spymasters).length < clientGameState.ruleSet.maxSpymasterCount}
				<Button
					variant="outlined"
					style={`color: ${cardColor('team_0')}`}
					on:click={() => act({ type: 'SpymasterPromote' })}
				>
					<Label>Become Spymaster</Label>
				</Button>
			{/if}
		</DrawerContent>
	</Drawer>

	<main>
		<div class="grid-container">
			{#each objectValues(clientGameState.board) as card}
				{@const selfMarked = !!($playerNameStore && card.playerMarks.includes($playerNameStore))}
				<CodeImageCard
					disabled={card.revealed || role === 'spymaster' || clientGameState.phase !== 'clueGiven'}
					playerMarks={card.playerMarks}
					imageUrl={card.imageUrl}
					{selfMarked}
					markColor={cardColor(clientGameState.turn ?? 'unknown')}
					revealed={card.revealed}
					imageColor={card.revealed ? cardColor(card.teamAssociation) : cardColor('unknown')}
					cardColor={cardColor(card.teamAssociation)}
					on:toggleMark={() => act({ type: 'CardMark', card: card.id, active: !selfMarked })}
					on:pick={() => act({ type: 'CardPick', card: card.id })}
				/>
			{/each}
		</div>

		{#if clientGameState.phase === 'clueGiven'}
			<div class="mdc-typography--headline2" style="text-align: center;">
				{clientGameState.currentClue?.codename + ' ' + clientGameState.currentClue?.codenumber}
			</div>
		{:else if clientGameState.phase === 'cluePending' && team && clientGameState.turn === team && role === 'spymaster'}
			<div class="codename">
				<Textfield variant="outlined" bind:value={codename} label="Codename" width="600px">
					<TextFieldIcon class="material-icons" slot="leadingIcon">vpn_key</TextFieldIcon>
				</Textfield>
				<Select variant="outlined" bind:value={codenumber} label="Codenumber">
					<TextFieldIcon class="material-icons" slot="leadingIcon">numbers</TextFieldIcon>
					{#each ['0', '1', '2', '3', '4', '5'] as integer}
						<Option value={integer}>{integer}</Option>
					{/each}
				</Select>
				<div class="flexy">
					<div class="margins">
						<Fab
							style={`background-color: ${cardColor(team)}`}
							on:click={() =>
								act({ type: 'ClueGive', clue: { codename, codenumber: Number(codenumber) } })}
						>
							<FabIcon class="material-icons">outgoing_mail</FabIcon>
						</Fab>
					</div>
				</div>
			</div>
		{/if}
		{#if clientGameState.phase === 'clueGiven' && team && clientGameState.turn === team && role === 'operative'}
			<div style="text-align: center;">
				<Button
					variant="outlined"
					style={`color: ${cardColor(team)}`}
					on:click={() => act({ type: 'RoundSkip' })}
				>
					<Label>Skip Round</Label>
				</Button>
			</div>
		{/if}

		<div class="card-display">
			<div class="card-container">
				<Card>
					<CardContent component={List}>
						{#each clientGameState.history.sort((a, b) => b.timestamp - a.timestamp) as historyEntry}
							{#if historyEntry.type === 'ClueGive'}
								<Item>
									<Text
										><span
											>{new Date(historyEntry.timestamp).toLocaleTimeString('de-DE') + ' '}</span
										>
										<span
											style={`color: ${cardColor(
												clientGameState.players[historyEntry.actor].team
											)}`}
											>{historyEntry.actor}
										</span>
										gave the clue
										<span
											style={`color: ${cardColor(
												clientGameState.players[historyEntry.actor].team
											)}`}>{`${historyEntry.clue.codename} ${historyEntry.clue.codenumber}`}</span
										></Text
									>
								</Item>
							{:else if historyEntry.type === 'CardPick'}
								<Item>
									<Text
										><span
											>{new Date(historyEntry.timestamp).toLocaleTimeString('de-DE') + ' '}</span
										><span
											style={`color: ${cardColor(
												clientGameState.players[historyEntry.actor].team
											)}`}
											>{historyEntry.actor}
										</span>
										picked
										<span
											style={`color: ${cardColor(
												clientGameState.board[historyEntry.card].teamAssociation
											)}`}
											>{historyEntry.card}
										</span></Text
									>
								</Item>
							{:else if historyEntry.type === 'RoundSkip'}
								<Item>
									<Text
										><span
											>{new Date(historyEntry.timestamp).toLocaleTimeString('de-DE') + ' '}</span
										><span
											style={`color: ${cardColor(
												clientGameState.players[historyEntry.actor].team
											)}`}
											>{historyEntry.actor}
										</span> skipped the round</Text
									>
								</Item>
							{:else if historyEntry.type === 'GameFinished'}
								<Item>
									<Text>{`${historyEntry.winningTeams.join(', ')} won the game`}</Text>
								</Item>
							{/if}
						{/each}
					</CardContent>
				</Card>
			</div>
		</div>
	</main>

	<Drawer>
		<DrawerContent>
			<TeamCard
				teamName={teamName('team_1')}
				points={objectValues(clientGameState.board).filter(
					(card) => card.revealed && card.teamAssociation === 'team_1'
				).length}
				pointsGoal={clientGameState.ruleSet.pointsGoalByTeam['team_1']}
				teamColor={cardColor('team_1')}
				operatives={objectValues(clientGameState.teams['team_1'].operatives)}
				spymasters={objectValues(clientGameState.teams['team_1'].spymasters)}
				player={$playerNameStore ?? ''}
			/>
			{#if team === 'team_1' && role === 'operative' && objectKeys(clientGameState.teams['team_1'].spymasters).length < clientGameState.ruleSet.maxSpymasterCount}
				<Button
					variant="outlined"
					style={`color: ${cardColor('team_1')}`}
					on:click={() => act({ type: 'SpymasterPromote' })}
				>
					<Label>Become Spymaster</Label>
				</Button>
			{/if}
		</DrawerContent>
	</Drawer>
</div>

<style>
	.drawer-container {
		position: relative;
		display: flex;
		justify-content: center;
		gap: 20px;
		border: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
	}
	.grid-container {
		flex-grow: 1;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-template-rows: repeat(5, 1fr);
		gap: 10px; /* Optional - adds spacing between cells */
	}

	.codename {
		display: flex;
		justify-content: center; /* or any other value you prefer */
		margin-top: 20px;
		gap: 10px;
	}
</style>
