<script lang="ts">
	import Card, { PrimaryAction, Media, MediaContent, Actions, ActionIcons } from '@smui/card';
	import IconButton, { Icon } from '@smui/icon-button';
	import Badge from '@smui-extra/badge';
	import Tooltip, { Wrapper } from '@smui/tooltip';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let disabled = false;
	export let imageUrl: string;
	export let playerGuesses: Array<string>;
	export let selfGuessed: boolean;

	function toggleGuess() {
		dispatch('toggleGuess');
	}
	function pick() {
		dispatch('pick');
	}
</script>

<div class="card-display">
	<div class="card-container">
		<Card style="max-width: 160px; background-color: #0c48c9;" variant="outlined">
			{#if playerGuesses.length > 0}
				<Badge position="middle" align="middle-end">{playerGuesses.length}</Badge>
			{/if}
			<PrimaryAction on:click={() => toggleGuess()}>
				<Media class="card-media-square" aspectRatio="square">
					<MediaContent>
						<Wrapper>
							<img src={imageUrl} alt="img" />
							<Tooltip xPos="start" yPos="above">{playerGuesses.join(', ')}</Tooltip>
						</Wrapper>
					</MediaContent>
				</Media>
			</PrimaryAction>
			<Actions>
				<ActionIcons>
					<IconButton {disabled} on:click={() => toggleGuess()} aria-label="Guess" title="Guess">
						{#if selfGuessed}
							<Icon class="material-icons" style="color: #f04123">thumb_up</Icon>
						{:else}
							<Icon class="material-icons">thumb_up</Icon>
						{/if}
					</IconButton>
					<IconButton
						{disabled}
						class="material-icons"
						on:click={() => pick()}
						aria-label="Pick"
						title="Pick">touch_app</IconButton
					>
				</ActionIcons>
			</Actions>
		</Card>
	</div>
</div>

<style>
</style>
