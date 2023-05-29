<script lang="ts">
	import Card, { PrimaryAction, Media, MediaContent, Actions, ActionIcons } from '@smui/card';
	import IconButton, { Icon } from '@smui/icon-button';
	import Badge from '@smui-extra/badge';
	import Tooltip, { Wrapper } from '@smui/tooltip';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let disabled = false;
	export let imageUrl: string;
	export let revealedColor: string | null;
	export let playerMarks: Array<string>;
	export let selfMarked: boolean;
	export let markColor: string | null;

	function toggleMark() {
		dispatch('toggleMark');
	}
	function pick() {
		dispatch('pick');
	}
</script>

<div class="card-display">
	<div class="card-container">
		<Card
			style={`max-width: 160px;${revealedColor ? ` background-color: ${revealedColor};` : ``}`}
			variant="outlined"
		>
			{#if playerMarks.length > 0}
				<Badge
					position="middle"
					align="middle-end"
					style={`${markColor ? `background-color: ${markColor};` : ``}`}
					>{playerMarks.length}</Badge
				>
			{/if}
			<PrimaryAction on:click={() => toggleMark()}>
				<Media class="card-media-square" aspectRatio="square">
					<MediaContent>
						<Wrapper>
							<img src={imageUrl} alt="img" />
							<Tooltip xPos="start" yPos="above">{playerMarks.join(', ')}</Tooltip>
						</Wrapper>
					</MediaContent>
				</Media>
			</PrimaryAction>
			<Actions>
				<ActionIcons>
					<IconButton {disabled} on:click={() => toggleMark()} aria-label="Mark" title="Mark">
						{#if selfMarked}
							<Icon class="material-icons" style={`${markColor ? `color: ${markColor};` : ``}`}
								>thumb_up</Icon
							>
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
