<script lang="ts">
	import CodeImageCard from './CodeImageCard.svelte';
	import Textfield from '@smui/textfield';
	import TextFieldIcon from '@smui/textfield/icon';
	import Select, { Option } from '@smui/select';
	import Fab, { Icon as FabIcon } from '@smui/fab';
	import { initGame } from './game/game.init';
	import { objectValues } from '../utils/object.utils';
	import { cardColor } from '../theme/colors.consts';

	let codeName = '';
	let codeNameCount = 0;

	let gameState = initGame();

	async function giveClue() {}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<main>
	<div class="grid-container">
		{#each objectValues(gameState.board) as card}
			<CodeImageCard
				disabled={card.revealed}
				playerMarks={card.playerMarks}
				imageUrl={card.imageUrl}
				selfMarked={Math.random() < 0.15}
				markColor="#0c48c9"
				revealedColor={cardColor(card.teamAssociation)}
				on:toggleMark={() => console.log('toggleMark')}
				on:pick={() => console.log('pick')}
			/>
		{/each}
	</div>

	<div class="codename">
		<Textfield variant="outlined" bind:value={codeName} label="Codename" width="600px">
			<TextFieldIcon class="material-icons" slot="leadingIcon">vpn_key</TextFieldIcon>
		</Textfield>
		<Select variant="outlined" bind:value={codeNameCount} label="Codenumber">
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
</main>

<style>
	* :global(.card-media-square) {
		background-image: url(https://placehold.co/320x180?text=square);
	}

	.grid-container {
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
