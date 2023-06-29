<script lang="ts">
	import CodeImageCard from './image.card.svelte';
	import HistoryCard from './history.card.svelte';
	import LoginModal from '../login/login.modal.svelte';
	import DetailImageModal from './detailImage.modal.svelte';
	import Textfield from '@smui/textfield';
	import TextFieldIcon from '@smui/textfield/icon';
	import Select, { Option } from '@smui/select';
	import Fab, { Icon as FabIcon } from '@smui/fab';
	import { objectKeys, objectValues } from '../../../utils/object.utils';
	import { cardColor, teamColor } from '../../../theme/colors.consts';
	import TeamCard from './team.card.svelte';
	import { onMount } from 'svelte';
	import { log } from '../../../utils/log.utils';
	import axios from 'axios';
	import type { GameAction, PlayerId } from '../game.interface';
	import { invalidate } from '$app/navigation';
	import Snackbar, { Label, Actions } from '@smui/snackbar';
	import IconButton from '@smui/icon-button';
	import Button from '@smui/button';
	import { playerNameStore } from './playerName.store';
	import { cardName, obfuscateGameState, teamName } from '../game.utils';
	import { browser } from '$app/environment';
	import { assert } from '../../../utils/assert.utils';
	import Confetti from '../../../lib/Confetti.svelte';

	let codename = '';
	let codenumber = '0';
	let detailImageUrl: string | null = null;

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

	$: clientGameState =
		role === 'spymaster' || !data.gameState ? data.gameState : obfuscateGameState(data.gameState); // TODO do this on the server

	$: joined = !!($playerNameStore && clientGameState.players[$playerNameStore]);

	$: winningTeams = (() => {
		const gameFinishHistoryEntry = clientGameState.history.find(
			(historyEntry) => historyEntry.type === 'GameFinished'
		);
		if (gameFinishHistoryEntry) {
			assert(gameFinishHistoryEntry.type === 'GameFinished');
			return gameFinishHistoryEntry.winningTeams;
		} else {
			return [];
		}
	})();

	async function subscribe() {
		const sse = new EventSource(`/game/${data.room}`);
		sse.onopen = () => {
			const playerName = $playerNameStore;
			if (!joined && playerName) {
				act({
					type: 'PlayerJoin',
					name: playerName
				});
			}
			playerNameStore.subscribe((playerName) => {
				if (!joined && playerName) {
					act({
						type: 'PlayerJoin',
						name: `${playerName}`
					});
				}
			});
		};
		sse.onerror = (err) => log(err);
		sse.onmessage = () => {
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
	// @ts-ignore
	if (browser) window.act = act;

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

{#if clientGameState.phase === 'finished'}
	<div
		style="
position: fixed;
top: -50px;
left: 0;
height: 100vh;
width: 100vw;
display: flex;
justify-content: center;
overflow: hidden;
pointer-events: none;"
	>
		<Confetti
			x={[-5, 5]}
			y={[0, 0.1]}
			delay={[500, 2000]}
			infinite
			duration={4000}
			amount={350}
			fallDistance="100vh"
			colorArray={[teamColor(winningTeams[0])]}
		/>
	</div>
{/if}

<div style="text-align: center;">
	<LoginModal />
</div>

<div style="text-align: center;">
	<DetailImageModal imageUrl={detailImageUrl} on:close={() => (detailImageUrl = null)} />
</div>

<div class="drawer-container">
	<div style="display: flex; flex-direction: column; gap: 10px">
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
				on:click={() => act({ type: 'SpymasterPromote', targets: 'self' })}
			>
				<Label>Become Spymaster</Label>
			</Button>
		{/if}
		<HistoryCard
			clientGameState={{
				...clientGameState,
				history: clientGameState.history.filter(
					(entry) => 'actor' in entry && clientGameState.players[entry.actor]?.team === 'team_0'
				)
			}}
		/>
	</div>

	<main>
		<div
			class="grid-container"
			style={winningTeams.length === 1 ? `outline: ${teamColor(winningTeams[0])} solid 3px` : ''}
		>
			{#each objectValues(clientGameState.board) as card}
				{@const selfMarked = !!($playerNameStore && card.playerMarks.includes($playerNameStore))}
				<CodeImageCard
					disabled={card.revealed ||
						role === 'spymaster' ||
						clientGameState.phase !== 'clueGiven' ||
						clientGameState.turn !== team}
					cardName={cardName(card.id)}
					playerMarks={card.playerMarks}
					imageUrl={card.imageUrl}
					{selfMarked}
					markColor={cardColor(clientGameState.turn ?? 'unknown')}
					revealed={card.revealed}
					imageColor={card.revealed ? cardColor(card.teamAssociation) : cardColor('unknown')}
					cardColor={cardColor(card.teamAssociation)}
					on:toggleMark={() => act({ type: 'CardMark', card: card.id, active: !selfMarked })}
					on:pick={() => act({ type: 'CardPick', card: card.id })}
					on:viewDetailImage={() => (detailImageUrl = card.imageUrl)}
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

		<HistoryCard {clientGameState} showTimestamp={true} />
	</main>

	<div style="display: flex; flex-direction: column; gap: 10px">
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
				on:click={() => act({ type: 'SpymasterPromote', targets: 'self' })}
			>
				<Label>Become Spymaster</Label>
			</Button>
		{/if}

		<HistoryCard
			clientGameState={{
				...clientGameState,
				history: clientGameState.history.filter(
					(entry) => 'actor' in entry && clientGameState.players[entry.actor]?.team === 'team_1'
				)
			}}
		/>
	</div>
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
		margin-bottom: 10px;
	}

	.codename {
		display: flex;
		justify-content: center; /* or any other value you prefer */
		margin-top: 20px;
		gap: 10px;
	}
</style>
