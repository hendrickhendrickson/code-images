<script lang="ts">
	import CodeImageCard from './image.card.svelte';
	import LoginModal from '../login/login.modal.svelte';
	import Textfield from '@smui/textfield';
	import TextFieldIcon from '@smui/textfield/icon';
	import Select, { Option } from '@smui/select';
	import Fab, { Icon as FabIcon } from '@smui/fab';
	import { objectValues } from '../../../utils/object.utils';
	import { cardColor } from '../../../theme/colors.consts';
	import PlayerListCard from './playerList.card.svelte';
	import Drawer, { Content } from '@smui/drawer';
	import { onMount } from 'svelte';
	import { log } from '../../../utils/log.utils';
	import axios from 'axios';
	import type {
		CardMarkAction,
		ClueGiveAction,
		PlayerJoinAction,
		SpymasterPromoteAction
	} from '../game.interface';
	import { invalidate } from '$app/navigation';
	import Snackbar, { Label, Actions } from '@smui/snackbar';
	import IconButton from '@smui/icon-button';

	let codename = '';
	let codenumber = 0;

	export let data;

	$: () => {
		console.log(data);
	};

	async function subscribe() {
		await axios.post(`/game/${data.room}/actions`, {
			player: 'player_1337',
			action: {
				type: 'PlayerJoin',
				name: 'player_1337'
			} satisfies PlayerJoinAction
		});

		await axios.post(`/game/${data.room}/actions`, {
			player: 'player_1337',
			action: {
				type: 'SpymasterPromote'
			} satisfies SpymasterPromoteAction
		});

		const sse = new EventSource(`/game/${data.room}`);
		sse.onerror = (err) => log(err);
		sse.onmessage = () => {
			log('GAMESTATE UPDATE');
			invalidate('gameState');
		};
		return () => sse.close();
	}

	async function toggleMark() {
		const response = await axios.post(`/game/${data.room}/actions`, {
			player: 'player_1337',
			action: {
				type: 'CardMark',
				active: Math.random() < 0.5,
				card: 'card_3'
			} satisfies CardMarkAction
		});
		if (response.status < 400) {
			snack(`Error: ${String(response.data)}`);
		}
	}

	async function giveClue() {
		await axios.post(`/game/${data.room}/actions`, {
			player: 'player_1337',
			action: {
				type: 'ClueGive',
				clue: {
					codename,
					codenumber: Number(codenumber)
				}
			} satisfies ClueGiveAction
		});
	}

	function snack(message: string) {
		snackbarText = message;
		snackbarError.open();
	}

	onMount(subscribe);

	let snackbarError: Snackbar;
	let snackbarText = '';
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
		<Content>
			<PlayerListCard
				operatives={objectValues(data.gameState.teams['team_0'].operatives)}
				spymasters={objectValues(data.gameState.teams['team_0'].spymasters)}
			/>
		</Content>
	</Drawer>

	<main>
		<div class="grid-container">
			{#each objectValues(data.gameState.board) as card}
				<CodeImageCard
					disabled={card.revealed}
					playerMarks={card.playerMarks}
					imageUrl={card.imageUrl}
					selfMarked={false}
					markColor="#0c48c9"
					revealedColor={cardColor(card.teamAssociation)}
					on:toggleMark={toggleMark}
					on:pick={() => console.log('pick')}
				/>
			{/each}
		</div>

		{#if data.gameState.phase === 'cluePending'}
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
						<Fab color="primary" on:click={() => giveClue()}>
							<FabIcon class="material-icons">outgoing_mail</FabIcon>
						</Fab>
					</div>
				</div>
			</div>
		{:else if data.gameState.phase === 'clueGiven'}
			{data.gameState.currentClue?.codename + ' ' + data.gameState.currentClue?.codenumber}
		{/if}
	</main>

	<Drawer>
		<Content>
			<PlayerListCard
				operatives={objectValues(data.gameState.teams['team_1'].operatives)}
				spymasters={objectValues(data.gameState.teams['team_1'].spymasters)}
			/>
		</Content>
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
